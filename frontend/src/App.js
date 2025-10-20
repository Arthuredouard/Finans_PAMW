import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Categories from "./pages/Categories";
import Budget from "./pages/Budget";

// Contexte global
import { AppProvider } from "./context/AppContext";

// Styles
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>FinansPam</h1>
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/transactions">Transactions</Link>
              <Link to="/categories">Catégories</Link>
              <Link to="/budget">Budget</Link>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/:id" element={<TransactionDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/budget" element={<Budget />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>&copy; 2025 FinansPam</p>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
