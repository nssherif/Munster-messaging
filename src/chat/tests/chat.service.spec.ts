import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageORM } from '../../message/message.entity';
import { ChatORM } from '../chat.entity';
import { ChatService } from '../chat.service';
import { BackendChatInterface } from '../chatBackend.interface';

describe('ChatService', () => {
  let service: ChatService;
  const chat_repository_token = getRepositoryToken(ChatORM);
  const message_repository_token = getRepositoryToken(MessageORM);
  let chatRepository: Repository<ChatORM>;
  let messageRepository: Repository<MessageORM>;
  let mockChat: BackendChatInterface = {
    user1_id: 1,
    user1_name: "test",
    user2_id: 2,
    user2_name: "test2",
    latest_message_id: 99
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<ChatService>(ChatService);
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

  describe('createChat', () => {
    it('should create a new chat', async () => {
      await service.createChat(mockChat);
      expect(chatRepository.save).toHaveBeenCalledWith(mockChat);
    });
  })

  describe('getChat', () => {
    it('should return a chat', async () => {
      await service.getChat(1);
      expect(chatRepository.find).resolves;
    });
  })
});
