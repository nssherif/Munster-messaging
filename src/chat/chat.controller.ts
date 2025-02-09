import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageBackendInterface } from 'src/message/messageBackend.interface';
import { BackendChatInterface } from './chatBackend.interface';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {};

    @Post('create')
    createChat(@Body() payload: BackendChatInterface) {
        console.log(`Chat controller creating a chat`);
        return this.chatService.createChat(payload);
    }

    @Get(':user_id')
    getUserChats(@Param('user_id') user_id: number) {
        console.log(`Chat controller getting chats for user id: ${user_id}`);
        return this.chatService.getUserChats(user_id);
    }
}
