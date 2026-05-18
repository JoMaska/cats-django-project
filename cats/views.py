from rest_framework import viewsets
from .models import Cat
from .serializers import CatSerializer

class CatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cat.objects.all()
    serializer_class = CatSerializer