from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Cat, CatLike, UserProfile
from .serializers import CatSerializer, UserProfileSerializer
from .permissions import IsOwnerOrReadOnly
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from django.db.models import Count


class UserProfileViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.UpdateModelMixin,
):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserProfile.objects.all()

    def get_object(self):
        return self.request.user.profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"], password=validated_data["password"]
        )
        return user


class RegisterViewSet(ViewSet):
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"username": user.username, "id": user.id},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CatViewSet(viewsets.ModelViewSet):
    serializer_class = CatSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cat.objects.filter(owner=self.request.user).annotate(
                likes_count=Count("likes")
            )
        return Cat.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        try:
            cat = Cat.objects.annotate(likes_count=Count("likes")).get(pk=pk)
        except Cat.DoesNotExist:
            return Response({"status": "cat not found"}, status=404)

        like, created = CatLike.objects.get_or_create(user=request.user, cat=cat)
        if not created:
            return Response({"status": "already liked"}, status=400)
        return Response({"status": "liked", "likes_count": cat.likes_count})

    @action(detail=True, methods=["post"])
    def unlike(self, request, pk=None):
        try:
            cat = Cat.objects.annotate(likes_count=Count("likes")).get(pk=pk)
        except Cat.DoesNotExist:
            return Response({"status": "cat not found"}, status=404)

        CatLike.objects.filter(user=request.user, cat=cat).delete()
        return Response({"status": "unliked", "likes_count": cat.likes_count})


class ChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.all()


class PublicCatViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CatSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Cat.objects.all().annotate(likes_count=Count("likes"))

        owner = self.request.query_params.get("owner")
        if owner:
            queryset = queryset.filter(owner__username__icontains=owner)

        hairiness = self.request.query_params.get("hairiness")
        if hairiness:
            queryset = queryset.filter(hairiness=hairiness)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)

        ordering = self.request.query_params.get("ordering", "-created_at")
        if ordering == "-likes_count":
            queryset = queryset.order_by("-likes_count")
        elif ordering == "likes_count":
            queryset = queryset.order_by("likes_count")
        else:
            queryset = queryset.order_by(ordering)

        return queryset
