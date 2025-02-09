import { Body, Param } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket/socket.service';
import { MessageBackendInterface } from './messageBackend.interface';
import { MessageService } from './message.service';
import { ChatService } from '../chat/chat.service';
import e from 'express';

@WebSocketGateway()
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private socketService: SocketService, private messageService: MessageService, private chatService: ChatService) {};

  @WebSocketServer() server: Server;

  async afterInit(server: Server) {
    if (server == undefined) {
      return ("Undefined server");
    }
    else {
      console.log("Server init");
    }
  }

  async handleConnection(socket: Socket) {
    try {
      if (socket == undefined) {
        return ("Undefined socket");
      }
      else {
        console.log(`Socket connected with Data: ${JSON.stringify(socket.handshake.query)}`);
        await this.socketService.storeSocket({"user_id": socket.handshake.query.id, "socket": socket});
      }
    } catch (error) {
      return ("Undefined socket");
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      if (socket == undefined) {
        return ("Undefined socket");
      }
      else {
        this.socketService.disconnect(socket);
        console.log(`Client disconnected: ${socket.id}`);
      }
    } catch (error) {
      return ("Undefined socket");
    }
  }

  @SubscribeMessage('send_message_to_server')
  async handleMessage(socket: Socket, payload: MessageBackendInterface) {

    try {
      if (socket == undefined) {
        return ("Undefined socket");
      }
      else {
        console.log(`message received on server ${JSON.stringify(payload)}`);
    
        let chat = await this.chatService.getChat(payload.chatId);

        if (!(await chat)) {
          return ("Error: invalid chat id");
        }
        else {
          let receiver_id = '';
          if (parseInt(payload.sender_id) == chat.user1_id) {
            receiver_id = chat.user2_id.toString();
          } else if (parseInt(payload.sender_id) == chat.user2_id) {
            receiver_id = chat.user1_id.toString();
          }      
          console.log(`is connection active? ${this.socketService.getSocket(payload.sender_id)}`);
          console.log(`receiever ID: ${receiver_id}`);
      
          if (this.socketService.getSocket(receiver_id) == undefined) {
            // connection is not online, send a notification using API from notification team (to be implemented later)
          }
          else { 
            // If connection is online, send a message to him directly though websockets
            console.log(`receiever ID: ${receiver_id}`);
            this.socketService.getSocket(receiver_id).emit('receive_message_from_server', payload);
          }
          const message = this.messageService.saveMessageAndGetID(payload, chat);
          this.chatService.updateChatLastMessage(chat , (await message).message_id);
        };
      }
    } catch (error) {
      return ("Undefined socket");
    }
  }
}