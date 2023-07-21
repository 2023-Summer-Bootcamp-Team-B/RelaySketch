import { makeAutoObservable, runInAction } from "mobx";

class WebsocketStore {
  ws: WebSocket | null = null;

  pingIntervalId: NodeJS.Timeout | null = null;

  messages: any[] = [];

  round = 0;

  total = 0;

  completeNum = 0;

  nowLoading = false;

  myId = "";

  imgSrc = "";

  endGame = false;

  // isNextRound = false;
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
        } else if (message.event === "connected") {
          this.myId = message.data.playerId;
        } else if (message.event === "renewList") {
          this.total = message.data.players.length;
        } else if (message.event === "gameStart") {
          this.endGame = false;
          this.round = message.round;
        } else if (message.event === "completeUpdate") {
          this.completeNum = message.data.completeNum;
        } else if (message.event === "loading_and_url") {
          this.nowLoading = true;
        } else if (message.message === "Image creation completed") {
          this.imgSrc = message.image_url;
          this.nowLoading = false;
        } else if (message.event === "moveNextRound") {
          this.round = message.data.round;
          this.completeNum = 0;
        } else if (message.event === "end") {
          this.endGame = true;
        }

        if (message.error === "방이 가득 찼습니다.") {
          this.error = message.error;
        }

        this.messages.push(message);
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

  // setNowLoading = (nowLoading: boolean) => {
  //   runInAction(() => {
  //     this.nowLoading = nowLoading;
  //   });
  // };
}

export default new WebsocketStore();
