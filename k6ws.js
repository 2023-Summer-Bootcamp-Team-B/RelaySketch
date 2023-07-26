import ws from "k6/ws";
import { check } from "k6";

export default function () {
  let roomNumber = Math.ceil(__VU / 6); // 6개의 가상 유저가 동일한 방에 접속
  let url = `ws://localhost:8000/ws/room/${roomNumber}/`;
  let params = { tags: { my_tag: "hello" } };

  let res = ws.connect(url, params, function (socket) {
    socket.on("open", function open() {
      socket.setInterval(function timeout() {
        socket.send(JSON.stringify({ event: "ping", data: "ping" }));
        console.log("Pinging every 1sec (setInterval test)");
      }, 1000);
    });

    socket.on("message", function (data) {
      let message = JSON.parse(data);
      if (message.event === "pong") {
        console.log("PONG!");
      }
    });

    socket.on("close", function () {
      console.log("disconnected");
    });

    socket.setTimeout(function () {
      console.log("4 seconds passed, closing the socket");
      socket.close();
    }, 4000);
  });

  check(res, {
    "connected successfully": (r) => r && r.status === 101,
  });
}
