
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import FileUpload from '../components/FileUpload';
import { Info } from 'lucide-react';

const UploadPage: React.FC = () => {
  const { session, setFacePhoto, setBodyPhoto, setStep } = useApp();

  const handleFaceUpload = (base64: string) => setFacePhoto(base64);
  const handleBodyUpload = (base64: string) => setBodyPhoto(base64);
  const handleFaceRemove = () => setFacePhoto(null);
  const handleBodyRemove = () => setBodyPhoto(null);

  const canContinue = session.facePhoto && session.bodyPhoto;

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-3xl mb-32 space-y-6">
        <h2 className="text-6xl md:text-8xl font-display font-bold text-black tracking-tighter uppercase leading-none">Anatomical <br />Scan.</h2>
        <p className="text-gray-400 text-xl font-medium leading-relaxed">
          Define your digital twin. We require high-fidelity captures of your profile and physique to map fabrics with neural precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
        <FileUpload 
          label="Portrait Profile" 
          description="High-fidelity front-facing capture"
          value={session.facePhoto}
          onUpload={handleFaceUpload}
          onRemove={handleFaceRemove}
        />
        <FileUpload 
          label="Physique Silhouette" 
          description="Full-body standing pose, neutral background"
          value={session.bodyPhoto}
          onUpload={handleBodyUpload}
          onRemove={handleBodyRemove}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center justify-between p-12 bg-white border border-gray-100 rounded-[48px] shadow-2xl">
        <div className="flex gap-8 items-start max-w-2xl">
          <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
            <Info size={28} />
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Neural Scanning Protocol</h4>
            <ul className="text-sm text-gray-400 space-y-3 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full" /> 
                Wear form-fitting attire for precise body-volume mapping.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full" /> 
                Ensure diffuse, even lighting across the subject's silhouette.
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full" /> 
                Stand upright with arms slightly away from the torso.
              </li>
            </ul>
          </div>
        </div>

        <button
          disabled={!canContinue}
          onClick={() => setStep(AppStep.PRODUCTS)}
          className={`px-20 h-24 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-700 ${
            canContinue 
              ? 'bg-black text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-2' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {canContinue ? 'Initialize Collection' : 'Scans Required'}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
