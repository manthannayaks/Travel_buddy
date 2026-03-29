import React, { useState } from 'react';

function MedicalSafetyPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const mockHospitals = [
    { name: 'City Central Hospital', distance: '1.2km', phone: '+1 234-567-8900' },
    { name: 'Traveler Care Clinic', distance: '3.5km', phone: '+1 987-654-3210' }
  ];

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-red-50 hover:bg-red-100 cursor-pointer rounded-2xl border border-red-200 p-6 mt-6 shadow-sm transition transform hover:scale-105"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500 text-2xl animate-pulse">🏥</span>
          <h3 className="font-bold text-red-900 text-lg">Medical Safety</h3>
        </div>
        <p className="text-sm text-red-700 leading-relaxed font-medium">
          Quick-access panel for emergencies, hospitals, and first-aid. Tap to open.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-red-500 p-6 mt-6 shadow-xl relative animate-fadeIn">
      <button 
        onClick={() => setIsOpen(false)} 
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl"
      >
        ×
      </button>
      
      <div className="flex items-center gap-2 mb-6">
        <span className="text-red-500 text-2xl">🚨</span>
        <h3 className="font-bold text-red-600 text-xl">Emergency Dashboard</h3>
      </div>

      <div className="space-y-6">
        {/* Local Emergency numbers */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Local Emergency Numbers</h4>
          <div className="flex justify-between text-sm py-1 font-bold">
             <span className="text-gray-600">Police:</span> <span className="text-red-600 text-lg">911</span>
          </div>
          <div className="flex justify-between text-sm py-1 font-bold">
             <span className="text-gray-600">Ambulance:</span> <span className="text-red-600 text-lg">911</span>
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Nearby Hospitals (Mock)</h4>
          {mockHospitals.map((h, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="font-bold text-gray-900 text-sm">{h.name}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>📍 {h.distance}</span>
                <span>📞 {h.phone}</span>
              </div>
            </div>
          ))}
        </div>

        {/* First Aid */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Basic First Aid</h4>
          <ul className="text-xs text-gray-700 space-y-2 font-medium list-disc pl-4">
            <li><strong>CPR:</strong> 30 compressions, 2 rescue breaths.</li>
            <li><strong>Bleeding:</strong> Apply firm, direct pressure.</li>
            <li><strong>Choking:</strong> Perform Heimlich maneuver (5 back blows, 5 abdominal thrusts).</li>
            <li><strong>Burns:</strong> Cool with running water for 10+ mins. Do not pop blisters.</li>
          </ul>
        </div>
        
        <button className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition">
          Broadcast SOS to Buddies
        </button>
      </div>
    </div>
  );
}

export default MedicalSafetyPanel;
