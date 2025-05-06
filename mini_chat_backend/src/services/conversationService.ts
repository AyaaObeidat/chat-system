import { ConversaionGetByParameter } from '../shared/dtosInterfaces/conversationDtos';
import { ConversationsRepository } from '../repositories/conversationsRepository';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { MESSAGES } from '../constants/messages';
import { AppError } from '../middlewares/errorMiddlewares';
import { PaginatedResult, PaginationParams } from '../shared/dtosInterfaces/paginationDtos';
import { paginate } from '../utils/paginationUtils';
import { UserRepository } from '../repositories/userRepository';
import User from '../models/User';

export class ConversationService {
  _userRepository: UserRepository;
  constructor(private _conversationRepository: ConversationsRepository) {
    this._userRepository = new UserRepository();
  }

  public deleteConversation = async (parameter: ConversaionGetByParameter): Promise<void> => {
    try {
      const conversation = await this._conversationRepository.getById(parameter.id);
      if (!conversation) throw AppError.notFound(MESSAGES.CONVERSATION.NOT_FOUND);
      await this._conversationRepository.delete(conversation);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Failed to delete conversation', 500);
    }
  };

  public getAllConversations = async (): Promise<Conversation[]> => {
    try {
      const conversations = await this._conversationRepository.getAll();
      if (!conversations || conversations.length === 0) {
        throw AppError.notFound(MESSAGES.CONVERSATION.NOT_FOUND);
      }
      return conversations;
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new AppError('Failed to get all conversations', 500);
    }
  };

  public getConversationById = async (id: string): Promise<Conversation> => {
    try {
      const conversation = await this._conversationRepository.getById(id);
      if (!conversation) throw AppError.notFound(MESSAGES.CONVERSATION.NOT_FOUND);
      return conversation;
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new AppError('Failed to get conversation by ID', 500);
    }
  };

  public getConversationMessages = async (
    id: string,
    paginationParams?: PaginationParams
  ): Promise<PaginatedResult<Message> | []> => {
    try {
      const conversation = await this._conversationRepository.getById(id);
      if (!conversation) return [];

      const messages = conversation.messages;
      const sortedMessages = [...messages].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const page = paginationParams?.page || 1;
      const limit = paginationParams?.limit || 10;

      return paginate(sortedMessages, page, limit);
    } catch (error) {
      throw new AppError('Failed to get conversation messages', 500);
    }
  };

  public getConversationUsers = async (id: string): Promise<User[]> => {
    try {
      const conversation = await this._conversationRepository.getById(id);
      if (!conversation) throw AppError.notFound(MESSAGES.CONVERSATION.NOT_FOUND);

      return conversation.users;
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new AppError('Failed to get conversation users', 500);
    }
  };

  public getUserConversations = async (
    id: string,
    paginationParams?: PaginationParams
  ): Promise<PaginatedResult<Conversation>> => {
    try {
      const user = await this._userRepository.getUserConversations(id);
      if (!user) throw AppError.notFound(MESSAGES.USER.NOT_FOUND);

      const userConversations = user.conversations;

      userConversations.forEach((conversation) => {
        conversation.messages?.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      const sortedUserConversations = [...userConversations].sort((a, b) => {
        const aLastMessage = a.messages?.[a.messages.length - 1];
        const bLastMessage = b.messages?.[b.messages.length - 1];
        const aTime = aLastMessage ? new Date(aLastMessage.createdAt).getTime() : 0;
        const bTime = bLastMessage ? new Date(bLastMessage.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      const page = paginationParams?.page || 1;
      const limit = paginationParams?.limit || 10;

      return paginate(sortedUserConversations, page, limit);
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new AppError('Failed to get user conversations', 500);
    }
  };
}
