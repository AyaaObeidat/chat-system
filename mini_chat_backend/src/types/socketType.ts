import { ConversaionGetByParameter } from './../dtosInterfaces/conversationDtos';
import { MessageCreateParameters } from "../dtosInterfaces/messageDtos";
import { UserGetByParameter } from "../dtosInterfaces/userDtos";
import { Socket } from 'socket.io';

export interface ClientToServerEvents {
    userOnline: (userId: UserGetByParameter) => void;
    userOffline : (userId:UserGetByParameter) => void;
    sendMessage: (message:MessageCreateParameters) => void;
    isTyping: (data: { conversationId: ConversaionGetByParameter; userId: UserGetByParameter }) => void;
  }
  
  
export interface ServerToClientEvents {
    receiveMessage: (message: MessageCreateParameters )=> void;
    userOnline: (userId:UserGetByParameter) => void;
    isTyping: (userId: UserGetByParameter) => void;
    userOffline : (userId:UserGetByParameter) => void;
  }
  
  export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;