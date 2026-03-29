import React, { useState } from 'react';

function BudgetSplitter() {
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [travelers, setTravelers] = useState(2);

  const addExpense = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;
    
    setExpenses([...expenses, { id: Date.now(), desc, amount: parseFloat(amount) }]);
    setDesc('');
    setAmount('');
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const perPerson = travelers > 0 ? (total / travelers).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <span className="text-4xl mb-3 block">💸</span>
          <h1 className="text-4xl font-extrabold text-green-600 mb-2 tracking-tight">Budget Splitter</h1>
          <p className="text-gray-600">Track trip expenses and split costs seamlessly.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <form onSubmit={addExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <input 
                  type="text" placeholder="e.g. Dinner, Taxi, Hotel" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                  value={desc} onChange={e => setDesc(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount ($)</label>
                <input 
                  type="number" step="0.01" placeholder="45.50" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                  value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded shadow hover:bg-green-700 transition">
                Add to Total
              </button>
            </form>

            <div className="mt-8 border-t pt-6">
               <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Travelers</label>
               <input 
                  type="number" min="1" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                  value={travelers} onChange={e => setTravelers(e.target.value)} />
            </div>
          </div>

          {/* Visualization Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            
            <div className="flex-grow overflow-y-auto max-h-60 mb-6 space-y-2">
              {expenses.length === 0 && <p className="text-gray-400 italic text-sm">No expenses added yet.</p>}
              {expenses.map(exp => (
                <div key={exp.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-100">
                  <span className="font-medium text-gray-700">{exp.desc}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">${exp.amount.toFixed(2)}</span>
                    <button onClick={() => removeExpense(exp.id)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg mb-2">
                <span className="text-gray-600">Total Trip Cost:</span>
                <span className="font-extrabold text-gray-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl bg-green-50 p-4 rounded-lg border border-green-100 mt-2">
                <span className="font-bold text-green-800">Per Person Share:</span>
                <span className="font-extrabold text-green-700">${perPerson}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetSplitter;
