import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { AnalyticsService } from '../../../src/lib/api/admin/AnalyticsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, Users, GraduationCap, Building, Briefcase, Award, LayoutDashboard, Download } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('student');
  const [activeMetric, setActiveMetric] = useState(getInitialMetric(activeTab));

  const { data: summary, isLoading: isLoadingSummary } = AnalyticsService.useSummary();
  const { data: tabStats, isLoading: isLoadingStats } = AnalyticsService.useTabStats(activeTab);
  const { data: chartData, isLoading: isLoadingChart } = AnalyticsService.useChartData(activeTab, activeMetric);
  const { data: leaderboards, isLoading: isLoadingLeaders } = AnalyticsService.useLeaderboards();
  const { data: recentActivity, isLoading: isLoadingActivity } = AnalyticsService.useRecentActivity();

  function getInitialMetric(tab: string) {
    switch (tab) {
      case 'student': return 'registrations';
      case 'instructor': return 'courses';
      case 'internship': return 'applications';
      case 'placement': return 'placements';
      default: return 'registrations';
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveMetric(getInitialMetric(tab));
  };

  // Format chart data for Recharts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedChartData = chartData ? chartData.map((val: number, i: number) => ({
    name: months[i],
    value: val
  })) : [];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Reports & Analytics | BlueBoxx DA</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <BarChart3 size={28} className="text-[#C9A227]" /> Platform Analytics
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Comprehensive reports, growth metrics, and platform usage data.</p>
          </div>
        </div>

        {/* Global KPI Cards */}
        {isLoadingSummary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl"></div>)}
          </div>
        ) : summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard title="Total Students" value={summary.students} icon={<Users size={20} className="text-blue-600" />} bg="bg-blue-50" />
            <KpiCard title="Expert Instructors" value={summary.instructors} icon={<GraduationCap size={20} className="text-purple-600" />} bg="bg-purple-50" />
            <KpiCard title="Active Courses" value={summary.totalCourses} icon={<LayoutDashboard size={20} className="text-emerald-600" />} bg="bg-emerald-50" />
            <KpiCard title="Placements & Internships" value={summary.activeJobs + summary.activeInternships} icon={<Briefcase size={20} className="text-amber-600" />} bg="bg-amber-50" />
          </div>
        )}

        {/* Main Dashboard Area */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Sidebar (Tabs) */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 shrink-0 flex flex-col p-4 gap-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Analytics Modules</div>
            <TabButton active={activeTab === 'student'} onClick={() => handleTabChange('student')} icon={<Users size={16} />} label="Student Growth" />
            <TabButton active={activeTab === 'instructor'} onClick={() => handleTabChange('instructor')} icon={<GraduationCap size={16} />} label="Instructor Analytics" />
            <TabButton active={activeTab === 'institution'} onClick={() => handleTabChange('institution')} icon={<Building size={16} />} label="Institution Tracking" />
            <TabButton active={activeTab === 'internship'} onClick={() => handleTabChange('internship')} icon={<Briefcase size={16} />} label="Internship Metrics" />
            <TabButton active={activeTab === 'placement'} onClick={() => handleTabChange('placement')} icon={<Award size={16} />} label="Placement Success" />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-6 flex flex-col gap-8">
            
            {/* Tab Specific KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoadingStats ? (
                [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>)
              ) : tabStats?.map((stat: any, i: number) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10 group-hover:scale-110 transition-transform" style={{ backgroundColor: stat.color }}></div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 relative z-10">{stat.label}</div>
                  <div className="text-2xl font-black text-slate-800 relative z-10">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-sm font-black text-slate-800 capitalize">{activeTab} Trend Chart</h3>
                <div className="flex flex-wrap gap-2">
                  {activeTab === 'student' && (
                    <>
                      <MetricButton active={activeMetric === 'registrations'} onClick={() => setActiveMetric('registrations')} label="Registrations" />
                      <MetricButton active={activeMetric === 'completions'} onClick={() => setActiveMetric('completions')} label="Completions" />
                    </>
                  )}
                  {activeTab === 'internship' && (
                    <MetricButton active={activeMetric === 'applications'} onClick={() => setActiveMetric('applications')} label="Applications" />
                  )}
                  {activeTab === 'placement' && (
                    <MetricButton active={activeMetric === 'placements'} onClick={() => setActiveMetric('placements')} label="Placements" />
                  )}
                </div>
              </div>
              
              <div className="h-72 w-full">
                {isLoadingChart ? (
                  <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">Loading chart data...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B2A6B" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#1B2A6B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                        itemStyle={{ color: '#1B2A6B' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#1B2A6B" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Bottom Row: Leaderboards & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Leaderboard Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 mb-4">Top Performers</h3>
                <div className="space-y-4">
                  {isLoadingLeaders ? (
                    [...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse"></div>)
                  ) : leaderboards?.top_students?.map((student: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 ${student.avatarColor}`}>
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate flex items-center gap-1.5">
                          {student.name} {student.badge && <span className="text-lg">{student.badge}</span>}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 truncate">{student.sub}</div>
                      </div>
                      <div className="text-xs font-black text-[#1B2A6B] bg-[#1B2A6B]/10 px-2 py-1 rounded-md shrink-0">
                        {student.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 mb-4">Recent Activity Logs</h3>
                <div className="space-y-4 h-[250px] overflow-y-auto admin-scrollbar pr-2">
                  {isLoadingActivity ? (
                    [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-50 rounded-lg animate-pulse"></div>)
                  ) : recentActivity?.length === 0 ? (
                     <div className="text-sm text-slate-500 text-center py-8">No recent activity.</div>
                  ) : recentActivity?.map((log: any, i: number) => (
                    <div key={i} className="flex gap-3 items-start relative">
                      {i !== recentActivity.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-slate-100 z-0"></div>}
                      <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex-shrink-0 z-10 mt-0.5"></div>
                      <div>
                        <div className="text-sm font-semibold text-slate-700 leading-snug"><span className="font-bold text-slate-900">{log.user}</span> {log.text}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </AdminDashboardLayout>
  );
}

function KpiCard({ title, value, icon, bg }: { title: string, value: number | string, icon: React.ReactNode, bg: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{title}</div>
        <div className="text-2xl font-black text-slate-800">{value}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-[#1B2A6B] text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}`}
    >
      <div className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
      {label}
    </button>
  );
}

function MetricButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${active ? 'bg-[#1B2A6B] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
    >
      {label}
    </button>
  );
}
