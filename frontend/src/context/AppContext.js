import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "",
    category_ids: [],
    date: "",
  });

  // Charger le token depuis localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setIsReady(true);
  }, []);

  // Charger les transactions quand le token est prêt
  useEffect(() => {
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/transactions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sanitized = (res.data.transactions || []).map((t) => ({
          ...t,
          categories: Array.isArray(t.categories) ? t.categories : [],
        }));
        setTransactions(sanitized);
      } catch (err) {
        console.error("Erreur chargement transactions :", err);
        setErrorMessage("Impossible de charger les transactions (token invalide ?)");
      }
    };
    fetchTransactions();
  }, [token]);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/categories/");
        setCategories(res.data.categories || res.data);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
        setErrorMessage("Impossible de charger les catégories.");
      }
    };
    fetchCategories();
  }, []);

  // Ajouter une transaction
  const addTransaction = async (payload) => {
    if (!token) {
      setErrorMessage("Token manquant. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/transactions/",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const t = {
        ...response.data.transaction,
        categories: Array.isArray(response.data.transaction.categories)
          ? response.data.transaction.categories
          : [],
      };

      setTransactions((prev) => [...prev, t]);
    } catch (err) {
      console.error("Erreur ajout transaction :", err);
      setErrorMessage("Impossible d’ajouter la transaction.");
    }
  };

  // Supprimer une transaction
  const deleteTransaction = async (id) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Erreur suppression transaction :", err);
      setErrorMessage("Impossible de supprimer la transaction.");
    }
  };

  // Charger le budget
const fetchBudget = async () => {
  const token = localStorage.getItem("token");
  console.log("junior",token)
  if (!token) {
    setErrorMessage("Token manquant. Veuillez vous reconnecter.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/accounts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Erreur lors du chargement du budget");
    }

    const data = await response.json();
    console.log("Budget chargé :", data.balance);

    // Assurez-vous que le backend renvoie bien data.totalBudget
    setBudget(data.balance || 0);
  } catch (err) {
    console.error("Erreur chargement budget :", err);
    setErrorMessage("Impossible de charger le budget.");
  }
};

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        isReady,
        transactions,
        setTransactions,
        categories,
        setCategories,
        budget,
        errorMessage,
        successMessage,
        setErrorMessage,
        setSuccessMessage,
        newTransaction,
        setNewTransaction,
        addTransaction,
        deleteTransaction,
        fetchBudget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
