import WebSocket, { WebSocketServer } from 'ws';
import UsbDetector, { UsbChangeEvent } from './usb-detector';

export default class SocketServer {

  private server: WebSocketServer | undefined;
  private usbDetector: UsbDetector;
  private isMonitoring = false;

  constructor(usbDetector: UsbDetector) {
    this.usbDetector = usbDetector;
    console.log('SERVER: SocketServer class created');
    this.start();
  }

  private start(): void {
    // protect against double start
    if (this.server !== undefined) {
      throw new Error('SERVER: SocketServer cannot be started twice');
    }
    // create server
    this.server = new WebSocketServer({ port: 8080 });
    // bind "on connection" handler
    this.server.on('connection', this.onConnection.bind(this));

  }

  // not ready yet, maybe later
  private stop(): void {
    // make sure server is running
    if (this.server === undefined) {
      throw new Error('SERVER: Cannot stop as SocketServer is not started yet');
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
          console.log('SERVER: received device list request');
          this.sendDeviceList();
          break;
        case 'toggle-detection':
          console.log('SERVER: received toggle detection request');
          this.toggleDetection();
          break;
        default:
          console.log('SERVER: unknown message data');
          break;
      }
    }

  }

  private toggleDetection() {
    if (this.isMonitoring) {
      // de-register
      this.usbDetector.onUsbChange(undefined)
    } else {
      // register
      this.usbDetector.onUsbChange(this.processUsbDeviceChange.bind(this))
    }
    // invert current status
    this.isMonitoring = !this.isMonitoring;
    console.log('SERVER: sending new detection status');
    this.sendMessage(JSON.stringify({type: 'detection-status', data: this.isMonitoring}));
  }

  private sendDeviceList() {
    console.log('SERVER: sending device list');
    this.sendMessage(JSON.stringify({type: 'device-list', data: this.usbDetector.getDeviceList()}));
  }

  private processUsbDeviceChange(event: UsbChangeEvent) {
    console.log('SERVER: forwarding device change');
    this.sendMessage(JSON.stringify({type: 'device-event', data: event}));
  }

  // internal functions

  private sendMessage(data: string) {
    // make sure server is running
    if (this.server === undefined) {
      console.log('SERVER: no server, cannot send message');
      throw new Error('SERVER: Cannot send message, SocketServer not started yet');
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
