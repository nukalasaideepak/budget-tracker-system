import React, { useState, useEffect } from "react";

function Budget() {

  const [category, setCategory] = useState("Food");
  const [limitAmount, setLimitAmount] = useState("");
  const [budgets, setBudgets] = useState([]);

  // Add Budget
  const addBudget = async () => {

    if (!limitAmount) {
      alert("Please enter limit amount");
      return;
    }

    try {
      await fetch("http://localhost:8080/budget/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category: category,
          limitAmount: parseFloat(limitAmount)
        })
      });

      setLimitAmount("");
      loadBudgets();

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add budget");
    }
  };

  // Load Budgets
  const loadBudgets = async () => {
    try {
      const res = await fetch("http://localhost:8080/budget/all");
      const data = await res.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>

      <h2>💰 Budget Management</h2>

      {/* CATEGORY */}
      <label>Select Category:</label>
      <br /><br />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Rent">Rent</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Others">Others</option>
      </select>

      <br /><br />

      {/* LIMIT */}
      <input
        type="number"
        placeholder="Enter Limit Amount"
        value={limitAmount}
        onChange={(e) => setLimitAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={addBudget}>
        Set Budget
      </button>

      <hr />

      {/* DISPLAY */}
      <h3>📊 Budget List</h3>

      {budgets.length === 0 ? (
        <p>No budgets set yet</p>
      ) : (
        budgets.map((b) => (
          <div key={b.id} style={{ margin: "10px", padding: "10px", border: "1px solid gray" }}>
            <strong>{b.category}</strong> <br />
            Limit: ₹{b.limitAmount}
          </div>
        ))
      )}

    </div>
  );
}

export default Budget;