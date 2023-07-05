from django.core.asgi import get_asgi_application
from uvicorn import run

app = get_asgi_application()

if __name__ == "__main__":
    run(app, host="localhost", port=8000)
