import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { Search, Filter, Briefcase, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import toast from "react-hot-toast";

import useSWR from "swr";
import api from "../../../src/lib/axios";
import { EmptyState } from "../../../src/components/common/EmptyState";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function InternApplicationsPage() {
  const { data, isLoading } = useSWR("/intern/applications", fetcher);
  const applications = data?.data || [];

  return (
    <InternDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">My Applications</h1>
          <p className="text-slate-500 font-medium text-sm">Track your internship applications and upcoming assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] w-64 shadow-sm"
            />
          </div>
          <button onClick={() => toast.success('Filter options opened')} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              message="You haven't applied to any internships yet. Start applying to opportunities!"
              actionLabel="Find Internships"
              onAction={() => window.location.href = "/internships"}
            />
          </div>
        ) : (
        applications.map((app: any) => (
          <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-[#1B2A6B]/30 hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center">
                  <img src={app.logo} alt={app.company} className="w-full h-full object-contain" />
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-none font-bold gap-1"><Clock size={12}/> {app.status}</Badge>
              </div>
              <h3 className="font-black text-lg text-slate-800 mb-1 group-hover:text-[#1B2A6B] transition-colors">{app.role}</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mb-6">
                <span className="flex items-center gap-1"><Briefcase size={14}/> {app.company}</span>
                <span className="flex items-center gap-1"><MapPin size={14}/> {app.location}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {app.type}</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Next Step</p>
                  <p className="text-sm font-bold text-slate-700">Online Assessment</p>
                </div>
                <button onClick={() => toast.success('Viewing Details for ' + app.company)} className="flex items-center gap-1 text-[#1B2A6B] text-sm font-bold hover:gap-2 transition-all">
                  View Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )))}
      </div>
    </InternDashboardLayout>
  );
}
