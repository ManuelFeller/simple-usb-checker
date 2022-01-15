import usbDetect from 'usb-detection';

/**
 * Class that handles the USB monitoring; wrapping the usb-detection package
 */
export default class UsbDetector {

	private currentDevices: usbDetect.Device[];
	private initialized = false;
	private onChangeHandler: Function | undefined;
	static instance: UsbDetector;

	/**
	 * !!! Do not manually creat new instances ! Use UsbDetector.getInstance() !!!
	 */
	constructor() {
		console.log('DETECTOR: UsbDetector class created');
		this.currentDevices = []
		console.log('DETECTOR: Requesting initial USB Device List');
		usbDetect.find(this.processInitialListing.bind(this));
	}

	/**
	 * Get the singleton instance of the class
	 * @returns The instance to use
	 */
	public static getInstance(): UsbDetector {
		if (UsbDetector.instance === undefined) {
			UsbDetector.instance = new UsbDetector();
		}
		return UsbDetector.instance;
	} 

	/**
	 * Get the list of connected USB devices
	 * @returns The list of the currently connected devices
	 */
	public getDeviceList(): usbDetect.Device[] {
		if (!this.initialized) {
			console.error('DETECTOR: Not fully initialized');
			return [];
		}
		return this.currentDevices;
	}

	/**
	 * "Register" the callback for the case that there is a change in teh USB device list
	 * @param handler The function that handles the change events
	 */
	public onUsbChange(handler: Function | undefined) {
		this.onChangeHandler = handler;
	}

	/**
	 * Internal code to process the initial list of devices
	 * @param error In case of an error this gets filled with details
	 * @param data In case of success this gets filled with the list of devices
	 * @returns An array with usbDetect.Device objects
	 */
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

	/**
	 * Internal code that handles the event of newly added devices
	 * @param device The usbDetect.Device that was added
	 */
	private onDeviceAdd(device: usbDetect.Device) {
		console.log('DETECTOR: Add detected');
		console.log(device);
		// publish event if we have a listener
		if (this.onChangeHandler !== undefined) {
			this.onChangeHandler({ type: 'add', device })
		}
		// add device to the list
		this.currentDevices.push(device);
	}

		/**
	 * Internal code that handles the event of removed devices
	 * @param device The usbDetect.Device that was removed
	 */
	private onDeviceRemove(device: usbDetect.Device) {
		console.log('DETECTOR: Remove detected');
		console.log(device);
		// publish event if we have a listener
		if (this.onChangeHandler !== undefined) {
			this.onChangeHandler({ type: 'remove', device })
		}
		// remove device from the list
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

/**
 * Interface to describe the data sent out in case something
 * in the list of connected USB devices changes
 */
export interface UsbChangeEvent {
	/**
	 * The event type
	 */
	type: 'add' | 'remove',
	/**
	 * The device details
	 */
	device: usbDetect.Device
}
