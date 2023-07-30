import os
import uuid
from celery import shared_task
import openai
import requests
from storages.backends.s3boto3 import S3Boto3Storage
from datetime import datetime
from myapp.models import Room, SubRoom, Topic

openai.api_key = os.getenv("OPENAI_API_KEY")
client_id = os.getenv("NAVER_CLIENT_ID")
client_secret = os.getenv("NAVER_CLIENT_SECRET")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME")


@shared_task
def create_image(title):
    response = openai.Image.create(prompt=title, n=1, size="256x256")
    image_url = response["data"][0]["url"]
    s3_image_url = upload_image_to_s3(image_url, "image")
    return f"https://{AWS_STORAGE_BUCKET_NAME}.s3-{AWS_S3_REGION_NAME}.amazonaws.com/{s3_image_url}"


@shared_task
def translate_text(text):
    url = "https://openapi.naver.com/v1/papago/n2mt"

    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }

    data = {
        "source": "ko",
        "target": "en",
        "text": text,
    }

    response = requests.post(url, headers=headers, data=data)
    response_data = response.json()

    if response.status_code == 200:
        translated_text = response_data["message"]["result"]["translatedText"]
        return translated_text
    else:
        # 처리 실패 시 예외 처리 등을 수행할 수 있습니다.
        raise Exception("Translation failed")


def upload_image_to_s3(image_url, filename):
    from io import BytesIO
    import requests

    response = requests.get(image_url)
    if response.status_code == 200:
        image_data = BytesIO(response.content)
        storage = S3Boto3Storage()
        now = datetime.now().strftime("%Y%m%d%H%M%S")
        random_string = str(uuid.uuid4().hex[:6])
        unique_filename = f"images/{filename}_{now}_{random_string}.png"
        s3_image_url = storage.save(unique_filename, image_data)
        return s3_image_url
    else:
        # 처리 실패 시 예외 처리 등을 수행할 수 있습니다.
        raise Exception("Failed to upload image to S3")


@shared_task
def clear_data():
    for room in Room.objects.all():
        room.hard_delete()
    for sub_room in SubRoom.objects.all():
        sub_room.hard_delete()
    for topic in Topic.objects.all():
        topic.hard_delete()
