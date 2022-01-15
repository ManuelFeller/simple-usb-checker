# Communication between UI and Application

All communication between teh Ui and the node based Application is working via a WebSocket connection. In this section of teh documentation you can find details about the messages involved.

## Table of Contents

- [Communication between UI and Application](#communication-between-ui-and-application)
  - [Table of Contents](#table-of-contents)
  - [Basics](#basics)
    - [Server welcome message](#server-welcome-message)

## Basics

### Server welcome message

Once a client has connected it should receive the welcome message from the server

|||
|-|-|
| Direction: | Server to client |
| Content: | {type: 'welcome', data: 'ready to communicate'} |

