// src/pages/Budget.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Budget = () => {
  const { budget, transactions } = useContext(AppContext);

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="budget-page">
      <h1>Budget FinansPam</h1>
      <p>Total Budget: {budget} HTG</p>
      <p>Total Dépenses: {totalSpent} HTG</p>
      <p>Solde Restant: {budget - totalSpent} HTG</p>
      {totalSpent > budget && <p style={{ color: "red" }}>Attention: budget dépassé !</p>}
    </div>
  );
};

export default Budget;


