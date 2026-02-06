import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ setSelectedUser, setConversation }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("chats"); // 'chats', 'users', 'world'
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch My Chats
  const fetchChats = async () => {
    try {
      const { data } = await api.get("/api/chat");
      setChats(data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const accessGlobalChat = async () => {
    try {
      const { data } = await api.get("/api/chat/global");
      setSelectedUser({ _id: "GLOBAL", name: "World Community" });
      setConversation(data);
    } catch (err) {
      console.error("Failed to access global chat:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [setConversation]);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    if (tab === "world") {
      setView("world");
      accessGlobalChat();
    } else {
      setView("chats");
      fetchChats();
    }
  };

  const handleUserClick = async (targetUser) => {
    try {
      console.log("Creating/Opening chat with:", targetUser);
      const { data } = await api.post("/api/chat/conversation", {
        userId: targetUser._id,
      });
      console.log("Chat created/fetched:", data);

      setSelectedUser(targetUser);
      setConversation(data);
      setView("chats");

      // Force refresh of chats list
      await fetchChats();
    } catch (err) {
      console.error("Failed to open chat:", err);
      alert("Failed to open chat. Please try again.");
    }
  };

  const handleChatClick = (chat) => {
    const otherUser = chat.participants.find((p) => p._id !== user._id);
    if (otherUser) {
      setSelectedUser(otherUser);
      setConversation(chat);
    }
  };

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
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    ];
    const index = name ? name.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  return (
    <div
      style={{
        width: "320px",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 800,
            fontSize: '1.4rem',
            letterSpacing: '0.5px',
            display: 'inline-block',
          }}>
            <span style={{ color: '#834dff' }}>W</span>
            <span style={{ color: '#718096' }}>c</span>
            <span style={{ color: '#ff9f43' }}>o</span>
            <span style={{ color: '#718096' }}>n</span>
            <span style={{ color: '#3b5bdb' }}>n</span>
            <span style={{ color: '#718096' }}>e</span>
            <span style={{ color: '#1c1c1c' }}>c</span>
            <span style={{ color: '#718096' }}>t</span>
            <span style={{ color: '#ffd400', fontWeight: 900 }}>U</span>
          </span>
        </div>

        <button
          onClick={() => {
            setView("users");
            fetchUsers();
          }}
          title="New Chat"
          className="new-chat-btn"
        >
          +
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        background: "var(--header-bg)",
        padding: "0",
      }}>
        <div
          onClick={() => handleTabChange('chats')}
          className={`sidebar-tab ${view === 'chats' || view === 'users' ? 'active' : ''}`}
        >
          💬 Chats
        </div>
        <div
          onClick={() => handleTabChange('world')}
          className={`sidebar-tab ${view === 'world' ? 'active' : ''}`}
        >
          🌍 World
        </div>
      </div>

      {/* SubHeader for User List */}
      {view === 'users' && (
        <>
          <div style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid var(--sidebar-border)",
            color: "var(--text-color)",
            fontWeight: "600",
            background: "var(--hover-bg)",
          }}>
            <button
              onClick={() => {
                handleTabChange('chats');
                setSearchQuery("");
              }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "var(--text-color)",
                padding: "4px 8px",
                borderRadius: "6px",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--sidebar-border)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              ←
            </button>
            Select User
          </div>
          {/* Search Input */}
          <div style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--sidebar-border)",
          }}>
            <div style={{ position: "relative" }}>
              <svg
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "18px",
                  height: "18px",
                  color: "var(--user-text)",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  borderRadius: "20px",
                  border: "none",
                  outline: "none",
                  background: "var(--input-bg)",
                  color: "var(--text-color)",
                  fontSize: "14px",
                  transition: "box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 2px var(--primary-color)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {view === 'world' ? (
          <div className="world-view-content">
            <div className="world-icon">🌍</div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '8px' }}>
              World Community
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--user-text)',
              lineHeight: '1.5',
              maxWidth: '200px',
              margin: '0 auto'
            }}>
              Connect with everyone around the world in one global chat!
            </div>
            <div style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--primary-color) 0%, #00d4aa 100%)',
              borderRadius: '25px',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(0, 168, 132, 0.3)',
            }}>
              ✨ Chat is Open
            </div>
          </div>
        ) : view === "chats" ? (
          <div className="chats-view-content">
            {chats.map((chat) => {
              const otherUser = chat.participants.find((p) => p._id !== user._id);
              if (!otherUser) return null;

              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className="sidebar-list-item"
                >
                  {/* Avatar */}
                  <div
                    className="sidebar-avatar"
                    style={{ background: getAvatarGradient(otherUser.name) }}
                  >
                    {otherUser.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontWeight: "600", fontSize: "1rem", marginBottom: "2px" }}>
                      {otherUser.name}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "var(--user-text)",
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {chat.lastMessage ? chat.lastMessage.content : "Start a conversation"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="chats-view-content">
            {users
              .filter((u) => {
                // Exclude users who already have a conversation
                const existingChatUserIds = chats.map((chat) => {
                  const otherUser = chat.participants.find((p) => p._id !== user._id);
                  return otherUser?._id;
                });
                if (existingChatUserIds.includes(u._id)) return false;

                // Search filter
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                  u.name.toLowerCase().includes(query) ||
                  u.email.toLowerCase().includes(query)
                );
              })
              .map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleUserClick(u)}
                  className="sidebar-list-item"
                >
                  <div
                    className="sidebar-avatar"
                    style={{ background: getAvatarGradient(u.name) }}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>{u.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--user-text)" }}>{u.email}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--sidebar-border)",
          background: "var(--header-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "8px",
            transition: "background 0.2s"
          }}
          onClick={() => window.location.href = '/profile'}
          title="Go to Profile"
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-bg)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div
            className="sidebar-avatar"
            style={{
              width: "36px",
              height: "36px",
              fontSize: "0.9rem",
              marginRight: "0",
              background: user?.avatar
                ? `url(http://localhost:5000${user.avatar}) center/cover`
                : getAvatarGradient(user?.name)
            }}
          >
            {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-color)" }}>
            Profile
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="footer-btn"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button
            onClick={() => window.location.href = '/settings'}
            title="Settings"
            className="footer-btn"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}
