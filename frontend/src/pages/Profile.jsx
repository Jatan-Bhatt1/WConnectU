import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
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

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

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
      setProfileMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
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
      setPasswordMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = () => {
    if (!avatarPreview) return null;
    if (avatarPreview.startsWith("data:")) return avatarPreview;
    if (avatarPreview.startsWith("/uploads")) return `http://localhost:5000${avatarPreview}`;
    return avatarPreview;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .profile-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          border: 2px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          font-size: 1rem;
          transition: all 0.3s ease;
          color: white;
        }
        .profile-input:focus {
          outline: none;
          border-color: #834dff;
          box-shadow: 0 0 0 4px rgba(131, 77, 255, 0.2);
          background: rgba(255,255,255,0.08);
        }
        .profile-input::placeholder { color: rgba(255,255,255,0.5); }
        .profile-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .profile-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .profile-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .profile-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .profile-btn:hover::before { left: 100%; }
        .profile-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px"
      }}>
        {/* Floating gradient orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "10%", width: "400px", height: "400px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(131,77,255,0.25) 0%, transparent 70%)",
          filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "10%", width: "350px", height: "350px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(0,168,132,0.2) 0%, transparent 70%)",
          filter: "blur(60px)", animation: "float 10s ease-in-out infinite reverse", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: "50%", right: "30%", width: "250px", height: "250px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(255,159,67,0.15) 0%, transparent 70%)",
          filter: "blur(50px)", animation: "float 6s ease-in-out infinite", pointerEvents: "none"
        }} />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "fixed", top: "30px", left: "30px", zIndex: 100,
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50px",
            padding: "12px 24px", color: "white", fontWeight: "600",
            display: "flex", alignItems: "center", gap: "10px", cursor: "pointer"
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>←</span> Back to Chat
        </motion.button>

        {/* Main content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: "500px", margin: "60px auto 0", position: "relative", zIndex: 10
          }}
        >
          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            style={{
              background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)",
              borderRadius: "28px", padding: "40px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
              position: "relative", overflow: "hidden"
            }}
          >
            {/* Gradient top border */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "4px",
              background: "linear-gradient(90deg, #834dff, #00a884, #ff9f43, #834dff)",
              backgroundSize: "200% 100%", animation: "gradient-shift 3s ease infinite"
            }} />

            <motion.h2
              variants={itemVariants}
              style={{
                textAlign: "center", fontSize: "2rem", fontWeight: "800",
                color: "white", marginBottom: "30px",
                background: "linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}
            >
              Edit Profile
            </motion.h2>

            {/* Avatar Section */}
            <motion.div
              variants={itemVariants}
              style={{ textAlign: "center", marginBottom: "35px" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "130px", height: "130px", borderRadius: "50%",
                  margin: "0 auto 15px", cursor: "pointer",
                  background: getAvatarUrl()
                    ? `url(${getAvatarUrl()}) center/cover`
                    : "linear-gradient(135deg, #834dff 0%, #6a2cff 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "4px solid rgba(131,77,255,0.5)", position: "relative",
                  boxShadow: "0 10px 40px rgba(131,77,255,0.3)"
                }}
              >
                {!getAvatarUrl() && (
                  <span style={{ color: "white", fontSize: "52px", fontWeight: "bold" }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  color: "white", padding: "8px", fontSize: "12px", fontWeight: "600",
                  borderRadius: "0 0 50% 50%"
                }}>
                  {uploadingAvatar ? "⏳" : "📷 Change"}
                </div>
              </motion.div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange}
                accept="image/*" style={{ display: "none" }} />
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
                Click avatar to change photo
              </p>
            </motion.div>

            {/* Profile Form */}
            <motion.form variants={itemVariants} onSubmit={handleUpdateProfile} style={{ marginBottom: "35px" }}>
              <h3 style={{
                marginBottom: "20px", paddingBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                color: "#834dff", fontSize: "1.1rem", fontWeight: "700"
              }}>👤 Personal Info</h3>

              {profileMessage.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "14px", borderRadius: "12px", marginBottom: "20px",
                    background: profileMessage.type === "error"
                      ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                    border: `1px solid ${profileMessage.type === "error" ? "#ef4444" : "#10b981"}`,
                    color: profileMessage.type === "error" ? "#fca5a5" : "#6ee7b7",
                    textAlign: "center", fontWeight: "600"
                  }}
                >
                  {profileMessage.text}
                </motion.div>
              )}

              <div style={{ marginBottom: "18px" }}>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", display: "block" }}>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="profile-input" required />
              </div>
              <div style={{ marginBottom: "22px" }}>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", display: "block" }}>Email</label>
                <input type="email" value={user?.email} disabled className="profile-input" />
              </div>
              <button type="submit" disabled={loading} className="profile-btn" style={{
                background: "linear-gradient(135deg, #834dff 0%, #6a2cff 100%)",
                color: "white", boxShadow: "0 8px 25px rgba(131,77,255,0.4)"
              }}>
                {loading ? "Updating..." : "✨ Update Profile"}
              </button>
            </motion.form>

            {/* Password Form */}
            <motion.form variants={itemVariants} onSubmit={handleUpdatePassword}>
              <h3 style={{
                marginBottom: "20px", paddingBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                color: "#00a884", fontSize: "1.1rem", fontWeight: "700"
              }}>🔐 Change Password</h3>

              {passwordMessage.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "14px", borderRadius: "12px", marginBottom: "20px",
                    background: passwordMessage.type === "error"
                      ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                    border: `1px solid ${passwordMessage.type === "error" ? "#ef4444" : "#10b981"}`,
                    color: passwordMessage.type === "error" ? "#fca5a5" : "#6ee7b7",
                    textAlign: "center", fontWeight: "600"
                  }}
                >
                  {passwordMessage.text}
                </motion.div>
              )}

              <div style={{ marginBottom: "18px" }}>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", display: "block" }}>Current Password</label>
                <input type="password" placeholder="Enter current password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="profile-input" required />
              </div>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", display: "block" }}>New Password</label>
                <input type="password" placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="profile-input" required />
              </div>
              <div style={{ marginBottom: "22px" }}>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", display: "block" }}>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="profile-input" required />
              </div>
              <button type="submit" disabled={loading} className="profile-btn" style={{
                background: "linear-gradient(135deg, #00a884 0%, #00d4aa 100%)",
                color: "white", boxShadow: "0 8px 25px rgba(0,168,132,0.4)"
              }}>
                {loading ? "Updating..." : "🔒 Update Password"}
              </button>
            </motion.form>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} style={{ marginTop: "35px" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="profile-btn"
                style={{
                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  color: "white", marginBottom: "12px",
                  boxShadow: "0 8px 25px rgba(220,38,38,0.3)"
                }}
              >
                🚪 Logout
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  if (!window.confirm("Are you sure you want to delete your account? This cannot be undone!")) return;
                  try {
                    await api.delete("/api/users/me");
                    logout();
                    navigate("/login");
                  } catch (err) {
                    alert("Failed to delete account");
                  }
                }}
                className="profile-btn"
                style={{
                  background: "transparent",
                  border: "2px solid rgba(220,38,38,0.5)",
                  color: "#fca5a5"
                }}
              >
                🗑️ Delete Account
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
