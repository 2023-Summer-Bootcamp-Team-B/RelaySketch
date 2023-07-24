import { makeAutoObservable, runInAction } from "mobx";

class WebsocketStore {
  ws: WebSocket | null = null;

  pingIntervalId: NodeJS.Timeout | null = null;

  messages: any[] = [];

  isEditing = false;

  completeNum = 0;

  input = "";

  total = 0; // 총 플레이어 수

  myId = 0;

  round = 0;

  imgSrc = "";

  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  connect = (url: string) => {
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      runInAction(() => {
        const message = JSON.parse(event.data);

        console.log(message);

        if (message.event === "ping") {
          this.send({ event: "pong", data: "pong" });
        } else if (message.event === "renewList") {
          this.total = message.data.players.length;
        } else if (message.event === "completePeople") {
          this.completeNum = message.data.completeNum;
        } else if (message.event === "connected") {
          this.myId = message.data.playerId;
        } else if (message.event === "gameStart") {
          this.round = message.round;

          if (message.error === "방이 가득 찼습니다.") {
            this.error = message.error;
          }

          this.messages.push(message);
        }
      });
    };

    this.ws.onopen = () => {
      this.pingIntervalId = setInterval(() => {
        this.send({ event: "ping", data: "ping" });
      }, 50000);
    };

    this.ws.onclose = (event) => {
      console.log(event.code);
      this.ws = null;
      if (this.pingIntervalId) {
        clearInterval(this.pingIntervalId);
        this.pingIntervalId = null;
      }
    };
  };

  disconnect = () => {
    if (this.ws) {
      this.ws.close();
    }
  };

  send = (data: any) => {
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        try {
          console.log(data);
          this.ws.send(JSON.stringify(data));
        } catch (error) {
          console.error("Failed to send a message:", error);
        }
      } else if (
        this.ws.readyState === WebSocket.CLOSING ||
        this.ws.readyState === WebSocket.CLOSED
      ) {
        console.error("Socket is not connected");
        this.disconnect();
      }
    }
  };

  sendDataToBackend(input: string, playerId: number, type: boolean) {
    if (input.trim() === "") {
      console.error("Invalid input data");
      return;
    }
    function titleToBackend() {
      if (!type) {
        return "inputTitle";
      }
      return "changeTitle";
    }
    const data = {
      event: titleToBackend(),
      data: {
        title: input,
        playerId,
      },
    };
    this.send(JSON.stringify(data));
  }
}

export default new WebsocketStore();
