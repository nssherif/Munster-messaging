import { Socket } from 'socket.io';

export interface SocketInterface {
    user_id: string | string[],
    socket: Socket
}
