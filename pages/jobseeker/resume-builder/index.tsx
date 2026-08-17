import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { FileText, Wand2, ArrowRight } from "lucide-react";

export default function ResumeBuilderPage() {
  return (
    <JobseekerDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] mb-2">AI Resume Builder</h1>
        <p className="text-slate-500 font-medium text-sm">Create an ATS-friendly resume optimized for top tech companies.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center max-w-3xl mx-auto mt-12">
        <div className="w-20 h-20 bg-gradient-to-br from-[#C9A227] to-amber-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#C9A227]/30">
          <Wand2 size={32} className="text-[#0d1635]" />
        </div>
        <h2 className="text-3xl font-black text-[#0d1635] mb-4">Craft Your Perfect Resume</h2>
        <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
          Our AI analyzes job descriptions and your profile to generate a tailored resume that gets past ATS filters and catches recruiters' eyes.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
            <FileText size={18} /> Start from Scratch
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
            Import LinkedIn Profile <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </JobseekerDashboardLayout>
  );
}
