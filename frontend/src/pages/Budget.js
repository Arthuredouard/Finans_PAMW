// src/pages/Budget.jsx
import React, { use, useContext,useEffect } from "react";
import { AppContext } from "../context/AppContext";
import "/home/Charging/Finans_PAMW/frontend/src/pages/Budget.css"

const Budget = () => {
  
  const [transactions,setTransactions]=React.useState([]);
  const [budget, setAccount] = React.useState(null);

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
          setTransactions(data.transactions);
          console.log("Token utilisé :", token);
          console.log("Transactions chargées :", data);
        })
        .catch((err) => console.error("Erreur lors du chargement :", err));
    }, []);

        useEffect(() => {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/accounts/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAccount(data);
          console.log("Token utilisé :", token);
          console.log("Balance", data);
        })
        .catch((err) => console.error("Erreur lors du chargement :", err));
    }, []);


  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="budget-page">
      <h1>Budget FinansPam</h1>
      <p>Total Budget: {budget} HTG</p>
      <p>Total Dépenses: {totalSpent} HTG</p>
      <p>Solde Restant: {budget - totalSpent} HTG</p>
      {totalSpent > budget && <p style={{ color: "red" }}>Attention: budget dépassé !</p>}
    </div>
  );
};

export default Budget;


