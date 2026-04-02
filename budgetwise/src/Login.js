import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
  }

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
    position: relative;
    overflow: hidden;
  }

  .login-page::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%);
    top: -100px;
    right: -100px;
    border-radius: 50%;
    pointer-events: none;
  }

  .login-page::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
    bottom: -50px;
    left: -50px;
    border-radius: 50%;
    pointer-events: none;
  }

  .login-card {
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

  .login-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .login-logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .login-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
  }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .login-subtitle {
    font-size: 14px;
    color: #666680;
    margin-bottom: 32px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #9999bb;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-input-wrap {
    position: relative;
  }

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

  .login-btn {
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

  .login-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,255,136,0.25);
  }

  .login-btn:active { transform: translateY(0); }

  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .login-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #666680;
  }

  .login-footer a {
    color: #00ff88;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }

  .login-footer a:hover { opacity: 0.8; }

  .error-msg {
    background: rgba(255,59,59,0.1);
    border: 1px solid rgba(255,59,59,0.2);
    color: #ff6b6b;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    margin-bottom: 20px;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || "Invalid username or password");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role || "USER");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="login-card">

          <div className="login-logo">
            <div className="login-logo-icon">💰</div>
            <span className="login-logo-text">BudgetWise</span>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to manage your finances</p>

          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="form-input-wrap">
              <input
                className="form-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ paddingRight: "44px" }}
              />
              <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="login-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Login;