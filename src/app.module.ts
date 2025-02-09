import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { SocketModule } from './socket/socket.module';
import { MessageModule } from './message/message.module';
import { MessageORM } from './message/message.entity';
import { ChatORM } from './chat/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '34.27.120.82',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [MessageORM, ChatORM],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ChatModule,
    SocketModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
