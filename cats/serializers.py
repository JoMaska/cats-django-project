from rest_framework import serializers
from .models import Cat, CatLike, ChatMessage, UserProfile


class CatSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    breed_name = serializers.CharField(source="breed", read_only=True)

    class Meta:
        model = Cat
        fields = [
            "id",
            "name",
            "age",
            "breed",
            "breed_name",
            "hairiness",
            "owner",
            "owner_username",
            "created_at",
            "likes_count",
            "is_liked",
        ]
        read_only_fields = ["owner", "created_at"]

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class ChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ChatMessage
        fields = ["id", "username", "message", "created_at"]
        read_only_fields = ["id", "username", "created_at"]


class CatLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatLike
        fields = ["id", "cat", "created_at"]


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "username", "email", "bio", "avatar", "website", "location"]
