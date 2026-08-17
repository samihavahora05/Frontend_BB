import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { FileText, UploadCloud, CheckCircle2, RefreshCw, Loader2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { DashboardService } from "../../../src/lib/api/intern/DashboardService";

export default function InternResumePage() {
  const { data: resumeRes, mutate } = DashboardService.useResume();
  const resume = resumeRes?.data;
  
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        await DashboardService.uploadResume(file);
        mutate();
        toast.success("Resume uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload resume");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <InternDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 mb-1">Resume & Portfolio</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your documents for 1-click applications.</p>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {resume ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-black text-slate-800">Primary Resume</h2>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg flex items-center gap-1">
                <CheckCircle2 size={12} /> Active
              </span>
            </div>
            <div className="p-5 flex flex-col md:flex-row items-center gap-5">
              <div className="w-16 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                <FileText size={24} className="text-slate-300" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-1" title={resume.name}>{resume.name}</h3>
                <p className="text-xs font-medium text-slate-500 mb-3">Uploaded on {resume.uploaded_at} • {resume.size}</p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <a href={resume.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#1B2A6B] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0d1635] transition-colors shadow-sm">
                    <Eye size={14} /> View
                  </a>
                  <label className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm cursor-pointer">
                    {isUploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><RefreshCw size={14} /> Replace</>}
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUploadClick} disabled={isUploading} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <FileText size={32} />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">No Resume Uploaded</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 max-w-sm">Upload your latest resume to quickly apply for internships.</p>
            <label className="inline-flex items-center gap-2 cursor-pointer bg-[#1B2A6B] hover:bg-[#0d1635] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md">
              {isUploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><UploadCloud size={16} /> Browse Files</>}
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUploadClick} disabled={isUploading} />
            </label>
            <p className="text-[10px] text-slate-400 font-semibold mt-3">PDF, DOC, DOCX. Max size 5MB.</p>
          </div>
        )}
      </div>
    </InternDashboardLayout>
  );
}
