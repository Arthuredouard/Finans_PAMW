// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "../App.css";
import "/home/Charging/Finans_PAMW/frontend/src/pages/Login.css"

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data)
      
      console.log(response.ok)
      if (response.ok) {
        // authentification réussie
        localStorage.setItem("token", data.token); 
        setUser(data.user); 
        navigate("/dashboard");
      } else {
        setError(data.message); // message renvoyé par le backend
      }
    } catch (err) {
      console.log("erreur")
      setError("Erreur serveur, réessayez plus tard");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
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
        <button type="submit">Se connecter</button>
      </form>

        <div className="login-footer">
        <p>Pas encore de compte ?</p>
        <button className="register-btn" onClick={() => navigate("/register")}>
          Inscription
        </button>
      </div>

    </div>
  );
};

export default Login;
