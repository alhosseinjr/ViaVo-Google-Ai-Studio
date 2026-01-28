
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import { Shirt, User, Layout, ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  const { currentStep, setStep, resetSession } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={resetSession}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <Shirt size={22} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-gray-900">
            ViaVo
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { id: AppStep.LANDING, label: 'Home', icon: Layout },
            { id: AppStep.UPLOAD, label: 'Photos', icon: User },
            { id: AppStep.PRODUCTS, label: 'Try-On', icon: Shirt }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                currentStep === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        {currentStep !== AppStep.LANDING && (
          <button 
            onClick={() => setStep(AppStep.LANDING)}
            className="flex md:hidden items-center gap-1 text-sm font-medium text-gray-600"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
