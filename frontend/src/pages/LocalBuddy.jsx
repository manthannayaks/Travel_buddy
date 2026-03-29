import React, { useState, useEffect } from 'react';
import api from '../services/api';

function LocalBuddy() {
  const [locals, setLocals] = useState([]);
  const [filter, setFilter] = useState('All Locations');
  const [loading, setLoading] = useState(true);

  const fetchGuides = async (locationQuery) => {
    setLoading(true);
    try {
      const endpoint = locationQuery === 'All Locations' 
        ? '/api/guides' 
        : `/api/guides?location=${locationQuery}`;
        
      const response = await api.get(endpoint);
      setLocals(response.data);
    } catch (error) {
      console.error('Error fetching guides', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides(filter);
  }, [filter]);

  // A helper function to seed data if the DB is empty (for demo purposes)
  const seedDatabase = async () => {
    try {
      await api.post('/api/guides/seed');
      fetchGuides(filter);
    } catch (error) {
      console.error('Error seeding data', error);
    }
  };

  const handleFilterClick = (locationStr) => {
    setFilter(locationStr);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col items-center text-center">
          <span className="text-4xl mb-3">🤝</span>
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-3 tracking-tight">Local Buddy System</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Want an authentic experience? Hire verified locals who know the city inside and out. Explore hidden gems and immerse yourself in real culture.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {['All Locations', 'Tokyo', 'Rome', 'Rio'].map(loc => (
            <span 
              key={loc}
              onClick={() => handleFilterClick(loc)}
              className={`px-4 py-2 border rounded-full text-sm font-semibold shadow-sm cursor-pointer transition ${
                filter === loc || (filter.includes(loc) && loc !== 'All Locations')
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              {loc}
            </span>
          ))}
          
          {/* Seed Button for Demo purposes */}
          <button 
            onClick={seedDatabase}
            className="ml-auto px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-gray-800 transition"
          >
            Seed Demo Data
          </button>
        </div>

        {/* Loading State */}
        {loading && <div className="text-center py-10 text-gray-500 font-bold">Loading local guides...</div>}

        {/* Empty State */}
        {!loading && locals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No guides found for this location.</p>
            <p className="text-sm mt-2">Try clicking 'Seed Demo Data' to populate the database!</p>
          </div>
        )}

        {/* Local Guides Grid */}
        {!loading && locals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locals.map(local => (
              <div key={local._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500 relative shrink-0">
                   {/* Avatar placeholder overlapping the header */}
                   <div className="absolute -bottom-6 w-full flex justify-center">
                     <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md">
                       <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                         {local.name.charAt(0)}
                       </div>
                     </div>
                   </div>
                </div>
                <div className="pt-10 p-5 text-center flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-800">{local.name}</h3>
                  <p className="text-sm text-indigo-600 font-medium mb-3">{local.location}</p>
                  
                  <div className="text-sm text-gray-600 space-y-2 mb-4 flex-grow">
                    <p><span className="font-semibold">Knows:</span> {local.expertise}</p>
                    <p><span className="font-semibold">Speaks:</span> {local.languages.join(', ')}</p>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4 shrink-0">
                     <span className="font-bold text-gray-700">⭐ {local.rating}</span>
                     <span className="font-bold text-emerald-600">{local.price}</span>
                  </div>
                  
                  <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow shrink-0">
                    Book Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocalBuddy;
