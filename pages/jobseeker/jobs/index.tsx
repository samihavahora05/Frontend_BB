import React, { useState, useEffect } from "react";
import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { SEO } from "../../../src/components/seo/SEO";
import { 
  Search, Filter, MapPin, Briefcase, DollarSign, Building2, Clock, 
  ChevronRight, Bookmark, BookmarkCheck, CheckCircle2, ArrowUpRight, Sparkles, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../src/context/AuthContext";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function JobseekerJobsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [savingId, setSavingId] = useState<number | null>(null);

  // Fetch all active jobs (same API that students see)
  const { data: jobsRes, isLoading } = useSWR("/public/jobs", fetcher);
  // Fetch user applications to know what they already applied to
  const { data: appsRes } = useSWR("/jobseeker/applications", fetcher);
  // Fetch saved jobs
  const { data: wishlistRes } = useSWR("/student/wishlist", fetcher);

  const rawJobs = Array.isArray(jobsRes?.data) ? jobsRes.data : (Array.isArray(jobsRes) ? jobsRes : []);
  const appliedJobIds = new Set(
    (appsRes?.data || []).map((app: any) => String(app.job_id || app.id))
  );
  const savedJobIds = new Set(
    (wishlistRes?.data?.saved_job_ids || wishlistRes?.saved_job_ids || []).map((id: any) => Number(id))
  );

  const handleToggleSave = async (jobId: number) => {
    setSavingId(jobId);
    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        await api.delete(`/student/save/job/${jobId}`);
        toast.success("Job removed from saved list");
      } else {
        await api.post(`/student/save/job/${jobId}`);
        toast.success("Job saved successfully!");
      }
      mutate("/student/wishlist");
    } catch {
      toast.error("Could not update bookmark.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredJobs = rawJobs.filter((job: any) => {
    const titleMatch = (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (job.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (job.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = selectedType === "All" || (job.job_type || job.employment_type || "").toLowerCase().includes(selectedType.toLowerCase());
    return titleMatch && typeMatch;
  });

  return (
    <JobseekerDashboardLayout>
      <SEO title="Explore Career Opportunities | Job Seeker Portal" description="Browse and apply directly to verified corporate jobs." />
      
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#0d1635] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A227]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C9A227] text-xs font-bold mb-3 backdrop-blur-sm">
            <Sparkles size={14} /> Active Career Openings
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Explore Corporate Tech & Business Jobs</h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Browse all live positions, view requirements, and apply directly to companies hiring right now.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, or location..."
              className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] transition-all"
            />
          </div>

          {/* Job Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["All", "Full-time", "Part-time", "Remote", "Internship", "Contract"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? "bg-[#1B2A6B] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid / List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            Available Positions ({filteredJobs.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B] mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-600">Loading career opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
              <Briefcase size={28} />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">No Jobs Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              We couldn't find any positions matching your current search criteria. Try clearing filters.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedType("All"); }}
              className="px-5 py-2 bg-[#1B2A6B] text-white rounded-xl text-xs font-bold hover:bg-[#0d1635] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job: any) => {
              const isApplied = appliedJobIds.has(String(job.id));
              const isSaved = savedJobIds.has(Number(job.id));
              const companyName = job.company_name || "Enterprise Partner";
              const salaryText = job.hide_salary
                ? "Salary Undisclosed"
                : (job.salary_min && job.salary_max
                    ? `₹${job.salary_min} - ₹${job.salary_max} LPA`
                    : (job.salary_min ? `₹${job.salary_min} LPA+` : "Best in Industry"));

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#1B2A6B]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Company & Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {job.company_logo ? (
                          <img src={job.company_logo} alt={companyName} className="w-11 h-11 rounded-xl object-contain border border-slate-100 p-1 shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#1B2A6B] flex items-center justify-center font-black text-base shrink-0">
                            {companyName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-black text-slate-800 line-clamp-1 group-hover:text-[#1B2A6B] transition-colors">
                            {job.title || "Software Engineer"}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Building2 size={12} className="text-slate-400" /> {companyName}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleSave(job.id)}
                        disabled={savingId === job.id}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved 
                            ? "bg-amber-50 border-amber-200 text-[#C9A227]" 
                            : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                        }`}
                        title={isSaved ? "Saved" : "Save Job"}
                      >
                        {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                    </div>

                    {/* Tags & Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" /> {job.location || "Multiple Locations"}
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50 text-[#1B2A6B] rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <Briefcase size={12} className="text-blue-500" /> {job.job_type || "Full-time"}
                      </span>
                      {job.experience_level && (
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-bold">
                          {job.experience_level}
                        </span>
                      )}
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <DollarSign size={12} className="text-emerald-500" /> {salaryText}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {job.posted_at || "Recently Posted"}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors"
                      >
                        View Details
                      </Link>

                      {isApplied ? (
                        <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Applied
                        </span>
                      ) : (
                        <Link
                          href={`/apply/job/${job.id}`}
                          className="px-4 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1"
                        >
                          Apply Now <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </JobseekerDashboardLayout>
  );
}
