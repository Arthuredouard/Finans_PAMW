// src/components/TransactionCard.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const TransactionCard = ({ transaction }) => {
  const { deleteTransaction } = useContext(AppContext);

  return (
    <div className="transaction-card">
      <p>
        <strong>{transaction.name}</strong> - {transaction.amount} HTG
      </p>
      <p>Catégorie: {transaction.categoryName}</p>
      <button onClick={() => deleteTransaction(transaction.id)} style={{ backgroundColor: "#FF7F50" }}>
        Supprimer
      </button>
    </div>
  );
};

export default TransactionCard;

