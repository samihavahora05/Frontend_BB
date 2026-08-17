import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  Briefcase, Plus, Users, Trash2, StopCircle,
  CheckCircle, XCircle, Clock, AlertCircle, Search,
  Download, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { JobService } from '../../../src/lib/api/admin/JobService';

type JobStatus = 'draft' | 'pending_approval' | 'active' | 'expired' | 'closed' | 'rejected';

const STATUS_COLORS: Record<string, string> = {
  draft:            'bg-gray-100 text-gray-700',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  active:           'bg-emerald-100 text-emerald-800',
  closed:           'bg-red-100 text-red-800',
  expired:          'bg-orange-100 text-orange-800',
  rejected:         'bg-red-100 text-red-800',
};

function LoadingRows({ cols = 5 }: { cols?: number }) {
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

export default function JobsManager() {
  const router = useRouter();

  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [page, setPage]           = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: jobs, meta, isLoading, mutate } = JobService.useJobs({
    search: search || undefined,
    status: status || undefined,
    page,
    per_page: 15,
  });

  const { data: metrics, mutate: mutateMetrics } = JobService.useDashboardMetrics();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([mutate(), mutateMetrics()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await JobService.updateJob(id, { status: newStatus });
      toast.success(`Job marked as ${newStatus}`);
      mutate();
      mutateMetrics();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteJob = async (id: number) => {
    if (!confirm('Delete this job permanently?')) return;
    try {
      await JobService.deleteJob(id);
      toast.success('Job deleted');
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      mutate();
      mutateMetrics();
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} jobs permanently?`)) return;
    try {
      await JobService.bulkDeleteJobs(selectedIds);
      toast.success('Jobs deleted successfully');
      setSelectedIds([]);
      mutate();
      mutateMetrics();
    } catch {
      toast.error('Failed to delete jobs');
    }
  };

  const toggleSelectAll = () => {
    if (jobs && selectedIds.length === jobs.length) {
      setSelectedIds([]);
    } else if (jobs) {
      setSelectedIds(jobs.map((job: any) => job.id));
    }
  };

  const toggleSelectJob = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]);
  };

  const handleExport = () => {
    JobService.exportCSV();
    toast.success('Downloading CSV…');
  };

  // ─── Pagination helpers ───────────────────────────────────────────────────────
  const totalPages  = meta?.last_page ?? 1;
  const totalCount  = meta?.total ?? 0;

  return (
    <AdminDashboardLayout>
      <Head><title>Jobs Management | BlueBoxx DA</title></Head>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <Briefcase size={28} className="text-[#C9A227]"/> Jobs Management
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">
            Review company postings, approve jobs, and manage candidate pipelines.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
            <Download size={15}/> Export CSV
          </button>
          <button onClick={handleRefresh} disabled={isRefreshing}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-blue-500" : ""}/> Refresh
          </button>
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
              <Trash2 size={15}/> Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={() => router.push('/admin/jobs/add')}
            className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-colors">
            <Plus size={16}/> Post New Job
          </button>
        </div>
      </div>

      {/* ── Metric Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending Review', value: metrics?.pending_jobs ?? 0,       icon: Clock,        bg: 'bg-yellow-50', text: 'text-yellow-500' },
          { label: 'Active Jobs',    value: metrics?.active_jobs ?? 0,         icon: CheckCircle,  bg: 'bg-emerald-50',text: 'text-emerald-500' },
          { label: 'Total Apps',     value: metrics?.total_applications ?? 0,  icon: Users,        bg: 'bg-blue-50',   text: 'text-blue-500' },
          { label: 'Expired',        value: metrics?.expired_jobs ?? 0,        icon: AlertCircle,  bg: 'bg-red-50',    text: 'text-red-500' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 ${c.bg} ${c.text} rounded-lg flex items-center justify-center shrink-0`}>
              <c.icon size={20}/>
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{c.label}</p>
              <h2 className="text-xl font-black text-gray-800">{c.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" placeholder="Search jobs or company…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] outline-none text-gray-700 font-semibold bg-white">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
          <option value="expired">Expired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" 
                    checked={jobs?.length > 0 && selectedIds.length === jobs.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                {['Job Role', 'Company & Details', 'Performance', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <LoadingRows cols={6}/>
              ) : !jobs || jobs.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-20">
                      <Briefcase size={48} className="text-gray-200 mb-4"/>
                      <p className="text-gray-500 font-semibold text-sm">
                        {search || status ? 'No jobs match your filters.' : 'No jobs posted yet.'}
                      </p>
                      {!search && !status && (
                        <button onClick={() => router.push('/admin/jobs/add')}
                          className="mt-4 flex items-center gap-2 bg-[#1B2A6B] text-white px-4 py-2 rounded-lg font-bold text-sm">
                          <Plus size={14}/> Post First Job
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : jobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-[#1B2A6B] focus:ring-[#1B2A6B]"
                      checked={selectedIds.includes(job.id)}
                      onChange={() => toggleSelectJob(job.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1B2A6B]">{job.title}</p>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5">{job.job_id_prefix}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-sm">{job.company?.name || 'BlueBoxx'}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {job.employment_type} • {job.location || 'Remote'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="font-black text-gray-800 text-lg leading-none">{job.applications_count || 0}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Apps</div>
                      </div>
                      <div className="text-center">
                        <div className="font-black text-gray-800 text-lg leading-none">{job.views_count || 0}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Views</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${STATUS_COLORS[job.status] || 'bg-gray-100 text-gray-700'}`}>
                      {job.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/admin/jobs/applications?jobId=${job.id}`)}
                        className="group relative p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Users size={16}/>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                          View Applicants
                        </span>
                      </button>

                      {job.status === 'draft' && (
                        <button onClick={() => updateStatus(job.id, 'active')}
                          className="group relative p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                          <CheckCircle size={16}/>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                            Publish Job
                          </span>
                        </button>
                      )}

                      {job.status === 'pending_approval' && (
                        <>
                          <button onClick={() => updateStatus(job.id, 'active')}
                            className="group relative p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                            <CheckCircle size={16}/>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                              Approve
                            </span>
                          </button>
                          <button onClick={() => updateStatus(job.id, 'rejected')}
                            className="group relative p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                            <XCircle size={16}/>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                              Reject
                            </span>
                          </button>
                        </>
                      )}

                      {job.status === 'active' && (
                        <button onClick={() => updateStatus(job.id, 'closed')}
                          className="group relative p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors">
                          <StopCircle size={16}/>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                            Close Job
                          </span>
                        </button>
                      )}

                      <button onClick={() => deleteJob(job.id)}
                        className="group relative p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16}/>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                          Delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
            <span className="text-gray-500 font-medium text-sm">
              {totalCount} jobs total
            </span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 text-gray-600">
                <ChevronLeft size={16}/>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-sm font-bold transition-colors ${p === page ? 'bg-[#1B2A6B] text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
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
    </AdminDashboardLayout>
  );
}
