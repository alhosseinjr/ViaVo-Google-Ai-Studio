
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
      alert("Please upload your profile photos first.");
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
      alert(`Optimization failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} /> Curated Selection
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 tracking-tight">The Boutique</h2>
          <p className="text-gray-500 text-xl leading-relaxed">
            Select pieces to curate your virtual wardrobe. Our AI will render your choices with photographic precision on your unique frame.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-40">
        {PRODUCTS.map((product) => {
          const isSelected = session.selectedProducts.find(p => p.id === product.id);
          const currentOptions = session.selectedOptions[product.id];
          
          return (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className={`group flex flex-col bg-white rounded-[40px] border transition-all duration-700 cursor-pointer relative overflow-hidden ${
                isSelected ? 'border-blue-600 ring-[12px] ring-blue-50' : 'border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:-translate-y-2'
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {isSelected && (
                  <div className="absolute top-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl animate-in zoom-in duration-300">
                    <Check size={24} strokeWidth={3} />
                  </div>
                )}

                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl flex items-center justify-between shadow-xl">
                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Configure</span>
                    <ChevronRight size={18} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4 bg-white">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] uppercase tracking-[0.2em] font-black text-blue-600">{product.brand}</p>
                    <span className="text-lg font-black text-gray-900">${product.price}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                  </h3>
                </div>
                
                {isSelected && currentOptions && (
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <span className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                      Size: {currentOptions.size}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                      {currentOptions.color}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal & Floating Bar (already implemented in previous step, ensuring consistency) */}
      {configuringProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl" onClick={() => setConfiguringProduct(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-80 md:h-auto">
                <img src={configuringProduct.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="p-10 space-y-10 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-black text-blue-600">Configuration</p>
                    <h3 className="text-3xl font-display font-bold text-gray-900 leading-tight">{configuringProduct.name}</h3>
                  </div>
                  <button onClick={() => setConfiguringProduct(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-8 flex-1">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Size</p>
                    <div className="grid grid-cols-4 gap-2">
                      {configuringProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-12 rounded-xl text-sm font-bold transition-all border ${
                            selectedSize === size ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={confirmSelection}
                  className="w-full h-16 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  Confirm Selection
                  <Check size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {session.selectedProducts.length > 0 && !configuringProduct && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 animate-in slide-in-from-bottom duration-700 z-50">
          <div className="bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-[40px] p-6 shadow-2xl flex items-center gap-8">
            <div className="flex -space-x-4">
              {session.selectedProducts.map((p) => (
                <img key={p.id} src={p.imageUrl} className="h-14 w-14 rounded-2xl ring-4 ring-gray-900 object-cover shadow-2xl" alt="" />
              ))}
            </div>
            <button
              onClick={handleStartTryOn}
              disabled={isGenerating}
              className="flex-1 bg-white text-gray-900 h-16 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all disabled:bg-gray-800 disabled:text-gray-500"
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={24} /> Rendering Result...</>
              ) : (
                <><ShoppingBag size={22} /> Initiate Try-On Session</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
