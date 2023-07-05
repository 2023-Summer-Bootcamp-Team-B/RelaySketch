from django.http import HttpResponse
from django.shortcuts import render
import pika


# Create your views here.
def send_message(request):
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    # 큐 생성
    channel.queue_declare(queue="my_queue")

    # 메시지 전송
    channel.basic_publish(exchange="", routing_key="my_queue", body="Hello, RabbitMQ!")

    # 연결 종료
    connection.close()

    return HttpResponse("Message sent to RabbitMQ!")
