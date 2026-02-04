import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({ selectedUser, conversation }) {
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

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversation]);

  if (!selectedUser) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#777",
          fontSize: "16px",
        }}
      >
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#f0f2f5",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          background: "#ededed",
          borderBottom: "1px solid #ddd",
          fontWeight: "500",
        }}
      >
        {selectedUser.name}
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
