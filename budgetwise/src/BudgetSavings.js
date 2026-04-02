// ─────────────────────────────────────────────────────────────
//  BudgetSavings.js — Module 3: Savings Goals
//  Focused on savings goals (Investing, Emergency Fund, etc.)
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";

const moduleStyles = `
  .bs-container { display: flex; flex-direction: column; gap: 24px; }

  .bs-section { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; }
  .bs-section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 20px; letter-spacing: -0.3px; }

  .bs-savings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

  .bs-goal-card { background: #1a1a26; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 24px; transition: all 0.2s; }
  .bs-goal-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12); }
  .bs-goal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .bs-goal-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .bs-goal-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .bs-goal-type { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }

  .bs-goal-amounts { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
  .bs-goal-saved { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #00ff88; }
  .bs-goal-target { font-size: 13px; color: #666680; }

  .bs-bar-track { background: #13131a; border-radius: 6px; height: 8px; overflow: hidden; margin-bottom: 12px; }
  .bs-bar-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease; }

  .bs-goal-footer { display: flex; justify-content: space-between; align-items: center; }
  .bs-goal-pct { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
  .bs-goal-remaining { font-size: 12px; color: #666680; }

  .bs-goal-actions { display: flex; gap: 8px; margin-top: 14px; }
  .bs-add-amount-input { flex: 1; padding: 8px 12px; background: #13131a; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; color: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; }
  .bs-add-amount-input:focus { border-color: #00ff88; }
  .bs-add-amount-btn { padding: 8px 14px; background: rgba(0,255,136,0.15); border: 1px solid rgba(0,255,136,0.2); border-radius: 8px; color: #00ff88; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .bs-add-amount-btn:hover { background: rgba(0,255,136,0.25); }
  .bs-remove-btn { padding: 8px 12px; background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.2); border-radius: 8px; color: #ff6b6b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .bs-remove-btn:hover { background: rgba(255,107,107,0.2); }

  .bs-add-goal { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; }
  .bs-add-form { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
  .bs-form-group { display: flex; flex-direction: column; }
  .bs-form-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; color: #666680; margin-bottom: 8px; font-weight: 500; }
  .bs-form-input, .bs-form-select { padding: 10px 14px; background: #1a1a26; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; color: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; }
  .bs-form-input:focus, .bs-form-select:focus { border-color: #00ff88; }
  .bs-form-select option { background: #1a1a26; }
  .bs-save-btn { padding: 10px 24px; background: linear-gradient(135deg, #00ff88, #00cc6a); border: none; border-radius: 10px; color: #0a0a0f; font-size: 14px; font-weight: 700; font-family: 'Syne', sans-serif; cursor: pointer; transition: all 0.2s; }
  .bs-save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,255,136,0.2); }

  .bs-summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .bs-summary-card { background: #1a1a26; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px; text-align: center; }
  .bs-summary-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #666680; margin-bottom: 8px; }
  .bs-summary-value { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
`;

