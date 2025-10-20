import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function BudgetSummary() {
  const { budget, transactions } = useContext(AppContext);
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = budget - totalExpenses;

  return (
    <div className="budget-summary" style={{
      padding: "15px",
      borderRadius: "10px",
      backgroundColor: "#e0f7fa",
      marginBottom: "20px"
    }}>
      <p><strong>Budget total :</strong> {budget} HTG</p>
      <p><strong>Dépenses :</strong> {totalExpenses} HTG</p>
      <p><strong>Solde restant :</strong> {remaining} HTG</p>
    </div>
  );
}
