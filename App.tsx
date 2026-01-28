
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
      }, 400); // Sync with CSS duration
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
      {children}
    </div>
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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Header />
      <main className="relative pt-8">
        <StepTransition currentStep={currentStep}>
          {renderStep()}
        </StepTransition>
      </main>
      
      {/* Dynamic Professional Backgrounds */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.03),transparent_40%)]" />
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
