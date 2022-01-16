# Simple USB Checker

A simple tool to check what USB devices get registered once you plug one in. A first (but not perfect) helper to protect against (some) BadUSB devices.

## Status & Changelog

### 2022-01-16 -> V0.7.0

- improved UI
  - unified styling to be touch friendly
  - starting with list of connected devices
- added a first version of settings
- added Raspbian installation instructions

### 2022-01-15 -> V 0.5.0

Basic functionality is there but UI/UX needs improvements

#### Known ToDo's

- improve UI further
  - find replacement for emoji on Raspbian (most of them do not show up properly there)
  - make UI responsive (to also suit bigger screens)
- add a sanitizer for strings (to avoid device names mess with the HTML output)
- add better (non-code file based) configuration method
- harden communication (to avoid misuse of the internally used WebSocket by malware)
- add error tolerance (e.g. if the SocketServer crashes or the UI looses the connection to it)
- better updating mechanism
- add a method to shut down the system from the UI (?)
- add a method to eject devices properly (?)

## Bad USB ?

Bad USB is describing attacks where USB devices "do more then they are intended to do". One example  would be a USB Stick that does not only contains a storage device (the typical thumb-drive / pen-drive) but also as a HID (Human Interface Device, e.g. a keyboard) that executes a script once it is connected with a computer.

### So what to do?

This tool tries to help you with the detection of exactly that above case - by allowing you to monitor what devices get registered once you plug an unknown piece of USB hardware into your computer.

To be as safe as possible this tool should be executed on an offline and read-only system (or any isolated system that is not in a network and can be restored easily). I designed it to run on an old Raspberry Pi 2B that I had lying around.  
By having thief tool running on that Raspberry Pi I can check untrusted devices before deciding if I plug them into my more important systems.

### Limitations

This tool **can** help you to **detect** if a USB device is more then what you expect it to be.  
It will **not protect** you against "physical" attacks (like frying your USB port or mainboard with over-voltage) and **will not block any execution** of a Bad USB attack!

The main protection is to run this on a device that is inexpensive, replaceable and does not contain anything valuable - so that any Bad USB attack you may encounter happens in an isolated sandbox first!

I am **trying my best** to make the UI in a way that any Bad USB that is aware of this tool can not trick you - **but I can not protect you 100%** against that! So always be careful, and when in doubt better just do not connect a device to your valuable machines!

## Using it

Here you can check what you need to have / what you need to run to use the tool.

There are also detailed instructions how to install this tool on a Raspberry PI / Raspbian in [this document](docs/raspberry-setup.md)...

### Requirements

- nodeJS with npm (best managed via nvm)
- Globally installed Sass compiler

### Installation

1. Clone the repository with the `git clone` command (recommended to update more easily at later times) or unpack the downloaded version in a folder on computer you intend to run it on.

2. Change into the directory where this `README.md` file is located

3. Run `npm install` do download the dependencies onto that computer

4. Run `./node_modules/.bin/electron-rebuild` to make sure the USB detector package matches the node version of the installed electron

### Running it

1. Open a console window in your desktop environment

2. `cd` into the folder where you cloned / copied the tool into

3. Run `npm start`

4. A UI should open (may take some time, depending on the power of your used hardware)

5. Hopefully that UI is self-explanatory enough - right now I am focussing on getting the tool ready to use and not on creating the perfect manual... ;)

### Configuring it

There are a few settings that can be changed by editing the file `src/config.ts`. The comments above teh settings should be self-explanatory.

## Improving it (development)

If you want to do any improvements or bug fixing you can use the `npm run dev` command to start TypeScript and SASS in watch mode.
Then open another terminal and run `npm run dev-ui` (or, if you are developing on windows, `npm run dev-ui-win`) to have a hot-reloading electron UI.

You can find the used messages for the communication between the nodeJS App part and the UI [here](docs/communication.md).
