
import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface FileUploadProps {
  label: string;
  description: string;
  onUpload: (base64: string) => void;
  onRemove: () => void;
  value: string | null;
}

/**
 * VIAVO UNIVERSAL DECODER
 * Capped at 1024px for optimal performance and Gemini 3 Flash compatibility.
 */
const MAX_DIM = 1024;

const FileUpload: React.FC<FileUploadProps> = ({ label, description, onUpload, onRemove, value }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Use the value from props if local preview is missing (e.g. after a refresh or step change)
  useEffect(() => {
    if (value && !localPreview) {
      setLocalPreview(value);
    }
  }, [value, localPreview]);

  /**
   * The "Atomic Decoding" Strategy.
   * This is the most compatible way to read an image across all browsers.
   */
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) return reject(new Error("File stream returned empty."));

        // Step 2: Create a standard Image element
        const img = new Image();
        
        // Critical: Set crossOrigin for certain environment constraints
        img.crossOrigin = "anonymous";

        img.onload = () => {
          try {
            // Step 3: Calculate scaled dimensions
            let width = img.width;
            let height = img.height;

            if (width === 0 || height === 0) {
              return reject(new Error("Image has no dimensions (Empty Frame)."));
            }

            if (width > MAX_DIM || height > MAX_DIM) {
              const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            // Step 4: Draw to sanitized canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d', { alpha: false });
            
            if (!ctx) return reject(new Error("Graphics hardware context rejected."));

            // Solid white background (Crucial for AI analysis)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Step 5: Final Export
            const finalBase64 = canvas.toDataURL('image/jpeg', 0.8);
            
            // Explicit memory release
            canvas.width = 0;
            canvas.height = 0;
            
            resolve(finalBase64);
          } catch (err) {
            reject(new Error("Synthesis engine error. Try a smaller photo."));
          }
        };

        img.onerror = () => {
          // Detect HEIC or corrupt headers
          if (file.name.toLowerCase().endsWith('.heic')) {
            reject(new Error("HEIC format is not supported by standard browsers. Please use JPG or PNG."));
          } else {
            reject(new Error("Image decoding failed. The file may be corrupt or too large."));
          }
        };

        // Inject data
        img.src = result;
      };

      reader.onerror = () => reject(new Error("Binary read error."));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setLoadError(null);

    // Initial simple check for common formats
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
    if (!isImage) {
      setLoadError("Invalid file type. Please upload a JPG or PNG.");
      setIsProcessing(false);
      return;
    }

    // Safety timeout to allow the browser to settle after file selection
    setTimeout(async () => {
      try {
        const result = await processImageFile(file);
        setLocalPreview(result);
        onUpload(result);
        setIsProcessing(false);
      } catch (err: any) {
        console.error("Decoding Pipeline Failure:", err);
        setLoadError(err.message || "Decoding error.");
        setIsProcessing(false);
      }
    }, 150);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPreview(null);
    setLoadError(null);
    onRemove();
    if (inputRef.current) inputRef.current.value = '';
  };

  const hasImage = localPreview || value;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em]">{label}</h3>
          <p className="text-xs text-gray-400 font-medium">{description}</p>
        </div>
        {hasImage && !isProcessing && !loadError && (
          <CheckCircle className="text-black animate-in zoom-in" size={16} strokeWidth={3} />
        )}
      </div>

      <div className={`relative group overflow-hidden rounded-[40px] border border-gray-100 transition-all duration-500 min-h-[420px] bg-gray-50 flex items-center justify-center ${loadError ? 'ring-2 ring-red-100' : ''}`}>
        {!hasImage && !isProcessing && !loadError ? (
          <div 
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white transition-all duration-500 p-12"
          >
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-black group-hover:scale-110 group-hover:shadow-2xl transition-all duration-700">
              <Upload size={28} strokeWidth={2} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-black uppercase tracking-[0.4em]">Initialize Upload</p>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Standard JPG or PNG only</p>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in">
            <Loader2 className="animate-spin text-black mb-4" size={32} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Decoding Binary...</span>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-8 p-12 text-center animate-in zoom-in bg-white w-full h-full justify-center">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-inner">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Synthesis Error</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed max-w-[280px]">
                {loadError}
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-[200px]">
              <button 
                onClick={() => inputRef.current?.click()}
                className="px-8 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Try Different File
              </button>
              <button 
                onClick={handleRemove}
                className="text-[10px] font-black text-gray-300 hover:text-black uppercase tracking-widest transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        ) : (
          <>
            <img 
              src={hasImage!} 
              alt="Scan" 
              className="w-full h-full object-contain max-h-[600px] block animate-in fade-in duration-1000"
            />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
              <div className="flex gap-6">
                <button 
                  onClick={() => inputRef.current?.click()}
                  className="bg-white p-6 rounded-full text-black hover:scale-110 transition-all shadow-2xl"
                  title="Replace"
                >
                  <RefreshCw size={24} strokeWidth={3} />
                </button>
                <button 
                  onClick={handleRemove}
                  className="bg-white p-6 rounded-full text-black hover:scale-110 transition-all shadow-2xl"
                  title="Remove"
                >
                  <X size={24} strokeWidth={3} />
                </button>
              </div>
            </div>
          </>
        )}
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/jpeg,image/jpg,image/png,image/webp" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
};

export default FileUpload;
