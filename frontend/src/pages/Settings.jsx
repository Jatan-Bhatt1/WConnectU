import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    if (user?.privacy) setPrivacy(user.privacy);
  }, [user]);

  const handlePrivacyChange = async (key, value) => {
    const newPrivacy = { ...privacy, [key]: value };
    setPrivacy(newPrivacy);
    try {
      const { data } = await api.put("/api/users/settings", { privacy: newPrivacy });
      updateUser(data);
    } catch (err) {
      console.error("Failed to update settings:", err);
      setPrivacy(privacy);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(131,77,255,0.3); }
          50% { box-shadow: 0 0 40px rgba(131,77,255,0.5); }
        }
        .settings-toggle {
          width: 52px;
          height: 28px;
          border-radius: 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          outline: none;
        }
        .settings-toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .settings-toggle.active::after {
          left: 27px;
        }
        .settings-select {
          padding: 10px 16px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
        }
        .settings-select:hover, .settings-select:focus {
          border-color: #834dff;
          box-shadow: 0 0 0 4px rgba(131,77,255,0.15);
        }
        .settings-select option {
          background: #1a1a2e;
          color: white;
        }
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
          position: "absolute", top: "5%", right: "15%", width: "400px", height: "400px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(131,77,255,0.2) 0%, transparent 70%)",
          filter: "blur(80px)", animation: "float 9s ease-in-out infinite", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "10%", width: "350px", height: "350px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(0,168,132,0.2) 0%, transparent 70%)",
          filter: "blur(70px)", animation: "float 7s ease-in-out infinite reverse", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "50%", width: "200px", height: "200px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(52,183,241,0.15) 0%, transparent 70%)",
          filter: "blur(50px)", animation: "float 11s ease-in-out infinite", pointerEvents: "none"
        }} />

        {/* Main content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 10 }}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "flex", alignItems: "center", marginBottom: "30px", gap: "20px"
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")}
              style={{
                background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "14px",
                padding: "12px 16px", color: "white", fontSize: "1.3rem",
                cursor: "pointer", display: "flex", alignItems: "center"
              }}
            >
              ←
            </motion.button>
            <h1 style={{
              margin: 0, fontSize: "2rem", fontWeight: "800",
              background: "linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Settings
            </h1>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            style={{
              background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)",
              borderRadius: "20px", padding: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
              marginBottom: "20px", position: "relative", overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, #834dff, #a855f7)"
            }} />
            <h3 style={{
              margin: "0 0 20px", fontSize: "1.15rem", fontWeight: "700",
              color: "#834dff", display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "1.3rem" }}>🎨</span> Appearance
            </h3>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0"
            }}>
              <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Theme</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                style={{
                  padding: "10px 20px", borderRadius: "25px",
                  border: "1px solid rgba(131,77,255,0.3)",
                  background: theme === "light"
                    ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                    : "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
                  color: "white", fontWeight: "600", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "10px",
                  boxShadow: theme === "light"
                    ? "0 4px 20px rgba(251,191,36,0.4)"
                    : "0 4px 20px rgba(15,23,42,0.4)"
                }}
              >
                {theme === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </motion.button>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            style={{
              background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)",
              borderRadius: "20px", padding: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
              marginBottom: "20px", position: "relative", overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, #00a884, #10b981)"
            }} />
            <h3 style={{
              margin: "0 0 20px", fontSize: "1.15rem", fontWeight: "700",
              color: "#00a884", display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "1.3rem" }}>🔔</span> Notifications
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Message Sounds</span>
                <button
                  className="settings-toggle active"
                  style={{ background: "linear-gradient(135deg, #00a884 0%, #10b981 100%)" }}
                  onClick={(e) => e.currentTarget.classList.toggle("active")}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Desktop Notifications</span>
                <button
                  className="settings-toggle"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                  onClick={(e) => {
                    e.currentTarget.classList.toggle("active");
                    e.currentTarget.style.background = e.currentTarget.classList.contains("active")
                      ? "linear-gradient(135deg, #00a884 0%, #10b981 100%)"
                      : "rgba(255,255,255,0.15)";
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            style={{
              background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)",
              borderRadius: "20px", padding: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
              marginBottom: "20px", position: "relative", overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, #34b7f1, #3b82f6)"
            }} />
            <h3 style={{
              margin: "0 0 20px", fontSize: "1.15rem", fontWeight: "700",
              color: "#34b7f1", display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "1.3rem" }}>🔒</span> Privacy
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Last Seen</span>
                <select
                  value={privacy.lastSeen}
                  onChange={(e) => handlePrivacyChange("lastSeen", e.target.value)}
                  className="settings-select"
                >
                  <option>Everyone</option>
                  <option>My Contacts</option>
                  <option>Nobody</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Read Receipts</span>
                <button
                  className={`settings-toggle ${privacy.readReceipts ? "active" : ""}`}
                  style={{
                    background: privacy.readReceipts
                      ? "linear-gradient(135deg, #34b7f1 0%, #3b82f6 100%)"
                      : "rgba(255,255,255,0.15)"
                  }}
                  onClick={() => handlePrivacyChange("readReceipts", !privacy.readReceipts)}
                />
              </div>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            style={{
              background: "rgba(255,255,255,0.05)", backdropFilter: "blur(30px)",
              borderRadius: "20px", padding: "28px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
              position: "relative", overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, #f472b6, #ec4899)"
            }} />
            <h3 style={{
              margin: "0 0 20px", fontSize: "1.15rem", fontWeight: "700",
              color: "#f472b6", display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "1.3rem" }}>❓</span> Help
            </h3>

            <motion.div
              whileHover={{ x: 10, color: "#f472b6" }}
              style={{
                padding: "12px 0", cursor: "pointer", color: "rgba(255,255,255,0.8)",
                fontWeight: "500", display: "flex", alignItems: "center", gap: "10px",
                transition: "color 0.3s"
              }}
            >
              💬 Need help? Contact Support
              <span style={{ marginLeft: "auto" }}>→</span>
            </motion.div>
          </motion.div>

          {/* Version info */}
          <motion.p
            variants={itemVariants}
            style={{
              textAlign: "center", marginTop: "30px",
              color: "rgba(255,255,255,0.3)", fontSize: "0.85rem"
            }}
          >
            WconnectU v1.0.0 • Made with 💜
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
