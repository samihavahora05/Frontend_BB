import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, CheckCircle2, AlertCircle, PenTool, Upload, Image as ImageIcon, X } from 'lucide-react';

interface SignaturePadProps {
  onChange?: (dataUrlOrFile: string | File | null) => void;
  onSignatureChange?: (dataUrlOrFile: string | File | null) => void;
  onSave?: (dataUrlOrFile: string | File | null) => void;
  onClear?: () => void;
  height?: number;
  className?: string;
  label?: string;
  defaultMode?: 'upload' | 'draw';
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onChange,
  onSignatureChange,
  onSave,
  onClear,
  height = 160,
  className = '',
  label = 'Digital Signature / Photo',
  defaultMode = 'upload'
}) => {
  const [mode, setMode] = useState<'upload' | 'draw'>(defaultMode);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // Safe caller for onChange, onSignatureChange, or onSave prop
  const triggerChange = useCallback((val: string | File | null) => {
    if (typeof onChange === 'function') {
      onChange(val);
    }
    if (typeof onSignatureChange === 'function') {
      onSignatureChange(val);
    }
    if (typeof onSave === 'function') {
      onSave(val);
    }
  }, [onChange, onSignatureChange, onSave]);

  // Resize canvas to container with device pixel ratio compensation
  const resizeCanvas = useCallback(() => {
    if (mode !== 'draw') return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    
    let tempImg: ImageData | null = null;
    if (hasDrawn) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        tempImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
    }

    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tempImg && hasDrawn) {
        ctx.putImageData(tempImg, 0, 0);
      }
    }
  }, [height, hasDrawn, mode]);

  useEffect(() => {
    if (mode === 'draw') {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [resizeCanvas, mode]);

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setUploadedImagePreview(result);
      setUploadedFileName(file.name);
      triggerChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearUpload = () => {
    setUploadedImagePreview(null);
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    triggerChange(null);
    if (onClear) onClear();
  };

  // Drawing helpers
  const getCanvasCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoordinates(e.nativeEvent);
    if (!coords) return;

    setIsDrawing(true);
    setLastPoint(coords);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    const coords = getCanvasCoordinates(e.nativeEvent);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPoint(coords);
    if (!hasDrawn) {
      setHasDrawn(true);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPoint(null);

    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      const dataUrl = canvas.toDataURL('image/png');
      triggerChange(dataUrl);
    }
  };

  const handleClearDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    triggerChange(null);
    if (onClear) onClear();
  };

  const isSignatureReady = mode === 'upload' ? !!uploadedImagePreview : hasDrawn;

  return (
    <div className={`space-y-3 ${className}`}>
      
      {/* Mode Switcher Tabs + Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('upload');
              if (uploadedImagePreview) triggerChange(uploadedImagePreview);
              else triggerChange(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-[#1B2A6B] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload size={13} />
            <span>Upload Signature Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('draw');
              setTimeout(resizeCanvas, 50);
              if (hasDrawn && canvasRef.current) triggerChange(canvasRef.current.toDataURL('image/png'));
              else triggerChange(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'draw'
                ? 'bg-white text-[#1B2A6B] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool size={13} />
            <span>Draw Signature</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isSignatureReady ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 size={13} /> Signature Attached
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <AlertCircle size={13} /> Signature Required
            </span>
          )}
        </div>
      </div>

      {/* MODE 1: UPLOAD SIGNATURE PHOTO */}
      {mode === 'upload' && (
        <div>
          {uploadedImagePreview ? (
            <div className="relative rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-28 h-20 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  <img
                    src={uploadedImagePreview}
                    alt="Uploaded signature"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>{uploadedFileName || "Signature photo attached"}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your signature photo is verified and will be embedded into your official Appointment Letter.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearUpload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                <X size={14} /> Remove / Replace
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#1B2A6B] bg-slate-50/60 hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-indigo-50 group-hover:bg-indigo-100 text-[#1B2A6B] flex items-center justify-center mx-auto mb-2 transition-colors">
                <Upload size={22} />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click or drag & drop to upload your signature photo
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Supports PNG, JPG, JPEG or WEBP (Max 5MB) • Sign on paper and take a clear photo
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: DRAW ON CANVAS */}
      {mode === 'draw' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
            <span>Draw with your mouse, touchpad, or finger:</span>
            <button
              type="button"
              onClick={handleClearDraw}
              disabled={!hasDrawn}
              className="inline-flex items-center gap-1 font-bold text-slate-500 hover:text-rose-600 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} /> Clear Drawing
            </button>
          </div>

          <div 
            ref={containerRef}
            className="w-full relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all overflow-hidden focus-within:border-[#1B2A6B]"
            style={{ minHeight: `${height}px` }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
              className="cursor-crosshair w-full block touch-none"
            />

            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 gap-1.5 select-none">
                <PenTool size={22} className="opacity-40" />
                <p className="text-xs font-semibold">Sign inside this box</p>
              </div>
            )}

            <div className="absolute left-8 right-8 bottom-6 border-b border-slate-200 pointer-events-none flex justify-between items-center text-[10px] text-slate-300 font-bold uppercase tracking-widest px-1 select-none">
              <span>Sign Above Line</span>
              <span>✕</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
