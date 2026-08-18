import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Search, Phone, Mail, Calendar, Trash2, RefreshCcw } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import { useState } from "react";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";

export default function AdminConsultationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetcher = (url: string) => api.get(url).then(res => res.data.data || res.data);
  
  // API URL for admin consultations
  const { data: consultations, isLoading, mutate } = useSWR('/consultations', fetcher, { revalidateOnFocus: false });

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this consultation request?")) {
      try {
        await api.delete(`/consultations/${id}`);
        toast.success("Consultation deleted successfully");
        mutate();
      } catch (err) {
        toast.error("Failed to delete consultation");
      }
    }
  };

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    let newStatus = 'contacted';
    if (currentStatus === 'pending') newStatus = 'contacted';
    else if (currentStatus === 'contacted') newStatus = 'resolved';
    else if (currentStatus === 'resolved') newStatus = 'pending';

    try {
      await api.put(`/consultations/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      mutate();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const statuses = ["All", "Pending", "Contacted", "Resolved"];

  const filteredConsultations = Array.isArray(consultations) ? consultations.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }) : [];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1}>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Consultation Bookings</h1>
          <p className="text-slate-500 text-sm">Manage 1:1 free consultation requests from students.</p>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {statuses.map(s => (
               <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  statusFilter === s ? "bg-[#1B2A6B] text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
            />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">Student Details</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Preferred Date</th>
                  <th className="p-4">Query</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-medium">Loading consultations...</td></tr>
                ) : filteredConsultations.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-medium">No consultations found.</td></tr>
                ) : (
                  filteredConsultations.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Submitted on {new Date(c.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
                           <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-[#1B2A6B]"><Mail size={14}/> {c.email}</a>
                           <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 hover:text-[#1B2A6B]"><Phone size={14}/> {c.phone}</a>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                          <Calendar size={14} className="text-[#C9A227]"/> 
                          {c.preferred_date ? new Date(c.preferred_date).toLocaleDateString() : 'Flexible'}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 max-w-xs truncate" title={c.query}>{c.query || 'No query provided'}</p>
                      </td>
                      <td className="p-4">
                         <Badge variant={c.status === 'resolved' ? 'emerald' : c.status === 'contacted' ? 'blue' : 'gold'}>
                           {c.status || 'pending'}
                         </Badge>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => handleUpdateStatus(c.id, c.status || 'pending')} title="Update Status" className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:text-[#1B2A6B] hover:border-[#1B2A6B]/30 hover:bg-blue-50 transition-all">
                              <RefreshCcw size={14} />
                           </button>
                           <button onClick={() => handleDelete(c.id)} title="Delete" className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all">
                              <Trash2 size={14} />
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
      </div>
    </AdminDashboardLayout>
  );
}
