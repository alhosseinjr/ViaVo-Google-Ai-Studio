
import React, { useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  description: string;
  onUpload: (base64: string) => void;
  onRemove: () => void;
  value: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, description, onUpload, onRemove, value }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {value && <CheckCircle className="text-green-500" size={18} />}
      </div>

      {!value ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
        >
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-blue-500 transition-colors">
            <Upload size={24} />
          </div>
          <p className="text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
          <input 
            type="file" 
            ref={inputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
      ) : (
        <div className="relative aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden group">
          <img 
            src={value} 
            alt="Upload preview" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={onRemove}
              className="bg-white/90 p-2 rounded-full text-red-600 hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
