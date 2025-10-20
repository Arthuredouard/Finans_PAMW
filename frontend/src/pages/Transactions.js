import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import TransactionCard from "../components/TransactionCard";

export default function Transactions() {
  const { transactions } = useContext(AppContext);

  return (
    <div className="page transactions">
      <h2>Transactions</h2>
      {transactions.map((t, index) => (
        <TransactionCard key={index} transaction={t} />
      ))}
    </div>
  );
}


