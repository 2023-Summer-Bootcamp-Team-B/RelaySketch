import os
import sys
from dotenv import load_dotenv
from pathlib import Path
from celery.schedules import crontab
import pymysql

pymysql.install_as_MySQLdb()

BASE_DIR = Path(__file__).resolve().parent.parent

dotenv_file = os.path.join(BASE_DIR, "..", ".env")

load_dotenv(dotenv_file)

SECRET_KEY = os.getenv("SECRET_KEY")

RABBITMQ_DEFAULT_USER = os.getenv("RABBITMQ_DEFAULT_USER")
RABBITMQ_DEFAULT_PASS = os.getenv("RABBITMQ_DEFAULT_PASS")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "django": {
        "handlers": ["console"],
        "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
    },
}

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "[::1]",
    "django",
    "15.165.125.132",
    "relaysketch.online",
    "www.relaysketch.online",
    "43.202.134.227",
    "15.164.3.18",
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "channels",
    "corsheaders",
    "myapp",
    "gunicorn",
    "uvicorn",
    "django_prometheus",
    "django_celery_beat",
    "django_celery_results",
    "storages",
    "drf_yasg",
]

MIDDLEWARE = [
    "django_prometheus.middleware.PrometheusBeforeMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django_prometheus.middleware.PrometheusAfterMiddleware",
]

APPEND_SLASH = False

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

ASGI_APPLICATION = "config.asgi.application"

BROKER_URL = f"amqp://{RABBITMQ_DEFAULT_USER}:{RABBITMQ_DEFAULT_PASS}@rabbitmq"

if os.getenv("USE_SQLITE", "false") == "true":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": ":memory:",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": os.getenv("DB_DATABASE"),
            "USER": os.getenv("DB_USERNAME"),
            "PASSWORD": os.getenv("DB_USER_PASSWORD"),
            "HOST": os.getenv("DB_HOST"),
            "PORT": "3306",
            "CONN_MAX_AGE": 60,
            "OPTIONS": {
                "init_command": "SET sql_mode=''",
            },
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Seoul"

USE_I18N = True

USE_TZ = False

STATIC_URL = f"https://{AWS_STORAGE_BUCKET_NAME}.s3-{AWS_S3_REGION_NAME}.amazonaws.com/"

STATIC_ROOT = os.path.join(BASE_DIR, "static")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(os.getenv("AWS_REDIS_HOST", "redis"), 6379)],
        },
    },
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost",
    "http://15.165.125.132",
    "https://www.relaysketch.online",
    "https://relaysketch.online",
    "http://43.202.134.227:3000",
    "http://15.164.3.18:3000",
]

CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)

CORS_ALLOW_METHODS = ("POST",)

PROMETHEUS_METRICS_EXPORT_PORT_RANGE = range(8001, 8050)

PROMETHEUS_EXPORT_MIGRATIONS = True

# Celery
CELERY_BROKER_URL = f"amqp://{RABBITMQ_DEFAULT_USER}:{RABBITMQ_DEFAULT_PASS}@rabbitmq"
CELERY_RESULT_BACKEND = "django-db"
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
    },
    "staticfiles": {
        "BACKEND": "storages.backends.s3boto3.S3StaticStorage",
    },
}

AWS_S3_SECURE_URLS = True  # use http instead of https

AWS_QUERYSTRING_AUTH = (
    False  # don't add complex authentication-related query parameters for requests
)

CELERY_BEAT_SCHEDULE = {
    "clear_data_every_day": {
        "task": "myapp.tasks.clear_data",  # task의 경로를 정확하게 설정해야 합니다.
        "schedule": crontab(minute="0", hour="4"),  # 매일 4시 0분에 실행합니다.
    },
}
