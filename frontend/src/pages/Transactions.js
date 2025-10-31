import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import "../App.css";
import "./Transactions.css";

function Transactions() {
  const {
    transactions,
    setTransactions,
    categories,
    token,
    addTransaction,
    deleteTransaction,
  } = useContext(AppContext);

  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "",
    category_ids: [],
    date: "",
  });

  // Gestion des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const id = parseInt(e.target.value);
    setNewTransaction((prev) => ({
      ...prev,
      category_ids: id ? [id] : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      alert("Token manquant. Veuillez vous reconnecter.");
      return;
    }

    const payload = {
      amount: newTransaction.amount,
      type: newTransaction.type,
      description: newTransaction.description,
      date: newTransaction.date || null,
      category_ids: newTransaction.category_ids,
    };

    addTransaction(payload);
    setNewTransaction({
      description: "",
      amount: "",
      type: "",
      category_ids: [],
      date: "",
    });
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
  };

  return (
    <div className="page-container">
      <h1>Transactions</h1>

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
          name="type"
          placeholder="Type (revenu / dépense)"
          value={newTransaction.type}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={newTransaction.category_ids[0] || ""}
          onChange={handleCategoryChange}
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={newTransaction.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="list-section">
        {transactions.length === 0 ? (
          <p>Aucune transaction enregistrée.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Montant (HTG)</th>
                <th>Type</th>
                <th>Catégories</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.description}</td>
                  <td>{t.amount}</td>
                  <td>{t.type}</td>
                  <td>{t.categories.map((c) => c.name).join(", ") || "Aucune"}</td>
                  <td>{t.date ? new Date(t.date).toLocaleDateString() : "—"}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(t.id)}>Supprimer</button>
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
