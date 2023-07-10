FROM node:16-alpine

WORKDIR /frontend

COPY . ./

RUN npm install

EXPOSE 3000

# 애플리케이션을 실행합니다.
CMD [ "npm", "run", "dev" ]