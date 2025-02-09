import { Test, TestingModule } from '@nestjs/testing';
import { SocketService } from '../../socket/socket.service';
import { ChatService } from '../../chat/chat.service';
import { MessageGateway } from '../message.gateway';
import { MessageService } from '../message.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatORM } from '../../chat/chat.entity';
import { MessageORM } from '../message.entity';
import { SocketORM } from '../../socket/socket.entity';
import { Repository } from 'typeorm';
import { Socket, Server } from 'socket.io';
import { MessageBackendInterface } from '../messageBackend.interface';


describe('MessageGateway', () => {
  let gateway: MessageGateway;
  const chat_repository_token = getRepositoryToken(ChatORM);
  const message_repository_token = getRepositoryToken(MessageORM);
  const socket_repository_token = getRepositoryToken(SocketORM);
  let chatRepository: Repository<ChatORM>;
  let messageRepository: Repository<MessageORM>;
  let socketRepository: Repository<MessageORM>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageGateway,
        ChatService,
        MessageService,
        SocketService,
        {
            provide: chat_repository_token,
            useValue: {
              save: jest.fn(),
              findOne: jest.fn(),
              creat: jest.fn()
            }
          },
          {
            provide: message_repository_token,
            useValue: {
              save: jest.fn(),
              findOne: jest.fn(),
              creat: jest.fn()
            }
          },
          {
            provide: socket_repository_token,
            useValue: {
              save: jest.fn(),
              findOne: jest.fn(),
              creat: jest.fn()
            }
          }    
    ],
    }).compile();

    gateway = module.get<MessageGateway>(MessageGateway);
    chatRepository = module.get<Repository<ChatORM>>(chat_repository_token);
    messageRepository = module.get<Repository<MessageORM>>(message_repository_token);
    socketRepository = module.get<Repository<MessageORM>>(socket_repository_token);
  });

  describe('dependencyInjection', () => {
    it('should be defined', () => {
      expect(gateway).toBeDefined();
    });
    it('chatRespository should be defined', () => {
      expect(chatRepository).toBeDefined();
    });
    it('messageRespository should be defined', () => {
      expect(messageRepository).toBeDefined();
    });
    it('socketRepository should be defined', () => {
        expect(socketRepository).toBeDefined();
      });
  });

  describe('socket connection', () => {
    it('should throw invalid socket error', async () => {
      let mockSocket: Socket;
      expect(await gateway.handleConnection(mockSocket)).toBe("Undefined socket");
    });
    it('should throw invalid server error', async () => {
      let mockServer: Server;
      expect(await gateway.afterInit(mockServer)).toBe("Undefined server");
    });
  });

  describe('socket disconnect', () => {
    it('should throw invalid socket error', async () => {
      let mockSocket: Socket;
      expect(await gateway.handleDisconnect(mockSocket)).toBe("Undefined socket");
    });
  });

  describe('messageThroughSocket', () => {
    it('should throw invalid socket error', async () => {
      let mockSocket: Socket;
      let mockPayload: MessageBackendInterface = {
        sender_id: "1",
        body: "test message",
        chatId: 1
      };
      expect(await gateway.handleMessage(mockSocket, mockPayload)).toBe("Undefined socket");
    });
  });
});