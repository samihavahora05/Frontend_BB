import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLoginRegistrationPage() {
  const [config, setConfig] = useState({
    loginBg: "Default Gradient",
    showLogo: "Yes",
    socialLogin: "Enabled",
    emailVerification: "Required",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Login & registration configuration saved!");
    }, 800);
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Login & Registration</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Login & Registration</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Login Background Layout</label>
              <div className="relative">
                <select value={config.loginBg} onChange={e => setConfig(p => ({ ...p, loginBg: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Default Gradient</option>
                  <option>Clean Slate White</option>
                  <option>Brand Custom Image</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Show Brand Logo</label>
              <div className="relative">
                <select value={config.showLogo} onChange={e => setConfig(p => ({ ...p, showLogo: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Yes</option>
                  <option>No</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">OAuth Social Login</label>
              <div className="relative">
                <select value={config.socialLogin} onChange={e => setConfig(p => ({ ...p, socialLogin: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Email Verification</label>
              <div className="relative">
                <select value={config.emailVerification} onChange={e => setConfig(p => ({ ...p, emailVerification: e.target.value }))}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Required</option>
                  <option>Optional</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-75">
            {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
            UPDATE CONFIGURATION
          </button>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}
