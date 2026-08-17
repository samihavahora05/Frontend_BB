import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, Plus, Trash2, Edit3, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect } from "react";

const INITIAL_MENUS = [
  { id: 1, title: "Home", type: "System Link", value: "/", position: 1, status: true },
  { id: 2, title: "About Us", type: "Custom Link", value: "/about", position: 2, status: true },
  { id: 3, title: "Courses", type: "Dynamic Page", value: "/courses", position: 3, status: true },
  { id: 4, title: "Contact Us", type: "Custom Link", value: "/contact", position: 4, status: true },
];

export default function AdminHeaderMenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem('bb_header_menus');
    if (stored) {
      setMenus(JSON.parse(stored));
    } else {
      setMenus(INITIAL_MENUS);
      localStorage.setItem('bb_header_menus', JSON.stringify(INITIAL_MENUS));
    }
  }, []);
  const [perPage, setPerPage] = useState(10);
  const [form, setForm] = useState({ title: "", type: "Custom Link", value: "", position: 1 });

  const filtered = menus.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.value.trim()) return;
    const updated = [
      ...menus,
      { id: Date.now(), title: form.title, type: form.type, value: form.value, position: Number(form.position), status: true }
    ];
    setMenus(updated);
    localStorage.setItem('bb_header_menus', JSON.stringify(updated));
    setForm({ title: "", type: "Custom Link", value: "", position: prev => prev.length + 1 });
    toast.success("Header Menu saved!");
  };

  const toggleStatus = (id: number) => {
    const updated = menus.map(m => m.id === id ? { ...m, status: !m.status } : m);
    setMenus(updated);
    localStorage.setItem('bb_header_menus', JSON.stringify(updated));
  };

  const handleDelete = (id: number) => {
    const updated = menus.filter(m => m.id !== id);
    setMenus(updated);
    localStorage.setItem('bb_header_menus', JSON.stringify(updated));
    toast.success("Menu deleted.");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Header Menu</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Header Menu Setup</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Add Form */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">Add New Menu</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">TITLE <span className="text-rose-500">*</span></label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">TYPE</label>
                <div className="relative">
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option>Custom Link</option>
                    <option>System Link</option>
                    <option>Dynamic Page</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">LINK / PATH <span className="text-rose-500">*</span></label>
                <input required value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="e.g. /about"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">POSITION ORDER</label>
                <input type="number" min={1} value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                <Check size={14} /> SAVE
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black text-slate-800">Menus</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Show</span>
                <select value={perPage} onChange={e => setPerPage(Number(e.target.value))} className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
                  {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menus..."
                  className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] w-36" />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase w-12">SL</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">TITLE</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">TYPE</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">LINK</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">POSITION</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">STATUS</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.slice(0, perPage).map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-5 text-sm font-semibold text-slate-800">{m.title}</td>
                    <td className="py-3 px-5 text-xs font-semibold text-slate-500">{m.type}</td>
                    <td className="py-3 px-5 text-xs font-semibold text-slate-500">{m.value}</td>
                    <td className="py-3 px-5 text-sm font-bold text-slate-600">{m.position}</td>
                    <td className="py-3 px-5">
                      <button onClick={() => toggleStatus(m.id)}
                        className={`w-11 h-6 rounded-full transition-all relative ${m.status ? "bg-[#1B2A6B]" : "bg-slate-200"}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${m.status ? "left-6" : "left-1"}`} />
                      </button>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleDelete(m.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
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
