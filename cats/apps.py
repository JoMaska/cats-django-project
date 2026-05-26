from django.apps import AppConfig


class CatsConfig(AppConfig):
    name = "cats"
    def ready(self):
            import cats.signals