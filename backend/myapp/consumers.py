import json
import asyncio
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room, SubRoom, Topic
from .tasks import create_image, translate_text
import logging

logger = logging.getLogger(__name__)


class RoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.connection_open = False
        self.room_id = None
        self.room_group_name = None
        self.sub_room_id = None
        self.present_sub_room_id = None
        self.last_activity_time = None
        self.ping_interval = 50
        self.timeout = 60
        self.ping_task = None
        self.round = 0
        self.time = None

    async def send(self, text_data=None, bytes_data=None, close=False):
        if not self.connection_open:
            logger.error("WebSocket connection is not open. Skipping send.")
            return

        try:
            await super().send(text_data, bytes_data, close)
        except Exception as e:
            logger.error(f"Failed to send message: {e}")

    async def connect(self, text_data=None):
        if text_data is not None:
            json.loads(text_data)

        self.room_id = self.scope["url_route"]["kwargs"]["roomid"]
        self.room_group_name = "main_room_%s" % self.room_id

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        self.connection_open = True

        self.last_activity_time = time.time()
        self.ping_task = asyncio.create_task(self.send_ping())

        room = await self.get_room_by_id(self.room_id)
        if room is None:
            logger.error("No room with the specified ID found.")
            await self.close(1008)
            return

        sub_room_count = await self.get_subroom_count(room)
        if sub_room_count >= 6:
            error_message = "방이 가득 찼습니다."
            await self.send(text_data=json.dumps({"error": error_message}))
            await self.close(1008)
            return

        sub_room = await sync_to_async(SubRoom.add_subroom)(room)
        self.sub_room_id = sub_room.id

        self.present_sub_room_id = sub_room.id

        await self.send(
            text_data=json.dumps(
                {
                    "event": "connected",
                    "data": {
                        "playerId": sub_room.id,
                    },
                }
            )
        )

        await self.send_player_list()

    async def disconnect(self, close_code):
        if self.ping_task:
            self.ping_task.cancel()

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        self.connection_open = False

        sub_room = await self.get_subroom_by_id(self.sub_room_id)
        if sub_room:
            await sync_to_async(sub_room.delete_subroom)()

        room = await self.get_room_by_id(self.room_id)
        remaining_subrooms_exists = await self.get_remaining_subrooms(room)
        if not remaining_subrooms_exists:
            await sync_to_async(room.delete)()

        await self.send_player_list()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if not self.connection_open:
            logger.error("WebSocket connection is not open. Skipping send.")
            return

        if text_data:
            res = json.loads(text_data)
            event = res.get("event")
            data = res.get("data")
            logger.info(res)

            if event == "nameChanged":
                await self.handle_name_change(data)

            elif event == "startGame":
                self.present_sub_room_id = self.sub_room_id

                self.round = 1
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "start",
                        "message": {"event": "gameStart", "round": self.round},
                    },
                )

            elif event == "inputTitle":
                title = data["title"]
                player_id = data["playerId"]

                # 중복 inputTitle 확인
                last_topic = await sync_to_async(Topic.get_last_topic)(self.present_sub_room_id)
                if last_topic is not None and player_id == last_topic.player_id:
                    return

                room_num = await self.get_room_count()

                await self.save_topic(title, self.present_sub_room_id, player_id)

                room = await self.get_room_by_id(self.room_id)

                room.completeNum += 1
                await sync_to_async(room.save)()

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "make_new_topic",
                        "message": {
                            "event": "completeUpdate",
                            "data": {"completeNum": room.completeNum},
                        },
                    },
                )

                if room_num <= room.completeNum:
                    room.completeNum = 0
                    await sync_to_async(room.save)()

                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "show_loading",
                            "message": {"event": "loading_and_url", "data": "로딩이다."},
                        },
                    )

                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {"type": "ai_image_url", "message": "ai image url 생성"},
                    )

                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {"type": "next_round", "message": "다음 라운드 정보 주거나 게임 종료"},
                    )

            elif event == "changeTitle":
                title = data["title"]

                topic = await sync_to_async(Topic.get_last_topic)(self.present_sub_room_id)

                topic.title = title
                await sync_to_async(topic.save)()

            elif event == "ping":
                self.last_activity_time = time.time()
                logger.info("ping received")
                await self.send(text_data=json.dumps({"event": "pong", "data": "pong"}))

            elif event == "pong":
                self.last_activity_time = time.time()
                logger.info("pong received")

            elif event == "submitTopic":
                await self.handle_topic_submission(data)

            elif event == "wantResult":
                player_id = data["playerId"]
                subroom = await self.get_subroom_by_id(player_id)

                # 게임 결과 데이터 생성
                game_result = await self.generate_game_result(subroom)

                # 클라이언트에게 게임 결과 전송
                await self.send_game_result(game_result)

    async def generate_game_result(self, subroom):
        game_result = []

        topics = await sync_to_async(Topic.objects.filter)(sub_room=subroom, delete_at=None)
        topics = await sync_to_async(list)(topics.order_by("created_at"))

        try:
            for topic in topics:
                # topic 쓴 사람 찾음
                player = await sync_to_async(SubRoom.objects.get)(id=topic.player_id)

                game_result.append({
                    'title': topic.title,
                    'player_name': player.first_player,
                    'img': topic.url,
                })

        except Exception as e:
            # 예외 처리
            print(f"Error: {e}")

        # 결과 반환
        return game_result

    async def send_game_result(self, game_result):
        if game_result:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_result_message',
                    'message': {
                        'game_result': game_result
                    }
                }
            )

    async def game_result_message(self, event):
        game_result = event["message"]
        await self.send(text_data=json.dumps({"event": "gameResult", "data": game_result}))

    async def send_ping(self):
        while True:
            try:
                await self.send(text_data=json.dumps({"event": "ping", "data": "ping"}))
                await asyncio.sleep(self.ping_interval)
                self.last_activity_time = time.time()
                elapsed_time = time.time() - self.last_activity_time
                if elapsed_time > self.timeout:
                    await self.close()
                    break
            except asyncio.CancelledError:
                await self.close()
            except Exception as e:
                logger.error(f"Unexpected error occurred: {e}")
                await self.close()

    async def handle_topic_submission(self, data):
        pass

    async def renew_list(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))

    async def make_new_topic(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))

    async def start(self, event):
        message_content = event["message"]
        self.round = message_content["round"]
        await self.send(text_data=json.dumps(message_content))

    async def show_loading(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))

    async def ai_image_url(self, event):
        topic = await sync_to_async(Topic.get_last_topic)(self.present_sub_room_id)

        translated_result = await sync_to_async(translate_text.delay)(topic.title)

        translated_text = await sync_to_async(translated_result.get)()
        result = await sync_to_async(create_image.delay)(translated_text)

        await self.send(
            text_data=json.dumps({"message": "Image creation started", "task_id": result.id})
        )

        image_url = await sync_to_async(result.get)()
        await self.send(
            text_data=json.dumps({"message": "Image creation completed", "image_url": image_url})
        )

        topic.url = image_url
        await sync_to_async(topic.save)()

    async def next_round(self, event):
        room_num = await self.get_room_count()

        room = await self.get_room_by_id(self.room_id)

        self.round += 1

        if room_num < self.round:
            await self.send(text_data=json.dumps({"event": "end", "data": "게임이 종료 됐습니다."}))
            return
        present_sub_room = await sync_to_async(SubRoom.objects.get)(id=self.present_sub_room_id)
        self.present_sub_room_id = await sync_to_async(present_sub_room.get_next_id)()

        # 다음 이미지 전달
        while True:
            topic = await sync_to_async(Topic.get_last_topic)(self.present_sub_room_id)
            image_url = topic.url
            if image_url is not None:
                break

        await self.send(
            text_data=json.dumps(
                {
                    "event": "moveNextRound",
                    "data": {
                        "round": self.round,
                        "complete": room.completeNum,
                        "url": image_url
                    },
                }
            )
        )

    @sync_to_async
    def get_room_by_id(self, room_id):
        try:
            return Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return None

    @sync_to_async
    def get_subroom_by_id(self, subroom_id):
        try:
            return SubRoom.objects.get(id=subroom_id)
        except SubRoom.DoesNotExist:
            return None

    @sync_to_async
    def get_room_count(self):
        room = Room.objects.get(id=self.room_id)
        room_count = SubRoom.objects.filter(room=room, delete_at=None).count()

        return room_count

    @sync_to_async
    def get_subroom_count(self, room):
        return SubRoom.objects.filter(room=room, delete_at=None).count()

    @sync_to_async
    def get_remaining_subrooms(self, room):
        return SubRoom.objects.filter(room=room, delete_at=None).exists()

    @sync_to_async
    def save_topic(self, title, present_sub_room_id, player_id):
        sub_room = SubRoom.objects.get(id=present_sub_room_id)
        topic = Topic.objects.create(title=title, url=None, player_id=player_id, sub_room=sub_room)
        return topic

    async def handle_name_change(self, data):
        player_id = data.get("playerId")
        new_name = data.get("name")

        sub_room = await self.get_subroom_by_id(player_id)
        if sub_room:
            sub_room.first_player = new_name
            await sync_to_async(sub_room.save)()

            await self.send(text_data=json.dumps({"event": "changeName", "data": "이름 변경 성공"}))

            await self.send_player_list()

    async def send_player_list(self):
        room = await self.get_room_by_id(self.room_id)
        sub_rooms = await sync_to_async(SubRoom.objects.filter)(room=room, delete_at=None)

        players_data = await sync_to_async(
            lambda: [
                {
                    "player_id": subroom.id,
                    "name": subroom.first_player,
                    "isHost": subroom.is_host,
                }
                for subroom in sub_rooms
            ]
        )()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "renew_list",
                "message": {
                    "event": "renewList",
                    "data": {
                        "players": players_data,
                    },
                },
            },
        )
