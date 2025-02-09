import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany
   } from 'typeorm';
import { MessageORM } from '../message/message.entity';
    
@Entity()
export class ChatORM {
    @PrimaryGeneratedColumn('increment')
    chat_id: number;

    @Column()
    user1_id: number;

    @Column()
    user1_name: string;

    @Column()
    user2_id: number;
    
    @Column()
    user2_name: string;

    @Column({nullable: true})
    latest_message_id: number;

    @OneToMany(() => MessageORM, (message) => message.chat)
    messages: MessageORM[]

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;
}