import React, { useState, useEffect } from 'react';
import api from '../services/api';

function SkillExchange() {
  const [skillsList, setSkillsList] = useState([]);
  const [skills, setSkills] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchSkills = async () => {
    try {
      const res = await api.get('/api/skills');
      setSkillsList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skills.split(',').map(s => s.trim());
      await api.post('/api/skills', { skills: skillsArray, lookingFor, description });
      setSkills('');
      setLookingFor('');
      setDescription('');
      setStatus({ type: 'success', message: 'Your skill offer is live now.' });
      fetchSkills(); // Refresh the list
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Error posting skill offer.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Post Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Offer your skills</h2>
            <p className="text-sm text-gray-600 mb-6">Exchange your talents for free stays, local tours, or rides.</p>

            {status.message && (
              <div
                className={`mb-4 rounded-lg border px-3 py-2 text-sm font-medium ${
                  status.type === 'error'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {status.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Skills</label>
                <input 
                  type="text" placeholder="e.g. Photography, Coding, Cooking" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                  value={skills} onChange={e => setSkills(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">What are you looking for?</label>
                <input 
                  type="text" placeholder="e.g. 2 nights stay, tour guide" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                  value={lookingFor} onChange={e => setLookingFor(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="3" placeholder="I can take pro photos of your hostel in exchange for a bed." 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                  value={description} onChange={e => setDescription(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="w-full bg-yellow-500 text-white font-bold py-2 rounded shadow hover:bg-yellow-600 transition">
                Post Offer
              </button>
            </form>
          </div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Skill Exchange Board</h2>
          {loading ? (
             <p className="text-gray-500 font-bold">Loading board...</p>
          ) : skillsList.length === 0 ? (
             <div className="bg-white p-8 rounded-2xl text-center border shadow-sm">
                <span className="text-4xl mb-3 block">📭</span>
                <p className="text-gray-500 font-medium">No offers posted yet. Be the first!</p>
             </div>
          ) : (
            skillsList.map(post => (
              <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-xl shrink-0">
                  {post.user?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{post.user?.name || 'Anonymous'}</h3>
                    <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.skills.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">{s}</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed bg-gray-50 p-3 rounded">{post.description}</p>
                  
                  <div className="flex justify-between items-center border-t pt-3">
                    <p className="text-sm font-medium"><span className="text-gray-500">Wants:</span> <span className="text-yellow-700 font-bold">{post.lookingFor}</span></p>
                    <button className="px-4 py-1.5 bg-gray-900 text-white text-sm font-bold rounded hover:bg-gray-800 transition">Connect</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillExchange;
