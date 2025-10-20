// src/pages/Transactions.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../App.css';

const Transactions = () => {
  const { transactions } = useContext(AppContext);

  return (
    <div>
      <h1>Transactions</h1>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            <span>{t.title} ({t.type})</span>
            <span>${t.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;

