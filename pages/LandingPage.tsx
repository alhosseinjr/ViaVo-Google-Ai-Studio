
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import { ArrowRight, Sparkles, Ruler, Camera } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setStep } = useApp();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
          <Sparkles size={14} />
          Next-Generation Virtual Try-On
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 tracking-tight leading-tight">
          Visualization Beyond <br />
          <span className="text-blue-600">Expectation</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Upload your photos and witness how clothing fits your unique physique. Precise measurements and photorealistic AI rendering, delivered instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => setStep(AppStep.UPLOAD)}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            Start Your Experience
            <ArrowRight size={20} />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
            View Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
          {[
            { icon: Camera, title: 'Photo Analysis', desc: 'AI analyzes your unique body structure from simple photos.' },
            { icon: Ruler, title: 'Smart Sizing', desc: 'Get precise size recommendations for every brand and item.' },
            { icon: Sparkles, title: 'Realistic View', desc: 'High-fidelity visualization of how fabrics drape on you.' }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
