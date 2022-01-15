const env = process.env.NODE_ENV || 'production';
console.log(env)
// If development environment
if (env === 'development') {
	try {
		require('electron-reloader')(module, {
				debug: true,
				watchRenderer: true,
				ignore: [
					'LICENSE',
					'README.md',
					'package-lock.json',
					'src/**',
					'docs/**',
					'static/*.scss'
				]
		});
	} catch (_) { console.log('Error'); }
}

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
