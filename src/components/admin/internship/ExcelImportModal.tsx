import React, { useState, useRef } from 'react';
import {
  Upload, X, Check, AlertCircle, AlertTriangle, Download, 
  FileSpreadsheet, Loader2, CheckCircle2, RefreshCw, Filter, Search,
  ArrowRight, ArrowLeft, Eye, Sparkles, Building2, MapPin, Calendar, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InternshipService } from '../../../lib/api/admin/InternshipService';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedRow {
  row_number: number;
  is_valid: boolean;
  is_duplicate: boolean;
  errors: string[];
  data: {
    title: string;
    company_name?: string;
    company_logo?: string;
    thumbnail?: string;
    department?: string;
    location?: string;
    mode?: string;
    duration?: string;
    duration_months?: number;
    stipend?: number | string | null;
    openings?: number;
    skills_required?: string[];
    eligibility?: string;
    description?: string;
    responsibilities?: string;
    learning_outcomes?: string;
    application_deadline?: string;
    application_url?: string;
    status?: string;
  };
}

interface PreviewResponse {
  total_detected: number;
  valid_count: number;
  invalid_count: number;
  duplicate_count: number;
  rows: ParsedRow[];
  headers_found: string[];
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);

  // Filter & Search inside preview
  const [filterType, setFilterType] = useState<'all' | 'valid' | 'duplicate' | 'invalid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Image lightbox preview modal
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Import options
  const [importStatus, setImportStatus] = useState<'open' | 'draft'>('open');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [skipInvalid, setSkipInvalid] = useState(true);

  // Result state
  const [importResult, setImportResult] = useState<{
    imported_count: number;
    skipped_duplicates_count: number;
    failed_count: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetModal = () => {
    setStep(1);
    setSelectedFile(null);
    setIsProcessing(false);
    setPreviewData(null);
    setFilterType('all');
    setSearchTerm('');
    setImportResult(null);
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

      if (file.size > 20 * 1024 * 1024) {
        toast.error('File size exceeds maximum allowed limit of 20MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleGeneratePreview = async () => {
    if (!selectedFile) {
      toast.error('Please select an Excel or CSV file first');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await InternshipService.previewImport(selectedFile);
      if (res.success && res.data) {
        setPreviewData(res.data);
        setStep(2);
        toast.success(`Parsed ${res.data.total_detected} records with validation check`);
      } else {
        toast.error(res.message || 'Failed to parse file preview');
      }
    } catch (err: any) {
      console.error('Preview parsing failed:', err);
      toast.error(err.response?.data?.message || 'Error processing spreadsheet file. Please check column format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData) return;

    setIsProcessing(true);
    try {
      const rowsToImport = previewData.rows.filter(row => {
        if (!skipInvalid && !row.is_valid) return true;
        if (skipInvalid && !row.is_valid) return false;
        if (skipDuplicates && row.is_duplicate) return false;
        return true;
      });

      if (rowsToImport.length === 0) {
        toast.error('No eligible rows to import based on your filter settings.');
        setIsProcessing(false);
        return;
      }

      const res = await InternshipService.confirmImport({
        rows: rowsToImport.map(r => ({
          ...r.data,
          status: importStatus,
        })),
        initial_status: importStatus,
        skip_duplicates: skipDuplicates,
        skip_invalid: skipInvalid,
      });

      if (res.success) {
        setImportResult({
          imported_count: res.data?.imported_count ?? rowsToImport.length,
          skipped_duplicates_count: res.data?.skipped_duplicates_count ?? 0,
          failed_count: res.data?.failed_count ?? 0,
        });
        setStep(3);
        toast.success(res.message || 'Internships successfully imported into the database!');
        onSuccess();
      } else {
        toast.error(res.message || 'Failed to import records.');
      }
    } catch (err: any) {
      console.error('Import execution failed:', err);
      toast.error(err.response?.data?.message || 'Failed to import internships into the database.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered rows for preview table
  const filteredRows = (previewData?.rows || []).filter(row => {
    if (filterType === 'valid' && (!row.is_valid || row.is_duplicate)) return false;
    if (filterType === 'duplicate' && !row.is_duplicate) return false;
    if (filterType === 'invalid' && row.is_valid) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = row.data.title?.toLowerCase().includes(q);
      const matchCompany = row.data.company_name?.toLowerCase().includes(q);
      const matchLocation = row.data.location?.toLowerCase().includes(q);
      const matchDept = row.data.department?.toLowerCase().includes(q);
      return matchTitle || matchCompany || matchLocation || matchDept;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      
      {/* Lightbox Modal for Image Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-4" onClick={e => e.stopPropagation()}>
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

      <div className={`bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
        step === 2 ? 'max-w-5xl w-full max-h-[92vh]' : 'max-w-2xl w-full max-h-[90vh]'
      }`}>

        {/* ── Modal Header ── */}
        <div className="bg-[#0d1635] text-white p-6 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#C9A227] flex items-center gap-1.5">
              <FileSpreadsheet size={12} /> Excel & CSV Import Engine
            </span>
          </div>

          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Bulk Import Internships
          </h2>
          <p className="text-xs text-slate-300 font-semibold mt-1">
            Upload spreadsheets (.xlsx, .xls, .csv) to validate, preview, and publish internships with database integrity.
          </p>

          {/* Stepper Indicator */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#C9A227]' : 'text-emerald-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                step === 1 ? 'bg-[#C9A227] text-[#0d1635]' : 'bg-emerald-500 text-white'
              }`}>
                {step > 1 ? '✓' : '1'}
              </span>
              <span>1. File Upload</span>
            </div>

            <div className="h-0.5 flex-1 mx-3 bg-white/10">
              <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-400 w-full' : 'w-0'}`} />
            </div>

            <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#C9A227]' : step > 2 ? 'text-emerald-400' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                step === 2 ? 'bg-[#C9A227] text-[#0d1635]' : step > 2 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                {step > 2 ? '✓' : '2'}
              </span>
              <span>2. Validation & Preview</span>
            </div>

            <div className="h-0.5 flex-1 mx-3 bg-white/10">
              <div className={`h-full transition-all duration-300 ${step === 3 ? 'bg-emerald-400 w-full' : 'w-0'}`} />
            </div>

            <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-400' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                step === 3 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                3
              </span>
              <span>3. Published & Complete</span>
            </div>
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ═════════ STEP 1: FILE UPLOAD & TEMPLATE DOWNLOAD ═════════ */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Sample Template Download Notice */}
              <div className="bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-amber-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-[#0d1635] uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#C9A227]" /> Need the Official Spreadsheet Template?
                  </h4>
                  <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                    Download pre-formatted templates with Title, Company, Mode, Stipend, Duration, Skills, and Deadlines.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => InternshipService.downloadSampleCSV()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#1B2A6B] text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Download size={13} /> Sample CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => InternshipService.downloadSampleTemplate('xlsx')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Download size={13} /> Excel (.xlsx)
                  </button>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-[#1B2A6B] hover:bg-slate-50/80 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-xs ${
                  selectedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-[#1B2A6B]'
                }`}>
                  <Upload size={26} />
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-sm font-black text-emerald-800 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-600" /> {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Click or drag another file to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Click to browse or drag & drop your Excel / CSV file
                    </p>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Supports .xlsx, .xls, and .csv files up to 20MB
                    </p>
                  </div>
                )}
              </div>

              {/* Supported Columns Guide */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <span className="font-black text-slate-700 uppercase tracking-wider text-[11px] block">
                  Intelligent Header Normalization
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Our import engine automatically maps alternative header variations (e.g. <em>Job Title</em>, <em>Position</em>, <em>Role</em> → <strong>Title</strong>; <em>Company Name</em>, <em>Employer</em> → <strong>Company</strong>; <em>Salary</em>, <em>Allowance</em> → <strong>Stipend</strong>; <em>Work Mode</em>, <em>Workplace Type</em> → <strong>Mode</strong>).
                </p>
              </div>
            </div>
          )}

          {/* ═════════ STEP 2: VALIDATION SUMMARY & INTERACTIVE PREVIEW ═════════ */}
          {step === 2 && previewData && (
            <div className="space-y-4">

              {/* Counter Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider font-extrabold opacity-80 block">Total Detected</span>
                  <span className="text-2xl font-black mt-0.5 block">{previewData.total_detected}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('valid')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    filterType === 'valid'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider font-extrabold opacity-90 block">Valid Records</span>
                  <span className="text-2xl font-black mt-0.5 block">{previewData.valid_count}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('duplicate')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    filterType === 'duplicate'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                      : 'bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100/70'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider font-extrabold opacity-90 block">Duplicates</span>
                  <span className="text-2xl font-black mt-0.5 block">{previewData.duplicate_count}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('invalid')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    filterType === 'invalid'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-rose-50/70 border-rose-200 text-rose-800 hover:bg-rose-100/70'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider font-extrabold opacity-90 block">Invalid Rows</span>
                  <span className="text-2xl font-black mt-0.5 block">{previewData.invalid_count}</span>
                </button>
              </div>

              {/* Filter Controls & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search title, company, city..."
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                  />
                </div>

                {/* Import Configuration Controls */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Initial Status:</span>
                    <select
                      value={importStatus}
                      onChange={(e) => setImportStatus(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                    >
                      <option value="open">Published (Active)</option>
                      <option value="draft">Draft (Review first)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={skipDuplicates}
                      onChange={(e) => setSkipDuplicates(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#1B2A6B] focus:ring-[#1B2A6B] cursor-pointer"
                    />
                    <span>Skip Duplicates</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={skipInvalid}
                      onChange={(e) => setSkipInvalid(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#1B2A6B] focus:ring-[#1B2A6B] cursor-pointer"
                    />
                    <span>Skip Invalid Rows</span>
                  </label>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider sticky top-0 border-b border-slate-200 z-10">
                      <tr>
                        <th className="px-3 py-2.5">Row</th>
                        <th className="px-3 py-2.5 text-center">Image</th>
                        <th className="px-3 py-2.5">Internship Role</th>
                        <th className="px-3 py-2.5">Company</th>
                        <th className="px-3 py-2.5">Mode / City</th>
                        <th className="px-3 py-2.5">Duration</th>
                        <th className="px-3 py-2.5">Stipend</th>
                        <th className="px-3 py-2.5">Deadline</th>
                        <th className="px-3 py-2.5 text-right">Validation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {filteredRows.length > 0 ? (
                        filteredRows.map((row) => (
                          <tr
                            key={row.row_number}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              !row.is_valid
                                ? 'bg-rose-50/40'
                                : row.is_duplicate
                                ? 'bg-amber-50/30'
                                : ''
                            }`}
                          >
                            <td className="px-3 py-2.5 text-slate-400 font-mono text-[11px]">
                              #{row.row_number}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {row.data.thumbnail || row.data.company_logo ? (
                                <div
                                  onClick={() => setPreviewImage({ 
                                    url: (row.data.thumbnail || row.data.company_logo)!, 
                                    title: row.data.title || row.data.company_name || 'Internship Image'
                                  })}
                                  className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-xs mx-auto cursor-pointer hover:ring-2 hover:ring-[#1B2A6B] transition-all relative group"
                                  title="Click to preview image"
                                >
                                  <img 
                                    src={row.data.thumbnail || row.data.company_logo} 
                                    alt={row.data.title} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto text-[10px] font-bold">
                                  IMG
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="font-bold text-slate-900 block truncate max-w-[200px]" title={row.data.title}>
                                {row.data.title || <span className="text-rose-500 font-bold italic">[Missing Title]</span>}
                              </span>
                              {row.errors.length > 0 && (
                                <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                                  {row.errors.join('; ')}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 truncate max-w-[140px]" title={row.data.company_name}>
                              {row.data.company_name || 'Blueboxx Partner'}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="inline-block px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700 mr-1">
                                {row.data.mode || 'Remote'}
                              </span>
                              <span className="text-[11px] text-slate-500">{row.data.location || 'India'}</span>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              {row.data.duration || (row.data.duration_months ? `${row.data.duration_months} Mos` : '3 Mos')}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-emerald-700 font-bold">
                              {row.data.stipend ? `₹${Number(row.data.stipend).toLocaleString()}` : 'Performance Based'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-slate-500 text-[11px]">
                              {row.data.application_deadline || 'Open'}
                            </td>
                            <td className="px-3 py-2.5 text-right whitespace-nowrap">
                              {!row.is_valid ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase">
                                  <AlertCircle size={11} /> Invalid
                                </span>
                              ) : row.is_duplicate ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                                  <AlertTriangle size={11} /> Duplicate
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                                  <Check size={11} /> Valid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-slate-400 font-semibold text-xs">
                            No records matching current filter ({filterType}).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ═════════ STEP 3: SUCCESS & PUBLISHING COMPLETE ═════════ */}
          {step === 3 && importResult && (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Import & Publishing Complete!</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 max-w-md mx-auto">
                  Your spreadsheet records have been verified, processed, and written to the database.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2 text-xs font-semibold">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Successfully Imported:</span>
                  <span className="font-bold text-emerald-600">+{importResult.imported_count} Internships</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Initial Status:</span>
                  <span className="font-bold uppercase text-[#1B2A6B]">{importStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Skipped Duplicates:</span>
                  <span className="font-bold text-amber-600">{importResult.skipped_duplicates_count} Records</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Failed / Invalid:</span>
                  <span className="font-bold text-slate-600">{importResult.failed_count} Records</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 font-medium max-w-md mx-auto">
                🚀 <strong>Live on User Side:</strong> All published internships are immediately available on the public catalog with full search, filtering, and instant digital-signature applications.
              </div>
            </div>
          )}

        </div>

        {/* ── Modal Footer Controls ── */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedFile || isProcessing}
                onClick={handleGeneratePreview}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-xl text-xs font-extrabold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Parsing Spreadsheet...
                  </>
                ) : (
                  <>
                    Preview & Validate Records <ArrowRight size={14} />
                  </>
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} /> Back to File Upload
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmImport}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Importing to Database...
                  </>
                ) : (
                  <>
                    <Check size={14} /> Confirm & Import Valid Records
                  </>
                )}
              </button>
            </>
          )}

          {step === 3 && (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
              >
                Done & View Programs
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
