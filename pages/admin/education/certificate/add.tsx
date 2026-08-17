import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '@/layout/AdminDashboardLayout';
import { CertificateApiService } from '@/lib/api/admin/CertificateApiService';
import { 
  getImageDimensions, 
  renderCertificateToCanvas, 
  getDefaultCertificateElements,
  interpolateVariables,
  ImageDimensions, 
  CertificateElement 
} from '@/lib/certificateUtils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { 
  AlignLeft, AlignCenter, AlignRight, Move, Download, ArrowLeft, 
  Plus, Trash2, Eye, EyeOff, Type, Settings2 
} from 'lucide-react';
import Link from 'next/link';

export default function AddTemplatePage() {
  const router = useRouter();
  const { data: fonts } = CertificateApiService.useFonts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previewBoxRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [showTitle] = useState('yes');
  const [elements, setElements] = useState<CertificateElement[]>(getDefaultCertificateElements());
  const [selectedElementId, setSelectedElementId] = useState<string>('student_name');

  const selectedElement = elements.find((el) => el.id === selectedElementId) || elements[0];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackgroundFile(file);

      try {
        const dims = await getImageDimensions(file);
        setImageDimensions(dims);
      } catch (err) {
        console.error('Error reading image dimensions:', err);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Update selected element property helper
  const updateSelectedElement = (key: keyof CertificateElement, value: any) => {
    if (!selectedElementId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, [key]: value } : el))
    );
  };

  // Add new dynamic text field
  const handleAddElement = () => {
    const newId = `element_${Date.now()}`;
    const newEl: CertificateElement = {
      id: newId,
      name: `Custom Text ${elements.length + 1}`,
      content: 'Sample Text',
      positionX: 50,
      positionY: 50,
      width: 70,
      fontFamily: 'sans-serif',
      fontSize: 24,
      fontWeight: 500,
      fontStyle: 'normal',
      fontColor: '#0f172a',
      textAlignment: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      textTransform: 'none',
      enabled: true,
    };
    setElements([...elements, newEl]);
    setSelectedElementId(newId);
    toast.success('New text field added');
  };

  const handleDeleteElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (elements.length <= 1) {
      return toast.error('Template must have at least one text element');
    }
    const filtered = elements.filter((el) => el.id !== id);
    setElements(filtered);
    if (selectedElementId === id) {
      setSelectedElementId(filtered[0].id);
    }
    toast.success('Text element removed');
  };

  const handleToggleElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, enabled: !el.enabled } : el))
    );
  };

  const [previewHeight, setPreviewHeight] = useState<number>(450);

  React.useEffect(() => {
    if (previewBoxRef.current) {
      const updateHeight = () => {
        if (previewBoxRef.current && previewBoxRef.current.offsetHeight > 0) {
          setPreviewHeight(previewBoxRef.current.offsetHeight);
        }
      };
      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      observer.observe(previewBoxRef.current);
      return () => observer.disconnect();
    }
  }, [previewUrl, imageDimensions]);

  // Drag & Drop Handler for positioning selected text element on preview image
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewBoxRef.current || !selectedElementId) return;
    const rect = previewBoxRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    const posX = Math.min(100, Math.max(0, (relativeX / rect.width) * 100));
    const posY = Math.min(100, Math.max(0, (relativeY / rect.height) * 100));

    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedElementId
          ? { ...el, positionX: parseFloat(posX.toFixed(1)), positionY: parseFloat(posY.toFixed(1)) }
          : el
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownloadPreview = async () => {
    if (!previewUrl) return toast.error('Please upload a background image first');
    try {
      const canvas = document.createElement('canvas');
      await renderCertificateToCanvas(canvas, previewUrl, {
        title,
        showTitle,
        elements,
        studentName: '[Student Name]',
      });

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${title.trim() || 'Certificate'}-HD.png`;
      a.click();
      toast.success('HD Certificate preview downloaded!');
    } catch (err) {
      toast.error('Failed to generate HD certificate preview');
    }
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return toast.error('Certificate Title is required');
    }
    if (!previewUrl && !backgroundFile) {
      return toast.error('Background Image is required');
    }

    setIsSubmitting(true);
    try {
      const newTemplate = {
        id: Date.now(),
        title: trimmedTitle,
        bg_image: previewUrl,
        show_title: showTitle,
        elements,
        original_width: imageDimensions?.width || 2000,
        original_height: imageDimensions?.height || 1414,
        aspect_ratio: imageDimensions?.aspectRatio || 1.414,
        orientation: imageDimensions?.orientation || 'landscape',
        layout_settings: {
          title: trimmedTitle,
          showTitle,
          elements,
          originalWidth: imageDimensions?.width,
          originalHeight: imageDimensions?.height,
          aspectRatio: imageDimensions?.aspectRatio,
        },
        created_at: new Date().toISOString(),
      };

      // Save locally to immediate state cache
      const stored = localStorage.getItem('bb_cert_templates_v1');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newTemplate);
      localStorage.setItem('bb_cert_templates_v1', JSON.stringify(list));

      if (backgroundFile) {
        const data = new FormData();
        data.append('title', trimmedTitle);
        data.append('background_image', backgroundFile);
        data.append('layout_settings', JSON.stringify(newTemplate.layout_settings));
        await CertificateApiService.createTemplate(data);
      }

      toast.success('Multi-Element Certificate Template created successfully');
      router.push('/admin/education/certificate');
    } catch (e: any) {
      toast.error('Failed to create certificate template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Add Certificate Template | BlueBoxx DA</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/education/certificate" className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">ADD CERTIFICATE TEMPLATE</h1>
              <p className="text-xs text-slate-500 font-medium">Configure multiple dynamic text fields with independent font sizes, positions, and styling.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Form Panel */}
          <div className="lg:w-[480px] shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            {/* Background Image Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                BACKGROUND IMAGE <span className="text-rose-500">*</span> <span className="text-[10px] text-slate-400">(ANY RESOLUTION & ORIENTATION)</span>
              </label>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden mb-2">
                <input 
                  type="text" 
                  readOnly 
                  value={backgroundFile ? backgroundFile.name : ''} 
                  placeholder="BROWSE IMAGE FILE (PNG, JPG, WEBP)" 
                  className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-50 focus:outline-none" 
                />
                <label className="bg-[#C9A227] hover:bg-[#b08d22] text-slate-900 px-5 py-2.5 text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center">
                  BROWSE
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              {imageDimensions && (
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200">
                  <span>Detected: {imageDimensions.width} × {imageDimensions.height} px</span>
                  <span className="uppercase text-[#1B2A6B]">{imageDimensions.orientation} ({imageDimensions.aspectRatio.toFixed(2)}:1)</span>
                </div>
              )}
            </div>

            {/* Certificate Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                TEMPLATE TITLE <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. AI-Based Problem Solving" 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
              />
            </div>

            {/* TEXT ELEMENTS MANAGER SECTION */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Type size={15} className="text-[#C9A227]" /> TEXT ELEMENTS ({elements.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddElement}
                  className="px-3 py-1.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm"
                >
                  <Plus size={14} /> Add Text Field
                </button>
              </div>

              {/* Elements List Pills */}
              <div className="space-y-2 mb-4">
                {elements.map((el) => {
                  const isSelected = el.id === selectedElementId;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#C9A227] bg-[#C9A227]/10 text-slate-900 shadow-sm ring-1 ring-[#C9A227]' 
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`w-2 h-2 rounded-full ${el.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="truncate">{el.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold px-1.5 py-0.5 bg-slate-100 rounded">{el.fontSize}px</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleElement(el.id, e)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title={el.enabled ? 'Disable Field' : 'Enable Field'}
                        >
                          {el.enabled ? <Eye size={14} className="text-emerald-600" /> : <EyeOff size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteElement(el.id, e)}
                          className="p-1 text-slate-300 hover:text-rose-600"
                          title="Delete Field"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SELECTED ELEMENT PROPERTIES EDITOR */}
              {selectedElement && (
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                      <Settings2 size={14} className="text-[#1B2A6B]" /> EDIT: {selectedElement.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">ID: {selectedElement.id}</span>
                  </div>

                  {/* Element Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">FIELD DISPLAY NAME</label>
                    <input 
                      type="text" 
                      value={selectedElement.name} 
                      onChange={(e) => updateSelectedElement('name', e.target.value)} 
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white" 
                    />
                  </div>

                  {/* Content / Variable */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase">TEXT CONTENT / VARIABLE</label>
                    </div>
                    <input 
                      type="text" 
                      value={selectedElement.content} 
                      onChange={(e) => updateSelectedElement('content', e.target.value)} 
                      placeholder="e.g. {{student_name}}" 
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white mb-2" 
                    />

                    {/* Placeholder Helpers */}
                    <div className="flex flex-wrap gap-1">
                      {['{{student_name}}', '{{course_name}}', '{{issue_date}}', '{{verification_id}}'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => updateSelectedElement('content', v)}
                          className="px-2 py-0.5 bg-white border border-slate-200 hover:border-[#1B2A6B] text-[10px] font-bold text-slate-600 rounded transition-all"
                        >
                          + {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">FONT FAMILY</label>
                    <select 
                      value={selectedElement.fontFamily} 
                      onChange={(e) => updateSelectedElement('fontFamily', e.target.value)} 
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Playfair Display, Georgia, serif">Playfair Display (Serif)</option>
                      <option value="Cinzel, serif">Cinzel (Classic Serif)</option>
                      <option value="Great Vibes, cursive">Great Vibes (Script / Calligraphy)</option>
                      <option value="Alex Brush, cursive">Alex Brush (Script)</option>
                      <option value="Inter, sans-serif">Inter (Modern Sans)</option>
                      <option value="Montserrat, sans-serif">Montserrat (Geometric Sans)</option>
                      <option value="Poppins, sans-serif">Poppins (Sans)</option>
                      <option value="Georgia, serif">Georgia (Standard Serif)</option>
                      <option value="sans-serif">System Sans-Serif</option>
                      {fonts?.map((f: any) => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size & Weight */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">FONT SIZE (px)</label>
                      <input 
                        type="number"
                        min="8"
                        max="200" 
                        value={selectedElement.fontSize} 
                        onChange={(e) => updateSelectedElement('fontSize', parseFloat(e.target.value) || 16)} 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white" 
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">FONT WEIGHT</label>
                      <select 
                        value={selectedElement.fontWeight} 
                        onChange={(e) => updateSelectedElement('fontWeight', e.target.value)} 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white"
                      >
                        <option value="300">Light (300)</option>
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi Bold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extra Bold (800)</option>
                      </select>
                    </div>
                  </div>

                  {/* Font Style & Alignment */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">STYLE & COLOR</label>
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          onClick={() => updateSelectedElement('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold italic transition-all ${
                            selectedElement.fontStyle === 'italic' ? 'bg-[#1B2A6B] text-white border-[#1B2A6B]' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          Italic
                        </button>
                        <input 
                          type="color" 
                          value={selectedElement.fontColor} 
                          onChange={(e) => updateSelectedElement('fontColor', e.target.value)} 
                          className="w-9 h-8 cursor-pointer rounded border border-slate-200 bg-white p-0.5" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">ALIGNMENT</label>
                      <div className="flex gap-1">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateSelectedElement('textAlignment', align)}
                            className={`flex-1 py-1.5 rounded-lg border text-xs flex items-center justify-center transition-all ${
                              selectedElement.textAlignment === align ? 'bg-[#1B2A6B] text-white border-[#1B2A6B]' : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            {align === 'left' && <AlignLeft size={14} />}
                            {align === 'center' && <AlignCenter size={14} />}
                            {align === 'right' && <AlignRight size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Position X / Y */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Position X (%)</span>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        step="0.5" 
                        value={selectedElement.positionX} 
                        onChange={(e) => updateSelectedElement('positionX', parseFloat(e.target.value) || 0)} 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white" 
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Position Y (%)</span>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        step="0.5" 
                        value={selectedElement.positionY} 
                        onChange={(e) => updateSelectedElement('positionY', parseFloat(e.target.value) || 0)} 
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white" 
                      />
                    </div>
                  </div>

                  {/* Auto Fit Long Names Toggle */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input 
                        type="checkbox"
                        checked={!!selectedElement.autoFit}
                        onChange={(e) => updateSelectedElement('autoFit', e.target.checked)}
                        className="w-4 h-4 text-[#C9A227] rounded border-slate-300 focus:ring-[#C9A227]"
                      />
                      <span className="text-xs font-bold text-slate-700">Auto Fit Long Names (Auto Font Scaling)</span>
                    </label>

                    {selectedElement.autoFit && (
                      <div className="grid grid-cols-2 gap-3 pl-6">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Width (%)</span>
                          <input 
                            type="number"
                            min="10"
                            max="100"
                            value={selectedElement.width || 80}
                            onChange={(e) => updateSelectedElement('width', parseFloat(e.target.value) || 80)}
                            className="w-full px-3 py-1 border border-slate-200 rounded text-xs font-bold bg-white"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Min Font Size (px)</span>
                          <input 
                            type="number"
                            min="8"
                            max="100"
                            value={selectedElement.minFontSize || 24}
                            onChange={(e) => updateSelectedElement('minFontSize', parseFloat(e.target.value) || 24)}
                            className="w-full px-3 py-1 border border-slate-200 rounded text-xs font-bold bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            <button 
              disabled={isSubmitting} 
              onClick={handleSubmit} 
              className="w-full py-3 bg-[#1B2A6B] hover:bg-[#121c47] text-white font-extrabold rounded-xl mt-6 shadow-md transition-all uppercase tracking-wider text-xs"
            >
              {isSubmitting ? 'SAVING...' : 'SAVE TEMPLATE'}
            </button>

          </div>

          {/* Right Live Interactive Preview Panel */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">
                  LIVE INTERACTIVE PREVIEW
                </h2>
                <p className="text-xs text-slate-400 font-semibold">Click any text element to select. Drag to position. Font sizes scale independently.</p>
              </div>
              {previewUrl && (
                <button 
                  onClick={handleDownloadPreview}
                  className="px-4 py-2 bg-[#C9A227] hover:bg-[#b08d22] text-slate-900 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download size={14} /> Download HD Preview
                </button>
              )}
            </div>

            {/* Interactive Canvas Container */}
            <div className="w-full min-h-[500px] bg-slate-100/70 border border-slate-200 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden flex-1 select-none">
              {previewUrl ? (
                <div 
                  ref={previewBoxRef}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative w-full max-w-3xl bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200 group cursor-crosshair"
                  style={{
                    aspectRatio: imageDimensions ? `${imageDimensions.width} / ${imageDimensions.height}` : '1.414/1'
                  }}
                >
                  {/* Background Image */}
                  <img src={previewUrl} alt="Background" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                  
                  {/* Overlay Enabled Certificate Elements */}
                  <div className="absolute inset-0 w-full h-full">
                    {elements.map((el) => {
                      if (!el.enabled) return null;
                      const isSelected = el.id === selectedElementId;
                      const displayText = interpolateVariables(el.content, { title, studentName: '[Student Name]' });

                      return (
                        <div
                          key={el.id}
                          onMouseDown={(e) => handleMouseDown(e, el.id)}
                          className={`absolute px-2 py-0.5 cursor-grab active:cursor-grabbing font-semibold tracking-tight transition-all rounded ${
                            isSelected 
                              ? 'border-2 border-dashed border-[#C9A227] bg-[#C9A227]/20 shadow-lg ring-2 ring-[#C9A227]/40 z-20' 
                              : 'hover:border hover:border-dashed hover:border-slate-400 hover:bg-white/30 z-10'
                          }`}
                          style={{
                            left: `${el.positionX}%`,
                            top: `${el.positionY}%`,
                            transform: `translate(${el.textAlignment === 'center' ? '-50%' : el.textAlignment === 'right' ? '-100%' : '0%'}, -50%)`,
                            color: el.fontColor || '#0f172a',
                            fontFamily: el.fontFamily || 'Georgia, serif',
                            fontWeight: el.fontWeight || 500,
                            fontStyle: el.fontStyle || 'normal',
                            fontSize: `${Math.max(11, Math.round(el.fontSize * ((previewHeight || 450) / 1414)))}px`, // Proportional crisp preview font size
                            textAlign: el.textAlignment || 'center',
                            textTransform: el.textTransform || 'none',
                          }}
                        >
                          {displayText}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <Move size={36} className="mb-3 text-slate-300" />
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Upload Background Image</span>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Upload any certificate design (Landscape, Portrait, Square) to activate multi-element live preview and drag positioning.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </AdminDashboardLayout>
  );
}
