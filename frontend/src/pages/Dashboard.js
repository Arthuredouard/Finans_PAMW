// src/pages/Dashboard.js
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "../App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { transactions, categories } = useContext(AppContext);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Affiche les 5 dernières transactions
    if (transactions) {
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setRecentTransactions(sorted.slice(0, 5));
    }
  }, [transactions]);

  // Préparation des données pour le graphique budget/dépenses
  const data = {
    labels: categories?.map(cat => cat.name) || [],
    datasets: [
      {
        label: "Dépenses par catégorie",
        data: categories?.map(cat =>
          transactions
            ?.filter(t => t.categoryId === cat.id)
            .reduce((sum, t) => sum + t.amount, 0) || 0
        ) || [],
        backgroundColor: categories?.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 200
            )}, ${Math.floor(Math.random() * 200)}, 0.6)`
        ) || [],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Finans Pamw</h1>
      <h2>Ann nou jere lajan n!</h2>

      <div className="dashboard-links">
        <Link to="/transactions" className="dashboard-btn">
          Transactions
        </Link>
        <Link to="/categories" className="dashboard-btn">
          Categories
        </Link>
        <Link to="/budget" className="dashboard-btn">
          Budgets
        </Link>
      </div>

      <div className="dashboard-graph">
        <h3>Dépenses par catégorie</h3>
        <Doughnut data={data} />
      </div>

      <div className="dashboard-recent">
        <h3>Transactions récentes</h3>
        <ul>
          {recentTransactions.map(t => (
            <li key={t.id}>
              {t.description} - {t.amount} HTG -{" "}
              {new Date(t.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
