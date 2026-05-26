from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, verbose_name="О себе")
    avatar = models.ImageField(
        upload_to="avatars/", null=True, blank=True, verbose_name="Аватар"
    )
    website = models.URLField(blank=True, verbose_name="Сайт")
    location = models.CharField(max_length=100, blank=True, verbose_name="Город")

    def __str__(self):
        return f"Профиль {self.user.username}"


class Hairiness(models.TextChoices):
    BALD = "bald", "Лысый"
    MEDIUM = "medium", "Средний"
    FLUFFY = "fluffy", "Пушистый"


class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    message = models.TextField(verbose_name="Сообщение")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    def __str__(self):
        return f"{self.user.username}: {self.message}"

    class Meta:
        ordering = ["created_at"]


class Cat(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    age = models.IntegerField(verbose_name="Возраст")
    breed = models.CharField(max_length=100, blank=True, verbose_name="Порода")
    hairiness = models.CharField(
        max_length=50,
        choices=Hairiness.choices,
        default=Hairiness.MEDIUM,
        verbose_name="Волосатость",
    )
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="cats", verbose_name="Заводчик"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    def __str__(self):
        return self.name


class CatLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    cat = models.ForeignKey(Cat, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "cat")
        verbose_name = "Лайк"
        verbose_name_plural = "Лайки"
