import React, { useState, useRef } from 'react';
import { 
  X, Upload, FileSpreadsheet, Archive, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, RefreshCw, Download, UserPlus, UserCheck, 
  Sparkles, Image as ImageIcon, AlertCircle, Check, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpertService } from '../../lib/api/ExpertService';

interface PreviewRow {
  row_num: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  company: string;
  specialization: string;
  hourly_rate: number;
  photo_filename: string;
  photo_preview?: string | null;
  image_status: 'matched' | 'missing' | 'existing_kept' | 'none';
  password?: string;
  action: 'create' | 'update';
  status: 'valid' | 'warning' | 'error';
  issues: string[];
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExpertImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  
  // Preview Data
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [filterTab, setFilterTab] = useState<'all' | 'valid' | 'warning' | 'error'>('all');

  // Result Data
  const [resultSummary, setResultSummary] = useState<{ created: number; updated: number; skipped: number } | null>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setSelectedFile(null);
    setIsParsing(false);
    setIsImporting(false);
    setStep('upload');
    setPreviewRows([]);
    setTotalRows(0);
    setValidCount(0);
    setWarningCount(0);
    setErrorCount(0);
    setFilterTab('all');
    setResultSummary(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['zip', 'xlsx', 'xls'].includes(ext || '')) {
        toast.error('Please select a valid .zip or .xlsx file.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['zip', 'xlsx', 'xls'].includes(ext || '')) {
        toast.error('Please upload a .zip or .xlsx file.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast.loading('Downloading template...', { id: 'tmpl' });
      await ExpertService.downloadImportTemplate();
      toast.success('Template downloaded! Put photos in images/ and filenames in Excel.', { id: 'tmpl' });
    } catch {
      toast.error('Failed to download template. Please try again.', { id: 'tmpl' });
    }
  };

  const handleParseFile = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to parse.');
      return;
    }

