import { useEffect, useRef } from "react";

export default function SignIn() {
  const sceneRef = useRef(null);
  const passwordRef = useRef(null);

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

        .login-card {
          background: rgba(255,255,255,0.95);
          padding: 45px 40px;
          border-radius: 30px;
          width: 360px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.08),
                      0 10px 15px rgba(0,0,0,0.05);
        }

        .login-card svg {
          width: 300px;
          height: 190px;
          margin-bottom: 25px;
          filter: drop-shadow(0px 10px 10px rgba(0,0,0,0.15));
          pointer-events: none;
        }

        .eye {
          transition: transform 0.1s;
        }

        .eye-open {
          animation: blink 4s infinite;
        }

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

        .input-group {
          margin-bottom: 18px;
          text-align: left;
        }

        label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #718096;
        }

        input {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          border: 2px solid #edf2f7;
          background: #f7fafc;
          font-size: 1rem;
        }

        input:focus {
          outline: none;
          border-color: #6a2cff;
          box-shadow: 0 0 0 4px rgba(106,44,255,0.1);
        }

        button {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg,#6a2cff,#8b5cf6);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      <div className="login-card">
        <svg ref={sceneRef} viewBox="0 0 320 230">
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

          {/* Character 1 */}
          <g className="character">
            <rect x="100" y="50" width="70" height="130" rx="12" fill="url(#grad-purple)" transform="rotate(-3 135 180)" />
            <circle className="eye eye-open" cx="125" cy="90" r="4.5" fill="white" />
            <circle className="eye eye-open" cx="155" cy="90" r="4.5" fill="white" />
            <rect className="mouth" x="139" y="98" width="3" height="14" rx="1.5" fill="#1a0b40" />
            <circle className="hand" cx="125" cy="150" r="13" fill="url(#grad-purple)" />
            <circle className="hand" cx="155" cy="150" r="13" fill="url(#grad-purple)" />
          </g>

          {/* Character 2 */}
          <g className="character">
            <rect x="180" y="80" width="55" height="100" rx="12" fill="url(#grad-black)" />
            <circle className="eye eye-open" cx="196" cy="105" r="4.5" fill="white" />
            <circle className="eye eye-open" cx="218" cy="105" r="4.5" fill="white" />
            <circle className="hand" cx="196" cy="160" r="11" fill="#333" />
            <circle className="hand" cx="218" cy="160" r="11" fill="#333" />
          </g>

          {/* Character 3 */}
          <g className="character">
            <path d="M50 210 Q50 130 130 130 Q210 130 190 210 Z" fill="url(#grad-orange)" />
            <circle className="eye eye-open" cx="110" cy="155" r="4.5" fill="#1c1c1c" />
            <circle className="eye eye-open" cx="135" cy="155" r="4.5" fill="#1c1c1c" />
            <circle className="hand" cx="110" cy="190" r="13" fill="url(#grad-orange)" />
            <circle className="hand" cx="140" cy="190" r="13" fill="url(#grad-orange)" />
          </g>

          {/* Character 4 */}
          <g className="character">
            <path d="M210 210 L210 150 Q210 110 250 110 Q290 110 280 210 Z" fill="url(#grad-yellow)" />
            <circle className="eye eye-open" cx="260" cy="140" r="3.5" fill="#1c1c1c" />
            <rect className="mouth" x="266" y="145" width="12" height="3" rx="1.5" fill="#1c1c1c" />
            <circle className="hand" cx="240" cy="190" r="12" fill="url(#grad-yellow)" />
            <circle className="hand" cx="270" cy="190" r="12" fill="url(#grad-yellow)" />
          </g>
        </svg>

        <h2>Welcome Back</h2>
        <p>Enter your credentials to access your account.</p>

        <div className="input-group">
          <label>Email Address</label>
          <input type="email" placeholder="name@company.com" />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input ref={passwordRef} type="password" placeholder="••••••••" />
        </div>

        <button>Sign In</button>
      </div>
    </>
  );
}