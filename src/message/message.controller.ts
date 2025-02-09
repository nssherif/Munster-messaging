import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageBackendInterface } from './messageBackend.interface';

@Controller('messages')
export class MessageController {
    constructor(private messageService: MessageService) {};

    @Get(':chat_id')
    getChatMessages(@Param('chat_id') chat_id: number) {
        console.log("Getting Chat Messages");
        return this.messageService.getChatMessages(chat_id);
    }
}
