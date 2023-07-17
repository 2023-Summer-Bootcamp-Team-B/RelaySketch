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
        self.last_activity_time = None
        self.ping_interval = 5  # 핑 메시지 전송 간격 (초)
        self.timeout = 10  # 연결 타임아웃 시간 (초)
        self.ping_task = None
        self.additional_time = 10  # 추가 시간 (초)
        self.subroom_id = None
        self.topic_timer = None
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['roomid']
        await self.accept()
        print(f'WebSocket 연결 성공! Room ID: {self.room_id}')
        self.last_activity_time = time.time()
        self.ping_task = asyncio.ensure_future(self.send_ping())
    async def disconnect(self, close_code):
        if self.ping_task:
            self.ping_task.cancel()
        if self.topic_timer:
            self.topic_timer.cancel()
        # 연결 종료 시 처리할 로직 작성
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
        subroom_id = data.get("playerId")
        topic_title = data.get("topicTitle")
        if not subroom_id or not topic_title:
            return
        try:
            # 해당하는 SubRoom 객체와 Topic 객체 생성
            subroom = await sync_to_async(SubRoom.objects.get)(id=subroom_id)
            topic = await sync_to_async(Topic.objects.create)(title=topic_title, sub_room=subroom)
            # 주제 제출 알림을 방에 속한 모든 클라이언트에게 보냄
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "topic_submitted",
                    "message": {
                        "event": "topicSubmitted",
                        "data": {
                            "playerId": subroom.id,
                            "topicTitle": topic.title,
                        },
                    },
                },
            )
            # 주제를 제출한 후 타이머 초기화
            if self.topic_timer:
                self.topic_timer.cancel()
            self.topic_timer = asyncio.ensure_future(self.force_submission(subroom))
            self.subroom_id = subroom_id  # 주제 제출한 플레이어의 subroom_id 저장
        except SubRoom.DoesNotExist:
            pass
    async def force_submission(self, subroom):
        try:
            # 추가 시간만큼 대기
            await asyncio.sleep(self.additional_time)
            # 주제를 입력하지 않았으면 연결 해제
            topic_count = await sync_to_async(Topic.objects.filter)(sub_room=subroom).count()
            if topic_count == 0:
                await self.disconnect(1000)
                # 추가 시간 만료 시, 다음 서브룸으로 연결 및 해당 서브룸 삭제
                next_subroom = await sync_to_async(SubRoom.objects.filter)(
                    room=subroom.room,
                    is_host=False,
                    delete_at=None
                ).order_by('created_at').first()
                if next_subroom:
                    next_subroom.is_host = True
                    await sync_to_async(next_subroom.save)()
                await sync_to_async(subroom.delete_subroom)()
                # 프론트엔드에 메시지 전송
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "add_time_discount",
                        "message": {
                            "event": "add_time_discount",
                            "data": {
                                "players": [
                                    {
                                        "id": subroom.id,
                                        "name": subroom.first_player,
                                        "isHost": subroom.is_host,
                                    }
                                ],
                            },
                        },
                    },
                )
        except asyncio.CancelledError:
            pass
    async def add_time_discount(self, event):
        # 추가 시간 정보를 프론트엔드에 전송
        message_content = event["message"]
        await self.send(text_data=json.dumps(message_content))