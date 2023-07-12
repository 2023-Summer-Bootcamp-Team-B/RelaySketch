# 베이스 이미지 선택
FROM python:3.11-bookworm

# 환경변수를 설정하여 파이썬이 버퍼링하지 않도록 합니다.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED 1

# 다른 서비스들이 완전히 시작할 때까지 현재 서비스의 시작을 지연
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

# 작업 디렉토리 설정
WORKDIR /backend

# 파일 복사
COPY . .

# pipenv 설치 및 의존성 설치
RUN python -m pip install --upgrade pip
RUN pip install pipenv
RUN pipenv install --deploy --ignore-pipfile

# 기다림 스크립트 실행 후 정적파일 모음 및 gunicorn 실행
# CMD /wait && pipenv run python manage.py makemigrations && pipenv run python manage.py migrate && pipenv run python manage.py collectstatic --no-input && pipenv run gunicorn -c gunicorn.conf.py config.asgi:application --bind 0.0.0.0:8000

# 개발용 서버 실행
CMD /wait && pipenv run python manage.py makemigrations && pipenv run python manage.py migrate && pipenv run python manage.py collectstatic --no-input && pipenv run python manage.py runserver 0.0.0.0:8000