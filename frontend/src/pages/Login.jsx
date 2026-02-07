import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const sceneRef = useRef(null);
  const passwordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const scene = sceneRef.current;
    const passwordInput = passwordRef.current;
    const eyes = scene.querySelectorAll(".eye");
    const mouths = scene.querySelectorAll(".mouth");

    const handleMouseMove = (e) => {
      if (document.activeElement === passwordInput) return;

      // Use window center as reference for better tracking across full screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate distance from cursor to window center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Calculate percentage of distance from center (-1 to 1)
      const xPercent = deltaX / (window.innerWidth / 2);
      const yPercent = deltaY / (window.innerHeight / 2);

      // Scale movement based on max allowable distance
      // Increased to 28 for maximum visibility while staying on face
      const maxMove = 28;
      const moveX = xPercent * maxMove;
      const moveY = yPercent * maxMove;

      // Update transforms for smoother animation
      eyes.forEach((eye) => {
        eye.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      mouths.forEach((mouth) => {
        mouth.style.transform = `translate3d(${moveX * 0.4}px, ${moveY * 0.4}px, 0)`;
      });
    };

    const onFocus = () => scene.classList.add("password-mode");
    const onBlur = () => {
      scene.classList.remove("password-mode");
      // Reset eyes and mouths to original positions
      eyes.forEach((eye) => {
        eye.style.transform = "translate(0, 0)";
      });
      mouths.forEach((mouth) => {
        mouth.style.transform = "translate(0, 0)";
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    passwordInput.addEventListener("focus", onFocus);
    passwordInput.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setLoading(false);
      login(res.data);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(131, 77, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(131, 77, 255, 0.5); }
        }
        .eye { 
          will-change: transform;
          transform-box: fill-box;
          transform-origin: center;
        }
        .eye-open { animation: blink 4s infinite; }
        @keyframes blink {
          0%,48%,52%,100% { scale: 1 1; }
          50% { scale: 1 0.1; }
        }
        .hand {
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
          opacity: 0;
        }
        .password-mode .hand {
          opacity: 1;
          transform: translateY(-55px) !important;
        }
        .password-mode .eye {
          animation: none;
          transform: translate(0,0) !important;
        }
        .auth-input {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 2px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
          color: white;
        }
        .auth-input:focus {
          outline: none;
          border-color: #834dff;
          box-shadow: 0 0 0 4px rgba(131, 77, 255, 0.2);
          background: rgba(255,255,255,0.08);
        }
        .auth-input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .auth-btn {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #834dff 0%, #6a2cff 50%, #5a1fff 100%);
          color: white;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(131, 77, 255, 0.4),
                      inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
        }
        .auth-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .auth-btn:hover::before {
          left: 100%;
        }
        .auth-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(131, 77, 255, 0.5),
                      inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .form-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(30px);
          border-radius: 32px;
          padding: 50px 45px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }
        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #834dff, #ff9f43, #ffd400, #00a884, #834dff);
          background-size: 200% 100%;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .input-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          margin-bottom: 10px;
        }
        .input-icon {
          width: 18px;
          height: 18px;
          opacity: 0.7;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        background: "#0f0f1a"
      }}>
        {/* Left Panel - Decorative */}
        <div style={{
          flex: 1,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "40px"
        }}>
          {/* Floating gradient orbs */}
          <div style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(131,77,255,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "float 6s ease-in-out infinite"
          }} />
          <div style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,159,67,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "float 8s ease-in-out infinite reverse"
          }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: "60%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,168,132,0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "float 7s ease-in-out infinite"
          }} />

          {/* Logo */}
          <div style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            zIndex: 10
          }}>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 800,
              fontSize: '1.8rem',
              letterSpacing: '0.5px',
            }}>
              <span style={{ color: '#834dff' }}>W</span>
              <span style={{ color: '#718096' }}>c</span>
              <span style={{ color: '#ff9f43' }}>o</span>
              <span style={{ color: '#718096' }}>n</span>
              <span style={{ color: '#3b5bdb' }}>n</span>
              <span style={{ color: '#718096' }}>e</span>
              <span style={{ color: '#f0f0f0' }}>c</span>
              <span style={{ color: '#718096' }}>t</span>
              <span style={{ color: '#ffd400', fontWeight: 900 }}>U</span>
            </span>
          </div>

          {/* Main Content */}
          <div style={{
            textAlign: "center",
            zIndex: 5,
            animation: "fadeInUp 0.8s ease"
          }}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "800",
              color: "white",
              marginBottom: "20px",
              lineHeight: "1.2"
            }}>
              Connect with<br />
              <span style={{
                background: "linear-gradient(135deg, #834dff 0%, #ff9f43 50%, #ffd400 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>everyone</span>
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "#718096",
              maxWidth: "400px",
              lineHeight: "1.6"
            }}>
              Join millions of people who use WconnectU to chat, share, and connect with friends and the world.
            </p>

            {/* Feature pills */}
            <div style={{
              display: "flex",
              gap: "12px",
              marginTop: "40px",
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              {["🔒 Secure", "⚡ Fast", "🌍 Global"].map((feature, i) => (
                <div key={i} style={{
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "25px",
                  color: "#a0aec0",
                  fontSize: "0.9rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)"
                }}>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(to top, #0f0f1a 0%, transparent 100%)",
            pointerEvents: "none"
          }} />
        </div>

        {/* Right Panel - Form */}
        <div style={{
          width: "550px",
          minWidth: "550px",
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          position: "relative"
        }}>
          {/* Decorative circles */}
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(131, 77, 255, 0.05)",
            filter: "blur(40px)"
          }} />
          <div style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(255, 159, 67, 0.05)",
            filter: "blur(30px)"
          }} />

          <div className="form-card" style={{ animation: "fadeInUp 0.6s ease", width: "100%", maxWidth: "400px" }}>
            {/* Character SVG */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
              <svg ref={sceneRef} viewBox="0 0 320 230" style={{
                width: "260px",
                height: "160px",
                filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.15))"
              }}>
                <defs>
                  <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#834dff" />
                    <stop offset="100%" stopColor="#6a2cff" />
                  </linearGradient>
                  <linearGradient id="grad-black" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#3d3d3d" />
                    <stop offset="100%" stopColor="#1c1c1c" />
                  </linearGradient>
                  <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="80%">
                    <stop offset="0%" stopColor="#ff9f43" />
                    <stop offset="100%" stopColor="#ff8c1a" />
                  </linearGradient>
                  <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe03d" />
                    <stop offset="100%" stopColor="#ffd400" />
                  </linearGradient>
                </defs>

                <g className="character">
                  <rect x="100" y="50" width="70" height="130" rx="12" fill="url(#grad-purple)" transform="rotate(-3 135 180)" />
                  <circle className="eye eye-open" cx="125" cy="90" r="4.5" fill="white" />
                  <circle className="eye eye-open" cx="155" cy="90" r="4.5" fill="white" />
                  <rect className="mouth" x="139" y="98" width="3" height="14" rx="1.5" fill="#1a0b40" />
                  <circle className="hand" cx="125" cy="150" r="13" fill="url(#grad-purple)" />
                  <circle className="hand" cx="155" cy="150" r="13" fill="url(#grad-purple)" />
                </g>

                <g className="character">
                  <rect x="180" y="80" width="55" height="100" rx="12" fill="url(#grad-black)" />
                  <circle className="eye eye-open" cx="196" cy="105" r="4.5" fill="white" />
                  <circle className="eye eye-open" cx="218" cy="105" r="4.5" fill="white" />
                  <circle className="hand" cx="196" cy="160" r="11" fill="#333" />
                  <circle className="hand" cx="218" cy="160" r="11" fill="#333" />
                </g>

                <g className="character">
                  <path d="M50 210 Q50 130 130 130 Q210 130 190 210 Z" fill="url(#grad-orange)" />
                  <circle className="eye eye-open" cx="110" cy="155" r="4.5" fill="#1c1c1c" />
                  <circle className="eye eye-open" cx="135" cy="155" r="4.5" fill="#1c1c1c" />
                  <circle className="hand" cx="110" cy="190" r="13" fill="url(#grad-orange)" />
                  <circle className="hand" cx="140" cy="190" r="13" fill="url(#grad-orange)" />
                </g>

                <g className="character">
                  <path d="M210 210 L210 150 Q210 110 250 110 Q290 110 280 210 Z" fill="url(#grad-yellow)" />
                  <circle className="eye eye-open" cx="260" cy="140" r="3.5" fill="#1c1c1c" />
                  <rect className="mouth" x="266" y="145" width="12" height="3" rx="1.5" fill="#1c1c1c" />
                  <circle className="hand" cx="240" cy="190" r="12" fill="url(#grad-yellow)" />
                  <circle className="hand" cx="270" cy="190" r="12" fill="url(#grad-yellow)" />
                </g>
              </svg>
            </div>

            <h2 style={{
              fontSize: "1.9rem",
              fontWeight: "800",
              color: "white",
              marginBottom: "8px",
              textAlign: "center",
              letterSpacing: "-0.5px"
            }}>Welcome Back</h2>
            <p style={{
              color: "rgba(255,255,255,0.6)",
              marginBottom: "30px",
              fontSize: "0.95rem",
              textAlign: "center"
            }}>Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit} autoComplete="off">
              <div style={{ marginBottom: "20px" }}>
                <label className="input-label">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                  className="auth-input"
                />
              </div>
              <div style={{ marginBottom: "28px" }}>
                <label className="input-label">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Password
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                  className="auth-input"
                />
              </div>
              {error && (
                <div style={{
                  color: '#fca5a5',
                  marginBottom: "18px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  padding: "14px 16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  borderRadius: "12px",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="auth-btn">
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    Signing In...
                  </span>
                ) : "Sign In"}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>

            <div style={{
              marginTop: "28px",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.6)",
              textAlign: "center"
            }}>
              Don't have an account?{" "}
              <Link to="/register" style={{
                color: "#834dff",
                fontWeight: "700",
                textDecoration: "none",
                transition: "color 0.2s"
              }}>Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
