from channels.generic.websocket import AsyncWebsocketConsumer


class SomeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        pass

    async def some_custom_method(self, event):
        pass
