import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { MessageSquare, Search, Filter, Clock, ChevronRight } from "lucide-react";
import axios from "../../../src/lib/axios";
import { useRouter } from "next/router";

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: ""
  });

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      
      const res = await axios.get(`/admin/support/tickets?${params.toString()}`);
      setTickets(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Closed': return 'text-slate-600 bg-slate-100 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Support Management</h1>
          <p className="text-slate-500 font-medium text-sm">Manage and resolve company support tickets.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center px-4 border-r border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase">Open</p>
            <p className="text-lg font-black text-amber-600">{tickets.filter(t => t.status === 'Open').length}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs font-bold text-slate-500 uppercase">In Progress</p>
            <p className="text-lg font-black text-blue-600">{tickets.filter(t => t.status === 'In Progress').length}</p>
          </div>
        </div>
      </div>

      <AnimatedContent direction="up" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Ticket ID, Subject or Company..." 
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select 
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select 
              value={filters.priority}
              onChange={e => setFilters({...filters, priority: e.target.value})}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-16 text-center">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Tickets Found</h3>
            <p className="text-sm text-slate-500">There are no support tickets matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket, i) => (
              <div key={i} onClick={() => router.push(`/admin/support/tickets/${ticket.id}`)} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs font-black bg-slate-100 text-[#1B2A6B] px-2 py-1 rounded-md">{ticket.ticket_number}</span>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">{ticket.subject}</h4>
                    {ticket.priority === 'Urgent' && <span className="text-[10px] font-black uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded">Urgent</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(ticket.created_at).toLocaleString()}</span>
                    <span>&bull;</span>
                    <span className="font-bold text-slate-700">{ticket.company?.company_name || (ticket.company?.user ? `${ticket.company.user.first_name} ${ticket.company.user.last_name}` : 'Unknown Company')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
                  <span className={`text-xs font-bold border px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedContent>
    </AdminDashboardLayout>
  );
}
