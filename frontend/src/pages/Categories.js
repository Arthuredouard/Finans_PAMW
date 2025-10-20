import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import CategoryCard from "../components/CategoryCard";

export default function Categories() {
  const { categories } = useContext(AppContext);

  return (
    <div className="page categories">
      <h2>Catégories</h2>
      {categories.map((cat, index) => (
        <CategoryCard key={index} category={cat} />
      ))}
    </div>
  );
}

