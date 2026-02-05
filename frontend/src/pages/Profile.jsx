import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const { data } = await api.put("/api/users/profile", { name });

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        storedUser.name = data.name;
        localStorage.setItem("user", JSON.stringify(storedUser));
        window.location.reload();
      }

      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      let errorMsg = "Failed to update profile";
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setProfileMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      await api.put("/api/users/password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      let errorMsg = "Failed to update password";
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setPasswordMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    background: "var(--sidebar-bg)",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    color: "var(--text-color)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid var(--sidebar-border)",
    background: "var(--input-bg)",
    color: "var(--text-color)",
    fontSize: "1rem",
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    background: "var(--primary-color)",
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
    width: "100%",
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "var(--bg-color)" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-color)',
          fontSize: '1rem',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ← Back to Chat
      </button>

      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Edit Profile</h2>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdateProfile} style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "15px", borderBottom: '1px solid var(--sidebar-border)', paddingBottom: '10px' }}>Personal Info</h3>

          {profileMessage.text && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              background: profileMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
              color: profileMessage.type === 'error' ? '#ef4444' : '#16a34a',
              textAlign: 'center',
              fontWeight: 'bold',
              border: `1px solid ${profileMessage.type === 'error' ? '#ef4444' : '#16a34a'}`,
            }}>
              {profileMessage.text}
            </div>
          )}

          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Update Password Form */}
        <form onSubmit={handleUpdatePassword}>
          <h3 style={{ marginBottom: "15px", borderBottom: '1px solid var(--sidebar-border)', paddingBottom: '10px' }}>Change Password</h3>
          <div>
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              style={inputStyle}
              required
            />
          </div>

          {passwordMessage.text && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              background: passwordMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
              color: passwordMessage.type === 'error' ? '#ef4444' : '#16a34a',
              textAlign: 'center',
              fontWeight: 'bold',
              border: `1px solid ${passwordMessage.type === 'error' ? '#ef4444' : '#16a34a'}`,
            }}>
              {passwordMessage.text}
            </div>
          )}

          <button type="submit" style={{ ...buttonStyle, background: '#333' }} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            marginTop: '30px',
            background: '#dc2626', // Red color for danger action
            opacity: 0.9
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
