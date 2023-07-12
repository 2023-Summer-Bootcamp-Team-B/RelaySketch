from django.urls import re_path, path
from . import consumers, views

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<roomid>\d+)/$', consumers.RoomConsumer.as_asgi()),
]

urlpatterns = [
    # REST API URL 패턴
    path('api/send_message/', views.send_message, name="send_message"),
    path('api/add_room/', views.add_room, name="add_room"),
]
