import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  UserCheck, UserX, CheckCircle2, Search, Filter, ShieldAlert, AlertCircle, 
  RefreshCw, Mail, Calendar, Info, X, Phone, ArrowRight, Sparkles, Clock, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../src/lib/axios';

interface RoleRequestItem {
  id: number;
  user_id: number;
  current_role: any;
  requested_role: any;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
  notes?: string;
  rejection_reason?: string;
  reviewed_at?: string;
  created_at: string;
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    account_status?: string;
  };
  reviewer?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
  };
}

const getRoleString = (role: any): string => {
  if (!role) return '';
  if (typeof role === 'string') return role;
  if (typeof role === 'object') {
    return role.name || role.title || role.guard_name || '';
  }
  return String(role);
};

export default function AdminRoleRequestsPage() {
  const [requests, setRequests] = useState<RoleRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Reject Modal State
  const [rejectingItem, setRejectingItem] = useState<RoleRequestItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const fetchRoleRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/role-requests');
      if (res.data?.success) {
        setRequests(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setRequests(res.data);
      }
    } catch (err: any) {
      toast.error('Failed to load role change requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoleRequests();
  }, [fetchRoleRequests]);

  const handleApprove = async (requestItem: RoleRequestItem) => {
    const applicantName = requestItem.user?.name || `${requestItem.user?.first_name || ''} ${requestItem.user?.last_name || ''}`.trim() || 'User';
    const reqRoleStr = getRoleString(requestItem.requested_role) || 'jobseeker';
    
    if (!window.confirm(`Are you sure you want to APPROVE role change for ${applicantName} to ${reqRoleStr}?`)) {
      return;
    }

    setIsSubmittingAction(true);
    try {
      const res = await api.post(`/admin/role-requests/${requestItem.id}/approve`);
      if (res.data?.success || res.status === 200) {
        toast.success(`Role change approved! ${applicantName} is now ${reqRoleStr}.`);
        fetchRoleRequests();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve role request.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleOpenRejectModal = (requestItem: RoleRequestItem) => {
    setRejectingItem(requestItem);
    setRejectionReason('');
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;

    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }

    setIsSubmittingAction(true);
    try {
      const res = await api.post(`/admin/role-requests/${rejectingItem.id}/reject`, {
        rejection_reason: rejectionReason.trim(),
        notes: rejectionReason.trim()
      });

      if (res.data?.success || res.status === 200) {
        toast.success('Role change request rejected.');
        setRejectingItem(null);
        setRejectionReason('');
        fetchRoleRequests();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject role request.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const filteredRequests = requests.filter(item => {
    // Status Filter
    if (selectedStatus !== 'all' && item.status !== selectedStatus) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const userName = (item.user?.name || `${item.user?.first_name || ''} ${item.user?.last_name || ''}`).toLowerCase();
      const userEmail = (item.user?.email || '').toLowerCase();
      const userPhone = (item.user?.phone || '').toLowerCase();
      const currentRole = getRoleString(item.current_role).toLowerCase();
      const requestedRole = getRoleString(item.requested_role).toLowerCase();
      const reason = typeof item.reason === 'string' ? item.reason.toLowerCase() : '';

      return userName.includes(q) || userEmail.includes(q) || userPhone.includes(q) || currentRole.includes(q) || requestedRole.includes(q) || reason.includes(q);
    }

    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Role Change Requests | Sarvakshetra Admin</title>
      </Head>

      <div className="p-8 max-w-7xl mx-auto space-y-8 font-inter">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B2A6B]/10 text-[#1B2A6B] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Permission Governance
            </div>
            <h1 className="text-3xl font-black text-slate-900 font-sora">Role Change Requests</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Review and approve applicant transitions between Student, Intern, and Jobseeker roles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRoleRequests}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Pending Review</span>
              <span className="text-2xl font-black text-amber-600 font-sora">{pendingCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Approved Requests</span>
              <span className="text-2xl font-black text-emerald-600 font-sora">{approvedCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Rejected Requests</span>
              <span className="text-2xl font-black text-rose-600 font-sora">{rejectedCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <UserX size={22} />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                  selectedStatus === st
                    ? 'bg-[#1B2A6B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st} {st === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm font-semibold animate-pulse flex flex-col items-center justify-center gap-2">
              <RefreshCw size={24} className="animate-spin text-[#1B2A6B]" />
              Loading role change requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm font-semibold flex flex-col items-center justify-center gap-2">
              <CheckCircle2 size={32} className="text-slate-300" />
              No role change requests found matching this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-5">Role Transition</th>
                    <th className="py-3.5 px-5">Reason</th>
                    <th className="py-3.5 px-5">Requested At</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredRequests.map((req) => {
                    const userName = req.user?.name || `${req.user?.first_name || ''} ${req.user?.last_name || ''}`.trim() || 'Anonymous';
                    const currentRole = getRoleString(req.current_role) || 'student';
                    const requestedRole = getRoleString(req.requested_role) || 'jobseeker';
                    const reasonText = typeof req.reason === 'string' ? req.reason : (req.reason ? JSON.stringify(req.reason) : 'No specific reason provided.');
                    const rejectionReasonText = typeof req.rejection_reason === 'string' ? req.rejection_reason : (req.rejection_reason ? JSON.stringify(req.rejection_reason) : '');

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 text-sm">{userName}</div>
                          <div className="text-slate-500 text-xs font-medium flex items-center gap-2 mt-0.5">
                            <Mail size={12} /> {req.user?.email || 'No email'}
                            {req.user?.phone && (
                              <>
                                <span className="text-slate-300">•</span>
                                <Phone size={12} /> {req.user?.phone}
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                            <span className="capitalize text-slate-700 font-bold">{currentRole}</span>
                            <ArrowRight size={12} className="text-slate-400" />
                            <span className="capitalize text-[#1B2A6B] font-black">{requestedRole}</span>
                          </div>
                        </td>

                        <td className="py-4 px-5 max-w-xs">
                          <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed font-normal">
                            {reasonText}
                          </p>
                          {rejectionReasonText && (
                            <div className="mt-1 text-[11px] text-rose-600 font-medium">
                              <strong>Rejection reason:</strong> {rejectionReasonText}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-400" />
                            {new Date(req.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                              <Clock size={12} /> Pending Review
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                              <UserX size={12} /> Rejected
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(req)}
                                disabled={isSubmittingAction}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs transition-all"
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(req)}
                                disabled={isSubmittingAction}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs inline-flex items-center gap-1 transition-all"
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs font-medium">
                              Reviewed {req.reviewer?.name ? `by ${req.reviewer.name}` : ''}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden">
            <button
              onClick={() => setRejectingItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <ShieldAlert size={24} />
            </div>

            <h3 className="text-lg font-black text-slate-900 font-sora">Reject Role Change Request</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Please specify the reason for rejecting {rejectingItem.user?.name || 'this user'}'s request to become a {getRoleString(rejectingItem.requested_role)}.
            </p>

            <form onSubmit={handleConfirmReject} className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Incomplete profile details, or eligibility criteria not met..."
                  className="w-full p-3 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none shadow-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAction || !rejectionReason.trim()}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isSubmittingAction ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
