import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getStoredUser } from '../utils/auth';

function SponsoredTravel() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchSponsorships = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/sponsorships');
      setOpportunities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const handleApply = async (id) => {
    try {
      await api.post(`/api/sponsorships/${id}/apply`);
      setStatus({ type: 'success', message: 'Application submitted successfully.' });
      // Re-fetch to update applicant arrays if needed
      fetchSponsorships();
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Error applying to sponsorship.'
      });
    }
  };

  const handleSeed = async () => {
    try {
      await api.post('/api/sponsorships/seed');
      setStatus({ type: 'success', message: 'Demo opportunities seeded.' });
      fetchSponsorships();
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to seed demo opportunities.' });
    }
  };

  const storedUser = getStoredUser();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-teal-400 to-emerald-500 rounded-3xl p-8 shadow-lg mb-12 text-white flex flex-col md:flex-row justify-between items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold mb-4 drop-shadow-sm">Sponsored Travel</h1>
            <p className="text-lg opacity-90 leading-relaxed">
              Create content, get sponsored, and travel the world for free or at a discount. Top brands are looking for genuine travelers to showcase their products and services.
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-6xl drop-shadow-lg">
            🎁
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Opportunities</h2>
          <button onClick={handleSeed} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded shadow-sm text-sm transition">Seed Demo Data</button>
        </div>

        {status.message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${
              status.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {status.message}
          </div>
        )}

        {loading ? (
          <p className="text-center py-10 text-gray-500 font-bold">Loading opportunities...</p>
        ) : opportunities.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No opportunities found. Click "Seed Demo Data" above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map(opp => {
              const applied = storedUser && opp.applicants && opp.applicants.includes(storedUser._id);
              return (
              <div key={opp._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:shadow-lg transition">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-inner">
                  {opp.icon}
                </div>
                <div className="flex-grow">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">{opp.brand}</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{opp.title}</h3>
                  <div className="space-y-1 mb-4 text-sm">
                    <p className="text-gray-600"><span className="font-medium">Reward:</span> <span className="text-emerald-600 font-bold">{opp.reward}</span></p>
                    <p className="text-gray-600"><span className="font-medium">Requirement:</span> {opp.requirements}</p>
                  </div>
                  <button 
                    onClick={() => handleApply(opp._id)}
                    disabled={applied}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold shadow transition ${applied ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                  >
                    {applied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}

export default SponsoredTravel;
