class ClientApp {

  private socket: WebSocket | undefined;

  constructor() {
    console.log('ClientApp created');
  }

  // intended to be called in the onLoad event
  public pageLoaded() {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onmessage = this.onMessage.bind(this);
  }

  private onMessage(event: MessageEvent<any>) {
    let message = JSON.parse(event.data);
    alert(JSON.stringify(message));
  }
}

// create app class and bind it to onload event
const app = new ClientApp();
window.addEventListener('load', app.pageLoaded.bind(app));