import { makeAutoObservable } from "mobx";

class WebsocketStore {
  ws: WebSocket | null = null;

  pingIntervalId: NodeJS.Timeout | null = null;

  messages: any[] = [];

  round = 0;

  total = 0;

  imgSrc = "";

  // isNextRound = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  connect = (url: string) => {
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      console.log(message);

      if (message.event === "ping") {
        this.send({ event: "pong", data: "pong" });
      } else if (message.event === "nextRound") {
        this.round = message.data.round;
      } else if (message.event === "renewList") {
        this.total = message.data.players.length;
      } else if (message.event === "image") {
        this.imgSrc = message.data.url;
      }

      if (message.error === "방이 가득 찼습니다.") {
        this.error = message.error;
      }

      this.messages.push(message);
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

  // setIsNextRound = (isNextRound: boolean) => {
  //   runInAction(() => {
  //     this.isNextRound = isNextRound;
  //   });
  // };
}

export default new WebsocketStore();
