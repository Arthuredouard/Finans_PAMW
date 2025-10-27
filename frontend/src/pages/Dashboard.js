// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../App.css";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // 🔹 Charger transactions depuis l'API
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/transactions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.transactions) {
          setTransactions(data.transactions);

          // Trier par date décroissante et prendre les 3 dernières
          const sorted = [...data.transactions].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          const latest = sorted.slice(0, 3);
          setRecentTransactions(latest);
          setFilteredTransactions(latest);

          // Extraire toutes les catégories uniques
          const cats = [];
          data.transactions.forEach(t => {
            t.categories.forEach(c => {
              if (!cats.find(cat => cat.id === c.id)) cats.push(c);
            });
          });
          setCategories(cats);
        }
      })
      .catch(err => console.error("Erreur chargement transactions :", err));
  }, []);

  // 🔹 Recherche sur transactions récentes
  const handleSearch = () => {
    const filtered = recentTransactions.filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  // 🔹 Déconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
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
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        const data = await response.json();
        console.error("Erreur lors de la déconnexion:", data.message);
      }
    } catch (err) {
      console.error("Erreur serveur lors de la déconnexion:", err);
    }
  };

  // 🔹 Doughnut chart
const doughnutData = {
  labels: categories.map(c => c.name),
  datasets: [
    {
      label: "Dépenses par catégorie",
      data: categories.map(cat =>
        transactions
          .filter(t => t.categories.some(c => c.id === cat.id))
          .reduce((sum, t) => sum + t.amount, 0)
      ),
      backgroundColor: [
        "rgba(127, 255, 212, 0.7)", // aqua
        "rgba(255, 165, 0, 0.7)",   // orange
        "rgba(255, 99, 132, 0.7)",  // rouge clair
        "rgba(54, 162, 235, 0.7)",  // bleu clair
        "rgba(75, 192, 192, 0.7)",  // turquoise
        "rgba(153, 102, 255, 0.7)", // violet
        "rgba(255, 206, 86, 0.7)",  // jaune
      ],
      borderColor: "rgba(255,255,255,0.2)",
      borderWidth: 1,
    },
  ],
};

  return (
    <div className="dashboard">
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

      {/* Barre de recherche */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher une transaction..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>

      {/* Bouton Logout */}
      <div className="logout-wrapper">
        <button className="logout-btn" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>

      {/* Graphique Doughnut */}
      <div className="dashboard-graph">
        <h3>Dépenses par catégorie</h3>
        <Doughnut data={doughnutData} />
      </div>

      {/* Transactions récentes */}
      <div className="dashboard-recent">
        <h3>Transactions récentes</h3>
        <ul>
          {filteredTransactions.map(t => (
            <li key={t.id}>
              {t.description} - {t.amount} HTG -{" "}
              {new Date(t.date).toLocaleDateString()} -{" "}
              {t.categories.map(c => c.name).join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
