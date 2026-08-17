import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, Plus, Trash2, Check, Bell } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_POPUPS = [
  { id: 1, title: "Summer Internship Drive 2026", description: "Get placed at top startups in tech & management.", status: true },
  { id: 2, title: "Flat 50% Off On Web Dev Classes", description: "Use coupon code WEB50 on checkout.", status: false },
];

export default function AdminPopupPage() {
  const [popups, setPopups] = useState(INITIAL_POPUPS);
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setPopups(prev => [...prev, { id: Date.now(), title: form.title, description: form.description, status: true }]);
    setForm({ title: "", description: "" });
    toast.success("Popup Banner saved!");
  };

  const toggleStatus = (id: number) => {
    setPopups(prev => prev.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const handleDelete = (id: number) => {
    setPopups(prev => prev.filter(p => p.id !== id));
    toast.success("Popup deleted.");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Popup Content</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Popup Banners</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">Create Popup</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">TITLE <span className="text-rose-500">*</span></label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Popup header title"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">DESCRIPTION</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Popup text context..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white resize-none" />
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                <Check size={14} /> SAVE POPUP
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-12">SL</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">POPUP CONTENT</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">STATUS</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {popups.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-5">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><Bell size={12} className="text-[#1B2A6B]" /> {p.title}</p>
                      <p className="text-xs text-slate-400 font-medium truncate max-w-sm mt-0.5">{p.description}</p>
                    </td>
                    <td className="py-3 px-5">
                      <button onClick={() => toggleStatus(p.id)}
                        className={`w-11 h-6 rounded-full transition-all relative ${p.status ? "bg-[#1B2A6B]" : "bg-slate-200"}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${p.status ? "left-6" : "left-1"}`} />
                      </button>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <button onClick={() => handleDelete(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
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
