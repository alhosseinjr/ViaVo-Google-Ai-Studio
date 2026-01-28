
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import { Shirt, User, Layout, ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  const { currentStep, setStep, resetSession } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={resetSession}
        >
          <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Shirt size={20} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter text-black uppercase">
            VIAVO
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {[
            { id: AppStep.LANDING, label: 'Studio', icon: Layout },
            { id: AppStep.UPLOAD, label: 'Profile', icon: User },
            { id: AppStep.PRODUCTS, label: 'Collection', icon: Shirt }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-black ${
                currentStep === item.id ? 'text-black' : 'text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {currentStep !== AppStep.LANDING && (
          <button 
            onClick={() => setStep(AppStep.LANDING)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5"
          >
            <ArrowLeft size={12} strokeWidth={3} />
            Back
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
