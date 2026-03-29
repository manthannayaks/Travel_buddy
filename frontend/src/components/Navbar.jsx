import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStoredUser, isAuthenticated } from '../utils/auth';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const isAuth = isAuthenticated();
  const storedUser = getStoredUser();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Matches', path: '/match' },
    { name: 'Locals', path: '/local' },
    { name: 'Sponsors', path: '/sponsor' },
    { name: 'Skills', path: '/skills' },
    { name: 'Split', path: '/budget' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsOpen(false);
    navigate('/');
  }

  return (
    <nav className="fixed w-full bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 z-50 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center gap-2 hover:opacity-80 transition hover:scale-105 transform duration-300">
              <span className="text-3xl drop-shadow-sm mb-1">🌍</span> TravelBuddy
            </Link>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className={`font-bold text-sm transition-all duration-300 px-4 py-2 flex items-center justify-center rounded-xl ${
                      isActive 
                        ? 'text-white bg-blue-600 shadow-md transform -translate-y-0.5' 
                        : 'text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-5 border-l border-gray-200 pl-6 lg:pl-8 border-dashed">
              {!isAuth ? (
                <>
                  <Link to="/login" className="text-gray-600 font-bold hover:text-blue-600 transition px-2">Log In</Link>
                  <Link 
                    to="/signup" 
                    className="bg-gray-900 text-white hover:bg-black px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full pr-4 transition border border-transparent hover:border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-200">
                      {storedUser?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-gray-800 font-bold hidden lg:block tracking-tight">{storedUser?.name?.split(' ')[0] || 'Dashboard'}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 font-bold bg-red-50 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl transition shadow-sm">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 hover:text-blue-600 focus:outline-none p-2 rounded-xl bg-gray-100">
              <span className="text-xl font-bold">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100 absolute w-full shadow-2xl">
          <div className="px-4 pt-4 pb-8 space-y-2 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-4 rounded-xl text-base font-extrabold transition-all ${
                  location.pathname === link.path ? 'bg-blue-600 text-white shadow-md transform translate-x-1' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-6 mt-4">
              {!isAuth ? (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center text-gray-700 font-bold py-3.5 hover:bg-gray-50 rounded-xl border border-gray-200">Log In</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="block text-center bg-gray-900 text-white shadow-lg font-bold py-3.5 rounded-xl">Sign Up</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-center text-blue-700 bg-blue-50 font-extrabold py-3.5 rounded-xl border border-blue-100">My Dashboard</Link>
                  <button onClick={handleLogout} className="block text-center text-red-600 font-bold py-3.5 w-full hover:bg-red-50 rounded-xl border border-red-100">Log Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
