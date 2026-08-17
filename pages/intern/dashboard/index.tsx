import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { Briefcase, BookOpen, UserCheck, CheckCircle, ChevronRight, Activity, X, Calendar, Clock, Inbox } from "lucide-react";
import Link from "next/link";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { EmptyState } from "../../../src/components/common/EmptyState";
import { DashboardService } from "../../../src/lib/api/intern/DashboardService";

export default function InternDashboard() {
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  
  const { data: dashboardRes, isLoading } = DashboardService.useDashboard();
  const data = dashboardRes?.data || { stats: { applications: 0, tasks_completed: 0, hours_logged: 0 }, recent_applications: [] };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Journal Entry Submitted Successfully!");
    setIsJournalModalOpen(false);
  };

  const activeProjects: any[] = []; // Replaced by real data later, keeping empty for "No Live Projects" state.

  return (
    <InternDashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0d1635] mb-2">Intern Portal</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your internships, track hours, and submit your weekly tasks.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/internships" className="px-5 py-2.5 bg-[#1B2A6B] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#0d1635] transition-all flex items-center gap-2">
            <Briefcase size={16} /> Find Internships
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Applications", value: isLoading ? "-" : (data?.stats?.applications || 0).toString(), icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Tasks Completed", value: isLoading ? "-" : (data?.stats?.tasks_completed || 0).toString(), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Hours Logged", value: isLoading ? "-" : (data?.stats?.hours_logged || 0).toString(), icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
            ].map((stat, i) => (
              <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} mb-3`}>
                  <stat.icon size={18} />
                </div>
                <h3 className="text-2xl font-black text-[#0d1635] mb-1">{stat.value}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </AnimatedContent>
            ))}
          </div>

          {/* Current Projects & Assignments */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
                <Activity size={18} className="text-[#1B2A6B]" /> Live Projects Tracker
              </h2>
              {activeProjects.length > 0 && (
                <button onClick={() => setIsTimelineModalOpen(true)} className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center">
                  View Timeline <ChevronRight size={14}/>
                </button>
              )}
            </div>
            
            <div className="p-6">
              {activeProjects.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {activeProjects.map((proj: any, i: number) => (
                    <div key={i} className="py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-base font-bold text-[#0d1635]">{proj.name}</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1">{proj.company} &bull; Due {proj.due}</p>
                        </div>
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-md ${proj.status === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {proj.status}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                        <div className={`h-1.5 rounded-full ${proj.status === 'Review' ? 'bg-amber-500' : 'bg-[#1B2A6B]'}`} style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <p className="text-right text-[10px] font-bold text-slate-400">{proj.progress}% Completed</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={Inbox}
                  title="No Live Projects"
                  description="You are not currently assigned to any active internship projects. Once you are hired, your projects will appear here."
                  actionText="Find Internships"
                  onAction={() => window.location.href = '/internships'}
                />
              )}
            </div>
          </AnimatedContent>
        </div>

        {/* Right Column: Features Access & Actions */}
        <div className="space-y-8">
          <AnimatedContent direction="up" delay={0.4} className="bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="p-6 border-b border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
               <h2 className="text-lg font-black flex items-center gap-2 relative z-10">
                 <Briefcase size={20} className="text-[#C9A227]" /> Intern Privileges
               </h2>
               <p className="text-sm text-white/70 mt-1 font-medium relative z-10">Exclusive tools for your journey</p>
            </div>
            <div className="p-6 space-y-4">
               {[
                 { title: "Live Projects", desc: "Gain experience with real industry problems." },
                 { title: "1-on-1 Mentorship", desc: "Weekly syncs with senior professionals." },
                 { title: "Skill Matrix", desc: "Track competencies verified by mentors." },
                 { title: "PPO Fast-Track", desc: "Direct route to pre-placement offers." }
               ].map((feature, i) => (
                 <div key={i} className="flex gap-3 items-start group">
                   <div className="mt-1 flex-shrink-0 text-[#C9A227] group-hover:scale-110 transition-transform">
                     <CheckCircle size={18} />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-white mb-0.5">{feature.title}</h4>
                     <p className="text-xs text-white/60 font-medium">{feature.desc}</p>
                   </div>
                 </div>
               ))}
               
               <button onClick={() => setIsMentorModalOpen(true)} className="mt-4 w-full py-3 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] text-sm font-bold rounded-xl transition-colors shadow-[0_4px_14px_rgba(201,162,39,0.4)]">
                 Book Mentor Session
               </button>
            </div>
          </AnimatedContent>
          
          <AnimatedContent direction="up" delay={0.5} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <BookOpen size={24} />
             </div>
             <h3 className="text-base font-black text-[#0d1635] mb-2">Weekly Journal</h3>
             <p className="text-sm text-slate-500 font-medium mb-4">Log your weekly learnings and tasks for mentor review and grading.</p>
             <button onClick={() => setIsJournalModalOpen(true)} className="inline-block px-5 py-2.5 bg-[#0d1635] text-white font-bold rounded-xl text-sm hover:bg-[#1B2A6B] transition-colors w-full">
               Write Journal Entry
             </button>
          </AnimatedContent>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isJournalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsJournalModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><BookOpen size={18} className="text-[#1B2A6B]"/> Write Journal Entry</h3>
                <button onClick={() => setIsJournalModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <form onSubmit={handleJournalSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Select Week</label>
                    <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2A6B]">
                      <option>Week 1: Foundations</option>
                      <option>Week 2: Component Architecture</option>
                      <option>Week 3: State Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">What did you learn this week?</label>
                    <textarea rows={4} required placeholder="Summarize your key learnings..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2A6B] resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Blockers / Challenges</label>
                    <textarea rows={2} placeholder="Any challenges faced?" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2A6B] resize-none"></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsJournalModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-lg transition-colors">Submit Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isTimelineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsTimelineModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><Activity size={18} className="text-[#1B2A6B]"/> Project Timeline</h3>
                <button onClick={() => setIsTimelineModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="relative border-l-2 border-[#1B2A6B] ml-3 space-y-6">
                  {/* Empty state for timeline too since we removed mock data */}
                  <p className="text-sm text-slate-500">No active timelines.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isMentorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMentorModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><UserCheck size={18} className="text-[#1B2A6B]"/> Book Mentor Session</h3>
                <button onClick={() => setIsMentorModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('Session booked!'); setIsMentorModalOpen(false); }} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" required className="pl-9 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Time</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select required className="pl-9 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]">
                      <option value="">Select a time slot...</option>
                      <option>10:00 AM</option>
                      <option>02:00 PM</option>
                      <option>04:30 PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Topic</label>
                  <input type="text" required placeholder="e.g. Code Review for E-Commerce" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                </div>
                <button type="submit" className="w-full py-3 mt-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl transition-colors">
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </InternDashboardLayout>
  );
}
