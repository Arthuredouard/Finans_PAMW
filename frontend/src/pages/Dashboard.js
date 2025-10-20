// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';
import TransactionCard from "../components/TransactionCard";

const Dashboard = () => {
  const { transactions, categories, budget } = useContext(AppContext);

  // Préparer les données pour le graphique
  const categoryTotals = categories.map((cat) => {
    const total = transactions
      .filter((t) => t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return total;
  });

  const data = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        label: "Dépenses par catégorie",
        data: categoryTotals,
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard FinansPam</h1>
      <h3>Budget total: {budget} HTG</h3>

      <div className="chart-container">
        {categories.length > 0 ? <Pie data={data} /> : <p>Aucune donnée à afficher</p>}
      </div>

      <h2>Dernières transactions</h2>
      {transactions.slice(-5).map((t) => (
        <TransactionCard key={t.id} transaction={t} />
      ))}
    </div>
  );
};

export default Dashboard;

