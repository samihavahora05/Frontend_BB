import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  ArrowLeft,
  Search, ChevronLeft, ChevronRight, Loader2, Briefcase, Eye, X,
  Download, ExternalLink, Mail, GraduationCap, FileText, Tag, MessageSquare, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InternshipService } from '../../../src/lib/api/admin/InternshipService';

const statusColors: Record<string, string> = {
  applied:      'bg-blue-100 text-blue-800 border border-blue-200',
  pending:      'bg-yellow-100 text-yellow-800 border border-yellow-200',
  under_review: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  shortlisted:  'bg-teal-100 text-teal-800 border border-teal-200',
  interview:    'bg-purple-100 text-purple-800 border border-purple-200',
  approved:     'bg-emerald-100 text-emerald-800 border border-emerald-200',
  selected:     'bg-emerald-100 text-emerald-800 border border-emerald-200',
  completed:    'bg-sky-100 text-sky-800 border border-sky-200',
  rejected:     'bg-rose-100 text-rose-800 border border-rose-200',
  cancelled:    'bg-gray-100 text-gray-700 border border-gray-200',
};

function Pagination({ meta, page, setPage }: { meta: any; page: number; setPage: (p: number) => void }) {
  if (!meta?.last_page || meta.last_page <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 text-xs font-semibold">
      <span className="text-gray-500 font-medium">Showing {meta.from}–{meta.to} of {meta.total} records</span>
      <div className="flex gap-1">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-40"><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${p === page ? 'bg-[#1B2A6B] text-white shadow-xs' : 'hover:bg-gray-100 text-gray-600 border border-gray-200'}`}>{p}</button>
        ))}
        <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}
          className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-40"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

