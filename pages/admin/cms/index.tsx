import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { FileText, Image as ImageIcon, Search, Filter, Edit3, Eye, MoreVertical, Layout, Type, Globe, CheckCircle2, X, Plus, Copy, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";
import { SEO } from "../../../src/components/seo/SEO";

// Mock Data for pages
const INITIAL_PAGES = [
  { id: 'home', name: 'Homepage', path: '/', type: 'Landing', status: 'Published', lastEdited: '2 hours ago', views: '24.5K' },
  { id: 'about', name: 'About Us', path: '/about', type: 'Static', status: 'Published', lastEdited: '3 days ago', views: '5.2K' },
  { id: 'courses', name: 'Courses Hub', path: '/courses', type: 'Dynamic', status: 'Draft', lastEdited: '10 mins ago', views: '-' },
  { id: 'jobs', name: 'Job Portal', path: '/jobs', type: 'Dynamic', status: 'Published', lastEdited: '1 week ago', views: '12.1K' },
  { id: 'contact', name: 'Contact Us', path: '/contact', type: 'Static', status: 'Published', lastEdited: '1 month ago', views: '1.2K' },
  { id: 'privacy', name: 'Privacy Policy', path: '/privacy-policy', type: 'Legal', status: 'Published', lastEdited: '6 months ago', views: '800' },
];

const TEMPLATES_DATA = [
  { id: 'tpl-1', name: 'Standard Landing Page', path: '/templates/landing', type: 'Landing', status: 'Template', lastEdited: '1 month ago', views: '-' },
  { id: 'tpl-2', name: 'Blog Post Layout', path: '/templates/blog', type: 'Dynamic', status: 'Template', lastEdited: '2 months ago', views: '-' },
  { id: 'tpl-3', name: 'Contact Form Page', path: '/templates/contact', type: 'Static', status: 'Template', lastEdited: '3 months ago', views: '-' },
];

export default function AdminCMSPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pages"); // 'pages' or 'templates'
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const confirmAction = useConfirm();
  
  useEffect(() => {
    const stored = localStorage.getItem('bb_cms_pages');
    if (stored) {
      setPages(JSON.parse(stored));
    } else {
      setPages(INITIAL_PAGES);
      localStorage.setItem('bb_cms_pages', JSON.stringify(INITIAL_PAGES));
    }
  }, []);

  const [templates] = useState(TEMPLATES_DATA);
  
  // New Page Modal
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
  const [newPageData, setNewPageData] = useState({ 
    name: "", 
    path: "", 
    type: "Static",
    metaTitle: "",
    metaDescription: "",
    status: "Draft"
  });

  // Dropdown for More Options
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageData.name || !newPageData.path) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newId = newPageData.name.toLowerCase().replace(/\s+/g, '-');
    const newPage = {
      id: newId,
      name: newPageData.name,
      path: newPageData.path.startsWith('/') ? newPageData.path : `/${newPageData.path}`,
      type: newPageData.type,
      status: newPageData.status,
      lastEdited: 'Just now',
      views: '-'
    };
    
    const updatedPages = [newPage, ...pages];
    setPages(updatedPages);
    localStorage.setItem('bb_cms_pages', JSON.stringify(updatedPages));
    setIsNewPageModalOpen(false);
    toast.success("Page created successfully!");
    
    // Redirect to editor (pass state via query if we want, but local mock state is fine)
    router.push(`/admin/cms/page-editor/${newId}`);
  };

  const handleDuplicate = (id: string) => {
    const pageToDuplicate = pages.find(p => p.id === id);
    if (pageToDuplicate) {
      const newPage = {
        ...pageToDuplicate,
        id: `${pageToDuplicate.id}-copy-${Date.now()}`,
        name: `${pageToDuplicate.name} (Copy)`,
        path: `${pageToDuplicate.path}-copy`,
        status: 'Draft',
        lastEdited: 'Just now',
        views: '-'
      };
      const updatedPages = [newPage, ...pages];
      setPages(updatedPages);
      localStorage.setItem('bb_cms_pages', JSON.stringify(updatedPages));
      toast.success(`Duplicated "${pageToDuplicate.name}"`);
    }
    setOpenDropdownId(null);
  };

  const handleDelete = async (id: string) => {
    if (await confirmAction({ title: "Delete Page", description: "Are you sure you want to delete this page?", isDestructive: true })) {
      const updatedPages = pages.filter(p => p.id !== id);
      setPages(updatedPages);
      localStorage.setItem('bb_cms_pages', JSON.stringify(updatedPages));
      toast.success("Page deleted successfully");
    }
    setOpenDropdownId(null);
  };

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const currentList = activeTab === "pages" ? pages : templates;
  
  const filteredPages = currentList.filter(page => 
    (page.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     page.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === "All" || page.status === statusFilter)
  );

  return (
    <AdminDashboardLayout>
      <SEO title="Content Management | Admin Dashboard | BlueBoxx DA" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Content Management</h1>
          <p className="text-slate-500 font-medium text-sm">Manage website pages, text content, and media assets.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/cms/media"
            className="px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ImageIcon size={16} className="text-[#1B2A6B]" />
            Media Library
          </Link>
          <button 
            onClick={() => setIsNewPageModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-md bg-[#1B2A6B] text-white hover:bg-[#0d1635] transition-all flex items-center gap-2"
          >
            <Layout size={16} />
            Create New Page
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab("pages")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "pages" ? "border-[#C9A227] text-[#1B2A6B]" : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          All Pages ({pages.length})
        </button>
        <button 
          onClick={() => setActiveTab("templates")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "templates" ? "border-[#C9A227] text-[#1B2A6B]" : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Page Templates ({templates.length})
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center relative">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search pages by name or type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div className="relative w-full sm:w-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Filter size={16} /> 
            {statusFilter === "All" ? "Filter by Status" : `Status: ${statusFilter}`}
          </button>
          
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10 overflow-hidden"
              >
                {["All", "Published", "Draft", "Template"].map(status => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${statusFilter === status ? 'bg-slate-50 text-[#1B2A6B]' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {status}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible w-full">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Page Name</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Path</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Last Edited</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/5 flex items-center justify-center text-[#1B2A6B] shrink-0">
                        {page.type === 'Legal' ? <FileText size={18} /> : 
                         page.type === 'Landing' ? <Globe size={18} /> : <Type size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{page.name}</p>
                        <p className="text-xs font-semibold text-slate-400">{page.type} {activeTab === 'templates' ? '' : 'Page'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded-md border border-slate-200">
                      {page.path}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${
                      page.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                      page.status === 'Template' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {page.status === 'Published' && <CheckCircle2 size={12} />}
                      {page.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-slate-600">{page.lastEdited}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button 
                        title="View Live"
                        onClick={() => window.open(page.path, '_blank')}
                        className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        title="Edit Page"
                        onClick={() => router.push(`/admin/cms/page-editor/${page.id}`)}
                        className="p-2 text-slate-400 hover:text-[#C9A227] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <div className="relative">
                        <button 
                          title="More Options"
                          onClick={(e) => toggleDropdown(e, page.id)}
                          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        <AnimatePresence>
                          {openDropdownId === page.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-200 z-50 overflow-hidden"
                            >
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDuplicate(page.id); }}
                                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Copy size={14} /> Duplicate
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(page.id); }}
                                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPages.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-slate-300 mb-3" />
                      <p>No pages found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Page Modal */}
      <AnimatePresence>
        {isNewPageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsNewPageModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden z-50 relative"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Create New Page</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Set up a new page for your website.</p>
                </div>
                <button onClick={() => setIsNewPageModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreatePage} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Services"
                    value={newPageData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/\s+/g, '-');
                      setNewPageData({...newPageData, name, path: `/${slug}`, metaTitle: `${name} | BlueBoxx`})
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page URL Path</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. /services"
                      value={newPageData.path}
                      onChange={(e) => setNewPageData({...newPageData, path: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Type</label>
                    <select 
                      value={newPageData.type}
                      onChange={(e) => setNewPageData({...newPageData, type: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                    >
                      <option value="Landing">Landing Page</option>
                      <option value="Static">Static Page</option>
                      <option value="Dynamic">Dynamic Hub</option>
                      <option value="Legal">Legal Document</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">SEO & Publishing</h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Title</label>
                      <input 
                        type="text" 
                        placeholder="Title for search engines"
                        value={newPageData.metaTitle}
                        onChange={(e) => setNewPageData({...newPageData, metaTitle: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Description</label>
                      <textarea 
                        rows={2}
                        placeholder="Brief description for search engines"
                        value={newPageData.metaDescription}
                        onChange={(e) => setNewPageData({...newPageData, metaDescription: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Status</label>
                      <select 
                        value={newPageData.status}
                        onChange={(e) => setNewPageData({...newPageData, status: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                      >
                        <option value="Draft">Draft (Hidden)</option>
                        <option value="Published">Published (Live)</option>
                        <option value="Template">Template</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                  <button 
                    type="button" 
                    onClick={() => setIsNewPageModalOpen(false)}
                    className="flex-1 px-6 py-2.5 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
                  >
                    <Plus size={16}/> Create Page
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </AdminDashboardLayout>
  );
}
