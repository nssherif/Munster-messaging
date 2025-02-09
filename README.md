<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Messaging Microservice

## Disclaimer
This repo was copied as I lost access to the forked Repo after graduating from Memorial University

## Description

This is a messaging microservice that was build using nest js that allows users to communication with each other in real time. There are additional features that this microservice provides as well, for that please jump to the how to use section of this document. 
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# How to use this microservice

This microservice exposes the following API endpoints. 

# 1. Getting all user chats

**API endpont:** https://msg3-5tgazausrq-uc.a.run.app/api/chat/{user_id}

**Method:** GET

**Required:**
- user_id: This is an integer corresponding to the user id saved in the database.

**Description:** This API gets all the connection names along with the latest messages that the user has with all connections. If the chat_empty field is true in the response, then it means that the user has a chat with the specified connection, but they do not have any messages between each other yet. 

**Example request:**
```
https://msg3-5tgazausrq-uc.a.run.app/api/chat/5
```
**Example response:**
```
[
  {
      "chat_id": 4,
      "chat_empty": false,
      "connection_name": "Negib",
      "latest_message_sender_id": "4",
      "latest_message_body": "good how are you?"
  },
  {
      "chat_id": 6,
      "chat_empty": true,
      "connection_name": "Negib Sherif"
  }
]
```

# 2. Getting all user messages

**API endpont:** https://msg3-5tgazausrq-uc.a.run.app/api/messages/{chat_id}

**Method:** GET

**Required:**
- chat_id: This is an integer corresponding to the chat id saved in the database.

**Description:** This API gets all the messages between two users in a chat. The response in an array of json object where each json object is a message. Each object contains the message body, the sender_id, and the date and time that the message was sent. 

**Example request:**
```
https://msg3-5tgazausrq-uc.a.run.app/api/messages/4
```
**Example response:**
```
[
  {
      "sender_id": "5",
      "body": "Hello sir",
      "createdAt": "2022-11-26T00:12:15.743Z"
  },
  {
      "sender_id": "4",
      "body": "Hello",
      "createdAt": "2022-11-26T00:13:21.180Z"
  },
  {
      "sender_id": "5",
      "body": "How are you doing",
      "createdAt": "2022-11-26T00:13:44.223Z"
  },
  {
      "sender_id": "4",
      "body": "good how are you?",
      "createdAt": "2022-11-26T00:13:58.436Z"
  }
]
```

# 3. Creating a chat

**API endpont:** https://msg3-5tgazausrq-uc.a.run.app/api/chat/create

**Method:** POST

**Required:**
- request body: The request body conatins all the information needed to create a chat between two users. Below is an example.

**Example request body:** 
```
{
    "user1_id": 1,
    "user1_name": "Ahmed",
    "user2_id": 2,
    "user2_name": "Negib"
}
```
**Description:** This API creates an chat entry in the database between two users. It returns a json response with the chat_id and the names of the two users along with their ids.   

**Example request:**
```
https://msg3-5tgazausrq-uc.a.run.app/api/chat/create
```
**Example response:**
```
{
  "user1_id": 1,
  "user1_name": "Ahmed",
  "user2_id": 2,
  "user2_name": "Negib",
  "latest_message_id": null,
  "chat_id": 7,
  "createdAt": "2022-11-27T00:28:59.739Z"
}
```

# 4. Sending a message between two users

**Description:** Sending a message between two users is done using websockets with a udp connection. This is because websockets allow users to send messages in real time and because the server can send messages to the users. Below is the sequence of steps one needs to follow in order to send a message using websockets. 

### **Step 1. Connect a user to a websocket.**  
You will have to install socket.io-client before this step. Below is an example of how you can connect to a socket in a javascript file. You will have also specify the ID of the user. 
Example: 
```
import {io} from 'socket.io-client'; 
const socket = io("https://msg3-5tgazausrq-uc.a.run.app", {query: {id: "1"}});
```

### **Step 2. Connect a second user to a websocket.**  
Follow the exact same steps as the previous step with the only difference being the id.
Example: 
```
import {io} from 'socket.io-client'; 
const socket = io("https://msg3-5tgazausrq-uc.a.run.app", {query: {id: "2"}});
``` 
### **Step 3. Send a message using websocket.** 
Now that both users are connected, when a user want to send out a message, they will have to use the emit function. The first parameter is what the server will listen to so it must match. The second parameter is where you would specifiy the sender id, message and the chat id. **Note:** The json key values are case sensitive. 
Example: 
```
socket.emit('send_message_to_server', {
    "sender_id": "1",
    "body": 'Hi',
    "chatId": 5,
  });
```

### **Step 4. Receive the message.** 
Once the server gets a message, the server will emit a message to the socket of the user who the message is intended to go to. Thus, all users should also be listening to be able to accept messages. 
Example: 
```
socket.on('receive_message_from_server', (response) => {
  console.log("message received from server", response.body , '\n');
})
```
The response contains the following. 
```
{ sender_id: '1', body: 'Hi', chatId: 5 }
```

**Example request:**
```
https://msg3-5tgazausrq-uc.a.run.app/api/chat/create
```
**Example response:**
```
{
  "user1_id": 1,
  "user1_name": "Ahmed",
  "user2_id": 2,
  "user2_name": "Negib",
  "latest_message_id": null,
  "chat_id": 7,
  "createdAt": "2022-11-27T00:28:59.739Z"
}
```
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Credits

- Ahmed Hassan - [Ahmed Hassan](https://github.com/afhassan)
- Negib Sherif - [Negib Sherif](https://github.com/nssherif)

## License
Nest is [MIT licensed](LICENSE).
