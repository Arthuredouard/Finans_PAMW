// src/context/AppContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Charger les données au démarrage
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const transRes = await axios.get("/api/transactions");
      const catRes = await axios.get("/api/categories");
      const budgetRes = await axios.get("/api/budget");

      setTransactions(transRes.data);
      setCategories(catRes.data);
      setBudget(budgetRes.data.totalBudget);
    } catch (error) {
      setErrorMessage("Erreur lors du chargement des données.");
      console.error(error);
    }
  };

  // Ajouter une transaction
  const addTransaction = async (transaction) => {
    if (!transaction.amount || transaction.amount <= 0) {
      setErrorMessage("Montant invalide.");
      return;
    }

    try {
      const res = await axios.post("/api/transactions", transaction);
      setTransactions([...transactions, res.data]);
      setSuccessMessage("Transaction ajoutée !");
    } catch (error) {
      setErrorMessage("Impossible d'ajouter la transaction.");
      console.error(error);
    }
  };

  // Supprimer une transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
      setSuccessMessage("Transaction supprimée !");
    } catch (error) {
      setErrorMessage("Impossible de supprimer la transaction.");
      console.error(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        budget,
        errorMessage,
        successMessage,
        setErrorMessage,
        setSuccessMessage,
        addTransaction,
        deleteTransaction,
        fetchData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

