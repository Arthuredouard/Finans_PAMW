import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// ✅ Import du fichier CSS global
import "./App.css"; // Assure-toi que ton CSS est bien dans src/App.css

// Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Categories from "./pages/Categories";
import Budget from "./pages/Budget";
import Login from "./pages/Login";

// Composant 404
const NotFound = () => <h2>Page non trouvée</h2>;

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: "#003366",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-around",
      color: "#fff"
    }}>
      <Link to="/dashboard" style={{ color: "#1af053ff", textDecoration: "none" }}>Dashboard</Link>
      <Link to="/transactions" style={{ color: "#56de29ff", textDecoration: "none" }}>Transactions</Link>
      <Link to="/categories" style={{ color: "#1ad410ff", textDecoration: "none" }}>Categories</Link>
      <Link to="/budget" style={{ color: "#15db2cff", textDecoration: "none" }}>Budget</Link>
    </nav>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/ti" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

