// src/pages/TransactionDetail.jsx
import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions } = useContext(AppContext);

  const transaction = transactions.find((t) => t.id === parseInt(id));

  if (!transaction) return <p>Transaction introuvable</p>;

  return (
    <div className="transaction-detail">
      <h1>Détail de la transaction</h1>
      <p><strong>Nom:</strong> {transaction.name}</p>
      <p><strong>Montant:</strong> {transaction.amount} HTG</p>
      <p><strong>Catégorie:</strong> {transaction.categoryName}</p>
      <button onClick={() => navigate("/transactions")} style={{ backgroundColor: "#90EE90" }}>Retour</button>
    </div>
  );
};

export default TransactionDetail;


