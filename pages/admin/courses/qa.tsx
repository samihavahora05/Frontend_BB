import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  MessageSquare, HelpCircle, CheckCircle2, Clock, AlertTriangle, MessageCircle, 
  Search, Filter, Download, MoreVertical, Eye, Reply, Pin, XCircle, 
  Trash2, ShieldAlert, FileText, ArrowUpDown, CornerDownRight, ThumbsUp, RefreshCw, X, Loader2, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CourseQAService, CourseQuestion } from '../../../src/lib/api/admin/CourseQAService';

export default function CourseQAPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  
  // Modals & Selected State
  const [selectedQAId, setSelectedQAId] = useState<number | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // Reply Form
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchQuery); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Data
  const { data: statsData, mutate: mutateStats } = CourseQAService.useStats();
  const { data: qaList, meta, isLoading, mutate: mutateList } = CourseQAService.useQuestions({
    search: debouncedSearch,
    status: activeTab,
    page: page,
    per_page: perPage
  });

  // Fetch Single Question details when selected
  const [selectedQA, setSelectedQA] = useState<CourseQuestion | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (selectedQAId && isViewDrawerOpen) {
        setIsLoadingDetails(true);
        try {
          const detail = await CourseQAService.getQuestion(selectedQAId);
          setSelectedQA(detail);
        } catch (e) {
          toast.error("Failed to load question details");
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };
    loadDetails();
  }, [selectedQAId, isViewDrawerOpen]);

  const refreshAll = () => {
    mutateList();
    mutateStats();
  };

  // Actions
  const handleTogglePin = async (id: number) => {
    try {
      await CourseQAService.togglePin(id);
      refreshAll();
      toast.success('Pin status updated');
    } catch (e) {
      toast.error('Failed to update pin');
    }
  };

  const handleToggleStatus = async (id: number, newStatus: string) => {
    try {
      await CourseQAService.updateStatus(id, newStatus);
      refreshAll();
      if (selectedQA?.id === id) {
        setSelectedQA(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
      toast.success(`Marked as ${newStatus}`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleMarkSpam = async (id: number) => {
    if (!confirm("Mark this question as spam? It will be reported and closed.")) return;
    try {
      await CourseQAService.markSpam(id);
      refreshAll();
      toast.success('Marked as spam & closed');
    } catch (e) {
      toast.error('Failed to mark as spam');
    }
  };

  const handleDelete = async () => {
    if (selectedQAId) {
      try {
        await CourseQAService.delete(selectedQAId);
        refreshAll();
        toast.success('Discussion deleted permanently');
        setIsDeleteModalOpen(false);
        setIsViewDrawerOpen(false);
        setSelectedQAId(null);
      } catch (e) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedQAId) return;

    setIsReplying(true);
    try {
      await CourseQAService.reply(selectedQAId, replyText);
      setReplyText('');
      toast.success('Reply posted successfully');
      // Reload details
      const detail = await CourseQAService.getQuestion(selectedQAId);
      setSelectedQA(detail);
      refreshAll();
    } catch (e) {
      toast.error('Failed to post reply');
    } finally {
      setIsReplying(false);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === qaList.length && qaList.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(qaList.map(q => q.id)));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} questions?`)) return;
    try {
      await CourseQAService.bulkDelete(Array.from(selectedIds));
      toast.success('Discussions deleted');
      setSelectedIds(new Set());
      refreshAll();
    } catch (e: any) {
      toast.error('Failed to delete');
    }
  };

  const handleExport = async (format: string) => {
    try {
      const toastId = toast.loading(`Preparing ${format.toUpperCase()}...`);
      const { default: api } = await import('../../../src/lib/axios');
      
      if (format === 'pdf') {
        const res = await api.get('/admin/course-qa/export?format=pdf');
        const newWin = window.open('', '_blank');
        if (newWin) {
          newWin.document.write(res.data);
          newWin.document.close();
        }
      } else {
        const res = await api.get(`/admin/course-qa/export?format=${format}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `qa_export.${format === 'excel' ? 'xlsx' : format}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
      toast.success('Download started', { id: toastId });
    } catch (e) {
      toast.error('Failed to export data');
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Course Q&A | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Course Q&A</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Manage student questions, instructor replies, and discussions.</p>
        </div>
        
        <div className="flex items-center gap-3 relative group/export">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <Download size={16} /> Export <ChevronDown size={14} className="opacity-50" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50">
            <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <FileText size={14} className="text-emerald-500" /> Export Excel
            </button>
            <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <FileText size={14} className="text-blue-500" /> Export CSV
            </button>
            <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <FileText size={14} className="text-red-500" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total" value={statsData?.total || 0} icon={MessageSquare} color="bg-blue-50 text-blue-600" />
        <StatCard title="Pending" value={statsData?.pending || 0} icon={Clock} color="bg-amber-50 text-amber-600" />
        <StatCard title="Answered" value={statsData?.answered || 0} icon={HelpCircle} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="Reported" value={statsData?.reported || 0} icon={ShieldAlert} color="bg-red-50 text-red-600" />
        <StatCard title="Resolved" value={statsData?.resolved || 0} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Active" value={statsData?.active || 0} icon={MessageCircle} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Status Tabs & Filters */}
        <div className="px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          
          <div className="flex overflow-x-auto admin-scrollbar">
            {['All', 'Pending', 'Answered', 'Resolved', 'Closed', 'Reported', 'Pinned'].map(tab => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-[#1B2A6B] text-[#1B2A6B]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 pb-4 md:pb-0">
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                <span className="text-xs font-black text-indigo-700">{selectedIds.size} Selected</span>
                <button onClick={handleBulkDelete} className="p-1 text-red-500 hover:bg-red-100 rounded" title="Delete Selected"><Trash2 size={14}/></button>
              </div>
            )}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search questions..." className="w-full md:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto admin-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" checked={selectedIds.size === qaList.length && qaList.length > 0} onChange={toggleSelectAll} className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></th>
                <th className="p-4">Question & Course</th>
                <th className="p-4">Student</th>
                <th className="p-4 text-center">Replies</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="w-4 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-48 h-4 bg-slate-200 rounded mb-2"></div><div className="w-32 h-3 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded mx-auto"></div></td>
                    <td className="p-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : qaList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4"><MessageSquare size={32}/></div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">No discussions found</h3>
                    <p className="text-sm font-medium text-slate-500">Adjust your search or filter settings.</p>
                  </td>
                </tr>
              ) : (
                qaList.map(qa => (
                  <tr key={qa.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4"><input type="checkbox" checked={selectedIds.has(qa.id)} onChange={() => toggleSelect(qa.id)} className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></td>
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        {qa.is_pinned && <Pin size={14} className="text-amber-500 mt-1 shrink-0 fill-amber-500"/>}
                        {qa.is_reported && <ShieldAlert size={14} className="text-red-500 mt-1 shrink-0"/>}
                        <div>
                          <div className="font-bold text-[#1B2A6B] line-clamp-1 max-w-[300px] mb-0.5">{qa.title}</div>
                          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{qa.course?.title || 'Unknown Course'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{qa.student?.name || 'Unknown User'}</div>
                      <div className="text-xs font-semibold text-slate-500">{qa.student?.email}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-xs ${qa.answers_count > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {qa.answers_count}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{new Date(qa.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <StatusBadge status={qa.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedQAId(qa.id); setIsViewDrawerOpen(true); }} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg tooltip" title="View"><Eye size={16}/></button>
                        <button onClick={() => { setSelectedQAId(qa.id); setIsViewDrawerOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg tooltip" title="Reply"><Reply size={16}/></button>
                        <div className="relative group/dropdown">
                          <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><MoreVertical size={16}/></button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 py-1">
                            <button onClick={() => handleTogglePin(qa.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Pin size={14}/> {qa.is_pinned ? 'Unpin' : 'Pin'}</button>
                            {qa.status !== 'Resolved' && <button onClick={() => handleToggleStatus(qa.id, 'Resolved')} className="w-full text-left px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"><CheckCircle2 size={14}/> Mark Resolved</button>}
                            {qa.status !== 'Closed' && <button onClick={() => handleToggleStatus(qa.id, 'Closed')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"><XCircle size={14}/> Close Discussion</button>}
                            {qa.status === 'Closed' && <button onClick={() => handleToggleStatus(qa.id, 'Pending')} className="w-full text-left px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2"><RefreshCw size={14}/> Reopen</button>}
                            <div className="h-px bg-slate-100 my-1"></div>
                            {!qa.is_reported && <button onClick={() => handleMarkSpam(qa.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2"><ShieldAlert size={14}/> Mark as Spam</button>}
                            <button onClick={() => { setSelectedQAId(qa.id); setIsDeleteModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14}/> Delete</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-slate-500">Showing <span className="font-bold text-slate-700">{(page-1)*perPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(page*perPage, meta.total)}</span> of <span className="font-bold text-slate-700">{meta.total}</span> entries</p>
            <div className="flex gap-1.5">
              <button disabled={page <= 1} onClick={() => setPage(page-1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Prev</button>
              <button className="px-3 py-1.5 bg-[#1B2A6B] text-white rounded-lg text-sm font-black shadow-sm">{page}</button>
              <button disabled={page >= meta.last_page} onClick={() => setPage(page+1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* View Discussion Drawer */}
      {isViewDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={() => setIsViewDrawerOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {isLoadingDetails ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-[#1B2A6B]" size={32} />
              </div>
            ) : selectedQA ? (
              <>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-800">Discussion</h2>
                    <StatusBadge status={selectedQA.status} />
                  </div>
                  <button onClick={() => setIsViewDrawerOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto bg-slate-50/50">
                  
                  {/* Original Question */}
                  <div className="p-6 bg-white border-b border-slate-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black shrink-0">
                        {selectedQA.student?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{selectedQA.student?.name || 'Unknown User'}</h3>
                        <p className="text-xs font-semibold text-slate-500">Student • {new Date(selectedQA.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-black text-[#1B2A6B] mb-2 leading-snug">{selectedQA.title}</h2>
                    <p className="text-sm font-medium text-slate-700 mb-4 whitespace-pre-wrap leading-relaxed">{selectedQA.question}</p>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                      <FileText size={14}/> {selectedQA.course?.title || 'Unknown Course'}
                    </div>
                  </div>

                  {/* Replies Timeline */}
                  <div className="p-6 space-y-6">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14}/> {selectedQA.answers?.length || 0} Replies
                    </h4>
                    
                    {selectedQA.answers?.map((reply, idx) => (
                      <div key={reply.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 text-xs ${reply.is_instructor ? 'bg-amber-100 text-amber-600' : reply.is_admin ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                            {reply.user?.name?.charAt(0) || 'U'}
                          </div>
                          {idx !== (selectedQA.answers?.length || 0) - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                        </div>
                        <div className="pb-6 w-full">
                          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative">
                            <CornerDownRight size={16} className="absolute -left-5 top-2 text-slate-300"/>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-slate-800">{reply.user?.name || 'Unknown'}</span>
                                <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${reply.is_instructor ? 'bg-amber-100 text-amber-700' : reply.is_admin ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {reply.is_admin ? 'Admin' : reply.is_instructor ? 'Instructor' : 'Student'}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-slate-400">{new Date(reply.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{reply.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reply Form */}
                {selectedQA.status !== 'Closed' ? (
                  <div className="p-6 border-t border-slate-100 bg-white">
                    <form onSubmit={handleSubmitReply}>
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Post a Reply</label>
                      <textarea 
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your response here..." 
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none mb-3" 
                      />
                      <div className="flex justify-between items-center">
                        <button type="button" className="text-xs font-bold text-slate-500 hover:text-[#1B2A6B] flex items-center gap-1"><FileText size={14}/> Attach</button>
                        <button type="submit" disabled={!replyText.trim() || isReplying} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-black rounded-xl shadow-md transition-all disabled:opacity-50">
                          {isReplying ? <Loader2 size={16} className="animate-spin" /> : <Reply size={16}/>} 
                          Send Reply
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-6 border-t border-slate-100 bg-slate-50 text-center">
                    <ShieldAlert size={24} className="mx-auto text-slate-400 mb-2"/>
                    <p className="text-sm font-bold text-slate-600">This discussion is closed.</p>
                    <button onClick={() => handleToggleStatus(selectedQA.id, 'Pending')} className="mt-2 text-xs font-black text-[#1B2A6B] hover:underline">Reopen Discussion</button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedQAId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete Discussion?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete this question and all its replies? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className="text-xl font-black text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colors = 'bg-slate-100 text-slate-600';
  
  if (status === 'Answered') {
    colors = 'bg-indigo-100 text-indigo-700';
  } else if (status === 'Pending') {
    colors = 'bg-amber-100 text-amber-700';
  } else if (status === 'Resolved') {
    colors = 'bg-emerald-100 text-emerald-700';
  } else if (status === 'Closed') {
    colors = 'bg-slate-200 text-slate-700';
  }

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${colors}`}>
      {status}
    </span>
  );
}
