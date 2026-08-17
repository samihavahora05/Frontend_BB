import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminBecomeInstructorPage() {
  const [form, setForm] = useState({
    title: "Start teaching today",
    subtitle: "Instructors from around the world teach millions of students on Blueboxx.",
    features: "• Flexible teaching schedules\n• High revenue split percentage\n• Interactive dashboard reporting Tools",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Instructor landing page setup saved!");
    }, 800);
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Become Instructor</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Become Instructor</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">HEADER TITLE</label>
            <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">HEADER SUBTITLE</label>
            <input value={form.subtitle} onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">FEATURES (one per line)</label>
            <textarea rows={4} value={form.features} onChange={e => setForm(prev => ({ ...prev, features: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white resize-none" />
          </div>
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-75">
            {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
            SAVE LANDING CONTENT
          </button>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}
