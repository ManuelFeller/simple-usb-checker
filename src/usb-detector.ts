import usbDetect from 'usb-detection';

export default class UsbDetector {

	private currentDevices: usbDetect.Device[];
	private initialized = false;

	constructor() {
		console.log('DETECTOR: UsbDetector class created');
		this.currentDevices = []
		console.log('DETECTOR: Requesting initial USB Device List');
		usbDetect.find(this.processInitialListing.bind(this));
	}

	public getDeviceList(): usbDetect.Device[] {
		if (!this.initialized) {
			console.error('DETECTOR: Not fully initialized');
			return [];
		}
		return this.currentDevices;
	}

	private processInitialListing(error: any, data: usbDetect.Device[]) {
		console.log('DETECTOR: Processing initial USB Device List');
		if (error !== undefined) {
			console.error(error);
			return;
		}
		// save list of devices
		this.currentDevices = data as usbDetect.Device[];
		this.initialized = true;
		// start listening to changes
		usbDetect.on('add', this.onDeviceAdd.bind(this))
		usbDetect.on('remove', this.onDeviceRemove.bind(this))
	}

	private onDeviceAdd(device: usbDetect.Device) {
		console.log('DETECTOR: Add detected');
		console.log(device);
		this.currentDevices.push(device);
	}

	private onDeviceRemove(device: usbDetect.Device) {
		console.log('DETECTOR: Remove detected');
		console.log(device);
		const jDevice = JSON.stringify(device);
		let position = -1;
		for (let idx = 0; idx < this.currentDevices.length; idx++) {
			if (JSON.stringify(this.currentDevices[idx]) === jDevice) {
				position = idx;
				break;
			}
		}
		if (position === -1) {
			throw new Error('DETECTOR: Removed device not in device list');
		}
		this.currentDevices.splice(position, 1);
	}


}