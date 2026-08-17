import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Search, Filter, MoreHorizontal, UserPlus, Shield, GraduationCap, Building, Download, Mail, Check, X, ShieldAlert, Trash2, Users, RefreshCw } from "lucide-react";
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

  const handleVerify = async (id: number) => {
    try {
      await api.put(`/admin/verify-profile/${id}`);
      mutate();
      toast.success("Profile verified!");
    } catch {
      toast.error("Failed to verify profile.");
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
      await UserManagerService.exportUsers(params);
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
        <div className="flex items-center gap-3">
          <button onClick={() => mutate()} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={16} />
          </button>
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
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {displayName.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{displayName}</p>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Mail size={12}/> {user.email}</p>
                        </div>
                      </div>
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
                              onClick={() => handleVerify(user.id)}
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
    </AdminDashboardLayout>
  );
}
