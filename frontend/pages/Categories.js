// src/pages/Categories.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../App.css';

const Categories = () => {
  const { categories } = useContext(AppContext);

  return (
    <div>
      <h1>Catégories</h1>
      <ul>
        {categories.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
      <button>Ajouter catégorie</button>
    </div>
  );
};

export default Categories;
