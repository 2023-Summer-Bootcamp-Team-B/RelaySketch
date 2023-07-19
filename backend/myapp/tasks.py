import os
from celery import shared_task
import openai
import requests

openai.api_key = os.getenv("OPENAI_API_KEY")
client_id = os.getenv("NAVER_CLIENT_ID")
client_secret = os.getenv("NAVER_CLIENT_SECRET")


@shared_task
def create_image(title):
    response = openai.Image.create(prompt=title, n=1, size="256x256")
    image_url = response["data"][0]["url"]
    return image_url


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
