import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatController } from '../chat.controller';
import { ChatORM } from '../chat.entity';
import { ChatService } from '../chat.service';
import { MessageORM } from '../../message/message.entity';
import { Repository } from 'typeorm';
import { BackendChatInterface } from '../chatBackend.interface';

describe('ChatController', () => {
  let controller: ChatController;
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
      controllers: [ChatController],
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

    controller = module.get<ChatController>(ChatController);
    chatRepository = module.get<Repository<ChatORM>>(chat_repository_token);
    messageRepository = module.get<Repository<MessageORM>>(message_repository_token);
  });

  describe('dependencyInjection', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
    it('chatRespository should be defined', () => {
      expect(chatRepository).toBeDefined();
    });
    it('messageRespository should be defined', () => {
      expect(messageRepository).toBeDefined();
    });
  });

  describe('createChat', () => {
    it('should create a chat', () => {
       controller.createChat(mockChat);
       expect(chatRepository.save).toHaveBeenCalledWith(mockChat);
    });
  });
});
