import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Briefcase, MapPin, Users, Edit3, Trash2, ArrowLeft, Loader2, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  closed: "bg-slate-100 text-slate-600",
  expired: "bg-red-100 text-red-600",
};

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { data: jobData, isLoading: jobLoading } = useSWR(id ? `/company/jobs/${id}` : null, fetcher);
  
  // We can fetch applicants for this specific job, or just use the job's relationships if returned
  // For now, let's just show job details
  const job = jobData?.data;

  const deleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/company/jobs/${id}`);
      toast.success("Job deleted");
      router.push("/company/jobs");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (jobLoading) {
    return (
      <CompanyDashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (!job) {
    return (
      <CompanyDashboardLayout>
        <div className="text-center py-20">
          <p className="text-slate-500 mb-4">Job not found.</p>
          <Link href="/company/jobs" className="text-[#1B2A6B] font-bold">Go Back</Link>
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
          <ArrowLeft size={16} /> Back to Postings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedContent direction="up" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1B2A6B]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 relative z-10">
              <div className="flex gap-5 items-start">
                <div className="w-16 h-16 rounded-2xl bg-[#1B2A6B]/10 flex items-center justify-center shrink-0">
                  <Briefcase size={28} className="text-[#1B2A6B]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-800 mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                      {job.employment_type}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                      <MapPin size={12} /> {job.location || job.remote_type}
                    </span>
                    <span className={`px-2.5 py-1 uppercase tracking-wider rounded-lg ${STATUS_COLORS[job.status] || "bg-slate-100 text-slate-600"}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href={`/company/jobs/edit/${job.id}`}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Edit3 size={18} />
                </Link>
                <button
                  onClick={deleteJob}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Salary</p>
                <p className="text-sm font-black text-slate-800">
                  {job.salary_min && job.salary_max ? `₹${job.salary_min} - ₹${job.salary_max}` : "Undisclosed"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Experience</p>
                <p className="text-sm font-black text-slate-800">{job.experience_level}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vacancies</p>
                <p className="text-sm font-black text-slate-800">{job.vacancies}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Applicants</p>
                <p className="text-sm font-black text-[#1B2A6B]">{job.applications_count || 0}</p>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black text-slate-800 mb-4">Job Description</h2>
            <div className="prose prose-sm prose-slate max-w-none text-slate-600">
              {job.description?.split('\\n').map((p: string, i: number) => (
                <p key={i} className="mb-4">{p}</p>
              ))}
            </div>

            {job.required_skills && JSON.parse(job.required_skills).length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(job.required_skills).map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-[#1B2A6B]/5 text-[#1B2A6B] text-xs font-bold rounded-lg border border-[#1B2A6B]/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </AnimatedContent>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <AnimatedContent direction="up" delay={0.2} className="bg-[#1B2A6B] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-lg font-black mb-6">Quick Stats</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users size={18} className="text-blue-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-200">Total Applied</p>
                    <p className="text-xl font-black">{job.applications_count || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <CheckCircle size={18} className="text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-200">Shortlisted</p>
                    <p className="text-xl font-black">0</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Link 
              href={`/company/applicants?job=${job.id}`}
              className="mt-8 w-full block text-center px-4 py-3 bg-white text-[#1B2A6B] font-black rounded-xl hover:bg-slate-50 transition-colors"
            >
              View All Applicants
            </Link>
          </AnimatedContent>
          
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Job Posted</p>
                  <p className="text-[10px] font-semibold text-slate-500">{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Deadline</p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : "No deadline set"}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
