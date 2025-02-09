import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatORM } from '../../chat/chat.entity';
import { Repository } from 'typeorm';
import { MessageORM } from '../message.entity';
import { MessageService } from '../message.service';
import { ChatService } from '../../chat/chat.service';
import { MessageBackendInterface } from '../messageBackend.interface';

describe('MessageService', () => {
  let service: MessageService;
  const chat_repository_token = getRepositoryToken(ChatORM);
  const message_repository_token = getRepositoryToken(MessageORM);
  let chatRepository: Repository<ChatORM>;
  let messageRepository: Repository<MessageORM>;
  let mockMessage: MessageBackendInterface = {
    sender_id: "1",
    body: "test body",
    chatId: 1,
  }
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        ChatService,
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
        }  
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    chatRepository = module.get<Repository<ChatORM>>(chat_repository_token);
    messageRepository = module.get<Repository<MessageORM>>(message_repository_token);
  });

  describe('dependencyInjection', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('chatRespository should be defined', () => {
      expect(chatRepository).toBeDefined();
    });
    it('messageRespository should be defined', () => {
      expect(messageRepository).toBeDefined();
    });
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      let mock_id: number = parseInt('f90af9ec-5eda-46b8-b2a2-19bb1fc3bb7a');
      let mockMessage : MessageBackendInterface = {
        sender_id: "1",
        body: "test body",
        chatId: mock_id,
      }
      expect(await service.saveMessage(mockMessage)).resolves;
    });
    it('should create an invalid chatid error', async () => {
      let mockMessage : MessageBackendInterface = {
        sender_id: "1",
        body: "test body",
        chatId: 9999999,
      }
      expect(await service.saveMessage(mockMessage)).toBe("Error: chat or senderid does not exist");
    });
    it('should create an invalid sender id error', async () => {
      let mockMessage : MessageBackendInterface = {
        sender_id: "99999999999",
        body: "test body",
        chatId: 9999999,
      }
      expect(await service.saveMessage(mockMessage)).toBe("Error: chat or senderid does not exist");
    });
  })

  describe('getChatMessages', () => {
    it('should get chat messages', async () => {
      let mock_id: number = parseInt('f90af9ec-5eda-46b8-b2a2-19bb1fc3bb7a');
      expect(await service.getChatMessages(mock_id)).resolves;
    });
    it('should throw an invalid id message', async () => {
      let mock_id: number = parseInt('f90af9ec-5eda-46b8-b2a2-19bb1fc3bb7a');
      expect(await service.getChatMessages(mock_id)).toBe("Error: chat doesn't exist!");
    });
  });
});
