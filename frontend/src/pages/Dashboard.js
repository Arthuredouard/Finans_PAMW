import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import TransactionCard from "../components/TransactionCard";
import BudgetSummary from "../components/BudgetSummary";

export default function Dashboard() {
  const { transactions } = useContext(AppContext);

  return (
    <div className="page dashboard">
      <h2>Tableau de bord</h2>
      <BudgetSummary />
      <h3>Dernières transactions</h3>
      {transactions.slice(0, 5).map((t, index) => (
        <TransactionCard key={index} transaction={t} />
      ))}
    </div>
  );
}
