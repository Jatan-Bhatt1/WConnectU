import { useState } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";

export default function MessageInput({
  conversationId,
  receiverId,
  setMessages,
}) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    // 1️⃣ Save message via REST
    const { data } = await api.post("/api/chat/message", {
      conversationId,
      content: text,
    });

    // 2️⃣ Emit via socket for real-time delivery
    socket.emit("sendMessage", {
      receiverId,
      message: data,
    });

    // 3️⃣ Update local state
    setMessages((prev) => [...prev, data]);
    setText("");
  };

  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid #ddd",
        background: "#f0f2f5",
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none",
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px 14px",
          borderRadius: "50%",
          border: "none",
          background: "#0b93f6",
          color: "#fff",
          fontSize: "16px",
        }}
      >
        ➤
      </button>
    </div>
  );
}
