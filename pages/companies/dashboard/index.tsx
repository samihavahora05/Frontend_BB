import { useEffect } from "react";
import { CompaniesDashboardLayout } from "../../../src/layout/CompaniesDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Briefcase, Users, Eye, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../src/components/ui/Button";
import { motion } from "framer-motion";
import { useTour } from "../../../src/context/TourContext";

import toast from "react-hot-toast";

export default function CompanyDashboardPage() {
  const { startTour } = useTour();

  const stats = [
    { label: "Active Jobs", value: "3", change: "2 new this week", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Applications", value: "142", change: "+24 today", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Profile Views", value: "1,204", change: "+12% vs last week", icon: Eye, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Hired Candidates", value: "12", change: "This year", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  const recentApplicants = [
    { id: 1, name: "Rahul Singh", role: "Frontend Developer", date: "2 hours ago", status: "New", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Priya Desai", role: "Product Design Intern", date: "5 hours ago", status: "In Review", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Amit Kumar", role: "Backend Engineer", date: "1 day ago", status: "Shortlisted", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Sneha T.", role: "Frontend Developer", date: "1 day ago", status: "New", avatar: "https://i.pravatar.cc/150?u=4" },
  ];

  useEffect(() => {
    // Small timeout to let elements render before measuring
    const timer = setTimeout(() => {
      startTour('company_dashboard_intro', [
        {
          targetId: 'tour-stats',
          title: 'Quick Insights',
          description: 'Get a bird\'s-eye view of your hiring metrics, profile views, and active job counts in real time.',
          placement: 'bottom'
        },
        {
          targetId: 'tour-pipeline',
          title: 'Hiring Pipeline',
          description: 'Track the health of your recruitment process from total applications all the way to final offers.',
          placement: 'top'
        },
        {
          targetId: 'tour-active-jobs',
          title: 'Manage Postings',
          description: 'Keep track of your active job listings and post new openings with a single click.',
          placement: 'left'
        }
      ]);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CompaniesDashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <AnimatedContent direction="up" delay={0.1}>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, Google Talent Team!</h1>
            <p className="text-slate-500 text-sm">Here is what is happening with your job postings today.</p>
          </div>
        </AnimatedContent>

        <div id="tour-stats">
          <AnimatedContent direction="up" delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><TrendingUp size={12} className={stat.color} /> {stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </AnimatedContent>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div id="tour-pipeline" className="lg:col-span-2">
            <AnimatedContent direction="up" delay={0.3} className="h-full">
              <Card className="border border-slate-200 shadow-sm h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-base font-bold text-slate-800">Hiring Pipeline Funnel</h2>
                </div>
                <CardContent className="p-6 border-b border-slate-100">
                  <div className="flex flex-col gap-4">
                    {[
                      { stage: 'Total Applications', count: 142, color: 'bg-slate-200', text: 'text-slate-700' },
                      { stage: 'Screened', count: 85, color: 'bg-blue-200', text: 'text-blue-800' },
                      { stage: 'Interviewing', count: 32, color: 'bg-indigo-200', text: 'text-indigo-800' },
                      { stage: 'Offers Extended', count: 8, color: 'bg-emerald-200', text: 'text-emerald-800' },
                      { stage: 'Hired', count: 5, color: 'bg-emerald-500', text: 'text-white' }
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-32 text-xs font-bold text-slate-600 text-right shrink-0">{s.stage}</div>
                        <div className="flex-1 h-8 bg-slate-100 rounded-r-lg overflow-hidden flex items-center">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.count / 142) * 100}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${s.color} flex items-center px-3 font-bold text-xs ${s.text} rounded-r-lg shadow-inner min-w-[2rem]`}
                          >
                            {s.count}
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-base font-bold text-slate-800">Recent Applications</h2>
                  <Link href="/companies/applicants" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {recentApplicants.map((app) => (
                      <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={app.avatar} alt={app.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                          <div>
                            <h3 className="font-bold text-sm text-slate-900">{app.name}</h3>
                            <p className="text-xs font-medium text-slate-500">Applied for <span className="text-slate-700">{app.role}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            app.status === 'In Review' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {app.status}
                          </span>
                          <div className="text-xs text-slate-400 font-medium hidden sm:block w-20 text-right">{app.date}</div>
                          <Button onClick={() => toast.success(`Opening application review for ${app.name}`)} variant="outline" className="px-3 py-1.5 text-xs bg-white">Review</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>
          </div>

          <div id="tour-active-jobs" className="lg:col-span-1">
            <AnimatedContent direction="up" delay={0.4} className="h-full">
              <Card className="border border-slate-200 shadow-sm h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                  <h2 className="text-base font-bold text-slate-800">Active Jobs</h2>
                  <Link href="/companies/jobs" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
                </div>
                <CardContent className="p-6 space-y-4">
                  {[
                    { title: "Frontend Developer", apps: 84, views: 520 },
                    { title: "Product Design Intern", apps: 42, views: 315 },
                    { title: "Backend Engineer", apps: 16, views: 180 }
                  ].map((job, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
                      <h3 className="font-bold text-sm text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5"><Users size={14} className="text-slate-400"/> {job.apps} Apps</div>
                        <div className="flex items-center gap-1.5"><Eye size={14} className="text-slate-400"/> {job.views} Views</div>
                      </div>
                    </div>
                  ))}
                  
                  <Link href="/companies/jobs/create" className="block mt-4">
                    <Button variant="outline" className="w-full border-dashed border-2 border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 bg-transparent hover:bg-blue-50">+ Post New Job</Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedContent>
          </div>

        </div>
      </div>
    </CompaniesDashboardLayout>
  );
}
