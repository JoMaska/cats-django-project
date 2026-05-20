import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import ChatMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "chat_global"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        user_id = data["user_id"]

        saved_message = await self.save_message(user_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": saved_message.id,
                "username": saved_message.username,
                "message": saved_message.message,
                "created_at": saved_message.created_at.isoformat(),
            },
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "id": event["id"],
                    "username": event["username"],
                    "message": event["message"],
                    "created_at": event["created_at"],
                }
            )
        )

    @database_sync_to_async
    def save_message(self, user_id, message):
        user = User.objects.get(id=user_id)
        chat_message = ChatMessage.objects.create(user=user, message=message)

        return type(
            "SavedMessage",
            (),
            {
                "id": chat_message.id,
                "username": user.username,
                "message": chat_message.message,
                "created_at": chat_message.created_at,
            },
        )
