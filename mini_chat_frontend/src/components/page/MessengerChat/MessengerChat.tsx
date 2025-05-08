import React, { JSX, useEffect, useState } from "react";
import styles from "./MessengerChat.module.css";
import ChatSidebar from "../../organisms/Chat/Sidebar/ChatSidebar";
import Messagebar from "../../organisms/Chat/Messagebar/Messagebar";
import SidebarImage from "../../../assets/images/sidebar.jpg";
import { SocketProvider } from "../../../contexts/SocketContext";
import { userStorage } from "../../../utils/storage";
import { getUserConversations } from "../../../services/userService";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface SidebarContact {
  user: User;
  conversationId: string;
  lastMessageTime: string;
}

const MessengerChat: React.FC = (): JSX.Element => {
  const [contacts, setContacts] = useState<SidebarContact[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<any | null>(null);

  useEffect(() => {
    const loadUserAndContacts = async () => {
      const loadedUser = userStorage.load();
      if (!loadedUser) return;
      setCurrentUser(loadedUser);

      try {
        const conversations = await getUserConversations(loadedUser.id);
      
        const formattedContacts: SidebarContact[] = conversations.map((conv) => {
          const otherUser = conv.users.find(u => u.id !== loadedUser.id)!;
          const lastMessage = conv.messages?.[conv.messages.length - 1];
          return {
            user: otherUser,
            conversationId: conv.id,
            lastMessageTime: lastMessage?.createdAt || "No messages",
          };
        });
      
        setContacts(formattedContacts);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    loadUserAndContacts();
  }, []);

  const handleSelectConversation = (conversationId: string, user: User) => {
    setActiveConversationId(conversationId);
    setOtherUser(user);
    
    // Find the selected contact from the contacts list
    const selectedContact = contacts.find(contact => contact.conversationId === conversationId);
    if (selectedContact) {
      setOtherUser(selectedContact.user);
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <SocketProvider>
      <div className={styles.chatPage}>
        <img src={SidebarImage} className={styles.sidebarImage} alt="Sidebar" />
        <div className={styles.chatContainer}>
          <ChatSidebar
            contacts={contacts}
            onSelectConversation={handleSelectConversation}
          />
          {activeConversationId && otherUser ? (
            <Messagebar
              currentUser={currentUser}
              otherUser={otherUser}
              conversationId={activeConversationId}
            />
          ) : (
            <div className={styles.emptyMessagebar}>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </SocketProvider>
  );
};

export default MessengerChat;
