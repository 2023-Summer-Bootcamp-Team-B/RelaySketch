import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.roomid = None

    async def connect(self):
        self.roomid = self.scope['url_route']['kwargs']['roomid']
        await self.accept()
        print(f'WebSocket 연결 성공! Room ID: {self.roomid}')

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        res = json.loads(text_data)
        event = res.get('event')
        data = res.get('data')

    async def some_custom_method(self, event):
        pass
