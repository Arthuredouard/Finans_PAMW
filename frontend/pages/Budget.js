import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function Budget() {
  const [budget, setBudget] = useState(null);
  const [newBudget, setNewBudget] = useState('');

  useEffect(() => {
    async function fetchBudget() {
      const res = await axios.get(`${API_URL}/budget`);
      setBudget(res.data.amount);
    }
    fetchBudget();
  }, []);

  const handleUpdate = async () => {
    await axios.put(`${API_URL}/budget`, { amount: parseFloat(newBudget) });
    setBudget(newBudget);
    setNewBudget('');
  };

  return (
    <div>
      <h1>Budget</h1>
      <p>Budget actuel : {budget} €</p>
      <input 
        type="number" 
        placeholder="Nouveau budget" 
        value={newBudget} 
        onChange={e => setNewBudget(e.target.value)} 
      />
      <button onClick={handleUpdate}>Mettre à jour</button>
    </div>
  );
}

export default Budget;
