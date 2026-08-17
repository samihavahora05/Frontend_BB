import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CourseSettingService } from "../../../src/lib/api/admin/CourseSettingService";
import { useAuth } from "../../../src/lib/auth"; // Assume some auth context if exists, or just gracefully handle 403.

const DropField = ({ label, value, options, onChange, purpose }: { label: string; value: string; options: string[]; onChange: (v: string) => void; purpose?: string }) => (
  <div>
    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {purpose && <p className="text-[10px] font-semibold text-slate-400 mt-2 leading-relaxed">{purpose}</p>}
  </div>
);

export default function AdminCourseSettingPage() {
  const { data: initialSettings, isLoading, mutate } = CourseSettingService.useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    courseApproval: "No",
    hideReview: "No",
    sendMailDays: "",
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings({
        courseApproval: initialSettings.course_approval_required ? "Yes" : "No",
        hideReview: initialSettings.hide_reviews ? "Yes" : "No",
        sendMailDays: initialSettings.expiry_email_days ? String(initialSettings.expiry_email_days) : "",
      });
    }
  }, [initialSettings]);

  const set = (field: string) => (val: string) => setSettings(prev => ({ ...prev, [field]: val }));

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const payload = {
        course_approval_required: settings.courseApproval === "Yes",
        hide_reviews: settings.hideReview === "Yes",
        expiry_email_days: settings.sendMailDays ? parseInt(settings.sendMailDays, 10) : null,
      };
      
      await CourseSettingService.update(payload);
      toast.success("Course settings updated!");
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings. You may not have permission.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/courses" className="hover:text-[#1B2A6B]">Courses</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Course Settings</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">COURSE SETTINGS</h1>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex justify-center max-w-3xl">
          <span className="w-8 h-8 border-4 border-[#1B2A6B]/30 border-t-[#1B2A6B] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8 max-w-3xl">
          
          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-8">
            <DropField 
              label="COURSE APPROVAL BY ADMIN" 
              value={settings.courseApproval} 
              options={["No", "Yes"]} 
              onChange={set("courseApproval")} 
              purpose="If enabled, newly created courses remain in Pending status until an admin reviews and publishes them."
            />
            
            <DropField 
              label="HIDE REVIEW SECTION" 
              value={settings.hideReview} 
              options={["No", "Yes"]} 
              onChange={set("hideReview")} 
              purpose="Show or hide the student review/rating section on the course page."
            />
          </div>

          {/* Row 2 - Send Mail */}
          <div className="grid grid-cols-1 gap-6 pb-4">
            <div className="md:w-1/2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">SEND MAIL BEFORE EXPIRE (IN DAYS)</label>
              <input 
                type="number" 
                min={0} 
                value={settings.sendMailDays}
                onChange={e => setSettings(prev => ({ ...prev, sendMailDays: e.target.value }))}
                placeholder="e.g. 7"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
              />
              <p className="text-[10px] font-semibold text-slate-400 mt-2 leading-relaxed">
                Automatically send reminder emails to students before their course access expires. If left blank or 0, no reminder emails are sent.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button onClick={handleUpdate} disabled={isSaving}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-70">
              {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
              UPDATE SETTINGS
            </button>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
