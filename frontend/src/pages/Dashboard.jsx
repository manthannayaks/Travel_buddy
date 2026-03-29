import React from 'react';
import { Link } from 'react-router-dom';
import MedicalSafetyPanel from '../components/MedicalSafetyPanel';
import { getStoredUser } from '../utils/auth';

function Dashboard() {
  const storedUser = getStoredUser() || { name: 'Traveler' };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full bg-blue-600 h-48 relative shadow-inner"></div>

      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full border-4 border-white shadow-lg mb-4 flex items-center justify-center text-4xl">
                {storedUser.name?.charAt(0) || '👤'}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{storedUser.name}</h2>
              <p className="text-indigo-600 font-semibold mb-1">Explorer Level</p>
              <p className="text-sm text-gray-500 mb-6">🌎 Traveling since 2019</p>
              
              <div className="w-full border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">Connections</span>
                  <span className="font-bold text-gray-800">12</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">Trips</span>
                  <span className="font-bold text-gray-800">4</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">Reviews</span>
                  <span className="font-bold text-gray-800">4.8 ⭐</span>
                </div>
              </div>

              <button className="w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-200 transition">
                Edit Profile
              </button>
            </div>

            {/* Medical Safety Interactive Panel */}
            <MedicalSafetyPanel />
          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-800 ml-1">Dashboard</h1>
            
            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/match">
                <DashboardActionCard icon="✈️" title="Find a Buddy" desc="Connect with travelers" color="bg-blue-50 text-blue-600" />
              </Link>
              <Link to="/local">
                <DashboardActionCard icon="🤝" title="Hire a Local" desc="Get authentic guidance" color="bg-indigo-50 text-indigo-600" />
              </Link>
              <Link to="/sponsor">
                <DashboardActionCard icon="🎁" title="Sponsor Hub" desc="Discover opportunities" color="bg-emerald-50 text-emerald-600" />
              </Link>
              <Link to="/skills">
                <DashboardActionCard icon="💡" title="Skill Exchange" desc="Trade your talents" color="bg-yellow-50 text-yellow-600" />
              </Link>
              <Link to="/budget">
                <DashboardActionCard icon="💸" title="Budget Splitter" desc="Split group costs" color="bg-green-50 text-green-600" />
              </Link>
            </div>

            {/* Upcoming Trips */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Upcoming Trips</h3>
                <Link to="/match" className="text-sm font-semibold text-blue-600 hover:underline">Add Trip</Link>
              </div>
              
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <span className="text-gray-400 text-5xl mb-3">🧳</span>
                <h4 className="text-gray-700 font-semibold mb-1">No trips planned yet</h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  Start your next adventure by exploring destinations and finding travel buddies.
                </p>
                <Link to="/match" className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition inline-block">
                  Explore Destinations
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function DashboardActionCard({ icon, title, desc, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center h-full gap-4">
      <div className={`p-3 rounded-xl ${color} text-2xl`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default Dashboard;
