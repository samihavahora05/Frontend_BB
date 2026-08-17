import React from "react";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { ArrowUpRight, Users, Eye, TrendingUp, Briefcase, Clock, CheckCircle2, Loader2 } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CompanyAnalyticsPage() {
  const { data, isLoading } = useSWR("/company/analytics", fetcher);

  if (isLoading) {
    return (
      <CompanyDashboardLayout>
        <div className="flex h-full items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#1B2A6B] animate-spin" />
        </div>
      </CompanyDashboardLayout>
    );
  }

  const analytics = data?.data || {
    jobs: { active: 0, pending: 0, closed: 0, recent: [] },
    applicants: { total: 0, pipeline: [], rates: { conversion: 0, interview: 0, avg_match: 0 }, top: [] },
    interviews: { upcoming: 0, completed: 0 }
  };

  const { jobs, applicants, interviews } = analytics;

  const stats = [
    { label: "Total Applicants", value: applicants.total, trend: "+live", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Jobs", value: jobs.active, trend: jobs.pending > 0 ? `+${jobs.pending} pending` : "—", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Offer Rate", value: `${applicants.rates.conversion}%`, trend: "+live", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg AI Match", value: `${applicants.rates.avg_match}%`, trend: "AI-scored", icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const pipeline = applicants.pipeline.length > 0 ? applicants.pipeline : [
    { stage: "Applied", count: 0, color: "bg-slate-400" },
    { stage: "In Review", count: 0, color: "bg-amber-400" },
    { stage: "Interview", count: 0, color: "bg-blue-500" },
    { stage: "Offer", count: 0, color: "bg-emerald-500" },
    { stage: "Rejected", count: 0, color: "bg-red-400" },
  ];
  const maxPipeline = Math.max(...pipeline.map((p: any) => p.count), 1);

  return (
    <CompanyDashboardLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Analytics</h1>
          <p className="text-slate-500 font-medium text-sm">Live recruitment performance metrics.</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Data
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-black text-slate-800 leading-none">{stat.value}</h3>
                <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md mb-0.5">
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </AnimatedContent>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Funnel */}
        <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#1B2A6B]" /> Recruitment Funnel
          </h3>
          <div className="space-y-4">
            {pipeline.map((p: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>{p.stage}</span>
                  <span className="text-slate-500">{p.count} candidates</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${p.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(p.count / maxPipeline) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <div className="text-lg font-black text-slate-800">{applicants.rates.interview}%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Interview Rate</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <div className="text-lg font-black text-slate-800">{applicants.rates.conversion}%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Offer Rate</div>
            </div>
          </div>
        </AnimatedContent>

        {/* Job Posting Status */}
        <AnimatedContent direction="up" delay={0.4} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Briefcase size={16} className="text-[#1B2A6B]" /> Your Job Postings
          </h3>

          {jobs.recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Briefcase size={32} className="mb-3 opacity-50" />
              <p className="text-sm font-medium">No postings yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.recent.map((job: any) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{job.title}</p>
                    <p className="text-[10px] font-bold text-slate-400">{job.category} • {job.applicants} applicants</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-sm ${job.status === "Active" ? "bg-emerald-100 text-emerald-700" : job.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <div className="text-xl font-black text-emerald-700">{jobs.active}</div>
              <div className="text-[10px] font-bold text-emerald-600 mt-1">Active</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <div className="text-xl font-black text-amber-700">{jobs.pending}</div>
              <div className="text-[10px] font-bold text-amber-600 mt-1">Pending</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl font-black text-slate-700">{jobs.closed}</div>
              <div className="text-[10px] font-bold text-slate-500 mt-1">Closed</div>
            </div>
          </div>
        </AnimatedContent>

        {/* Interview Stats */}
        <AnimatedContent direction="up" delay={0.5} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock size={16} className="text-[#1B2A6B]" /> Interview Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div>
                <p className="text-2xl font-black text-blue-700">{interviews.upcoming}</p>
                <p className="text-xs font-bold text-blue-600 mt-1">Upcoming Interviews</p>
              </div>
              <Clock size={28} className="text-blue-400 opacity-60" />
            </div>
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div>
                <p className="text-2xl font-black text-emerald-700">{interviews.completed}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1">Completed Interviews</p>
              </div>
              <CheckCircle2 size={28} className="text-emerald-400 opacity-60" />
            </div>
          </div>
        </AnimatedContent>

        {/* Top Applicants */}
        <AnimatedContent direction="up" delay={0.6} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-[#1B2A6B]" /> Top Candidates by AI Match
          </h3>
          {applicants.top.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Users size={32} className="mb-3 opacity-50" />
              <p className="text-sm font-medium">No applicants yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.top.map((app: any, i: number) => (
                  <div key={app.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 shrink-0">
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B2A6B]/10 to-[#2E45A3]/10 flex items-center justify-center text-[#1B2A6B] font-black text-xs shrink-0">
                      {app.name ? app.name.split(" ").map((n: string) => n[0]).join("") : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-tight truncate">{app.name}</p>
                      <p className="text-[10px] font-semibold text-slate-400 truncate">{app.role}</p>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${app.match >= 90 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {app.match}%
                    </span>
                  </div>
                ))}
            </div>
          )}
        </AnimatedContent>
      </div>
    </CompanyDashboardLayout>
  );
}
