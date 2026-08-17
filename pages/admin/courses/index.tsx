import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { CourseService, Course } from '../../../src/lib/api/admin/CourseService';
import { Plus, ListTree, Search, Filter, Download, MoreVertical, Edit, Trash2, Copy, Archive, CheckCircle, XCircle, Globe, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CourseCategoryService } from '../../../src/lib/api/admin/CourseCategoryService';

export default function CourseList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchQuery); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const getImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${path}`;
  };

  const { data: categories } = CourseCategoryService.useCategories();
  const { data: courses, meta, isLoading, mutate } = CourseService.useCourses({
    search: debouncedSearch,
    status: activeTab === 'All' ? undefined : activeTab,
    category_id: categoryFilter ? Number(categoryFilter) : undefined,
    page,
    per_page: perPage
  });

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === courses.length && courses.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(courses.map(c => c.id)));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await CourseService.delete(id);
      toast.success('Course deleted');
      mutate();
    } catch (e) {
      toast.error('Failed to delete course');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} courses?`)) return;
    try {
      await CourseService.bulkDelete(Array.from(selectedIds));
      toast.success('Courses deleted');
      setSelectedIds(new Set());
      mutate();
    } catch (e) {
      toast.error('Failed to bulk delete');
    }
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.size === 0) return;
    try {
      await CourseService.bulkStatus(Array.from(selectedIds), status);
      toast.success(`Courses marked as ${status}`);
      setSelectedIds(new Set());
      mutate();
    } catch (e) {
      toast.error('Failed to update statuses');
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      toast.loading('Duplicating...', { id: 'dup' });
      await CourseService.duplicate(id);
      toast.success('Course duplicated', { id: 'dup' });
      mutate();
    } catch (e) {
      toast.error('Failed to duplicate', { id: 'dup' });
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await CourseService.updateStatus(id, status);
      toast.success(`Course marked as ${status}`);
      mutate();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await CourseService.toggleArchive(id);
      toast.success('Archive status updated');
      mutate();
    } catch (e) {
      toast.error('Failed to update archive status');
    }
  };

  const handleExport = async (format: string) => {
    try {
      const toastId = toast.loading(`Preparing ${format.toUpperCase()}...`);
      const { default: api } = await import('../../../src/lib/axios');
      
      if (format === 'pdf') {
        const res = await api.get('/admin/courses/export?format=pdf');
        const newWin = window.open('', '_blank');
        if (newWin) {
          newWin.document.write(res.data);
          newWin.document.close();
        }
      } else {
        const res = await api.get(`/admin/courses/export?format=${format}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `courses.${format === 'excel' ? 'xlsx' : format}`);
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
        <title>Courses | Admin Panel</title>
      </Head>
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635]">Course Management</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage courses, publish content, and track performance.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative group/export">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
                <Download size={16} /> Export
              </button>
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-10 py-1">
                <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">CSV</button>
                <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Excel</button>
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">PDF</button>
              </div>
            </div>
            <button 
              onClick={() => router.push('/admin/courses/add')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-black rounded-xl shadow-md transition-colors"
            >
              <Plus size={18} /> Create Course
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Tabs & Filters */}
          <div className="px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
            <div className="flex overflow-x-auto admin-scrollbar">
              {['All', 'Published', 'Draft', 'Pending Approval', 'Private', 'Featured', 'Archived'].map(tab => (
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
                  <div className="h-4 w-px bg-indigo-200 mx-1"></div>
                  <button onClick={() => handleBulkStatus('Published')} className="text-xs font-bold text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded">Publish</button>
                  <button onClick={() => handleBulkStatus('Draft')} className="text-xs font-bold text-amber-600 hover:bg-amber-100 px-2 py-1 rounded">Draft</button>
                  <button onClick={handleBulkDelete} className="p-1 text-red-500 hover:bg-red-100 rounded" title="Delete Selected"><Trash2 size={14}/></button>
                </div>
              )}
              <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                <option value="">All Categories</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search courses..." className="w-full md:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto admin-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-12"><input type="checkbox" checked={selectedIds.size === courses.length && courses.length > 0} onChange={toggleSelectAll} className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4 text-center">Type / Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Curriculum</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4"><div className="w-4 h-4 bg-slate-200 rounded"></div></td>
                      <td className="p-4 flex gap-3"><div className="w-12 h-12 bg-slate-200 rounded-lg"></div><div><div className="w-48 h-4 bg-slate-200 rounded mb-2"></div><div className="w-32 h-3 bg-slate-200 rounded"></div></div></td>
                      <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="w-16 h-4 bg-slate-200 rounded mx-auto"></div></td>
                      <td className="p-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
                      <td className="p-4"><div className="w-24 h-8 bg-slate-200 rounded mx-auto"></div></td>
                      <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4"><Search size={32}/></div>
                      <h3 className="text-lg font-black text-slate-800 mb-1">No courses found</h3>
                      <p className="text-sm font-medium text-slate-500">Try adjusting your filters or create a new course.</p>
                    </td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4"><input type="checkbox" checked={selectedIds.has(course.id)} onChange={() => toggleSelect(course.id)} className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                            {course.thumbnail ? <img src={getImageUrl(course.thumbnail)} alt={course.title} className="w-full h-full object-cover"/> : <span className="text-xs font-bold text-slate-400">IMG</span>}
                            {course.is_featured && <div className="absolute top-0 right-0 bg-amber-500 w-3 h-3 rounded-bl-lg"></div>}
                          </div>
                          <div>
                            <div className="font-bold text-[#1B2A6B] line-clamp-1 max-w-[300px] mb-0.5">{course.title}</div>
                            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                              {course.category?.name || 'Uncategorized'}
                              {course.level?.title && <span className="text-slate-300">&bull;</span>}
                              {course.level?.title && <span>{course.level.title}</span>}
                              {course.is_archived && <span className="text-red-500 bg-red-50 px-1.5 rounded">Archived</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{course.expert?.name || 'Unknown'}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${course.course_type === 'Free' ? 'text-emerald-600' : 'text-blue-600'}`}>{course.course_type}</span>
                          {course.course_type === 'Paid' && <span className="text-sm font-bold text-slate-800">₹{course.price}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={course.status} />
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => router.push(`/admin/courses/curriculum?courseId=${course.id}`)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B2A6B] bg-[#1B2A6B]/5 px-3 py-1.5 rounded-lg hover:bg-[#1B2A6B]/10 transition-colors"
                        >
                          <ListTree size={14} /> Curriculum
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => router.push(`/admin/courses/edit/${course.id}`)} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg tooltip" title="Edit"><Edit size={16}/></button>
                          <div className="relative group/dropdown">
                            <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><MoreVertical size={16}/></button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 py-1">
                              {course.status !== 'Published' && <button onClick={() => handleStatusChange(course.id, 'Published')} className="w-full text-left px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-slate-50 flex items-center gap-2"><Globe size={14}/> Publish</button>}
                              {course.status === 'Published' && <button onClick={() => handleStatusChange(course.id, 'Draft')} className="w-full text-left px-4 py-2 text-sm font-bold text-amber-600 hover:bg-slate-50 flex items-center gap-2"><Lock size={14}/> Unpublish</button>}
                              <button onClick={() => handleStatusChange(course.id, course.status === 'Private' ? 'Draft' : 'Private')} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Lock size={14}/> Make {course.status === 'Private' ? 'Public' : 'Private'}</button>
                              
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button onClick={() => handleDuplicate(course.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-blue-600 hover:bg-slate-50 flex items-center gap-2"><Copy size={14}/> Duplicate</button>
                              <button onClick={() => handleArchive(course.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-orange-600 hover:bg-slate-50 flex items-center gap-2"><Archive size={14}/> {course.is_archived ? 'Unarchive' : 'Archive'}</button>
                              
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button onClick={() => handleDelete(course.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14}/> Delete</button>
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
      </div>
    </AdminDashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colors = 'bg-slate-50 text-slate-600 border-slate-200';
  let dot = 'bg-slate-400';
  if (status === 'Published') { colors = 'bg-emerald-50 text-emerald-700 border-emerald-200'; dot = 'bg-emerald-500'; }
  else if (status === 'Draft') { colors = 'bg-slate-50 text-slate-600 border-slate-200'; dot = 'bg-slate-400'; }
  else if (status === 'Pending Approval') { colors = 'bg-amber-50 text-amber-700 border-amber-200'; dot = 'bg-amber-500'; }
  else if (status === 'Private') { colors = 'bg-indigo-50 text-indigo-700 border-indigo-200'; dot = 'bg-indigo-500'; }
  else if (status === 'Rejected') { colors = 'bg-red-50 text-red-700 border-red-200'; dot = 'bg-red-500'; }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap border ${colors}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
}
