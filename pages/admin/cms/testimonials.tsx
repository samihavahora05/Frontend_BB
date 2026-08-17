import React, { useState, useRef } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, Plus, Trash2, Check, Star, Edit, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "../../../src/lib/fetcher";
import api from "../../../src/lib/axios";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  designation: string | null;
  company: string | null;
  review: string;
  rating: number;
  status: string;
  display_order: number;
  image_url: string | null;
}

export default function AdminTestimonialsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    designation: "",
    company: "",
    review: "",
    rating: 5,
    status: "active",
    display_order: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Data
  const { data, mutate } = useSWR(
    `/admin/testimonials?page=${page}&search=${search}`,
    fetcher
  );

  const testimonials: Testimonial[] = data?.data || [];
  const meta = data?.meta || { current_page: 1, last_page: 1 };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setForm({
        name: testimonial.name || "",
        designation: testimonial.designation || "",
        company: testimonial.company || "",
        review: testimonial.review || "",
        rating: testimonial.rating || 5,
        status: testimonial.status || "active",
        display_order: testimonial.display_order || 0,
      });
      setImagePreview(testimonial.image_url);
    } else {
      setEditingId(null);
      setForm({
        name: "",
        designation: "",
        company: "",
        review: "",
        rating: 5,
        status: "active",
        display_order: 0,
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      toast.error("Please fill required fields: Name and Review");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.designation) formData.append("designation", form.designation);
    if (form.company) formData.append("company", form.company);
    formData.append("review", form.review);
    formData.append("rating", form.rating.toString());
    formData.append("status", form.status);
    formData.append("display_order", form.display_order.toString());
    if (selectedFile) formData.append("profile_image", selectedFile);

    try {
      if (editingId) {
        formData.append("_method", "PUT");
        await api.post(`/admin/testimonials/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Testimonial updated!");
      } else {
        await api.post("/admin/testimonials", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Testimonial created!");
      }
      mutate();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      toast.success("Testimonial deleted");
      mutate();
    } catch (err) {
      toast.error("Failed to delete testimonial");
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Testimonials</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">Testimonials</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]" 
            />
          </div>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
            <Plus size={16} /> ADD NEW
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-16 text-center">Ord</th>
                <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">User</th>
                <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">Review</th>
                <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-24">Rating</th>
                <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-24">Status</th>
                <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 text-sm font-bold text-slate-500 text-center">{t.display_order}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                        {t.image_url ? (
                          <Image src={t.image_url} alt={t.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{t.name}</p>
                        <p className="text-xs text-slate-500 font-semibold">{t.designation}{t.company ? `, ${t.company}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-xs font-semibold text-slate-600 max-w-xs truncate">{t.review}</td>
                  <td className="py-4 px-5">
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${t.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openModal(t)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Edit size={13} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm font-semibold text-slate-400">
                    No testimonials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Page {meta.current_page} of {meta.last_page}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg text-xs font-bold text-slate-600">Prev</button>
              <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg text-xs font-bold text-slate-600">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-black text-slate-800">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5">
              <div className="flex items-start gap-6">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden relative border-2 border-slate-200 mb-3 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={24} className="mb-1" />
                        <span className="text-[9px] font-bold uppercase">Upload</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold uppercase">
                      Change
                    </div>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <span className="text-[10px] font-bold text-slate-400">Max 2MB (JPG/PNG/WEBP)</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Name <span className="text-rose-500">*</span></label>
                      <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1B2A6B]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Designation</label>
                      <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1B2A6B]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Company</label>
                    <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1B2A6B]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Review Content <span className="text-rose-500">*</span></label>
                <textarea required rows={4} value={form.review} onChange={e => setForm(p => ({ ...p, review: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1B2A6B] resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Rating</label>
                  <select value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1B2A6B]">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1B2A6B]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Display Order</label>
                  <input type="number" min="0" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[#1B2A6B]" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-black text-slate-500 hover:text-slate-700 transition-colors">
                  CANCEL
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 disabled:opacity-50 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                  {isSubmitting ? 'SAVING...' : <><Check size={16} /> SAVE TESTIMONIAL</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
