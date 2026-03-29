import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] bg-indigo-500 opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-24 md:pt-32 pb-20 md:pb-24 px-4 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm shadow-sm animate-pulse-slow">
          ✨ The ultimate ecosystem for travelers and locals
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 mb-6 drop-shadow-sm tracking-tight leading-tight max-w-4xl">
          Travel smarter, cheaper, <br className="hidden md:block" />and socially.
        </h1>
        <p className="text-base sm:text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl font-medium leading-relaxed">
          Connect with travel companions, explore with verified local guides, and unlock sponsored travel opportunities worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            Start Your Journey
          </Link>
          <Link to="/match" className="px-8 py-4 bg-white text-gray-800 font-bold text-lg rounded-full shadow-md hover:shadow-lg border border-gray-100 transition transform hover:-translate-y-1">
            Find a Travel Buddy
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Everything you need in one place</h2>
          <p className="text-gray-500 font-medium text-lg">Your all-in-one platform for modern exploration.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Travel Matching" 
            desc="Connect with people traveling to the same destination. Stop traveling solo if you don't want to." 
            icon="✈️" 
            color="bg-blue-50 text-blue-600" 
          />
          <FeatureCard 
            title="Local Buddy System" 
            desc="Hire or connect with locals for authentic guidance and hidden gems you won't find on Google." 
            icon="🤝" 
            color="bg-indigo-50 text-indigo-600" 
          />
          <FeatureCard 
            title="Sponsored Travel" 
            desc="Are you a creator? Brands can sponsor your trips in exchange for content and promotion." 
            icon="🎁" 
            color="bg-emerald-50 text-emerald-600" 
          />
          <FeatureCard 
            title="Skill Exchange" 
            desc="Exchange your photography, writing, or coding skills for free accommodation or services." 
            icon="💡" 
            color="bg-yellow-50 text-yellow-600" 
          />
          <FeatureCard 
            title="Budget Optimization" 
            desc="Split accommodation, rides, and adventure costs with your travel buddies seamlessly." 
            icon="💰" 
            color="bg-green-50 text-green-600" 
          />
          <FeatureCard 
            title="Medical Safety" 
            desc="Must-have for international trips. Access emergency info, first aid, and nearby hospitals instantly." 
            icon="🏥" 
            color="bg-red-50 text-red-600" 
          />
        </div>
      </section>
      
      {/* Call to action */}
      <section className="bg-gray-900 text-white py-20 mt-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Ready to explore the world?</h2>
          <p className="text-xl text-gray-300 mb-10">Join thousands of travelers already using Travel Buddy to enhance their journeys.</p>
          <Link to="/signup" className="px-10 py-5 bg-white text-gray-900 font-extrabold text-lg rounded-full shadow hover:bg-gray-50 transition transform hover:scale-105 inline-block">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer group">
      <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

export default Home;
