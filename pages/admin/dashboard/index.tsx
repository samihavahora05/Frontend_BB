import React, { useState } from "react";
import Head from 'next/head';
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import {
  Users, GraduationCap, BookOpen, UserCheck,
  TrendingUp, TrendingDown, Activity,
  Calendar, Briefcase, Award, ArrowUpRight, Zap,
  RefreshCw, BarChart2, Bell, X
} from "lucide-react";
import toast from 'react-hot-toast';
import Link from "next/link";
import { useRouter } from "next/router";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { DashboardService } from "../../../src/lib/api/admin/DashboardService";
import { useGlobalSettings } from "../../../src/contexts/SettingsContext";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const AVATARS_COLORS = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600', 'bg-orange-500'];

// Quick Action Modal
function QuickActionModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const actions = [
    { label: 'Add New Student', icon: Users, href: '/admin/students' },
    { label: 'Create New Course', icon: BookOpen, href: '/admin/courses' },
    { label: 'Add Instructor', icon: GraduationCap, href: '/admin/instructors' },
    { label: 'Post New Job', icon: Briefcase, href: '/admin/jobs' },
    { label: 'View Reports', icon: BarChart2, href: '/admin/analytics' },
    { label: 'Send Notification', icon: Bell, href: '/admin/communication' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-[#0d1635]">Quick Actions</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => {
            const ActionIcon = a.icon;
            return (
              <button key={i} onClick={() => { router.push(a.href); onClose(); }} className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 hover:border-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/10 text-[#1B2A6B] flex items-center justify-center group-hover:bg-[#1B2A6B] group-hover:text-white transition-all">
                  <ActionIcon size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 text-center leading-tight">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [showQuickAction, setShowQuickAction] = useState(false);
  const { settings } = useGlobalSettings();

  // Use SWR for clean data fetching
  const { data: summaryRes, isLoading: isSummaryLoading, mutate: mutateSummary } = DashboardService.useDashboardSummary();
  const { data: chartsRes, mutate: mutateCharts } = DashboardService.useDashboardCharts();
  const { data: feedRes, mutate: mutateFeed } = DashboardService.useActivityFeed();
  const { data: topCoursesRes, mutate: mutateTopCourses } = DashboardService.useTopCourses();
  const { data: recentEnrollsRes, mutate: mutateRecentEnrolls } = DashboardService.useRecentEnrollments();

  const summaryData = summaryRes?.data;
  const chartsData = chartsRes?.data || { enrollments: [], students: [] };
  const feedData = feedRes?.data || [];
  const topCourses = topCoursesRes?.data || [];
  const recentEnrolls = recentEnrollsRes?.data || [];

  const handleRefresh = async () => {
    toast.loading('Refreshing data...', { duration: 1500, id: 'refresh' });
    await Promise.all([
      mutateSummary(),
      mutateCharts(),
      mutateFeed(),
      mutateTopCourses(),
      mutateRecentEnrolls()
    ]);
    toast.success('Dashboard data refreshed!', { id: 'refresh' });
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const stats = summaryData ? [
    { label: 'Total Students', value: formatNumber(summaryData.total_students), change: '+12.5%', up: true, icon: Users, color: 'blue', sub: 'Users on platform', href: '/admin/students' },
    { label: 'Total Leads', value: formatNumber(summaryData.leads?.total || 0), change: '+8.2%', up: true, icon: TrendingUp, color: 'emerald', sub: (summaryData.leads?.new || 0) + ' new leads', href: '/admin/crm/leads' },
    { label: 'Active Courses', value: formatNumber(summaryData.courses?.total || 0), change: '+4.1%', up: true, icon: BookOpen, color: 'violet', sub: (summaryData.courses?.published || 0) + ' published', href: '/admin/courses' },
    { label: 'Enrollments', value: formatNumber(summaryData.enrollments?.total || 0), change: '-1.4%', up: false, icon: UserCheck, color: 'amber', sub: (summaryData.enrollments?.active || 0) + ' active', href: '/admin/education/enrollments' },
    { label: 'Instructors', value: formatNumber(summaryData.total_experts || 0), change: '+6.3%', up: true, icon: GraduationCap, color: 'sky', sub: 'Approved experts', href: '/admin/instructors' },
    { label: 'Jobs Posted', value: formatNumber(summaryData.jobs?.total || 0), change: '+9.4%', up: true, icon: Briefcase, color: 'indigo', sub: (summaryData.jobs?.active || 0) + ' active today', href: '/admin/jobs' },
    { label: 'Internships', value: formatNumber(summaryData.internships?.total || 0), change: '+2.1%', up: true, icon: Zap, color: 'orange', sub: (summaryData.internships?.running || 0) + ' running', href: '/admin/internships' },
    { label: 'Total Companies', value: formatNumber(summaryData.total_companies || 0), change: '+2.1%', up: true, icon: Award, color: 'rose', sub: 'Registered partners', href: '/admin/companies' },
  ] : [];

  const colorMap: Record<string, { text: string; light: string }> = {
    blue: { text: 'text-blue-600', light: 'bg-blue-50' },
    emerald: { text: 'text-emerald-600', light: 'bg-emerald-50' },
    violet: { text: 'text-violet-600', light: 'bg-violet-50' },
    amber: { text: 'text-amber-600', light: 'bg-amber-50' },
    sky: { text: 'text-sky-600', light: 'bg-sky-50' },
    rose: { text: 'text-rose-600', light: 'bg-rose-50' },
    indigo: { text: 'text-indigo-600', light: 'bg-indigo-50' },
    orange: { text: 'text-orange-600', light: 'bg-orange-50' },
  };

  const getStatusStyle = (status: string) => {
    if (status === 'completed') return 'bg-emerald-50 text-emerald-600';
    if (status === 'pending') return 'bg-amber-50 text-amber-600';
    if (status === 'failed') return 'bg-red-50 text-red-600';
    return 'bg-blue-50 text-blue-600';
  };

  // Prepare data for recharts
  const rechartsData = MONTHS.map((m, i) => ({
    name: m,
    enrollments: parseInt(chartsData?.enrollments?.[i]?.count || 0),
    students: parseInt(chartsData?.students?.[i]?.count || 0),
  }));

  return (
    <AdminDashboardLayout>
      <Head><title>Dashboard | Blueboxx DA</title></Head>

      {showQuickAction && <QuickActionModal onClose={() => setShowQuickAction(false)} />}

      <div className="max-w-full p-4 sm:p-5 space-y-4">

        {/* Premium Welcome Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#243580] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-[#C9A227]/10 pointer-events-none" />
          <div>
            <p className="text-[#C9A227] text-xs font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Calendar size={13} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-[32px] md:text-[36px] font-black text-white tracking-tight leading-tight">{settings.admin_welcome_text || 'Welcome back, Admin'}</h1>
            <p className="text-slate-400 text-[15px] mt-1 font-medium">Here's real-time data from your platform.</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Refresh */}
            <button onClick={handleRefresh} disabled={isSummaryLoading} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold">
              <RefreshCw size={14} className={isSummaryLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* 8 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {stats.map((stat, idx) => {
            const c = colorMap[stat.color];
            const StatIcon = stat.icon;
            return (
              <button key={idx} onClick={() => router.push(stat.href)} className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer relative overflow-hidden text-left w-full">
                <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${c.light} opacity-50 group-hover:scale-125 transition-transform duration-500`} />
                <div className="flex items-center justify-between mb-3.5 relative">
                  <div className={`w-9 h-9 rounded-xl ${c.light} ${c.text} flex items-center justify-center`}>
                    <StatIcon size={18} />
                  </div>
                  <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-1 rounded-md ${stat.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                    {stat.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <h3 className={`text-[28px] font-black mt-0.5 leading-none ${c.text}`}>{stat.value}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-2 truncate">{stat.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Chart + Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-black text-[#0d1635]">User Growth & Enrollments</h2>
                <p className="text-[12px] text-slate-400 font-semibold mt-1">Monthly platform metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1B2A6B] inline-block" />Enrollments</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />New Students</span>
                </div>
              </div>
            </div>
            <div className="px-6 pt-5 pb-8 relative" style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={rechartsData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    labelStyle={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 700 }}
                  />
                  <Line type="monotone" dataKey="enrollments" name="Enrollments" stroke="#1B2A6B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="students" name="New Students" stroke="#34d399" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compact Activity Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[20px] font-black text-[#0d1635] flex items-center gap-2">
                <Activity size={20} className="text-[#C9A227]" /> Activity Feed
              </h2>
            </div>
            <div className="divide-y divide-slate-50">
              {feedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <Activity size={24} className="mb-2 opacity-40" />
                  <p className="text-xs font-bold">No activity found</p>
                </div>
              ) : feedData.slice(0, 5).map((act: any, i: number) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toast.success(`Action: ${act.action}`)}>
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Activity size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-700 leading-snug line-clamp-2">
                      <span className="text-[#1B2A6B]">{act.admin?.first_name} {act.admin?.last_name}</span> {act.action}
                      {act.table_name && <span className="text-slate-400 font-semibold"> · {act.table_name}</span>}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">{new Date(act.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Top Courses */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[20px] font-black text-[#0d1635]">Top Performing Courses</h2>
              <Link href="/admin/courses" className="text-[13px] font-black text-[#1B2A6B] hover:text-[#C9A227] transition-colors flex items-center gap-0.5">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {topCourses.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">No courses available.</div>
              ) : topCourses.map((course: any, idx: number) => (
                <div key={course.id} onClick={() => router.push('/admin/courses')} className="flex items-center gap-5 px-6 py-4 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <span className="text-[13px] font-black text-slate-300 w-4 shrink-0">#{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-800 truncate group-hover:text-[#1B2A6B] transition-colors">{course.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#1B2A6B] to-blue-400 rounded-full transition-all" style={{ width: `${Math.min((course.enrollments_count || 0) * 10, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-black text-[#0d1635]">₹{formatNumber(course.price)}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1"><Users size={12} />{course.enrollments_count || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[20px] font-black text-[#0d1635]">Recent Enrollments</h2>
              <Link href="/admin/education/enrollments" className="text-[13px] font-black text-[#1B2A6B] hover:text-[#C9A227] transition-colors flex items-center gap-0.5">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentEnrolls.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">No enrollments yet.</div>
              ) : recentEnrolls.map((enroll: any, idx: number) => (
                <div key={enroll.id} onClick={() => router.push('/admin/education/enrollments')} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full ${AVATARS_COLORS[idx % AVATARS_COLORS.length]} text-white flex items-center justify-center text-[13px] font-black shrink-0 shadow-sm uppercase`}>
                    {enroll.user?.first_name?.[0]}{enroll.user?.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-800 truncate group-hover:text-[#1B2A6B] transition-colors">{enroll.user?.first_name} {enroll.user?.last_name}</p>
                    <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
                      {enroll.items?.map((i: any) => i.course?.title).join(', ') || 'Various items'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(enroll.payment_status)}`}>
                      {enroll.payment_status}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5">{new Date(enroll.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminDashboardLayout>
  );
}
