import { makeAutoObservable, runInAction } from "mobx";

class WebsocketStore {
  ws: WebSocket | null = null;

  pingIntervalId: NodeJS.Timeout | null = null;

  messages: any[] = [];

  isEditing = false;

  completeNum = 0;

  input = "";

  hostId = 0;

  total = 0; // 총 플레이어 수

  myId = 0;

  round = 0;

  imgSrc = "";

  players = <any>[];

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
          this.players = message.data.players;
          this.total = this.players.length;
          for (let i = 0; i < this.total; i++) {
            if (this.players[i].isHost) {
              this.hostId = this.players[i].player_id;
            }
            console.log("유저 접속 완료\n" + this.players[i].player_id);
          }
        } else if (message.event === "connected") {
          this.myId = message.data.playerId;
          console.log("지금 현재 내아이디" + this.myId);
          console.log("지금 현재 인원수" + this.total);
        } else if (message.event === "completeUpdate") {
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

  sendDataToBackend(input: string, id: number) {
    if (input.trim() === "") {
      console.error("Invalid input data");
      return;
    }

    const data = {
      event: "inputTitle",
      data: {
        title: input,
        playerId: id,
      },
    };
    this.send(data);
  }

  sendChangeTitleEvent(input: string, id: number) {
    if (input.trim() === "") {
      console.error("Invalid input data");
      return;
    }

    const data = {
      event: "changeTitle",
      data: {
        title: input,
        playerId: id,
      },
    };
    this.send(data);
  }
}

export default new WebsocketStore();
