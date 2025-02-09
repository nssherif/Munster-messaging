import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketController } from './socket.controller';
import { SocketORM } from './socket.entity';
import { SocketService } from './socket.service';

@Module({
    imports: [TypeOrmModule.forFeature([SocketORM])],
    controllers: [SocketController],
    providers: [SocketService]
})
export class SocketModule {}
