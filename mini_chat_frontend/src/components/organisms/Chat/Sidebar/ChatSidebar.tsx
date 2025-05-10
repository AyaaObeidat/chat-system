import { useState, useEffect } from "react";
import ContactItem from "../../../molecules/ChatSidebar/ContactItem/ContactItem";
import Search from "../../../molecules/ChatSidebar/Search/Search";
import styles from "./ChatSidebar.module.css";
import { User } from "../Messagebar/Messagebar";
import { useSidebarPagination } from "../../../../hooks/useSidebarPagination";
import { getAllUsers } from "../../../../services/userService";
import { useNavigate } from "react-router-dom"; 
import { logout } from "../../../../services/api/authService";

interface SidebarContact {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  conversationId: string;
  lastMessageTime: string;
}

interface ChatSidebarProps {
  contacts: SidebarContact[];
  onSelectConversation: (conversationId: string, user: User) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  onSelectConversation,
}) => {
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<SidebarContact[] | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const users = await getAllUsers();
  
      const transformed = users.map((user) => ({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        conversationId: "",
        lastMessageTime: "",
      }));
  
      setAllUsers(transformed);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchActive && !allUsers) {
        fetchAllUsers();
      }
    }, 500);
    console.log("allUsers", allUsers);
    return () => clearTimeout(delay);
  }, [searchActive, allUsers]);

  const baseContacts = searchActive ? allUsers ?? [] : contacts;

  const { visibleItems: filteredContacts, observerRef } = useSidebarPagination(
    baseContacts,
    query,
    (contact, q) =>
      contact.user.fullName.toLowerCase().includes(q.toLowerCase()) ||
      contact.user.email.toLowerCase().includes(q.toLowerCase())
  );


  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate("/loginPage");
  };

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.contactsCard}>
        <Search
          query={query}
          setQuery={(value) => {
            setQuery(value);
            setSearchActive(value.trim() !== "");
          }}
          onFocus={() => {
            fetchAllUsers();
          }}
        />
        <div className={styles.contactsList}>
          {loading ? (
            <div>Loading...</div>
          ) : filteredContacts.length > 0 ? (
            <>
              {filteredContacts.map((contact, index) => (
                <ContactItem
                  key={index}
                  user={{
                    ...contact.user,
                    lastActivity: contact.lastMessageTime,
                  }}
                  time={contact.lastMessageTime}
                  onClick={() =>
                    onSelectConversation(contact.conversationId, contact.user)
                  }
                />
              ))}

              <div ref={observerRef} style={{ height: "1px" }} />
            </>
          ) : (
            <div className={styles.noResults}>No results found...</div>
          )}
        </div>
      </div>
        <div className={styles.logoutContainer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
    </div>
  );
};

export default ChatSidebar;
