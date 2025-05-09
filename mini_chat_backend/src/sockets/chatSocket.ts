import { Server } from 'socket.io';
import { TypedSocket } from '../types/socketType';
import { UserService } from '../services/userService';
import { MessageService } from '../services/messageService';
import { MessageCreateParameters } from '../shared/dtosInterfaces/messageDtos';
import { AppError } from '../middlewares/errorMiddlewares';
import { onlineUsers } from '../config/socket';

export const registerChatHandlers = (
  io: Server,
  socket: TypedSocket,
  userService: UserService,
  messageService: MessageService
) => {
  const authenticatedUser = socket.data.user;

  socket.on('userOnline', async () => {
    try {
      console.log('🟢User online:', authenticatedUser.id);
      socket.broadcast.emit('userOnline', { id: authenticatedUser.id });
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to set user online status');
    }
  });

  socket.on('userOffline', async () => {
    try {
      console.log('🔴User offline:', authenticatedUser.id);
      socket.broadcast.emit('userOffline', { id: authenticatedUser.id });
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to set user offline status');
    }
  });

  socket.on('joinConversation', async ({ conversationId }) => {
    try {
      socket.join(conversationId);
      console.log(`User ${authenticatedUser.id} joined conversation ${conversationId}`);
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to join conversation');
    }
  });

  socket.on('leaveConversation', ({ conversationId }) => {
    try {
      socket.leave(conversationId);
      console.log(`User ${authenticatedUser.id} left conversation ${conversationId}`);
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to leave conversation');
    }
  });

  socket.on('sendMessage', async (message: MessageCreateParameters) => {
    try {
      console.log('Sending message:', message);

      if (message.senderId !== authenticatedUser.id) {
        throw AppError.unauthorized('Unauthorized: Cannot send messages as another user');
      }

      const newMessage = await messageService.sendMessage(message);

      // تحقق إذا المستخدم منضم للمحادثة
      if (!socket.rooms.has(newMessage.conversationId)) {
        socket.join(newMessage.conversationId);
      }

      // بث الرسالة للمشاركين بالمحادثة
      io.to(newMessage.conversationId).emit('receiveMessage', {
        id: newMessage.id,
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        content: newMessage.content,
        createdAt: newMessage.createdAt.toISOString(),
        isRead: newMessage.isRead,
      });
    } catch (error) {
      if (error instanceof AppError) {
        socket.emit('error', error.message);
      } else {
        socket.emit('error', error instanceof Error ? error.message : 'Failed to send message');
      }
    }
  });

  socket.on('isTyping', async ({ conversationId }) => {
    try {
      socket.to(conversationId).emit('isTyping', { id: authenticatedUser.id });
      console.log(`User ${authenticatedUser.id} is typing in conversation ${conversationId}`);
    } catch (error) {
      socket.emit('error', error instanceof Error ? error.message : 'Failed to send typing indicator');
    }
  });

  socket.on('getOnlineUsers', (_, callback) => {
    if (typeof callback === 'function') {
      callback(Array.from(onlineUsers));
    }
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('userOffline', { id: authenticatedUser.id });
  });
};
