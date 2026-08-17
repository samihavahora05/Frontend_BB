import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, Plus, Trash2, Check, Image as ImageIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_SLIDERS = [
  { id: 1, title: "Welcome to Blueboxx DA", subtitle: "Supercharge your career with industry internships.", link: "/internships", status: true },
  { id: 2, title: "Build Premium Web Products", subtitle: "Enroll in top expert development courses.", link: "/courses", status: true },
];

export default function AdminSliderPage() {
  const [sliders, setSliders] = useState(INITIAL_SLIDERS);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", subtitle: "", link: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const filtered = sliders.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSliders(prev => [
      ...prev,
      { id: Date.now(), title: form.title, subtitle: form.subtitle, link: form.link, status: true }
    ]);
    setForm({ title: "", subtitle: "", link: "" });
    setImageFile(null);
    toast.success("Slider saved!");
  };

  const handleImage = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { setImageFile(f); toast.success(`Slider Image: ${f.name}`); } };
    input.click();
  };

  const toggleStatus = (id: number) => {
    setSliders(prev => prev.map(s => s.id === id ? { ...s, status: !s.status } : s));
  };

  const handleDelete = (id: number) => {
    setSliders(prev => prev.filter(s => s.id !== id));
    toast.success("Slider deleted.");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Slider</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Sliders</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Add Form */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">Add New Slider</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">TITLE <span className="text-rose-500">*</span></label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Welcome title"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">SUBTITLE</label>
                <input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="Description subtitle"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">BUTTON LINK</label>
                <input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} placeholder="e.g. /courses"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">BACKGROUND IMAGE</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer" onClick={handleImage}>
                  <span className="flex-1 text-xs font-semibold text-slate-400 truncate">{imageFile ? imageFile.name : "BROWSE"}</span>
                  <button type="button" className="px-4 py-1.5 bg-[#1B2A6B] text-white text-xs font-black rounded-lg">BROWSE</button>
                </div>
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                <Check size={14} /> SAVE SLIDER
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black text-slate-800">Slider List</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sliders..."
                  className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] w-48" />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-12">SL</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">IMAGE</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">TITLE</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">BUTTON LINK</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">STATUS</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-5">
                      <div className="w-12 h-8 rounded bg-slate-100 border flex items-center justify-center">
                        <ImageIcon size={14} className="text-slate-300" />
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <p className="text-sm font-bold text-slate-800">{s.title}</p>
                      <p className="text-xs text-slate-400 font-medium truncate max-w-xs">{s.subtitle}</p>
                    </td>
                    <td className="py-3 px-5 text-xs font-semibold text-slate-500">{s.link || "—"}</td>
                    <td className="py-3 px-5">
                      <button onClick={() => toggleStatus(s.id)}
                        className={`w-11 h-6 rounded-full transition-all relative ${s.status ? "bg-[#1B2A6B]" : "bg-slate-200"}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${s.status ? "left-6" : "left-1"}`} />
                      </button>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <button onClick={() => handleDelete(s.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
