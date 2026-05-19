from django.contrib import admin
from .models import Cat


@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "age", "breed", "hairiness", "owner", "created_at"]
    list_filter = ["hairiness", "owner"]
    search_fields = ["name", "breed"]
