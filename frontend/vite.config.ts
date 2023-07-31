import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import fs from "fs";

export default () => {
  let env = {};

  try {
    // .env 파일이 있을 경우에만 로드합니다.
    if (fs.existsSync(".env")) {
      env = dotenv.config({
        path: ".env",
      }).parsed;
    }
  } catch (err) {
    console.error(err);
  }

  return defineConfig({
    // Vite config 설정
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    plugins: [react()],
    define: {
      // 로드한 환경 변수를 Vite에 전달합니다.
      "process.env": Object.keys(env).reduce((acc, key) => {
        acc[key] = JSON.stringify(env[key]);
        return acc;
      }, {}),
    },
  });
};
