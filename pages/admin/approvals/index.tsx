import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { UserCheck, UserX, CheckCircle2, Search, Filter, ShieldAlert, AlertCircle, RefreshCw, Mail, Calendar, Info } from 'lucide-react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  roles: { name: string }[];
  created_at: string;
}

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchPendingApprovals = React.useCallback(async () => {
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
      setUsers(response.data.data.data);
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

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    const isApprove = action === 'approve';
    const confirmMessage = isApprove 
      ? 'Are you sure you want to approve this user? They will be notified via email.'
      : 'Are you sure you want to reject this application?';

    if (!window.confirm(confirmMessage)) return;

    const loadingToast = toast.loading(`${isApprove ? 'Approving' : 'Rejecting'} user...`);
    try {
      const api = (await import('../../../src/lib/axios')).default;
      await api.put(`/admin/approvals/${id}/${action}`);
      
      setUsers(users.filter(u => u.id !== id));
      toast.success(`User ${action}d successfully`, { id: loadingToast });
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} user`, { id: loadingToast });
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Pending Approvals | Blueboxx Admin</title>
      </Head>

      <div className="max-w-full p-4 sm:p-5 space-y-6">
        
        {/* Premium Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#243580] px-6 py-8 shadow-lg">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-32 w-20 h-20 rounded-full bg-[#C9A227]/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#C9A227] text-xs font-bold mb-3 border border-[#C9A227]/30">
                <ShieldAlert size={14} /> Action Required
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Pending Approvals</h1>
              <p className="text-slate-300 text-sm mt-1 font-medium max-w-xl">
                Review and approve new Experts, Companies, and Institutes. Approved users will automatically receive a welcome email with login instructions.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchPendingApprovals}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold shadow-sm"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 
                Refresh List
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] font-medium text-slate-700 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {users.length} Pending
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Applicant Profile</th>
                  <th className="px-6 py-4">Requested Role</th>
                  <th className="px-6 py-4">Date Applied</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#C9A227] mb-3" />
                        <span className="font-bold text-sm">Loading applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 max-w-sm mx-auto">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-black text-slate-700 mb-1">You're all caught up!</h3>
                        <p className="text-sm font-medium text-slate-500">
                          {searchQuery ? 'No applicants matched your search.' : 'There are no pending approvals at the moment. New registrations will appear here.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] flex items-center justify-center font-black uppercase text-sm border border-[#1B2A6B]/10 group-hover:bg-[#1B2A6B] group-hover:text-white transition-colors shadow-sm">
                            {user.first_name[0]}{user.last_name[0]}
                          </div>
                          <div>
                            <div className="font-black text-slate-800 text-[15px]">{user.first_name} {user.last_name}</div>
                            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail size={12} className="text-slate-400" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-lg uppercase tracking-wider border border-amber-200/50">
                          <AlertCircle size={12} />
                          {user.roles[0]?.name?.replace('_', ' ') || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                          <Calendar size={14} className="text-slate-400" />
                          {new Date(user.created_at).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5 ml-5">
                           {new Date(user.created_at).toLocaleTimeString('en-IN', { 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleAction(user.id, 'approve')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 rounded-xl font-bold text-xs transition-all border border-emerald-100 hover:border-emerald-500"
                            title="Approve & Send Email"
                          >
                            <UserCheck size={16} /> Approve
                          </button>
                          <button 
                            onClick={() => handleAction(user.id, 'reject')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20 rounded-xl font-bold text-xs transition-all border border-rose-100 hover:border-rose-500"
                            title="Reject Application"
                          >
                            <UserX size={16} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Info */}
          <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <Info size={14} className="text-blue-400" />
            Approving a user will automatically send them a welcome email and grant them access to their dashboard.
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
