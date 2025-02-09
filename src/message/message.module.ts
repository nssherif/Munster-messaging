import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageORM } from './message.entity';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { SocketService } from 'src/socket/socket.service';
import { SocketORM } from 'src/socket/socket.entity';
import { ChatService } from '../chat/chat.service';
import { ChatORM } from '../chat/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageORM]), TypeOrmModule.forFeature([SocketORM]), TypeOrmModule.forFeature([ChatORM])],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService, SocketService, ChatService]
})
export class MessageModule {}
