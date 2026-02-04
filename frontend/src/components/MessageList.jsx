import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function MessageList({ messages }) {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  // auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        background: "#e5ddd5",
      }}
    >
      {messages.map((msg) => {
        const isMe = msg.sender._id === user._id;

        return (
          <div
            key={msg._id}
            style={{
              display: "flex",
              justifyContent: isMe ? "flex-end" : "flex-start",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                background: isMe ? "#dcf8c6" : "#ffffff",
                padding: "8px 12px",
                borderRadius: "8px",
                maxWidth: "65%",
                boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                fontSize: "14px",
              }}
            >
              <div>{msg.content}</div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#555",
                  textAlign: "right",
                  marginTop: "2px",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