export default function InternshipApplications() {
  const router = useRouter();
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage]                 = useState(1);

  // Detail Modal State
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [modalStatus, setModalStatus] = useState<string>('applied');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Determine if viewing a specific internship's applications, or all
  const internshipId = router.query.internshipId as string | undefined;

  const specificAppResponse = InternshipService.useInternshipApplications(internshipId || '', {
    search: searchQuery || undefined,
    status: filterStatus || undefined,
    page,
    per_page: 15,
  });

  const allAppResponse = InternshipService.useAllApplications({
    search: searchQuery || undefined,
    status: filterStatus || undefined,
    page,
    per_page: 15,
  });

  const { data: apps, meta, isLoading, mutate } = internshipId ? specificAppResponse : allAppResponse;

  const handleOpenDetails = (app: any) => {
    setSelectedApp(app);
    setModalStatus(app.status || 'applied');
    setInternalNotes(app.internal_notes || '');
  };

  const handleStatusChange = async (id: number, status: string, notes?: string) => {
    setIsUpdatingStatus(true);
    toast.loading('Updating application status...', { id: 'app-status' });
    try {
      await InternshipService.updateApplicationStatus(id, status, notes);
      toast.success(`Application marked as ${status.replace('_', ' ').toUpperCase()}`, { id: 'app-status' });
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev: any) => ({ ...prev, status, internal_notes: notes }));
      }
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Action failed', { id: 'app-status' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head><title>Internship Applications | BlueBoxx DA Admin</title></Head>

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}
              className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#1B2A6B] hover:bg-gray-50 transition-colors shadow-xs">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Internship Applications</h1>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {internshipId ? `Applications for Internship #${internshipId}` : 'All student & program applications received across the website'}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3.5 flex flex-wrap gap-3 items-center shadow-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, phone, degree, or position..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none bg-slate-50/50" 
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Status:</span>
            <select 
              value={filterStatus} 
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              className="py-2.5 px-3.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none text-gray-800 font-bold bg-white cursor-pointer shadow-xs"
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied / New</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="selected">Selected</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 size={36} className="animate-spin text-[#1B2A6B]" />
            </div>
          ) : apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <Briefcase size={44} className="text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800 mb-1">No Applications Found</h3>
              <p className="text-xs text-gray-500 font-medium max-w-sm">
                {searchQuery || filterStatus ? 'No applications match your active search or filter filters.' : 'No internship applications have been submitted yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">#</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Program / Position</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Page</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                  {apps.map((app: any, idx: number) => {
                    const name = app.applicant_name || `${app.first_name || app.user?.first_name || ''} ${app.last_name || app.user?.last_name || ''}`.trim() || 'Applicant';
                    const email = app.applicant_email || app.email || app.user?.email || 'N/A';
                    const phone = app.applicant_phone || app.phone || app.user?.phone || 'N/A';
                    const programTitle = app.internship?.title || app.application_type || 'General Application';
                    const sourcePage = app.source_page || 'Website Form';
                    const submittedDate = app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-4 text-xs font-bold text-gray-400">
                          {((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 15) + idx + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                              {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-gray-900 text-xs">{name}</p>
                              <p className="text-[11px] text-gray-500">{email} {phone !== 'N/A' && `• ${phone}`}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-extrabold text-[#1B2A6B] text-xs">{programTitle}</p>
                          {app.degree && <p className="text-[11px] text-gray-500 font-semibold">{app.degree} ({app.graduation_year || 'N/A'})</p>}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                            <Tag size={11} className="text-[#C9A227]" /> {sourcePage}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-gray-500 font-semibold whitespace-nowrap">
                          {submittedDate}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                            {app.status?.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenDetails(app)}
                              className="px-3 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold text-[11px] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <Eye size={13} /> View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <Pagination meta={meta} page={page} setPage={setPage} />
        </div>

      </div>

      {/* ========================================================
          APPLICATION DETAILS MODAL / DRAWER
          ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col relative">
            
            {/* Modal Header */}
            <div className="bg-[#0d1635] text-white p-6 relative flex justify-between items-start shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#C9A227] inline-block mb-2">
                  Application #{selectedApp.id}
                </span>
                <h2 className="text-xl font-black text-white">
                  {selectedApp.applicant_name || `${selectedApp.first_name || ''} ${selectedApp.last_name || ''}`.trim() || 'Applicant Details'}
                </h2>
                <p className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-2">
                  <span>Target Program: <strong className="text-amber-300">{selectedApp.internship?.title || selectedApp.application_type || 'General Program'}</strong></span>
                  <span>•</span>
                  <span>Source: <strong className="text-white">{selectedApp.source_page || 'Website Form'}</strong></span>
                </p>
              </div>

              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700 flex-1">
              
              {/* Personal Information */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#1B2A6B]" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Full Name</span>
                    <p className="font-extrabold text-gray-900 text-xs">
                      {selectedApp.applicant_name || `${selectedApp.first_name || ''} ${selectedApp.last_name || ''}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Email Address</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.applicant_email || selectedApp.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Mobile Phone</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.applicant_phone || selectedApp.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Education & Qualifications */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-[#1B2A6B]" /> Education & Background
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Degree / Qualification</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.degree || 'Not Provided'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Graduation Year</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.graduation_year || 'Not Provided'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Experience Level</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.experience_years || 'Fresher / Student'}</p>
                  </div>
                </div>
              </div>

              {/* Resume & Web Links */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <FileText size={14} className="text-[#1B2A6B]" /> Documents & Portfolio Links
                </h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  {selectedApp.resume_download || selectedApp.resume_url ? (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-[#1B2A6B]" />
                        <span className="font-bold text-gray-800 text-xs">Applicant CV / Resume Document</span>
                      </div>
                      <a 
                        href={selectedApp.resume_download || `/storage/${selectedApp.resume_url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Download size={13} /> View / Download Resume
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 font-semibold italic">No CV document uploaded for this submission.</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {selectedApp.portfolio_url && (
                      <a href={selectedApp.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-xl text-blue-600 font-bold hover:underline">
                        <ExternalLink size={14} /> Portfolio: {selectedApp.portfolio_url}
                      </a>
                    )}
                    {selectedApp.github_url && (
                      <a href={selectedApp.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 font-bold hover:underline">
                        <ExternalLink size={14} /> GitHub: {selectedApp.github_url}
                      </a>
                    )}
                    {selectedApp.linkedin_url && (
                      <a href={selectedApp.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-xl text-blue-700 font-bold hover:underline">
                        <ExternalLink size={14} /> LinkedIn: {selectedApp.linkedin_url}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter & Messages */}
              {(selectedApp.cover_letter || selectedApp.message) && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-[#1B2A6B]" /> Message / Cover Letter
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 whitespace-pre-wrap font-medium text-gray-800 text-xs leading-relaxed">
                    {selectedApp.cover_letter || selectedApp.message}
                  </div>
                </div>
              )}

              {/* Admin Status Update */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Tag size={14} className="text-[#1B2A6B]" /> Update Application Status & Notes
                </h3>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-gray-600 mb-1">Status</label>
                      <select 
                        value={modalStatus} 
                        onChange={(e) => setModalStatus(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-extrabold border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white cursor-pointer"
                      >
                        <option value="applied">Applied / New</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="selected">Selected</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-gray-600 mb-1">Internal Notes</label>
                      <input 
                        type="text"
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        placeholder="Add private admin notes..."
                        className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange(selectedApp.id, modalStatus, internalNotes)}
                      className="px-5 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold text-xs rounded-xl shadow-md transition-all gap-1.5 inline-flex items-center"
                    >
                      <Save size={14} /> {isUpdatingStatus ? "Saving..." : "Save Status & Notes"}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
