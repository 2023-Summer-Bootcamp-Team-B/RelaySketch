import os
from celery import Celery

# 기본 장고파일 설정
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
app = Celery("config",
             backend=f"rpc://{os.getenv('AWS_REDIS_HOST', 'redis')}:6379/",
             include=["myapp.tasks"])
app.config_from_object("django.conf:settings", namespace="CELERY")

# 등록된 장고 앱 설정에서 task 불러오기
app.autodiscover_tasks()
