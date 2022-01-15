class ClientApp {

  private socket: WebSocket | undefined;

  constructor() {
    console.log('ClientApp created');
  }

  // intended to be called in the onLoad event
  public pageLoaded() {
    // prepare socket client
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onmessage = this.onMessage.bind(this);
    // bind button click events
    const btnListDevices = document.getElementById('btnListDevices') as HTMLButtonElement;
    if (btnListDevices !== undefined) {
      btnListDevices.addEventListener('click', this.onListDevicesClick.bind(this));
    }
    const btnToggleDetector = document.getElementById('btnToggleDetector') as HTMLButtonElement;
    if (btnToggleDetector !== undefined) {
      btnToggleDetector.addEventListener('click', this.onToggleDetectionClick.bind(this));
    }
  }

  // event handlers

  private onMessage(event: MessageEvent<any>): void {
    console.log('Received message');
    console.log(event.data);
    let message = JSON.parse(event.data);
    if (message.type === undefined) {
      console.error('Undefined type of message');
      return;
    }
    switch (message.type) {
      case 'welcome':
        console.log('Received welcome message');
        break;
      case 'device-list':
        console.log('Received device list');
        this.generateDeviceListHtml(message.data);
        break;
      default:
        console.error('Unknown type of message');
        break;
    }
    //alert(JSON.stringify(message));
  }


  private onListDevicesClick(event: MouseEvent) {
    if (this.socket === undefined) {
      console.error('No Socket available, cannot send list request');
      return;
    }
    console.log('Sending list request');
    this.socket.send(JSON.stringify({type: 'ui-request', data: 'device-list'}));


  }

  private onToggleDetectionClick(event: MouseEvent) {
    alert('toggle');
  }

  private generateDeviceListHtml(list: [any]) {
    console.log('Generating output');
    let html = '';
    for (let idx = 0; idx < list.length; idx++) {
      html += `<tr><td>${list[idx].manufacturer}</td><td>${list[idx].deviceName}</td><td>${list[idx].serialNumber}</td></tr>`;
    }
    console.log('Injecting output');
    const tableBody = document.getElementById('deviceListTableBody') as HTMLElement;
    if (tableBody !== undefined) {
      tableBody.innerHTML = html;
    }
  }

}

// create app class and bind it to onload event
const app = new ClientApp();
window.addEventListener('load', app.pageLoaded.bind(app));