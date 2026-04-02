import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
  }

  .register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
    position: relative;
    overflow: hidden;
  }

  .register-page::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
    top: -80px;
    left: -80px;
    border-radius: 50%;
    pointer-events: none;
  }

  .register-page::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%);
    bottom: -50px;
    right: -50px;
    border-radius: 50%;
    pointer-events: none;
  }

  .register-card {
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 24px;
    padding: 48px;
    width: 420px;
    position: relative;
    z-index: 1;
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .register-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .register-logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .register-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
  }

  .register-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .register-subtitle {
    font-size: 14px;
    color: #666680;
    margin-bottom: 32px;
  }

  .form-group { margin-bottom: 20px; }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #9999bb;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-input-wrap { position: relative; }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    background: #1a1a26;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #ffffff;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    outline: none;
  }

  .form-input:focus {
    border-color: #00ff88;
    background: #1e1e2e;
    box-shadow: 0 0 0 3px rgba(0,255,136,0.08);
  }

  .form-input::placeholder { color: #44445a; }

  .eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #666680;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    transition: color 0.2s;
  }

  .eye-btn:hover { color: #00ff88; }

  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  .strength-segment {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: #1a1a26;
    transition: background 0.3s;
  }

  .strength-text {
    font-size: 11px;
    margin-top: 4px;
    font-weight: 500;
  }

  .register-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    border: none;
    border-radius: 12px;
    color: #0a0a0f;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
    letter-spacing: 0.3px;
  }

  .register-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,255,136,0.25);
  }

  .register-btn:active { transform: translateY(0); }

  .register-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .register-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #666680;
  }

  .register-footer a {
    color: #00ff88;
    text-decoration: none;
    font-weight: 500;
  }

  .register-footer a:hover { opacity: 0.8; }

  .error-msg {
    background: rgba(255,59,59,0.1);
    border: 1px solid rgba(255,59,59,0.2);
    color: #ff6b6b;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .success-msg {
    background: rgba(0,255,136,0.1);
    border: 1px solid rgba(0,255,136,0.2);
    color: #00ff88;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthColors = ["#1a1a26", "#ff4444", "#ff9800", "#ffeb3b", "#00ff88"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthTextColors = ["", "#ff4444", "#ff9800", "#ffeb3b", "#00ff88"];

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.error || "Username already exists. Try another.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="register-page">
        <div className="register-card">

          <div className="register-logo">
            <div className="register-logo-icon">💰</div>
            <span className="register-logo-text">BudgetWise</span>
          </div>

          <h1 className="register-title">Create account</h1>
          <p className="register-subtitle">Start tracking your finances today</p>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="form-input-wrap">
              <input
                className="form-input"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "44px" }}
              />
              <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {password && (
              <>
                <div className="strength-bar">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="strength-segment"
                      style={{ background: i <= strength ? strengthColors[strength] : "#1a1a26" }}
                    />
                  ))}
                </div>
                <p className="strength-text" style={{ color: strengthTextColors[strength] }}>
                  {strengthLabels[strength]}
                </p>
              </>
            )}
          </div>

          <button className="register-btn" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="register-footer">
            Already have an account? <Link to="/">Sign in</Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Register;