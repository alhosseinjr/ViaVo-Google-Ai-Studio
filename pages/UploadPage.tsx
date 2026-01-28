
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl font-display font-bold text-gray-900">Upload Your Profile</h2>
        <p className="text-gray-500">To provide accurate results, we require two specific photos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <FileUpload 
          label="Face Photo" 
          description="Square, clear, front-facing"
          value={session.facePhoto}
          onUpload={handleFaceUpload}
          onRemove={handleFaceRemove}
        />
        <FileUpload 
          label="Full Body Photo" 
          description="Head to toe, standing straight"
          value={session.bodyPhoto}
          onUpload={handleBodyUpload}
          onRemove={handleBodyRemove}
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <Info size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-blue-900">For Best Results</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Wear form-fitting clothing for the body photo.</li>
              <li>Ensure good lighting without harsh shadows.</li>
              <li>Keep the background as neutral as possible.</li>
              <li>Stand directly facing the camera.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={!canContinue}
          onClick={() => setStep(AppStep.PRODUCTS)}
          className={`px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${
            canContinue 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Products
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
