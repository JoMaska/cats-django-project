from rest_framework import serializers
from .models import Cat, ChatMessage


class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = ["id", "name", "age", "breed", "hairiness", "created_at"]


class ChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "username", "message", "created_at"]
        read_only_fields = ["id", "username", "created_at"]
