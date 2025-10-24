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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    if (transactions) {
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const latest = sorted.slice(0, 5);
      setRecentTransactions(latest);
      setFilteredTransactions(latest);
    }
  }, [transactions]);

  const handleSearch = () => {
    const filtered = recentTransactions.filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  const handleLogout = async () => {
  const token = localStorage.getItem("token"); // récupère le JWT stocké au login

  try {
    const response = await fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      localStorage.removeItem("token"); // supprime le token côté client
      window.location.href = "/";
    } else {
      const data = await response.json();
      console.error("Erreur lors de la déconnexion:", data.message);
    }
  } catch (err) {
    console.error("Erreur serveur lors de la déconnexion:", err);
  }
};

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
      <h4>Bienvenue  !!!</h4>

      {/* Images visibles */}
      <div className="image-container">
        <img
          src="https://pngimg.com/uploads/piggy_bank/piggy_bank_PNG42.png"
          alt="Piggy Bank"
        />
        <img
          src="https://pngimg.com/uploads/money/money_PNG3518.png"
          alt="Money"
        />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher une transaction..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>

      <div className="logout-wrapper">
      <button className="logout-btn" onClick={handleLogout}>
      LOGOUT
      </button>
      </div>
   
      <div className="dashboard-graph">
        <h3>Dépenses par catégorie</h3>
        <Doughnut data={data} />
      </div>

      {/* Barre de recherche large avec bouton */}


      <div className="dashboard-recent">
        <h3>Transactions récentes</h3>
        <ul>
          {filteredTransactions.map(t => (
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

