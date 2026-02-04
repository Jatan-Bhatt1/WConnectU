
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ setSelectedUser, setConversation }) {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get("/api/users");
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const openChat = async (user) => {
    const { data } = await api.post("/api/chat/conversation", {
      userId: user._id,
    });
    setSelectedUser(user);
    setConversation(data);
  };

  return (
    <div
      style={{
        width: "300px",
        background: "#ffffff",
        borderRight: "1px solid #ddd",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #eee",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Chats
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          width: "90%",
          margin: "10px auto",
          display: "block",
          padding: "8px 0",
          background: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>

      {/* User list */}
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => openChat(user)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 15px",
            cursor: "pointer",
            borderBottom: "1px solid #f0f0f0",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#f5f5f5")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {/* Avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
              fontWeight: "bold",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <div>
            <div style={{ fontWeight: "500" }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Click to chat
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
