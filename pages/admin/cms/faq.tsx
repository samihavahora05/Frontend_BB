import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Search, Plus, Trash2, Check, HelpCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_FAQS = [
  { id: 1, question: "How do I claim my internship certificate?", answer: "Go to My Panel -> My Certificate to download verified copies." },
  { id: 2, title: "Can I apply for multiple drives?", answer: "Yes, you can apply for multiple opportunities." },
];

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [form, setForm] = useState({ question: "", answer: "" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setFaqs(prev => [...prev, { id: Date.now(), question: form.question, answer: form.answer }]);
    setForm({ question: "", answer: "" });
    toast.success("FAQ saved!");
  };

  const handleDelete = (id: number) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    toast.success("FAQ deleted.");
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">FAQ</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">FAQs</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-5">Create FAQ</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">QUESTION <span className="text-rose-500">*</span></label>
                <input required value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="FAQ Question?"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">ANSWER</label>
                <textarea rows={4} value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} placeholder="Detailed answer..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white resize-none" />
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                <Check size={14} /> SAVE FAQ
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
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">FAQ QUESTION</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase">ANSWER</th>
                  <th className="py-3 px-5 text-[11px] font-black text-slate-400 uppercase text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map((f, idx) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 text-sm font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-5 text-sm font-bold text-slate-800 flex items-center gap-1.5"><HelpCircle size={12} className="text-[#1B2A6B]" /> {f.question || "Generic FAQ"}</td>
                    <td className="py-3 px-5 text-xs font-semibold text-slate-500">{f.answer}</td>
                    <td className="py-3 px-5 text-center">
                      <button onClick={() => handleDelete(f.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
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
