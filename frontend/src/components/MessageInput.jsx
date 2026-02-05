import { useState } from "react";
import api from "../api/axios";
import socket from "../sockets/socket";

export default function MessageInput({
  conversationId,
  receiverId,
  setMessages,
}) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      const { data } = await api.post("/api/chat/message", {
        conversationId,
        content: text,
      });

      socket.emit("sendMessage", {
        receiverId,
        message: data,
      });

      setMessages((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "var(--header-bg)",
        borderTop: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Emoji Button */}
      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: "1.4rem",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--hover-bg)";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Emojis"
      >
        😊
      </button>

      {/* Input Field */}
      <div style={{ flex: 1, position: "relative" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: "25px",
            border: "none",
            outline: "none",
            background: "var(--input-bg)",
            color: "var(--text-color)",
            fontSize: "15px",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.3s ease"
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1), 0 0 0 2px var(--primary-color)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1)";
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>

      {/* Attachment Button */}
      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: "1.3rem",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--user-text)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--hover-bg)";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Attach File"
      >
        📎
      </button>

      {/* Send Button */}
      <button
        onClick={sendMessage}
        disabled={isSending || !text.trim()}
        style={{
          background: text.trim()
            ? "linear-gradient(135deg, var(--primary-color) 0%, #00d4aa 100%)"
            : "var(--hover-bg)",
          border: "none",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: text.trim() ? "pointer" : "default",
          transition: "all 0.3s ease",
          boxShadow: text.trim() ? "0 4px 15px rgba(0, 168, 132, 0.4)" : "none"
        }}
        onMouseEnter={(e) => {
          if (text.trim()) {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 168, 132, 0.5)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = text.trim() ? "0 4px 15px rgba(0, 168, 132, 0.4)" : "none";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: "rotate(-30deg)",
            transition: "transform 0.3s ease"
          }}
        >
          <path
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            fill={text.trim() ? "white" : "var(--user-text)"}
          />
        </svg>
      </button>
    </div>
  );
}
