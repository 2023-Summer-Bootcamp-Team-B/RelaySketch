import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Room, SubRoom, Topic


class RoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_id = None
        self.room_group_name = None
        self.sub_room_id = None
        self.round = 0
        # 게임중 자신이 주제를 넣고 있는 subroom
        self.present_sub_room = None

    async def connect(self, text_data=None):
        if text_data is not None:
            json.loads(text_data)

        self.room_id = self.scope["url_route"]["kwargs"]["roomid"]
        self.room_group_name = "main_room_%s" % self.room_id

        room = await sync_to_async(Room.objects.get)(id=self.room_id)

        # 웹소켓 연결을 활성화하며 유저를 방에 참가시킴
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        sub_room_count = await sync_to_async(SubRoom.objects.filter(room=room, delete_at=None).count)()

        if sub_room_count >= 6:
            error_message = "방이 가득 찼습니다."
            await self.send(text_data=json.dumps({"error": error_message}))
            await self.close(1008)
            return

        # 서브 게임방 테이블을 만들어요
        sub_room = await sync_to_async(SubRoom.add_subroom)(room)  # 방 생성
        self.sub_room_id = sub_room.id

        await self.send(text_data=json.dumps({
            "event": "connected",
            "data": {
                "playerId": sub_room.id,
            }
        }))

        # 서브룸을 전부 가져오는 로직을 구현한 뒤, 해당 데이터를 전송합니다.
        sub_rooms = await sync_to_async(SubRoom.objects.filter)(room=room, delete_at=None)

        players_data = await sync_to_async(
            lambda: [
                {
                    "id": subroom.id,
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
            }
        )

    async def disconnect(self, close_code):
        # 서브 게임방 테이블을 삭제
        subroom = await sync_to_async(SubRoom.objects.get)(id=self.sub_room_id)
        if subroom:
            await sync_to_async(subroom.delete_subroom)()

        # 서브 게임방이 비어있으면 메인 게임방 테이블을 삭제
        room = await sync_to_async(Room.objects.get)(id=self.room_id)
        remaining_subrooms_exists = await sync_to_async(SubRoom.objects.filter(room=room, delete_at=None).exists)()
        if not remaining_subrooms_exists:
            await sync_to_async(room.delete)()

        # 서브룸을 전부 가져오는 로직을 구현한 뒤, 해당 데이터를 전송합니다.
        sub_rooms = await sync_to_async(SubRoom.objects.filter)(room=room, delete_at=None)

        players_data = await sync_to_async(
            lambda: [
                {
                    "id": subroom.id,
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
            }
        )

        # 웹소켓 연결을 비활성화하며 유저를 방 그룹에서 제거
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data:
            res = json.loads(text_data)
            message = res.get('message')
            data = res.get('data')
            # 게임을 시작을 알림
            if message == "startGame":
                # self.round 값을 1 변경
                self.round = 1
                # 현재 연결된 subroom 초기화
                self.present_sub_room = await sync_to_async(SubRoom.objects.get)(id=self.sub_room_id)
                # room에 있는 모든 인원에게 게임을 시작 신호 보냄
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'start',
                        'message': {
                            'event': 'gameStart',
                            'data': {
                                'round': self.round
                            }
                        }
                    }
                )
            # subroom의 주제 입력 이벤트
            elif message == "inputTitle":
                title = data["title"]
                playerId = data["playerId"]

                # 현재 룸안에 모든 인원
                roomNum = await self.get_room_count()
                # 주제 객체 만듬
                await self.save_topic(title, playerId)
                # room 가지고 옴
                room = await sync_to_async(Room.objects.get)(id=self.room_id)
                # completeNum 1 더함
                room.completeNum += 1
                await sync_to_async(room.save)()
                # 모든 인원에게 completeNum 보내줌
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'make_new_topic',
                        'message': {
                            "event": "completeUpdate",
                            "data": {
                                "completeNum": room.completeNum
                            }
                        }
                    }
                )
                # 라운드 변경
                # 1. room 인원수 == 완료 인원수
                if roomNum == room.completeNum:
                    room.completeNum = 0
                    await sync_to_async(room.save)()
                    #print(room.completeNum)
                # 2. group_send로 로딩 화면 출력 시키라고 함
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'next_round',
                            'message': {
                                "event": "loading",
                                "data": "로딩중 입니다."
                            }
                        }
                    )
                # 3. rebbitMQ함수 실행(AI image url 추가 됨)
                # 4. round에 1 더해줌
                # 5. room 인원수 < round
                # 5-1. 게임 종료 group_send 함
                # 6. present_sub_room을 현재 subroom의 next_sub_room으로 변경
                # 7. completeNum = 0으로 변경
                # 8. present_sub_room에서 가장 최근 topic의 url 가지고 옴
                # 9. round, url, completeNum 내용을 담은 send

            # 주제 편집 (가장 최신으로 만들어진 것을 변경함)
            elif message == "changeTitle":
                title = data["title"]
                playerId = data["playerId"]
                # player id에 있는 가장 최신에 topic을 찾음
                subroom = await sync_to_async(SubRoom.objects.get)(id=self.sub_room_id)
                topic = await sync_to_async(Topic.get_last_topic)(subroom)
                # topic의 title을 data에 있는 title로 바꿔줌
                #print(topic.title)
                topic.title = title
                await sync_to_async(topic.save)()
                #print(topic.title)

    async def renew_list(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))

    async def make_new_topic(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))

    async def start(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))

    async def next_round(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))

    @sync_to_async
    def get_room_count(self):
        room = Room.objects.get(id=self.room_id)
        roomCount = SubRoom.objects.filter(room=room, delete_at=None).count()

        return roomCount
    @sync_to_async
    def save_topic(self, title, playerId):
        #subRoom 찾음
        subRoom = SubRoom.objects.get(id=playerId)
        Topic.objects.create(title=title, url=None, sub_room=subRoom)

