import React, { useContext, useMemo, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Budget = () => {
  const { transactions } = useContext(AppContext);
  const [budget, setBudget] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

   const normalizeType = (str = "") => {
    return str
      .toLowerCase()
      .normalize("NFD") // décompose les accents
      .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
      .trim();
  };

  useEffect(() => {
    const fetchBudget = async () => {
      const token = localStorage.getItem("token");
      console.log("junior", token);

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

        const data = await response.json();

        if (!response.ok) {
          console.error("Erreur du serveur :", data.message);
          setErrorMessage(data.message || "Erreur lors du chargement du budget.");
          return;
        }

        console.log("✅ Budget chargé :", data.balance);
        setBudget(data.balance || 0);
      } catch (err) {
        console.error("Erreur chargement budget :", err);
        setErrorMessage("Impossible de charger le budget.");
      }
    };

    fetchBudget();
  }, []);

// --- Calcul des dépenses (type = "dépense" / "depense" / "DEPENSE" / etc.)
  const totalSpent = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const type = normalizeType(t.type);
      const amount = Number(t.amount || 0);
      return sum + (type === "depense" ? amount : 0);
    }, 0);
  }, [transactions]);

  // --- Calcul des revenus (type = "revenu" / "REVENU" / etc.)
  const totalIncome = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const type = normalizeType(t.type);
      const amount = Number(t.amount || 0);
      return sum + (type === "revenu" ? amount : 0);
    }, 0);
  }, [transactions]);


  // --- Solde restant
  const remaining = budget + totalIncome - totalSpent;

  return (
    <div
      className="budget-summary"
      style={{
        maxWidth: "450px",
        margin: "30px auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        Résumé du Budget
      </h2>

      <div style={{ marginTop: "15px", lineHeight: "1.6" }}>
        <p style={{ color: "blue" }}>
          <strong>Budget de base :</strong> {budget.toLocaleString()} HTG
        </p>
        <p style={{ color: "blue" }}>
          <strong>Total des revenus :</strong> + {totalIncome.toLocaleString()} HTG
        </p>
        <p style={{ color: "blue" }}>
          <strong>Total des dépenses :</strong> - {totalSpent.toLocaleString()} HTG
        </p>
        <p
          style={{
            borderTop: "2px solid #ccc",
            paddingTop: "10px",
            marginTop: "15px",
            fontWeight: "bold",
            color : "blue"
          }}
        >
          <strong>Solde restant :</strong>{" "}
          <span style={{ color: remaining < 0 ? "red" : "green" }}>
            {remaining.toLocaleString()} HTG
          </span>
        </p>

        {remaining < 0 && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              marginTop: "10px",
              textAlign: "center",
              backgroundColor: "#ffebeb",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            ⚠️ Alerte : Vous avez dépassé votre budget !
          </p>
        )}
      </div>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Budget;
