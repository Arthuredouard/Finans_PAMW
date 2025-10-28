import React, { useEffect, useState } from "react";
import "../App.css";
import "./Transactions.css";

function Transactions() {
  const [trans, setTrans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "",
    category_ids: [],
    date: "",
  });

  const token = localStorage.getItem("token");

  // Charger les transactions
  useEffect(() => {
    fetch("http://localhost:5000/transactions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const sanitized = (data.transactions || []).map((t) => ({
          ...t,
          categories: Array.isArray(t.categories) ? t.categories : [],
        }));
        setTrans(sanitized);
      })
      .catch((err) => console.error("Erreur lors du chargement des transactions :", err));
  }, [token]);

  // Charger les catégories existantes
  useEffect(() => {
    fetch("http://localhost:5000/categories/", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data || []);
      })
      .catch((err) => console.error("Erreur lors du chargement des catégories :", err));
  }, [token]);

  // Gestion du formulaire
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      description: newTransaction.description,
      date: newTransaction.date || null,
      category_ids: newTransaction.category_ids,
    };

    try {
      const response = await fetch("http://localhost:5000/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        const t = {
          ...data.transaction,
          categories: Array.isArray(data.transaction.categories) ? data.transaction.categories : [],
        };
        setTrans((prev) => [...prev, t]);
        setNewTransaction({
          description: "",
          amount: "",
          type: "",
          category_ids: [],
          date: "",
        });
      } else {
        console.error("Erreur serveur :", data.message);
      }
    } catch (err) {
      console.error("Erreur fetch :", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) setTrans((prev) => prev.filter((t) => t.id !== id));
      else console.error("Erreur suppression");
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

      {/* Liste des transactions */}
      <div className="list-section">
        {trans.length === 0 ? (
          <p>Aucune transaction enregistrée.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Montant (HTG)</th>
                <th>Catégories</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((t) => (
                <tr key={t.id}>
                  <td>{t.description}</td>
                  <td>{t.amount}</td>
                  <td>{t.categories.map((c) => c.name).join(", ") || "Aucune"}</td>
                  <td>{t.date ? new Date(t.date).toLocaleDateString() : "—"}</td>
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
