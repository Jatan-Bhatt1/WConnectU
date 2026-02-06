import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function MessageList({ messages, isGlobal }) {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  // auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate consistent colors for sender names
  const getSenderColor = (name) => {
    const colors = [
      "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4",
      "#ffeaa7", "#dfe6e9", "#fd79a8", "#a29bfe",
      "#00b894", "#e17055", "#74b9ff", "#fab1a0"
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "20px 8%",
        overflowY: "auto",
        background: "var(--chat-bg)",
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(0, 168, 132, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(131, 77, 255, 0.03) 0%, transparent 50%),
          linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 25px 25px, 25px 25px"
      }}
    >
      {messages.map((msg, index) => {
        const isMe = msg.sender._id === user._id;
        const showAvatar = !isMe && isGlobal;

        return (
          <div
            key={msg._id}
            style={{
              display: "flex",
              justifyContent: isMe ? "flex-end" : "flex-start",
              marginBottom: "8px",
              animation: "messageSlideIn 0.3s ease-out",
              animationDelay: `${index * 0.02}s`,
              animationFillMode: "backwards"
            }}
          >
            {/* Avatar for global chat */}
            {showAvatar && (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${getSenderColor(msg.sender.name)} 0%, ${getSenderColor(msg.sender.name + 'x')} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "8px",
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "0.75rem",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              >
                {msg.sender.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div
              style={{
                background: isMe
                  ? "linear-gradient(135deg, var(--message-out) 0%, var(--message-out) 100%)"
                  : "var(--message-in)",
                color: "var(--text-color)",
                padding: msg.type === "image" ? "4px" : "10px 14px",
                borderRadius: "18px",
                borderTopRightRadius: isMe ? "4px" : "18px",
                borderTopLeftRadius: !isMe ? "4px" : "18px",
                maxWidth: "65%",
                boxShadow: isMe
                  ? "0 2px 8px rgba(0, 168, 132, 0.2)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: "14.5px",
                lineHeight: "1.45",
                position: "relative",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow = isMe
                  ? "0 4px 12px rgba(0, 168, 132, 0.3)"
                  : "0 4px 12px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = isMe
                  ? "0 2px 8px rgba(0, 168, 132, 0.2)"
                  : "0 2px 8px rgba(0,0,0,0.08)";
              }}
            >
              {!isMe && isGlobal && (
                <div style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: getSenderColor(msg.sender.name),
                  marginBottom: "4px",
                  letterSpacing: "0.3px",
                  padding: msg.type === "image" ? "6px 8px 2px" : "0"
                }}>
                  {msg.sender.name}
                </div>
              )}

              {msg.type === "image" ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={msg.content.startsWith("/uploads") ? `http://localhost:5000${msg.content}` : msg.content}
                    alt="Sent image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "14px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(msg.content.startsWith("/uploads") ? `http://localhost:5000${msg.content}` : msg.content, "_blank")}
                  />
                </div>
              ) : (
                <div style={{ wordWrap: "break-word" }}>{msg.content}</div>
              )}

              <div
                style={{
                  fontSize: "10px",
                  color: "var(--user-text)",
                  textAlign: "right",
                  marginTop: "4px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "4px",
                  opacity: 0.8,
                  padding: msg.type === "image" ? "0 8px 4px" : "0"
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
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.0001 8.825L14.6501 5.175C14.8501 4.975 15.1501 4.975 15.3501 5.175C15.5501 5.375 15.5501 5.675 15.3501 5.875L11.3501 9.875C11.1501 10.075 10.8501 10.075 10.6501 9.875L8.5501 7.775C8.3501 7.575 8.3501 7.275 8.5501 7.075C8.7501 6.875 9.0501 6.875 9.2501 7.075L11.0001 8.825Z" fill="#53bdeb" />
                        <path d="M0.650146 5.875L4.65015 9.875C4.85015 10.075 5.15015 10.075 5.35015 9.875L12.3501 2.875C12.5501 2.675 12.5501 2.375 12.3501 2.175C12.1501 1.975 11.8501 1.975 11.6501 2.175L5.00015 8.825L1.35015 5.175C1.15015 4.975 0.850146 4.975 0.650146 5.175C0.450146 5.375 0.450146 5.675 0.650146 5.875Z" fill="#53bdeb" />
                      </svg>
                    ) : msg.status === "delivered" ? (
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.0001 8.825L14.6501 5.175C14.8501 4.975 15.1501 4.975 15.3501 5.175C15.5501 5.375 15.5501 5.675 15.3501 5.875L11.3501 9.875C11.1501 10.075 10.8501 10.075 10.6501 9.875L8.5501 7.775C8.3501 7.575 8.3501 7.275 8.5501 7.075C8.7501 6.875 9.0501 6.875 9.2501 7.075L11.0001 8.825Z" fill="#8696a0" />
                        <path d="M0.650146 5.875L4.65015 9.875C4.85015 10.075 5.15015 10.075 5.35015 9.875L12.3501 2.875C12.5501 2.675 12.5501 2.375 12.3501 2.175C12.1501 1.975 11.8501 1.975 11.6501 2.175L5.00015 8.825L1.35015 5.175C1.15015 4.975 0.850146 4.975 0.650146 5.175C0.450146 5.375 0.450146 5.675 0.650146 5.875Z" fill="#8696a0" />
                      </svg>
                    ) : (
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
