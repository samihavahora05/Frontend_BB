import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  Users, GraduationCap, BookOpen, Briefcase, Award, Building2,
  FileText, TrendingUp, TrendingDown, Download, Printer,
  Star, ChevronRight, Filter,
  CheckCircle2, Clock, Activity, Target, Zap, Medal,
  BarChart2, ChevronDown, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import api from '../../../src/lib/axios';

const fetcher = (url: string) => api.get(url).then(res => res.data);

// ── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 60, h = 24;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="2.5" fill={color} />
    </svg>
  );
}

// ── Monthly Bar Chart ─────────────────────────────────────────────────────────
function MonthlyChart({ title, data, color }: { title: string; data: number[]; color: string }) {
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const max = Math.max(...data, 1);
  const isEmpty = data.every(v => v === 0);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-black text-[#0d1635] mb-4">{title}</h3>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-28 text-slate-300">
          <BarChart2 size={32} className="mb-2"/>
          <p className="text-xs font-semibold">No data yet</p>
        </div>
      ) : (
        <div className="flex items-end gap-1.5 h-28">
          {data.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full rounded-t-sm transition-all cursor-pointer relative" style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.85, minHeight: v > 0 ? '4px' : '0' }}>
                {v > 0 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0d1635] text-white text-[8px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">{v}</div>}
              </div>
              <span className="text-[8px] font-bold text-slate-400">{months[i]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Horizontal Bar Widget ─────────────────────────────────────────────────────
function BarWidget({ title, data, colors }: { title: string; data: { label: string; value: number }[]; colors?: string[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const isEmpty = data.every(d => d.value === 0);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-black text-[#0d1635] mb-4">{title}</h3>
      {isEmpty ? (
        <p className="text-xs text-slate-400 font-semibold py-6 text-center">No data available yet</p>
      ) : (
        <div className="space-y-3">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 w-28 truncate shrink-0">{d.label}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.value / max) * 100}%`, background: colors ? colors[i % colors.length] : '#1B2A6B' }} />
              </div>
              <span className="text-[10px] font-black text-slate-700 w-10 text-right">{d.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Leaderboard Row ───────────────────────────────────────────────────────────
function LeaderRow({ rank, name, sub, value, badge, avatarColor }: any) {
  const initials = (name || '??').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-3 py-2.5 hover:bg-slate-50 px-1 rounded-lg transition-colors cursor-pointer">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${rank === 1 ? 'bg-amber-400 text-white' : rank === 2 ? 'bg-slate-400 text-white' : rank === 3 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'}`}>{rank}</span>
      <div className={`w-8 h-8 rounded-full ${avatarColor} text-white flex items-center justify-center text-[10px] font-black shrink-0`}>{initials}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800 truncate">{name}</p>
        <p className="text-[9px] text-slate-400 font-semibold truncate">{sub}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-black text-[#1B2A6B]">{value}</p>
        {badge && <span className="text-[8px] font-bold text-amber-500">{badge}</span>}
      </div>
    </div>
  );
}

const TAB_ICONS: Record<string, any> = { student: Users, instructor: GraduationCap, institution: Building2, internship: Briefcase, placement: Target };
const TAB_COLORS: Record<string, string> = { student: '#3B82F6', instructor: '#8B5CF6', institution: '#0EA5E9', internship: '#F59E0B', placement: '#10B981' };

const SPARK_FALLBACK = [1, 2, 3, 4, 3, 5, 4, 6, 5, 7, 6, 8];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab]   = useState('student');
  const [dateRange, setDateRange]   = useState('Last 30 Days');

  // ── Real API calls ────────────────────────────────────────────────────────
  const { data: summaryRes, mutate: mutateSummary } = useSWR('/admin/analytics/summary', fetcher);
  const { data: leaderboardsRes }  = useSWR('/admin/analytics/leaderboards', fetcher);
  const { data: tabStatsRes }      = useSWR(`/admin/analytics/tab-stats?tab=${activeTab}`, fetcher);
  const { data: chartMonthlyRes }  = useSWR(`/admin/analytics/chart-data?tab=${activeTab}&metric=registrations`, fetcher);
  const { data: chart2Res }        = useSWR(`/admin/analytics/chart-data?tab=${activeTab}&metric=completions`, fetcher);
  const { data: recentRes }        = useSWR('/admin/analytics/recent-activity', fetcher);

  const rawStats       = summaryRes?.data || {};
  const tabCards: any[]= tabStatsRes?.data || [];
  const chart1Data     = chartMonthlyRes?.data || SPARK_FALLBACK;
  const chart2Data     = chart2Res?.data || SPARK_FALLBACK;
  const recentActivity = recentRes?.data || [];

  const dbTopStudents = leaderboardsRes?.data?.top_students || [];
  const dbTopColleges = leaderboardsRes?.data?.top_colleges || [];

  const s = rawStats;
  const summaryCards = [
    { icon: Users,        label: 'Total Students',    value: (s.students ?? 0).toLocaleString(),          change: '↑', up: true,  color: '#3B82F6', spark: SPARK_FALLBACK },
    { icon: GraduationCap,label: 'Total Instructors',  value: (s.instructors ?? 0).toLocaleString(),       change: '↑', up: true,  color: '#8B5CF6', spark: SPARK_FALLBACK },
    { icon: Building2,    label: 'Institutions',       value: (s.colleges ?? 0).toLocaleString(),          change: '↑', up: true,  color: '#0EA5E9', spark: SPARK_FALLBACK },
    { icon: Briefcase,    label: 'Active Internships', value: (s.activeInternships ?? 0).toLocaleString(), change: '—', up: false, color: '#F59E0B', spark: SPARK_FALLBACK },
    { icon: Target,       label: 'Active Jobs',        value: (s.activeJobs ?? 0).toLocaleString(),        change: '↑', up: true,  color: '#10B981', spark: SPARK_FALLBACK },
    { icon: BookOpen,     label: 'Total Courses',      value: (s.totalCourses ?? 0).toLocaleString(),      change: '↑', up: true,  color: '#6366F1', spark: SPARK_FALLBACK },
    { icon: Award,        label: 'Certificates',       value: (s.certificates ?? 0).toLocaleString(),      change: '↑', up: true,  color: '#EC4899', spark: SPARK_FALLBACK },
    { icon: FileText,     label: 'Applications',       value: (s.applications ?? 0).toLocaleString(),      change: '↑', up: true,  color: '#14B8A6', spark: SPARK_FALLBACK },
  ];

  const tabs = [
    { id: 'student',     label: 'Student Performance',     icon: Users },
    { id: 'instructor',  label: 'Instructor Performance',  icon: GraduationCap },
    { id: 'institution', label: 'Institution Performance', icon: Building2 },
    { id: 'internship',  label: 'Internship Performance',  icon: Briefcase },
    { id: 'placement',   label: 'Placement Performance',   icon: Target },
  ];

  const handleExport = (type: 'pdf' | 'excel') => {
    toast.success(`Preparing ${type.toUpperCase()}…`);
    setTimeout(() => toast.success(`${type.toUpperCase()} ready!`), 1500);
  };

  return (
    <AdminDashboardLayout>
      <Head><title>Reports & Analytics | Blueboxx DA</title></Head>
      <div className="max-w-full p-4 sm:p-6 space-y-5">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2"><BarChart2 size={24} className="text-[#1B2A6B]" /> Reports & Analytics</h1>
            <p className="text-slate-500 text-sm mt-1 font-semibold">Monitor student, instructor, institution, internship, and placement performance.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
              <Filter size={13} className="text-slate-400"/>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none">
                <option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 3 Months</option><option>This Year</option>
              </select>
              <ChevronDown size={12} className="text-slate-400"/>
            </div>
            <button onClick={() => mutateSummary()} className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">
              <RefreshCw size={13}/> Refresh
            </button>
            <button onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-colors">
              <Download size={13}/> Export PDF
            </button>
            <button onClick={() => handleExport('excel')} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-colors">
              <Download size={13}/> Excel
            </button>
            <button onClick={() => { toast.success('Printing…'); window.print(); }} className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">
              <Printer size={13}/> Print
            </button>
          </div>
        </div>

        {/* ── Summary KPIs ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {summaryCards.map((c, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-pointer">
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: c.color }} />
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.color + '20', color: c.color }}><c.icon size={16}/></div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${c.up ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                  {c.up ? <TrendingUp size={8}/> : <TrendingDown size={8}/>} {c.change}
                </span>
              </div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
              <h3 className="text-base font-black mt-0.5" style={{ color: c.color }}>{c.value}</h3>
              <div className="mt-2"><Sparkline data={c.spark} color={c.color}/></div>
            </div>
          ))}
        </div>

        {/* ── Performance Tabs ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 overflow-x-auto">
            <div className="flex px-4 gap-1 pt-2 min-w-max">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-black rounded-t-xl border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-[#1B2A6B] text-[#1B2A6B] bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  <tab.icon size={14}/> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Sub-KPI cards from real API */}
            {tabCards.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 animate-pulse">
                    <div className="w-9 h-9 bg-slate-200 rounded-xl mb-3"/>
                    <div className="h-2 bg-slate-200 rounded w-3/4 mb-2"/>
                    <div className="h-5 bg-slate-200 rounded w-1/2"/>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid gap-3 ${tabCards.length <= 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
                {tabCards.map((c: any, i: number) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-slate-200 hover:bg-white transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: c.color + '15', color: c.color }}>
                      {React.createElement(TAB_ICONS[activeTab] || Users, { size: 18 })}
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
                    <h4 className="text-xl font-black mt-0.5" style={{ color: c.color }}>{(c.value ?? 0).toLocaleString()}</h4>
                  </div>
                ))}
              </div>
            )}

            {/* Charts (monthly from API, horizontal bars use tab card data) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MonthlyChart
                title={activeTab === 'student' ? 'Monthly Enrollments' : activeTab === 'internship' ? 'Monthly Internship Applications' : activeTab === 'placement' ? 'Monthly Placements' : 'Monthly Activity'}
                data={chart1Data}
                color={TAB_COLORS[activeTab] || '#1B2A6B'}
              />
              <MonthlyChart
                title={activeTab === 'student' ? 'Monthly Course Completions' : 'Monthly Trend'}
                data={chart2Data}
                color="#10B981"
              />
              {tabCards.length > 0 && (
                <BarWidget
                  title={`${tabs.find(t => t.id === activeTab)?.label} Breakdown`}
                  data={tabCards.map((c: any) => ({ label: c.label, value: typeof c.value === 'string' ? parseFloat(c.value) || 0 : c.value || 0 }))}
                  colors={tabCards.map((c: any) => c.color || '#1B2A6B')}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Leaderboards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-black text-[#0d1635] flex items-center gap-2"><Medal size={16} className="text-[#C9A227]"/> Leaderboards</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="p-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Users size={11}/> Top Students</p>
                {dbTopStudents.length > 0 ? (
                  dbTopStudents.map((s: any, i: number) => <LeaderRow key={i} rank={i+1} {...s}/>)
                ) : (
                  <p className="text-slate-400 text-xs font-semibold py-6 text-center">No students yet</p>
                )}
              </div>
              <div className="p-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Building2 size={11}/> Top Colleges</p>
                {dbTopColleges.length > 0 ? (
                  dbTopColleges.map((c: any, i: number) => <LeaderRow key={i} rank={i+1} {...c}/>)
                ) : (
                  <p className="text-slate-400 text-xs font-semibold py-6 text-center">No colleges registered yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-black text-[#0d1635] flex items-center gap-2"><Activity size={15} className="text-[#C9A227]"/> Recent Activity</h2>
            </div>
            <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-80">
              {recentActivity.length > 0 ? (
                recentActivity.map((a: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <Activity size={14}/>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-700 truncate">{a.text}</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                  <Activity size={32} className="mb-2"/>
                  <p className="text-xs font-semibold text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminDashboardLayout>
  );
}
