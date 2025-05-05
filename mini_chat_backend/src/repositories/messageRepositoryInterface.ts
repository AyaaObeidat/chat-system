export interface IMessageRepository<Message> {
    add(data: any): Promise<Message>;
    getAll(): Promise<Message[]>;
    getById(id: string): Promise<Message | null>;
    getBySender_IdAndReceiver_Id(senderId:string,receiverId:string):Promise<Message|null>;
    delete(entity: Message): Promise<void>;
    update(entity: Message): Promise<void>;
  }
  