from rest_framework import serializers
from .models import Cat

class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = ['id', 'name', 'age', 'breed', 'hairiness', 'created_at']