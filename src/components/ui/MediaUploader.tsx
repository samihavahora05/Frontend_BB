import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  accept?: string;
  placeholder?: string;
  value?: string;
}

export const MediaUploader = ({ 
  onUploadSuccess, 
  label, 
  accept = '*/*', 
  placeholder = 'URL or upload file...', 
  value 
}: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result;
      if (typeof base64Data !== 'string') return;

      setIsUploading(true);
      const loadingToast = toast.loading(`Uploading ${file.name}...`);

      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            data: base64Data
          })
        });

        const result = await res.json();
        
        if (res.ok) {
          toast.success("Upload complete!", { id: loadingToast });
          onUploadSuccess(result.url);
        } else {
          toast.error(result.error || "Upload failed", { id: loadingToast });
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error during upload", { id: loadingToast });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
      <div className="flex gap-2 items-center">
        <input 
          type="text" 
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onUploadSuccess(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          className="hidden" 
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 h-[42px] px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="hidden sm:inline">{isUploading ? "Uploading..." : "Upload"}</span>
        </button>
      </div>
    </div>
  );
};
