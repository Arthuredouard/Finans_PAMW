// src/context/AppContext.js
import React, { createContext, useState } from 'react';

// Création du context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Salaire', amount: 1500, type: 'income' },
    { id: 2, title: 'Loyer', amount: 500, type: 'expense' },
    { id: 3, title: 'Épicerie', amount: 200, type: 'expense' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Alimentation' },
    { id: 2, name: 'Logement' },
    { id: 3, name: 'Loisirs' }
  ]);

  return (
    <AppContext.Provider value={{ transactions, setTransactions, categories, setCategories }}>
      {children}
    </AppContext.Provider>
  );
};
