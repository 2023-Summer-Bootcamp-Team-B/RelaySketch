import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.roomid = None
        # 게임 시작 기준, 현재 게임이 진행 됐는지 알 수 있다.
        self.round = 0

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

        #게임 시작 신호 처리
        if event == "startGame":
            # "게임시작" 출력
            print(data)
            # self.round 값을 1 변경
            # 게임을 시작했을 알림
            self.round = 1
            # room에 있는 모든 인원에게 게임을 시작 신호 보냄
            await self.channel_layer.group_send(
                self.roomid,
                {
                    'event': 'gameStart',
                    'data': {
                        'round': round
                    }
                }
            )

    async def some_custom_method(self, event):
        pass
