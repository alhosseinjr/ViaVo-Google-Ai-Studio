
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import { ArrowRight, Sparkles, Ruler, Camera } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setStep } = useApp();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl text-center space-y-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] animate-in slide-in-from-top duration-1000">
          <Sparkles size={12} />
          AI Virtual Try-On Studio
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold text-black tracking-tighter leading-[0.9] uppercase animate-in slide-in-from-bottom duration-700">
          TAILORED <br />
          <span className="text-gray-300">VIRTUALLY.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in duration-1000 delay-300">
          Experience a new dimension of fashion. Upload your silhouette and visualize our curated collection with photorealistic accuracy on a pure white void.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
          <button 
            onClick={() => setStep(AppStep.UPLOAD)}
            className="w-full sm:w-auto px-12 py-6 bg-black text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20"
          >
            Start Experience
            <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => setStep(AppStep.PRODUCTS)}
            className="w-full sm:w-auto px-12 py-6 bg-white text-black border-2 border-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            View Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24 border-t border-gray-100 animate-in fade-in duration-1000 delay-700">
          {[
            { icon: Camera, title: 'SCAN', desc: 'Neural analysis of your physique from high-fidelity photos.' },
            { icon: Ruler, title: 'FIT', desc: 'Predictive sizing mapped to your exact anatomical measurements.' },
            { icon: Sparkles, title: 'RENDER', desc: 'Cinematic 3D-like visualization on a clinical white canvas.' }
          ].map((feature, i) => (
            <div key={i} className="space-y-4 text-center group">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-black mx-auto mb-6 group-hover:bg-black group-hover:text-white transition-all duration-500">
                <feature.icon size={28} />
              </div>
              <h3 className="text-[10px] font-black text-black tracking-[0.2em] uppercase">{feature.title}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[200px] mx-auto">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
