import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageBackendInterface } from 'src/message/messageBackend.interface';
import { Repository } from 'typeorm';
import { MessageORM } from '../message/message.entity';
import { MessageService } from '../message/message.service';
import { ChatORM } from './chat.entity';
import { BackendChatInterface } from './chatBackend.interface';
import { ChatResponseInterface } from './chatResponse.entity';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatORM) private chatRepository: Repository<ChatORM>,
        @InjectRepository(MessageORM) private messageRepository: Repository<MessageORM>,
      ) {}

    async  createChat(payload: BackendChatInterface): Promise<BackendChatInterface> {
        console.log(`payload in chat service: ${JSON.stringify(payload)}`);
        return await this.chatRepository.save(payload);
    }

    async getUserChats(user_id: number): Promise<ChatResponseInterface[]> {
        const userChats = this.chatRepository.find({where: [{user1_id: user_id},{user2_id: user_id}]});
        console.log(`User chats: ${(await userChats).length}`);

        let response = [];
        if ((await userChats).length!=0) {
            for (const chat of await userChats) {
                let connectionName = "";
                if (chat.user1_id == user_id) {
                    connectionName = chat.user2_name;
                } else if (chat.user2_id == user_id) {
                    connectionName = chat.user1_name;
                }
                // check if there are no messages yet
                if (chat.latest_message_id != null) {
                    let latestMessage = await this.messageRepository.findOne({where: {message_id: chat.latest_message_id}});
                    response.push({"chat_id": chat.chat_id, "chat_empty": false, "connection_name": connectionName, "latest_message_sender_id": latestMessage.sender_id, "latest_message_body": latestMessage.body})
                }
                else {
                    response.push({"chat_id": chat.chat_id, "chat_empty": true, "connection_name": connectionName})
                }
            };
        }
        return response;
    }

    async getChat(chatId: number, withMessages: boolean = false): Promise<ChatORM> {
        return await this.chatRepository.findOne({where: {chat_id: chatId}, relations: {messages: withMessages}});
    }

    async updateChatLastMessage(chatORM: ChatORM, newMessageId: number): Promise<ChatORM> {
        chatORM.latest_message_id = newMessageId;
        return await this.chatRepository.save(chatORM);
    }
}