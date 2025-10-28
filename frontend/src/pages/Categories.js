import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import "/home/Charging/Finans_PAMW/frontend/src/pages/Categories.css";

const Categories = () => {
  const {
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
  } = useContext(AppContext);

  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // ✅ Charger les catégories au montage
  useEffect(() => {
    fetch("http://localhost:5000/categories/")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
        return res.json();
      })
      .then((data) => {
        // Le backend peut renvoyer {"categories": [...]} ou un tableau direct
        setCategories(data.categories || data);
        console.log("Catégories chargées :", data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement :", err);
        setErrorMessage("Impossible de charger les catégories.");
      });
  }, []);

  // ✅ Ajouter une nouvelle catégorie
  const handleAdd = () => {
    if (!newCategory.trim()) {
      setErrorMessage("Nom de catégorie requis");
      setSuccessMessage("");
      return;
    }

    fetch("http://localhost:5000/categories/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data) => {
        const newCat = data.category || data;
        setCategories((prev) => [...prev, newCat]);
        setSuccessMessage(`Catégorie "${newCat.name}" ajoutée !`);
        setErrorMessage("");
        setNewCategory("");
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setErrorMessage("Erreur lors de l’ajout de la catégorie.");
        setSuccessMessage("");
      });
  };

  // ❌ Supprimer une catégorie
  const handleDelete = (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    fetch(`http://localhost:5000/categories/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        setSuccessMessage("Catégorie supprimée avec succès !");
        setErrorMessage("");
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setErrorMessage("Erreur lors de la suppression de la catégorie.");
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
        <button onClick={handleAdd} className="add-btn">
          Ajouter
        </button>
      </div>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id || cat.name} className="category-item">
            <span>{cat.name}</span>
            <button
              className="delete-btn"
              title="Supprimer"
              onClick={() => handleDelete(cat.id)}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
