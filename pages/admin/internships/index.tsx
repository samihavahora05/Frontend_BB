import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  Briefcase, CheckCircle, XCircle, Search, Edit2,
  Trash2, Building2, FileText, Plus, Users,
  RefreshCw, Download, Upload, Check, X, ChevronLeft, ChevronRight, Loader2, AlertCircle as AlertIcon,
  Eye, EyeOff, Sparkles, FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InternshipService } from '../../../src/lib/api/admin/InternshipService';
import { ExcelImportModal } from '../../../src/components/admin/internship/ExcelImportModal';

type Tab = 'Programs' | 'Applications' | 'Active Interns' | 'Task Submissions';
type AppStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';
type SubStatus = 'pending' | 'approved' | 'rejected' | 'resubmit';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  open:         'bg-emerald-100 text-emerald-800',
  published:    'bg-emerald-100 text-emerald-800',
  active:       'bg-emerald-100 text-emerald-800',
  draft:        'bg-slate-100 text-slate-700',
  closed:       'bg-rose-100 text-rose-700',
  archived:     'bg-gray-100 text-gray-600',
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

  // Excel / CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

  // ─── Publish / Unpublish 1-Click Toggle ────────────────────────────────────
  const handleTogglePublish = async (id: number, currentStatus: string) => {
    const isLive = currentStatus === 'open' || currentStatus === 'published' || currentStatus === 'active';
    const nextStatus = isLive ? 'draft' : 'open';
    try {
      await InternshipService.updateInternship(id, { status: nextStatus });
      toast.success(nextStatus === 'open' ? 'Internship published to live portal!' : 'Internship set to draft.');
      mutatePrograms();
      mutateStats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update publishing status');
    }
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

  const handleExport = async () => {
    try {
      await InternshipService.exportCSV({ status: filterStatus || undefined });
      toast.success('Internships exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const statCards = [
    { label: 'Total Programs',     value: stats?.total ?? 0,        color: 'text-[#1B2A6B]' },
    { label: 'Active / Published', value: stats?.active ?? 0,       color: 'text-emerald-600' },
    { label: 'Draft Programs',     value: stats?.draft ?? 0,        color: 'text-slate-600' },
    { label: 'Applications',       value: stats?.applications ?? 0, color: 'text-blue-600' },
    { label: 'Pending Review',     value: stats?.pending ?? 0,      color: 'text-amber-600' },
    { label: 'Active Interns',     value: stats?.approved ?? 0,     color: 'text-purple-600' },
  ];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Internship Management & Bulk Import | Blueboxx Admin</title>
      </Head>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Internship Management</h1>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Create, bulk import from Excel/CSV, publish to student portal, and review applications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-[#1B2A6B] hover:bg-slate-50 text-slate-800 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Import Excel / CSV</span>
          </button>

          <Link
            href="/admin/internships/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-xs font-black rounded-xl shadow-md transition-all"
          >
            <Plus size={15} />
            <span>Post Internship</span>
          </Link>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-black rounded-xl transition-colors cursor-pointer"
          >
            <Download size={14} /> Export
          </button>

          <button
            onClick={() => { mutatePrograms(); mutateApps(); mutateSubs(); mutateStats(); }}
            className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors cursor-pointer"
            title="Refresh Grid"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── Stats Dashboard ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4 shadow-xs">
        <div className="flex overflow-x-auto border-b border-gray-200 admin-scrollbar">
          {(['Programs', 'Applications', 'Active Interns', 'Task Submissions'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-3.5 text-xs font-black whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab ? 'text-[#1B2A6B] border-b-2 border-[#1B2A6B] bg-slate-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab}
              {tab === 'Applications' && stats?.pending > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs mb-4 px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, role, company..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none"
          />
        </div>

        {activeTab !== 'Active Interns' && (
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="py-2 px-3 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none text-gray-700 font-bold bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            {activeTab === 'Programs' ? (
              <>
                <option value="open">Published (Live)</option>
                <option value="draft">Draft (Unpublished)</option>
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

      {/* ── Programs Tab (All Internships) ── */}
      {activeTab === 'Programs' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Internship Program</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Mode / City</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Stipend</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applications</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {programsLoading ? (
                  <LoadingRows cols={7} />
                ) : !programs || programs.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState message={searchQuery ? 'No internships match your search.' : 'No internships found. Click "Import Excel" or "Post Internship" to get started.'} />
                    </td>
                  </tr>
                ) : programs.map((prog: any) => {
                  const isLive = prog.status === 'open' || prog.status === 'published' || prog.status === 'active';
                  return (
                    <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/internships/${prog.id}`} className="font-bold text-[#1B2A6B] hover:underline text-sm block">
                          {prog.title}
                        </Link>
                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                          ID #{prog.id} • {prog.department || 'General'} • Deadline: {prog.application_deadline ? new Date(prog.application_deadline).toLocaleDateString() : 'Open'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={15} className="text-gray-400 shrink-0" />
                          <p className="text-xs font-bold text-gray-800 truncate max-w-[150px]" title={prog.company_name}>
                            {prog.company_name || prog.company?.name || 'Blueboxx Partner'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700 mr-1.5">
                          {prog.mode || 'Remote'}
                        </span>
                        <span className="text-xs text-gray-500 font-semibold">{prog.location || 'India'}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-700">
                        {prog.stipend ? `₹${Number(prog.stipend).toLocaleString()}` : 'Performance'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={prog.status} />
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/internships/applications?internshipId=${prog.id}`} className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full transition-colors">
                          <Users size={12} /> {prog.applications_count || 0} Apps
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5 items-center">
                          {/* 1-Click Publish / Unpublish Button */}
                          <button
                            onClick={() => handleTogglePublish(prog.id, prog.status)}
                            title={isLive ? 'Unpublish (Set to Draft)' : 'Publish to Live Portal'}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isLive 
                                ? 'text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100' 
                                : 'text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                          >
                            {isLive ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>

                          <Link
                            href={`/admin/internships/applications?internshipId=${prog.id}`}
                            title="Review Applications & Approvals"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 p-2 rounded-xl"
                          >
                            <Users size={15} />
                          </Link>

                          <Link
                            href={`/admin/internships/${prog.id}`}
                            title="Edit Internship"
                            className="text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 p-2 rounded-xl"
                          >
                            <Edit2 size={15} />
                          </Link>

                          <button
                            onClick={() => {
                              if (confirm('Delete this internship? This cannot be undone.')) {
                                InternshipService.deleteInternship(prog.id).then(() => {
                                  toast.success('Internship deleted');
                                  mutatePrograms();
                                  mutateStats();
                                });
                              }
                            }}
                            title="Delete Internship"
                            className="text-rose-500 hover:text-rose-700 transition-colors bg-rose-50 hover:bg-rose-100 p-2 rounded-xl cursor-pointer"
                          >
                            <Trash2 size={15} />
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

      {/* ── Applications Tab ── */}
      {(activeTab === 'Applications' || activeTab === 'Active Interns') && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Internship Program</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applied On</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {appsLoading ? (
                  <LoadingRows cols={5} />
                ) : !apps || apps.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState message="No applications found for current filter." />
                    </td>
                  </tr>
                ) : apps.map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{app.applicant_name || app.user?.name || `Applicant #${app.id}`}</p>
                      <p className="text-[11px] text-gray-400 font-semibold">{app.applicant_email || app.user?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1B2A6B]">{app.internship?.title || app.application_type || 'General Internship'}</p>
                      <p className="text-[11px] text-gray-400">{app.internship?.company_name || 'Blueboxx DA'}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">
                      {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recently'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/internships/applications?internshipId=${app.internship_id || ''}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        <Users size={13} /> Manage / Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={appsMeta} page={page} setPage={setPage} />
        </div>
      )}

      {/* ── Task Submissions Tab ── */}
      {activeTab === 'Task Submissions' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Intern</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Task Title</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Submitted Date</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {subsLoading ? (
                  <LoadingRows cols={5} />
                ) : !submissions || submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState message="No task submissions found." />
                    </td>
                  </tr>
                ) : submissions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {sub.user?.name || `Intern #${sub.user_id}`}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1B2A6B]">{sub.task?.title || 'Milestone Deliverable'}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setGradeSubmission(sub)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Grade & Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={subsMeta} page={page} setPage={setPage} />
        </div>
      )}

      {/* ── Interactive Excel & CSV Import Modal ── */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          mutatePrograms();
          mutateStats();
        }}
      />

      {/* ── Grade Submission Modal ── */}
      {gradeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-gray-900 mb-1">Grade Submission</h3>
            <p className="text-xs text-gray-500 font-semibold mb-4">
              Grade milestone deliverable submitted by {gradeSubmission.user?.name || 'Intern'}.
            </p>

            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Review Outcome</label>
                <select name="status" defaultValue="approved" className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold text-gray-800">
                  <option value="approved">Approve & Pass</option>
                  <option value="resubmit">Request Resubmission</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Score / Marks (Out of 100)</label>
                <input type="number" name="marks_obtained" defaultValue="85" min="0" max="100" className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mentor Feedback</label>
                <textarea name="feedback" rows={3} placeholder="Provide constructive feedback on the deliverable..." className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl resize-none font-medium text-gray-800" />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {isActionLoading ? 'Saving Grade...' : 'Submit Grade'}
                </button>
                <button
                  type="button"
                  onClick={() => setGradeSubmission(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
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
