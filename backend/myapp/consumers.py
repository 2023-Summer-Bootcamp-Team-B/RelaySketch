import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Room, SubRoom


class RoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_id = None
        self.room_group_name = None
        self.sub_room_id = None

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

    async def renew_list(self, event):
        message_content = event["message"]

        await self.send(text_data=json.dumps(message_content))
