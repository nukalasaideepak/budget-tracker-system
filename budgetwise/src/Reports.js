// ─────────────────────────────────────────────────────────────
//  Reports.js — Module 4: Reports & Analytics
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";

const reportStyles = `
  .rpt-container { display: flex; flex-direction: column; gap: 24px; }

  .rpt-filters { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; display: flex; gap: 16px; align-items: end; flex-wrap: wrap; }
  .rpt-filter-group { display: flex; flex-direction: column; }
  .rpt-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; color: #666680; margin-bottom: 8px; font-weight: 500; }
  .rpt-input, .rpt-select { padding: 10px 14px; background: #1a1a26; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; }
  .rpt-input:focus, .rpt-select:focus { border-color: #00ff88; }
  .rpt-select option { background: #1a1a26; }

  .rpt-section { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; }
  .rpt-section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 20px; letter-spacing: -0.3px; }

  .rpt-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .rpt-summary-card { background: #1a1a26; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px; text-align: center; }
  .rpt-summary-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #666680; margin-bottom: 8px; }
  .rpt-summary-value { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }

  .rpt-chart-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  .rpt-bar-chart { display: flex; flex-direction: column; gap: 12px; }
  .rpt-bar-row { display: flex; align-items: center; gap: 12px; }
  .rpt-bar-label { min-width: 120px; font-size: 13px; color: #ccccdd; display: flex; align-items: center; gap: 6px; }
  .rpt-bar-track { flex: 1; background: #1a1a26; border-radius: 4px; height: 20px; overflow: hidden; position: relative; }
  .rpt-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; font-size: 10px; font-weight: 700; color: #0a0a0f; }
  .rpt-bar-amount { min-width: 80px; text-align: right; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #ff6b6b; }

  .rpt-pie-chart { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .rpt-pie-legend { display: flex; flex-wrap: wrap; gap: 12px; }
  .rpt-pie-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #ccccdd; }
  .rpt-pie-dot { width: 10px; height: 10px; border-radius: 50%; }

  .rpt-table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
  .rpt-table { width: 100%; border-collapse: collapse; }
  .rpt-table thead tr { background: #1a1a26; }
  .rpt-table th { padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #666680; font-weight: 600; text-align: left; }
  .rpt-table td { padding: 14px 16px; font-size: 14px; color: #ccccdd; border-top: 1px solid rgba(255,255,255,0.04); }
  .rpt-table tbody tr:hover { background: rgba(255,255,255,0.02); }

  .rpt-export-btn { padding: 10px 20px; background: rgba(124,140,248,0.15); border: 1px solid rgba(124,140,248,0.3); border-radius: 10px; color: #7c8cf8; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .rpt-export-btn:hover { background: rgba(124,140,248,0.25); }
`;

const CATEGORIES = [
  { name: "Food",          icon: "🍔", color: "#ff6b6b" },
  { name: "Transport",     icon: "🚗", color: "#ff9800" },
  { name: "Shopping",      icon: "🛍️", color: "#e040fb" },
  { name: "Rent",          icon: "🏠", color: "#7c8cf8" },
  { name: "Bills",         icon: "💡", color: "#ffeb3b" },
  { name: "Entertainment", icon: "🎬", color: "#00bcd4" },
  { name: "Others",        icon: "📦", color: "#9e9e9e" },
];

