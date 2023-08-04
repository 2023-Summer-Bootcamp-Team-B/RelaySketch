from django.urls import re_path, path
from . import consumers, views

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<roomid>\d+)/$', consumers.RoomConsumer.as_asgi()),
]

urlpatterns = [
    path('api/add_room/', views.add_room, name="add_room"),
]
