import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TravelMatching from './pages/TravelMatching';
import LocalBuddy from './pages/LocalBuddy';
import SponsoredTravel from './pages/SponsoredTravel';
import SkillExchange from './pages/SkillExchange';
import BudgetSplitter from './pages/BudgetSplitter';
import Navbar from './components/Navbar';
import { GuestRoute, ProtectedRoute } from './components/RouteGuards';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/match" element={<ProtectedRoute><TravelMatching /></ProtectedRoute>} />
            <Route path="/local" element={<ProtectedRoute><LocalBuddy /></ProtectedRoute>} />
            <Route path="/sponsor" element={<ProtectedRoute><SponsoredTravel /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><SkillExchange /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetSplitter /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
