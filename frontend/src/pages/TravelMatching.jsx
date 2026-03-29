import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function TravelMatching() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');

  const handleSearchAndCreate = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Log the user's trip intention
      await api.post('/api/trips', {
        destination,
        startDate,
        endDate,
        budget: Number(budget)
      });
      setSuccess('Your trip has been saved!');

      // 2. Find matching travelers
      const response = await api.get(`/api/trips/matches?destination=${destination}`);
      setMatches(response.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error finding matches. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (matchBudget) => {
      // Simple logic to generate a proxy match score based on budget closeness
      const diff = Math.abs(matchBudget - Number(budget));
      if (diff < 200) return '95%';
      if (diff < 500) return '85%';
      return '70%';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4 tracking-tight">Travel Matching</h1>
          <p className="text-lg text-gray-600">Find the perfect companion for your next adventure.</p>
        </header>

        {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-lg text-center font-bold border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-4 mb-6 rounded-lg text-center font-bold border border-green-200">{success}</div>}

        {/* Search Bar / Input Form */}
        <form onSubmit={handleSearchAndCreate} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
              <input 
                type="text" 
                placeholder="e.g. Tokyo" 
                className="w-full focus:ring-2 focus:ring-blue-500 border border-gray-200 p-3 rounded-lg outline-none transition"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input 
                type="date" 
                className="w-full focus:ring-2 focus:ring-blue-500 border border-gray-200 p-3 rounded-lg outline-none transition"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input 
                type="date" 
                className="w-full focus:ring-2 focus:ring-blue-500 border border-gray-200 p-3 rounded-lg outline-none transition"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget ($)</label>
              <input 
                type="number" 
                placeholder="1500"
                className="w-full focus:ring-2 focus:ring-blue-500 border border-gray-200 p-3 rounded-lg outline-none transition"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-8 text-center">
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-12 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Find Buddies'}
            </button>
          </div>
        </form>

        {/* Results Grid */}
        {matches.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Matches for {destination}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(match => (
                <div key={match._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                        {match.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{match.user.name}</h3>
                        <p className="text-sm text-gray-500">Travels lightly • Foodie</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                      {calculateMatchScore(match.budget)} Match
                    </div>
                  </div>
                  <div className="space-y-2 mt-4 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><span>📍</span> {match.destination}</p>
                    <p className="flex items-center gap-2"><span>🗓️</span> {new Date(match.startDate).toLocaleDateString()} to {new Date(match.endDate).toLocaleDateString()}</p>
                    <p className="flex items-center gap-2"><span>💰</span> ${match.budget} Budget</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-gray-50 hover:bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold border border-gray-200 hover:border-blue-200 transition">
                      Connect
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {matches.length === 0 && Array.isArray(matches) && success && (
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl block mb-3">🔍</span>
            <p>No matches found yet for this destination. Keep checking back!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TravelMatching;
