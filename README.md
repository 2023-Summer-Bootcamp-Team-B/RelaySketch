# RelaySketch


# 📌 System Architecture


![시스템아키텍쳐](https://github.com/2023-Summer-Bootcamp-Team-B/RelaySketch/assets/137774867/be13ee8b-5fb9-4e4e-bfa5-559a154f7049)

![시스템아키텍쳐2](https://github.com/2023-Summer-Bootcamp-Team-B/RelaySketch/assets/137774867/47391b51-fba7-41d5-bc87-6eace99df25e)

# 📚 TECH STACKS
<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
<th>Logging & Monitoring</th>
<th>Others</th>
</tr>
<tr>
<td align=center>
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><br>
<img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"><br>
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"><br>
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"><br>
<img src="https://img.shields.io/badge/mobx-FF9955?style=for-the-badge&logo=mobx&logoColor=white"><br>
<img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"><br>
<img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black"><br>
</td>
<td align=center>
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=black"><br>
<img src="https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=django&logoColor=white"><br>
<img src="https://img.shields.io/badge/gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=black"><br>
<img src="https://img.shields.io/badge/rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white"><br>
<img src="https://img.shields.io/badge/celery-37814A?style=for-the-badge&logo=celery&logoColor=black"><br>
<img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"><br>
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><br>
<img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"><br>
</td>
<td align=center>
<img src="https://img.shields.io/badge/prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=black"><br>
<img src="https://img.shields.io/badge/grafana-F46800?style=for-the-badge&logo=grafana&logoColor=black">
<img src="https://img.shields.io/badge/k6-7D64FF?style=for-the-badge&logo=k6&logoColor=black"><br>
<img src="https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white"><br>
<img src="https://img.shields.io/badge/logstash-005571?style=for-the-badge&logo=logstash&logoColor=white"><br>
<img src="https://img.shields.io/badge/kibana-005571?style=for-the-badge&logo=kibana&logoColor=white"><br>
</td>
<td align=center>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"><br>
<img src="https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"><br>
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"><br>
<img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"><br>
<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"><br>
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"><br>
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"><br>
</td>
</tr>
</table>


# Database
### ERD
---
<img width="677" alt="ERD" src="https://github.com/2023-Summer-Bootcamp-Team-B/RelaySketch/assets/137774867/a9175ecc-547b-4906-b9c8-781a22b78044">


# 📂 File Directory
<details>
<summary>front</summary>
<div markdown="1">
📦frontend
 ┣ 📂node_modules
 ┣ 📂public
 ┣ 📂src
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂fonts
 ┃ ┃ ┗ 📂images
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂Header
 ┃ ┃ ┃ ┗ 📜Header.tsx
 ┃ ┃ ┣ 📂PlayerList
 ┃ ┃ ┃ ┣ 📜Player.tsx
 ┃ ┃ ┃ ┣ 📜PlayerList.tsx
 ┃ ┃ ┃ ┗ 📜PlayersSection.tsx
 ┃ ┃ ┣ 📂ResultsList
 ┃ ┃ ┃ ┣ 📜Result.tsx
 ┃ ┃ ┃ ┣ 📜ResultsList.tsx
 ┃ ┃ ┃ ┗ 📜ResultsSection.tsx
 ┃ ┃ ┣ 📂UI
 ┃ ┃ ┃ ┣ 📜AnimatedBackground.tsx
 ┃ ┃ ┃ ┣ 📜AnimatedFooter.tsx
 ┃ ┃ ┃ ┣ 📜Button.tsx
 ┃ ┃ ┃ ┗ 📜KakaoShareButton.tsx
 ┃ ┃ ┗ 📜Background.tsx
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📜GuessImagePage.tsx
 ┃ ┃ ┣ 📜InputTitlePage.tsx
 ┃ ┃ ┣ 📜LoadingPage.tsx
 ┃ ┃ ┣ 📜MainPage.tsx
 ┃ ┃ ┣ 📜PlayerRoomPage.tsx
 ┃ ┃ ┗ 📜ResultsPage.tsx
 ┃ ┣ 📂stores
 ┃ ┃ ┗ 📜WebsocketStore.ts
 ┃ ┣ 📜App.css
 ┃ ┣ 📜App.tsx
 ┃ ┣ 📜index.css
 ┃ ┣ 📜main.tsx
 ┃ ┗ 📜vite-env.d.ts
 ┣ 📜.eslintrc.cjs
 ┣ 📜.gitignore
 ┣ 📜Dockerfile
 ┣ 📜Dockerfile.prod
 ┣ 📜index.html
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜postcss.config.js
 ┣ 📜tailwind.config.js
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┗ 📜vite.config.ts
</div>
</details>



<details>
<summary>backend</summary>
<div markdown="1">
📦backend
 ┣ 📂config
 ┃ ┣ 📜asgi.py
 ┃ ┣ 📜celery.py
 ┃ ┣ 📜settings.py
 ┃ ┣ 📜urls.py
 ┃ ┣ 📜wsgi.py
 ┃ ┗ 📜__init__.py
 ┣ 📂myapp
 ┃ ┣ 📂migrations
 ┃ ┃ ┣ 📜0001_initial.py
 ┃ ┃ ┣ 📜0002_remove_subroom_unique_first_player_in_room.py
 ┃ ┃ ┣ 📜0003_topic_player_id.py
 ┃ ┃ ┗ 📜__init__.py
 ┃ ┣ 📂test
 ┃ ┃ ┣ 📜test_models.py
 ┃ ┃ ┣ 📜test_views.py
 ┃ ┃ ┗ 📜__init__.py
 ┃ ┣ 📜admin.py
 ┃ ┣ 📜apps.py
 ┃ ┣ 📜consumers.py
 ┃ ┣ 📜models.py
 ┃ ┣ 📜routing.py
 ┃ ┣ 📜tasks.py
 ┃ ┣ 📜tests.py
 ┃ ┣ 📜views.py
 ┃ ┗ 📜__init__.py
 ┣ 📂static
 ┣ 📜.dockerignore
 ┣ 📜celerybeat-schedule
 ┣ 📜Dockerfile
 ┣ 📜Dockerfile.prod
 ┣ 📜gunicorn.conf.py
 ┣ 📜main.py
 ┣ 📜manage.py
 ┣ 📜Pipfile
 ┗ 📜Pipfile.lock
</div>
</details>



# MainFlow
<img width="775" alt="flow" src="https://github.com/2023-Summer-Bootcamp-Team-B/RelaySketch/assets/137774867/460e3036-8674-4e4b-b844-d17852338b19">


# 🔍 Features


# 🖥️ Moniterings
# 캡쳐 넣기


# Swagger
<img width="1088" alt="API명세서" src="https://github.com/2023-Summer-Bootcamp-Team-B/RelaySketch/assets/137774867/6b696ffd-10a9-4951-87fc-dfb4a2e1a548">



# 👫 Member