const GOAL_TYPES = [
  { key: "investing",    label: "Investing",       icon: "📈", color: "#7c8cf8", bg: "rgba(124,140,248,0.12)" },
  { key: "emergency",    label: "Emergency Fund",  icon: "🛡️", color: "#ff9800", bg: "rgba(255,152,0,0.12)" },
  { key: "vacation",     label: "Vacation",        icon: "✈️", color: "#00bcd4", bg: "rgba(0,188,212,0.12)" },
  { key: "education",    label: "Education",       icon: "🎓", color: "#e040fb", bg: "rgba(224,64,251,0.12)" },
  { key: "retirement",   label: "Retirement",      icon: "🏖️", color: "#00ff88", bg: "rgba(0,255,136,0.12)" },
  { key: "home",         label: "Home / Property", icon: "🏠", color: "#ffeb3b", bg: "rgba(255,235,59,0.12)" },
  { key: "car",          label: "Vehicle",         icon: "🚗", color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
  { key: "other",        label: "Other",           icon: "🎯", color: "#9e9e9e", bg: "rgba(158,158,158,0.12)" },
];

function BudgetSavingsModule({ transactions, token, username }) {
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: "Emergency Fund",   type: "emergency",  targetAmount: 50000, savedAmount: 12000 },
    { id: 2, name: "Vacation Trip",    type: "vacation",   targetAmount: 30000, savedAmount: 8500  },
    { id: 3, name: "Stock Portfolio",  type: "investing",  targetAmount: 100000, savedAmount: 35000 },
    { id: 4, name: "Master's Degree",  type: "education",  targetAmount: 200000, savedAmount: 45000 },
  ]);
  const [newGoalName, setNewGoalName]     = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalType, setNewGoalType]     = useState("investing");
  const [addAmounts, setAddAmounts]       = useState({});

  const getTypeInfo = (type) => GOAL_TYPES.find(t => t.key === type) || GOAL_TYPES[7];

  const addSavingsGoal = () => {
    if (!newGoalName || !newGoalTarget) { alert("Please fill goal name and target amount"); return; }
    setSavingsGoals([
      ...savingsGoals,
      { id: Date.now(), name: newGoalName, type: newGoalType, targetAmount: parseFloat(newGoalTarget), savedAmount: 0 }
    ]);
    setNewGoalName(""); setNewGoalTarget(""); setNewGoalType("investing");
  };

  const addToGoal = (goalId) => {
    const amount = parseFloat(addAmounts[goalId]);
    if (!amount || amount <= 0) return;
    setSavingsGoals(savingsGoals.map(g =>
      g.id === goalId ? { ...g, savedAmount: Math.min(g.savedAmount + amount, g.targetAmount) } : g
    ));
    setAddAmounts(prev => ({ ...prev, [goalId]: "" }));
  };

  const removeGoal = (goalId) => {
    if (window.confirm("Remove this savings goal?")) {
      setSavingsGoals(savingsGoals.filter(g => g.id !== goalId));
    }
  };

  const totalTarget = savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved  = savingsGoals.reduce((s, g) => s + g.savedAmount, 0);
  const overallPct  = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <>
      <style>{moduleStyles}</style>
      <div className="bs-container">

        {/* ── SUMMARY ── */}
        <div className="bs-summary-grid">
          <div className="bs-summary-card">
            <div className="bs-summary-label">Active Goals</div>
            <div className="bs-summary-value" style={{ color: "#7c8cf8" }}>{savingsGoals.length}</div>
          </div>
          <div className="bs-summary-card">
            <div className="bs-summary-label">Total Saved</div>
            <div className="bs-summary-value" style={{ color: "#00ff88" }}>₹{totalSaved.toLocaleString()}</div>
          </div>
          <div className="bs-summary-card">
            <div className="bs-summary-label">Overall Progress</div>
            <div className="bs-summary-value" style={{ color: "#ff9800" }}>{overallPct}%</div>
          </div>
        </div>

        {/* ── SAVINGS GOALS ── */}
        <div className="bs-section">
          <div className="bs-section-title">🎯 Savings Goals</div>
          <div className="bs-savings-grid">
            {savingsGoals.map(goal => {
              const typeInfo = getTypeInfo(goal.type);
              const pct = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
              const remaining = goal.targetAmount - goal.savedAmount;
              const isComplete = pct >= 100;
              return (
                <div key={goal.id} className="bs-goal-card">
                  <div className="bs-goal-header">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div className="bs-goal-icon" style={{ background: typeInfo.bg }}>{typeInfo.icon}</div>
                        <div>
                          <div className="bs-goal-title">{goal.name}</div>
                          <span className="bs-goal-type" style={{ background: typeInfo.bg, color: typeInfo.color }}>
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bs-goal-amounts">
                    <div className="bs-goal-saved">₹{goal.savedAmount.toLocaleString()}</div>
                    <div className="bs-goal-target">/ ₹{goal.targetAmount.toLocaleString()}</div>
                  </div>
                  <div className="bs-bar-track">
                    <div className="bs-bar-fill" style={{
                      width: `${pct}%`,
                      background: isComplete ? "#00ff88" : `linear-gradient(90deg, ${typeInfo.color}, ${typeInfo.color}aa)`
                    }} />
                  </div>
                  <div className="bs-goal-footer">
                    <div className="bs-goal-pct" style={{ color: isComplete ? "#00ff88" : typeInfo.color }}>
                      {isComplete ? "✅ Completed!" : `${Math.round(pct)}%`}
                    </div>
                    <div className="bs-goal-remaining">
                      {isComplete ? "Goal reached" : `₹${remaining.toLocaleString()} remaining`}
                    </div>
                  </div>
                  <div className="bs-goal-actions">
                    {!isComplete && (
                      <>
                        <input
                          className="bs-add-amount-input"
                          type="number"
                          placeholder="Add ₹"
                          value={addAmounts[goal.id] || ""}
                          onChange={e => setAddAmounts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter") addToGoal(goal.id); }}
                        />
                        <button className="bs-add-amount-btn" onClick={() => addToGoal(goal.id)}>+ Add</button>
                      </>
                    )}
                    <button className="bs-remove-btn" onClick={() => removeGoal(goal.id)}>🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ADD NEW GOAL ── */}
        <div className="bs-add-goal">
          <div className="bs-section-title">➕ Add New Savings Goal</div>
          <div className="bs-add-form">
            <div className="bs-form-group">
              <label className="bs-form-label">Goal Name</label>
              <input className="bs-form-input" placeholder="e.g. Stock Portfolio" value={newGoalName} onChange={e => setNewGoalName(e.target.value)} />
            </div>
            <div className="bs-form-group">
              <label className="bs-form-label">Target (₹)</label>
              <input className="bs-form-input" type="number" placeholder="100000" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} />
            </div>
            <div className="bs-form-group">
              <label className="bs-form-label">Type</label>
              <select className="bs-form-select" value={newGoalType} onChange={e => setNewGoalType(e.target.value)}>
                {GOAL_TYPES.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <button className="bs-save-btn" onClick={addSavingsGoal}>+ Add Goal</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default BudgetSavingsModule;
