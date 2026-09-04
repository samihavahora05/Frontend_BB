import { getImageUrl } from "../../../src/lib/imageUtils";
import React, { useState, useRef } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Search, Check, Image as ImageIcon, Trash2, Edit3, X, FileText, Download, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CourseCategoryService, CourseCategory } from "../../../src/lib/api/admin/CourseCategoryService";

export default function AdminCourseCategoriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("position");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: categories, meta, isLoading, mutate } = CourseCategoryService.useCategories({
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
    per_page: perPage,
    page: page
  });


  const [form, setForm] = useState({ id: 0, name: "", description: "", parent_id: "", order: "1", status: "active" });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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
    if (!form.name.trim()) return toast.error('Name is required');

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    if (form.parent_id) formData.append('parent_id', form.parent_id);
    formData.append('position', form.order);
    formData.append('status', form.status);
    if (iconFile) formData.append('icon', iconFile);

    try {
      if (isEditing && form.id) {
        await CourseCategoryService.update(form.id, formData);
        toast.success("Category updated!");
      } else {
        await CourseCategoryService.create(formData);
        toast.success("Category created!");
      }
      mutate();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ id: 0, name: "", description: "", parent_id: "", order: "1", status: "active" });
    setIconFile(null);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (cat: CourseCategory) => {
    setForm({
      id: cat.id,
      name: cat.name,
      description: cat.description || "",
      parent_id: cat.parent_id ? String(cat.parent_id) : "",
      order: String(cat.position || 1),
      status: cat.status || "active"
    });
    setIconFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await CourseCategoryService.delete(id);
      toast.success("Category deleted");
      mutate();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to delete');
    }
  };

  const handleIconBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setIconFile(f);
      toast.success(`Icon selected: ${f.name}`);
    }
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === categories.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(categories.map((c: any) => c.id)));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} categories?`)) return;
    try {
      await CourseCategoryService.bulkDelete(Array.from(selectedIds));
      toast.success('Categories deleted');
      setSelectedIds(new Set());
      mutate();
    } catch (e: any) {
      toast.error('Failed to delete categories');
    }
  };

  const handleBulkStatus = async (status: 'active' | 'inactive') => {
    if (selectedIds.size === 0) return;
    try {
      await CourseCategoryService.bulkStatus(Array.from(selectedIds), status);
      toast.success(`Categories marked as ${status}`);
      setSelectedIds(new Set());
      mutate();
    } catch (e: any) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = async (format: string) => {
    const toastId = toast.loading(`Exporting as ${format.toUpperCase()}...`);
    try {
      await CourseCategoryService.exportCSV({ format });
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
        <span className="text-slate-800 font-bold">Category List</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">CATEGORY LIST</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Add/Edit Category Form */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-black text-slate-800">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
              {isEditing && (
                <button onClick={resetForm} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
              )}
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">NAME <span className="text-rose-500">*</span></label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">DESCRIPTION</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all resize-none" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">PARENT</label>
                <div className="relative">
                  <select value={form.parent_id} onChange={e => setForm(p => ({ ...p, parent_id: e.target.value }))}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="">None</option>
                    {categories.filter((c: any) => c.id !== form.id).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">POSITION ORDER</label>
                <div className="relative">
                  <input type="number" min={0} value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">STATUS</label>
                <div className="relative">
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">ICON</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="flex-1 text-xs font-semibold text-slate-400 truncate">{iconFile ? iconFile.name : "BROWSE"}</span>
                  <input type="file" ref={fileInputRef} onChange={handleIconChange} className="hidden" accept="image/*" />
                  <button type="button" onClick={handleIconBrowse} className="px-4 py-1.5 bg-[#1B2A6B] text-white text-xs font-black rounded-lg">BROWSE</button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Recommended size 200px x 200px</p>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                {isEditing ? 'UPDATE CATEGORY' : 'SAVE CATEGORY'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Category List Table */}
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
                  <h2 className="text-base font-black text-slate-800">Categories Data</h2>
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

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input type="checkbox" checked={selectedIds.size === categories.length && categories.length > 0} onChange={toggleSelectAll} className="rounded text-[#1B2A6B] border-slate-300" />
                    </th>
                    <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">NAME {sortBy==='name' && <ChevronDown size={11} className={sortOrder==='desc'?'rotate-180':''} />}</div>
                    </th>
                    <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase">PARENT</th>
                    <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase cursor-pointer" onClick={() => handleSort('position')}>
                      <div className="flex items-center gap-1">ORDER {sortBy==='position' && <ChevronDown size={11} className={sortOrder==='desc'?'rotate-180':''} />}</div>
                    </th>
                    <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase">COURSES</th>
                    <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase">STATUS</th>
                    <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-4"><div className="w-4 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-4"><div className="w-10 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-4"><div className="w-10 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-4"><div className="w-16 h-4 bg-slate-200 rounded"></div></td>
                        <td className="py-4 px-4"><div className="w-16 h-4 bg-slate-200 rounded ml-auto"></div></td>
                      </tr>
                    ))
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                          <FileText size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-semibold text-sm">No categories found.</p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat: any) => (
                      <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-4">
                          <input type="checkbox" checked={selectedIds.has(cat.id)} onChange={() => toggleSelect(cat.id)} className="rounded text-[#1B2A6B] border-slate-300" />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                              {cat.icon ? <img src={getImageUrl(cat.icon)} alt={cat.name} className="w-full h-full object-cover" onError={e => e.currentTarget.style.display='none'} /> : <ImageIcon size={16} className="text-slate-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{cat.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold truncate w-32" title={cat.slug}>{cat.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                          {cat.parent ? <span className="bg-slate-100 px-2 py-1 rounded">{cat.parent.name}</span> : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-3 px-4 text-xs font-black text-slate-600">{cat.position}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg">{cat.courses_count || 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${cat.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {cat.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16}/></button>
                            <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                          </div>
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
