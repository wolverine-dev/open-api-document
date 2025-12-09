import React from 'react';
import { Compass } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg mb-8">
      {/* Abstract Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path d="M0,300 C150,400 300,200 400,300 C500,400 600,100 800,200 L800,0 L0,0 Z" fill="white" />
          <circle cx="100" cy="100" r="50" fill="white" fillOpacity="0.1" />
          <circle cx="600" cy="300" r="80" fill="white" fillOpacity="0.1" />
          <line x1="100" y1="100" x2="400" y2="300" stroke="white" strokeWidth="1" strokeDasharray="5,5"/>
          <line x1="400" y1="300" x2="700" y2="100" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 p-10 md:p-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">Servis Koleksiyonu 6176</h1>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          Finansal servisler, muhasebe entegrasyonları ve kampanya yönetimi için 
          kapsamlı API dokümantasyonu.
        </p>
        
        <button className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 hover:shadow-lg transition-all active:scale-95">
          <Compass size={20} />
          Keşfet
        </button>
      </div>
    </div>
  );
};

export default HeroSection;