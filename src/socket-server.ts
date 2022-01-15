import WebSocket, { WebSocketServer } from 'ws';

export default class SocketServer {

  private server: WebSocketServer | undefined;
  private port: number;

  constructor() {
    this.port = 8080;
    console.log('SocketServer class created');
    
  }

  public start(): void {
    // protect against double start
    if (this.server !== undefined) {
      throw new Error('SocketServer cannot be started twice');
    }
    // create server
    this.server = new WebSocketServer({ port: this.port });
    // bind "on connection" handler
    this.server.on('connection', this.onConnection.bind(this));

  }

  // not ready yet, maybe later
  public stop(): void {
    // make sure server is running
    if (this.server === undefined) {
      throw new Error('Cannot stop as SocketServer is not started yet');
    }
    //
    this.server.close();
  }


  // event handlers

  private onConnection(socket: WebSocket) {
    // bind message handler
    socket.on('message', this.onMessage.bind(this));
    // send an answer
    socket.send(JSON.stringify({type: 'welcome', data: 'ready to communicate'}));
  }

  private onMessage(data: WebSocket.RawData): void {
    const message = JSON.parse(data.toString());
    if (message.type === undefined) {
      console.log('SERVER: undefined message type');
      return;
    }
    //JSON.stringify({type: 'ui-request', data: 'device-list'})
    if (message.type === 'ui-request') {
      switch (message.data) {
        case 'device-list':
          console.log('SERVER: got device list request');
          this.generateList();
          break;
        default:
          console.log('SERVER: unknown message data');
          break;
      }
    }

  }

  private generateList() {
    console.log('SERVER: generating device list');
    const data = {
      type: 'device-list',
      data: [
        {
          locationId: 85012480,
          vendorId: 1193,
          productId: 6144,
          deviceName: 'TS8000 series',
          manufacturer: 'Canon',
          serialNumber: '12BAE2',
          deviceAddress: 8
        }
      ]
    }
    this.sendMessage(JSON.stringify(data));
  }

  // internal functions

  private sendMessage(data: string) {
    // make sure server is running
    if (this.server === undefined) {
      console.log('SERVER: no server, cannot send message');
      throw new Error('Cannot send message, SocketServer not started yet');
    }
    // send message to all connected clients
    console.log('SERVER: sending message');
    this.server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: false });
      }
    });
  }

}
