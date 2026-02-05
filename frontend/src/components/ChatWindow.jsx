import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const TopRightControls = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.2rem',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          color: 'var(--text-color)'
        }}
        title="Toggle Theme"
      >
        {theme === 'light' ? '🌞' : '🌜'}
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
          fontWeight: '500'
        }}
      >
        <span>{user?.name}</span>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
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
          flexDirection: "column", // Changed to column to stack header and content
          background: "var(--chat-bg)",
          color: "var(--text-color)"
        }}
      >
        {/* Top Header for Empty State */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px 20px',
          borderBottom: '1px solid var(--sidebar-border)'
        }}>
          <TopRightControls />
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--user-text)',
          fontSize: '16px'
        }}>
          Select a chat to start messaging
        </div>
      </div>
    );
  }

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
          padding: "12px 16px",
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--sidebar-border)",
          fontWeight: "500",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: "var(--text-color)"
        }}
      >
        <div>{selectedUser.name}</div>
        <TopRightControls />
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <MessageInput
        conversationId={conversation._id}
        receiverId={selectedUser._id}
        setMessages={setMessages}
      />
    </div>
  );
}
