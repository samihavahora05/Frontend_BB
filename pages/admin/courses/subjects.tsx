import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Search, Check, Trash2, Edit2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CourseSubjectService, CourseSubject } from "../../../src/lib/api/admin/CourseSubjectService";

export default function AdminCourseSubjectsPage() {
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [titleInput, setTitleInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: subjects, meta, mutate, isLoading } = CourseSubjectService.useSubjects(page, perPage, search);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    try {
      if (editingId) {
        await CourseSubjectService.update(editingId, { title: titleInput });
        toast.success("Subject updated successfully!");
        setEditingId(null);
      } else {
        await CourseSubjectService.create({ title: titleInput });
        toast.success("Subject created successfully!");
      }
      setTitleInput("");
      mutate();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  const toggleStatus = async (subject: CourseSubject) => {
    try {
      await CourseSubjectService.updateStatus(subject.id, !subject.status);
      toast.success("Status updated");
      mutate();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await CourseSubjectService.delete(id);
      toast.success("Subject deleted successfully");
      mutate();
    } catch (error) {
      toast.error("Failed to delete subject");
    }
  };

  const handleEdit = (subject: CourseSubject) => {
    setEditingId(subject.id);
    setTitleInput(subject.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitleInput("");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/courses" className="hover:text-[#1B2A6B]">Courses</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">School Subject</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">SCHOOL SUBJECT</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Add New Subject */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">{editingId ? 'Edit Subject' : 'Add New Subject'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">TITLE <span className="text-rose-500">*</span></label>
                <input required value={titleInput} onChange={e => setTitleInput(e.target.value)} placeholder="Title"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                  <Check size={14} /> {editingId ? 'UPDATE' : 'SAVE'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: Subject List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-800">Subject List</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Show</span>
                <select value={perPage} onChange={e => setPerPage(Number(e.target.value))} className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 px-2 py-1 outline-none">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Quick Search"
                    className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] w-36" />
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-[#1B2A6B]" />
              </div>
            ) : subjects.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-48 text-slate-400">
                <p className="font-semibold text-sm">No subjects found.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-12">ID</th>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">TITLE</th>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">STATUS</th>
                    <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-5 text-sm font-bold text-slate-500">{subject.id}</td>
                      <td className="py-3 px-5 text-sm font-semibold text-slate-800">{subject.title}</td>
                      <td className="py-3 px-5">
                        <button onClick={() => toggleStatus(subject)}
                          className={`w-11 h-6 rounded-full transition-all relative ${subject.status ? "bg-[#1B2A6B]" : "bg-slate-200"}`}>
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${subject.status ? "left-6" : "left-1"}`} />
                        </button>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(subject)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(subject.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!isLoading && subjects.length > 0 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500">
                  showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, meta?.total || 0)} of {meta?.total || 0} entries
                </p>
                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
                    ←
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#1B2A6B] text-white rounded-lg text-xs font-black">
                    {page}
                  </button>
                  <button 
                    disabled={page === meta?.last_page || !meta?.last_page} 
                    onClick={() => setPage(p => p + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50">
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
