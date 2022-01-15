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

  private onMessage(data: WebSocket.RawData) {
    console.log('received: %s', data);
  }

  // internal functions

  private sendMessage(data: string) {
    // make sure server is running
    if (this.server === undefined) {
      throw new Error('Cannot send message, SocketServer not started yet');
    }
    // send message to all connected clients
    this.server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: false });
      }
    });
  }

}
