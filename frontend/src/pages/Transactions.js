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

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const transactionToSend = {
    user_id: 1, // ⚠️ temporairement, mets un ID existant (test)
    amount: parseFloat(newTransaction.amount),
    type: newTransaction.type, // ex: "income" ou "expense"
    category_ids: [1] // facultatif
  };

  console.log("Transaction envoyée :", transactionToSend);

  try {
    const response = await fetch("http://localhost:5000/transactions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(transactionToSend),
    });

    const data = await response.json();
    console.log("Réponse serveur :", data);
  } catch (err) {
    console.error("Erreur fetch :", err);
  }
};



const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:5000/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`Transaction ${id} supprimée`);

      // ✅ Mettre à jour localement sans rechargement
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      // ✅ Puis resynchroniser avec le backend
      const refresh = await fetch("http://localhost:5000/transactions/", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (refresh.ok) {
        const data = await refresh.json();
        setTransactions(data.transactions);
      }
    } else {
      const data = await response.json();
      console.error("Erreur lors de la suppression :", data.message || response.statusText);
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
  }
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
