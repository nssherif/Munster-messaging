import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { SocketORM } from './socket.entity';
import { SocketInterface } from './sockets.interface';

@Injectable()
export class SocketService {
    private userToSocketMap: Map<string | string[], Socket> = new Map();
    private socketToUserMap: Map<string, string | string[]> = new Map();
    constructor (@InjectRepository(SocketORM) private socketRepository: Repository<SocketORM>) {}

    async storeSocket (payload: SocketInterface) {
        this.userToSocketMap.set(payload.user_id, payload.socket);
        this.socketToUserMap.set(payload.socket.id, payload.user_id);
    }

    getSocket (user_id: string | string[]): Socket{
        return this.userToSocketMap.get(user_id);
    }

    disconnect (socket: Socket) {
        let userID = this.socketToUserMap.get(socket.id);
        this.userToSocketMap.delete(userID);
        this.socketToUserMap.delete(socket.id);
    }

}
