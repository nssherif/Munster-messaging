import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'rxjs';
import { ChatORM } from 'src/chat/chat.entity';
import { Repository } from 'typeorm';
import { ChatService } from '../chat/chat.service';
import { MessageORM } from './message.entity';
import { MessageBackendInterface } from './messageBackend.interface';
import { MessageResponseInterface } from './messageResponse.interface';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageORM) private messageRepository: Repository<MessageORM>,
        private chatService: ChatService,
    ) {}

    async saveMessage(message: MessageBackendInterface) {
        console.log(`saving message in message servie: ${JSON.stringify(message)}`);
        const chat = this.chatService.getChat(message.chatId,true);
        //console.log(`saving message in message service: ${JSON.stringify((await chat).chat_id)}`);
        if (!(await chat)) {
            return ("Error: chat or senderid does not exist");
        }
        else {
            await this.messageRepository.save(message);
            return ("Successfully saved message");
        }
    }

    async saveMessageAndGetID(message: MessageBackendInterface, chat: ChatORM): Promise<MessageORM> {
        console.log(`saving message in message servie: ${JSON.stringify(message)}`); 
        const payload = {"sender_id": message.sender_id, "body": message.body, "chatId": message.chatId, "chat": chat};       
        return await this.messageRepository.save(payload);
    }

    async getChatMessages(chat_id: number) {
        const chat = this.chatService.getChat(chat_id,true);
        let response = [];

        if (!(await chat)) {
            return ("Error: chat doesn't exist!");
        }
        else {
            for (const message of (await chat).messages) {
                response.push({"sender_id": message.sender_id, "body": message.body, "createdAt": message.createdAt});
            }
            return response;
        }
    }

    // async getMessage(messageId: number): Promise<MessageORM>{
    //     return await this.messageRepository.findOne({where: {message_id: messageId}});
    // }
}
