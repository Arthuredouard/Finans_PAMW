// src/pages/Transactions.jsx
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Transactions = () => {
  const { transactions, categories, addTransaction, deleteTransaction, errorMessage, successMessage, setErrorMessage, setSuccessMessage } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    categoryId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.categoryId) {
      setErrorMessage("Tous les champs sont requis.");
      return;
    }
    addTransaction({ ...formData, amount: parseFloat(formData.amount) });
    setFormData({ name: "", amount: "", categoryId: "" });
  };

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nom transaction" value={formData.name} onChange={handleChange} />
        <input type="number" name="amount" placeholder="Montant" value={formData.amount} onChange={handleChange} />
        <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" style={{ backgroundColor: "#90EE90" }}>Ajouter</button>
      </form>

      <h2>Liste des transactions</h2>
      {transactions.map((t) => (
        <div key={t.id} className="transaction-card">
          <p><strong>{t.name}</strong> - {t.amount} HTG</p>
          <p>Catégorie: {t.categoryName}</p>
          <button onClick={() => deleteTransaction(t.id)} style={{ backgroundColor:



