import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Generate consistent avatar colors based on name
const getAvatarGradient = (name) => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)",
  ];
  const index = name ? name.charCodeAt(0) % gradients.length : 0;
  return gradients[index];
};

const TopRightControls = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("/uploads")) return `http://localhost:5000${avatar}`;
    return avatar;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="footer-btn"
        title="Toggle Theme"
      >
        {theme === 'light' ? '🌜' : '☀️'}
      </button>

      {/* Profile Link */}
      <Link
        to="/profile"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'var(--text-color)',
          fontWeight: '500',
          padding: "6px 12px",
          borderRadius: "25px",
          transition: "background 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-bg)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <span style={{ fontSize: "0.9rem" }}>{user?.name}</span>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: getAvatarUrl(user?.avatar)
            ? `url(${getAvatarUrl(user?.avatar)}) center/cover`
            : getAvatarGradient(user?.name),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {!getAvatarUrl(user?.avatar) && user?.name?.charAt(0).toUpperCase()}
        </div>
      </Link>
    </div>
  );
};

export default function ChatWindow({ selectedUser, conversation }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  // fetch messages via REST
  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      const { data } = await api.get(
        `/api/chat/message/${conversation._id}`
      );
      setMessages(data);
    };

    fetchMessages();
  }, [conversation]);

  // listen for real-time messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (message.conversation === conversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("messagesRead", ({ conversationId }) => {
      if (conversation?._id === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender._id === user._id ? { ...msg, status: "read" } : msg
          )
        );
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messagesRead");
    };
  }, [conversation, user]);

  if (!selectedUser || !conversation) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "var(--chat-bg)",
          color: "var(--text-color)"
        }}
      >
        {/* Top Header for Empty State */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '14px 24px',
          borderBottom: '1px solid var(--sidebar-border)',
          background: "var(--header-bg)"
        }}>
          <TopRightControls />
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary-color) 0%, #00d4aa 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            boxShadow: "0 8px 30px rgba(0, 168, 132, 0.3)",
            animation: "pulse 2s ease-in-out infinite"
          }}>
            💬
          </div>
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: '600',
              color: 'var(--text-color)',
              marginBottom: '8px'
            }}>
              Welcome to WconnectU
            </div>
            <div style={{
              color: 'var(--user-text)',
              fontSize: '0.95rem',
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              Select a chat from the sidebar or start a new conversation
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isGlobalChat = selectedUser._id === "GLOBAL";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "var(--chat-bg)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--sidebar-border)",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Avatar */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: isGlobalChat
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : getAvatarGradient(selectedUser.name),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: isGlobalChat ? '1.3rem' : '1.1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}>
            {isGlobalChat ? '🌍' : selectedUser.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name and Status */}
          <div>
            <div style={{
              fontWeight: "600",
              fontSize: "1rem",
              color: "var(--text-color)"
            }}>
              {selectedUser.name}
            </div>
            <div style={{
              fontSize: "0.8rem",
              color: "var(--user-text)"
            }}>
              {isGlobalChat ? "Everyone can see these messages" : "Online"}
            </div>
          </div>
        </div>

        <TopRightControls />
      </div>

      {/* Messages */}
      <MessageList messages={messages} isGlobal={conversation?.isGlobal} />

      {/* Input */}
      <MessageInput
        conversationId={conversation._id}
        receiverId={selectedUser._id}
        setMessages={setMessages}
      />
    </div>
  );
}
