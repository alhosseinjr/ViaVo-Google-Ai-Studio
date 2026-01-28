
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppStep, Product } from '../types';
import { PRODUCTS } from '../constants';
import { Check, ShoppingBag, Loader2, X, ChevronRight, Sparkles } from 'lucide-react';
import { analyzeBody, generateTryOnResult, getRecommendations } from '../services/geminiService';

const ProductsPage: React.FC = () => {
  const { session, selectProduct, removeProduct, setStep, setResult } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [configuringProduct, setConfiguringProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleProductClick = (product: Product) => {
    const isSelected = session.selectedProducts.find(p => p.id === product.id);
    if (isSelected) {
      removeProduct(product.id);
    } else {
      setConfiguringProduct(product);
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
    }
  };

  const confirmSelection = () => {
    if (configuringProduct) {
      selectProduct(configuringProduct, { size: selectedSize, color: selectedColor });
      setConfiguringProduct(null);
    }
  };

  const handleStartTryOn = async () => {
    if (session.selectedProducts.length === 0) return;
    if (!session.facePhoto || !session.bodyPhoto) {
      alert("Profile scan required.");
      setStep(AppStep.UPLOAD);
      return;
    }

    setIsGenerating(true);
    try {
      const analysis = await analyzeBody(session.bodyPhoto);
      const recommendations = getRecommendations(analysis, session.selectedProducts);
      const resultImage = await generateTryOnResult(
        session.facePhoto,
        session.bodyPhoto,
        session.selectedProducts,
        session.selectedOptions
      );

      setResult(resultImage, analysis, recommendations);
      setStep(AppStep.RESULTS);
    } catch (error: any) {
      console.error(error);
      alert(`Simulation failed: ${error.message || "Network error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
            <Sparkles size={12} /> The Collection
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-bold text-black tracking-tighter leading-none uppercase">THE <br />BOUTIQUE.</h2>
          <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-2xl">
            Select pieces to curate your virtual wardrobe. Our AI will render your choices with photographic precision on your unique frame.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-60">
        {PRODUCTS.map((product) => {
          const isSelected = session.selectedProducts.find(p => p.id === product.id);
          const currentOptions = session.selectedOptions[product.id];
          
          return (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className={`group flex flex-col bg-white transition-all duration-1000 cursor-pointer relative ${
                isSelected ? 'ring-2 ring-black ring-offset-[16px] -translate-y-2' : 'hover:-translate-y-4'
              }`}
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative border border-gray-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                
                {isSelected && (
                  <div className="absolute top-6 right-6 w-14 h-14 bg-black text-white flex items-center justify-center shadow-2xl animate-in zoom-in duration-500">
                    <Check size={28} strokeWidth={3} />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="bg-black text-white px-8 py-4 flex items-center justify-between shadow-2xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Configure Selection</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>

              <div className="py-8 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">{product.brand}</p>
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-bold text-black leading-tight max-w-[70%]">
                      {product.name}
                    </h3>
                    <span className="text-xl font-black text-black">EGP {product.price}</span>
                  </div>
                </div>
                
                {isSelected && currentOptions && (
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                      Size {currentOptions.size}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      {currentOptions.color}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal & Floating Bar */}
      {configuringProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl" onClick={() => setConfiguringProduct(null)} />
          <div className="relative bg-white w-full max-w-4xl flex flex-col md:flex-row shadow-[0_100px_200px_-50px_rgba(0,0,0,0.15)] animate-in zoom-in fade-in duration-700 border border-gray-100 overflow-hidden">
            <div className="md:w-1/2 aspect-[3/4] md:aspect-auto overflow-hidden">
              <img src={configuringProduct.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="md:w-1/2 p-16 flex flex-col justify-center bg-white">
              <div className="space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">SPECIFICATIONS</p>
                    <h3 className="text-5xl font-display font-bold text-black leading-none uppercase">{configuringProduct.name}</h3>
                  </div>
                  <button onClick={() => setConfiguringProduct(null)} className="p-2 text-black hover:scale-110 transition-transform">
                    <X size={32} strokeWidth={1} />
                  </button>
                </div>
                
                <p className="text-gray-500 font-medium leading-relaxed">{configuringProduct.description}</p>

                <div className="space-y-6">
                  <p className="text-[10px] font-black text-black uppercase tracking-[0.3em]">SELECT DIMENSIONS</p>
                  <div className="grid grid-cols-4 gap-4">
                    {configuringProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-16 text-sm font-black transition-all border-2 ${
                          selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={confirmSelection}
                  className="w-full h-20 bg-black text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all flex items-center justify-center gap-4 mt-12 shadow-xl"
                >
                  Confirm Choice
                  <Check size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {session.selectedProducts.length > 0 && !configuringProduct && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 animate-in slide-in-from-bottom-8 duration-1000 z-50">
          <div className="bg-black text-white p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-12">
            <div className="flex -space-x-8">
              {session.selectedProducts.map((p) => (
                <div key={p.id} className="relative group/mini">
                  <img src={p.imageUrl} className="h-20 w-20 ring-4 ring-black object-cover shadow-2xl group-hover/mini:-translate-y-2 transition-transform duration-500" alt="" />
                  <button onClick={() => removeProduct(p.id)} className="absolute -top-2 -right-2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover/mini:opacity-100 transition-opacity">
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleStartTryOn}
              disabled={isGenerating}
              className="flex-1 bg-white text-black h-20 font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-gray-100 transition-all disabled:bg-gray-900 disabled:text-gray-700"
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={24} /> SIMULATING ARCHITECTURE...</>
              ) : (
                <><ShoppingBag size={20} strokeWidth={3} /> INITIALIZE SIMULATION</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
