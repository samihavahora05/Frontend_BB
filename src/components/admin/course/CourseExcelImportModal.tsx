import React, { useState, useRef } from 'react';
import {
  Upload, X, Check, AlertCircle, AlertTriangle, Download, 
  FileSpreadsheet, Loader2, CheckCircle2, RefreshCw, Filter, Search,
  ArrowRight, ArrowLeft, Eye, Sparkles, BookOpen, Layers, DollarSign, Clock, ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CourseService } from '../../../lib/api/admin/CourseService';
import { getImageUrl } from '../../../lib/imageUtils';

interface CourseExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedCourseRow {
  row_number: number;
  row_status?: 'valid' | 'invalid' | 'duplicate';
  is_duplicate?: boolean;
  errors?: string[];
  title: string;
  category_name?: string;
  level_title?: string;
  instructor_name?: string;
  course_type?: 'Free' | 'Paid';
  price?: number | string | null;
  discount_price?: number | string | null;
  duration?: string;
  language?: string;
  thumbnail?: string | null;
  short_description?: string;
  description?: string;
  status?: string;
  is_featured?: boolean;
}

interface CoursePreviewResponse {
  success: boolean;
  summary: {
    total_detected: number;
    valid_count: number;
    invalid_count: number;
    duplicate_count: number;
  };
  rows: ParsedCourseRow[];
}

