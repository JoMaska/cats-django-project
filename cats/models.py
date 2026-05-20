from django.db import models
from django.contrib.auth.models import User


class Hairiness(models.TextChoices):
    BALD = "bald", "Лысый"
    MEDIUM = "medium", "Средний"
    FLUFFY = "fluffy", "Пушистый"


class Cat(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    age = models.IntegerField(verbose_name="Возраст")
    breed = models.CharField(max_length=100, verbose_name="Порода")
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


class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.message}"

    class Meta:
        ordering = ["created_at"]
