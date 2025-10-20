// src/pages/TransactionDetail.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../App.css';

const TransactionDetail = ({ transactionId }) => {
  const { transactions } = useContext(AppContext);
  const transaction = transactions.find(t => t.id === transactionId);

  if (!transaction) return <p>Transaction non trouvée</p>;

  return (
    <div>
      <h1>Détails de la transaction</h1>
      <p><strong>Titre :</strong> {transaction.title}</p>
      <p><strong>Montant :</strong> ${transaction.amount}</p>
      <p><strong>Type :</strong> {transaction.type}</p>
    </div>
  );
};

export default TransactionDetail;
tail;
