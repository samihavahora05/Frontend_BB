import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Users, TrendingUp, Download, Calendar, Filter, ArrowUpRight } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";

export default function AdminEnrollmentReportPage() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Enrollment Analytics</h1>
            <p className="text-slate-500 text-sm">Track student acquisition and course enrollment trends over time.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2 bg-white"><Filter size={16}/> Filter Range</Button>
             <Button variant="primary" className="shadow-md gap-2"><Download size={16}/> Export Report</Button>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-6 right-6 text-emerald-500 bg-emerald-50 p-2 rounded-xl flex items-center gap-1 text-xs font-bold">
               <ArrowUpRight size={14}/> +12.5%
             </div>
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Users size={24}/></div>
             <p className="text-4xl font-black text-slate-800 mb-1">84.2K</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Students Enrolled</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-6 right-6 text-emerald-500 bg-emerald-50 p-2 rounded-xl flex items-center gap-1 text-xs font-bold">
               <ArrowUpRight size={14}/> +8.2%
             </div>
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={24}/></div>
             <p className="text-4xl font-black text-slate-800 mb-1">12.5K</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Enrollments (30d)</p>
          </div>
          <div className="bg-[#1B2A6B] rounded-3xl p-6 shadow-md relative overflow-hidden text-white">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6"><Calendar size={24}/></div>
             <p className="text-4xl font-black mb-1">68%</p>
             <p className="text-xs font-medium text-blue-200 uppercase tracking-widest">Course Completion Rate</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-black text-slate-800 mb-6">Top Performing Courses</h2>
              <div className="space-y-4">
                 {[
                   { course: "Frontend Web Development", students: "12,450", growth: "+15%" },
                   { course: "AI/ML Basic (Python)", students: "8,500", growth: "+22%" },
                   { course: "Advanced Figma Pro", students: "6,200", growth: "+5%" },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">{i+1}</div>
                         <h4 className="font-bold text-sm text-slate-900">{item.course}</h4>
                      </div>
                      <div className="text-right">
                         <p className="font-black text-slate-800">{item.students}</p>
                         <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{item.growth} This Month</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center text-center">
              {/* Placeholder for an actual chart library like Recharts/Chart.js */}
              <div className="w-full flex-1 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                 <TrendingUp size={48} className="text-slate-300 mb-4" />
                 <h3 className="font-bold text-slate-700">Enrollment Growth Chart</h3>
                 <p className="text-sm text-slate-400 max-w-[200px] mt-2">Interactive D3/Recharts component will render here.</p>
              </div>
           </div>
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}
