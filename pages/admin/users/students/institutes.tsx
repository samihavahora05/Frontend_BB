import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_INSTITUTES = [
  { id: 1, name: "Parul University", address: "Vadodara", status: true },
];

export default function AdminStudentInstitutesPage() {
  const [institutes, setInstitutes] = useState(INITIAL_INSTITUTES);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");

  const filtered = institutes.filter(
    (inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setInstitutes((prev) => [
      ...prev,
      { id: Date.now(), name: formName, address: formAddress, status: true },
    ]);
    setFormName("");
    setFormAddress("");
    toast.success("Institute saved successfully!");
  };

  const toggleStatus = (id: number) => {
    setInstitutes((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, status: !inst.status } : inst
      )
    );
  };

  return (
    <AdminDashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/users/students" className="hover:text-[#1B2A6B]">Students</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Institutes</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Institutes</h1>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: New Institute Form */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">New Institute</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  NAME <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder-slate-300 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">
                  ADDRESS
                </label>
                <input
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder-slate-300 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all"
              >
                <Check size={14} /> SAVE
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Institute List Table */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-800">Institute List</h2>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Show</span>
                <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">{perPage}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </div>
                <span className="text-xs font-bold text-slate-500">entries</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Export icons */}
                <div className="hidden sm:flex items-center gap-1">
                  {["📋", "📄", "📊", "📑", "🖨", "⋮⋮"].map((ico, i) => (
                    <button key={i} className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg bg-slate-50 text-sm hover:bg-slate-100 transition-colors">
                      {ico}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Quick Search"
                    className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] w-40"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-500 uppercase tracking-wider w-12">SL</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-500 uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center gap-1">NAME <ChevronDown size={11} /></div>
                  </th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-500 uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center gap-1">ADDRESS <ChevronDown size={11} /></div>
                  </th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-500 uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center gap-1">STATUS <ChevronDown size={11} /></div>
                  </th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-500 uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center gap-1">ACTION <ChevronDown size={11} /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.slice(0, perPage).map((inst, idx) => (
                  <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-5 text-sm font-semibold text-slate-800">{inst.name}</td>
                    <td className="py-3 px-5 text-sm font-semibold text-slate-600">{inst.address}</td>
                    <td className="py-3 px-5">
                      {/* Toggle */}
                      <button
                        onClick={() => toggleStatus(inst.id)}
                        className={`w-11 h-6 rounded-full transition-all relative ${inst.status ? "bg-[#1B2A6B]" : "bg-slate-200"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${inst.status ? "left-6" : "left-1"}`} />
                      </button>
                    </td>
                    <td className="py-3 px-5">
                      <div className="relative inline-block">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors">
                          SELECT <ChevronDown size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm font-semibold text-slate-400">
                      No institutes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500">
                showing 1 to {Math.min(perPage, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">←</button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#1B2A6B] text-white rounded-lg text-xs font-black">1</button>
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
