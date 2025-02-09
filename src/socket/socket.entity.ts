import { JSONValue } from 'postgres';
import { Socket } from 'socket.io';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
   } from 'typeorm';
import { TestInterface } from './test.interface';
    
@Entity()
export class SocketORM {
    @PrimaryGeneratedColumn('uuid')
    socket_id: number;

    @Column('json', {nullable: true})
    socket: TestInterface;

    @Column()
    user_id: number;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;
}