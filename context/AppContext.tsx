
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TryOnSession, AppStep, Product, BodyAnalysis, SizeRecommendation } from '../types';

interface AppContextType {
  session: TryOnSession;
  currentStep: AppStep;
  setStep: (step: AppStep) => void;
  updatePhotos: (face: string | null, body: string | null) => void;
  selectProduct: (product: Product, options: { size: string; color: string }) => void;
  removeProduct: (productId: string) => void;
  setResult: (image: string, analysis: BodyAnalysis, recommendations: SizeRecommendation[]) => void;
  resetSession: () => void;
}

const defaultSession: TryOnSession = {
  facePhoto: null,
  bodyPhoto: null,
  selectedProducts: [],
  selectedOptions: {},
  resultImage: null,
  analysis: null,
  recommendations: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<TryOnSession>(defaultSession);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LANDING);

  const setStep = (step: AppStep) => setCurrentStep(step);

  const updatePhotos = (face: string | null, body: string | null) => {
    setSession(prev => ({ ...prev, facePhoto: face, bodyPhoto: body }));
  };

  const selectProduct = (product: Product, options: { size: string; color: string }) => {
    setSession(prev => {
      const isSelected = prev.selectedProducts.find(p => p.id === product.id);
      if (isSelected) {
        return {
          ...prev,
          selectedOptions: { ...prev.selectedOptions, [product.id]: options }
        };
      }
      return {
        ...prev,
        selectedProducts: [...prev.selectedProducts, product],
        selectedOptions: { ...prev.selectedOptions, [product.id]: options }
      };
    });
  };

  const removeProduct = (productId: string) => {
    setSession(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(p => p.id !== productId),
      selectedOptions: Object.fromEntries(
        Object.entries(prev.selectedOptions).filter(([id]) => id !== productId)
      )
    }));
  };

  const setResult = (image: string, analysis: BodyAnalysis, recommendations: SizeRecommendation[]) => {
    setSession(prev => ({ ...prev, resultImage: image, analysis, recommendations }));
  };

  const resetSession = () => {
    setSession(defaultSession);
    setCurrentStep(AppStep.LANDING);
  };

  return (
    <AppContext.Provider value={{
      session,
      currentStep,
      setStep,
      updatePhotos,
      selectProduct,
      removeProduct,
      setResult,
      resetSession
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
