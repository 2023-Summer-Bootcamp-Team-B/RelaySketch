import os
from celery import shared_task
import openai
import requests
from openai import InvalidRequestError
from celery import chain

openai.api_key = os.getenv("OPENAI_API_KEY")
client_id = os.getenv("NAVER_CLIENT_ID")
client_secret = os.getenv("NAVER_CLIENT_SECRET")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME")


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


@shared_task(bind=True, max_retries=3)
def create_image(self, title):
    try:
        response = openai.Image.create(prompt=title, n=1, size="256x256")
        image_url = response["data"][0]["url"]
        return image_url
    except InvalidRequestError as e:
        error_message = f"OpenAI API returned an error: {e}."
        print(error_message)
        return {'error': error_message}
    except Exception as e:
        # Handle other exceptions
        print(f"An unexpected error occurred: {e}")
        return {'error': str(e)}


@shared_task(bind=True)
def upload_image_to_s3(self, image_url):
    try:
        s3_image_url = upload_image_to_s3(image_url, "image")
        return f"https://{AWS_STORAGE_BUCKET_NAME}.s3-{AWS_S3_REGION_NAME}.amazonaws.com/{s3_image_url}"
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {'error': str(e)}


@shared_task
def chain_process(text):
    chain(translate_text.s(text), create_image.s(), upload_image_to_s3.s()).apply_async()
