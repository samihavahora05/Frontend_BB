import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  UserCheck, UserX, CheckCircle2, Search, Filter, ShieldAlert, AlertCircle, 
  RefreshCw, Mail, Calendar, Info, Eye, X, Phone, Globe, MapPin, Briefcase, 
  GraduationCap, Building2, User as UserIcon, Check, Clock, Sparkles
} from 'lucide-react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: string;
  account_status?: string;
  admin_approved?: boolean;
  email_verified_at?: string | null;
  roles: { name: string }[];
  created_at: string;
  expert_profile?: any;
  company_profile?: any;
  college_profile?: any;
  student_profile?: any;
  intern_profile?: any;
  job_seeker_profile?: any;
}

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  // Review Modal State
  const [reviewUser, setReviewUser] = useState<User | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  // Reject Modal State
  const [rejectingUser, setRejectingUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const router = useRouter();

  const fetchPendingApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const api = (await import('../../../src/lib/axios')).default;
      const { getActiveToken } = await import('../../../src/lib/authUtils');
      
      const token = getActiveToken();
      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await api.get('/admin/approvals');
      const fetchedData = response.data?.data?.data || response.data?.data || [];
      setUsers(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error('Error fetching approvals', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const handleOpenReview = async (user: User) => {
    setReviewUser(user);
    setLoadingReview(true);
    try {
      const api = (await import('../../../src/lib/axios')).default;
      const response = await api.get(`/admin/approvals/${user.id}`);
      if (response.data?.user) {
        setReviewUser(response.data.user);
      }
    } catch (err) {
      console.error('Error loading detailed profile', err);
    } finally {
      setLoadingReview(false);
    }
  };

  const handleApprove = async (user: User) => {
    if (!user.email_verified_at) {
      toast.error('Email verification is required before approval. The applicant has not verified their email yet.');
      return;
    }

    if (!window.confirm(`Are you sure you want to approve ${user.first_name} ${user.last_name}? They will receive an approval email with login access.`)) {
      return;
    }

    const loadingToast = toast.loading('Approving user...');
    try {
      const api = (await import('../../../src/lib/axios')).default;
      await api.put(`/admin/approvals/${user.id}/approve`);
      
      setUsers(prev => prev.filter(u => u.id !== user.id));
      if (reviewUser?.id === user.id) {
        setReviewUser(null);
      }
      toast.success('Account approved successfully. Email notification sent!', { id: loadingToast });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to approve user';
      toast.error(errMsg, { id: loadingToast });
    }
  };

  const handleOpenRejectModal = (user: User) => {
    setRejectingUser(user);
    setRejectionReason('');
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingUser || !rejectionReason.trim()) return;

    setIsSubmittingReject(true);
    const loadingToast = toast.loading('Rejecting application and sending email...');
    
    try {
      const api = (await import('../../../src/lib/axios')).default;
      await api.put(`/admin/approvals/${rejectingUser.id}/reject`, {
        reason: rejectionReason.trim()
      });
      
      setUsers(prev => prev.filter(u => u.id !== rejectingUser.id));
      if (reviewUser?.id === rejectingUser.id) {
        setReviewUser(null);
      }
      setRejectingUser(null);
      setRejectionReason('');
      toast.success('User application rejected and notification email sent.', { id: loadingToast });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to reject user';
      toast.error(errMsg, { id: loadingToast });
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
    const emailMatch = (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatch = fullName.includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;

    const userRole = u.roles?.[0]?.name?.toLowerCase() || '';
    const matchesRole = selectedRole === 'all' || userRole === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Pending Approvals | Sarvakshetra Admin</title>
      </Head>

      <div className="max-w-full p-4 sm:p-6 space-y-6 font-inter">
        
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#243580] px-7 py-8 shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-32 w-20 h-20 rounded-full bg-[#C9A227]/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#C9A227] text-xs font-bold mb-3 border border-[#C9A227]/30">
                <ShieldAlert size={14} /> Administrator Verification Workflow
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sora">Pending Approvals</h1>
              <p className="text-slate-300 text-sm mt-1 font-medium max-w-2xl leading-relaxed">
                Review and approve new Expert, College, and Company registrations. Only email-verified registrations can be approved. Approved users automatically receive a branded activation email.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/role-requests')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs shadow-md cursor-pointer"
              >
                <ShieldAlert size={14} /> 
                Role Change Requests
              </button>
              <button 
                onClick={fetchPendingApprovals}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
                Refresh List
              </button>
            </div>
          </div>
        </div>

        {/* Content Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Table Filters & Toolbar */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] font-medium text-slate-700 transition-all shadow-sm"
                />
              </div>

              {/* Role filter */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20"
                >
                  <option value="all">All Roles</option>
                  <option value="expert">Expert</option>
                  <option value="college">College</option>
                  <option value="company">Company</option>
                  <option value="student">Student</option>
                  <option value="intern">Intern</option>
                  <option value="job-seeker">Job Seeker</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                {filteredUsers.length} Pending Approvals
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-black border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Email Verification</th>
                  <th className="px-5 py-4">Account Status</th>
                  <th className="px-5 py-4">Applied On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#1B2A6B] mb-3" />
                        <span className="font-bold text-sm text-slate-600">Loading pending applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 max-w-sm mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 shadow-sm">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-base font-black text-slate-700 mb-1 font-sora">All caught up!</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {searchQuery || selectedRole !== 'all'
                            ? 'No applications matched your filter criteria.'
                            : 'There are no pending approvals at the moment. New Expert, College, and Company registrations will appear here.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const roleName = user.roles?.[0]?.name?.replace('_', ' ') || 'User';
                    const isEmailVerified = Boolean(user.email_verified_at);

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Applicant Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/10 text-[#1B2A6B] flex items-center justify-center font-black uppercase text-xs border border-[#1B2A6B]/20 shrink-0 shadow-sm">
                              {user.first_name?.[0] || 'U'}{user.last_name?.[0] || ''}
                            </div>
                            <div>
                              <div className="font-black text-slate-800 text-sm">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-semibold">
                                <Mail size={12} className="text-slate-400" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1B2A6B]/5 text-[#1B2A6B] font-extrabold text-[11px] rounded-lg uppercase tracking-wider border border-[#1B2A6B]/15">
                            {roleName}
                          </span>
                        </td>

                        {/* Email Verification Status */}
                        <td className="px-5 py-4">
                          {isEmailVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-lg border border-emerald-200">
                              <CheckCircle2 size={12} className="text-emerald-500" /> Verified ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-[11px] rounded-lg border border-amber-200">
                              <Clock size={12} className="text-amber-500" /> Unverified
                            </span>
                          )}
                        </td>

                        {/* Account Status */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-lg border border-blue-200">
                            Pending Approval
                          </span>
                        </td>

                        {/* Applied Date */}
                        <td className="px-5 py-4">
                          <div className="text-xs font-bold text-slate-700">
                            {new Date(user.created_at).toLocaleDateString('en-IN', { 
                              day: 'numeric', month: 'short', year: 'numeric' 
                            })}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(user.created_at).toLocaleTimeString('en-IN', { 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Review button */}
                            <button
                              onClick={() => handleOpenReview(user)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Review Full Profile"
                            >
                              <Eye size={14} /> Review
                            </button>

                            {/* Approve button */}
                            <button 
                              onClick={() => handleApprove(user)}
                              disabled={!isEmailVerified}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all inline-flex items-center gap-1 ${
                                isEmailVerified
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 cursor-pointer shadow-sm'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                              }`}
                              title={isEmailVerified ? "Approve User" : "Email must be verified first"}
                            >
                              <UserCheck size={14} /> Approve
                            </button>

                            {/* Reject button */}
                            <button 
                              onClick={() => handleOpenRejectModal(user)}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer shadow-sm"
                              title="Reject with Reason"
                            >
                              <UserX size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Guidelines */}
          <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-blue-500 shrink-0" />
              <span>Email verification is strictly enforced before admin approval can be granted.</span>
            </div>
            <div className="text-slate-400 font-semibold">
              Sarvakshetra Multi-Tier Auth Security
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REVIEW PROFILE MODAL / DRAWER */}
        {/* ========================================================================= */}
        {reviewUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B2A6B] text-white flex items-center justify-center font-black text-base shadow-md shadow-[#1B2A6B]/20">
                    {reviewUser.first_name?.[0]}{reviewUser.last_name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 font-sora">
                      {reviewUser.first_name} {reviewUser.last_name}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                      <span className="uppercase text-[#1B2A6B] font-extrabold tracking-wider">{reviewUser.roles?.[0]?.name || 'Applicant'}</span>
                      <span>•</span>
                      <span>{reviewUser.email}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setReviewUser(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                
                {/* Verification Status Banner */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Email Verification</p>
                    {reviewUser.email_verified_at ? (
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Verified on {new Date(reviewUser.email_verified_at).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                        <Clock size={14} className="text-amber-500" /> Pending Email OTP Verification
                      </p>
                    )}
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Contact Phone</p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-400" /> {reviewUser.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Role Specific Profile Details */}
                {reviewUser.roles?.[0]?.name === 'expert' && (
                  <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                      <Briefcase size={14} /> Expert Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Designation:</span>
                        <span className="font-bold text-slate-800">{reviewUser.expert_profile?.designation || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Current Company:</span>
                        <span className="font-bold text-slate-800">{reviewUser.expert_profile?.current_company || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Experience:</span>
                        <span className="font-bold text-slate-800">{reviewUser.expert_profile?.years_of_experience ? `${reviewUser.expert_profile.years_of_experience} years` : 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Hourly Rate:</span>
                        <span className="font-bold text-slate-800">{reviewUser.expert_profile?.hourly_rate ? `₹${reviewUser.expert_profile.hourly_rate}` : 'Not set'}</span>
                      </div>
                    </div>
                    {reviewUser.expert_profile?.bio && (
                      <div className="pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-slate-400 font-semibold block mb-1">Professional Bio:</span>
                        <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{reviewUser.expert_profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}

                {reviewUser.roles?.[0]?.name === 'college' && (
                  <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                      <GraduationCap size={14} /> College / Institution Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Institution Name:</span>
                        <span className="font-bold text-slate-800">{reviewUser.first_name} {reviewUser.last_name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Contact Person:</span>
                        <span className="font-bold text-slate-800">{reviewUser.college_profile?.contact_person || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Website:</span>
                        <span className="font-bold text-[#1B2A6B]">{reviewUser.college_profile?.website || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Placement Officer:</span>
                        <span className="font-bold text-slate-800">{reviewUser.college_profile?.placement_officer || 'Not specified'}</span>
                      </div>
                    </div>
                    {reviewUser.college_profile?.address && (
                      <div className="pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-slate-400 font-semibold block mb-1">Campus Address:</span>
                        <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{reviewUser.college_profile.address}</p>
                      </div>
                    )}
                  </div>
                )}

                {reviewUser.roles?.[0]?.name === 'company' && (
                  <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                      <Building2 size={14} /> Corporate / Company Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Company Name:</span>
                        <span className="font-bold text-slate-800">{reviewUser.first_name} {reviewUser.last_name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Industry:</span>
                        <span className="font-bold text-slate-800">{reviewUser.company_profile?.industry || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Website:</span>
                        <span className="font-bold text-[#1B2A6B]">{reviewUser.company_profile?.website || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Company Size:</span>
                        <span className="font-bold text-slate-800">{reviewUser.company_profile?.company_size || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/60 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setReviewUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const user = reviewUser;
                      setReviewUser(null);
                      handleOpenRejectModal(user);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <UserX size={14} /> Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(reviewUser)}
                    disabled={!reviewUser.email_verified_at}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md ${
                      reviewUser.email_verified_at
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-600/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <UserCheck size={14} /> Approve Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REJECT WITH REASON MODAL */}
        {/* ========================================================================= */}
        {rejectingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 text-rose-600">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <UserX size={16} />
                  </div>
                  <h3 className="text-base font-black text-slate-800 font-sora">Reject Application</h3>
                </div>
                <button
                  onClick={() => setRejectingUser(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Please provide a clear reason for rejecting the application of <strong>{rejectingUser.first_name} {rejectingUser.last_name}</strong> ({rejectingUser.email}). This reason will be emailed to the user.
              </p>

              <form onSubmit={handleConfirmReject} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5">
                    Rejection Reason (Required)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., The submitted organization details could not be verified. Please update your profile information."
                    className="w-full p-3 text-xs font-semibold rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectingUser(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingReject || !rejectionReason.trim()}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmittingReject ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Rejecting...
                      </>
                    ) : (
                      "Confirm & Send Rejection Email"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminDashboardLayout>
  );
}
