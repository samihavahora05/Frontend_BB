import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, Plus, Trash2, Edit3, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_PAGES = [
  { id: 1, title: "About Us", slug: "about", status: "Published" },
  { id: 2, title: "Privacy Policy", slug: "privacy-policy", status: "Published" },
  { id: 3, title: "Terms of Service", slug: "terms-of-service", status: "Drafted" },
];

export default function AdminPageContentPage() {
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", status: "Published" });

  const filtered = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setPages(prev => [...prev, { id: Date.now(), title: form.title, slug: form.slug, status: form.status }]);
    setForm({ title: "", slug: "", status: "Published" });
    toast.success("Page content created!");
  };

  const handleDelete = (id: number) => {
    setPages(prev => prev.filter(p => p.id !== id));
    toast.success("Page deleted.");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Page Content</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Page Content Setup</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">Create Custom Page</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">TITLE <span className="text-rose-500">*</span></label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="About Us"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">SLUG <span className="text-rose-500">*</span></label>
                <input required value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="about-us"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                <Check size={14} /> SAVE PAGE
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
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">TITLE</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">SLUG</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">STATUS</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-5 text-sm font-bold text-slate-800">{p.title}</td>
                    <td className="py-3 px-5 text-xs font-semibold text-slate-500">{p.slug}</td>
                    <td className="py-3 px-5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${p.status === "Published" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}>{p.status}</span>
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
