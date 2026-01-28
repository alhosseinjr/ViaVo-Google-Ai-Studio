
import React from 'react';
import { useApp } from '../context/AppContext';
import { AppStep } from '../types';
import FileUpload from '../components/FileUpload';
import { ArrowRight, Info } from 'lucide-react';

const UploadPage: React.FC = () => {
  const { session, updatePhotos, setStep } = useApp();

  const handleFaceUpload = (base64: string) => updatePhotos(base64, session.bodyPhoto);
  const handleBodyUpload = (base64: string) => updatePhotos(session.facePhoto, base64);
  const handleFaceRemove = () => updatePhotos(null, session.bodyPhoto);
  const handleBodyRemove = () => updatePhotos(session.facePhoto, null);

  const canContinue = session.facePhoto && session.bodyPhoto;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-2xl mb-20 space-y-4">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-black tracking-tighter uppercase">Anatomical <br />Scan</h2>
        <p className="text-gray-500 text-lg font-medium">Define your digital silhouette. We require high-resolution captures of your face and full form to generate your virtual twin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <FileUpload 
          label="Portrait" 
          description="Clear front-facing capture"
          value={session.facePhoto}
          onUpload={handleFaceUpload}
          onRemove={handleFaceRemove}
        />
        <FileUpload 
          label="Full Physique" 
          description="Standing pose, neutral background"
          value={session.bodyPhoto}
          onUpload={handleBodyUpload}
          onRemove={handleBodyRemove}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-8 bg-gray-50 rounded-[40px] p-10 flex gap-8 items-start">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <Info size={24} />
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-black uppercase tracking-widest">Scanning Protocol</h4>
            <ul className="text-sm text-gray-500 space-y-2 font-medium">
              <li>• Wear form-fitting attire for precise body mapping.</li>
              <li>• Ensure diffuse, even lighting across the subject.</li>
              <li>• Maintain a neutral, unobstructed background.</li>
              <li>• Stand upright, arms slightly away from the torso.</li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-4 flex justify-end">
          <button
            disabled={!canContinue}
            onClick={() => setStep(AppStep.PRODUCTS)}
            className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
              canContinue 
                ? 'bg-black text-white shadow-2xl shadow-black/20 hover:-translate-y-1' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
