import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  Briefcase, CheckCircle, XCircle, Search, Edit2,
  Trash2, Building2, FileText, Plus,
  RefreshCw, Download, ChevronLeft, ChevronRight, Loader2, AlertCircle as AlertIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InternshipService } from '../../../src/lib/api/admin/InternshipService';

type Tab = 'Programs' | 'Applications' | 'Active Interns' | 'Task Submissions';
type AppStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';
type SubStatus = 'pending' | 'approved' | 'rejected' | 'resubmit';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  pending:      'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-700',
  approved:     'bg-emerald-100 text-emerald-800',
  rejected:     'bg-red-100 text-red-700',
  completed:    'bg-purple-100 text-purple-800',
  cancelled:    'bg-gray-100 text-gray-600',
  resubmit:     'bg-orange-100 text-orange-700',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

function Avatar({ src, name, size = 8 }: { src?: string; name?: string; size?: number }) {
  if (src && !src.includes('pravatar')) {
    return <img src={src} alt={name} className={`w-${size} h-${size} rounded-full object-cover`} />;
  }
  const initials = (name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600', 'bg-orange-500'];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className={`w-${size} h-${size} rounded-full ${color} text-white flex items-center justify-center text-xs font-black`}>
      {initials}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200">
        <Briefcase size={32} className="text-slate-300" />
      </div>
      <p className="text-slate-500 font-semibold text-sm">{message}</p>
    </div>
  );
}

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

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ meta, page, setPage }: { meta: any; page: number; setPage: (p: number) => void }) {
  if (!meta?.last_page || meta.last_page <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200 text-sm">
      <span className="text-slate-500 font-medium">
        Showing {meta.from}–{meta.to} of {meta.total}
      </span>
      <div className="flex gap-1">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}
          className="p-2 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600">
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-8 h-8 rounded text-sm font-bold transition-colors ${p === page ? 'bg-[#1B2A6B] text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            {p}
          </button>
        ))}
        <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}
          className="p-2 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InternshipManager() {
  const [activeTab, setActiveTab] = useState<Tab>('Programs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);

  // Application actions
  const [reviewApp, setReviewApp] = useState<any>(null);
  const [assignTaskApp, setAssignTaskApp] = useState<any>(null);
  const [gradeSubmission, setGradeSubmission] = useState<any>(null);

  const [isActionLoading, setIsActionLoading] = useState(false);

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const { data: stats, mutate: mutateStats } = InternshipService.useStats();

  // ─── Internships (Programs) SWR ───────────────────────────────────────────
  const { data: programs, meta: programsMeta, isLoading: programsLoading, mutate: mutatePrograms } =
    InternshipService.useInternships({
      search: searchQuery || undefined,
      status: filterStatus || undefined,
      page,
      per_page: 15,
    });

  // ─── Applications SWR ─────────────────────────────────────────────────────
  const { data: apps, meta: appsMeta, isLoading: appsLoading, mutate: mutateApps } =
    InternshipService.useAllApplications({
      search: searchQuery || undefined,
      status: activeTab === 'Active Interns' ? 'approved' : (filterStatus || undefined),
      page,
      per_page: 15,
    });

  // ─── Submissions SWR ───────────────────────────────────────────────────────
  const { data: submissions, meta: subsMeta, isLoading: subsLoading, mutate: mutateSubs } =
    InternshipService.useAllSubmissions({
      search: searchQuery || undefined,
      status: filterStatus || undefined,
      page,
      per_page: 15,
    });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearchQuery('');
    setFilterStatus('');
  };

  // ─── Approve / Reject Application ──────────────────────────────────────────
  const handleAppStatus = async (id: number, status: AppStatus, notes?: string) => {
    setIsActionLoading(true);
    try {
      await InternshipService.updateApplicationStatus(id, status, notes);
      toast.success(`Application ${status} successfully!`);
      setReviewApp(null);
      mutateApps();
      mutateStats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  // ─── Assign Task ───────────────────────────────────────────────────────────
  const handleAssignTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!assignTaskApp) return;
    const form = new FormData(e.currentTarget);
    setIsActionLoading(true);
    try {
      await InternshipService.createTask({
        internship_id: assignTaskApp.internship_id,
        title: form.get('title'),
        description: form.get('description'),
        total_marks: form.get('total_marks'),
        deadline: form.get('deadline'),
      });
      toast.success('Task assigned successfully!');
      setAssignTaskApp(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to assign task');
    } finally {
      setIsActionLoading(false);
    }
  };

  // ─── Grade Submission ──────────────────────────────────────────────────────
  const handleGrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gradeSubmission) return;
    const form = new FormData(e.currentTarget);
    setIsActionLoading(true);
    try {
      await InternshipService.gradeSubmission(gradeSubmission.id, {
        status: form.get('status') as SubStatus,
        marks_obtained: Number(form.get('marks_obtained')),
        feedback: form.get('feedback') as string,
      });
      toast.success('Submission graded!');
      setGradeSubmission(null);
      mutateSubs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Grading failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleExport = () => {
    InternshipService.exportCSV({ status: filterStatus || undefined, search: searchQuery || undefined });
    toast.success('Downloading CSV…');
  };

  // ─── Stats Cards ───────────────────────────────────────────────────────────
  const statCards = stats ? [
    { label: 'Total Internships', value: stats.total ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Open', value: stats.open ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Applications', value: stats.applications ?? 0, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Pending Review', value: stats.pending ?? 0, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approved Interns', value: stats.approved ?? 0, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Submissions', value: stats.submissions ?? 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ] : [];

  return (
    <AdminDashboardLayout>
      <Head><title>Internship Manager | BlueBoxx DA</title></Head>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <Briefcase size={28} className="text-[#C9A227]" /> Internship Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">
            End-to-end workflow: Approve apps, assign tasks, review submissions.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-sm font-bold rounded-lg transition-colors">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => { mutateApps(); mutateSubs(); mutateStats(); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-sm font-bold rounded-lg text-gray-700 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Dashboard ────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-200 admin-scrollbar">
          {(['Programs', 'Applications', 'Active Interns', 'Task Submissions'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab ? 'text-[#1B2A6B] border-b-2 border-[#1B2A6B]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}>
              {tab}
              {tab === 'Applications' && stats?.pending > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search & Filter Bar ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name…" value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none" />
        </div>
        {activeTab !== 'Active Interns' && (
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none text-gray-700 font-semibold bg-white">
            <option value="">All Statuses</option>
            {activeTab === 'Programs' ? (
              <>
                <option value="open">Open</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </>
            ) : activeTab === 'Applications' ? (
              <>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </>
            ) : (
              <>
                <option value="pending">Pending Review</option>
                <option value="approved">Graded</option>
                <option value="rejected">Rejected</option>
                <option value="resubmit">Resubmit</option>
              </>
            )}
          </select>
        )}
      </div>

      {/* ── Programs Tab (All Internships) ────────────────────────────────── */}
      {activeTab === 'Programs' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Internship Details</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Type / Mode</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applications</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {programsLoading ? (
                  <LoadingRows cols={6} />
                ) : !programs || programs.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState message={searchQuery ? 'No internships match your search.' : 'No internships found.'} />
                    </td>
                  </tr>
                ) : programs.map((prog: any) => {
                  return (
                    <tr key={prog.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#1B2A6B] text-sm">{prog.title}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          ID #{prog.id} • {prog.created_at ? new Date(prog.created_at).toLocaleDateString() : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-gray-400" />
                          <p className="text-sm font-semibold text-gray-700">
                            {prog.company_name || prog.company?.name || `${prog.company?.first_name || ''} ${prog.company?.last_name || ''}`.trim() || 'Blueboxx DA'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 font-bold">{prog.mode || 'Remote'}</p>
                        <p className="text-xs text-gray-400 font-medium">{prog.location || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={prog.status} /></td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          {prog.applications_count || 0} Apps
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/internships/${prog.id}`} className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 p-2 rounded-lg">
                            <Edit2 size={16} />
                          </Link>
                          <button onClick={() => {
                            if (confirm('Delete this internship?')) {
                              InternshipService.deleteInternship(prog.id).then(() => mutatePrograms());
                            }
                          }} className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-2 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination meta={programsMeta} page={page} setPage={setPage} />
        </div>
      )}

      {/* ── Applications Tab ──────────────────────────────────────────────── */}
      {(activeTab === 'Applications' || activeTab === 'Active Interns') && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Internship</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applied</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appsLoading ? (
                  <LoadingRows cols={5} />
                ) : apps.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState message={searchQuery ? 'No applications match your search.' : 'No applications found.'} />
                    </td>
                  </tr>
                ) : apps.map((app: any) => {
                  const name = app.user?.name || `${app.user?.first_name || ''} ${app.user?.last_name || ''}`.trim() || app.user?.email || 'Student Applicant';
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={app.user?.profile_photo} name={name} size={9} />
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400 font-medium">{app.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1B2A6B] text-sm">{app.internship?.title}</p>
                        <p className="text-xs text-gray-400 font-medium">{app.internship?.location || app.internship?.mode}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {app.status === 'pending' && (
                            <button onClick={() => setReviewApp(app)}
                              className="px-3 py-1.5 bg-[#1B2A6B] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#121c47] transition-colors">
                              Review
                            </button>
                          )}
                          {app.status === 'approved' && (
                            <>
                              <button onClick={() => setAssignTaskApp(app)}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1">
                                <Plus size={13} /> Assign Task
                              </button>
                              <button onClick={() => handleAppStatus(app.id, 'completed')}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors">
                                Complete
                              </button>
                            </>
                          )}
                          {(app.status === 'pending' || app.status === 'approved') && (
                            <button onClick={() => handleAppStatus(app.id, 'rejected')}
                              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination meta={appsMeta} page={page} setPage={setPage} />
        </div>
      )}

      {/* ── Submissions Tab ────────────────────────────────────────────────── */}
      {activeTab === 'Task Submissions' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Intern</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Task</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Internship</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Submitted</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Marks</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subsLoading ? (
                  <LoadingRows cols={7} />
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState message={searchQuery ? 'No submissions match your search.' : 'No task submissions found.'} />
                    </td>
                  </tr>
                ) : submissions.map((sub: any) => {
                  const name = `${sub.user?.first_name || ''} ${sub.user?.last_name || ''}`.trim();
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={sub.user?.profile_photo} name={name} size={8} />
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400">{sub.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-800">{sub.task?.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Total: {sub.task?.total_marks ?? '–'} marks</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#1B2A6B] font-semibold">
                        {sub.task?.internship?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {sub.marks_obtained != null ? (
                          <span className="font-black text-[#1B2A6B] text-base">{sub.marks_obtained}</span>
                        ) : (
                          <span className="text-gray-400 text-xs font-bold">Not graded</span>
                        )}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={sub.status || 'pending'} /></td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setGradeSubmission(sub)}
                          className="px-3 py-1.5 bg-[#1B2A6B] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#121c47] transition-colors">
                          View & Grade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination meta={subsMeta} page={page} setPage={setPage} />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* REVIEW APPLICATION MODAL                                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-black text-gray-800">Review Application</h2>
              <button onClick={() => setReviewApp(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Applicant Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <Avatar src={reviewApp.user?.profile_photo}
                  name={`${reviewApp.user?.first_name} ${reviewApp.user?.last_name}`}
                  size={12} />
                <div>
                  <p className="font-black text-gray-800">
                    {reviewApp.user?.first_name} {reviewApp.user?.last_name}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{reviewApp.user?.email}</p>
                  <p className="text-xs text-[#1B2A6B] font-bold mt-1">{reviewApp.internship?.title}</p>
                </div>
              </div>

              {reviewApp.cover_letter && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cover Letter</label>
                  <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-40 overflow-y-auto leading-relaxed">
                    {reviewApp.cover_letter}
                  </div>
                </div>
              )}

              {reviewApp.resume_path && (
                <a href={reviewApp.resume_path} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-[#1B2A6B] hover:underline">
                  <FileText size={16} /> View Resume / CV
                </a>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => handleAppStatus(reviewApp.id, 'approved')} disabled={isActionLoading}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2">
                  {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Approve
                </button>
                <button onClick={() => handleAppStatus(reviewApp.id, 'under_review')} disabled={isActionLoading}
                  className="flex-1 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <AlertIcon size={16} /> Mark Under Review
                </button>
                <button onClick={() => handleAppStatus(reviewApp.id, 'rejected')} disabled={isActionLoading}
                  className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ASSIGN TASK MODAL                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {assignTaskApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-black text-gray-800">Assign New Task</h2>
                <p className="text-sm text-gray-500 font-medium mt-0.5">
                  For: {assignTaskApp.user?.first_name} {assignTaskApp.user?.last_name} — {assignTaskApp.internship?.title}
                </p>
              </div>
              <button onClick={() => setAssignTaskApp(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleAssignTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Task Title <span className="text-red-500">*</span></label>
                <input name="title" required type="text" placeholder="e.g. Build Authentication Module"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description & Instructions</label>
                <textarea name="description" rows={3} placeholder="Detailed instructions for the intern…"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Marks <span className="text-red-500">*</span></label>
                  <input name="total_marks" required type="number" defaultValue={100} min={1}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Deadline</label>
                  <input name="deadline" type="datetime-local"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isActionLoading}
                  className="flex-1 py-3 bg-[#1B2A6B] hover:bg-[#121c47] disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2">
                  {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Assign Task
                </button>
                <button type="button" onClick={() => setAssignTaskApp(null)}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* GRADE SUBMISSION MODAL                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {gradeSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div>
                <h2 className="text-lg font-black text-gray-800">
                  Grade Submission —{' '}
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                    {gradeSubmission.user?.first_name} {gradeSubmission.user?.last_name}
                  </span>
                </h2>
                <p className="text-sm font-bold text-gray-500 mt-0.5">{gradeSubmission.task?.title}</p>
              </div>
              <button onClick={() => setGradeSubmission(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Submission files / link */}
              {gradeSubmission.file_path && (
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Submitted Files</h3>
                  <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between bg-gray-50">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <FileText size={16} className="text-blue-500" />
                      {gradeSubmission.file_path.split('/').pop()}
                    </span>
                    <a href={gradeSubmission.file_path} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold text-[#1B2A6B] hover:underline">Download</a>
                  </div>
                </div>
              )}
              {gradeSubmission.submission_url && (
                <a href={gradeSubmission.submission_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                  🔗 {gradeSubmission.submission_url}
                </a>
              )}
              {gradeSubmission.notes && (
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Intern Notes</h3>
                  <p className="text-sm text-gray-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                    {gradeSubmission.notes}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleGrade} className="p-6 border-t border-gray-100 bg-gray-50 space-y-4 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Marks (out of {gradeSubmission.task?.total_marks ?? 100}) <span className="text-red-500">*</span>
                  </label>
                  <input name="marks_obtained" type="number" required
                    defaultValue={gradeSubmission.marks_obtained ?? ''}
                    min={0} max={gradeSubmission.task?.total_marks ?? 100}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xl font-black text-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none text-center" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Decision <span className="text-red-500">*</span></label>
                  <select name="status" required defaultValue={gradeSubmission.status || 'pending'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none bg-white">
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="resubmit">Request Resubmit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Feedback</label>
                  <textarea name="feedback" rows={2} defaultValue={gradeSubmission.feedback ?? ''}
                    placeholder="Constructive feedback…"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none resize-none" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={isActionLoading}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2">
                  {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Submit Grade
                </button>
                <button type="button" onClick={() => setGradeSubmission(null)}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
