import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  FolderOpen, Image as ImageIcon, FileText, Film, Search, Upload, Filter, 
  Grid, List as ListIcon, MoreVertical, Trash2, Edit2, Move, Eye,
  ChevronRight, ArrowLeft, Download, Plus, Star, Copy, Share2, FileArchive,
  Folder, Heart, History, Clock, File, Music, HardDrive, RefreshCcw, FileDigit, ShieldAlert,
  Loader2, Maximize2, X, PlayCircle, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../src/lib/axios';

// --- Types ---
type FileType = 'image' | 'video' | 'pdf' | 'doc' | 'zip' | 'audio' | 'folder' | string;

interface MediaItem {
  id: string;
  original_name: string;
  mime_type: string;
  type: FileType; // Extracted locally based on mime
  size: number;
  url: string;
  folder_id: number | null;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

interface FolderItem {
  id: number;
  name: string;
  parent_id: number | null;
  files_count?: number;
}

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFolderId, setActiveFolderId] = useState<number | 'all' | 'trash'>('all');
  
  // Selection
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'Largest' | 'Smallest' | 'A-Z'>('Newest');

  // Modals & Panels
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  
  // Context Menu
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, itemId: string } | null>(null);

  // Upload State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = React.useCallback(async (folderId: number | 'all' | 'trash' = activeFolderId) => {
    setIsLoading(true);
    try {
      const url = folderId === 'trash'
        ? '/admin/media/trash'
        : (folderId === 'all' 
            ? '/admin/media/files' 
            : `/admin/media/files?folder_id=${folderId}`);

      const [filesRes, foldersRes, statsRes] = await Promise.all([
        api.get(url),
        api.get('/admin/media/folders'),
        api.get('/admin/media/statistics')
      ]);

      // Backend returns: { success, data: [...] }
      const rawFiles = filesRes.data?.data || [];
      const safeItems = (Array.isArray(rawFiles) ? rawFiles : []).map((item: any) => ({
        ...item,
        // url is now returned by the backend; fallback just in case
        url: item.url || `${process.env.NEXT_PUBLIC_API_URL?.replace('/api','') ?? 'https://backend.blueboxx.in'}/storage/${item.path}`,
        size_bytes: item.size_bytes ?? item.size ?? 0,
      }));
      setItems(safeItems);
      
      setFolders(foldersRes.data?.data || []);
      setStats(statsRes.data?.data || {});
    } catch (error) {
      console.error(error);
      toast.error('Failed to load media.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFolderId]);

  useEffect(() => {
    fetchMedia(activeFolderId);
  }, [activeFolderId, fetchMedia]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const getSimplifiedType = (mime: string): FileType => {
    if (!mime) return 'doc';
    if (mime.includes('image')) return 'image';
    if (mime.includes('video')) return 'video';
    if (mime.includes('audio')) return 'audio';
    if (mime.includes('pdf')) return 'pdf';
    if (mime.includes('zip') || mime.includes('compressed')) return 'zip';
    return 'doc';
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- Computed ---
  let filteredItems = items.filter(item => {
    const type = getSimplifiedType(item.mime_type);
    
    if (filterType !== 'all' && type !== filterType) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.original_name.toLowerCase().includes(q)) return false;
    }
    
    return true;
  });

  filteredItems.sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'Oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'Largest') return b.size - a.size;
    if (sortBy === 'Smallest') return a.size - b.size;
    if (sortBy === 'A-Z') return a.original_name.localeCompare(b.original_name);
    return 0;
  });

  const totalFiles = stats?.total_files || items.length;
  const imageCount = stats?.types?.image || items.filter(i => getSimplifiedType(i.mime_type)==='image').length;
  const videoCount = stats?.types?.video || items.filter(i => getSimplifiedType(i.mime_type)==='video').length;
  const docCount = stats?.types?.document || items.filter(i => getSimplifiedType(i.mime_type)==='pdf' || getSimplifiedType(i.mime_type)==='doc').length;
  const usedGB = ((stats?.total_size_bytes || 0) / (1024 * 1024 * 1024)).toFixed(2);
  const totalGB = 100;
  const storagePercent = (parseFloat(usedGB) / totalGB) * 100;

  // --- Actions ---
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, itemId: id });
  };

  const executeAction = async (action: string, itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if(!item) return;
    setContextMenu(null);

    if (action === 'Preview') {
      setPreviewItem(item);
      setIsPreviewOpen(true);
    } else if (action === 'Rename') {
      const newName = prompt('Enter new name:', item.original_name);
      if (newName && newName !== item.original_name) {
        try {
          await api.put(`/admin/media/files/${itemId}`, { original_name: newName });
          setItems(items.map(i => i.id === itemId ? { ...i, original_name: newName } : i));
          toast.success('File renamed');
        } catch(e) {
          toast.error('Failed to rename file');
        }
      }
    } else if (action === 'Delete') {
      if (confirm('Move to trash?')) {
        try {
          await api.delete(`/admin/media/files/${itemId}`);
          setItems(items.filter(i => i.id !== itemId));
          toast.success('Moved to trash');
        } catch(e) {
          toast.error('Failed to delete file');
        }
      }
    } else if (action === 'Restore') {
      try {
        await api.post(`/admin/media/files/${itemId}/restore`);
        setItems(items.filter(i => i.id !== itemId));
        toast.success('File restored');
      } catch(e) {
        toast.error('Failed to restore file');
      }
    } else if (action === 'PermanentDelete') {
      if (confirm('Permanently delete this file? This cannot be undone.')) {
        try {
          await api.delete(`/admin/media/files/${itemId}/force`);
          setItems(items.filter(i => i.id !== itemId));
          toast.success('File permanently deleted');
        } catch(e) {
          toast.error('Failed to delete file');
        }
      }
    } else if (action === 'CopyLink') {
      navigator.clipboard.writeText(item.url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    if (activeFolderId !== 'all' && activeFolderId !== 'trash') {
      formData.append('folder_id', String(activeFolderId));
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await api.post('/admin/media/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      toast.success('Upload complete');
      setIsUploadOpen(false);
      fetchMedia(); // Refresh list to get real URL and ID
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('New Folder Name:');
    if (!name) return;
    try {
      const res = await api.post('/admin/media/folders', {
        name,
        parent_id: activeFolderId === 'all' ? null : activeFolderId
      });
      setFolders([...folders, res.data.data]);
      toast.success('Folder created');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleDeleteFolder = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this folder?')) return;
    try {
      await api.delete(`/admin/media/folders/${id}`);
      setFolders(folders.filter(f => f.id !== id));
      if (activeFolderId === id) setActiveFolderId('all');
      toast.success('Folder deleted');
    } catch (e: any) {
      toast.error('Failed to delete folder');
    }
  };

  const bulkDelete = async () => {
    if(!confirm(`Delete ${selectedItems.size} files?`)) return;
    toast.loading('Deleting...', { id: 'bulk' });
    try {
      await Promise.all(Array.from(selectedItems).map(id => api.delete(`/admin/media/files/${id}`)));
      setItems(items.filter(i => !selectedItems.has(i.id)));
      setSelectedItems(new Set());
      toast.success('Files deleted', { id: 'bulk' });
    } catch(e) {
      toast.error('Some files failed to delete', { id: 'bulk' });
    }
  };

  // --- UI Helpers ---
  const getFileIcon = (type: string, size = 32) => {
    switch(type) {
      case 'folder': return <Folder className="text-blue-500 fill-blue-500/20" size={size} />;
      case 'image': return <ImageIcon className="text-pink-500" size={size} />;
      case 'video': return <Film className="text-purple-500" size={size} />;
      case 'audio': return <Music className="text-indigo-500" size={size} />;
      case 'pdf': return <FileText className="text-red-500" size={size} />;
      case 'doc': return <File className="text-blue-600" size={size} />;
      case 'zip': return <FileArchive className="text-yellow-600" size={size} />;
      default: return <FileText className="text-gray-500" size={size} />;
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Digital Asset Management | BlueBoxx DA</title>
      </Head>

      <div className="h-[calc(100vh-8rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8 bg-gray-50">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4 z-20 shadow-sm relative">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <FolderOpen size={28} className="text-[#C9A227]"/>
              Media Manager
            </h1>
            <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage all website assets from one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleCreateFolder} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-lg transition-colors">
              <Folder size={16}/> New Folder
            </button>
            <button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white font-bold text-sm rounded-lg shadow-md transition-colors">
              <Upload size={16}/> Upload Files
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-white border-b border-gray-200 p-4 shrink-0 flex gap-4 overflow-x-auto admin-scrollbar">
          {[
            { label: 'Total Files', value: totalFiles, icon: FileDigit, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Images', value: imageCount, icon: ImageIcon, color: 'text-pink-500', bg: 'bg-pink-50' },
            { label: 'Videos', value: videoCount, icon: Film, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'Documents', value: docCount, icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Storage Used', value: `${usedGB} GB`, icon: HardDrive, color: 'text-[#C9A227]', bg: 'bg-[#C9A227]/10' },
            { label: 'Storage Remaining', value: `${Math.max(0, totalGB - parseFloat(usedGB)).toFixed(2)} GB`, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map((card, idx) => (
            <div key={idx} className="flex-1 min-w-[160px] flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}>
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-xl font-black text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Panel - Folders */}
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
            <div className="flex-1 overflow-y-auto admin-scrollbar p-4 space-y-6">
              
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">My Drive</h3>
                <div className="space-y-0.5">
                  <button onClick={() => setActiveFolderId('all')} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${activeFolderId === 'all' ? 'bg-[#1B2A6B]/10 text-[#1B2A6B]' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <HardDrive size={18} className={activeFolderId === 'all' ? 'text-[#1B2A6B]' : 'text-gray-400'}/>
                      All Files
                    </div>
                  </button>
                  <button onClick={() => setActiveFolderId('trash')} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${activeFolderId === 'trash' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <Trash2 size={18} className={activeFolderId === 'trash' ? 'text-red-500' : 'text-gray-400'}/>
                      Trash
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Folders</h3>
                <div className="space-y-0.5">
                  {folders.length === 0 && <p className="px-3 text-xs text-gray-400">No folders yet</p>}
                  {folders.map((f) => {
                    return (
                      <div key={f.id} className={`group w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeFolderId === f.id ? 'bg-[#1B2A6B]/10 text-[#1B2A6B]' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <button onClick={() => setActiveFolderId(f.id)} className="flex items-center gap-3 truncate flex-1 text-left py-0.5">
                          <span className={activeFolderId === f.id ? 'text-[#1B2A6B]' : 'text-blue-300'}><Folder size={18} className="fill-current opacity-20"/></span>
                          <span className="truncate">{f.name}</span>
                        </button>
                        <button onClick={(e) => handleDeleteFolder(f.id, e)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded transition-all" title="Delete Folder">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Center Content Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
            
            {/* Toolbar */}
            <div className="px-6 py-3 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
              
              <div className="flex items-center gap-3 flex-1 min-w-[250px]">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedItems.size > 0 && (
                  <div className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-right-4">
                    <span className="text-xs font-bold text-[#1B2A6B] bg-[#1B2A6B]/10 px-2 py-1 rounded">{selectedItems.size} selected</span>
                    <button onClick={bulkDelete} className="p-1.5 text-red-600 hover:bg-red-50 rounded tooltip" title="Bulk Delete"><Trash2 size={16}/></button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  </div>
                )}

                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="py-2 px-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none">
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="pdf">PDFs</option>
                  <option value="zip">ZIP Archives</option>
                </select>

                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="py-2 px-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none">
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                  <option value="Largest">Largest Size</option>
                  <option value="Smallest">Smallest Size</option>
                  <option value="A-Z">Name A-Z</option>
                </select>

                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 ml-2">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1B2A6B]' : 'text-gray-500 hover:text-gray-800'}`}>
                    <Grid size={16}/>
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1B2A6B]' : 'text-gray-500 hover:text-gray-800'}`}>
                    <ListIcon size={16}/>
                  </button>
                </div>
              </div>

            </div>

            {/* Files Area */}
            <div className="flex-1 overflow-y-auto p-6 admin-scrollbar relative">
              
              {isLoading ? (
                // Skeleton Loader
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="h-32 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                // Empty State
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6 relative">
                    <div className="absolute inset-0 bg-[#C9A227]/10 rounded-full animate-ping opacity-75"></div>
                    <FolderOpen size={64} className="text-[#C9A227] relative z-10" />
                  </div>
                  <h2 className="text-2xl font-black text-[#0d1635] mb-2">No media found</h2>
                  <p className="text-gray-500 font-medium mb-8 max-w-sm">There are no files in this folder matching your criteria.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setIsUploadOpen(true)} className="px-6 py-3 bg-[#1B2A6B] hover:bg-[#121c47] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                      <Upload size={18}/> Upload Files
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-max pb-20">
                      {filteredItems.map(item => {
                        const type = getSimplifiedType(item.mime_type);
                        return (
                        <div 
                          key={item.id}
                          onClick={() => handleToggleSelect(item.id, { stopPropagation: () => {} } as any)}
                          onContextMenu={(e) => handleContextMenu(e, item.id)}
                          className={`group relative bg-white rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm hover:shadow-xl ${selectedItems.has(item.id) ? 'border-[#1B2A6B] ring-4 ring-[#1B2A6B]/10 scale-[0.98]' : 'border-gray-100 hover:border-[#C9A227]/50 hover:-translate-y-1'}`}
                        >
                          <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <input 
                              type="checkbox" 
                              checked={selectedItems.has(item.id)}
                              onChange={(e) => handleToggleSelect(item.id, e as any)}
                              onClick={e => e.stopPropagation()}
                              className="w-5 h-5 text-[#1B2A6B] border-white rounded shadow focus:ring-[#1B2A6B] cursor-pointer ring-1 ring-black/10"
                            />
                          </div>
                          
                          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                            <button onClick={(e) => handleContextMenu(e, item.id)} className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#1B2A6B] transition-colors">
                              <MoreVertical size={16}/>
                            </button>
                          </div>

                          <div className="h-40 bg-gray-50 flex items-center justify-center relative overflow-hidden border-b border-gray-100 group-hover:bg-gray-100 transition-colors">
                            {type === 'image' && item.url ? (
                              <>
                                <img src={item.url} alt={item.original_name} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                                <div className="hidden transform group-hover:scale-110 transition-transform duration-300">
                                  {getFileIcon(type, 56)}
                                </div>
                              </>
                            ) : (
                              <div className="transform group-hover:scale-110 transition-transform duration-300">
                                {getFileIcon(type, 56)}
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4 bg-white">
                            <div className="flex items-center gap-2 mb-1.5">
                              {getFileIcon(type, 14)}
                              <p className="text-sm font-bold text-gray-800 truncate" title={item.original_name}>{item.original_name}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">{formatSize(item.size_bytes)}</p>
                              <p className="text-[11px] font-bold text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      )})}
                    </div>
                  ) : (
                    // List View
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                          <tr>
                            <th className="w-12 px-6 py-4"></th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">File Name</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Size</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Modified</th>
                            <th className="px-6 py-4 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredItems.map(item => {
                            const type = getSimplifiedType(item.mime_type);
                            return (
                            <tr 
                              key={item.id}
                              onClick={() => handleToggleSelect(item.id, { stopPropagation: () => {} } as any)}
                              onContextMenu={(e) => handleContextMenu(e, item.id)}
                              className={`hover:bg-gray-50 transition-colors cursor-pointer group ${selectedItems.has(item.id) ? 'bg-[#1B2A6B]/5' : ''}`}
                            >
                              <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  checked={selectedItems.has(item.id)}
                                  onChange={(e) => handleToggleSelect(item.id, e as any)}
                                  className="rounded text-[#1B2A6B] border-gray-300 cursor-pointer"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {item.url && type === 'image' ? (
                                    <>
                                      <img src={item.url} alt={item.original_name} className="w-8 h-8 rounded object-cover shadow-sm" 
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                      <div className="hidden w-8 h-8 bg-gray-100 rounded flex items-center justify-center">{getFileIcon(type, 16)}</div>
                                    </>
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">{getFileIcon(type, 16)}</div>
                                  )}
                                  <span className="font-bold text-sm text-gray-800">{item.original_name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">{type}</td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-600">{formatSize(item.size_bytes ?? item.size ?? 0)}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-500">{new Date(item.updated_at).toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={(e) => handleContextMenu(e, item.id)} className="p-2 text-gray-400 hover:text-[#1B2A6B] hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                  <MoreVertical size={16}/>
                                </button>
                              </td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* --- Context Menu Overlay --- */}
      {contextMenu && (
        <div 
          className="fixed z-50 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl py-2 w-56 animate-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest truncate">{items.find(i=>i.id === contextMenu.itemId)?.original_name}</p>
          </div>
          {activeFolderId === 'trash' ? (
            <>
              <button onClick={() => executeAction('Restore', contextMenu.itemId)} className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-emerald-600 flex items-center gap-3">Restore</button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button onClick={() => executeAction('PermanentDelete', contextMenu.itemId)} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3"><Trash2 size={16}/> Delete Permanently</button>
            </>
          ) : (
            <>
              <button onClick={() => executeAction('Preview', contextMenu.itemId)} className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-[#1B2A6B] flex items-center gap-3"><Eye size={16}/> Preview / Copy Link</button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button onClick={() => executeAction('Rename', contextMenu.itemId)} className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-indigo-600 flex items-center gap-3"><Edit2 size={16}/> Rename</button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button onClick={() => executeAction('Delete', contextMenu.itemId)} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3"><Trash2 size={16}/> Move to Trash</button>
            </>
          )}
        </div>
      )}

      {/* --- Modern Drag & Drop Uploader Modal --- */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-black text-[#0d1635]">Upload Files</h2>
              <button onClick={() => !isUploading && setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-700 disabled:opacity-50" disabled={isUploading}><X size={24}/></button>
            </div>
            
            <div className="p-8">
              {!isUploading ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-12 text-center hover:bg-[#1B2A6B]/5 hover:border-[#1B2A6B]/40 transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Upload size={32} className="text-[#C9A227]" />
                  </div>
                  <h3 className="text-lg font-black text-gray-800 mb-2">Click or drag files to upload</h3>
                  <p className="text-sm font-semibold text-gray-500">Supports JPG, PNG, MP4, PDF, ZIP (Max 100MB)</p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Loader2 size={16} className="animate-spin text-[#1B2A6B]"/> Uploading...</span>
                    <span className="text-sm font-black text-[#1B2A6B]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-[#1B2A6B] to-[#2a40a3] h-full rounded-full transition-all duration-300 relative" style={{ width: `${uploadProgress}%` }}>
                       <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Premium Preview Modal --- */}
      {isPreviewOpen && previewItem && (() => {
        const type = getSimplifiedType(previewItem.mime_type);
        return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/95 backdrop-blur-lg p-4 lg:p-8">
          
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
             <div className="flex items-center gap-4 text-white">
               {getFileIcon(type, 24)}
               <div>
                 <h3 className="font-bold text-lg drop-shadow-md">{previewItem.original_name}</h3>
                 <p className="text-xs font-semibold text-white/70">{formatSize(previewItem.size)} • {new Date(previewItem.created_at).toLocaleString()}</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <button onClick={() => executeAction('CopyLink', previewItem.id)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors tooltip" title="Copy Link"><Copy size={20}/></button>
               <a href={previewItem.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors tooltip" title="Download"><Download size={20}/></a>
               <div className="w-px h-6 bg-white/20 mx-2"></div>
               <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors shadow-lg"><X size={24}/></button>
             </div>
          </div>
          
          <div className="flex-1 w-full h-full flex items-center justify-center mt-12 animate-in zoom-in-95 duration-200">
            {type === 'image' && previewItem.url ? (
              <img src={previewItem.url} alt={previewItem.original_name} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10" />
            ) : type === 'video' ? (
              <video src={previewItem.url} controls className="w-full max-w-4xl max-h-[85vh] bg-black rounded-xl shadow-2xl ring-1 ring-white/10" />
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-12 text-center text-white backdrop-blur-md shadow-2xl max-w-md w-full">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-white/10">
                  {getFileIcon(type, 64)}
                </div>
                <h2 className="text-2xl font-black mb-2">{previewItem.original_name}</h2>
                <p className="text-white/60 font-semibold mb-8">Preview not natively embedded in browser.</p>
                <a href={previewItem.url} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <Download size={18}/> Open / Download File
                </a>
              </div>
            )}
          </div>
          
        </div>
      );})()}

    </AdminDashboardLayout>
  );
}
