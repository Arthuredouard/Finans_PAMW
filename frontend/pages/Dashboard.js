// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../App.css';

const Dashboard = () => {
  const { transactions } = useContext(AppContext);

  // Calcul des totaux
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const savings = totalIncome - totalExpense;

  return (
    <div>
      <h1>Tableau de bord MyBudget</h1>

      {/* Cartes de résumé */}
      <div className="card-container">
        <div className="card">
          <h3>Revenus</h3>
          <p>${totalIncome}</p>
        </div>
        <div className="card">
          <h3>Dépenses</h3>
          <p>${totalExpense}</p>
        </div>
        <div className="card">
          <h3>Épargne</h3>
          <p>${savings}</p>
        </div>
      </div>

      {/* Liste des transactions */}
      <h2>Dernières transactions</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            <span>{t.title} ({t.type})</span>
            <span>${t.amount}</span>
          </li>
        ))}
      </ul>

      {/* Boutons */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button>Ajouter transaction</button>
        <button>Gérer catégories</button>
      </div>
    </div>
  );
};

export default Dashboard;


