import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminCustomCodePage() {
  const [code, setCode] = useState({
    headerCode: "<!-- Header Script (GTM, Analytics) -->\n<script>\n  console.log('Blueboxx Script Init');\n</script>",
    footerCode: "<!-- Footer Script (Chat widget, custom pixel) -->",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Custom CSS & JS code blocks updated!");
    }, 800);
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Custom CSS & JS</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Custom Code Scripts</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl">
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">HEADER CUSTOM CODE / SCRIPT (Injects in &lt;head&gt;)</label>
            <textarea rows={6} value={code.headerCode} onChange={e => setCode(prev => ({ ...prev, headerCode: e.target.value }))}
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">FOOTER CUSTOM CODE / SCRIPT (Injects before &lt;/body&gt;)</label>
            <textarea rows={6} value={code.footerCode} onChange={e => setCode(prev => ({ ...prev, footerCode: e.target.value }))}
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
          </div>
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-75">
            {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
            SAVE CUSTOM SCRIPTS
          </button>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}
