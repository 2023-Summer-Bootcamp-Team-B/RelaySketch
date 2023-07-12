from django.http import HttpResponse
import pika
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Room

# Create your views here.
def send_message(request):
    credentials = pika.PlainCredentials("admin", "admin")
    parameters = pika.ConnectionParameters("172.30.1.9", 5672, "/", credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    # 큐 생성
    channel.queue_declare(queue="my_queue")

    # 메시지 전송
    channel.basic_publish(exchange="", routing_key="my_queue", body="Hello, RabbitMQ!".encode())

    # 연결 종료
    connection.close()

    return HttpResponse("Message sent to RabbitMQ!")

@api_view(['POST'])
def add_room(request):
    if request.method == 'POST':
        room = Room.objects.create()  # 방 생성
        data = {
            "message": "방 생성 완료!",
            "result": {
                "room_id": room.id,
                "created_at": room.created_at,
                "update_at": room.update_at,
            },
        }
        return Response(data)