export const CourseExcelImportModal: React.FC<CourseExcelImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<CoursePreviewResponse | null>(null);

  // Filter & Search inside preview
  const [filterType, setFilterType] = useState<'all' | 'valid' | 'duplicate' | 'invalid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Image lightbox preview modal
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Import options
  const [importStatus, setImportStatus] = useState<'Published' | 'Draft'>('Published');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [skipInvalid, setSkipInvalid] = useState(true);

  // Result state
  const [importResult, setImportResult] = useState<{
    imported_count: number;
    skipped_count: number;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRowImageUpload = (rowNum: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (previewData && base64) {
        const newRows = [...previewData.rows];
        const targetIdx = newRows.findIndex(r => r.row_number === rowNum);
        if (targetIdx !== -1) {
          newRows[targetIdx] = { ...newRows[targetIdx], thumbnail: base64 };
          setPreviewData({ ...previewData, rows: newRows });
          toast.success(`Image attached to Row #${rowNum}!`);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const resetModal = () => {
    setStep(1);
    setSelectedFile(null);
    setIsProcessing(false);
    setPreviewData(null);
    setFilterType('all');
    setSearchTerm('');
    setImportResult(null);
    setPreviewImage(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExts = ['.xlsx', '.xls', '.csv', '.txt'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validExts.includes(fileExt)) {
        toast.error('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) spreadsheet');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validExts = ['.xlsx', '.xls', '.csv', '.txt'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validExts.includes(fileExt)) {
        toast.error('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) spreadsheet');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDownloadTemplate = async (format: 'xlsx' | 'csv') => {
    try {
      toast.loading(`Downloading course sample template (${format.toUpperCase()})...`, { id: 'template-dl' });
      await CourseService.downloadSampleTemplate(format);
      toast.success(`Course ${format.toUpperCase()} template downloaded!`, { id: 'template-dl' });
    } catch (err) {
      toast.error('Failed to download sample template.', { id: 'template-dl' });
    }
  };

  const handleUploadAndPreview = async () => {
    if (!selectedFile) {
      toast.error('Please select an Excel or CSV file first.');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await CourseService.previewImport(formData);
      if (res && res.success) {
        setPreviewData(res);
        setStep(2);
        toast.success(`Successfully scanned ${res.summary.total_detected} courses!`);
      } else {
        toast.error(res?.message || 'Failed to parse file. Please check structure.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error uploading file. Check format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData || !previewData.rows || previewData.rows.length === 0) {
      toast.error('No courses to import.');
      return;
    }

    const rowsToImport = previewData.rows.filter(row => {
      if (!skipInvalid && row.row_status === 'invalid') return true;
      if (skipInvalid && row.row_status === 'invalid') return false;
      if (skipDuplicates && (row.row_status === 'duplicate' || row.is_duplicate)) return false;
      return true;
    });

    if (rowsToImport.length === 0) {
      toast.error('No eligible courses to import based on your filter settings.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await CourseService.confirmImport({
        rows: rowsToImport,
        initial_status: importStatus,
        skip_duplicates: skipDuplicates,
        skip_invalid: skipInvalid,
      });

      if (res && res.success) {
        setImportResult({
          imported_count: res.imported_count || 0,
          skipped_count: res.skipped_count || 0,
          message: res.message || 'Course import successful!',
        });
        setStep(3);
        toast.success(`Import complete! ${res.imported_count} courses added to database.`);
        onSuccess();
      } else {
        toast.error(res?.message || 'Import failed to complete.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error processing course import transaction.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter rows for Step 2 preview
  const getFilteredRows = () => {
    if (!previewData?.rows) return [];
    return previewData.rows.filter(row => {
      // Status filter
      const matchesFilter = 
        filterType === 'all' ? true :
        filterType === 'valid' ? (row.row_status === 'valid' && !row.is_duplicate) :
        filterType === 'duplicate' ? (row.row_status === 'duplicate' || row.is_duplicate) :
        filterType === 'invalid' ? row.row_status === 'invalid' : true;

      // Search term filter
      const matchesSearch = searchTerm.trim() === '' ? true : (
        (row.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.category_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.instructor_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      return matchesFilter && matchesSearch;
    });
  };

  const filteredRows = getFilteredRows();

  const eligibleRows = (previewData?.rows || []).filter(row => {
    if (!skipInvalid && row.row_status === 'invalid') return true;
    if (skipInvalid && row.row_status === 'invalid') return false;
    if (skipDuplicates && (row.row_status === 'duplicate' || row.is_duplicate)) return false;
    return true;
  });
  const eligibleCount = eligibleRows.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      
      {/* Lightbox Modal for Image Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-bold text-sm line-clamp-1">{previewImage.title}</h4>
              <button onClick={() => setPreviewImage(null)} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center break-all">{previewImage.url}</p>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-[#1B2A6B] to-[#2a3f9d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <BookOpen size={22} className="text-[#C9A227]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                Course Excel & CSV Import Wizard
                <span className="text-[10px] bg-[#C9A227] text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Bulk Importer
                </span>
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Upload course spreadsheets, inspect image previews, validate records, and publish directly.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#1B2A6B]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
              step >= 1 ? 'bg-[#1B2A6B] text-white' : 'bg-slate-200 text-slate-600'
            }`}>1</span>
            <span>Upload Spreadsheet</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-4 max-w-[80px]"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#1B2A6B]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
              step >= 2 ? 'bg-[#1B2A6B] text-white' : 'bg-slate-200 text-slate-600'
            }`}>2</span>
            <span>Preview & Image Check</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-4 max-w-[80px]"></div>
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
              step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>3</span>
            <span>Completion Report</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">

          {/* ====================================================
              STEP 1: UPLOAD & TEMPLATE DOWNLOAD
              ==================================================== */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Template Download Prompt */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-[#1B2A6B] flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-[#C9A227]" />
                    Standard Course Import Template
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Download our structured template with predefined columns for title, category, instructor, price, thumbnail URLs, and descriptions.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-[#1B2A6B] text-xs font-extrabold rounded-xl border border-blue-200 shadow-xs transition-colors"
                  >
                    <Download size={14} /> Excel Template (.xlsx)
                  </button>
                  <button
                    onClick={() => handleDownloadTemplate('csv')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold rounded-xl border border-slate-200 shadow-xs transition-colors"
                  >
                    <Download size={14} /> CSV Template
                  </button>
                </div>
              </div>

              {/* Drag & Drop File Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-[#1B2A6B] bg-blue-50/30'
                    : 'border-slate-300 hover:border-[#1B2A6B]/60 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".xlsx,.xls,.csv,.txt"
                  className="hidden"
                />

                <div className="w-16 h-16 bg-[#1B2A6B]/10 text-[#1B2A6B] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#1B2A6B]/20">
                  <Upload size={28} />
                </div>

                {selectedFile ? (
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                      <Check size={14} /> File Selected
                    </span>
                    <h4 className="text-base font-extrabold text-slate-800">{selectedFile.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click or drop another file to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-[#0d1635]">
                      Choose an Excel or CSV file or drag it here
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
                      Supports .xlsx, .xls, .csv files up to 10MB. Columns are automatically mapped and normalized.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ====================================================
              STEP 2: PREVIEW & INTERACTIVE VALIDATION
              ==================================================== */}
          {step === 2 && previewData && (
            <div className="space-y-5">
              
              {/* Summary Metric Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div 
                  onClick={() => setFilterType('all')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    filterType === 'all'
                      ? 'bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-80">Total Detected</p>
                  <p className="text-xl font-black">{previewData.summary.total_detected}</p>
                </div>

                <div 
                  onClick={() => setFilterType('valid')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    filterType === 'valid'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-80">Ready to Import</p>
                  <p className="text-xl font-black">{previewData.summary.valid_count}</p>
                </div>

                <div 
                  onClick={() => setFilterType('duplicate')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    filterType === 'duplicate'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-80">Duplicate Matches</p>
                  <p className="text-xl font-black">{previewData.summary.duplicate_count}</p>
                </div>

                <div 
                  onClick={() => setFilterType('invalid')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    filterType === 'invalid'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-rose-50 text-rose-900 border-rose-200 hover:border-rose-300'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-80">Invalid Rows</p>
                  <p className="text-xl font-black">{previewData.summary.invalid_count}</p>
                </div>
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {(['all', 'valid', 'duplicate', 'invalid'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-colors ${
                        filterType === t
                          ? 'bg-[#1B2A6B] text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search preview records..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  />
                </div>
              </div>

              {/* Duplicate Notice Banner when all or some rows are duplicates */}
              {skipDuplicates && previewData.summary.duplicate_count > 0 && eligibleCount === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-amber-800 text-xs font-semibold">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                    <span>
                      All <strong>{previewData.summary.duplicate_count} detected courses</strong> already exist in the database. Uncheck <strong>"Skip duplicate titles"</strong> to import them anyway as new listings.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSkipDuplicates(false)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shrink-0 transition-colors shadow-xs cursor-pointer"
                  >
                    Allow Duplicates ({previewData.summary.duplicate_count})
                  </button>
                </div>
              )}

              {/* Preview Table with Image Thumbnail Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="max-h-72 overflow-y-auto admin-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                      <tr>
                        <th className="p-3 w-12 text-center">Row</th>
                        <th className="p-3 w-16 text-center">Image</th>
                        <th className="p-3">Course Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Instructor</th>
                        <th className="p-3 text-center">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Validation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold">
                            No records match the active filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 text-center font-bold text-slate-400">
                              #{row.row_number}
                            </td>
                            
                            {/* Image Thumbnail Column */}
                            <td className="p-3 text-center">
                              <div className="flex flex-col items-center justify-center gap-1">
                                {row.thumbnail ? (
                                  <div className="relative group mx-auto">
                                    <div 
                                      onClick={() => setPreviewImage({ url: getImageUrl(row.thumbnail), title: row.title })}
                                      className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-xs mx-auto cursor-pointer hover:ring-2 hover:ring-[#1B2A6B] transition-all relative"
                                      title="Click to view full image"
                                    >
                                      <img 
                                        src={getImageUrl(row.thumbnail)} 
                                        alt={row.title} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                        <Eye size={12} />
                                      </div>
                                    </div>
                                    <label className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1B2A6B] hover:bg-indigo-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-xs transition-transform hover:scale-110" title="Replace / upload image file">
                                      <Upload size={8} />
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleRowImageUpload(row.row_number, e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                ) : (
                                  <label className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-blue-50 border border-dashed border-slate-300 hover:border-[#1B2A6B] flex flex-col items-center justify-center text-slate-400 hover:text-[#1B2A6B] cursor-pointer mx-auto transition-colors" title="Click to attach an image file">
                                    <Upload size={12} />
                                    <span className="text-[8px] font-bold">Attach</span>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="hidden" 
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleRowImageUpload(row.row_number, e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </td>

                            <td className="p-3 font-extrabold text-[#1B2A6B]">
                              <div className="line-clamp-1">{row.title || <span className="text-rose-500 italic">Missing Title</span>}</div>
                              {row.level_title && (
                                <span className="text-[10px] text-slate-500 font-semibold">{row.level_title}</span>
                              )}
                            </td>
                            <td className="p-3 text-slate-600 font-semibold">
                              {row.category_name || 'General'}
                            </td>
                            <td className="p-3 text-slate-600 font-semibold">
                              {row.instructor_name || 'Expert Faculty'}
                            </td>
                            <td className="p-3 text-center font-bold">
                              {row.course_type === 'Free' ? (
                                <span className="text-emerald-600 font-extrabold">FREE</span>
                              ) : (
                                <span className="text-slate-800">₹{row.price || 0}</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded uppercase">
                                {row.status || 'Published'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {row.row_status === 'valid' && !row.is_duplicate && (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 size={12} /> Valid
                                </span>
                              )}
                              {(row.row_status === 'duplicate' || row.is_duplicate) && (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-black text-[11px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200" title="Course title exists in database">
                                  <AlertTriangle size={12} /> Duplicate
                                </span>
                              )}
                              {row.row_status === 'invalid' && (
                                <span className="inline-flex items-center gap-1 text-rose-700 font-black text-[11px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200" title={row.errors?.join(', ')}>
                                  <AlertCircle size={12} /> Invalid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import Execution Options */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Publishing Status</label>
                  <select
                    value={importStatus}
                    onChange={(e) => setImportStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Admin Review)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="courseSkipDuplicates"
                    checked={skipDuplicates}
                    onChange={(e) => setSkipDuplicates(e.target.checked)}
                    className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]"
                  />
                  <label htmlFor="courseSkipDuplicates" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Skip duplicate titles
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="courseSkipInvalid"
                    checked={skipInvalid}
                    onChange={(e) => setSkipInvalid(e.target.checked)}
                    className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]"
                  />
                  <label htmlFor="courseSkipInvalid" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Skip rows with errors
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================
              STEP 3: COMPLETION & REPORT
              ==================================================== */}
          {step === 3 && importResult && (
            <div className="py-8 text-center space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#0d1635]">Course Import Completed!</h3>
                <p className="text-xs text-slate-500 font-semibold">{importResult.message}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 gap-4 text-left">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase">Imported Courses</p>
                  <p className="text-2xl font-black text-emerald-700">{importResult.imported_count}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-600 uppercase">Skipped / Filtered</p>
                  <p className="text-2xl font-black text-slate-700">{importResult.skipped_count}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedFile || isProcessing}
                onClick={handleUploadAndPreview}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-xs font-black rounded-xl shadow-md disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isProcessing ? (
                  <><Loader2 size={15} className="animate-spin" /> Scanning File...</>
                ) : (
                  <>Scan & Preview Data <ArrowRight size={15} /></>
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Upload
              </button>
              <button
                type="button"
                disabled={isProcessing || eligibleCount === 0}
                onClick={handleConfirmImport}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black shadow-md transition-colors ${
                  eligibleCount === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                }`}
              >
                {isProcessing ? (
                  <><Loader2 size={15} className="animate-spin" /> Committing to DB...</>
                ) : eligibleCount === 0 ? (
                  <><AlertTriangle size={14} /> 0 Courses Selected (Uncheck Skip Duplicates)</>
                ) : (
                  <>Confirm & Import ({eligibleCount} {eligibleCount === 1 ? 'Course' : 'Courses'}) <Sparkles size={15} /></>
                )}
              </button>
            </>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-xs font-black rounded-xl shadow-md transition-colors"
            >
              Done & View Courses
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
