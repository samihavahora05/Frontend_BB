import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { UploadCloud, Image as ImageIcon, Search, Filter, Trash2, CheckCircle2, Download, ExternalLink, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";

interface MediaItem {
  id: string;
  name: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
  date?: string;
  url: string;
  type: string;
}

export default function AdminMediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const confirmAction = useConfirm();

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (res.ok) {
        setMediaItems(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load media files.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredItems = mediaItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (await confirmAction({ title: "Delete Multiple Items", description: `Are you sure you want to delete ${selectedItems.length} items permanently?`, isDestructive: true })) {
      const toastId = toast.loading(`Deleting ${selectedItems.length} files...`);
      let successCount = 0;
      for (const id of selectedItems) {
        try {
          const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
          if (res.ok) successCount++;
        } catch (error) {
          console.error(error);
        }
      }
      toast.success(`Successfully deleted ${successCount} files`, { id: toastId });
      setSelectedItems([]);
      fetchMedia();
    }
  };

  const handleSingleDelete = async (id: string) => {
    if (await confirmAction({ title: "Delete File", description: "Are you sure you want to delete this file permanently?", isDestructive: true })) {
      const toastId = toast.loading("Deleting file...");
      try {
        const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success("File deleted successfully", { id: toastId });
          setPreviewImage(null);
          setSelectedItems(selectedItems.filter(selectedId => selectedId !== id));
          fetchMedia();
        } else {
          toast.error("Failed to delete file", { id: toastId });
        }
      } catch (error) {
        toast.error("Error deleting file", { id: toastId });
      }
    }
  };

  const processUploadFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result;
        if (typeof base64Data !== 'string') return;
  
        setIsUploading(true);
        setUploadProgress(50);
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
  
          if (res.ok) {
            toast.success(`${file.name} uploaded!`, { id: loadingToast });
            fetchMedia();
          } else {
            toast.error(`Failed to upload ${file.name}`, { id: loadingToast });
          }
        } catch (err) {
          console.error(err);
          toast.error("Network error during upload", { id: loadingToast });
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
            <Link href="/admin/cms" className="hover:text-[#1B2A6B] transition-colors">CMS</Link>
            <span>/</span>
            <span className="text-[#1B2A6B]">Media Library</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Media Library</h1>
          <p className="text-slate-500 font-medium text-sm">Upload and manage all images, videos, and documents.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) processUploadFiles(e.target.files);
            }}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-md bg-[#1B2A6B] text-white hover:bg-[#0d1635] transition-all flex items-center gap-2"
          >
            <UploadCloud size={16} />
            Upload New File
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        className="w-full bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 mb-8 text-center hover:bg-slate-50 hover:border-[#C9A227] transition-all cursor-pointer relative overflow-hidden group"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
              <div className="bg-[#1B2A6B] h-2.5 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-sm font-bold text-slate-700">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud size={32} />
            </div>
            <p className="text-lg font-bold text-slate-800 mb-1">Click or drag & drop files here</p>
            <p className="text-sm font-medium text-slate-500">Supports JPG, PNG, GIF, SVG, and WEBP (Max 5MB)</p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={handleSelectAll}
            className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center hover:border-[#1B2A6B] transition-colors"
          >
            {selectedItems.length > 0 && selectedItems.length === filteredItems.length && <CheckCircle2 size={14} className="text-[#1B2A6B]" />}
            {selectedItems.length > 0 && selectedItems.length !== filteredItems.length && <div className="w-2.5 h-2.5 bg-[#1B2A6B] rounded-sm" />}
          </button>
          <span className="text-sm font-bold text-slate-600">{selectedItems.length} selected</span>
          
          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-b-2xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-bold">No media files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedItems.includes(item.id) ? 'border-[#1B2A6B] shadow-md scale-[0.98]' : 'border-slate-100 hover:border-slate-300'
                }`}
                onClick={() => handleSelect(item.id)}
              >
                {/* Selection Check */}
                <div className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  selectedItems.includes(item.id) ? 'bg-[#1B2A6B] border-none text-white' : 'bg-white border border-slate-400 opacity-0 group-hover:opacity-100'
                }`}>
                  {selectedItems.includes(item.id) && <CheckCircle2 size={14} />}
                </div>

                {/* Quick Actions (Preview) */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPreviewImage(item); }}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-[#1B2A6B] transition-colors"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>

                <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs font-bold text-slate-800 truncate mb-1" title={item.name}>{item.name}</p>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                    <span>{item.size}</span>
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
              onClick={() => setPreviewImage(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row w-full max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/10 hover:bg-black/20 text-white rounded-full flex items-center justify-center transition-colors md:text-slate-500 md:bg-slate-100 md:hover:bg-slate-200"
              >
                <X size={18} />
              </button>
              
              <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 relative min-h-[300px] md:min-h-[500px]">
                <img src={previewImage.url} alt={previewImage.name} className="max-w-full max-h-full object-contain drop-shadow-xl" />
              </div>
              
              <div className="w-full md:w-80 bg-white p-6 border-l border-slate-200 overflow-y-auto">
                <h3 className="text-lg font-black text-slate-800 mb-6">File Details</h3>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">File Name</p>
                    <p className="text-sm font-semibold text-slate-800 break-all">{previewImage.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">File Type</p>
                    <p className="text-sm font-semibold text-slate-800">{previewImage.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Uploaded On</p>
                    <p className="text-sm font-semibold text-slate-800">{previewImage.uploadedAt || previewImage.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">File Size</p>
                    <p className="text-sm font-semibold text-slate-800">{previewImage.size}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a href={previewImage.url} download={previewImage.name} target="_blank" rel="noreferrer" className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> Download / Open
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(previewImage.url);
                      const btn = document.getElementById('copy-url-btn');
                      if(btn) {
                        const originalHtml = btn.innerHTML;
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Copied!';
                        btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
                        btn.classList.remove('bg-[#1B2A6B]', 'hover:bg-[#0d1635]');
                        setTimeout(() => {
                          btn.innerHTML = originalHtml;
                          btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
                          btn.classList.add('bg-[#1B2A6B]', 'hover:bg-[#0d1635]');
                        }, 2000);
                      }
                    }}
                    id="copy-url-btn"
                    className="w-full py-2.5 bg-[#1B2A6B] text-white rounded-xl text-sm font-bold hover:bg-[#0d1635] transition-colors flex items-center justify-center gap-2"
                  >
                    Copy Public URL
                  </button>
                  <button 
                    onClick={() => handleSingleDelete(previewImage.id)}
                    className="w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <Trash2 size={16} /> Delete Permanently
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminDashboardLayout>
  );
}
