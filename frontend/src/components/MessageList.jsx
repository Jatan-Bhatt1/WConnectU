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
        padding: "20px 5%", // Added horizontal padding for cleaner look
        overflowY: "auto",
        background: "var(--chat-bg)",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", // Subtle grid as fake doodle
        backgroundSize: "20px 20px"
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
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                background: isMe ? "var(--message-out)" : "var(--message-in)",
                color: "var(--text-color)",
                padding: "6px 9px",
                borderRadius: "7.5px",
                borderTopRightRadius: isMe ? "0" : "7.5px",
                borderTopLeftRadius: !isMe ? "0" : "7.5px",
                maxWidth: "65%",
                boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                fontSize: "14.2px",
                lineHeight: "19px",
                position: "relative"
              }}
            >
              <div style={{ wordWrap: "break-word" }}>{msg.content}</div>

              <div
                style={{
                  fontSize: "11px",
                  color: "var(--user-text)",
                  textAlign: "right",
                  marginTop: "2px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}
                {isMe && (
                  <span style={{ marginLeft: "4px", display: "flex" }}>
                    {msg.status === "read" ? (
                      // Double Blue Tick
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.0001 8.825L14.6501 5.175C14.8501 4.975 15.1501 4.975 15.3501 5.175C15.5501 5.375 15.5501 5.675 15.3501 5.875L11.3501 9.875C11.1501 10.075 10.8501 10.075 10.6501 9.875L8.5501 7.775C8.3501 7.575 8.3501 7.275 8.5501 7.075C8.7501 6.875 9.0501 6.875 9.2501 7.075L11.0001 8.825Z" fill="#53bdeb" />
                        <path d="M0.650146 5.875L4.65015 9.875C4.85015 10.075 5.15015 10.075 5.35015 9.875L12.3501 2.875C12.5501 2.675 12.5501 2.375 12.3501 2.175C12.1501 1.975 11.8501 1.975 11.6501 2.175L5.00015 8.825L1.35015 5.175C1.15015 4.975 0.850146 4.975 0.650146 5.175C0.450146 5.375 0.450146 5.675 0.650146 5.875Z" fill="#53bdeb" />
                        <path d="M8.5501 7.775C8.3501 7.575 8.3501 7.275 8.5501 7.075C8.7501 6.875 9.0501 6.875 9.2501 7.075L11.0001 8.825L10.6501 9.875L8.5501 7.775Z" fill="#53bdeb" opacity="0" />
                      </svg>
                    ) : msg.status === "delivered" ? (
                      // Double Grey Tick
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.0001 8.825L14.6501 5.175C14.8501 4.975 15.1501 4.975 15.3501 5.175C15.5501 5.375 15.5501 5.675 15.3501 5.875L11.3501 9.875C11.1501 10.075 10.8501 10.075 10.6501 9.875L8.5501 7.775C8.3501 7.575 8.3501 7.275 8.5501 7.075C8.7501 6.875 9.0501 6.875 9.2501 7.075L11.0001 8.825Z" fill="#8696a0" />
                        <path d="M0.650146 5.875L4.65015 9.875C4.85015 10.075 5.15015 10.075 5.35015 9.875L12.3501 2.875C12.5501 2.675 12.5501 2.375 12.3501 2.175C12.1501 1.975 11.8501 1.975 11.6501 2.175L5.00015 8.825L1.35015 5.175C1.15015 4.975 0.850146 4.975 0.650146 5.175C0.450146 5.375 0.450146 5.675 0.650146 5.875Z" fill="#8696a0" />
                      </svg>
                    ) : (
                      // Single Grey Tick
                      <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.650146 5.875L4.65015 9.875C4.85015 10.075 5.15015 10.075 5.35015 9.875L11.3501 3.875C11.5501 3.675 11.5501 3.375 11.3501 3.175C11.1501 2.975 10.8501 2.975 10.6501 3.175L5.00015 8.825L1.35015 5.175C1.15015 4.975 0.850146 4.975 0.650146 5.175C0.450146 5.375 0.450146 5.675 0.650146 5.875Z" fill="#8696a0" />
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
