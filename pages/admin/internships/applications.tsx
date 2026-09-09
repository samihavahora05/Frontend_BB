import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  ArrowLeft, Search, ChevronLeft, ChevronRight, Loader2, Briefcase, Eye, X,
  Download, ExternalLink, Mail, GraduationCap, FileText, Tag, MessageSquare, Save,
  CheckCircle2, XCircle, ShieldCheck, PenTool, Award, AlertTriangle, Calendar, Clock,
  DollarSign, MapPin, User as UserIcon, Building, Sparkles, RotateCcw, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { InternshipService } from '../../../src/lib/api/admin/InternshipService';
import { SignaturePad } from '../../../src/components/common/SignaturePad';

const statusColors: Record<string, string> = {
  submitted:    'bg-blue-100 text-blue-800 border border-blue-200',
  applied:      'bg-blue-100 text-blue-800 border border-blue-200',
  pending:      'bg-yellow-100 text-yellow-800 border border-yellow-200',
  under_review: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  shortlisted:  'bg-teal-100 text-teal-800 border border-teal-200',
  interview:    'bg-purple-100 text-purple-800 border border-purple-200',
  approved:     'bg-emerald-100 text-emerald-800 border border-emerald-300 font-black',
  selected:     'bg-emerald-100 text-emerald-800 border border-emerald-300',
  completed:    'bg-sky-100 text-sky-800 border border-sky-200',
  rejected:     'bg-rose-100 text-rose-800 border border-rose-200',
  cancelled:    'bg-gray-100 text-gray-700 border border-gray-200',
};

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date().toISOString().split('T')[0] : parsed.toISOString().split('T')[0];
}

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
  const [modalStatus, setModalStatus] = useState<string>('submitted');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Action Modals
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // ─── Dynamic Appointment Details State ─────────────────────────────────────
  const [designation, setDesignation] = useState('Backend Developer Intern');
  const [department, setDepartment] = useState('Engineering & Development');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('6 Months');
  const [workingDays, setWorkingDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [workingDaysText, setWorkingDaysText] = useState('Monday to Friday');
  const [workingHours, setWorkingHours] = useState('09:30 AM - 06:30 PM');
  const [breakTime, setBreakTime] = useState('01:00 PM - 02:00 PM');
  const [reportingTime, setReportingTime] = useState('09:30 AM');
  const [stipendAmount, setStipendAmount] = useState<number | string>(18000);
  const [stipendCurrency, setStipendCurrency] = useState('₹');
  const [paymentFrequency, setPaymentFrequency] = useState('month');
  const [reportingTo, setReportingTo] = useState('Technical Project Manager / Team Lead');
  const [reportingPersonName, setReportingPersonName] = useState('Authorized Signatory');
  const [workLocation, setWorkLocation] = useState('Vadodara, Gujarat');
  const [workMode, setWorkMode] = useState('Onsite');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Admin Signature & Signatory State
  const [adminSignatureData, setAdminSignatureData] = useState<string | File | null>(null);
  const [signatoryName, setSignatoryName] = useState<string>('Authorized Signatory');
  const [signatoryDesignation, setSignatoryDesignation] = useState<string>('Director / HR Head');

  // Load saved Admin signature from localStorage if previously uploaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSig = localStorage.getItem('bb_admin_signature');
      const savedName = localStorage.getItem('bb_signatory_name');
      const savedRole = localStorage.getItem('bb_signatory_designation');
      if (savedSig) setAdminSignatureData(savedSig);
      if (savedName) setSignatoryName(savedName);
      if (savedRole) setSignatoryDesignation(savedRole);
    }
  }, []);

  const handleAdminSignatureUpdate = (sig: string | File | null) => {
    setAdminSignatureData(sig);
    if (typeof sig === 'string' && sig.startsWith('data:image')) {
      try {
        localStorage.setItem('bb_admin_signature', sig);
      } catch (e) {}
    }
  };

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

  const populateFormFromApp = (app: any) => {
    const metaData = app.appointment_letter?.metadata || app.appointmentLetter?.metadata || {};
    
    setDesignation(metaData.designation || app.internship?.title || app.application_type || 'Backend Developer Intern');
    setDepartment(metaData.department || app.internship?.department || 'Engineering & Development');
    
    const sDate = metaData.start_date || app.internship?.start_date;
    if (sDate) {
      const parsed = new Date(sDate);
      if (!isNaN(parsed.getTime())) {
        setStartDate(parsed.toISOString().split('T')[0]);
      }
    }
    
    if (metaData.end_date) {
      const parsed = new Date(metaData.end_date);
      if (!isNaN(parsed.getTime())) {
        setEndDate(parsed.toISOString().split('T')[0]);
      }
    } else {
      // default 6 months from start
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      setEndDate(d.toISOString().split('T')[0]);
    }

    setDuration(metaData.duration || app.internship?.duration || '6 Months');
    
    if (Array.isArray(metaData.working_days)) {
      setWorkingDays(metaData.working_days);
    } else if (typeof metaData.working_days === 'string') {
      setWorkingDaysText(metaData.working_days);
    }

    setWorkingHours(metaData.working_hours || '09:30 AM - 06:30 PM');
    setBreakTime(metaData.break_time || '01:00 PM - 02:00 PM');
    setReportingTime(metaData.reporting_time || '09:30 AM');
    
    setStipendAmount(metaData.stipend_amount ?? app.internship?.stipend ?? 18000);
    setStipendCurrency(metaData.stipend_currency || '₹');
    setPaymentFrequency(metaData.payment_frequency || 'month');

    setReportingTo(metaData.reporting_to || 'Technical Project Manager / Team Lead');
    setReportingPersonName(metaData.reporting_person_name || 'Authorized Signatory');
    
    setWorkLocation(metaData.work_location || app.internship?.location || 'Vadodara, Gujarat');
    setWorkMode(metaData.work_mode || app.internship?.mode || 'Onsite');

    setIssueDate(formatDateForInput(metaData.issue_date));
    setReferenceNumber(app.appointment_letter?.reference_number || app.appointmentLetter?.reference_number || `BB-AL-${new Date().getFullYear()}-${String(app.id).padStart(4, '0')}-CONF`);

    if (metaData.signatory_name) setSignatoryName(metaData.signatory_name);
    if (metaData.signatory_designation) setSignatoryDesignation(metaData.signatory_designation);
  };

  const handleOpenDetails = async (app: any) => {
    setSelectedApp(app);
    setModalStatus(app.status || 'submitted');
    setInternalNotes(app.internal_notes || '');
    populateFormFromApp(app);

    try {
      const res = await InternshipService.getApplication(app.id);
      if (res?.data) {
        setSelectedApp(res.data);
        populateFormFromApp(res.data);
      }
    } catch (e) {
      console.error('Failed to load application details:', e);
    }
  };

  const toggleDay = (day: string) => {
    let updated: string[];
    if (workingDays.includes(day)) {
      updated = workingDays.filter(d => d !== day);
    } else {
      updated = [...workingDays, day];
    }
    setWorkingDays(updated);
    
    // Auto-update display text
    const standard = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    if (updated.length === 5 && standard.every(d => updated.includes(d))) {
      setWorkingDaysText('Monday to Friday');
    } else if (updated.length === 6 && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].every(d => updated.includes(d))) {
      setWorkingDaysText('Monday to Saturday');
    } else {
      setWorkingDaysText(updated.join(', '));
    }
  };

  const getPayload = () => {
    return {
      designation,
      department,
      start_date: startDate,
      end_date: endDate || undefined,
      duration,
      working_days: workingDaysText || workingDays,
      working_hours: workingHours,
      break_time: breakTime,
      reporting_time: reportingTime,
      stipend_amount: Number(stipendAmount) || 0,
      stipend_currency: stipendCurrency,
      payment_frequency: paymentFrequency,
      reporting_to: reportingTo,
      reporting_person_name: reportingPersonName,
      work_location: workLocation,
      work_mode: workMode,
      issue_date: issueDate,
      reference_number: referenceNumber,
      signatory_name: signatoryName,
      signatory_designation: signatoryDesignation,
      admin_signature: adminSignatureData || undefined,
    };
  };

  const handleSaveDetailsDraft = async () => {
    if (!selectedApp) return;
    setIsSavingDetails(true);
    toast.loading('Saving Appointment Details draft...', { id: 'save-draft' });
    try {
      await InternshipService.saveAppointmentDetails(selectedApp.id, getPayload());
      toast.success('Appointment Details saved successfully!', { id: 'save-draft' });
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save appointment details.', { id: 'save-draft' });
    } finally {
      setIsSavingDetails(false);
    }
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

  const handleApprove = async () => {
    if (!selectedApp) return;
    setIsProcessingAction(true);
    toast.loading('Signing & generating official 1-Page Appointment Letter...', { id: 'approval-action' });
    try {
      const payload = getPayload();
      const res = await InternshipService.approveApplication(selectedApp.id, payload);
      toast.success('Application Approved & Official Appointment Letter Generated!', { id: 'approval-action' });
      setShowApproveConfirm(false);
      setSelectedApp((prev: any) => ({
        ...prev,
        status: 'approved',
        appointment_letter_url: res.data?.appointment_letter_url || `/api/admin/internships/applications/${selectedApp.id}/appointment-letter`,
        appointment_letter_path: res.data?.appointment_letter_path || 'appointment_letters/generated.pdf'
      }));
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve application.', { id: 'approval-action' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    setIsProcessingAction(true);
    toast.loading('Rejecting application...', { id: 'reject-action' });
    try {
      await InternshipService.rejectApplication(selectedApp.id, rejectionReason);
      toast.success('Application marked as Rejected.', { id: 'reject-action' });
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedApp((prev: any) => ({
        ...prev,
        status: 'rejected',
        rejection_reason: rejectionReason
      }));
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject application.', { id: 'reject-action' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Internship Applications & Approvals | Admin</title>
      </Head>

      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1">
              <button onClick={() => router.push('/admin/internships')} className="hover:text-gray-900 transition-colors inline-flex items-center gap-1">
                <ArrowLeft size={13} /> Back to Internships
              </button>
              <span>/</span>
              <span>Applications & Approvals</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>Internship Applications</span>
              <span className="text-xs bg-[#1B2A6B] text-white px-2.5 py-0.5 rounded-full font-extrabold">{meta?.total ?? apps?.length ?? 0}</span>
            </h1>
            <p className="text-xs font-semibold text-gray-500 mt-1">Review candidates, configure dynamic appointment details, and issue official 1-page appointment letters.</p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by candidate name, email, phone, degree, or role..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 text-xs font-extrabold border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted / New</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* APPLICATIONS TABLE */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="animate-spin text-[#1B2A6B]" size={32} />
              <span className="text-xs font-bold">Loading applications...</span>
            </div>
          ) : apps?.length === 0 ? (
            <div className="p-16 text-center text-gray-400">
              <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="font-extrabold text-sm text-gray-700">No applications found</p>
              <p className="text-xs text-gray-400 mt-1">Try modifying your search or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-black tracking-wider uppercase text-gray-600">
                    <th className="py-3.5 px-6">Applicant</th>
                    <th className="py-3.5 px-6">Internship Role</th>
                    <th className="py-3.5 px-6">T&C & Sign</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Applied Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {apps.map((app: any) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-gray-900">{app.applicant_name || `${app.first_name || ''} ${app.last_name || ''}`}</div>
                        <div className="text-[11px] text-gray-500 font-medium">{app.applicant_email || app.email}</div>
                        <div className="text-[10px] text-gray-400">{app.applicant_phone || app.phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-800">{app.internship?.title || app.application_type || 'General Application'}</span>
                        {app.degree && <div className="text-[10px] text-gray-500">{app.degree}</div>}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          {app.terms_accepted ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit border border-emerald-100">
                              <CheckCircle2 size={11} /> T&C Agreed
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded w-fit">No T&C</span>
                          )}
                          {app.signature_path || app.signature_data ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100">
                              <PenTool size={11} /> Signed
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 text-[11px] font-extrabold rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                          {(app.status || 'submitted').replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-medium text-[11px]">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetails(app)}
                            className="px-3.5 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={13} /> Review Details
                          </button>
                          {app.status === 'approved' && (
                            <button
                              onClick={() => InternshipService.downloadAppointmentLetter(app.id)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-xl border border-emerald-200 transition-colors"
                              title="Download Official 1-Page Letter"
                            >
                              <Download size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination meta={meta} page={page} setPage={setPage} />
        </div>
      </div>

      {/* ─── COMPREHENSIVE APPLICATION REVIEW & APPOINTMENT DETAILS MODAL ─── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-3xl p-6 border border-gray-200 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    APPLICATION #{selectedApp.id}
                  </span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${statusColors[selectedApp.status] || 'bg-gray-100'}`}>
                    {(selectedApp.status || 'submitted').replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  {selectedApp.applicant_name || `${selectedApp.first_name || ''} ${selectedApp.last_name || ''}`}
                </h2>
                <p className="text-xs text-gray-500 font-semibold">
                  Applied for: <strong>{selectedApp.internship?.title || selectedApp.application_type || 'Internship'}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">

              {/* 1. AUTO-FETCHED CANDIDATE INFORMATION */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1B2A6B] flex items-center gap-1.5">
                    <UserIcon size={14} /> Candidate Information
                  </h3>
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    ✓ Fetched from Application (Read-only)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Full Name</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.applicant_name || `${selectedApp.first_name || ''} ${selectedApp.last_name || ''}`}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Email Address</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.applicant_email || selectedApp.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Mobile Phone</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.applicant_phone || selectedApp.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Degree / Qualification</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.degree || 'Not Provided'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Graduation Year</span>
                    <p className="font-extrabold text-gray-900 text-xs">{selectedApp.graduation_year || 'Not Provided'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Application ID</span>
                    <p className="font-extrabold text-gray-900 text-xs">#{selectedApp.id}</p>
                  </div>
                </div>
              </div>

              {/* 2. DEDICATED APPOINTMENT LETTER DETAILS FORM */}
              <div className="bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 p-5 rounded-3xl border border-indigo-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#1B2A6B] text-white flex items-center justify-center font-black">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900">Appointment Letter Details Form</h3>
                      <p className="text-[11px] text-gray-500 font-medium">Configure position, dates, schedule, compensation, and reporting details for the official letter.</p>
                    </div>
                  </div>
                  
                  {selectedApp.status === 'approved' ? (
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                      <CheckCircle2 size={13} /> Appointment Letter: Generated
                    </span>
                  ) : (
                    <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-xl flex items-center gap-1">
                      <Clock size={13} /> Appointment Details: Ready to Issue
                    </span>
                  )}
                </div>

                {/* Grid 1: Role & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Designation / Internship Position *
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Backend Developer Intern"
                      className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Engineering & Development"
                      className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* Grid 2: Dates & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar size={12} /> Internship Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar size={12} /> Internship End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Duration (e.g. 6 Months) *
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 6 Months"
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* Working Days Selector */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      Working Days *
                    </label>
                    <span className="text-[11px] font-black text-[#1B2A6B]">
                      Display in Letter: "{workingDaysText}"
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {ALL_DAYS.map((day) => {
                      const isSelected = workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#1B2A6B] text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected && <Check size={12} className="inline mr-1" />}
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1">
                    <input
                      type="text"
                      value={workingDaysText}
                      onChange={(e) => setWorkingDaysText(e.target.value)}
                      placeholder="Custom working days text (e.g. Monday to Friday)"
                      className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Grid 3: Working Hours & Break Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Clock size={12} /> Working Hours *
                    </label>
                    <input
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      placeholder="09:30 AM - 06:30 PM"
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Break Time (Optional)
                    </label>
                    <input
                      type="text"
                      value={breakTime}
                      onChange={(e) => setBreakTime(e.target.value)}
                      placeholder="01:00 PM - 02:00 PM"
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                      Reporting Time
                    </label>
                    <input
                      type="text"
                      value={reportingTime}
                      onChange={(e) => setReportingTime(e.target.value)}
                      placeholder="09:30 AM"
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* Grid 4: Compensation / Stipend */}
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                      <DollarSign size={13} className="text-emerald-600" /> Monthly Stipend / Compensation *
                    </label>
                    <span className="text-xs font-black text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      Preview: {stipendCurrency}{Number(stipendAmount || 0).toLocaleString()} per {paymentFrequency}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">Amount (Numeric)</span>
                      <input
                        type="number"
                        value={stipendAmount}
                        onChange={(e) => setStipendAmount(e.target.value)}
                        placeholder="18000"
                        className="w-full px-3 py-2 text-xs font-black border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">Currency Symbol</span>
                      <select
                        value={stipendCurrency}
                        onChange={(e) => setStipendCurrency(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
                      >
                        <option value="₹">₹ (INR - Indian Rupee)</option>
                        <option value="$">$ (USD)</option>
                        <option value="€">€ (EUR)</option>
                        <option value="£">£ (GBP)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">Payment Frequency</span>
                      <select
                        value={paymentFrequency}
                        onChange={(e) => setPaymentFrequency(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
                      >
                        <option value="month">per month</option>
                        <option value="annum">per annum</option>
                        <option value="week">per week</option>
                        <option value="project">fixed project stipend</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Grid 5: Reporting Manager & Work Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                        Reporting To (Role / Title) *
                      </label>
                      <input
                        type="text"
                        value={reportingTo}
                        onChange={(e) => setReportingTo(e.target.value)}
                        placeholder="Technical Project Manager / Team Lead"
                        className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                        Reporting Person Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={reportingPersonName}
                        onChange={(e) => setReportingPersonName(e.target.value)}
                        placeholder="e.g. Karan Dave"
                        className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                        <MapPin size={12} /> Work Location *
                      </label>
                      <input
                        type="text"
                        value={workLocation}
                        onChange={(e) => setWorkLocation(e.target.value)}
                        placeholder="Vadodara, Gujarat"
                        className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Work Mode
                        </label>
                        <select
                          value={workMode}
                          onChange={(e) => setWorkMode(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white cursor-pointer"
                        >
                          <option value="Onsite">Onsite</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Issue Date *
                        </label>
                        <input
                          type="date"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B2A6B] bg-white shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reference Number */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-0.5">
                      Appointment Reference Number
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="BB-AL-2026-0004-CONF"
                      className="w-full bg-transparent font-black text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setReferenceNumber(`BB-AL-${new Date().getFullYear()}-${String(selectedApp.id).padStart(4, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`)}
                    className="p-1.5 text-xs text-slate-600 hover:text-[#1B2A6B] hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-bold"
                    title="Generate new unique reference"
                  >
                    <RotateCcw size={13} /> Regenerate Ref
                  </button>
                </div>

                {/* Save Draft Button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isSavingDetails}
                    onClick={handleSaveDetailsDraft}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={14} /> {isSavingDetails ? 'Saving Draft...' : 'Save Appointment Details'}
                  </button>
                </div>
              </div>

              {/* 3. CANDIDATE SIGNATURE & T&C CONSENT */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <PenTool size={14} className="text-[#1B2A6B]" /> Candidate Digital Signature & Verification
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Auto-Fetched from Application
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-1 bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-center min-h-[85px] max-h-28 overflow-hidden shadow-2xs">
                    {selectedApp.signature_data ? (
                      <img src={selectedApp.signature_data} alt="Candidate Signature" className="max-h-20 object-contain" />
                    ) : (
                      <img src={selectedApp.signature_url || `/api/public/internships/applications/${selectedApp.id}/signature`} alt="Candidate Signature" className="max-h-20 object-contain" />
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-1.5 text-xs">
                    <p className="font-bold text-slate-800">
                      Applicant: <span className="text-[#1B2A6B]">{selectedApp.applicant_name}</span> ({selectedApp.email})
                    </p>
                    <p className="text-slate-500 font-medium">
                      Terms Accepted: <strong className="text-emerald-700">{selectedApp.terms_accepted ? 'Yes - Verified' : 'Standard Agreement'}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium italic">
                      Per official policy, the Appointment Letter requires and displays ONLY the candidate's verified signature.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. FINAL ACTION BAR */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-200">
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">Generate & Issue Official Letter</h4>
                    <p className="text-[11px] text-gray-500">Signs & compiles the appointment details onto the official BlueBoxx DA Letterhead.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {selectedApp.status === 'approved' && (
                      <button
                        type="button"
                        onClick={() => InternshipService.downloadAppointmentLetter(selectedApp.id)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={14} /> Download Official Appointment Letter
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={handleApprove}
                      className="px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {isProcessingAction ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>{selectedApp.status === 'approved' ? 'Updating & Regenerating Letter...' : 'Approving & Generating Letter...'}</span>
                        </>
                      ) : (
                        <>
                          <Award size={15} />
                          <span>{selectedApp.status === 'approved' ? 'Update & Regenerate Appointment Letter' : 'Approve Application & Generate Appointment Letter'}</span>
                        </>
                      )}
                    </button>

                    {selectedApp.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Reject Application #{selectedApp.id}?</h3>
                <p className="text-xs text-slate-500 font-medium">Provide an optional rejection reason to be sent to the candidate.</p>
              </div>
            </div>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Requirements do not match current openings at this time..."
              className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 bg-slate-50/50"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                disabled={isProcessingAction}
                className="flex-1 py-2.5 text-xs font-extrabold border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isProcessingAction}
                className="flex-1 py-2.5 text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer"
              >
                {isProcessingAction ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