function ReportsModule({ transactions = [], token }) {

  const [filterType, setFilterType]     = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [sortBy, setSortBy]             = useState("date");

  // Filter and sort
  const filtered = useMemo(() => {
    let data = [...transactions];

    if (filterType !== "ALL") {
      data = data.filter(t => t.type === filterType);
    }
    if (filterCategory !== "ALL") {
      data = data.filter(t => t.category === filterCategory);
    }

    if (sortBy === "amount") {
      data.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sortBy === "category") {
      data.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    } else {
      data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }

    return data;
  }, [transactions, filterType, filterCategory, sortBy]);

  // Summaries
  const totalIncome  = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + (t.amount || 0), 0);
  const balance      = totalIncome - totalExpense;
  const avgExpense   = transactions.filter(t => t.type === "EXPENSE").length > 0
    ? totalExpense / transactions.filter(t => t.type === "EXPENSE").length : 0;

  // Category breakdown
  const catData = CATEGORIES.map(cat => {
    const total = transactions
      .filter(t => t.type === "EXPENSE" && t.category === cat.name)
      .reduce((s, t) => s + (t.amount || 0), 0);
    return { ...cat, total };
  }).sort((a, b) => b.total - a.total);

  const maxCatTotal = Math.max(...catData.map(c => c.total), 1);
  const totalCatSpend = catData.reduce((s, c) => s + c.total, 0);

  // export CSV
  const exportCSV = () => {
    const rows = [["ID", "Amount", "Category", "Type", "Date"]];
    filtered.forEach(t => {
      rows.push([t.id, t.amount, t.category, t.type, t.date || ""]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "budgetwise_report.csv";
    a.click();
  };

  // export PDF via backend
  const exportPDF = async () => {
    if (!token) { alert("Not authenticated"); return; }
    try {
      const res = await fetch("http://localhost:8080/api/export/pdf", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("PDF export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "budgetwise_report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export PDF: " + e.message);
    }
  };

  const getCatColor = (name) => CATEGORIES.find(c => c.name === name)?.color || "#9e9e9e";
  const getCatIcon  = (name) => CATEGORIES.find(c => c.name === name)?.icon  || "📦";

  return (
    <>
      <style>{reportStyles}</style>
      <div className="rpt-container">

        {/* ── FILTERS ── */}
        <div className="rpt-filters">
          <div className="rpt-filter-group">
            <label className="rpt-label">Type</label>
            <select className="rpt-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="ALL">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="rpt-filter-group">
            <label className="rpt-label">Category</label>
            <select className="rpt-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="rpt-filter-group">
            <label className="rpt-label">Sort By</label>
            <select className="rpt-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date">Date (Newest)</option>
              <option value="amount">Amount (Highest)</option>
              <option value="category">Category (A-Z)</option>
            </select>
          </div>
          <button className="rpt-export-btn" onClick={exportCSV}>📥 Export CSV</button>
          <button className="rpt-export-btn" onClick={exportPDF} style={{ background: "rgba(255,107,107,0.15)", borderColor: "rgba(255,107,107,0.3)", color: "#ff6b6b" }}>📑 Export PDF</button>
        </div>

        {/* ── SUMMARY CARDS ── */}
        <div className="rpt-summary-grid">
          <div className="rpt-summary-card">
            <div className="rpt-summary-label">Total Income</div>
            <div className="rpt-summary-value" style={{ color: "#00ff88" }}>₹{totalIncome.toLocaleString()}</div>
          </div>
          <div className="rpt-summary-card">
            <div className="rpt-summary-label">Total Expenses</div>
            <div className="rpt-summary-value" style={{ color: "#ff6b6b" }}>₹{totalExpense.toLocaleString()}</div>
          </div>
          <div className="rpt-summary-card">
            <div className="rpt-summary-label">Balance</div>
            <div className="rpt-summary-value" style={{ color: "#7c8cf8" }}>₹{balance.toLocaleString()}</div>
          </div>
          <div className="rpt-summary-card">
            <div className="rpt-summary-label">Avg. Expense</div>
            <div className="rpt-summary-value" style={{ color: "#ff9800" }}>₹{Math.round(avgExpense).toLocaleString()}</div>
          </div>
        </div>

        {/* ── CHARTS ── */}
        <div className="rpt-chart-container">
          {/* Bar Chart */}
          <div className="rpt-section">
            <div className="rpt-section-title">📊 Spending by Category</div>
            <div className="rpt-bar-chart">
              {catData.map(cat => (
                <div key={cat.name} className="rpt-bar-row">
                  <div className="rpt-bar-label">{cat.icon} {cat.name}</div>
                  <div className="rpt-bar-track">
                    <div
                      className="rpt-bar-fill"
                      style={{
                        width: `${maxCatTotal > 0 ? (cat.total / maxCatTotal) * 100 : 0}%`,
                        background: cat.color
                      }}
                    />
                  </div>
                  <div className="rpt-bar-amount">₹{cat.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart (CSS-based) */}
          <div className="rpt-section">
            <div className="rpt-section-title">🍩 Expense Distribution</div>
            <div className="rpt-pie-chart">
              <svg viewBox="0 0 120 120" width="200" height="200">
                {(() => {
                  let cumulative = 0;
                  return catData.filter(c => c.total > 0).map(cat => {
                    const pct = totalCatSpend > 0 ? cat.total / totalCatSpend : 0;
                    const startAngle = cumulative * 360;
                    cumulative += pct;
                    const endAngle = cumulative * 360;

                    const x1 = 60 + 50 * Math.cos((Math.PI / 180) * (startAngle - 90));
                    const y1 = 60 + 50 * Math.sin((Math.PI / 180) * (startAngle - 90));
                    const x2 = 60 + 50 * Math.cos((Math.PI / 180) * (endAngle - 90));
                    const y2 = 60 + 50 * Math.sin((Math.PI / 180) * (endAngle - 90));
                    const largeArc = pct > 0.5 ? 1 : 0;

                    if (pct === 0) return null;
                    if (pct >= 0.999) {
                      return <circle key={cat.name} cx="60" cy="60" r="50" fill={cat.color} />;
                    }
                    return (
                      <path
                        key={cat.name}
                        d={`M60,60 L${x1},${y1} A50,50 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={cat.color}
                        opacity="0.85"
                      />
                    );
                  });
                })()}
                <circle cx="60" cy="60" r="28" fill="#13131a" />
                <text x="60" y="60" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="Syne" dy="4">
                  ₹{totalCatSpend.toLocaleString()}
                </text>
              </svg>
              <div className="rpt-pie-legend">
                {catData.filter(c => c.total > 0).map(cat => (
                  <div key={cat.name} className="rpt-pie-legend-item">
                    <div className="rpt-pie-dot" style={{ background: cat.color }} />
                    {cat.name} ({totalCatSpend > 0 ? Math.round((cat.total / totalCatSpend) * 100) : 0}%)
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FILTERED TABLE ── */}
        <div className="rpt-section" style={{ padding: 0 }}>
          <div style={{ padding: "28px 28px 0" }}>
            <div className="rpt-section-title">📋 Filtered Transactions ({filtered.length})</div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "#444460" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 15 }}>No transactions match your filters</div>
            </div>
          ) : (
            <div className="rpt-table-wrap">
              <table className="rpt-table">
                <thead>
                  <tr><th>#</th><th>Amount</th><th>Category</th><th>Type</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: "#444460" }}>{t.id}</td>
                      <td style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>₹{t.amount?.toLocaleString()}</td>
                      <td>{getCatIcon(t.category)} {t.category}</td>
                      <td>
                        <span style={{
                          display: "inline-block", padding: "3px 10px", borderRadius: 20,
                          fontSize: 11, fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase",
                          background: t.type === "INCOME" ? "rgba(0,255,136,0.1)" : "rgba(255,107,107,0.1)",
                          color: t.type === "INCOME" ? "#00ff88" : "#ff6b6b"
                        }}>
                          {t.type}
                        </span>
                      </td>
                      <td style={{ color: "#666680" }}>{t.date || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default ReportsModule;
