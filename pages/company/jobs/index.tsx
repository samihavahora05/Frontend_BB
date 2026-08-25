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
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Pending Approval": "bg-amber-50 text-amber-700 border border-amber-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200",
  Closed: "bg-slate-100 text-slate-600 border border-slate-200",
  Draft: "bg-slate-100 text-slate-600 border border-slate-200",
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
    const st = (job.status || "").toLowerCase();
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && (st === "active" || st.includes("pending"))) ||
      (filter === "closed" && (st === "closed" || st === "rejected"));
    const matchesSearch = (job.title || "").toLowerCase().includes(search.toLowerCase()) ||
                          (job.location || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = companyJobs.filter((j: any) => (j.status || "").toLowerCase() === "active").length;
  const pendingCount = companyJobs.filter((j: any) => (j.status || "").toLowerCase().includes("pending")).length;
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

      {/* Stats Cards */}
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
            delay={i * 0.08}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none mb-1.5">{stat.value}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active / Pending" },
            { id: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filter === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search roles or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Jobs Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Job Role</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Performance</th>
                <th className="py-4 px-6 text-center">Posted</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B] mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-400">Loading your postings...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-400 border border-slate-100">
                      <Briefcase size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">No postings found</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">You have not posted any jobs under this filter yet.</p>
                    <Link
                      href="/company/jobs/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#0d1635] transition-colors"
                    >
                      <Plus size={14} /> Post Your First Job
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((job: any) => {
                  const empType = job.employment_type || job.category || "Full-Time";
                  const isIntern = empType.toLowerCase() === "internship";
                  const loc = job.location || job.remote_type || "On-site";
                  const statusClass = STATUS_COLORS[job.status] || "bg-slate-100 text-slate-700 border border-slate-200";

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Role Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-100 text-[#1B2A6B] flex items-center justify-center shrink-0">
                            <Briefcase size={18} />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-800 group-hover:text-[#1B2A6B] transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                isIntern ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {empType}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <MapPin size={12} className="text-slate-400" />
                                {loc}
                              </span>
                              {job.salary && job.salary !== 'Competitive' && (
                                <span className="text-xs font-bold text-emerald-600">
                                  • {job.salary}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${statusClass}`}>
                          {job.status}
                        </span>
                      </td>

                      {/* Performance Column */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-black text-slate-800">{job.applicants || 0}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applicants</span>
                          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{job.views || 0} views</span>
                        </div>
                      </td>

                      {/* Posted Column */}
                      <td className="py-4 px-6 text-center">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                          {job.posted}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                          className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors inline-flex items-center justify-center"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {menuOpen === job.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                            <div className="absolute right-6 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 text-left overflow-hidden">
                              {job.status === "Active" && (
                                <button
                                  onClick={() => { updateJobStatus(job.id, "Closed"); setMenuOpen(null); }}
                                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                  <XCircle size={14} className="text-amber-500" /> Close Posting
                                </button>
                              )}
                              {job.status === "Closed" && (
                                <button
                                  onClick={() => { updateJobStatus(job.id, "Pending"); setMenuOpen(null); }}
                                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                  <CheckCircle size={14} className="text-emerald-500" /> Re-submit for Review
                                </button>
                              )}
                              <Link
                                href="/company/applicants"
                                onClick={() => setMenuOpen(null)}
                                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                              >
                                <Users size={14} className="text-blue-500" /> View Applicants ({job.applicants || 0})
                              </Link>
                              <div className="h-px bg-slate-100 my-1" />
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
                                    deleteJob(job.id);
                                  }
                                  setMenuOpen(null);
                                }}
                                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 size={14} /> Delete Job
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
