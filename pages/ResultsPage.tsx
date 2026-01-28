
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import { Share2, Download, RefreshCw, Zap, Maximize2, ZoomIn, ZoomOut, Move, Info, ShieldCheck, Minimize2 } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const { session, setStep, resetSession } = useApp();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!session.resultImage || !session.analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <button onClick={resetSession} className="bg-black text-white px-12 py-5 font-black uppercase tracking-widest">Restart Session</button>
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };

  const handleExport = () => {
    if (!session.resultImage) return;
    const link = document.createElement('a');
    link.href = session.resultImage;
    link.download = `viavo-tryon-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
        
        {/* Interactive Neural Viewer */}
        <div className="lg:col-span-7 space-y-12">
          <div className="relative group">
            <div 
              ref={containerRef}
              className={`relative overflow-hidden bg-white ring-1 ring-gray-100 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing border border-gray-100 ${
                isFullScreen ? 'h-screen w-screen flex items-center justify-center' : 'aspect-[4/5]'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={session.resultImage} 
                alt="Neural Synthesis" 
                className={`${isFullScreen ? 'max-h-full max-w-full' : 'w-full h-full'} object-contain transition-transform duration-200 ease-out select-none`}
                style={{ 
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  pointerEvents: isDragging ? 'none' : 'auto'
                }}
              />
              
              {/* Overlay Controls */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/90 backdrop-blur-2xl p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 z-50">
                <button onClick={() => adjustZoom(-0.5)} className="p-3 text-white/50 hover:text-white transition-colors">
                  <ZoomOut size={20} />
                </button>
                <div className="px-6 text-[10px] font-black text-white tracking-[0.2em] min-w-[120px] text-center border-x border-white/10">
                  {Math.round(zoom * 100)}% ZOOM
                </div>
                <button onClick={() => adjustZoom(0.5)} className="p-3 text-white/50 hover:text-white transition-colors">
                  <ZoomIn size={20} />
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <button onClick={toggleFullScreen} className="p-3 text-white/50 hover:text-white transition-colors" title="Toggle Cinema View">
                  {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>

              {isFullScreen && (
                <button 
                  onClick={toggleFullScreen}
                  className="absolute top-12 right-12 p-6 bg-black text-white rounded-full hover:scale-110 transition-transform z-50 shadow-2xl"
                >
                  <Minimize2 size={24} />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <button 
              onClick={handleExport}
              className="h-24 bg-white border-2 border-black text-black font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-black hover:text-white transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group"
            >
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <Download size={18} strokeWidth={3} />
              </div>
              Export Full Result
            </button>
            <button 
              onClick={toggleFullScreen}
              className="h-24 bg-white border-2 border-black text-black font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-black hover:text-white transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group"
            >
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <Maximize2 size={18} strokeWidth={3} />
              </div>
              Cinema Preview
            </button>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-5 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                <Zap size={12} /> Fit Intelligence Report
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-500" />
                Verified Anatomy
              </div>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-display font-bold text-black tracking-tighter leading-none uppercase">VIRTUAL <br />SILHOUETTE.</h2>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Body Type</p>
                <p className="text-xl font-bold text-black uppercase tracking-tight">{session.analysis.bodyType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Neural Conf.</p>
                <p className="text-xl font-bold text-black uppercase tracking-tight">{Math.round(session.analysis.confidence * 100)}%</p>
              </div>
            </div>
          </div>

          {/* Fit Metrics Dashboard */}
          <div className="space-y-8 p-12 bg-black text-white rounded-[48px] shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Fabric Tension Analysis</h3>
              <Info size={16} className="text-gray-500" />
            </div>
            <div className="space-y-10">
              {session.analysis.fitMetrics.map((metric, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest">{metric.label}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      metric.status === 'optimal' ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 delay-500 ${
                        metric.status === 'optimal' ? 'bg-white' : 'bg-orange-400'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">SIZE RECOMMENDATIONS</h3>
            <div className="space-y-4">
              {session.recommendations.map((rec) => (
                <div key={rec.productId} className="p-8 bg-white border border-gray-100 rounded-[32px] flex items-center justify-between group hover:border-black transition-all duration-500">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {session.selectedProducts.find(p => p.id === rec.productId)?.name}
                    </p>
                    <p className="text-sm font-medium text-gray-500 max-w-[200px] leading-snug">{rec.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-display font-bold text-black">{rec.recommendedSize}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setStep(AppStep.PRODUCTS)}
            className="w-full h-24 bg-black text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-gray-800 transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] rounded-full"
          >
            <RefreshCw size={24} strokeWidth={3} />
            Modify Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
