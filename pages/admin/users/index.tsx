import Link from "next/link";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Search, Filter, MoreHorizontal, UserPlus, Shield, GraduationCap, Building, 
  Download, Mail, Check, X, ShieldAlert, Trash2, Users, RefreshCw, Sparkles, 
  ExternalLink, Phone, Calendar, BookOpen, Briefcase, Award, CheckCircle2, Clock
} from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import { useState, useRef, useEffect } from "react";
import { useConfirm } from "../../../src/context/ConfirmContext";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import Head from "next/head";

const fetcher = (url: string) => api.get(url).then(r => r.data);

const ROLE_TABS = ["All Users", "Students", "Experts", "Companies", "Colleges", "Admins"];

const ROLE_MAP: Record<string, string> = {
  "All Users": "",
  "Students": "student",
  "Experts": "expert",
  "Companies": "company",
  "Colleges": "college",
  "Admins": "admin",
};

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("All Users");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const confirmAction = useConfirm();

  // Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student", password: "password123" });
  const [isSaving, setIsSaving] = useState(false);

  // User Profile Drawer State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleOpenUserProfile = async (user: any) => {
    setSelectedUser(user);
    setUserDetails(null);
    setIsLoadingDetails(true);
    try {
      const res = await api.get(`/admin/users/${user.id}`);
      setUserDetails(res.data?.data || res.data || user);
    } catch (e) {
      setUserDetails(user);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const roleFilter = ROLE_MAP[activeTab] || "";
  const key = `/admin/users?page=${page}&per_page=15${roleFilter ? `&role=${roleFilter}` : ""}${searchQ ? `&search=${searchQ}` : ""}`;

  const { data, mutate, isLoading } = useSWR(key, fetcher);
  const users = data?.data || [];
  const meta = data?.meta || {};

  // Debounce search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (val: string) => {
    setSearchQ(val);
    setPage(1);
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "company": return <Building size={12} />;
      case "college": return <GraduationCap size={12} />;
      case "expert": return <Shield size={12} />;
      case "student": return <GraduationCap size={12} />;
      default: return <Users size={12} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "verified": return <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold capitalize">{status}</Badge>;
      case "suspended": return <Badge className="bg-rose-50 text-rose-700 border-none font-bold capitalize">{status}</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-600 border-none font-bold capitalize">{status || "active"}</Badge>;
    }
  };

  const handleVerify = async (id: number, role?: string) => {
    try {
      const res = await api.put(`/admin/verify-profile/${id}`);
      mutate();
      toast.success(res.data?.message || (role ? `${role.charAt(0).toUpperCase() + role.slice(1)} verified!` : "User activated successfully!"));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to verify or activate user.");
    }
    setOpenDropdownId(null);
  };

  const handleSuspend = async (id: number) => {
    try {
      await api.put(`/admin/users/${id}`, { status: "suspended" });
      mutate();
      toast.success("User suspended.");
    } catch {
      toast.error("Failed to suspend user.");
    }
    setOpenDropdownId(null);
  };

  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete User", description: "Are you sure you want to delete this user?", isDestructive: true })) {
      try {
        await api.delete(`/admin/users/${id}`);
        mutate();
        toast.success("User deleted!");
      } catch {
        toast.error("Failed to delete user.");
      }
    }
    setOpenDropdownId(null);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post("/register", {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.password,
        role: newUser.role,
      });
      mutate();
      setIsAddModalOpen(false);
      setNewUser({ name: "", email: "", role: "student", password: "password123" });
      toast.success("User created successfully!");
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        toast.error(firstError[0] || "Validation failed");
      } else {
        toast.error(err?.response?.data?.message || "Failed to create user.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = async () => {
    const params: any = {};
    if (roleFilter) params.role = roleFilter;
    if (searchQ) params.search = searchQ;
    
    const toastId = toast.loading('Exporting users...');
    try {
      const res = await api.get('/admin/users/export', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export successful', { id: toastId });
    } catch (e) {
      toast.error('Export failed', { id: toastId });
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>User Management | BlueBoxx DA</title>
      </Head>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Universal User Management</h1>
          <p className="text-slate-500 font-medium text-sm">Manage, verify, and monitor all entities across the platform.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={() => mutate()} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <Link href="/admin/role-requests" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <Sparkles size={16} /> Role Requests
          </Link>
          <button onClick={handleExportCSV} className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2">
            <UserPlus size={16} /> Add Entity
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible flex flex-col min-h-[500px]">
        {/* Top Controls & Tabs */}
        <div className="border-b border-slate-100">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex space-x-1 overflow-x-auto w-full sm:w-auto admin-scrollbar pb-2 sm:pb-0">
              {ROLE_TABS.map(role => (
                <button
                  key={role}
                  onClick={() => { setActiveTab(role); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                    activeTab === role
                      ? "bg-[#1B2A6B] text-white"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search email, name..."
                  value={searchQ}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-x-auto pb-8">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 backdrop-blur-sm shadow-sm z-10">
              <tr>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Entity Details</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Role & Access</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Join Date</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400 font-semibold">Loading users...</td></tr>
              )}
              {!isLoading && users.length === 0 && (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400 font-semibold">No users found.</td></tr>
              )}
              {users.map((user: any) => {
                const displayName = user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim();
                const userRole = user.roles?.[0]?.name || "";
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleOpenUserProfile(user)}
                        className="flex items-center gap-4 text-left group/item cursor-pointer focus:outline-none"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#1B2A6B] group-hover/item:bg-[#C9A227] text-white flex items-center justify-center font-bold text-sm shrink-0 transition-colors shadow-xs">
                          {displayName.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover/item:text-[#1B2A6B] group-hover/item:underline transition-colors flex items-center gap-1.5">
                            {displayName}
                            <ExternalLink size={12} className="opacity-0 group-hover/item:opacity-100 text-[#1B2A6B] transition-opacity" />
                          </p>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Mail size={12}/> {user.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md w-fit text-xs font-bold text-slate-700 capitalize">
                        {getRoleIcon(userRole)} {userRole || "No Role"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(user.status || "active")}
                    </td>
                    <td className="py-4 px-6 text-right relative overflow-visible">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                        className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openDropdownId === user.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setOpenDropdownId(null)} />
                          <div className="absolute right-6 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 overflow-hidden text-left animate-in fade-in slide-in-from-top-1 duration-150">
                            <button
                              onClick={() => handleVerify(user.id, userRole)}
                              className="w-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Check size={16} className="text-emerald-500" />
                              {userRole === "company" ? "Verify Company" : "Activate User"}
                            </button>
                            <button
                              onClick={() => handleSuspend(user.id)}
                              className="w-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <ShieldAlert size={16} className="text-amber-500" />
                              Suspend Account
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="w-full px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={16} className="text-red-500" />
                              Delete Entity
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta?.last_page > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Showing {meta.from}–{meta.to} of {meta.total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Entity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">Add New Entity</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-xl">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#1B2A6B]"
                >
                  <option value="student">Student</option>
                  <option value="expert">Expert / Instructor</option>
                  <option value="company">Company</option>
                  <option value="college">College</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Create Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive User Profile Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#121c47] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-[#C9A227] flex items-center justify-center font-black text-xl shrink-0 shadow-inner">
                  {(selectedUser.name || selectedUser.first_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{selectedUser.name || `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C9A227] text-[#0d1635]">
                      {selectedUser.roles?.[0]?.name || selectedUser.role || 'User'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 font-medium mt-0.5 flex items-center gap-1.5">
                    <Mail size={12}/> {selectedUser.email}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 admin-scrollbar">
              {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <RefreshCw className="animate-spin text-[#1B2A6B]" size={28} />
                  <span className="text-xs font-bold">Loading full profile details...</span>
                </div>
              ) : (
                <>
                  {/* Status & Quick Info Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Status</p>
                      <p className="text-xs font-black text-emerald-600 mt-1 capitalize">{userDetails?.status || 'Active'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone</p>
                      <p className="text-xs font-bold text-slate-700 mt-1 truncate">{userDetails?.phone || 'Not provided'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Join Date</p>
                      <p className="text-xs font-bold text-slate-700 mt-1">
                        {userDetails?.created_at ? new Date(userDetails.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Verification</p>
                      <p className="text-xs font-bold text-slate-700 mt-1">
                        {userDetails?.email_verified_at ? 'Email Verified ✓' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>

                  {/* Academic / Profile Info */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <GraduationCap size={15} className="text-[#1B2A6B]" /> Academic & Profile Overview
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold">College / University:</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {userDetails?.student_profile?.college_name || userDetails?.college_name || userDetails?.education?.[0]?.college_name || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Degree / Course:</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {userDetails?.student_profile?.course || userDetails?.education?.[0]?.course || userDetails?.degree || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Department / Stream:</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {userDetails?.student_profile?.department || userDetails?.education?.[0]?.department || 'Information Technology'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Semester / Year:</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {userDetails?.student_profile?.semester ? `Semester ${userDetails.student_profile.semester}` : 'Final Year'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enrolled Courses & Progress */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen size={15} className="text-[#1B2A6B]" /> Enrolled Courses & Learning Progress
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500">
                        {(userDetails?.courses?.length || userDetails?.enrollments?.length || 0)} Enrolled
                      </span>
                    </div>

                    {((userDetails?.courses?.length || 0) > 0 || (userDetails?.enrollments?.length || 0) > 0) ? (
                      <div className="space-y-3">
                        {(userDetails?.courses || userDetails?.enrollments || []).map((course: any, idx: number) => {
                          const courseTitle = course.title || course.course?.title || `Full Stack Web Development & AI`;
                          const progress = course.progress || course.pivot?.progress || 45;
                          return (
                            <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-extrabold text-slate-800">{courseTitle}</p>
                                <span className="text-[11px] font-black text-[#1B2A6B]">{progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-[#1B2A6B] to-[#C9A227] h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${progress}%` }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs font-semibold">
                        No active course enrollments found for this account.
                      </div>
                    )}
                  </div>

                  {/* Active Internships & Task Progress */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Briefcase size={15} className="text-[#C9A227]" /> Internship & Project Tracking
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500">
                        {(userDetails?.internship_applications?.length || userDetails?.internships?.length || 0)} Applications
                      </span>
                    </div>

                    {((userDetails?.internship_applications?.length || 0) > 0 || (userDetails?.internships?.length || 0) > 0) ? (
                      <div className="space-y-3">
                        {(userDetails?.internship_applications || userDetails?.internships || []).map((internship: any, idx: number) => {
                          const title = internship.internship?.title || internship.title || 'Frontend Web Developer Intern';
                          const status = internship.status || 'Active';
                          return (
                            <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-extrabold text-slate-800">{title}</p>
                                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Applied: {internship.created_at ? new Date(internship.created_at).toLocaleDateString() : 'Active'}</p>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs font-semibold">
                        No internship applications or assigned projects recorded yet.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              {selectedUser.roles?.[0]?.name?.toLowerCase() === 'student' && (
                <Link
                  href={`/admin/users/students/${selectedUser.id}`}
                  className="px-4 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-1.5"
                >
                  Edit Full Student Form <ExternalLink size={13} />
                </Link>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="ml-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
