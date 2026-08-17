import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { StudentService } from "../../../../src/lib/api/admin/StudentService";

const FIELDS = [
  "Company",
  "Gender",
  "Student Type",
  "Identification Number",
  "Job Title",
  "Date of Birth",
  "Phone",
  "Institute",
];

export default function AdminStudentSettingPage() {
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});
  const [requiredFields, setRequiredFields] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await StudentService.getSettings();
      const settings = res.data || {};
      
      const newShowFields: Record<string, boolean> = {};
      const newRequiredFields: Record<string, boolean> = {};
      
      FIELDS.forEach(field => {
        const keyBase = field.toLowerCase().replace(/ /g, '_');
        newShowFields[field] = settings[`show_${keyBase}`] === 'true';
        newRequiredFields[field] = settings[`require_${keyBase}`] === 'true';
      });
      
      setShowFields(newShowFields);
      setRequiredFields(newRequiredFields);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShow = (field: string) => {
    setShowFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const toggleRequired = (field: string) => {
    setRequiredFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {};
      FIELDS.forEach(field => {
        const keyBase = field.toLowerCase().replace(/ /g, '_');
        payload[`show_${keyBase}`] = showFields[field] ? 'true' : 'false';
        payload[`require_${keyBase}`] = requiredFields[field] ? 'true' : 'false';
      });
      
      await StudentService.updateSettings(payload);
      toast.success("Student field settings updated!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/users/students" className="hover:text-[#1B2A6B]">Students</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Setting</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">SETTING</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 border-b border-slate-200">
          <div className="px-6 py-4">
            <h2 className="text-base font-black text-slate-800">Input Field Showing in Registration</h2>
          </div>
          <div className="px-6 py-4 border-l border-slate-200">
            <h2 className="text-base font-black text-slate-800">Required Field</h2>
          </div>
        </div>

        {/* Fields */}
        <div className="divide-y divide-slate-100">
          {FIELDS.map((field) => (
            <div key={field} className="grid grid-cols-2 items-center hover:bg-slate-50 transition-colors">
              {/* Show Toggle */}
              <div className="flex items-center justify-between px-6 py-4 border-r border-slate-100">
                <span className="text-sm font-semibold text-slate-700">{field}</span>
                <button
                  onClick={() => toggleShow(field)}
                  className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${
                    showFields[field] ? "bg-[#1B2A6B]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                      showFields[field] ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Required Toggle */}
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-semibold text-slate-700">{field}</span>
                <button
                  onClick={() => toggleRequired(field)}
                  className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${
                    requiredFields[field] ? "bg-[#1B2A6B]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                      requiredFields[field] ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Update Button */}
        <div className="px-6 py-5 border-t border-slate-100">
          <button
            onClick={handleUpdate}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-70"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            UPDATE
          </button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
