import Link from "next/link";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { Users, Briefcase, Clock, Activity, ChevronRight, BarChart3, Calendar as CalendarIcon, ChevronLeft, Loader2 } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CompanyDashboardPage() {
  const { data, isLoading } = useSWR("/company/dashboard", fetcher);
  
  const stats = data?.data?.stats || { active_jobs: 0, total_applicants: 0, pending_jobs: 0, hired: 0 };
  const activeJobs = data?.data?.active_jobs_list || [];
  const todayInterviews = data?.data?.today_interviews || [];

  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
      const hasInterview = false; // Would be populated from an API in reality
      days.push(
        <div key={i} className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold cursor-pointer transition-colors ${isToday ? 'bg-[#1B2A6B] text-white shadow-md' : hasInterview ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'text-slate-600 hover:bg-slate-100'}`}>
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <CompanyDashboardLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Company Portal</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your recruitment pipeline and active job postings.</p>
        </div>
        <button onClick={() => toast.success("Generating reports...")} className="hidden md:flex px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 items-center gap-2">
          <BarChart3 size={16} /> View Reports
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Jobs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Jobs", value: stats.active_jobs, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Applicants", value: stats.total_applicants, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Pending", value: stats.pending_jobs, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Hired", value: stats.hired, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" }
            ].map((stat, i) => (
              <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} mb-3`}>
                  <stat.icon size={18} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-1">{stat.value}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </AnimatedContent>
            ))}
          </div>

          {/* Active Job Postings */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Briefcase size={18} className="text-[#1B2A6B]" /> Active Postings
              </h2>
              <Link href="/company/jobs" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center">View All <ChevronRight size={14}/></Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-8 text-center flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
                </div>
              ) : activeJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium text-sm">
                  No active postings yet. <Link href="/company/jobs/new" className="text-[#1B2A6B] font-bold hover:underline">Post your first job</Link>.
                </div>
              ) : (
                activeJobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-bold text-slate-800">{job.title}</h3>
                        <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${job.category === "Internship" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {job.category}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-sm ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                        <span>{job.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{job.applicants} Applicants</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {job.status === "Pending" && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                          Awaiting Approval
                        </span>
                      )}
                      <Link href="/company/applicants" className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-blue-50 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AnimatedContent>
        </div>

        {/* Right Column: Upcoming Interviews */}
        <div className="space-y-8">
          <AnimatedContent direction="up" delay={0.4} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-amber-500" /> Today&apos;s Interviews
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              {isLoading ? (
                <div className="py-4 text-center text-slate-400 text-sm">Loading interviews...</div>
              ) : todayInterviews.length === 0 ? (
                <div className="text-center text-slate-400 text-sm">No interviews scheduled for today.</div>
              ) : (
                todayInterviews.map((interview: any, i: number) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{interview.name}</h4>
                        <p className="text-[10px] font-semibold text-slate-500">{interview.role}</p>
                      </div>
                      <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{interview.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{interview.type}</span>
                      <button onClick={() => toast.success("Joining Interview Call...")} className="text-[10px] font-bold text-white bg-[#0d1635] px-3 py-1.5 rounded hover:bg-[#1B2A6B] transition-colors">
                        Join Call
                      </button>
                    </div>
                  </div>
                ))
              )}
              <Link href="/company/interviews" className="block w-full py-3 border-2 border-dashed border-[#1B2A6B]/20 rounded-xl text-xs font-bold text-[#1B2A6B] text-center hover:bg-blue-50 transition-colors">
                View Full Pipeline
              </Link>
            </div>
          </AnimatedContent>

          {/* Mini Calendar */}
          <AnimatedContent direction="up" delay={0.5} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#1B2A6B]" /> Calendar
              </h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-200 rounded"><ChevronLeft size={14}/></button>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-200 rounded"><ChevronRight size={14}/></button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xs font-black text-center mb-4 text-slate-700">{monthName} {year}</h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2">
                {generateCalendarDays()}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-[10px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Interviews</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1B2A6B]"></div> Today</div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
