import { makeAutoObservable } from "mobx";

class WebsocketStore {
  ws: WebSocket | null = null;

  messages: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  connect = (url: string) => {
    this.ws = new WebSocket(url);
    console.log(this.ws);

    this.ws.onmessage = (event) => {
      this.messages.push(JSON.parse(event.data));
    };

    this.ws.onclose = () => {
      this.ws = null;
    };
  };

  disconnect = () => {
    if (this.ws) {
      this.ws.close();
    }
  };

  send = (data: any) => {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error("Socket is not connected");
    }
  };
}

export default new WebsocketStore();
