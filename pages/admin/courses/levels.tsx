import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Search, Check, Trash2, Edit3, X, FileText, Download, Printer, Loader2, MoreVertical, Eye } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CourseLevelService, CourseLevel } from "../../../src/lib/api/admin/CourseLevelService";

export default function AdminCourseLevelsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("position");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: levels, meta, isLoading, mutate } = CourseLevelService.useLevels({
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
    per_page: perPage,
    page: page
  });

  const [form, setForm] = useState({ id: 0, title: "", description: "", position: "0", status: "active" as 'active'|'inactive' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');

    setIsSubmitting(true);
    const payload = {
      title: form.title,
      description: form.description,
      position: Number(form.position),
      status: form.status
    };

    try {
      if (isEditing && form.id) {
        await CourseLevelService.update(form.id, payload);
        toast.success("Level updated!");
      } else {
        await CourseLevelService.create(payload);
        toast.success("Level created!");
      }
      mutate();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save level');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ id: 0, title: "", description: "", position: "0", status: "active" });
    setIsEditing(false);
  };

  const handleEdit = (lvl: CourseLevel) => {
    setForm({
      id: lvl.id,
      title: lvl.title,
      description: lvl.description || "",
      position: String(lvl.position || 0),
      status: lvl.status
    });
    setIsEditing(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this level?')) return;
    try {
      await CourseLevelService.delete(id);
      toast.success("Level deleted");
      mutate();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to delete');
    }
    setActiveDropdown(null);
  };

  const toggleStatus = async (lvl: CourseLevel) => {
    const newStatus = lvl.status === 'active' ? 'inactive' : 'active';
    // Optimistic UI
    mutate(levels.map(l => l.id === lvl.id ? { ...l, status: newStatus } : l), false);
    try {
      await CourseLevelService.update(lvl.id, { title: lvl.title, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      mutate(); // Revalidate
    } catch (e: any) {
      toast.error('Failed to update status');
      mutate(); // Rollback on error
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === levels.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(levels.map((c: any) => c.id)));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} levels?`)) return;
    try {
      await CourseLevelService.bulkDelete(Array.from(selectedIds));
      toast.success('Levels deleted');
      setSelectedIds(new Set());
      mutate();
    } catch (e: any) {
      toast.error('Failed to delete levels');
    }
  };

  const handleBulkStatus = async (status: 'active' | 'inactive') => {
    if (selectedIds.size === 0) return;
    try {
      await CourseLevelService.bulkStatus(Array.from(selectedIds), status);
      toast.success(`Levels marked as ${status}`);
      setSelectedIds(new Set());
      mutate();
    } catch (e: any) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = async (format: string) => {
    const toastId = toast.loading(`Exporting as ${format.toUpperCase()}...`);
    try {
      await CourseLevelService.exportCSV({ format });
      toast.success('Export successful', { id: toastId });
    } catch (e) {
      toast.error('Export failed', { id: toastId });
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/courses" className="hover:text-[#1B2A6B]">Courses</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Course Level</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">COURSE LEVEL</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Add/Edit Form */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-black text-slate-800">{isEditing ? 'Edit Level' : 'Add New Level'}</h2>
              {isEditing && (
                <button onClick={resetForm} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
              )}
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">TITLE <span className="text-rose-500">*</span></label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">DESCRIPTION</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all resize-none" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">POSITION</label>
                <div className="relative">
                  <input type="number" min={0} value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">STATUS</label>
                <div className="relative">
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                {isEditing ? 'UPDATE LEVEL' : 'SAVE LEVEL'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Level List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {selectedIds.size > 0 ? (
                  <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    <span className="text-xs font-black text-indigo-700">{selectedIds.size} Selected</span>
                    <div className="w-px h-4 bg-indigo-200 mx-1"></div>
                    <button onClick={handleBulkDelete} className="p-1 text-red-500 hover:bg-red-100 rounded" title="Delete Selected"><Trash2 size={14}/></button>
                    <button onClick={() => handleBulkStatus('active')} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="Mark Active"><Check size={14}/></button>
                    <button onClick={() => handleBulkStatus('inactive')} className="p-1 text-slate-500 hover:bg-slate-200 rounded" title="Mark Inactive"><X size={14}/></button>
                  </div>
                ) : (
                  <h2 className="text-base font-black text-slate-800">Level List</h2>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setPage(1)}} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="relative group/export flex items-center gap-1">
                  <button className="p-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 flex items-center gap-1 tooltip" title="Export">
                    <Download size={14}/> <ChevronDown size={12}/>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-10 py-1">
                    <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">CSV</button>
                    <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Excel</button>
                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">PDF</button>
                  </div>
                  <button onClick={() => window.print()} className="p-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 tooltip" title="Print"><Printer size={14}/></button>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] w-48" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input type="checkbox" checked={selectedIds.size === levels.length && levels.length > 0} onChange={toggleSelectAll} className="rounded text-[#1B2A6B] border-slate-300" />
                    </th>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase cursor-pointer" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1">TITLE {sortBy==='title' && <ChevronDown size={11} className={sortOrder==='desc'?'rotate-180':''} />}</div>
                    </th>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase cursor-pointer" onClick={() => handleSort('position')}>
                      <div className="flex items-center gap-1">POSITION {sortBy==='position' && <ChevronDown size={11} className={sortOrder==='desc'?'rotate-180':''} />}</div>
                    </th>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-1">STATUS {sortBy==='status' && <ChevronDown size={11} className={sortOrder==='desc'?'rotate-180':''} />}</div>
                    </th>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-4"><div className="w-4 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-5"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-5"><div className="w-10 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-5"><div className="w-10 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-5"><div className="w-16 h-6 bg-slate-200 rounded"></div></td>
                      </tr>
                    ))
                  ) : levels.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                          <FileText size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-semibold text-sm">No course levels found.</p>
                      </td>
                    </tr>
                  ) : (
                    levels.map((lvl: any) => (
                      <tr key={lvl.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <input type="checkbox" checked={selectedIds.has(lvl.id)} onChange={() => toggleSelect(lvl.id)} className="rounded text-[#1B2A6B] border-slate-300" />
                        </td>
                        <td className="py-3 px-5 text-sm font-semibold text-slate-800">{lvl.title}</td>
                        <td className="py-3 px-5 text-xs font-black text-slate-600">{lvl.position}</td>
                        <td className="py-3 px-5">
                          <button onClick={() => toggleStatus(lvl)}
                            className={`w-11 h-6 rounded-full transition-all relative ${lvl.status === 'active' ? "bg-emerald-500" : "bg-slate-300"}`}>
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${lvl.status === 'active' ? "left-6" : "left-1"}`} />
                          </button>
                        </td>
                        <td className="py-3 px-5 relative">
                          <button onClick={() => setActiveDropdown(activeDropdown === lvl.id ? null : lvl.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors">
                            ACTION <ChevronDown size={11} />
                          </button>
                          
                          {activeDropdown === lvl.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                              <div className="absolute top-12 left-5 z-20 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <button className="w-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Eye size={14} className="text-slate-400" /> View
                                </button>
                                <button onClick={() => handleEdit(lvl)} className="w-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Edit3 size={14} className="text-blue-500" /> Edit
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={() => handleDelete(lvl.id)} className="w-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Show</span>
                  <select value={perPage} onChange={e => {setPerPage(Number(e.target.value)); setPage(1);}} className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                    {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
                  </select>
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                    entries | Total {meta.total} records
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button disabled={page <= 1} onClick={() => setPage(page-1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50">←</button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#1B2A6B] text-white rounded-lg text-xs font-black shadow-sm">{page}</button>
                  <button disabled={page >= meta.last_page} onClick={() => setPage(page+1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50">→</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
