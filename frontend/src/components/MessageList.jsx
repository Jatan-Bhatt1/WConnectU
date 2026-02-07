import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function MessageList({ messages, isGlobal }) {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSenderColor = (name) => {
    const colors = [
      "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)",
      "linear-gradient(135deg, #4ecdc4 0%, #3db9b0 100%)",
      "linear-gradient(135deg, #45b7d1 0%, #34a5bf 100%)",
      "linear-gradient(135deg, #96ceb4 0%, #85bda3 100%)",
      "linear-gradient(135deg, #a29bfe 0%, #9188ed 100%)",
      "linear-gradient(135deg, #fd79a8 0%, #ec6897 100%)",
      "linear-gradient(135deg, #00b894 0%, #00a383 100%)",
      "linear-gradient(135deg, #e17055 0%, #d05f44 100%)",
      "linear-gradient(135deg, #74b9ff 0%, #63a8ee 100%)",
      "linear-gradient(135deg, #834dff 0%, #723cee 100%)",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const getTextColor = (name) => {
    const colors = [
      "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#a29bfe",
      "#fd79a8", "#00b894", "#e17055", "#74b9ff", "#834dff"
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(131, 77, 255, 0.2); }
          50% { box-shadow: 0 0 40px rgba(131, 77, 255, 0.4); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
        }
        .message-bubble-out {
          background: linear-gradient(135deg, rgba(131, 77, 255, 0.25) 0%, rgba(106, 44, 255, 0.15) 100%);
          border: 1px solid rgba(131, 77, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        .message-bubble-out:hover {
          background: linear-gradient(135deg, rgba(131, 77, 255, 0.35) 0%, rgba(106, 44, 255, 0.25) 100%);
          border-color: rgba(131, 77, 255, 0.5);
        }
        .message-bubble-in {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
        }
        .message-bubble-in:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .message-image {
          transition: all 0.3s ease;
        }
        .message-image:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }
        .status-icon {
          transition: all 0.3s ease;
        }
        .sending-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          flex: 1,
          padding: "20px 6%",
          overflowY: "auto",
          overflowX: "hidden",
          background: "transparent",
          position: "relative",
        }}
      >
        {/* Subtle grid background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(131, 77, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(131, 77, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none"
        }} />

        {messages.map((msg, index) => {
          const isMe = msg.sender._id === user._id;
          const showAvatar = !isMe && isGlobal;

          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.03, 0.3),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "12px",
                position: "relative",
              }}
            >
              {/* Avatar for global chat */}
              {showAvatar && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: getSenderColor(msg.sender.name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    cursor: "pointer"
                  }}
                >
                  {msg.sender.name?.charAt(0).toUpperCase()}
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ duration: 0.2 }}
                className={isMe ? "message-bubble-out" : "message-bubble-in"}
                style={{
                  color: "white",
                  padding: msg.type === "image" ? "6px" : "12px 16px",
                  borderRadius: "20px",
                  borderTopRightRadius: isMe ? "6px" : "20px",
                  borderTopLeftRadius: !isMe ? "6px" : "20px",
                  maxWidth: "70%",
                  minWidth: "80px",
                  boxShadow: isMe
                    ? "0 4px 20px rgba(131, 77, 255, 0.25)"
                    : "0 4px 20px rgba(0,0,0,0.2)",
                  fontSize: "14.5px",
                  lineHeight: "1.5",
                  position: "relative",
                  cursor: "default",
                }}
              >
                {/* Subtle glow effect for outgoing */}
                {isMe && (
                  <div style={{
                    position: "absolute",
                    top: "-1px",
                    left: "10%",
                    right: "10%",
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(131, 77, 255, 0.5), transparent)",
                    borderRadius: "100%"
                  }} />
                )}

                {!isMe && isGlobal && (
                  <div style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: getTextColor(msg.sender.name),
                    marginBottom: "6px",
                    letterSpacing: "0.5px",
                    padding: msg.type === "image" ? "4px 6px 0" : "0",
                    textShadow: "0 0 20px currentColor"
                  }}>
                    {msg.sender.name}
                  </div>
                )}

                {msg.type === "image" ? (
                  <div style={{ position: "relative" }}>
                    <motion.img
                      whileHover={{ scale: 1.02 }}
                      src={msg.content.startsWith("/uploads") ? `http://localhost:5000${msg.content}` : msg.content}
                      alt="Sent image"
                      className="message-image"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        borderRadius: msg.caption ? "14px 14px 6px 6px" : "14px",
                        display: "block",
                        cursor: "pointer",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                      }}
                      onClick={() => window.open(msg.content.startsWith("/uploads") ? `http://localhost:5000${msg.content}` : msg.content, "_blank")}
                    />
                    {msg.caption && (
                      <div style={{
                        padding: "10px 12px 4px",
                        fontSize: "14.5px",
                        lineHeight: "1.5",
                        wordWrap: "break-word",
                        color: "rgba(255,255,255,0.95)"
                      }}>
                        {msg.caption}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    wordWrap: "break-word",
                    color: "rgba(255,255,255,0.95)"
                  }}>
                    {msg.content}
                  </div>
                )}

                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.5)",
                    textAlign: "right",
                    marginTop: "6px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "6px",
                    padding: msg.type === "image" ? "0 8px 4px" : "0"
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                  {isMe && (
                    <span className="status-icon" style={{ display: "flex" }}>
                      {msg.status === "sending" ? (
                        <svg className="sending-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeDasharray="40" strokeDashoffset="10" />
                        </svg>
                      ) : msg.status === "failed" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#ff6b6b" strokeWidth="2" fill="none" />
                          <path d="M8 8L16 16M16 8L8 16" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : msg.status === "read" ? (
                        <svg width="18" height="12" viewBox="0 0 16 11" fill="none">
                          <path d="M11 8.825L14.65 5.175C14.85 4.975 15.15 4.975 15.35 5.175C15.55 5.375 15.55 5.675 15.35 5.875L11.35 9.875C11.15 10.075 10.85 10.075 10.65 9.875L8.55 7.775C8.35 7.575 8.35 7.275 8.55 7.075C8.75 6.875 9.05 6.875 9.25 7.075L11 8.825Z" fill="#00d4aa" />
                          <path d="M0.65 5.875L4.65 9.875C4.85 10.075 5.15 10.075 5.35 9.875L12.35 2.875C12.55 2.675 12.55 2.375 12.35 2.175C12.15 1.975 11.85 1.975 11.65 2.175L5 8.825L1.35 5.175C1.15 4.975 0.85 4.975 0.65 5.175C0.45 5.375 0.45 5.675 0.65 5.875Z" fill="#00d4aa" />
                        </svg>
                      ) : msg.status === "delivered" ? (
                        <svg width="18" height="12" viewBox="0 0 16 11" fill="none">
                          <path d="M11 8.825L14.65 5.175C14.85 4.975 15.15 4.975 15.35 5.175C15.55 5.375 15.55 5.675 15.35 5.875L11.35 9.875C11.15 10.075 10.85 10.075 10.65 9.875L8.55 7.775C8.35 7.575 8.35 7.275 8.55 7.075C8.75 6.875 9.05 6.875 9.25 7.075L11 8.825Z" fill="rgba(255,255,255,0.6)" />
                          <path d="M0.65 5.875L4.65 9.875C4.85 10.075 5.15 10.075 5.35 9.875L12.35 2.875C12.55 2.675 12.55 2.375 12.35 2.175C12.15 1.975 11.85 1.975 11.65 2.175L5 8.825L1.35 5.175C1.15 4.975 0.85 4.975 0.65 5.175C0.45 5.375 0.45 5.675 0.65 5.875Z" fill="rgba(255,255,255,0.6)" />
                        </svg>
                      ) : (
                        <svg width="14" height="12" viewBox="0 0 12 11" fill="none">
                          <path d="M0.65 5.875L4.65 9.875C4.85 10.075 5.15 10.075 5.35 9.875L11.35 3.875C11.55 3.675 11.55 3.375 11.35 3.175C11.15 2.975 10.85 2.975 10.65 3.175L5 8.825L1.35 5.175C1.15 4.975 0.85 4.975 0.65 5.175C0.45 5.375 0.45 5.675 0.65 5.875Z" fill="rgba(255,255,255,0.5)" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </>
  );
}
