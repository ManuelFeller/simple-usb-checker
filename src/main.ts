// read the environment
const env = process.env.NODE_ENV || 'production';
// if development environment add reload-on-change functionality to electron
if (env === 'development') {
	console.log('Starting in development mode...')
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

// starting actual app imports and code
import { app, BrowserWindow } from 'electron';
import SocketServer from './socket-server';
import usbDetect from 'usb-detection';
import UsbDetector from './usb-detector';

// the communication server used between UI and the nodeJS app
let server: SocketServer;
let usbDetector: UsbDetector;

/**
 * Function to create a new window and load the UI
 */
function createWindow () {
	const win = new BrowserWindow({
		width: 320,
		height: 440
	});

	win.loadURL(`file://${__dirname}/../static/main-ui.html`);
}

// app startup code
app.whenReady().then(() => {
	usbDetect.startMonitoring();
	usbDetector = UsbDetector.getInstance();
	server = new SocketServer(usbDetector);
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
	// additionally make sure the process can exit when the app is closed
	app.on('quit', function () {
		usbDetect.stopMonitoring();
	});

});
