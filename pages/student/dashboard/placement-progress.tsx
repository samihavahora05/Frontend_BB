import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Briefcase, TrendingUp, FileText, CheckCircle2, Clock, AlertCircle, Building2, Calendar, PlayCircle, Award } from "lucide-react";
import useSWR from "swr";
import api from "@/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function PlacementProgressPage() {
  const { data, isLoading } = useSWR("/dashboard/student/placement-progress", fetcher, {
    revalidateOnFocus: false
  });

  const dashboardData = data || {
    stats: { score: 0, total_applications: 0, interviews: 0, offers: 0 },
    pipeline: { applied: 0, shortlisted: 0, interview: 0, offered: 0 },
    applications: []
  };

  const stats = [
    { label: "Placement Score", value: dashboardData.stats.score.toString(), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Total Applications", value: dashboardData.stats.total_applications.toString(), icon: Briefcase, color: "text-[#1B2A6B]", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Interviews Scheduled", value: dashboardData.stats.interviews.toString(), icon: Calendar, color: "text-[#C9A227]", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Offers Received", value: dashboardData.stats.offers.toString(), icon: Award, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  ];

  const applications = dashboardData.applications;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'interview': return { label: 'Interview Scheduled', color: 'bg-emerald-100 text-emerald-700', icon: Calendar };
      case 'shortlisted': return { label: 'Shortlisted', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 };
      case 'applied': return { label: 'Applied', color: 'bg-slate-100 text-slate-700', icon: Clock };
      case 'rejected': return { label: 'Not Selected', color: 'bg-red-100 text-red-700', icon: AlertCircle };
      case 'hired': return { label: 'Hired', color: 'bg-emerald-100 text-emerald-700', icon: Award };
      default: return { label: status, color: 'bg-slate-100 text-slate-700', icon: Clock };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Placement Progress</h1>
            <p className="text-sm font-semibold text-slate-500">Track your job applications and interview status.</p>
          </div>
          <Button className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl px-6 h-11">
            Browse New Jobs
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-white border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.08)] hover:-translate-y-1 transition-all duration-300 rounded-2xl group overflow-hidden relative">
              <CardContent className="p-5 flex flex-col items-center text-center gap-3 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.border} border ${stat.color} shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800 leading-none mb-1 group-hover:text-[#1B2A6B] transition-colors">{stat.value}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Application Pipeline */}
            <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] transition-all">
              <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-base font-extrabold text-slate-800">Application Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                  {/* Connecting Line */}
                  <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-100 -translate-y-1/2 z-0">
                    <div className="h-full bg-[#1B2A6B] w-[60%]"></div>
                  </div>
                  
                  {[
                    { step: "Applied", count: dashboardData.pipeline.applied, active: true, done: true },
                    { step: "Shortlisted", count: dashboardData.pipeline.shortlisted, active: dashboardData.pipeline.shortlisted > 0, done: dashboardData.pipeline.shortlisted > 0 },
                    { step: "Interview", count: dashboardData.pipeline.interview, active: dashboardData.pipeline.interview > 0, done: false },
                    { step: "Offered", count: dashboardData.pipeline.offered, active: dashboardData.pipeline.offered > 0, done: false },
                  ].map((stage, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 relative z-10 bg-white px-2">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-sm transition-all duration-300 shadow-sm ${
                        stage.done 
                          ? "bg-[#1B2A6B] border-[#1B2A6B] text-white" 
                          : stage.active 
                            ? "bg-white border-[#1B2A6B] text-[#1B2A6B]" 
                            : "bg-white border-slate-200 text-slate-300"
                      }`}>
                        {stage.done ? <CheckCircle2 size={18} /> : stage.count}
                      </div>
                      <span className={`text-[11px] font-extrabold uppercase tracking-widest ${stage.active ? "text-slate-800" : "text-slate-400"}`}>{stage.step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications List */}
            <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-base font-extrabold text-slate-800">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {isLoading ? (
                    <div className="p-8 text-center text-slate-400">Loading applications...</div>
                  ) : applications.length > 0 ? applications.map((app: any) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div key={app.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors group cursor-pointer relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#1B2A6B] transition-colors"></div>
                        <img src={app.logo} alt={app.company} className="w-12 h-12 rounded-xl shadow-sm group-hover:scale-105 transition-transform object-cover" />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-[15px] text-slate-800 mb-1 group-hover:text-[#1B2A6B] transition-colors truncate">{app.role}</h4>
                          <div className="flex items-center gap-3 text-[12px] font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><Building2 size={14} className="text-slate-400"/> {app.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400"/> Applied {app.appliedDate}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                          <Badge className={`${statusConfig.color} border-none shadow-sm py-1 px-3 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5`}>
                            <StatusIcon size={12} /> {statusConfig.label}
                          </Badge>
                          <span className="text-[11px] font-bold text-slate-400">{app.nextAction}</span>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="p-8 text-center text-slate-400 font-medium">You have no applications yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Resume Score */}
            <Card className="bg-[#0d1635] border-none shadow-[0_8px_30px_rgba(13,22,53,0.3)] rounded-3xl overflow-hidden text-white relative group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C9A227]/40 transition-colors" />
              <CardContent className="p-6 relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#C9A227" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 85) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white leading-none">{dashboardData.stats.score}</span>
                    <span className="text-[9px] font-bold text-[#C9A227] uppercase tracking-widest mt-1">Score</span>
                  </div>
                </div>
                <h3 className="font-extrabold text-lg mb-1">Resume Readiness</h3>
                <p className="text-[12px] text-slate-300 font-medium mb-5">Your resume is looking great, but could use a bit more detail in the skills section.</p>
                <Button className="w-full h-10 text-[11px] font-extrabold bg-[#C9A227] hover:bg-amber-400 text-[#0d1635] hover:scale-[1.02] transition-all rounded-xl shadow-lg uppercase tracking-wider border-none">
                  Update Resume <FileText size={14} className="ml-1.5" />
                </Button>
              </CardContent>
            </Card>

            {/* Tips & Guidance */}
            <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] transition-all rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-base font-extrabold text-slate-800">Interview Tips</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex gap-3 items-start group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1B2A6B] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <PlayCircle size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[13px] text-slate-800 group-hover:text-[#1B2A6B] transition-colors">How to ace the technical round</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">5 min video guide</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C9A227] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[13px] text-slate-800 group-hover:text-[#1B2A6B] transition-colors">Top 50 React Interview Questions</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">PDF Download</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

