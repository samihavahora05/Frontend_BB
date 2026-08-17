import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../src/layout/AdminDashboardLayout';
import {
  BarChart, Download, Users, CheckCircle, XCircle,
  Search, Clock, Award, Filter, RefreshCw,
  ChevronLeft, ChevronRight, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import api from '../../src/lib/axios';

type Tab = 'Student Results' | 'Statistics' | 'Leaderboard';

const fetcher = (url: string) => api.get(url).then(r => r.data);

function LoadingRows({ cols = 6 }: { cols?: number }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 bg-slate-100 rounded w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function MCQResults() {
  const [activeTab, setActiveTab] = useState<Tab>('Student Results');
  const [search, setSearch]       = useState('');
  const [courseId, setCourseId]   = useState('');
  const [page, setPage]           = useState(1);

  // ─── Data fetching ────────────────────────────────────────────────────────
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries({ search, course_id: courseId, page: String(page), per_page: '20' })
        .filter(([, v]) => v !== '' && v !== '0')
    )
  ).toString();

  const { data: resultsRes, isLoading, mutate } = useSWR(
    `/admin/mcq/results${params ? '?' + params : ''}`, fetcher, { keepPreviousData: true }
  );
  const { data: statsRes }  = useSWR('/admin/mcq/stats', fetcher);
  const { data: lbRes }     = useSWR('/admin/mcq/leaderboard', fetcher);
  const { data: coursesRes }= useSWR('/admin/mcq/courses', fetcher);

  const results    = resultsRes?.data ?? [];
  const metaData   = resultsRes?.meta ?? {};
  const stats      = statsRes?.data   ?? {};
  const leaderboard= lbRes?.data      ?? [];
  const courses    = coursesRes?.data ?? [];
  const totalPages = metaData?.last_page ?? 1;

  const exportData = async () => {
    try {
      const response = await api.get('/admin/mcq/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mcq_results_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download completed!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <AdminDashboardLayout>
      <Head><title>MCQ Results | BlueBoxx DA</title></Head>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <BarChart size={28} className="text-[#C9A227]"/> MCQ Results & Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">
            Monitor student performance across all quizzes and assessments.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => mutate()}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
            <RefreshCw size={14}/> Refresh
          </button>
          <button onClick={exportData}
            className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-colors">
            <Download size={16}/> Export Excel
          </button>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {(['Student Results', 'Statistics', 'Leaderboard'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-[#1B2A6B] border-b-2 border-[#1B2A6B]'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 1 – Student Results
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'Student Results' && (
        <div className="space-y-4">
          {/* Search & filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="text" placeholder="Search student…" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#1B2A6B] outline-none shadow-sm"/>
            </div>
            <div className="relative w-full sm:w-64">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <select value={courseId} onChange={e => { setCourseId(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#1B2A6B] outline-none shadow-sm appearance-none">
                <option value="">All Courses</option>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Student', 'Course', 'Score', 'Time', 'Date', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? <LoadingRows/> :
                   results.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <BarChart size={48} className="text-gray-200 mx-auto mb-4"/>
                        <p className="text-gray-500 font-semibold text-sm">
                          {search || courseId ? 'No results match your filters.' : 'No quiz results yet. Students need to complete quizzes first.'}
                        </p>
                      </td>
                    </tr>
                  ) : results.map((r: any) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{r.studentName}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-600">{r.quizTitle}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#1B2A6B]">{r.score}/{r.total}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            r.percentage >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>{r.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                          <Clock size={14}/> {r.timeTaken}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-500">{r.date}</td>
                      <td className="px-6 py-4">
                        {r.status === 'Passed' ? (
                          <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded w-fit">
                            <CheckCircle size={14}/> Passed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded w-fit">
                            <XCircle size={14}/> Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
                <span className="text-gray-500 font-medium text-sm">{metaData.total} records</span>
                <div className="flex gap-1">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 text-gray-600">
                    <ChevronLeft size={16}/>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded text-sm font-bold ${p === page ? 'bg-[#1B2A6B] text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 text-gray-600">
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 2 – Statistics
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'Statistics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users,       color: 'blue',    label: 'Total Attempts',     value: stats.total_attempts ?? 0,  sub: 'Quiz attempts recorded' },
            { icon: CheckCircle, color: 'emerald',  label: 'Average Pass Rate',  value: (stats.pass_rate ?? 0) + '%', sub: 'Students scoring ≥ 50%' },
            { icon: TrendingUp,  color: 'purple',   label: 'Avg Quiz Score',     value: (stats.average_score ?? 0) + '%', sub: 'Across all courses' },
          ].map(c => (
            <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className={`w-12 h-12 bg-${c.color}-50 text-${c.color}-500 rounded-lg flex items-center justify-center mb-4`}>
                <c.icon size={24}/>
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{c.label}</p>
              <h2 className="text-3xl font-black text-gray-800 mt-1">{c.value}</h2>
              <p className="text-sm font-semibold text-gray-400 mt-2">{c.sub}</p>
            </div>
          ))}

          <div className="col-span-1 md:col-span-3 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <BarChart size={48} className="mb-4 opacity-50"/>
                <p className="font-bold">No quiz data yet to chart.</p>
                <p className="text-sm text-gray-400 mt-1">Charts will appear once students complete quizzes.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-black text-[#0d1635] mb-4">Score Distribution</h3>
                <div className="flex items-end gap-2 h-32">
                  {[
                    { label: '0-20%', count: results.filter((r: any) => r.percentage < 20).length },
                    { label: '20-40%', count: results.filter((r: any) => r.percentage >= 20 && r.percentage < 40).length },
                    { label: '40-60%', count: results.filter((r: any) => r.percentage >= 40 && r.percentage < 60).length },
                    { label: '60-80%', count: results.filter((r: any) => r.percentage >= 60 && r.percentage < 80).length },
                    { label: '80-100%', count: results.filter((r: any) => r.percentage >= 80).length },
                  ].map((b, i) => {
                    const max = Math.max(...[results.filter((r: any) => r.percentage < 20).length, results.filter((r: any) => r.percentage >= 20 && r.percentage < 40).length, results.filter((r: any) => r.percentage >= 40 && r.percentage < 60).length, results.filter((r: any) => r.percentage >= 60 && r.percentage < 80).length, results.filter((r: any) => r.percentage >= 80).length], 1);
                    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-emerald-400'];
                    return (
                      <div key={b.label} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="relative w-full flex items-end justify-center" style={{ height: `${(b.count / max) * 100}%` }}>
                          <div className={`w-full ${colors[i]} rounded-t-sm`} style={{ minHeight: '4px' }}/>
                        </div>
                        <span className="text-[8px] font-bold text-gray-400 text-center">{b.label}</span>
                        <span className="text-[9px] font-black text-gray-600">{b.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB 3 – Leaderboard
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'Leaderboard' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8 flex-col text-center">
            <Award size={48} className="text-[#C9A227] mb-2"/>
            <h2 className="text-2xl font-black text-[#0d1635]">Global Top Performers</h2>
            <p className="text-gray-500 font-semibold mt-1">Based on average quiz score across all courses.</p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Award size={48} className="mb-4 opacity-30"/>
              <p className="font-bold text-gray-500">No leaderboard data yet.</p>
              <p className="text-sm mt-1">Students need to complete quizzes to appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((p: any) => (
                <div key={p.rank}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#1B2A6B]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                      p.rank === 1 ? 'bg-yellow-100 text-yellow-600'
                      : p.rank === 2 ? 'bg-gray-200 text-gray-600'
                      : p.rank === 3 ? 'bg-orange-100 text-orange-600'
                      : 'bg-white text-gray-500 border border-gray-200'
                    }`}>{p.rank}</div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{p.name}</div>
                      <div className="text-xs font-semibold text-gray-500">{p.quizzes} Course{p.quizzes !== 1 ? 's' : ''} Completed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Avg Score</div>
                    <div className="text-xl font-black text-[#1B2A6B]">{p.avgScore}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminDashboardLayout>
  );
}
