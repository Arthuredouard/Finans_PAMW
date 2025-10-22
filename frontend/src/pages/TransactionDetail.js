import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function TransactionDetails() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/transactions/${id}`)
      .then((res) => {
        setTransaction(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement :", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!transaction) return <p>Aucune transaction trouvée.</p>;

  return (
    <div className="page-container">
      <h1>Détails de la transaction</h1>

      <div className="detail-card">
        <p><strong>Description :</strong> {transaction.description}</p>
        <p><strong>Montant :</strong> {transaction.amount} HTG</p>
        <p><strong>Catégorie :</strong> {transaction.category}</p>
        <p><strong>Date :</strong> {new Date(transaction.date).toLocaleDateString()}</p>
      </div>

      <Link to="/transactions" className="back-link">← Retour aux transactions</Link>
    </div>
  );
}

export default TransactionDetails;