    setIsParsing(true);
    try {
      const res = await ExpertService.previewImport(selectedFile);
      if (res.success && Array.isArray(res.data)) {
        setPreviewRows(res.data);
        setTotalRows(res.total_rows || res.data.length);
        setValidCount(res.valid_rows ?? res.data.filter((r: any) => r.status === 'valid').length);
        setWarningCount(res.warning_rows ?? res.data.filter((r: any) => r.status === 'warning').length);
        setErrorCount(res.error_rows ?? res.data.filter((r: any) => r.status === 'error').length);
        setStep('preview');
        toast.success(`Parsed ${res.data.length} expert records!`);
      } else {
        toast.error(res.message || 'Failed to parse import package.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to parse file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = async () => {
    const importableRows = previewRows.filter(r => r.status !== 'error');
    if (importableRows.length === 0) {
      toast.error('No valid rows to import.');
      return;
    }

    setIsImporting(true);
    try {
      const res = await ExpertService.confirmImport(importableRows);
      if (res.success) {
        setResultSummary({
          created: res.created_count ?? 0,
          updated: res.updated_count ?? 0,
          skipped: res.skipped_count ?? 0,
        });
        setStep('success');
        toast.success('Experts imported successfully with profile photos!');
        onSuccess();
      } else {
        toast.error(res.message || 'Import failed.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to execute import.');
    } finally {
      setIsImporting(false);
    }
  };

  const filteredPreview = previewRows.filter(row => {
    if (filterTab === 'valid') return row.status === 'valid';
    if (filterTab === 'warning') return row.status === 'warning';
    if (filterTab === 'error') return row.status === 'error';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#1B2A6B] text-white flex items-center justify-center shadow-md shadow-[#1B2A6B]/20">
              <Archive size={22} className="text-[#C9A227]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 font-sora">
                Import Experts & Profile Photos
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Upload a ZIP package with <span className="text-[#1B2A6B] font-bold">experts.xlsx</span> and <span className="text-[#1B2A6B] font-bold">images/</span> folder, or standalone XLSX.
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose} 
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-6">
              
              {/* Guidance Box */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">How ZIP Import with Images Works</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Package your <code className="px-1.5 py-0.5 bg-white rounded border border-blue-200 font-mono text-[11px] text-blue-900 font-bold">experts.xlsx</code> alongside an <code className="px-1.5 py-0.5 bg-white rounded border border-blue-200 font-mono text-[11px] text-blue-900 font-bold">images/</code> folder in a single <code className="font-bold text-blue-900">.zip</code>. The Excel row's <strong>Expert Photo</strong> column will automatically match the image in the folder!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-[#1B2A6B] hover:bg-blue-100/50 text-xs font-bold shrink-0 shadow-xs flex items-center gap-2 transition-all"
                >
                  <Download size={15} /> Download ZIP Template
                </button>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
                  selectedFile 
                    ? 'border-[#1B2A6B] bg-[#1B2A6B]/5' 
                    : 'border-slate-300 hover:border-[#1B2A6B] hover:bg-slate-50/80'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".zip,.xlsx,.xls" 
                  className="hidden" 
                />

                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C9A227] flex items-center justify-center shadow-inner">
                  {selectedFile?.name.endsWith('.zip') ? (
                    <Archive size={32} />
                  ) : (
                    <FileSpreadsheet size={32} />
                  )}
                </div>

                <div>
                  {selectedFile ? (
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#1B2A6B] text-white text-xs font-bold mb-1">
                        Selected File
                      </span>
                      <h4 className="text-base font-black text-slate-900">{selectedFile.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to choose a different file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-base font-black text-slate-800">
                        Drag & drop your <span className="text-[#1B2A6B]">experts_import.zip</span> or <span className="text-[#1B2A6B]">experts.xlsx</span> here
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">
                        Supports ZIP packages with photos (JPG, PNG, WEBP) or standalone XLSX files up to 50MB.
                      </p>
                    </div>
                  )}
                </div>

                {!selectedFile && (
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-[#1B2A6B] text-white text-xs font-bold shadow-md hover:bg-[#121c47] transition-all flex items-center gap-2"
                  >
                    <Upload size={14} /> Browse Files
                  </button>
                )}
              </div>

              {/* Supported Formats Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ImageIcon size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Actual Images</span>
                    <span className="text-slate-500 font-medium">JPG, PNG, WEBP in images/</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <UserCheck size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Smart Matching</span>
                    <span className="text-slate-500 font-medium">Updates existing, creates new</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Safe Preservation</span>
                    <span className="text-slate-500 font-medium">Existing photos kept if blank</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === 'preview' && (
            <div className="space-y-4">
              
              {/* Stats & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  <button
                    onClick={() => setFilterTab('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      filterTab === 'all'
                        ? 'bg-[#1B2A6B] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All Records ({totalRows})
                  </button>

                  <button
                    onClick={() => setFilterTab('valid')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      filterTab === 'valid'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <Check size={12} /> Valid ({validCount})
                  </button>

                  {warningCount > 0 && (
                    <button
                      onClick={() => setFilterTab('warning')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        filterTab === 'warning'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <AlertTriangle size={12} /> Missing Photos ({warningCount})
                    </button>
                  )}

                  {errorCount > 0 && (
                    <button
                      onClick={() => setFilterTab('error')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        filterTab === 'error'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <XCircle size={12} /> Errors ({errorCount})
                    </button>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-500">
                  Ready to import: <strong className="text-slate-900">{validCount + warningCount}</strong> of {totalRows}
                </div>
              </div>

              {/* Warnings explanation if any missing image */}
              {warningCount > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Notice:</strong> Some rows reference an image filename that wasn't found in the ZIP's <code className="font-bold">images/</code> folder. Those experts will still be imported, but without a new photo (or keeping their previous photo).
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs max-h-[380px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4">Photo</th>
                      <th className="py-3 px-4">Expert Name & Email</th>
                      <th className="py-3 px-4">Designation & Company</th>
                      <th className="py-3 px-4">Rate (₹/hr)</th>
                      <th className="py-3 px-4 text-center">Action</th>
                      <th className="py-3 px-4">Status & Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredPreview.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                          No records match this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPreview.map((row) => (
                        <tr key={row.row_num} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Photo Column */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {row.photo_preview ? (
                                <img 
                                  src={row.photo_preview} 
                                  alt={row.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-[10px] font-black text-slate-400 uppercase">
                                  {row.first_name ? row.first_name.slice(0, 2) : 'EXP'}
                                </div>
                              )}
                            </div>
                            {row.photo_filename && (
                              <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[80px]" title={row.photo_filename}>
                                {row.photo_filename}
                              </span>
                            )}
                          </td>

                          {/* Name & Email */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-[13px]">{row.name}</div>
                            <div className="text-slate-500 text-xs font-medium">{row.email}</div>
                            {row.phone && <div className="text-slate-400 text-[11px]">{row.phone}</div>}
                          </td>

                          {/* Designation & Company */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{row.designation}</div>
                            <div className="text-slate-500 text-xs font-medium">{row.company}</div>
                            <div className="text-slate-400 text-[11px] truncate max-w-[180px]">{row.specialization}</div>
                          </td>

                          {/* Hourly Rate */}
                          <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900">
                            ₹{row.hourly_rate}
                          </td>

                          {/* Action (Create / Update) */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {row.action === 'create' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                <UserPlus size={12} /> New
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                                <UserCheck size={12} /> Update
                              </span>
                            )}
                          </td>

                          {/* Status & Issues */}
                          <td className="py-3 px-4">
                            {row.status === 'valid' && (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                <CheckCircle2 size={14} /> Ready
                              </span>
                            )}
                            {row.status === 'warning' && (
                              <div>
                                <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                                  <AlertTriangle size={14} /> Missing Image
                                </span>
                                {row.issues.map((iss, i) => (
                                  <div key={i} className="text-[11px] text-amber-700 font-normal">
                                    {iss}
                                  </div>
                                ))}
                              </div>
                            )}
                            {row.status === 'error' && (
                              <div>
                                <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                                  <XCircle size={14} /> Error
                                </span>
                                {row.issues.map((iss, i) => (
                                  <div key={i} className="text-[11px] text-rose-700 font-normal">
                                    {iss}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && resultSummary && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={40} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 font-sora">
                  Experts & Images Imported!
                </h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  The database and profile image storage have been successfully synchronized.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-emerald-600 font-sora block">{resultSummary.created}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Created</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-blue-600 font-sora block">{resultSummary.updated}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Updated</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-slate-400 font-sora block">{resultSummary.skipped}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skipped</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {step === 'upload' && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleParseFile}
                disabled={!selectedFile || isParsing}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A6B] hover:bg-[#121c47] text-white font-black text-xs shadow-md shadow-[#1B2A6B]/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isParsing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Parsing Package...
                  </>
                ) : (
                  <>
                    Parse & Preview <ArrowRight size={14} />
                  </>
                )}
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all"
              >
                ← Back to Upload
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isImporting || (validCount + warningCount === 0)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isImporting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Importing Experts & Photos...
                  </>
                ) : (
                  <>
                    <Check size={14} /> Confirm & Import ({validCount + warningCount} Experts)
                  </>
                )}
              </button>
            </>
          )}

          {step === 'success' && (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A6B] hover:bg-[#121c47] text-white font-black text-xs shadow-md transition-all"
              >
                Done & View Experts
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
