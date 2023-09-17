import json

from channels.generic.websocket import AsyncWebsocketConsumer

from drawing.constants import ACTIONS


class AsyncDrawingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"drawing_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data_json = json.loads(text_data)
        action = data_json.get('action')

        if action in ACTIONS:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'drawing.data',
                    'action': action,
                    'data': data_json.get('data', {})
                }
            )

    async def drawing_data(self, event):
        data = event.get('data')
        action = event.get('action')
        await self.send(text_data=json.dumps({
            'action': action,
            'data': data
        }))
