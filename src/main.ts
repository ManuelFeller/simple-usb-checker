/*
const env = process.env.NODE_ENV || 'development';
console.log(env)
// If development environment
if (env === 'development') {
	try {
		require('electron-reloader')(module, {
				debug: true,
				watchRenderer: true
		});
	} catch (_) { console.log('Error'); }
}
*/

import { app, BrowserWindow } from 'electron';
import SocketServer from './socket-server';
import usbDetect from 'usb-detection';
import UsbDetector from './usb-detector';



// the communication server used between UI and the nodeJS app
let server: SocketServer;
let usbDetector: UsbDetector;

function createWindow () {
	const win = new BrowserWindow({
		width: 320,
		height: 440
	});

	win.loadURL(`file://${__dirname}/../static/main-ui.html`);
}

app.whenReady().then(() => {
	usbDetect.startMonitoring();
	usbDetector = new UsbDetector();
	server = new SocketServer(usbDetector);
	createWindow();

	// needed to also work on MacOS as expected
	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});
	app.on('quit', function () {
		usbDetect.stopMonitoring();
	});
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

});

/*
usbDetect.startMonitoring();

// Detect add/insert
usbDetect.on('add', function(device) { console.log('add', device); });

// Detect remove
usbDetect.on('remove', function(device) { console.log('remove', device); });

// Detect add or remove (change)
usbDetect.on('change', function(device) { console.log('change', device); });

// Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
usbDetect.find(function(err, devices) { console.log('find', devices, err); });
//usbDetect.find(vid, function(err, devices) { console.log('find', devices, err); });
//usbDetect.find(vid, pid, function(err, devices) { console.log('find', devices, err); });
// Promise version of `find`:
//usbDetect.find().then(function(devices) { console.log(devices); }).catch(function(err) { console.log(err); });

// Allow the process to exit
usbDetect.stopMonitoring()
*/
/*
{
	locationId: 85012480,
	vendorId: 1193,
	productId: 6144,
	deviceName: 'TS8000 series',
	manufacturer: 'Canon',
	serialNumber: '12BAE2',
	deviceAddress: 8
}
*/