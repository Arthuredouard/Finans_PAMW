import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Login.css"; // réutilise le style du login

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur serveur :", err);
      setError("Erreur serveur, réessayez plus tard.");
    }
  };

  return (
    <div className="login-container">
      <h2>Créer un compte</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="register-btn">
          S’inscrire
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Déjà un compte ?{" "}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#72f54aff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      </p>
    </div>
  );
};

export default Register;