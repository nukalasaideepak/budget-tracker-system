// ─────────────────────────────────────────────────────────────
//  Dashboard.js  —  Updated with Modules 3, 4, 5
//  Nav: dashboard, history, budget, savings, reports, export, forum, profile
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BudgetSavingsModule from "./BudgetSavings";
import ReportsModule       from "./Reports";
import ExportBackupModule  from "./ExportBackup";
import ForumModule         from "./Forum";
import CompareModule       from "./CompareModule";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; font-family: 'DM Sans', sans-serif; color: #ffffff; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #13131a; }
  ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
  .app { display: flex; min-height: 100vh; background: #0a0a0f; }
  .sidebar { width: 240px; background: #13131a; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; padding: 24px 0; position: fixed; height: 100vh; z-index: 10; }
  .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 0 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sidebar-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #00ff88, #00cc6a); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .sidebar-logo-text { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 14px; font-weight: 500; color: #666680; border: none; background: none; width: 100%; text-align: left; }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: #ccccdd; }
  .nav-item.active { background: rgba(0,255,136,0.1); color: #00ff88; }
  .nav-item-icon { font-size: 18px; width: 20px; text-align: center; }
  .sidebar-bottom { padding: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
  .logout-btn { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: #ff6b6b; border: none; background: none; width: 100%; text-align: left; transition: all 0.2s; }
  .logout-btn:hover { background: rgba(255,107,107,0.08); }
  .main { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; animation: fadeIn 0.4s ease both; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .page-header { margin-bottom: 28px; }
  .page-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
  .page-subtitle { font-size: 14px; color: #666680; margin-top: 4px; }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; transition: transform 0.2s; }
  .stat-card:hover { transform: translateY(-2px); }
  .stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #666680; margin-bottom: 10px; font-weight: 500; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -1px; }
  .stat-income .stat-value { color: #00ff88; }
  .stat-expense .stat-value { color: #ff6b6b; }
  .stat-balance .stat-value { color: #7c8cf8; }
  .stat-icon { font-size: 24px; margin-bottom: 12px; }
  .card { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; margin-bottom: 24px; }
  .card-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #ffffff; margin-bottom: 20px; letter-spacing: -0.3px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: end; }
  .form-group { display: flex; flex-direction: column; }
  .form-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; color: #666680; margin-bottom: 8px; font-weight: 500; }
  .form-input, .form-select { padding: 12px 14px; background: #1a1a26; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; color: #ffffff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; }
  .form-input:focus, .form-select:focus { border-color: #00ff88; box-shadow: 0 0 0 3px rgba(0,255,136,0.07); }
  .form-input::placeholder { color: #33334a; }
  .form-select option { background: #1a1a26; }
  .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #00ff88, #00cc6a); border: none; border-radius: 10px; color: #0a0a0f; font-size: 14px; font-weight: 700; font-family: 'Syne', sans-serif; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,255,136,0.2); }
  .btn-secondary { padding: 12px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #ccccdd; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .btn-secondary:hover { background: rgba(255,255,255,0.08); }
  .btn-edit { padding: 6px 14px; background: rgba(124,140,248,0.12); border: 1px solid rgba(124,140,248,0.2); border-radius: 7px; color: #7c8cf8; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; margin-right: 6px; }
  .btn-edit:hover { background: rgba(124,140,248,0.2); }
  .btn-delete { padding: 6px 14px; background: rgba(255,107,107,0.12); border: 1px solid rgba(255,107,107,0.2); border-radius: 7px; color: #ff6b6b; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .btn-delete:hover { background: rgba(255,107,107,0.2); }
  .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #1a1a26; }
  th { padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #666680; font-weight: 600; text-align: left; }
  td { padding: 14px 16px; font-size: 14px; color: #ccccdd; border-top: 1px solid rgba(255,255,255,0.04); }
  tbody tr:hover { background: rgba(255,255,255,0.02); }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; }
  .badge-income { background: rgba(0,255,136,0.1); color: #00ff88; }
  .badge-expense { background: rgba(255,107,107,0.1); color: #ff6b6b; }
  .profile-card { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 32px; max-width: 460px; }
  .profile-avatar { width: 72px; height: 72px; background: linear-gradient(135deg, #00ff88, #00cc6a); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-family: 'Syne', sans-serif; font-weight: 800; color: #0a0a0f; margin-bottom: 20px; }
  .profile-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
  .profile-role { font-size: 13px; color: #00ff88; margin-bottom: 24px; }
  .profile-field { background: #1a1a26; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; }
  .profile-field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #666680; margin-bottom: 6px; font-weight: 500; }
  .profile-field-value { font-size: 15px; color: #ffffff; display: flex; align-items: center; justify-content: space-between; }
  .empty-state { text-align: center; padding: 48px 24px; color: #444460; }
  .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state-text { font-size: 15px; }
`;

const CATEGORIES = [
  { name: "Food",          icon: "🍔" },
  { name: "Transport",     icon: "🚗" },
  { name: "Shopping",      icon: "🛍️" },
  { name: "Rent",          icon: "🏠" },
  { name: "Bills",         icon: "💡" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Others",        icon: "📦" }
];

const NAV_ITEMS = [
  { key: "dashboard", icon: "📊", label: "Dashboard"        },
  { key: "history",   icon: "📋", label: "History"          },
  { key: "budget",    icon: "💼", label: "Budget"           },
  { key: "savings",   icon: "🎯", label: "Savings Goals"    },
  { key: "reports",   icon: "📈", label: "Reports"          },
  { key: "export",    icon: "💾", label: "Export & Backup"  },
  { key: "forum",     icon: "💬", label: "Tips Forum"       },
  { key: "compare",   icon: "⚖️", label: "Compare Prices"   },
  { key: "profile",   icon: "👤", label: "Profile"          },
];

function Dashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);

  const [username,      setUsername]      = useState("");
  const [token,         setToken]         = useState("");
  const [role,          setRole]          = useState("USER");
  const [transactions,  setTransactions]  = useState([]);
  const [amount,        setAmount]        = useState("");
  const [category,      setCategory]      = useState("Food");
  const [type,          setType]          = useState("");
  const [description,   setDescription]   = useState("");
  const [editId,        setEditId]        = useState(null);

  const initLimits = {};
  CATEGORIES.forEach(c => { initLimits[c.name] = ""; });
  const [budgetLimits, setBudgetLimits] = useState(initLimits);

  useEffect(() => {
    const storedToken    = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole     = localStorage.getItem("role");
    if (!storedToken) { navigate("/"); return; }
    setToken(storedToken);
    setUsername(storedUsername || "");
    setRole(storedRole || "USER");
    loadTransactions(storedToken, storedUsername);

    const intv = setInterval(() => {
       if(storedUsername) {
         fetch(`http://localhost:8080/api/alerts/notifications?username=${storedUsername}`, { headers: { Authorization: `Bearer ${storedToken}` } })
           .then(r => r.json())
           .then(data => setNotifications(data.filter(n => !n.read)))
           .catch(() => {});
       }
    }, 10000);
    return () => clearInterval(intv);
  }, []);

  const loadTransactions = async (tkn, user) => {
    const authToken = tkn  || token;
    try {
      const res = await fetch(
        `http://localhost:8080/transactions/all`,
        { headers: { "Authorization": `Bearer ${authToken}` } }
      );
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      console.error("Failed to load transactions:", e);
    }
  };

  const addTransaction = async () => {
    if (!amount || !type) { alert("Please fill all fields"); return; }
    if (category === "Others" && !description.trim()) { alert("Please add a description for 'Others' category"); return; }
    try {
      const url = editId
        ? `http://localhost:8080/transactions/update/${editId}`
        : `http://localhost:8080/transactions/add`;
      await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          type,
          description: category === "Others" ? description : (description || category)
        })
      });
      setAmount(""); setCategory("Food"); setType(""); setDescription(""); setEditId(null);
      loadTransactions();
    } catch (e) { alert("Failed to save transaction"); }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(
        `http://localhost:8080/transactions/${id}`,
        { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } }
      );
      loadTransactions();
    } catch (e) { alert("Failed to delete"); }
  };

  const editTransaction = (t) => {
    setAmount(t.amount); setCategory(t.category); setType(t.type);
    setDescription(t.description || "");
    setEditId(t.id); setSection("dashboard");
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "INCOME") income += t.amount;
    else expense += t.amount;
  });
  const balance = income - expense;

  const spendingByCategory = {};
  CATEGORIES.forEach(c => { spendingByCategory[c.name] = 0; });
  transactions.forEach(t => {
    if (t.type === "EXPENSE" && spendingByCategory[t.category] !== undefined)
      spendingByCategory[t.category] += t.amount;
  });

  const getCatIcon = (name) => CATEGORIES.find(c => c.name === name)?.icon || "📦";

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">💰</div>
            <span className="sidebar-logo-text">BudgetWise</span>
          </div>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`nav-item ${section === item.key ? "active" : ""}`}
                onClick={() => setSection(item.key)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="nav-item-icon">🚪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main" key={section}>

          {/* ════════ DASHBOARD ════════ */}
          {section === "dashboard" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">{editId ? "Edit Transaction" : `Good day, ${username} 👋`}</h1>
                <p className="page-subtitle">{editId ? "Update your transaction details below" : "Here's your financial overview"}</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card stat-income">
                  <div className="stat-icon">📈</div>
                  <div className="stat-label">Total Income</div>
                  <div className="stat-value">₹{income.toLocaleString()}</div>
                </div>
                <div className="stat-card stat-expense">
                  <div className="stat-icon">📉</div>
                  <div className="stat-label">Total Expense</div>
                  <div className="stat-value">₹{expense.toLocaleString()}</div>
                </div>
                <div className="stat-card stat-balance">
                  <div className="stat-icon">💳</div>
                  <div className="stat-label">Balance</div>
                  <div className="stat-value">₹{balance.toLocaleString()}</div>
                </div>
              </div>
              <div className="card">
                <div className="card-title">{editId ? "✏️ Edit Transaction" : "➕ New Transaction"}</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Amount (₹)</label>
                    <input className="form-input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); if (e.target.value !== "Others") setDescription(""); }}>
                      {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                      <option value="">Select Type</option>
                      <option value="INCOME">📈 Income</option>
                      <option value="EXPENSE">📉 Expense</option>
                    </select>
                  </div>
                </div>
                {/* ── Description field for "Others" category ── */}
                {category === "Others" && (
                  <div style={{ marginTop: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Describe this transaction (required for Others)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <button className="btn-primary" onClick={addTransaction}>{editId ? "Update Transaction" : "Add Transaction"}</button>
                  {editId && (
                    <button className="btn-secondary" onClick={() => { setEditId(null); setAmount(""); setCategory("Food"); setType(""); setDescription(""); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════════ HISTORY ════════ */}
          {section === "history" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">Transaction History</h1>
                <p className="page-subtitle">{transactions.length} transactions recorded</p>
              </div>
              <div className="card" style={{ padding: 0 }}>
                {transactions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <div className="empty-state-text">No transactions yet. Add your first one!</div>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>#</th><th>Amount</th><th>Category</th><th>Type</th><th>Description</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {transactions.map(t => (
                          <tr key={t.id}>
                            <td style={{ color: "#444460" }}>{t.id}</td>
                            <td style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>₹{t.amount?.toLocaleString()}</td>
                            <td><span style={{ display: "flex", alignItems: "center", gap: 6 }}>{getCatIcon(t.category)} {t.category}</span></td>
                            <td><span className={`badge ${t.type === "INCOME" ? "badge-income" : "badge-expense"}`}>{t.type}</span></td>
                            <td style={{ color: "#888899", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description || "—"}</td>
                            <td>
                              <button className="btn-edit" onClick={() => editTransaction(t)}>Edit</button>
                              <button className="btn-delete" onClick={() => deleteTransaction(t.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ BUDGET ════════ */}
          {section === "budget" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">Budget Management</h1>
                <p className="page-subtitle">Set spending limits and track your categories</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card stat-income"><div className="stat-icon">📈</div><div className="stat-label">Income</div><div className="stat-value">₹{income.toLocaleString()}</div></div>
                <div className="stat-card stat-expense"><div className="stat-icon">📉</div><div className="stat-label">Expense</div><div className="stat-value">₹{expense.toLocaleString()}</div></div>
                <div className="stat-card stat-balance"><div className="stat-icon">💳</div><div className="stat-label">Balance</div><div className="stat-value">₹{balance.toLocaleString()}</div></div>
              </div>
              <div className="card">
                <div className="card-title">Category Limits</div>
                <div style={{ display: "grid", gridTemplateColumns: "140px 100px 160px 1fr 120px", padding: "0 4px 12px", gap: 16 }}>
                  {["Category","Spent","Set Limit (₹)","Progress","Status"].map(h => (
                    <span key={h} style={{ fontSize: 11, color: "#444460", textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</span>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CATEGORIES.map(cat => {
                    const spent  = spendingByCategory[cat.name] || 0;
                    const limit  = parseFloat(budgetLimits[cat.name]) || 0;
                    const pct    = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                    const isOver = limit > 0 && spent > limit;
                    const isNear = limit > 0 && spent >= limit * 0.8 && !isOver;
                    const barColor  = isOver ? "#ff6b6b" : isNear ? "#ff9800" : "#00ff88";
                    return (
                      <div key={cat.name} style={{ background: "#1a1a26", border: `1px solid ${isOver ? "rgba(255,107,107,0.3)" : isNear ? "rgba(255,152,0,0.3)" : "rgba(255,255,255,0.05)"}`, borderRadius: 12, padding: "14px 20px", display: "grid", gridTemplateColumns: "140px 100px 160px 1fr 120px", alignItems: "center", gap: 16 }}>
                        <div style={{ fontWeight: 600, color: "#fff", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><span>{cat.icon}</span>{cat.name}</div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#ff6b6b" }}>₹{spent}</div>
                        <input type="number" placeholder="No limit" value={budgetLimits[cat.name]} onChange={e => setBudgetLimits({ ...budgetLimits, [cat.name]: e.target.value })} style={{ padding: "8px 12px", background: "#13131a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ background: "#13131a", borderRadius: 4, height: 6, overflow: "hidden", flex: 1 }}>
                            <div style={{ height: "100%", borderRadius: 4, width: `${pct}%`, background: barColor, transition: "width 0.5s ease" }} />
                          </div>
                          <span style={{ fontSize: 12, color: "#666680", minWidth: 35 }}>{limit > 0 ? `${Math.round(pct)}%` : "—"}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, textAlign: "right" }}>
                          {limit === 0 ? <span style={{ color: "#444460" }}>No limit</span> : isOver ? <span style={{ color: "#ff6b6b" }}>🔴 Over!</span> : isNear ? <span style={{ color: "#ff9800" }}>🟡 Near</span> : <span style={{ color: "#00ff88" }}>🟢 Safe</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════ SAVINGS GOALS ════════ */}
          {section === "savings" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">Savings Goals 🎯</h1>
                <p className="page-subtitle">Track your investments, emergency fund, and savings milestones</p>
              </div>
              <BudgetSavingsModule
                transactions={transactions}
                token={token}
                username={username}
              />
            </div>
          )}

          {/* ════════ REPORTS ════════ */}
          {section === "reports" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">Reports & Analytics 📈</h1>
                <p className="page-subtitle">Filter, visualize, and export your financial data</p>
              </div>
              <ReportsModule transactions={transactions} token={token} />
            </div>
          )}

          {/* ════════ EXPORT & BACKUP ════════ */}
          {section === "export" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">Export & Backup 💾</h1>
                <p className="page-subtitle">Download reports and backup to cloud services</p>
              </div>
              <ExportBackupModule token={token} />
            </div>
          )}

          {/* ════════ FORUM ════════ */}
          {section === "forum" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">Financial Tips Forum 💬</h1>
                <p className="page-subtitle">Share tips, ask questions, and learn from the community</p>
              </div>
              <ForumModule token={token} username={username} />
            </div>
          )}

          {/* ════════ COMPARE ════════ */}
          {section === "compare" && (
            <CompareModule token={token} username={username} />
          )}

          {/* ════════ PROFILE ════════ */}
          {section === "profile" && (
            <div>
              <div className="page-header">
                <h1 className="page-title">Profile</h1>
                <p className="page-subtitle">Your account details</p>
              </div>
              <div className="profile-card">
                <div className="profile-avatar">{username?.charAt(0).toUpperCase()}</div>
                <div className="profile-name">{username}</div>
                <div className="profile-role">● {role}</div>
                <div className="profile-field">
                  <div className="profile-field-label">Username</div>
                  <div className="profile-field-value">{username}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Role</div>
                  <div className="profile-field-value">{role}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Total Transactions</div>
                  <div className="profile-field-value">{transactions.length}</div>
                </div>
                <button onClick={handleLogout} style={{ marginTop: 20, width: "100%", padding: 13, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 10, color: "#ff6b6b", fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}

        </main>
        
        {/* ── NOTIFICATIONS TOAST ── */}
        {notifications.length > 0 && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
             {notifications.slice(0, 3).map(n => (
                <div key={n.id} style={{ background: '#1a1a26', borderLeft: '4px solid #f59e0b', padding: '16px 20px', borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: 340, cursor: 'pointer', animation: 'fadeIn 0.3s ease' }} 
                     onClick={() => {
                        fetch(`http://localhost:8080/api/alerts/notifications/${n.id}/read`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
                        setNotifications(notifications.filter(x => x.id !== n.id));
                     }}>
                   <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>Price Drop Alert</div>
                   <div style={{ fontSize: 14, color: '#fff', lineHeight: 1.4 }}>{n.message}</div>
                   <div style={{ fontSize: 11, color: '#666680', marginTop: 8 }}>Click to dismiss</div>
                </div>
             ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;