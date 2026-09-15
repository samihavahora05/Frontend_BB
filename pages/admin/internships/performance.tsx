import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  TrendingUp, Users, CheckCircle2, Clock, AlertTriangle, Search,
  Award, ChevronRight, X, FileText, CheckCircle, ExternalLink,
  Calendar, Star, ArrowUpRight, ArrowDownRight, Minus, RefreshCw,
  Building2, Briefcase
} from 'lucide-react';
import useSWR from 'swr';
import api from '../../../src/lib/axios';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Excellent':         { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Very Good':         { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  'Good':              { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200' },
  'Needs Improvement': { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  'Poor':              { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
};

function PerformanceBadge({ category, score }: { category: string | null; score: number | null }) {
  if (score === null || !category) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        No evaluated tasks yet
      </span>
    );
  }
  const conf = categoryColors[category] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${conf.bg} ${conf.text} border ${conf.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {score}% • {category}
    </span>
  );
}

export default function AdminPerformancePage() {
  const [search, setSearch] = useState('');
  const [rangeFilter, setRangeFilter] = useState('all');
  const [selectedInternId, setSelectedInternId] = useState<number | null>(null);

  const queryParams = new URLSearchParams();
  if (search) queryParams.set('search', search);
  if (rangeFilter !== 'all') queryParams.set('performance_range', rangeFilter);

  const { data: perfResponse, isLoading, mutate } = useSWR(
    `/admin/internships/performance${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
    fetcher
  );

  const { data: internDetailResponse, isLoading: loadingDetail } = useSWR(
    selectedInternId ? `/admin/internships/performance/${selectedInternId}` : null,
    fetcher
  );

  const summary = perfResponse?.summary || null;
  const interns = perfResponse?.data || [];
  const selectedDetail = internDetailResponse?.data || null;

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Global Intern Performance Tracking | Admin Blueboxx</title>
      </Head>

      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
              <Link href="/admin/internships" className="hover:text-slate-700">Admin</Link>
              <span>/</span>
              <Link href="/admin/internships" className="hover:text-slate-700">Internships</Link>
              <span>/</span>
              <span className="text-[#1B2A6B]">Performance</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <TrendingUp className="text-[#1B2A6B]" size={26} />
              Global Intern Performance
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Platform-wide performance tracking of all approved interns across all partner companies.
            </p>
          </div>
          <button
            onClick={() => mutate()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Interns</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900">{summary?.total_interns ?? 0}</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {summary?.active_interns ?? 0} Active • {summary?.completed_internships ?? 0} Completed
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Avg Score</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Award size={18} />
              </div>
            </div>
            <div className="mt-3">
              {summary?.overall_average_performance !== null && summary?.overall_average_performance !== undefined ? (
                <span className="text-3xl font-black text-emerald-600">{summary.overall_average_performance}%</span>
              ) : (
                <span className="text-base font-bold text-slate-400">Insufficient evaluation data</span>
              )}
              <p className="text-xs text-slate-500 mt-1 font-medium">Derived from real task marks</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasks Evaluated</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900">{summary?.tasks_completed ?? 0}</span>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {summary?.tasks_pending_review ?? 0} pending review
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Performer</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Star size={18} />
              </div>
            </div>
            <div className="mt-3">
              {summary?.highest_performer ? (
                <div>
                  <p className="text-sm font-black text-slate-900 truncate">{summary.highest_performer.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{summary.highest_performer.company_name}</p>
                  <span className="inline-block mt-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {summary.highest_performer.average_marks}% Avg
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-semibold text-slate-400">No evaluations yet</span>
                  <p className="text-xs text-slate-400 mt-1">Pending task grading</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search intern, email, company, or program..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-bold text-slate-500 shrink-0">Performance Range:</label>
            <select
              value={rangeFilter}
              onChange={(e) => setRangeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
            >
              <option value="all">All Ranges</option>
              <option value="excellent">90% - 100% (Excellent)</option>
              <option value="very_good">75% - 89% (Very Good)</option>
              <option value="good">60% - 74% (Good)</option>
              <option value="needs_improvement">40% - 59% (Needs Improvement)</option>
              <option value="poor">Below 40% (Poor)</option>
              <option value="not_evaluated">No Evaluated Tasks</option>
            </select>
          </div>
        </div>

        {/* Global Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Intern</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Internship</th>
                  <th className="px-6 py-3.5 text-center">Tasks</th>
                  <th className="px-6 py-3.5 text-center">Completed</th>
                  <th className="px-6 py-3.5 text-center">Pending Review</th>
                  <th className="px-6 py-3.5 text-center">Avg. Marks</th>
                  <th className="px-6 py-3.5">Performance</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4" colSpan={9}>
                        <div className="h-4 bg-slate-100 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : interns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Users size={28} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No approved interns found</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Performance data will appear once applications are approved and task submissions are graded.
                      </p>
                    </td>
                  </tr>
                ) : (
                  interns.map((intern: any) => (
                    <tr key={intern.application_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center font-black text-xs">
                            {intern.first_name?.[0] || 'I'}
                            {intern.last_name?.[0] || ''}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{intern.name}</p>
                            <p className="text-slate-400 text-xs">{intern.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800">{intern.company_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{intern.internship_title}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {intern.total_tasks}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                          {intern.completed_tasks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${intern.pending_review_tasks > 0 ? 'bg-amber-50 text-amber-700 font-black' : 'bg-slate-50 text-slate-400'}`}>
                          {intern.pending_review_tasks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {intern.average_marks !== null ? (
                          <span className="font-black text-slate-900 text-sm">{intern.average_marks}/100</span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <PerformanceBadge category={intern.performance_category} score={intern.average_marks} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedInternId(intern.intern_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A6B] text-white rounded-lg text-xs font-bold hover:bg-[#121c47] transition-colors shadow-sm"
                        >
                          View Performance
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Performance Modal */}
      {selectedInternId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1B2A6B] text-white flex items-center justify-center font-black">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedDetail?.intern?.name || 'Intern Performance Profile'}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {selectedDetail?.company?.name || 'Company'} • {selectedDetail?.internship?.title || 'Program'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInternId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {loadingDetail ? (
                <div className="py-20 text-center">
                  <RefreshCw className="animate-spin text-[#1B2A6B] mx-auto mb-3" size={28} />
                  <p className="text-xs font-bold text-slate-500">Loading performance data...</p>
                </div>
              ) : selectedDetail ? (
                <>
                  {/* Score Highlights & Trend */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#1B2A6B] to-[#0f1738] p-5 rounded-2xl text-white">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Overall Performance</span>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-black">
                          {selectedDetail.metrics.average_marks !== null ? `${selectedDetail.metrics.average_marks}%` : 'N/A'}
                        </span>
                        {selectedDetail.metrics.performance_category && (
                          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                            {selectedDetail.metrics.performance_category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-200 mt-2 font-medium">
                        Based on {selectedDetail.metrics.evaluated_count} evaluated task(s)
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Score Trend</span>
                      <div className="mt-2 flex items-center gap-2">
                        {selectedDetail.metrics.trend_status === 'Improving' && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-lg">
                            <ArrowUpRight size={20} /> Improving
                          </span>
                        )}
                        {selectedDetail.metrics.trend_status === 'Declining' && (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-lg">
                            <ArrowDownRight size={20} /> Declining
                          </span>
                        )}
                        {selectedDetail.metrics.trend_status === 'Stable' && (
                          <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-lg">
                            <Minus size={20} /> Stable
                          </span>
                        )}
                        {selectedDetail.metrics.trend_status === 'Insufficient Data' && (
                          <span className="text-slate-500 font-bold text-sm">Insufficient Data</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Chronological progression across evaluations
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Task Summary</span>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-slate-400 font-medium">Completed</p>
                          <p className="text-base font-black text-emerald-600">{selectedDetail.metrics.completed}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium">Pending Review</p>
                          <p className="text-base font-black text-amber-600">{selectedDetail.metrics.pending_review}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium">Changes Req.</p>
                          <p className="text-base font-black text-rose-600">{selectedDetail.metrics.changes_required}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium">Total Tasks</p>
                          <p className="text-base font-black text-slate-800">{selectedDetail.metrics.total_tasks}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task-by-Task Table */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-[#1B2A6B]" />
                      Task Evaluation Breakdown
                    </h4>

                    {selectedDetail.tasks.length === 0 ? (
                      <div className="py-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-500">No tasks assigned to this intern yet.</p>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-3">Task</th>
                              <th className="px-4 py-3">Due Date</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-center">Marks</th>
                              <th className="px-4 py-3">Reviewer & Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedDetail.tasks.map((task: any) => (
                              <tr key={task.id} className="hover:bg-slate-50/80">
                                <td className="px-4 py-3">
                                  <p className="font-bold text-slate-800">{task.title}</p>
                                  <p className="text-slate-400 text-[11px] line-clamp-1">{task.description}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-600 font-medium">
                                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                    task.status === 'submitted' || task.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                                    task.status === 'changes_required' ? 'bg-rose-100 text-rose-800' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {task.status?.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center font-black">
                                  {task.marks !== null ? (
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                      {task.marks}/100
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-normal">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-slate-600 italic text-xs">
                                    {task.feedback || (task.status === 'completed' ? 'Approved' : 'Pending review')}
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
