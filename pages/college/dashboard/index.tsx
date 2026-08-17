import { CollegeDashboardLayout } from "../../../src/layout/CollegeDashboardLayout";
import { Users, Briefcase, BookOpen, FileText, CheckCircle2, ChevronRight, TrendingUp } from "lucide-react";
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
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${map[status] || map.draft}`}>
      {status}
    </span>
  );
};

export default function CollegeDashboardPage() {
  const { data, isLoading } = useSWR("/college/dashboard", fetcher);

  const kpis = data?.data?.kpis || {
    total_students: 0,
    placed_students: 0,
    active_placement_drives: 0,
    active_internship_drives: 0,
    total_applications: 0,
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
      sub: `${placementRate}% placement rate`,
    },
    {
      label: "Placement Drives",
      value: kpis.active_placement_drives,
      icon: Briefcase,
      color: "text-[#C9A227] bg-[#C9A227]/10",
      href: "/college/placement-drives",
      sub: "Active drives",
    },
    {
      label: "Internship Drives",
      value: kpis.active_internship_drives,
      icon: BookOpen,
      color: "text-violet-600 bg-violet-50",
      href: "/college/internship-drives",
      sub: "Active drives",
    },
    {
      label: "Total Applications",
      value: kpis.total_applications,
      icon: FileText,
      color: "text-sky-600 bg-sky-50",
      href: "/college/placement-drives",
      sub: "Across all drives",
    },
  ];

  return (
    <CollegeDashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Placement Cell Dashboard</h1>
        <p className="text-slate-500 font-medium text-sm">Real-time overview of placements, drives, and student progress.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((stat, i) => (
          <Link href={stat.href} key={i}>
            <AnimatedContent
              direction="up"
              delay={i * 0.06}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-[#1B2A6B]/30 transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-4`}>
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

      {/* Placement Rate Bar */}
      <AnimatedContent direction="up" delay={0.35} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#1B2A6B]" />
            <span className="text-sm font-black text-slate-800">Overall Placement Rate</span>
          </div>
          <span className="text-sm font-black text-[#1B2A6B]">{placementRate}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1B2A6B] to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${placementRate}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">
          {kpis.placed_students} out of {kpis.total_students} students placed
        </p>
      </AnimatedContent>

      {/* Recent Placement Drives */}
      <AnimatedContent direction="up" delay={0.4} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-black text-slate-800">Recent Placement Drives</h2>
          <Link href="/college/placement-drives" className="text-[11px] font-bold text-[#1B2A6B] hover:underline flex items-center gap-0.5">
            View All <ChevronRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="py-3 px-5">Drive Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="py-3.5 px-5">
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentDrives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Briefcase size={20} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">No placement drives yet</p>
                    <p className="text-xs text-slate-400 mt-1">Create a placement drive to start recruiting.</p>
                    <Link href="/college/placement-drives/create" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#1B2A6B] hover:underline">
                      + Create your first drive
                    </Link>
                  </td>
                </tr>
              ) : (
                recentDrives.map((drive: any) => (
                  <tr key={drive.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Briefcase size={13} className="text-[#1B2A6B]" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{drive.title}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">{drive.job_type || 'Full Time'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-slate-700">{drive.applications_count ?? 0}</span>
                      <span className="text-[10px] text-slate-400 ml-1">apps</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={drive.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                      {drive.application_deadline
                        ? new Date(drive.application_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
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
