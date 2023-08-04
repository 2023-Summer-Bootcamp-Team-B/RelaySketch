import json
import asyncio
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.core.exceptions import ObjectDoesNotExist

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
        self.timeout = 60
        self.ping_interval = 50
        self.status_interval = 3
        self.ping_task = None
        self.status_task = None
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
        try:
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

        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON: {str(e)}")
            await self.close(1003)
        except Exception as e:
            logger.error(f"Unexpected error occurred: {str(e)}")
            await self.close(1011)

    async def disconnect(self, close_code):
        try:
            if self.ping_task:
                self.ping_task.cancel()

            if self.status_task:
                self.status_task.cancel()

            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            self.connection_open = False

            sub_room = await self.get_subroom_by_id(self.sub_room_id)
            if sub_room:
                await sync_to_async(sub_room.delete_subroom)()

            room = await self.get_room_by_id(self.room_id)
            remaining_subrooms_exists = await self.get_remaining_subrooms(room)
            if not remaining_subrooms_exists and room is not None:
                await sync_to_async(room.delete)()

            await self.send_player_list()
        except Exception as e:
            logger.error(f"An unexpected error occurred during disconnect: {str(e)}")

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
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
                    self.status_task = asyncio.create_task(self.send_status())

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
        except KeyError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"필요한 데이터가 없습니다: {str(e)}"}))
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON: {str(e)}")
        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            await self.send(text_data=json.dumps({"event": "error", "data": f"오류가 발생했습니다: {str(e)}"}))

    async def send_message(self, event):
        try:
            message_content = event["message"]
            await self.send(text_data=json.dumps(message_content))
        except KeyError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"필요한 데이터가 없습니다: {str(e)}"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"오류가 발생했습니다: {str(e)}"}))

    @staticmethod
    async def generate_game_result(subroom):
        game_result = []

        topics = await sync_to_async(Topic.objects.filter)(sub_room=subroom, delete_at=None)
        topics = await sync_to_async(list)(topics.order_by("created_at"))

        try:
            for topic in topics:
                # topic 쓴 사람 찾음
                player = await sync_to_async(SubRoom.objects.get)(id=topic.player_id)

                game_result.append(
                    {
                        "title": topic.title,
                        "player_name": player.first_player,
                        "img": topic.url,
                    }
                )

        except Exception as e:
            # 예외 처리
            print(f"Error: {e}")

        # 결과 반환
        return game_result

    async def send_game_result(self, game_result):
        if game_result:
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "game_result_message", "message": {"game_result": game_result}},
            )

    async def game_result_message(self, event):
        try:
            game_result = event["message"]
            await self.send(text_data=json.dumps({"event": "gameResult", "data": game_result}))
        except KeyError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"필요한 데이터가 없습니다: {str(e)}"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"오류가 발생했습니다: {str(e)}"}))

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

    async def send_status(self):
        while self.round >= 1:
            try:
                print("send status")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "game_progress",
                        "message": {"event": "gameProgress", "data": self.round},
                    },
                )
                await asyncio.sleep(self.status_interval)
            except asyncio.CancelledError:
                print("send status cancelled")
                await self.close()
            except Exception as e:
                logger.error(f"Unexpected error occurred: {e}")
                print("send status error")
                await self.close()

    async def handle_topic_submission(self, data):
        pass

    async def start(self, event):
        try:
            message_content = event["message"]
            self.round = message_content["round"]
            await self.send(text_data=json.dumps(message_content))
        except KeyError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"필요한 데이터가 없습니다: {str(e)}"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"오류가 발생했습니다: {str(e)}"}))

    async def renew_list(self, event):
        await self.send_message(event)

    async def make_new_topic(self, event):
        await self.send_message(event)

    async def show_loading(self, event):
        await self.send_message(event)

    async def image_created_fail(self, event):
        await self.send_message(event)

    async def ai_image_url(self, event):
        try:
            topic = await sync_to_async(Topic.get_last_topic)(self.present_sub_room_id)

            translated_result = await sync_to_async(translate_text.delay)(topic.title)

            translated_text = await sync_to_async(translated_result.get)()
            result = await sync_to_async(create_image.delay)(translated_text)

            await self.send(
                text_data=json.dumps({"message": "Image creation started", "task_id": result.id})
            )

            image_url = await sync_to_async(result.get)()

            if "error" in image_url:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "image_created_fail",
                        "message": {
                            "event": "image_creation_failed",
                            "data": {"error": "AI가 만들 수 없는 주제 입니다."},
                        },
                    },
                )
                return

            await self.send(
                text_data=json.dumps(
                    {"message": "Image creation completed", "image_url": image_url}
                )
            )
            topic.url = image_url
            await sync_to_async(topic.save)()

        except Exception as e:

            error_message = f"An unexpected error occurred: {str(e)}"

            print(error_message)

            try:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "image_created_fail",
                        "message": {
                            "event": "image_creation_failed",
                            "data": {"error": error_message},
                        },
                    },
                )
            except Exception as group_send_error:
                print(f"An error occurred while sending the group message: {group_send_error}")

    async def next_round(self, event):
        try:
            room_num = await self.get_room_count()
            room = await self.get_room_by_id(self.room_id)

            self.round += 1

            if room_num < self.round:
                await self.send(text_data=json.dumps({"event": "end", "data": "게임이 종료 됐습니다."}))
                return

            present_sub_room = await sync_to_async(SubRoom.objects.get)(id=self.present_sub_room_id)
            self.present_sub_room_id = await sync_to_async(present_sub_room.get_next_id)()

            while True:
                topic = await sync_to_async(Topic.get_last_topic)(self.present_sub_room_id)
                image_url = topic.url
                if image_url is not None:
                    break

            await self.send(
                text_data=json.dumps(
                    {
                        "event": "moveNextRound",
                        "data": {"round": self.round, "complete": room.completeNum, "url": image_url},
                    }
                )
            )
        except AttributeError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"속성 에러가 발생했습니다: {str(e)}"}))
        except KeyError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"필요한 데이터가 없습니다: {str(e)}"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"알 수 없는 에러가 발생했습니다: {str(e)}"}))

    @sync_to_async
    def get_room_by_id(self, room_id):
        try:
            return Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return None
        except Exception as e:
            print(f"Unexpected error occurred while getting room by id: {e}")
            return None

    @sync_to_async
    def get_subroom_by_id(self, subroom_id):
        try:
            return SubRoom.objects.get(id=subroom_id)
        except SubRoom.DoesNotExist:
            return None
        except Exception as e:
            print(f"Unexpected error occurred while getting subroom by id: {e}")
            return None

    @sync_to_async
    def get_room_count(self):
        try:
            room = Room.objects.get(id=self.room_id)
            room_count = SubRoom.objects.filter(room=room, delete_at=None).count()
            return room_count
        except ObjectDoesNotExist:
            print("Room does not exist")
            return 0
        except Exception as e:
            print(f"Unexpected error occurred while getting room count: {e}")
            return 0

    @sync_to_async
    def get_subroom_count(self, room):
        try:
            return SubRoom.objects.filter(room=room, delete_at=None).count()
        except Exception as e:
            print(f"Unexpected error occurred while getting subroom count: {e}")
            return 0

    @sync_to_async
    def get_remaining_subrooms(self, room):
        try:
            return SubRoom.objects.filter(room=room, delete_at=None).exists()
        except Exception as e:
            print(f"Unexpected error occurred while checking if remaining subrooms exist: {e}")
            return False

    @sync_to_async
    def save_topic(self, title, present_sub_room_id, player_id):
        try:
            sub_room = SubRoom.objects.get(id=present_sub_room_id)
            topic = Topic.objects.create(title=title, url=None, player_id=player_id, sub_room=sub_room)
            return topic
        except ObjectDoesNotExist:
            print("SubRoom does not exist")
            return None
        except Exception as e:
            print(f"Unexpected error occurred while saving topic: {e}")
            return None

    async def game_progress(self, event):
        error_message = "게임이 이미 시작되어 참가할 수 없습니다."
        print("group send")
        if self.round == 0:
            print("에러")
            await self.send(
                text_data=json.dumps(
                    {
                        "event": "error",
                        "data": {"error": error_message},
                    }
                )
            )
            await self.close(1008)
            return

    async def handle_name_change(self, data):
        try:
            player_id = data.get("playerId")
            new_name = data.get("name")

            # 현재 룸 있는 플레이어 수
            room = await self.get_room_by_id(self.room_id)
            subroom_count = await self.get_subroom_count(room)

            sub_room = await self.get_subroom_by_id(player_id)

            if sub_room:
                sub_room.first_player = new_name
                await sync_to_async(sub_room.save)()
                await self.send(text_data=json.dumps({"event": "changeName", "data": "이름 변경 성공"}))
            if subroom_count > 1:
                await self.send_player_list()
        except KeyError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"필요한 데이터가 없습니다: {e}"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"오류가 발생했습니다: {str(e)}"}))

    async def send_player_list(self):
        try:
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
        except AttributeError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"속성 에러가 발생했습니다: {str(e)}"}))
        except KeyError as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"필요한 데이터가 없습니다: {str(e)}"}))
        except Exception as e:
            await self.send(text_data=json.dumps({"event": "error", "data": f"알 수 없는 에러가 발생했습니다: {str(e)}"}))
