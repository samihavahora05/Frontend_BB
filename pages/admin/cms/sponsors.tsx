import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, Plus, Trash2, Check, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_SPONSORS = [
  { id: 1, name: "Google India", status: true },
  { id: 2, name: "Microsoft Accelerator", status: true },
  { id: 3, name: "GitHub Education", status: true },
];

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState(INITIAL_SPONSORS);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "" });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const filtered = sponsors.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSponsors(prev => [...prev, { id: Date.now(), name: form.name, status: true }]);
    setForm({ name: "" });
    setLogoFile(null);
    toast.success("Sponsor added successfully!");
  };

  const handleLogo = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { setLogoFile(f); toast.success(`Logo: ${f.name}`); } };
    input.click();
  };

  const toggleStatus = (id: number) => {
    setSponsors(prev => prev.map(s => s.id === id ? { ...s, status: !s.status } : s));
  };

  const handleDelete = (id: number) => {
    setSponsors(prev => prev.filter(s => s.id !== id));
    toast.success("Sponsor deleted.");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Sponsor</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Sponsors</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">Add Sponsor Brand</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">NAME <span className="text-rose-500">*</span></label>
                <input required value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="Brand name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">LOGO IMAGE</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer" onClick={handleLogo}>
                  <span className="flex-1 text-xs font-semibold text-slate-400 truncate">{logoFile ? logoFile.name : "BROWSE"}</span>
                  <button type="button" className="px-4 py-1.5 bg-[#1B2A6B] text-white text-xs font-black rounded-lg">BROWSE</button>
                </div>
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                <Check size={14} /> SAVE SPONSOR
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
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">LOGO</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">BRAND NAME</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">STATUS</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-5">
                      <div className="w-10 h-10 rounded bg-slate-100 border flex items-center justify-center">
                        <ImageIcon size={14} className="text-slate-300" />
                      </div>
                    </td>
                    <td className="py-3 px-5 text-sm font-bold text-slate-800">{s.name}</td>
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
