import React, { useContext, useMemo } from "react";
// Importation du Contexte pour accéder aux données globales
import { AppContext } from "../context/AppContext"; 

const Budget = () => {
  // Récupération du budget de base et de toutes les transactions
  const { budget, transactions } = useContext(AppContext);

  // 1. Calculer les dépenses totales (montants négatifs)
  const totalSpent = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const amount = Number(t.amount || 0);
      // Compte les montants négatifs (dépenses)
      return sum + (amount < 0 ? Math.abs(amount) : 0);
    }, 0);
  }, [transactions]); // Recalculer si les transactions changent

  // 2. Calculer les revenus totaux (montants positifs)
  const totalIncome = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const amount = Number(t.amount || 0);
      // Compte les montants positifs (revenus)
      return sum + (amount > 0 ? amount : 0);
    }, 0);
  }, [transactions]); // Recalculer si les transactions changent
  
  // 3. Calculer le solde restant : Budget initial + Revenus - Dépenses
  const remaining = budget + totalIncome - totalSpent; 

  // --- Le Rendu ---

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
        border: "1px solid #ddd"
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        Résumé du Budget
      </h2>

      <div style={{ marginTop: "15px", lineHeight: "1.6" }}>
        {/* Affichage du Budget initial */}
        <p>
          <strong>Budget de base :</strong> {budget.toLocaleString()} HTG
        </p>
        
        {/* Affichage des Revenus */}
        <p style={{ color: "blue" }}>
          <strong>Total des revenus :</strong> + {totalIncome.toLocaleString()} HTG
        </p>

        {/* Affichage des Dépenses */}
        <p>
          <strong>Total des dépenses :</strong> - {totalSpent.toLocaleString()} HTG
        </p>

        {/* Affichage du Solde Final avec style conditionnel */}
        <p style={{ borderTop: '2px solid #ccc', paddingTop: '10px', marginTop: '15px', fontWeight: 'bold' }}>
          <strong>Solde restant :</strong>{" "}
          <span style={{ color: remaining < 0 ? "red" : "green" }}>
            {remaining.toLocaleString()} HTG
          </span>
        </p>

        {/* Message d'avertissement en cas de déficit */}
        {remaining < 0 && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              marginTop: "10px",
              textAlign: "center",
              backgroundColor: "#ffebeb",
              padding: "8px",
              borderRadius: "4px"
            }}
          >
            Alerte : Vous avez dépassé votre budget !
          </p>
        )}
      </div>
    </div>
  );
};

export default Budget;
