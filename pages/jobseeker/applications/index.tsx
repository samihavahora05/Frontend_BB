import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { Search, Filter, Briefcase, Building, MapPin, CheckCircle2, Clock, XCircle, ChevronRight, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "../../../src/components/ui/Badge";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSWR, { mutate } from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'interviewing':
    case 'interview':
      return <Badge className="bg-blue-50 text-blue-700 border-none font-bold gap-1"><Clock size={12}/> Interviewing</Badge>;
    case 'applied':
      return <Badge className="bg-slate-100 text-slate-700 border-none font-bold gap-1"><Briefcase size={12}/> Applied</Badge>;
    case 'offered':
    case 'offer':
    case 'hired':
      return <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold gap-1"><CheckCircle2 size={12}/> Offered</Badge>;
    case 'rejected':
      return <Badge className="bg-red-50 text-red-700 border-none font-bold gap-1"><XCircle size={12}/> Rejected</Badge>;
    case 'shortlisted':
      return <Badge className="bg-purple-50 text-purple-700 border-none font-bold gap-1"><CheckCircle2 size={12}/> Shortlisted</Badge>;
    default:
      return <Badge>{status || 'Applied'}</Badge>;
  }
};

export default function JobseekerApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState<{id: number; role: string} | null>(null);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = new URLSearchParams();
  if (debouncedSearch) queryParams.append("search", debouncedSearch);
  if (statusFilter && statusFilter !== "All Status") queryParams.append("status", statusFilter);

  const { data, isLoading } = useSWR(`/jobseeker/applications?${queryParams.toString()}`, fetcher);
  const applications = data?.data || [];

  const handleWithdraw = async (id: number) => {
    setWithdrawingId(id);
    setConfirmWithdraw(null);
    try {
      await api.post(`/jobseeker/applications/${id}/withdraw`);
      toast.success("Application withdrawn successfully.");
      mutate(`/jobseeker/applications?${queryParams.toString()}`);
      mutate("/jobseeker/dashboard"); // refresh dashboard stats
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to withdraw application.");
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <JobseekerDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Jobs Applied</h1>
          <p className="text-slate-500 font-medium text-sm">Track your job applications and interview statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role or company..."
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] w-64 shadow-sm"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors ${showFilters || statusFilter !== 'All Status' ? 'border-[#1B2A6B] text-[#1B2A6B]' : ''}`}
            >
              <Filter size={18} />
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-10 py-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Status Filter</p>
                </div>
                {['All Status', 'Applied', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors ${statusFilter === status ? 'text-[#1B2A6B] bg-blue-50/50' : 'text-slate-600'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role & Company</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Applied</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <Loader2 size={24} className="animate-spin text-slate-300 mx-auto" />
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <Briefcase size={28} />
                      </div>
                      <p className="text-base font-bold text-slate-700">No applications found.</p>
                      <p className="text-sm text-slate-400">
                        {searchTerm || statusFilter !== 'All Status'
                          ? 'Try adjusting your search filters.'
                          : 'Start applying for jobs to see them here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1.5 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                          {app.logo ? (
                            <img
                              src={app.logo}
                              alt={app.company}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `<div class="w-6 h-6 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg></div>`;
                              }}
                            />
                          ) : (
                            <Building size={18} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{app.role}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                            <span className="flex items-center gap-1"><Building size={12}/> {app.company}</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {app.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600">{app.date}</td>
                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'applied' && (
                          <button
                            onClick={() => setConfirmWithdraw({ id: app.id, role: app.role })}
                            disabled={withdrawingId === app.id}
                            title="Withdraw Application"
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {withdrawingId === app.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        )}
                        <button
                          onClick={() => toast.success(`Viewing ${app.role} at ${app.company}`)}
                          className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedContent>

      {/* Withdraw Confirmation Modal */}
      <AnimatePresence>
        {confirmWithdraw && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setConfirmWithdraw(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 relative p-6"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 text-center mb-2">Withdraw Application?</h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Are you sure you want to withdraw your application for <strong>"{confirmWithdraw.role}"</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmWithdraw(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleWithdraw(confirmWithdraw.id)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Yes, Withdraw
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </JobseekerDashboardLayout>
  );
}
