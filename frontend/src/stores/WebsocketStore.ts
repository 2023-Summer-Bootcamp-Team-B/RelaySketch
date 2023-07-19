import { makeAutoObservable } from "mobx";

class WebsocketStore {
  ws: WebSocket | null = null;

  pingIntervalId: NodeJS.Timeout | null = null;

  messages: any[] = [];

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
      // Attempt to reconnect after a delay.
      setTimeout(() => this.connect(url), 300);
    };
  };

  disconnect = () => {
    if (this.ws) {
      this.ws.close();
    }
  };

  send = (data: any) => {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error("Failed to send a message:", error);
      }
    } else {
      console.error("Socket is not connected");
    }
  };
}

export default new WebsocketStore();
