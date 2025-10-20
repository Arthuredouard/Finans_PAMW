// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import des pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import Categories from './pages/Categories';
import Budget from './pages/Budget';

function App() {
  return (
    <Router>
      <div>
        {/* Menu de navigation */}
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Dashboard</Link>
          <Link to="/transactions" style={{ marginRight: '15px' }}>Transactions</Link>
          <Link to="/categories" style={{ marginRight: '15px' }}>Catégories</Link>
          <Link to="/budget" style={{ marginRight: '15px' }}>Budget</Link>
        </nav>

        {/* Routes principales */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<TransactionDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

