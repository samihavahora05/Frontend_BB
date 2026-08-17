import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Mail, Phone, ExternalLink, ArrowLeft, Download, FileText, CheckCircle, Loader2 } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ApplicantDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { data: applicantData, isLoading } = useSWR(id ? `/company/applicants/${id}` : null, fetcher);
  const applicant = applicantData?.data;

  if (isLoading) {
    return (
      <CompanyDashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (!applicant) {
    return (
      <CompanyDashboardLayout>
        <div className="text-center py-20">
          <p className="text-slate-500 mb-4">Applicant not found.</p>
          <Link href="/company/applicants" className="text-[#1B2A6B] font-bold">Go Back</Link>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Applicants
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header Profile */}
          <AnimatedContent direction="up" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1B2A6B]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
            
            <div className="flex flex-col sm:flex-row gap-6 relative z-10 items-start">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1B2A6B]/10 to-[#2E45A3]/10 flex items-center justify-center text-[#1B2A6B] font-black text-3xl shrink-0">
                {applicant.user?.name?.split(" ").map((n: string) => n[0]).join("") || "A"}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h1 className="text-2xl font-black text-slate-800 mb-1">{applicant.user?.name}</h1>
                    <p className="text-sm font-bold text-slate-500 mb-4">Applied for: <span className="text-[#1B2A6B]">{applicant.job?.title}</span></p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-wider rounded-lg">
                    {applicant.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${applicant.user?.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100">
                    <Mail size={14} /> {applicant.user?.email}
                  </a>
                  {applicant.user?.profile?.phone && (
                    <a href={`tel:${applicant.user?.profile?.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100">
                      <Phone size={14} /> {applicant.user?.profile?.phone}
                    </a>
                  )}
                  {applicant.portfolioUrl && (
                    <a href={applicant.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A6B]/10 border border-transparent rounded-lg text-xs font-bold text-[#1B2A6B] hover:bg-[#1B2A6B]/20">
                      <ExternalLink size={14} /> Portfolio
                    </a>
                  )}
                  {applicant.githubUrl && (
                    <a href={applicant.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A6B]/10 border border-transparent rounded-lg text-xs font-bold text-[#1B2A6B] hover:bg-[#1B2A6B]/20">
                      <ExternalLink size={14} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* Education & Experience */}
          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Education</h3>
              {applicant.user?.education?.length > 0 ? (
                <div className="space-y-4">
                  {applicant.user.education.map((edu: any) => (
                    <div key={edu.id} className="relative pl-4 border-l-2 border-slate-200">
                      <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[5px] top-1.5"></div>
                      <h4 className="text-sm font-bold text-slate-800">{edu.degree}</h4>
                      <p className="text-xs font-bold text-slate-500">{edu.institution} • {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 font-medium">No education details provided.</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Experience</h3>
              {applicant.user?.experience?.length > 0 ? (
                <div className="space-y-4">
                  {applicant.user.experience.map((exp: any) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                      <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[5px] top-1.5"></div>
                      <h4 className="text-sm font-bold text-slate-800">{exp.job_title}</h4>
                      <p className="text-xs font-bold text-slate-500">{exp.company_name} • {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}</p>
                      {exp.description && <p className="text-sm text-slate-600 mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 font-medium">No experience details provided.</p>
              )}
            </div>
          </AnimatedContent>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Resume Download */}
          <AnimatedContent direction="up" delay={0.2} className="bg-[#1B2A6B] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-black mb-1">Candidate Resume</h3>
              <p className="text-xs text-blue-200 mb-6">Review the candidate's full profile.</p>
              
              {applicant.resumeUrl ? (
                <a 
                  href={applicant.resumeUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#1B2A6B] font-black rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Download size={18} /> Download Resume
                </a>
              ) : (
                <div className="w-full flex items-center justify-center px-4 py-3 bg-white/10 text-white/50 font-black rounded-xl">
                  No Resume Attached
                </div>
              )}
            </div>
          </AnimatedContent>

          {/* Activity Timeline */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Applied</p>
                  <p className="text-[10px] font-semibold text-slate-500">{applicant.appliedAt}</p>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
