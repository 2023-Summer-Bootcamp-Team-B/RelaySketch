import json
import asyncio
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room, SubRoom, Topic

class RoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_id = None
        self.room_group_name = None
        self.sub_room_id = None
        self.last_activity_time = None
        self.ping_interval = 5  # 핑 메시지 전송 간격 (초)
        self.timeout = 10  # 연결 타임아웃 시간 (초)
        self.ping_task = None

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['roomid']
        self.room_group_name = 'main_room_%s' % self.room_id

        # 웹소켓 연결을 활성화하며 유저를 방에 참가시킴
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        self.last_activity_time = time.time()
        self.ping_task = asyncio.ensure_future(self.send_ping())

        # 서브 게임방 생성 로직
        room = await sync_to_async(Room.objects.get)(id=self.room_id)
        sub_room_count = await sync_to_async(SubRoom.objects.filter(room=room, delete_at=None).count)()

        if sub_room_count >= 6:
            error_message = '방이 가득 찼습니다.'
            await self.send(text_data=json.dumps({'error': error_message}))
            await self.close(1008)
            return

        sub_room = await sync_to_async(SubRoom.add_subroom)(room)  # 방 생성
        self.sub_room_id = sub_room.id

        await self.send(text_data=json.dumps({
            'event': 'connected',
            'data': {
                'playerId': sub_room.id,
            }
        }))

        # 서브룸을 전부 가져오는 로직을 구현한 뒤, 해당 데이터를 전송합니다.
        sub_rooms = await sync_to_async(SubRoom.objects.filter)(room=room, delete_at=None)

        players_data = await sync_to_async(
            lambda: [
                {
                    'id': subroom.id,
                    'name': subroom.first_player,
                    'isHost': subroom.is_host,
                }
                for subroom in sub_rooms
            ]
        )()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'renew_list',
                'message': {
                    'event': 'renewList',
                    'data': {
                        'players': players_data,
                    },
                },
            }
        )

    async def disconnect(self, close_code):
        if self.ping_task:
            self.ping_task.cancel()

        # 서브 게임방 테이블을 삭제
        sub_room = await sync_to_async(SubRoom.objects.get)(id=self.sub_room_id)
        if sub_room:
            await sync_to_async(sub_room.delete_subroom)()

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
                    'id': subroom.id,
                    'name': subroom.first_player,
                    'isHost': subroom.is_host,
                }
                for subroom in sub_rooms
            ]
        )()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'renew_list',
                'message': {
                    'event': 'renewList',
                    'data': {
                        'players': players_data,
                    },
                },
            }
        )

        # 웹소켓 연결을 비활성화하며 유저를 방 그룹에서 제거
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        res = json.loads(text_data)
        event = res.get('event')
        data = res.get('data')

        if event == 'ping':
            print('ping received')
            await self.send(text_data=json.dumps({
                'event': 'pong',
                'data': 'pong'
            }))
            self.last_activity_time = time.time()
        elif event == 'pong':
            print('pong received')
            self.last_activity_time = time.time()
        elif event == 'submitTopic':
            await self.handle_topic_submission(data)

    async def send_ping(self):
        while True:
            try:
                await self.send(text_data=json.dumps({
                    'event': 'ping',
                    'data': 'ping'
                }))
                await asyncio.sleep(self.ping_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                # 에러 처리 (예: 연결이 끊어짐)
                break

            if self.last_activity_time is not None:
                elapsed_time = time.time() - self.last_activity_time
                if elapsed_time > self.timeout:
                    await self.close()
                    print('연결이 타임아웃되었습니다.')
                    break

    async def handle_topic_submission(self, data):
        # 주제 제출 처리 로직 작성
        pass

    async def renew_list(self, event):
        message_content = event['message']
        await self.send(text_data=json.dumps(message_content))