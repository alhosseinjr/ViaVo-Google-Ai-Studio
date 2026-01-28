
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
        <button onClick={resetSession} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl">Start New Session</button>
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
      const next = Math.min(Math.max(prev + delta, 1), 3);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Interactive 3D-like Viewer */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative group">
            <div 
              ref={containerRef}
              className="relative aspect-[3/4] rounded-[48px] overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] ring-1 ring-gray-100 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={session.resultImage} 
                alt="AI Generated Fit" 
                className="w-full h-full object-contain transition-transform duration-200 ease-out select-none"
                style={{ 
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  pointerEvents: isDragging ? 'none' : 'auto'
                }}
              />
              
              {/* Overlay Controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-3xl border border-white shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button 
                  onClick={() => adjustZoom(-0.5)}
                  className="p-3 hover:bg-gray-100 rounded-2xl text-gray-600 transition-colors"
                >
                  <ZoomOut size={20} />
                </button>
                <div className="px-4 text-sm font-black text-gray-900 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </div>
                <button 
                  onClick={() => adjustZoom(0.5)}
                  className="p-3 hover:bg-gray-100 rounded-2xl text-gray-600 transition-colors"
                >
                  <ZoomIn size={20} />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button 
                  onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }}
                  className="p-3 hover:bg-gray-100 rounded-2xl text-gray-600 transition-colors"
                >
                  <Maximize2 size={20} />
                </button>
              </div>

              {zoom > 1 && (
                <div className="absolute top-8 right-8 bg-blue-600 text-white p-3 rounded-2xl animate-pulse">
                  <Move size={20} />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={22} />
              Export HD
            </button>
            <button className="flex-1 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
              <Share2 size={22} />
              Share Look
            </button>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest">
              <Zap size={14} /> AI Analysis Confirmed
            </div>
            <h2 className="text-5xl font-display font-bold text-gray-900 tracking-tight leading-none">Your Virtual <br /> Silhouette</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Based on your unique {session.analysis.bodyType} build, we've optimized the garment draping to show the most accurate fit.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Precision Recommendations</h3>
            <div className="space-y-4">
              {session.recommendations.map((rec) => {
                const product = session.selectedProducts.find(p => p.id === rec.productId);
                return (
                  <div key={rec.productId} className="p-8 bg-white rounded-[32px] border border-blue-50 shadow-xl shadow-blue-900/[0.02] flex items-center justify-between group hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50">
                        <img src={product?.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product?.brand}</p>
                        <p className="text-lg font-bold text-gray-900">{product?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Optimal Size</p>
                      <p className="text-3xl font-display font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{rec.recommendedSize}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => setStep(AppStep.PRODUCTS)}
            className="w-full h-20 bg-gray-900 text-white rounded-[28px] font-bold text-lg flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl shadow-gray-200"
          >
            <RefreshCw size={24} />
            Change Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
