from django.http import HttpResponse
import pika


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
