import React, { useState } from "react";
import { useRouter } from "next/router";
import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Download, Check, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { StudentService } from "../../../../src/lib/api/admin/StudentService";

export default function AdminStudentImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleBrowse = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.txt";
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f) {
        setFile(f);
        toast.success(`File selected: ${f.name}`);
      }
    };
    input.click();
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    setIsImporting(true);
    try {
      await StudentService.importStudents(file);
      toast.success("Students imported successfully!");
      setFile(null);
      router.push('/admin/users/students');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to import students.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csv = "Name,Email,Phone,Gender,Date of Birth,Student Type,Institute\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  return (
    <AdminDashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/users/students" className="hover:text-[#1B2A6B]">Students</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Regular Student Import</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">REGULAR STUDENT IMPORT</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-800">Import Student</h2>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all"
          >
            DOWNLOAD <Download size={13} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleImport} className="p-6 space-y-6">
          {/* File Upload Section */}
          <div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-3">
              BROWSE CSV FILE <span className="text-rose-500">*</span>
            </label>

            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="flex-1 text-sm font-semibold text-slate-500 truncate">
                {file ? file.name : "BROWSE CSV FILE"}
              </span>
              <button
                type="button"
                onClick={handleBrowse}
                className="px-5 py-2 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-xs font-black rounded-lg transition-all"
              >
                BROWSE
              </button>
            </div>

            {file && (
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <Check size={13} />
                {file.name} ({(file.size / 1024).toFixed(1)} KB) ready to import
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-black text-blue-700 mb-1.5">Import Instructions</p>
            <ul className="text-xs font-semibold text-blue-600 space-y-1">
              <li>• Download the template and fill it with student data</li>
              <li>• Accepted formats: .csv</li>
              <li>• Required columns: Name, Email</li>
              <li>• Maximum 500 records per import</li>
              <li>• Duplicate emails will be skipped automatically</li>
            </ul>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isImporting || !file}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-60"
            >
              {isImporting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {isImporting ? "IMPORTING..." : "IMPORT STUDENT"}
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}
