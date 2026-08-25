import React, { useState } from "react";
import Link from "next/link";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Briefcase, Clock, MapPin, Users, Plus, Search, Eye, MoreVertical, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-600",
  Closed: "bg-slate-100 text-slate-600",
};

export default function CompanyJobsPage() {
  const { data, isLoading, mutate } = useSWR("/company/jobs", fetcher);
  
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const companyJobs = data?.data || [];

  const updateJobStatus = async (id: string, status: string) => {
    try {
      await api.put(`/company/jobs/${id}/status`, { status });
      mutate();
      toast.success(`Job marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await api.delete(`/company/jobs/${id}`);
      mutate();
      toast.success("Job deleted");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const filtered = companyJobs.filter((job: any) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && (job.status === "Active" || job.status === "Pending")) ||
      (filter === "closed" && (job.status === "Closed" || job.status === "Rejected"));
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = companyJobs.filter((j: any) => j.status === "Active").length;
  const pendingCount = companyJobs.filter((j: any) => j.status === "Pending").length;
  const totalApplicants = companyJobs.reduce((acc: number, j: any) => acc + (j.applicants || 0), 0);
  const totalViews = companyJobs.reduce((acc: number, j: any) => acc + (j.views || 0), 0);

  return (
    <CompanyDashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">My Postings</h1>
          <p className="text-slate-500 font-medium text-sm">
            Manage your active job and internship listings.
          </p>
        </div>
        <Link
          href="/company/jobs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-colors text-sm shrink-0"
        >
          <Plus size={16} /> Post New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active", value: activeCount, icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
          { label: "Pending Approval", value: pendingCount, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Total Views", value: totalViews > 999 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews, icon: Eye, color: "text-purple-600 bg-purple-50" },
          { label: "Total Applicants", value: totalApplicants, icon: Users, color: "text-blue-600 bg-blue-50" },
        ].map((stat, i) => (
          <AnimatedContent
            key={i}
            direction="up"
            delay={i * 0.1}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active / Pending" },
            { id: "closed", label: "Closed" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                filter === t.id ? "bg-[#1B2A6B] text-white shadow" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
          <div className="col-span-5">Role</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Performance</div>
          <div className="col-span-2 text-center">Posted</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map((job: any, i: number) => (
            <AnimatedContent
              key={job.id}
              direction="up"
              delay={i * 0.05}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors"
            >
              {/* Role Info */}
              <div className="col-span-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/10 flex items-center justify-center shrink-0">
                  <Briefcase size={18} className="text-[#1B2A6B]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 mb-1">{job.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${job.category === "Internship" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {job.category}
                    </span>
                    <span>{job.type}</span>
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> {job.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 flex justify-center">
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded ${STATUS_COLORS[job.status]}`}>
                  {job.status}
                </span>
              </div>

              {/* Performance */}
              <div className="col-span-2 flex flex-col items-center">
                <p className="text-sm font-black text-slate-800">{job.applicants || 0}</p>
                <p className="text-[10px] font-bold text-slate-400">Applicants</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{job.views || 0} views</p>
              </div>

              {/* Posted */}
              <div className="col-span-2 flex justify-center text-xs font-semibold text-slate-500">
                {job.posted}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-center relative">
                <button
                  onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                  className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {menuOpen === job.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                    <div className="absolute right-0 top-10 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                      {job.status === "Active" && (
                        <button
                          onClick={() => { updateJobStatus(job.id, "Closed"); setMenuOpen(null); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          <XCircle size={14} /> Close Posting
                        </button>
                      )}
                      {job.status === "Closed" && (
                        <button
                          onClick={() => { updateJobStatus(job.id, "Pending"); setMenuOpen(null); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          <CheckCircle size={14} /> Re-submit for Approval
                        </button>
                      )}
                      <button
                        onClick={() => { toast.success(`Viewing applicants for "${job.title}"`); setMenuOpen(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <Users size={14} /> View Applicants
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to completely delete "${job.title}"?`)) {
                            deleteJob(job.id);
                          }
                          setMenuOpen(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </AnimatedContent>
          ))}
          {isLoading && (
            <div className="p-12 text-center flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500 font-medium mb-4">No postings found.</p>
              <Link
                href="/company/jobs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl text-sm hover:bg-[#0d1635] transition-colors"
              >
                <Plus size={16} /> Create Your First Posting
              </Link>
            </div>
          )}
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}

