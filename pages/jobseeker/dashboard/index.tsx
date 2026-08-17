import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { Target, Eye, Calendar, FileText, CheckCircle, ChevronRight, Briefcase, Zap, Upload, X } from "lucide-react";
import Link from "next/link";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function JobseekerDashboard() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  
  const { data, isLoading } = useSWR("/jobseeker/dashboard", fetcher);
  
  const stats = data?.data?.stats || { jobs_applied: 0, saved_jobs: 0, interviews: 0, offers: 0 };
  const recentApps = data?.data?.recent_applications || [];
  const profileCompletion = data?.data?.profile_completion ?? 0;

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("resume", file);
      
      try {
        await api.post("/jobseeker/resume", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success(`Resume "${file.name}" uploaded successfully!`);
        setIsResumeModalOpen(false);
      } catch (error) {
        toast.error("Failed to upload resume.");
      }
    }
  };

  return (
    <JobseekerDashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0d1635] mb-2">Job Seeker Portal</h1>
          <p className="text-slate-500 font-medium text-sm">Discover top opportunities, prepare for interviews, and manage your applications.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsResumeModalOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-[#0d1635] rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Upload size={16} /> Upload Resume
          </button>
          <Link href="/jobs" className="px-5 py-2.5 bg-[#1B2A6B] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#0d1635] transition-all flex items-center gap-2">
            <Briefcase size={16} /> Find Jobs
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Jobs Applied", value: isLoading ? "-" : stats.jobs_applied.toString(), icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Saved Jobs", value: isLoading ? "-" : stats.saved_jobs.toString(), icon: Eye, color: "text-slate-600", bg: "bg-slate-100" },
              { label: "Interviews", value: isLoading ? "-" : stats.interviews.toString(), icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Offers", value: isLoading ? "-" : stats.offers.toString(), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
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

          {/* Recent Activity / Applications */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
                <Briefcase size={18} className="text-[#C9A227]" /> Recent Applications
              </h2>
              <Link href="/jobseeker/applications" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center">
                View All <ChevronRight size={14}/>
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-8 text-center text-slate-400">Loading applications...</div>
              ) : recentApps.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Briefcase size={28} />
                  </div>
                  <p className="text-base font-bold text-slate-700">No job applications yet.</p>
                  <p className="text-sm text-slate-500 mt-1">Start exploring jobs and applying to see your progress here.</p>
                  <Link href="/jobs" className="mt-4 px-6 py-2 bg-[#1B2A6B] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#0d1635] transition-all">
                    Explore Jobs
                  </Link>
                </div>
              ) : (
                recentApps.map((app: any, i: number) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="text-base font-bold text-[#0d1635]">{app.role}</h3>
                      <p className="text-sm font-semibold text-slate-600 mb-2">{app.company}</p>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded-md">{app.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>Applied {app.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${app.status === 'interview' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AnimatedContent>
        </div>

        {/* Right Column: Features Access & Action Center */}
        <div className="space-y-8">
          <AnimatedContent direction="up" delay={0.4} className="bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="p-6 border-b border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
               <h2 className="text-lg font-black flex items-center gap-2 relative z-10">
                 <Zap size={20} className="text-[#C9A227]" /> Job Seeker Privileges
               </h2>
               <p className="text-sm text-white/70 mt-1 font-medium relative z-10">Maximize your hiring potential</p>
            </div>
            <div className="p-6 space-y-4">
               {[
                 { title: "Direct Apply", desc: "Submit resume to premium partners instantly." },
                 { title: "Mock Interviews", desc: "Practice with AI and industry experts." },
                 { title: "AI Resume Builder", desc: "Optimize your CV for ATS systems." },
                 { title: "Skill Assessments", desc: "Prove your skills with certified tests." }
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
               
               <Link href="/jobseeker/resume-builder" className="mt-4 w-full flex items-center justify-center py-3 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] text-sm font-bold rounded-xl transition-colors shadow-[0_4px_14px_rgba(201,162,39,0.4)]">
                 Build AI Resume
               </Link>
            </div>
          </AnimatedContent>
          
          <AnimatedContent direction="up" delay={0.5} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
             <div className="w-12 h-12 bg-[#1B2A6B]/5 text-[#1B2A6B] rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText size={24} />
             </div>
             <h3 className="text-base font-black text-[#0d1635] mb-2">Complete Your Profile</h3>
             <p className="text-sm text-slate-500 font-medium mb-4">Profiles with complete details are 3x more likely to be shortlisted.</p>
             <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                <div className="bg-[#C9A227] h-2 rounded-full transition-all duration-1000" style={{ width: `${profileCompletion}%` }}></div>
             </div>
             <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">{profileCompletion}% Completed</p>
             <Link href="/jobseeker/profile" className="inline-block px-5 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors">
               Update Profile
             </Link>
          </AnimatedContent>
        </div>
      </div>

      {/* Resume Upload Modal */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsResumeModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><Upload size={18} className="text-[#1B2A6B]"/> Upload Resume</h3>
                <button onClick={() => setIsResumeModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="p-6">
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-[#1B2A6B] transition-colors group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700 mb-1">Click to browse or drag file here</p>
                  <p className="text-xs text-slate-500 font-medium">Supports PDF, DOCX (Max 5MB)</p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </JobseekerDashboardLayout>
  );
}
