# Running on Raspberry Pi

This manual helps you to set up a freshly installed Raspberry Pi to run this application.

To not run out of disk space during installation make sure you have expanded the file system already!

Also, as a Raspberry PI with a display may use quite a bit of power already, make sure the used power supply can deliver enough current!  
In my setup (Raspberry Pi 2B with a [3.5" Touchscreen connected via GPIO](http://www.lcdwiki.com/MHS-3.5inch_RPi_Display)) **a 2A power supply already ran into under-voltage issues** when plugging in a normal USB device that uses the normal specified 500mA. So a 2.5A or a 3A power supply is highly recommended for this setup.

## Install nvm & nodeJS

To be able to switch between node versions later on my recommendation would be to install the Node Version Manager.
The bets way to install it is by looking at the Installation instructions on [GitHub](https://github.com/nvm-sh/nvm#installing-and-updating)

In case you are executing these commands via SSH you may have to re-connect after installation; else you will not have the `nvm` command available...

Now we need to choose a nodeJS version to install; the best would be to go with the latest LTS version. You can install that via `nvm install --lts`.

## Install dependencies for building the `usb-detection` package

In order to be able to compile the `usb-detection` package during the following installation you will need to ensure that two packages are available on the system. I have included them here, but you may want to look for updates at [the GitHub readme](https://github.com/MadLittleMods/node-usb-detection#development-compile-from-source) of the library.

### Package `build-essential`

This package should already be there. To check run `apt-cache policy build-essential`. The output should be something like this:

```
build-essential:
  Installed: 12.9
  Candidate: 12.9
  Version table:
 *** 12.9 500
        500 http://raspbian.raspberrypi.org/raspbian bullseye/main armhf Packages
        100 /var/lib/dpkg/status
```

If it is not installed you will see the message `N: Unable to locate package build-essential` and have to run `sudo apt-get install build-essential` to install it.

### Package `libudev-dev`

This package is normally not pre-installed. So directly run `sudo apt-get install libudev-dev`. If it is already installed you will get a message that the latest version is already installed, so nothing should break in that case...

## Install the application

In this example the latest code in the `main` branch will be cloned - you can also decide to download a specific version manually.

### Download and pre-build

First step is to clone the repository by executing `git clone https://github.com/ManuelFeller/simple-usb-checker.git`. Once that is done change into the directory by executing `cd simple-usb-checker`.

Then run `npm install` do download the dependencies onto that computer and compile everything for the platform. Be aware that this may take a long time (on my Raspberry Pi 2B it took more then 10 minutes).

To make sure that everything works with the freshly added version of Electron you need to do a rebuild for the nodeJS version that is included. To do so run `./node_modules/.bin/electron-rebuild`. This may show a few warning messages, but as long as it ends with `✔ Rebuild Complete` everything should be working fine.

Finally you need to make sure that the Sass compiler is available. Run `npm install -g sass` to do so.

### Configuration

In case you want to change any settings run `nano src/config.ts` (or any other command line based editor of your choice) and change the settings according to your needs. The comments should explain what each setting does. Also keep in mind that there are limited sanity checks, so don't purposely mess with it

## First run

To test if everything works you will need to open a console on the desktop. It is your decision if you want to do this on the device (with keyboard and mouse connected) or via VNC.

1. Open a terminal on the Desktop
2. Change into the directory with the application (normally `cd simple-usb-checker` should do the trick)
3. Run it via `npm start` - it may take a bit (on my Raspberry Pi 2B it took about 45 seconds until the application was ready), but at one point you should see the Application being ready

## Optional steps

If you plan to use this tool as a standalone device there are a few more things to consider

### Disable screen blanking

Press the `Menu` button on the upper right (Raspberry Pi Icon) -> `Preferences` -> `Raspberry Pi Configuration` -> Tab `Display` -> set the option `Screen blanking` to `disabled`, confirm with `OK` and say `Yes` when you are asked for a reboot. But be aware that this may lead to burn-ins of you run the device 24/7...

### Auto-start the application

*to be written*

### Read-only system

You may want to protect the system and make if fully read-only (so that any changes done by any Bad USB devices or malware are reverted once you reboot).

