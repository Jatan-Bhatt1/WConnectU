import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ setSelectedUser, setConversation }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("chats"); // 'chats' or 'users'

  // Fetch My Chats
  const fetchChats = async () => {
    try {
      const { data } = await api.get("/api/chat");
      setChats(data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  // Fetch All Users (for new chat)
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [setConversation]);

  // Toggle View
  const toggleView = () => {
    if (view === "chats") {
      setView("users");
      fetchUsers();
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

  return (
    <div
      style={{
        width: "300px",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--header-bg)",
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
          onClick={toggleView}
          title={view === 'chats' ? "New Chat" : "Back to Chats"}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: "var(--primary-color)"
          }}
        >
          {view === 'chats' ? '➕' : '⬅'}
        </button>
      </div>

      {/* SubHeader Title */}
      <div style={{
        padding: "10px 15px",
        fontWeight: "700",
        fontSize: "1.3rem",
        color: "var(--text-color)",
        borderBottom: "1px solid var(--sidebar-border)"
      }}>
        {view === 'chats' ? 'Chats' : 'New Chat'}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {view === "chats" ? (
          chats.map((chat) => {
            const otherUser = chat.participants.find((p) => p._id !== user._id);
            if (!otherUser) return null;

            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 15px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--sidebar-border)",
                  color: "var(--text-color)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--hover-bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: "#ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px",
                    fontWeight: "bold",
                    color: "#333",
                    fontSize: "1.2rem"
                  }}
                >
                  {otherUser.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontWeight: "500", fontSize: "1rem" }}>{otherUser.name}</div>
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
          })
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              onClick={() => handleUserClick(u)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 15px",
                cursor: "pointer",
                borderBottom: "1px solid var(--sidebar-border)",
                color: "var(--text-color)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--hover-bg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  fontWeight: "bold",
                  color: "#333"
                }}
              >
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: "500" }}>{u.name}</div>
                <div style={{ fontSize: "12px", color: "var(--user-text)" }}>{u.email}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 15px",
          borderTop: "1px solid var(--sidebar-border)",
          background: "var(--header-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={() => window.location.href = '/profile'}
          title="Go to Profile"
        >
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              background: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#333",
              fontSize: "1rem"
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-color)" }}>
            Profile
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button
            onClick={() => window.location.href = '/settings'}
            title="Settings"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            ⚙️
          </button>
        </div>
      </div>
    </div >
  );
}
