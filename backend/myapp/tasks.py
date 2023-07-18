import os
from celery import shared_task
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")


@shared_task
def create_image(title):
    response = openai.Image.create(prompt=title, n=1, size="256x256")
    image_url = response["data"][0]["url"]
    return image_url
