import React, { useState } from "react";
import { X, Upload, Send, Building, MapPin } from "lucide-react";
import { Button } from "../ui/Button";
import api from "../../lib/axios";
import toast from "react-hot-toast";

interface ApplyModalProps {
  internship: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ internship, isOpen, onClose, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !internship) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (coverLetter) formData.append("cover_letter", coverLetter);
      if (portfolioUrl) formData.append("portfolio_url", portfolioUrl);
      if (resumeFile) formData.append("resume", resumeFile);
      formData.append("source_page", "Live Projects Apply Modal");
      if (internship?.title) formData.append("application_type", internship.title);

      const res = await api.post(`/public/internships/${internship.id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Application submitted successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to submit application.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error submitting application. Please login first.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#0d1635] text-white p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#C9A227] inline-block mb-2">
            Quick Application
          </span>
          <h2 className="text-xl font-black text-white">{internship.title}</h2>
          <p className="text-xs text-slate-300 font-semibold mt-1 flex items-center gap-1.5">
            <Building size={14} className="text-[#C9A227]" /> {internship.company_name} • <MapPin size={14} /> {internship.location}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Resume (PDF or DOCX)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#1B2A6B] bg-slate-50/50 transition-colors relative cursor-pointer">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              />
              <Upload size={24} className="text-[#1B2A6B] mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-700">
                {resumeFile ? resumeFile.name : "Click or drag to upload your updated CV / Resume"}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">PDF up to 5MB</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Portfolio / GitHub URL (Optional)
            </label>
            <input 
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/username or https://myportfolio.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Cover Letter / Why should we hire you?
            </label>
            <textarea 
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly describe your relevant skills, past projects, and motivation..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-11 px-5 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-6 bg-[#0d1635] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md gap-2"
            >
              {isSubmitting ? "Submitting..." : <>Submit Application <Send size={14} /></>}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
