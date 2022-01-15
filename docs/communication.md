# Communication between UI and Application

All communication between the UI and the node based Application is working via a WebSocket connection. In this section of the documentation you can find details about the messages involved.

## Table of Contents

- [Communication between UI and Application](#communication-between-ui-and-application)
  - [Table of Contents](#table-of-contents)
  - [Basics](#basics)
    - [Server welcome message](#server-welcome-message)
    - [Device list request](#device-list-request)
    - [Device list](#device-list)
    - [Toggle detection request](#toggle-detection-request)

## Basics

In the following the nodeJS application is called `server` and the Ui is called `client` - as all communication is running via WebSocket...

### Server welcome message

Once a client has connected it should receive the welcome message from the server

|||
|-|-|
| Direction: | server to client |
| Content: | `{type: 'welcome', data: 'ready to communicate'}` |


### Device list request

When the client requests the list of connected devices

|||
|-|-|
| Direction: | client to server |
| Content: | `{type: 'ui-request', data: 'device-list'}` |

### Device list

The list of currently connected devices

|||
|-|-|
| Direction: | server to client |
| Content: | `{type: 'device-list', data: [DEVICE_DESCRIPTION_OBJECT_N]}` |

Device description objects look like this:

```javascript
{
  locationId: number,
  vendorId: number,
  productId: number,
  deviceName: string,
  manufacturer: string,
  serialNumber: string,
  deviceAddress: number
}
```

### Toggle detection request

When the client requests to toggle the current detection / monitoring status

|||
|-|-|
| Direction: | client to server |
| Content: | `{type: 'ui-request', data: 'toggle-detection'}` |
