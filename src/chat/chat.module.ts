import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatORM } from './chat.entity';
import { MessageGateway } from 'src/message/message.gateway';
import { SocketService } from 'src/socket/socket.service';
import { MessageService } from '../message/message.service';
import { MessageORM } from '../message/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatORM]),TypeOrmModule.forFeature([MessageORM])],
  controllers: [ChatController],
  providers: [ChatService, MessageService]
})
export class ChatModule {}
