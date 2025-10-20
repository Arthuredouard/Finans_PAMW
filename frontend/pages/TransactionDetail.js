import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import TransactionCard from "../components/TransactionCard";

export default function TransactionDetail() {
  const { id } = useParams();
  const { transactions } = useContext(AppContext);
  const transaction = transactions.find((t) => t.id === parseInt(id));

  if (!transaction) return <p>Transaction introuvable</p>;

  return (
    <div className="page transaction-detail">
      <h2>Détails de la transaction</h2>
      <TransactionCard transaction={transaction} />
    </div>
  );
}

