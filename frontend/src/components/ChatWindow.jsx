import { useEffect, useState, useRef } from "react";
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

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith("/uploads")) return `http://localhost:5000${avatar}`;
    return avatar;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

export default function ChatWindow({ selectedUser, conversation, onDeleteChat }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

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

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteChat = async () => {
    if (!conversation?._id) return;
    if (!window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) return;

    try {
      setDeleting(true);
      await api.delete(`/api/chat/conversation/${conversation._id}`);
      if (onDeleteChat) onDeleteChat();
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat");
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  const isGlobalChat = selectedUser?._id === "GLOBAL";

  if (!selectedUser || !conversation) {
    return (
      <>
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes shimmer-text {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .welcome-icon-pulse {
            animation: pulse-ring 2s ease-out infinite;
          }
        `}</style>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "transparent",
            color: "white",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Top Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '14px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)"
          }}>
            <TopRightControls />
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Animated Icon Container */}
            <div style={{ position: 'relative' }}>
              {/* Pulse rings */}
              <div className="welcome-icon-pulse" style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                borderRadius: '50%',
                border: '2px solid rgba(131, 77, 255, 0.3)',
              }} />
              <div className="welcome-icon-pulse" style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                borderRadius: '50%',
                border: '2px solid rgba(131, 77, 255, 0.3)',
                animationDelay: '1s'
              }} />

              <div style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #834dff 0%, #a855f7 50%, #00d4aa 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
                boxShadow: "0 20px 60px rgba(131, 77, 255, 0.4)",
                animation: "float-slow 4s ease-in-out infinite",
                border: "3px solid rgba(255,255,255,0.2)"
              }}>
                💬
              </div>
            </div>

            {/* Text content */}
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
              <h1 style={{
                fontSize: '2.2rem',
                fontWeight: '800',
                marginBottom: '12px',
                background: 'linear-gradient(135deg, #ffffff 0%, #834dff 50%, #00d4aa 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer-text 3s linear infinite'
              }}>
                Welcome to WconnectU
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1.05rem',
                lineHeight: '1.7',
                margin: 0
              }}>
                Select a chat from the sidebar or start a new conversation to begin messaging
              </p>
            </div>

            {/* Feature badges */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '10px'
            }}>
              {['🔒 Secure', '⚡ Fast', '🌍 Global'].map((badge, i) => (
                <div key={i} style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '25px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '500'
                }}>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }



  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: "relative",
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Avatar */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: isGlobalChat
              ? "transparent"
              : getAvatarGradient(selectedUser.name),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: isGlobalChat ? '1.3rem' : '1.1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            {isGlobalChat ? (
              <img src="/world.jpg" alt="World" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : selectedUser.name?.charAt(0).toUpperCase()}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <TopRightControls />

          {/* Three Dots Menu - Only for private chats */}
          {!isGlobalChat && (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-color)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>

              {showMenu && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  marginTop: '0px',
                  background: '#1e1e2d',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '6px',
                  minWidth: '180px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  zIndex: 9999,
                  transformOrigin: 'top right',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <button
                    onClick={handleDeleteChat}
                    disabled={deleting}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ff4b4b',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      borderRadius: '8px',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => !deleting && (e.currentTarget.style.background = "rgba(255, 75, 75, 0.1)")}
                    onMouseLeave={(e) => !deleting && (e.currentTarget.style.background = "transparent")}
                  >
                    {deleting ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255, 75, 75, 0.3)', borderTopColor: '#ff4b4b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        Deleting...
                      </span>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete Chat
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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
