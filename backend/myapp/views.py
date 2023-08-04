from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Room
from rest_framework import status
from django.db import DatabaseError
import logging

logger = logging.getLogger(__name__)


@api_view(["POST"])
def add_room(request):
    if request.method == "POST":
        try:
            room = Room.objects.create()  # 방 생성
            data = {
                "message": "방 생성 완료!",
                "result": {
                    "room_id": room.id,
                    "created_at": room.created_at,
                    "update_at": room.update_at,
                },
            }
            return Response(data, status=status.HTTP_201_CREATED)
        except DatabaseError as e:
            logger.error("DatabaseError: %s", e)
            return Response(
                {"error": "방 생성 중 문제가 발생했습니다."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        return Response(
            {"error": "허용되지 않은 요청입니다."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
