import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Target, CheckCircle2, XCircle, Download, Clock, BarChart2 } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";

export default function AdminMCQReportPage() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">MCQ Performance Reports</h1>
            <p className="text-slate-500 text-sm">Analyze aggregate student performance across all quizzes and assessments.</p>
          </div>
          <Button variant="primary" className="shadow-md gap-2"><Download size={16}/> Download Full Data</Button>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3"><Target size={24}/></div>
             <p className="text-3xl font-black text-slate-800 mb-1">72.4%</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Pass Rate</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3"><CheckCircle2 size={24}/></div>
             <p className="text-3xl font-black text-slate-800 mb-1">14.2M</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Correct Answers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3"><XCircle size={24}/></div>
             <p className="text-3xl font-black text-slate-800 mb-1">5.1M</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Incorrect Answers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3"><Clock size={24}/></div>
             <p className="text-3xl font-black text-slate-800 mb-1">12m 30s</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Completion Time</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
             <BarChart2 size={18} className="text-[#1B2A6B]" />
             <h2 className="text-lg font-black text-slate-800">Toughest Questions Overview</h2>
          </div>
          <div className="p-6">
             <table className="w-full text-left">
               <thead className="bg-slate-50 border border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                 <tr>
                   <th className="px-4 py-3 rounded-l-lg">Question</th>
                   <th className="px-4 py-3">Course / Quiz</th>
                   <th className="px-4 py-3">Success Rate</th>
                   <th className="px-4 py-3 rounded-r-lg text-right">Attempts</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                 <tr className="hover:bg-slate-50">
                   <td className="px-4 py-4 max-w-md truncate">"What is the time complexity of Array.prototype.sort() in V8 engine?"</td>
                   <td className="px-4 py-4 text-xs">React Fundamentals</td>
                   <td className="px-4 py-4"><span className="text-rose-600 font-bold">12.5%</span></td>
                   <td className="px-4 py-4 text-right">4,250</td>
                 </tr>
                 <tr className="hover:bg-slate-50">
                   <td className="px-4 py-4 max-w-md truncate">"How do convolutional layers handle padding by default in PyTorch?"</td>
                   <td className="px-4 py-4 text-xs">AI/ML Basic (Python)</td>
                   <td className="px-4 py-4"><span className="text-rose-600 font-bold">18.2%</span></td>
                   <td className="px-4 py-4 text-right">2,100</td>
                 </tr>
                 <tr className="hover:bg-slate-50">
                   <td className="px-4 py-4 max-w-md truncate">"Which auto-layout property dictates flex-wrapping in Figma?"</td>
                   <td className="px-4 py-4 text-xs">Advanced Figma Pro</td>
                   <td className="px-4 py-4"><span className="text-amber-500 font-bold">45.0%</span></td>
                   <td className="px-4 py-4 text-right">8,400</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}
