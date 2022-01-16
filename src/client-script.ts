import { UsbChangeEvent } from "./usb-detector";

export default class ClientApp {

  private socket: WebSocket | undefined;
  private currentDetectionStatus = false;

  constructor() {
    console.log('APP: ClientApp created');
  }

  // intended to be called in the onLoad event
  public pageLoaded() {
    this.processDetectionStatusChange(false);
    this.updateStatus('connecting...');
    // prepare socket client
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.close = this.onSocketClose.bind(this);
    this.socket.onerror = this.onSocketError.bind(this);
    // bind button click events
    const btnListDevices = document.getElementById('btnListDevices') as HTMLButtonElement;
    if (btnListDevices !== undefined) {
      btnListDevices.addEventListener('click', this.onListDevicesClick.bind(this));
    }
    const btnToggleDetector = document.getElementById('btnToggleDetector') as HTMLButtonElement;
    if (btnToggleDetector !== undefined) {
      btnToggleDetector.addEventListener('click', this.onToggleDetectionClick.bind(this));
    }
    const btnClearDetections = document.getElementById('btnClearDetections') as HTMLButtonElement;
    if (btnClearDetections !== undefined) {
      btnClearDetections.addEventListener('click', this.onClearDetectionsClick.bind(this));
    }

    const btnViewOverview = document.getElementById('btnViewOverview') as HTMLButtonElement;
    if (btnViewOverview !== undefined) {
      btnViewOverview.addEventListener('click', this.onViewOverviewClick.bind(this));
    }

    const btnViewDetection = document.getElementById('btnViewDetection') as HTMLButtonElement;
    if (btnViewDetection !== undefined) {
      btnViewDetection.addEventListener('click', this.onViewDetectionClick.bind(this));
    }

    const overviewElement = document.getElementById('sectionViewOverview') as HTMLElement;
    if (overviewElement !== undefined) {
      overviewElement.classList.remove('hidden');
    }
  }

  // event handlers

  private onMessage(event: MessageEvent<any>): void {
    console.log('APP: Received message');
    console.log(event.data);
    let message = JSON.parse(event.data);
    if (message.type === undefined) {
      console.error('Undefined type of message');
      return;
    }
    switch (message.type) {
      case 'welcome':
        console.log('APP: Received welcome message');
        this.updateStatus('ready...');
        break;
      case 'device-list':
        console.log('APP: Received device list');
        this.generateDeviceListHtml(message.data);
        break;
      case 'detection-status':
        console.log('APP: Received detection status update');
        this.processDetectionStatusChange(message.data as boolean);
        break
      case 'device-event':
        console.log('APP: Received device update');
        this.addDeviceUpdate(message.data as UsbChangeEvent)
        break;
      default:
        console.error('Unknown type of message');
        break;
    }
    //alert(JSON.stringify(message));
  }

  private onSocketError(event: Event): void {
    console.warn('APP: Socket error');
    console.error(event);
    this.updateStatus('error...');
  }

  private onSocketClose(code: number | undefined, reason: string | undefined): void {
    console.warn('APP: Socket closed');
    console.log(code);
    console.log(reason);
    this.updateStatus('closed...');
  }

  private onViewOverviewClick(event: MouseEvent) {
    const overviewElement = document.getElementById('sectionViewOverview') as HTMLElement;
    const detectionElement = document.getElementById('sectionViewDetection') as HTMLElement;
    overviewElement.classList.remove('hidden');
    detectionElement.classList.add('hidden');
  }

  private onViewDetectionClick(event: MouseEvent) {
    const overviewElement = document.getElementById('sectionViewOverview') as HTMLElement;
    const detectionElement = document.getElementById('sectionViewDetection') as HTMLElement;
    detectionElement.classList.remove('hidden');
    overviewElement.classList.add('hidden');
  }


  private onListDevicesClick(event: MouseEvent) {
    if (this.socket === undefined) {
      console.error('APP: No Socket available, cannot send list request');
      return;
    }
    console.log('APP: Sending list request');
    this.socket.send(JSON.stringify({type: 'ui-request', data: 'device-list'}));
  }

  private onToggleDetectionClick(event: MouseEvent) {
    if (this.socket === undefined) {
      console.error('APP: No Socket available, cannot send list request');
      return;
    }
    console.log('APP: Sending toggle request');
    this.socket.send(JSON.stringify({type: 'ui-request', data: 'toggle-detection'}));
  }

  private onClearDetectionsClick(event: MouseEvent) {
    const detectionsElement = document.getElementById('detectorOutput') as HTMLElement;
    detectionsElement.innerHTML = '';
  }

  private updateStatus(status: string) {
    const statusElement = document.getElementById('statusDiv') as HTMLElement;
    statusElement.innerText = status;
  }

  private generateDeviceListHtml(list: [any]) {
    console.log('APP: Generating output');
    let html = '';
    for (let idx = 0; idx < list.length; idx++) {
      let manufacturer = list[idx].manufacturer as string;
      if (manufacturer.trim() == '') {
        manufacturer = '<i>missing</i>';
      }
      let deviceName = list[idx].deviceName as string;
      if (deviceName.trim() == '') {
        deviceName = '<i>missing</i>';
      }
      let serialNumber = list[idx].serialNumber as string;
      if (serialNumber.trim() == '') {
        serialNumber = '<i>missing</i>';
      }
      html += `<tr><td>${manufacturer}</td><td>${deviceName}</td><td>${serialNumber}</td></tr>`;
    }
    console.log('APP: Injecting output');
    const tableBody = document.getElementById('deviceListTableBody') as HTMLElement;
    if (tableBody !== undefined) {
      tableBody.innerHTML = html;
    }
  }

  private processDetectionStatusChange(newStatus: boolean) {
    this.currentDetectionStatus = newStatus;
    const detectionStatusElement = document.getElementById('detectionStatus') as HTMLElement;
    if (this.currentDetectionStatus) {
      detectionStatusElement.innerText = "running..."
    } else {
      detectionStatusElement.innerText = "stopped..."
    }
  }

  private addDeviceUpdate(event: UsbChangeEvent) {
    const detectionOutputElement = document.getElementById('detectorOutput') as HTMLElement;
    let newContent = detectionOutputElement.innerHTML;
    newContent += `<div>Event: ${event.type} | Device: ${event.device.deviceName}</div>`;
    detectionOutputElement.innerHTML = newContent;
  }

}

// create app class and bind it to onload event
const app = new ClientApp();
window.addEventListener('load', app.pageLoaded.bind(app));