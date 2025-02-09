import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
   } from 'typeorm';
import { ChatORM } from '../chat/chat.entity';
    
@Entity()
export class MessageORM {
    @PrimaryGeneratedColumn('increment')
    message_id: number;

    @Column()
    sender_id: string;

    @Column()
    body: string;

    @ManyToOne(() => ChatORM, (chat) => chat.messages, {
        cascade: true,
    })
    chat: ChatORM

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;
}