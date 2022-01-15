import usbDetect from 'usb-detection';
import { app, BrowserWindow } from 'electron';
import SocketServer from './socket-server';

// the communication server used between UI and the nodeJS app
const server = new SocketServer();

function createWindow () {
	const win = new BrowserWindow({
		width: 320,
		height: 440
	});

	win.loadFile('./static/main-ui.html');
}

app.whenReady().then(() => {
	server.start();
	createWindow();

	// needed to also work on MacOS as expected
	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit();
		}
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