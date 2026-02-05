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
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        background: "var(--header-bg)",
        borderTop: "1px solid var(--sidebar-border)",
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        style={{
          flex: 1,
          padding: "9px 16px",
          borderRadius: "8px",
          border: "1px solid var(--sidebar-border)",
          outline: "none",
          background: "var(--input-bg)",
          color: "var(--text-color)",
          fontSize: "15px"
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px",
          borderRadius: "50%",
          border: "none",
          background: "transparent",
          color: "var(--primary-color)",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
      >
        ➤
      </button>
    </div>
  );
}
