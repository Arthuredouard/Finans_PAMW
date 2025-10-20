// src/pages/Categories.jsx
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Categories = () => {
  const { categories, errorMessage, successMessage, setErrorMessage, setSuccessMessage } = useContext(AppContext);
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (!newCategory) {
      setErrorMessage("Nom de catégorie requis");
      return;
    }
    // Ici tu appellerais ton endpoint backend pour ajouter la catégorie
    setSuccessMessage(`Catégorie ${newCategory} ajoutée !`);
    setNewCategory("");
  };

  return (
    <div className="categories-page">
      <h1>Catégories</h1>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <input type="text" placeholder="Nouvelle catégorie" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
      <button onClick={handleAdd} style={{ backgroundColor: "#90EE90" }}>Ajouter</button>

      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;

