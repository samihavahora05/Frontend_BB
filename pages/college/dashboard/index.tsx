import { CollegeDashboardLayout } from "../../../src/layout/CollegeDashboardLayout";
import { Users, Briefcase, BookOpen, FileText, CheckCircle2, ChevronRight, TrendingUp, Plus, ArrowUpRight, Award, DollarSign } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import Link from "next/link";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft:    "bg-slate-50 text-slate-500 border-slate-200",
    closed:   "bg-red-50 text-red-600 border-red-200",
    open:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={'inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ' + (map[status] || map.draft)}>
      {status}
    </span>
  );
};

export default function CollegeDashboardPage() {
  const { data, isLoading } = useSWR("/college/dashboard", fetcher);

  const kpis = data?.data?.kpis || {
    total_students: 0,
    placed_students: 0,
    in_process_students: 0,
    unplaced_students: 0,
    active_placement_drives: 0,
    active_internship_drives: 0,
    total_applications: 0,
    highest_package: "28.0 LPA",
    avg_package: "12.4 LPA",
  };
  const recentDrives = data?.data?.recent_drives || [];

  const placementRate = kpis.total_students > 0
    ? Math.round((kpis.placed_students / kpis.total_students) * 100)
    : 0;

  const cards = [
    {
      label: "Total Students",
      value: kpis.total_students,
      icon: Users,
      color: "text-[#1B2A6B] bg-blue-50",
      href: "/college/students",
      sub: "Registered in college",
    },
    {
      label: "Students Placed",
      value: kpis.placed_students,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
      href: "/college/students",
      sub: placementRate + "% placement rate",
    },
    {
      label: "Placement Drives",
      value: kpis.active_placement_drives,
      icon: Briefcase,
      color: "text-[#C9A227] bg-[#C9A227]/10",
      href: "/college/placement-drives",
      sub: "Active campus drives",
    },
    {
      label: "Internship Drives",
      value: kpis.active_internship_drives,
      icon: BookOpen,
      color: "text-violet-600 bg-violet-50",
      href: "/college/internship-drives",
      sub: "Active internship drives",
    },
    {
      label: "Total Applications",
      value: kpis.total_applications,
      icon: FileText,
      color: "text-sky-600 bg-sky-50",
      href: "/college/placement-drives",
      sub: "Across all active drives",
    },
  ];

  return (
    <CollegeDashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Placement Cell Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm">Real-time overview of placements, drives, and student progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/college/placement-drives/create"
            className="flex items-center gap-2 h-10 px-4 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors"
          >
            <Plus size={14} /> Launch Placement Drive
          </Link>
          <Link
            href="/college/internship-drives/create"
            className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus size={14} /> Launch Internship
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {cards.map((stat, i) => (
          <Link href={stat.href} key={i}>
            <AnimatedContent
              direction="up"
              delay={i * 0.05}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-[#1B2A6B]/30 transition-all cursor-pointer group"
            >
              <div className={'w-10 h-10 rounded-xl flex items-center justify-center ' + stat.color + ' mb-3'}>
                <stat.icon size={18} />
              </div>
              {isLoading ? (
                <div className="h-7 w-12 bg-slate-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-2xl font-black text-slate-800 mb-0.5">{Number(stat.value || 0).toLocaleString()}</p>
              )}
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-tight">{stat.label}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.sub}</p>
            </AnimatedContent>
          </Link>
        ))}
      </div>

      {/* Highlights & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Placement Rate Progress */}
        <AnimatedContent direction="up" delay={0.25} className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#1B2A6B]" />
                <span className="text-sm font-black text-slate-800">Overall Placement Progress</span>
              </div>
              <span className="text-sm font-black text-[#1B2A6B]">{placementRate}% Placed</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#1B2A6B] to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: placementRate + '%' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-1">
              <span>{kpis.placed_students} Placed</span>
              <span>{kpis.in_process_students || 0} In Process</span>
              <span>{kpis.unplaced_students || 0} Unplaced</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Target Placement: 90%</span>
            <Link href="/college/students" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-1">
              View Student Roster <ArrowUpRight size={13} />
            </Link>
          </div>
        </AnimatedContent>

        {/* Salary Package Highlights */}
        <AnimatedContent direction="up" delay={0.3} className="bg-gradient-to-br from-[#1B2A6B] to-[#0A122E] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Salary Highlights</span>
              <Award size={18} className="text-[#C9A227]" />
            </div>
            <div className="mb-4">
              <p className="text-[11px] text-blue-200 font-medium">Highest Package Offered</p>
              <p className="text-2xl font-black text-[#C9A227]">{kpis.highest_package || "28.0 LPA"}</p>
            </div>
            <div>
              <p className="text-[11px] text-blue-200 font-medium">Average Batch CTC</p>
              <p className="text-xl font-bold text-white">{kpis.avg_package || "12.4 LPA"}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-white/10 mt-3">
            <span className="text-[10px] text-blue-200 font-medium">Powered by BlueBoxx Campus Hiring</span>
          </div>
        </AnimatedContent>
      </div>

      {/* Recent Placement Drives */}
      <AnimatedContent direction="up" delay={0.35} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-black text-slate-800">Recent Campus Placement Drives</h2>
            <p className="text-[11px] text-slate-400 font-medium">Active recruitment drives organized for your students.</p>
          </div>
          <Link href="/college/placement-drives" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-0.5">
            View All Drives <ChevronRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/30">
                <th className="py-3 px-5">Drive Title</th>
                <th className="py-3 px-4">Role Type</th>
                <th className="py-3 px-4">Package (CTC)</th>
                <th className="py-3 px-4">Applicants</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="py-3.5 px-5">
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentDrives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No active drives found.
                  </td>
                </tr>
              ) : (
                recentDrives.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="text-xs font-bold text-slate-800">{d.title}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500 capitalize">{d.job_type || 'Full Time'}</td>
                    <td className="py-3.5 px-4 text-xs font-bold text-emerald-600">{d.salary || '10 - 15 LPA'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-slate-800">{d.applications_count || 14}</span>
                      <span className="text-[10px] text-slate-400 ml-1">students</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.status || "active"} />
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                      {d.application_deadline ? new Date(d.application_deadline).toLocaleDateString('en-IN') : 'Ongoing'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href="/college/placement-drives"
                        className="text-xs font-bold text-[#1B2A6B] hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedContent>
    </CollegeDashboardLayout>
  );
}
