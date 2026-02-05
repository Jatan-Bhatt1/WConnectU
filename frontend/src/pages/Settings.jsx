import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const [privacy, setPrivacy] = useState({
    lastSeen: "Everyone",
    readReceipts: true,
  });

  useEffect(() => {
    if (user?.privacy) {
      setPrivacy(user.privacy);
    }
  }, [user]);

  const handlePrivacyChange = async (key, value) => {
    const newPrivacy = { ...privacy, [key]: value };
    setPrivacy(newPrivacy);

    try {
      const { data } = await api.put("/api/users/settings", { privacy: newPrivacy });
      updateUser(data);
    } catch (err) {
      console.error("Failed to update settings:", err);
      // Revert if failed
      setPrivacy(privacy);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--bg-color)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "var(--sidebar-bg)",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          padding: "20px",
          color: "var(--text-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              marginRight: "15px",
              color: "var(--text-color)",
            }}
          >
            ←
          </button>
          <h2 style={{ margin: 0 }}>Settings</h2>
        </div>

        {/* Appearance Section */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ borderBottom: "1px solid var(--sidebar-border)", paddingBottom: "10px", color: "var(--primary-color)" }}>
            🎨 Appearance
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0" }}>
            <span>Theme</span>
            <button
              onClick={toggleTheme}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid var(--sidebar-border)",
                background: "var(--hover-bg)",
                cursor: "pointer",
                color: "var(--text-color)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {theme === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>

        {/* Notifications Section (Mock - as requested) */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ borderBottom: "1px solid var(--sidebar-border)", paddingBottom: "10px", color: "#00a884" }}>
            🔔 Notifications
          </h3>
          <div style={{ padding: "15px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <span>Message Sounds</span>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary-color)", transform: "scale(1.2)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Desktop Notifications</span>
              <input type="checkbox" style={{ accentColor: "var(--primary-color)", transform: "scale(1.2)" }} />
            </div>
          </div>
        </div>

        {/* Privacy Section (Functional) */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ borderBottom: "1px solid var(--sidebar-border)", paddingBottom: "10px", color: "#34b7f1" }}>
            🔒 Privacy
          </h3>
          <div style={{ padding: "15px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <span>Last Seen</span>
              <select
                value={privacy.lastSeen}
                onChange={(e) => handlePrivacyChange("lastSeen", e.target.value)}
                style={{ padding: "5px", borderRadius: "5px", border: "1px solid var(--sidebar-border)", background: "var(--input-bg)", color: "var(--text-color)" }}
              >
                <option>Everyone</option>
                <option>My Contacts</option>
                <option>Nobody</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Read Receipts</span>
              <input
                type="checkbox"
                checked={privacy.readReceipts}
                onChange={(e) => handlePrivacyChange("readReceipts", e.target.checked)}
                style={{ accentColor: "var(--primary-color)", transform: "scale(1.2)" }}
              />
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div>
          <h3 style={{ borderBottom: "1px solid var(--sidebar-border)", paddingBottom: "10px", color: "#ea868f" }}>
            ❓ Help
          </h3>
          <div style={{ padding: "15px 0", cursor: "pointer", color: "var(--primary-color)" }}>
            Need help? Contact Support
          </div>
        </div>

      </div>
    </div>
  );
}
