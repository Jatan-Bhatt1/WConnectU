import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const sceneRef = useRef(null);
  const passwordRef = useRef(null);
  const [name, setName] = useState("");
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

      const rect = scene.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const damp = 25;
      const dx = Math.max(-12, Math.min(12, (e.clientX - centerX) / damp));
      const dy = Math.max(-12, Math.min(12, (e.clientY - centerY) / damp));

      eyes.forEach((eye) => {
        eye.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      mouths.forEach((mouth) => {
        mouth.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px)`;
      });
    };

    const onFocus = () => scene.classList.add("password-mode");
    const onBlur = () => {
      scene.classList.remove("password-mode");
      eyes.forEach((e) => (e.style.transform = "translate(0,0)"));
      mouths.forEach((m) => (m.style.transform = "translate(0,0)"));
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
      await api.post("/api/auth/register", { name, email, password });
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
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
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .eye { transition: transform 0.1s; }
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
          padding: 14px 18px;
          border-radius: 14px;
          border: 2px solid transparent;
          background: linear-gradient(#fff, #fff) padding-box,
                      linear-gradient(135deg, #e2e8f0 0%, #edf2f7 100%) border-box;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
          color: #1a202c;
        }
        .auth-input:focus {
          outline: none;
          background: linear-gradient(#fff, #fff) padding-box,
                      linear-gradient(135deg, #00a884 0%, #00d4aa 100%) border-box;
          box-shadow: 0 0 0 4px rgba(0, 168, 132, 0.15),
                      0 4px 20px rgba(0, 168, 132, 0.1);
        }
        .auth-input::placeholder {
          color: #a0aec0;
        }
        .auth-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #00a884 0%, #00d4aa 50%, #00f2c3 100%);
          color: white;
          font-weight: 700;
          font-size: 1.02rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 168, 132, 0.4),
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
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.5s ease;
        }
        .auth-btn:hover::before {
          left: 100%;
        }
        .auth-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(0, 168, 132, 0.5),
                      inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .form-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 28px;
          padding: 40px 40px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.12),
                      0 10px 30px rgba(0,0,0,0.08),
                      inset 0 1px 0 rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.8);
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
          background: linear-gradient(90deg, #00a884, #00d4aa, #00f2fe, #834dff, #00a884);
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
          font-size: 0.85rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
        }
        .input-icon {
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        background: "#0a1628"
      }}>
        {/* Left Panel - Decorative */}
        <div style={{
          flex: 1,
          background: "linear-gradient(145deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "40px"
        }}>
          {/* Animated gradient orbs */}
          <div style={{
            position: "absolute",
            top: "15%",
            right: "20%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,168,132,0.35) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "float 7s ease-in-out infinite"
          }} />
          <div style={{
            position: "absolute",
            bottom: "10%",
            left: "15%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,170,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "float 9s ease-in-out infinite reverse"
          }} />
          <div style={{
            position: "absolute",
            top: "60%",
            right: "40%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(131,77,255,0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "float 6s ease-in-out infinite"
          }} />

          {/* Decorative ring */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(0,168,132,0.2)",
            animation: "rotate 30s linear infinite"
          }}>
            <div style={{
              position: "absolute",
              top: "-5px",
              left: "50%",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#00a884"
            }} />
          </div>

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
              Start your<br />
              <span style={{
                background: "linear-gradient(135deg, #00a884 0%, #00d4aa 50%, #00f2fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>journey</span>
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "#718096",
              maxWidth: "400px",
              lineHeight: "1.6"
            }}>
              Create your account and join a community of millions. Chat, share, and connect seamlessly.
            </p>

            {/* Stats */}
            <div style={{
              display: "flex",
              gap: "40px",
              marginTop: "50px",
              justifyContent: "center"
            }}>
              {[
                { num: "10M+", label: "Users" },
                { num: "50M+", label: "Messages" },
                { num: "150+", label: "Countries" }
              ].map((stat, i) => (
                <div key={i} style={{
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: "#00a884"
                  }}>{stat.num}</div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#718096",
                    marginTop: "4px"
                  }}>{stat.label}</div>
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
            background: "linear-gradient(to top, #0a1628 0%, transparent 100%)",
            pointerEvents: "none"
          }} />
        </div>

        {/* Right Panel - Form */}
        <div style={{
          width: "550px",
          minWidth: "550px",
          background: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)",
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
            background: "rgba(0, 168, 132, 0.08)",
            filter: "blur(40px)"
          }} />
          <div style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(0, 212, 170, 0.08)",
            filter: "blur(30px)"
          }} />

          <div className="form-card" style={{ animation: "fadeInUp 0.6s ease", width: "100%", maxWidth: "400px" }}>
            {/* Character SVG */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <svg ref={sceneRef} viewBox="0 0 320 230" style={{
                width: "220px",
                height: "140px",
                filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.15))"
              }}>
                <defs>
                  <linearGradient id="grad-purple-r" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#834dff" />
                    <stop offset="100%" stopColor="#6a2cff" />
                  </linearGradient>
                  <linearGradient id="grad-black-r" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#3d3d3d" />
                    <stop offset="100%" stopColor="#1c1c1c" />
                  </linearGradient>
                  <linearGradient id="grad-orange-r" x1="0%" y1="0%" x2="100%" y2="80%">
                    <stop offset="0%" stopColor="#ff9f43" />
                    <stop offset="100%" stopColor="#ff8c1a" />
                  </linearGradient>
                  <linearGradient id="grad-yellow-r" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe03d" />
                    <stop offset="100%" stopColor="#ffd400" />
                  </linearGradient>
                </defs>

                <g className="character">
                  <rect x="100" y="50" width="70" height="130" rx="12" fill="url(#grad-purple-r)" transform="rotate(-3 135 180)" />
                  <circle className="eye eye-open" cx="125" cy="90" r="4.5" fill="white" />
                  <circle className="eye eye-open" cx="155" cy="90" r="4.5" fill="white" />
                  <rect className="mouth" x="139" y="98" width="3" height="14" rx="1.5" fill="#1a0b40" />
                  <circle className="hand" cx="125" cy="150" r="13" fill="url(#grad-purple-r)" />
                  <circle className="hand" cx="155" cy="150" r="13" fill="url(#grad-purple-r)" />
                </g>

                <g className="character">
                  <rect x="180" y="80" width="55" height="100" rx="12" fill="url(#grad-black-r)" />
                  <circle className="eye eye-open" cx="196" cy="105" r="4.5" fill="white" />
                  <circle className="eye eye-open" cx="218" cy="105" r="4.5" fill="white" />
                  <circle className="hand" cx="196" cy="160" r="11" fill="#333" />
                  <circle className="hand" cx="218" cy="160" r="11" fill="#333" />
                </g>

                <g className="character">
                  <path d="M50 210 Q50 130 130 130 Q210 130 190 210 Z" fill="url(#grad-orange-r)" />
                  <circle className="eye eye-open" cx="110" cy="155" r="4.5" fill="#1c1c1c" />
                  <circle className="eye eye-open" cx="135" cy="155" r="4.5" fill="#1c1c1c" />
                  <circle className="hand" cx="110" cy="190" r="13" fill="url(#grad-orange-r)" />
                  <circle className="hand" cx="140" cy="190" r="13" fill="url(#grad-orange-r)" />
                </g>

                <g className="character">
                  <path d="M210 210 L210 150 Q210 110 250 110 Q290 110 280 210 Z" fill="url(#grad-yellow-r)" />
                  <circle className="eye eye-open" cx="260" cy="140" r="3.5" fill="#1c1c1c" />
                  <rect className="mouth" x="266" y="145" width="12" height="3" rx="1.5" fill="#1c1c1c" />
                  <circle className="hand" cx="240" cy="190" r="12" fill="url(#grad-yellow-r)" />
                  <circle className="hand" cx="270" cy="190" r="12" fill="url(#grad-yellow-r)" />
                </g>
              </svg>
            </div>

            <h2 style={{
              fontSize: "1.7rem",
              fontWeight: "800",
              color: "#1a202c",
              marginBottom: "6px",
              textAlign: "center",
              letterSpacing: "-0.5px"
            }}>Create Account</h2>
            <p style={{
              color: "#718096",
              marginBottom: "24px",
              fontSize: "0.9rem",
              textAlign: "center"
            }}>Sign up to get started with WconnectU</p>

            <form onSubmit={handleSubmit} autoComplete="off">
              <div style={{ marginBottom: "16px" }}>
                <label className="input-label">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="off"
                  required
                  className="auth-input"
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
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
              <div style={{ marginBottom: "22px" }}>
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
                  minLength={6}
                  className="auth-input"
                />
              </div>
              {error && (
                <div style={{
                  color: '#e53e3e',
                  marginBottom: "14px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  padding: "12px 14px",
                  background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)",
                  borderRadius: "12px",
                  border: "1px solid #feb2b2",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}
              <button type="submit" disabled={loading} className="auth-btn">
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            <div style={{
              marginTop: "24px",
              fontSize: "0.9rem",
              color: "#718096",
              textAlign: "center"
            }}>
              Already have an account?{" "}
              <Link to="/login" style={{
                color: "#00a884",
                fontWeight: "700",
                textDecoration: "none",
                transition: "color 0.2s"
              }}>Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
