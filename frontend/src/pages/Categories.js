// src/pages/Categories.jsx
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import "/home/Charging/Finans_PAMW/frontend/src/pages/Categories.css"

const Categories = () => {
  const {
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useContext(AppContext);

  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Charger les catégories au montage
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        console.log("Catégories chargées :", data);
      })
      .catch((err) => console.error("Erreur lors du chargement :", err));
  }, []);

  // Ajouter une nouvelle catégorie
  const handleAdd = () => {
    if (!newCategory.trim()) {
      setErrorMessage("Nom de catégorie requis");
      setSuccessMessage("");
      return;
    }

    fetch("http://localhost:5000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data) => {
        setCategories((prev) => [...prev, data]); // ajoute la nouvelle catégorie localement
        setSuccessMessage(`Catégorie "${data.name}" ajoutée !`);
        setErrorMessage("");
        setNewCategory("");
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setErrorMessage("Erreur lors de l’ajout de la catégorie.");
        setSuccessMessage("");
      });
  };

  return (
    <div className="categories-page">
      <h1>Catégories</h1>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <div className="category-form">
        <input
          type="text"
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAdd} style={{ backgroundColor: "#90EE90" }}>
          Ajouter
        </button>
      </div>

      <ul>
        {categories.map((cat) => (
          <li key={cat.id || cat.name}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
