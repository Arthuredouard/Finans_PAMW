import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import "../App.css";
import "./Transactions.css";

function Transactions() {
  const { transactions, setTransactions } = useContext(AppContext);
  const [trans,setTrans]=useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  // Charger les transactions depuis le backend

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/transactions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTrans(data.transactions);
        console.log("Token utilisé :", token);
        console.log("Transactions chargées :", data);
      })
      .catch((err) => console.error("Erreur lors du chargement :", err));
  }, []);

  // Gérer le formulaire d’ajout
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionToSend = {
      ...newTransaction,
      amount: parseFloat(newTransaction.amount), // ✅ conversion sécurisée
    };

    axios
      .post("http://localhost:5000/transactions", transactionToSend)
      .then((res) => {
        setTransactions([...transactions, res.data]);
        setNewTransaction({ description: "", amount: "", category: "", date: "" });
      })
      .catch((err) => console.error("Erreur lors de l’ajout :", err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/transactions/${id}`)
      .then(() => setTransactions(transactions.filter((t) => t.id !== id)))
      .catch((err) => console.error("Erreur lors de la suppression :", err));
  };

  return (
    <div className="page-container">
      <h1>Transactions</h1>

      {/* Formulaire d’ajout */}
      <form onSubmit={handleSubmit} className="form-section">
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTransaction.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Montant"
          min="0"
          step="0.01"
          value={newTransaction.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Catégorie"
          value={newTransaction.category}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newTransaction.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des transactions */}
      <div className="list-section">
        {!trans || trans.length === 0 ? (
          <p>Aucune transaction enregistrée.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Montant (HTG)</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Détails</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((t) => (
                <tr key={t.id}>
                  <td>{t.description}</td>
                  <td>{t.amount}</td>
                  <td>{t.category}</td>
                  <td>{t.date}</td>
                  <td>
                    <Link to={`/transactions/${t.id}`} className="detail-link">
                      Voir
                    </Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(t.id)} className="delete-btn">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transactions;
