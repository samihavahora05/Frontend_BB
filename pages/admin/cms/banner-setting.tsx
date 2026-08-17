import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminBannerSettingPage() {
  const [settings, setSettings] = useState({
    transitionType: "Slide Horizontal",
    autoPlay: "Yes",
    delaySpeed: "5000",
    bannerLayout: "Full Width Banner",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Banner settings saved successfully!");
    }, 800);
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Banner/Slider Setting</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Banner/Slider Setting</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Transition Style</label>
              <div className="relative">
                <select value={settings.transitionType} onChange={e => setSettings(p => ({ ...p, transitionType: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Slide Horizontal</option>
                  <option>Slide Vertical</option>
                  <option>Cross Fade</option>
                  <option>None</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Auto Play</label>
              <div className="relative">
                <select value={settings.autoPlay} onChange={e => setSettings(p => ({ ...p, autoPlay: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Yes</option>
                  <option>No</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Interval Delay (ms)</label>
              <input type="number" value={settings.delaySpeed} onChange={e => setSettings(p => ({ ...p, delaySpeed: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Banner Layout Grid</label>
              <div className="relative">
                <select value={settings.bannerLayout} onChange={e => setSettings(p => ({ ...p, bannerLayout: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Full Width Banner</option>
                  <option>Split Width Banner</option>
                  <option>Sidebar Fixed Banner</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-75">
            {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
            UPDATE BANNER SETTING
          </button>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}
