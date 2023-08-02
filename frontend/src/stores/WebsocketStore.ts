import { makeAutoObservable, runInAction } from "mobx";

class WebsocketStore {
  ws: WebSocket | null = null;

  pingIntervalId: NodeJS.Timeout | null = null;

  messages: any[] = [];

  round = 0;

  input = "";

  hostId = 0;

  total = 0; // 총 플레이어 수

  completeNum = 0;

  nowLoading = false;

  myId = -1;

  imgSrc = "";

  endGame = false;

  isHostChanged = false;

  gameResult: any[] = [];

  currentIdx = 0;

  nameOfCurrentResult = "";

  players = <any>[];

  allEnteredPlayers: any[] = [];

  error: string | null = null;

  setWs = (ws: WebSocket | null) => {
    this.ws = ws;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  constructor() {
    makeAutoObservable(this);
  }

  connect = (url: string) => {
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      runInAction(() => {
        const message = JSON.parse(event.data);

        if (message.event === "ping") {
          this.send({ event: "pong", data: "pong" });
        } else if (message.event === "connected") {
          this.allEnteredPlayers = [];
          this.myId = message.data.playerId;
        } else if (message.event === "renewList") {
          if (this.allEnteredPlayers.length <= message.data.players.length) {
            this.allEnteredPlayers = message.data.players;
          }
          this.players = message.data.players;
          this.total = this.players.length;
          for (let i = 0; i < this.total; i += 1) {
            if (this.players[i].isHost) {
              this.hostId = this.players[i].player_id;
            }
          }
        } else if (message.event === "gameStart") {
          this.endGame = false;
          this.gameResult = [];
          this.round = message.round;
        } else if (message.event === "completeUpdate") {
          this.completeNum = message.data.completeNum;
        } else if (message.event === "loading_and_url") {
          this.nowLoading = true;
        } else if (message.event === "moveNextRound") {
          this.round = message.data.round;
          this.imgSrc = message.data.url;
          this.nowLoading = false;
          this.completeNum = 0;
        } else if (message.event === "end") {
          this.endGame = true;
          this.nowLoading = false;
          this.currentIdx = 0;
          this.nameOfCurrentResult = "";
          this.round = 0;
          this.completeNum = 0;
        } else if (message.event === "gameResult") {
          this.currentIdx += 1;
          this.gameResult = message.data.game_result;
          this.nameOfCurrentResult = message.data.game_result[0].player_name;
        } else if (message.event === "image_creation_failed") {
          this.error = message.data.error;
        } else if (message.event === "error") {
          this.error = message.data.error;
        }

        this.messages.push(message);
      });
    };

    this.ws.onopen = () => {
      this.pingIntervalId = setInterval(() => {
        this.send({ event: "ping", data: "ping" });
      }, 50000);
    };

    this.ws.onclose = () => {
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

  resetRound = () => {
    runInAction(() => {
      this.round = 0;
    });
  };

  setHasHostChanged = (boolean: boolean) => {
    runInAction(() => {
      this.isHostChanged = boolean;
    });
  };

  setDisableNowLoading = () => {
    runInAction(() => {
      this.nowLoading = false;
    });
  };
}

export default new WebsocketStore();
