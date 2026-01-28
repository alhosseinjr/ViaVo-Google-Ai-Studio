
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppStep } from './types';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ProductsPage from './pages/ProductsPage';
import ResultsPage from './pages/ResultsPage';

const StepTransition: React.FC<{ children: React.ReactNode; currentStep: AppStep }> = ({ children, currentStep }) => {
  const [displayStep, setDisplayStep] = useState(currentStep);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentStep !== displayStep) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayStep(currentStep);
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isTransitioning ? 'opacity-0 translate-y-10 blur-xl scale-[0.98]' : 'opacity-100 translate-y-0 blur-0 scale-100'}`}>
      {children}
    </div>
  );
};

const BackgroundEffects: React.FC = () => {
  return (
    <>
      <div className="bg-grid" />
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      {/* Structural Grain Overlay for high-end look */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.04] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
    </>
  );
};

const AppContent: React.FC = () => {
  const { currentStep } = useApp();

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.LANDING: return <LandingPage />;
      case AppStep.UPLOAD: return <UploadPage />;
      case AppStep.PRODUCTS: return <ProductsPage />;
      case AppStep.RESULTS: return <ResultsPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden font-sans">
      <BackgroundEffects />
      <Header />
      <main className="relative">
        <StepTransition currentStep={currentStep}>
          {renderStep()}
        </StepTransition>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
