import { CollegesDashboardLayout } from "../../../src/layout/CollegesDashboardLayout";
import { Users, BookOpen, GraduationCap, Building2, TrendingUp, ChevronRight } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { BarChart } from "../../../src/components/ui/BarChart";
import Link from "next/link";

export default function CollegesDashboard() {
  const placementTrends = [
    { label: "Jan", value: 12 },
    { label: "Feb", value: 18 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 80 },
    { label: "May", value: 125 },
    { label: "Jun", value: 190 },
  ];

  return (
    <CollegesDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0d1635] mb-2">College Portal</h1>
        <p className="text-slate-500 font-medium text-sm">Monitor student progress, track placements, and manage your institution's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Enrolled", value: "1,240", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Internships", value: "385", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Placed Students", value: "412", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Partner Companies", value: "48", icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-[#0d1635] leading-none">{stat.value}</h3>
            </div>
          </AnimatedContent>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
                <TrendingUp size={18} className="text-[#1B2A6B]" /> Recent Placement Activity
              </h2>
              <Link href="/colleges/placements" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center">
                View All <ChevronRight size={14}/>
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { student: "Rahul Sharma", company: "Tech Mahindra", role: "Frontend Developer", date: "Today" },
                { student: "Priya Patel", company: "Infosys", role: "Data Analyst", date: "Yesterday" },
                { student: "Amit Kumar", company: "TCS", role: "Software Engineer", date: "2 days ago" },
              ].map((activity, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs">
                      {activity.student.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0d1635]">{activity.student} <span className="font-medium text-slate-500 text-xs ml-1">got placed</span></h3>
                      <p className="text-xs text-[#1B2A6B] font-semibold">{activity.role} at {activity.company}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{activity.date}</span>
                </div>
              ))}
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.35} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-[#1B2A6B]" /> Placement Trends (6 Months)
            </h2>
            <BarChart 
              data={placementTrends} 
              color="#1B2A6B" 
              suffix=" students"
            />
          </AnimatedContent>
        </div>

        <AnimatedContent direction="up" delay={0.4} className="bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] rounded-2xl shadow-xl overflow-hidden text-white flex flex-col justify-between">
          <div className="p-8 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Building2 size={24} className="text-[#C9A227]" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-white">Drive Campus Placements with BlueBoxx</h2>
            <p className="text-white/70 font-medium text-sm leading-relaxed max-w-sm mb-8">
              Track student performance in real-time, get actionable insights, and ensure maximum placement success for your college batch.
            </p>
            <div className="flex gap-4">
              <Link href="/colleges/students" className="px-6 py-3 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] font-bold rounded-xl text-sm transition-colors shadow-[0_4px_14px_rgba(201,162,39,0.4)]">
                Manage Students
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <Building2 size={250} />
          </div>
        </AnimatedContent>
      </div>
    </CollegesDashboardLayout>
  );
}
