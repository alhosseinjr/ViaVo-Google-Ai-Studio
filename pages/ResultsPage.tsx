
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import { Share2, Download, RefreshCw, Ruler, Zap, ShieldCheck, Maximize2, ZoomIn, ZoomOut, Move } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const { session, setStep, resetSession } = useApp();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (!session.resultImage || !session.analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <button onClick={resetSession} className="bg-black text-white px-12 py-5 font-black uppercase tracking-widest">Restart Studio</button>
      </div>
    );
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const adjustZoom = (delta: number) => {
    setZoom(prev => {
      const next = Math.min(Math.max(prev + delta, 1), 4);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
        
        {/* Interactive 3D Viewer */}
        <div className="lg:col-span-7 space-y-12">
          <div className="relative group">
            <div 
              ref={containerRef}
              className="relative aspect-[4/5] overflow-hidden bg-white ring-1 ring-gray-100 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={session.resultImage} 
                alt="AI Generated Silhouette" 
                className="w-full h-full object-contain transition-transform duration-200 ease-out select-none"
                style={{ 
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  pointerEvents: isDragging ? 'none' : 'auto'
                }}
              />
              
              {/* Overlay Controls */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/90 backdrop-blur-2xl p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <button onClick={() => adjustZoom(-0.5)} className="p-2 text-white/50 hover:text-white transition-colors">
                  <ZoomOut size={20} />
                </button>
                <div className="px-6 text-[10px] font-black text-white tracking-[0.2em] min-w-[100px] text-center">
                  {Math.round(zoom * 100)}% ZOOM
                </div>
                <button onClick={() => adjustZoom(0.5)} className="p-2 text-white/50 hover:text-white transition-colors">
                  <ZoomIn size={20} />
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <button onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }} className="p-2 text-white/50 hover:text-white transition-colors">
                  <Maximize2 size={20} />
                </button>
              </div>

              {zoom > 1 && (
                <div className="absolute top-12 left-12 bg-black text-white p-4 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                  <Move size={14} /> Navigate Silhouette
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <button className="h-20 bg-white border border-black text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-black hover:text-white transition-all">
              <Download size={20} />
              Save Capture
            </button>
            <button className="h-20 bg-white border border-black text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-black hover:text-white transition-all">
              <Share2 size={20} />
              Distribute
            </button>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-5 space-y-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gray-100 text-black text-[10px] font-black uppercase tracking-[0.3em]">
              <Zap size={12} /> Neural Fit Validated
            </div>
            <h2 className="text-6xl md:text-7xl font-display font-bold text-black tracking-tighter leading-none uppercase">YOUR <br />VIRTUAL <br />SILHOUETTE.</h2>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              Synthesized using your {session.analysis.bodyType} anatomy. We have accurately mapped the fabric tension to your unique bone structure and posture.
            </p>
          </div>

          <div className="space-y-10">
            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">PRECISION METRICS</h3>
            <div className="space-y-6">
              {session.recommendations.map((rec) => {
                const product = session.selectedProducts.find(p => p.id === rec.productId);
                return (
                  <div key={rec.productId} className="p-10 bg-white border border-gray-100 flex items-center justify-between group hover:border-black transition-all">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-gray-50 overflow-hidden">
                        <img src={product?.imageUrl} className="w-full h-full object-cover transition-all duration-700" alt="" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{product?.brand}</p>
                        <p className="text-xl font-bold text-black uppercase tracking-tight">{product?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">OPTIMAL FIT</p>
                      <p className="text-4xl font-display font-bold text-black transition-transform origin-right">{rec.recommendedSize}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => setStep(AppStep.PRODUCTS)}
            className="w-full h-24 bg-black text-white font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-gray-800 transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]"
          >
            <RefreshCw size={24} strokeWidth={3} />
            Modify Parameters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
