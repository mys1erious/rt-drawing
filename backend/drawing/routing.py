from django.urls import re_path

from .consumers import AsyncDrawingConsumer


websocket_urlpatterns = [
    re_path(r"ws/drawing/(?P<room_name>\w+)/$", AsyncDrawingConsumer.as_asgi()),
]
