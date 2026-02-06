import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { user, login, logout, updateUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.put("/api/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUser({ avatar: data.avatar });
      setAvatarPreview(data.avatar);
      setProfileMessage({ type: "success", text: "Avatar updated!" });
    } catch (err) {
      setProfileMessage({ type: "error", text: "Failed to upload avatar" });
      setAvatarPreview(user?.avatar || "");
    } finally {
      setUploadingAvatar(false);
    }
  };

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

  const getAvatarUrl = () => {
    if (!avatarPreview) return null;
    if (avatarPreview.startsWith("data:")) return avatarPreview;
    if (avatarPreview.startsWith("/uploads")) return `http://localhost:5000${avatarPreview}`;
    return avatarPreview;
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "var(--bg-color)" }}>
      <button
        onClick={() => navigate("/")}
        className="back-button"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'var(--header-bg)',
          border: '1px solid var(--sidebar-border)',
          color: 'var(--text-color)',
          fontSize: '0.95rem',
          padding: '10px 20px',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = 'var(--primary-color)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
          e.currentTarget.style.borderColor = 'var(--sidebar-border)';
        }}
      >
        <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>←</span>
        Back to Chat
      </button>

      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Edit Profile</h2>

        {/* Avatar Section */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              margin: "0 auto 15px",
              background: getAvatarUrl() ? `url(${getAvatarUrl()}) center/cover` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "4px solid var(--primary-color)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {!getAvatarUrl() && (
              <span style={{ color: "white", fontSize: "48px", fontWeight: "bold" }}>
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "5px",
                fontSize: "12px",
              }}
            >
              {uploadingAvatar ? "Uploading..." : "📷 Change"}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Click avatar to change photo
          </p>
        </div>

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

        <button
          onClick={async () => {
            const confirmed = window.confirm(
              "Are you sure you want to delete your account? This action cannot be undone!"
            );
            if (!confirmed) return;

            try {
              await api.delete("/api/users/me");
              logout();
              navigate("/login");
            } catch (err) {
              alert("Failed to delete account. Please try again.");
              console.error(err);
            }
          }}
          style={{
            ...buttonStyle,
            marginTop: '15px',
            background: 'transparent',
            border: '2px solid #dc2626',
            color: '#dc2626',
          }}
        >
          🗑️ Delete Account
        </button>
      </div>
    </div>
  );
}
