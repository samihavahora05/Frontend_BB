import { CompaniesDashboardLayout } from "../../../src/layout/CompaniesDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Search, Filter, Download, Mail, MoreVertical, Calendar } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { useState } from "react";
import toast from "react-hot-toast";

const ALL_APPLICANTS = [
  { id: 1, name: "Rahul Singh", role: "Frontend Developer", stage: "New", date: "Oct 27, 2026", college: "IIT Delhi", avatar: "https://i.pravatar.cc/150?u=1", score: 92 },
  { id: 2, name: "Priya Desai", role: "Product Design Intern", stage: "Interviewing", date: "Oct 26, 2026", college: "NID Ahmedabad", avatar: "https://i.pravatar.cc/150?u=2", score: 88 },
  { id: 3, name: "Amit Kumar", role: "Backend Engineer", stage: "Shortlisted", date: "Oct 25, 2026", college: "NIT Surathkal", avatar: "https://i.pravatar.cc/150?u=3", score: 95 },
  { id: 4, name: "Sneha T.", role: "Frontend Developer", stage: "Rejected", date: "Oct 20, 2026", college: "VIT Vellore", avatar: "https://i.pravatar.cc/150?u=4", score: 65 },
  { id: 5, name: "Rohan Gupta", role: "Backend Engineer", stage: "Hired", date: "Oct 15, 2026", college: "BITS Pilani", avatar: "https://i.pravatar.cc/150?u=5", score: 98 },
  { id: 6, name: "Meera Reddy", role: "Frontend Developer", stage: "New", date: "Oct 14, 2026", college: "IIIT Hyderabad", avatar: "https://i.pravatar.cc/150?u=6", score: 85 },
  { id: 7, name: "Vikas Sharma", role: "Product Design Intern", stage: "Rejected", date: "Oct 10, 2026", college: "NID Bangalore", avatar: "https://i.pravatar.cc/150?u=7", score: 45 },
  { id: 8, name: "Anita Das", role: "Backend Engineer", stage: "Interviewing", date: "Oct 05, 2026", college: "DTU", avatar: "https://i.pravatar.cc/150?u=8", score: 89 },
];

export default function CompanyApplicantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(ALL_APPLICANTS.length / itemsPerPage);
  
  const currentApplicants = ALL_APPLICANTS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStageChange = (id: number, newStage: string) => {
    toast.success(`Candidate stage updated to ${newStage}`);
  };

  return (
    <CompaniesDashboardLayout>
      <div className="space-y-6">
        
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Applicant Tracking System</h1>
            <p className="text-slate-500 text-sm">Review applications, download resumes, and manage candidates.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white gap-2 shadow-sm" onClick={() => toast.success("Exporting CSV...")}><Download size={16}/> Export CSV</Button>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2}>
          <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search candidates by name or college..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Jobs</option>
                  <option>Frontend Developer</option>
                  <option>Backend Engineer</option>
                  <option>Product Design Intern</option>
                </select>
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Stages</option>
                  <option>New</option>
                  <option>Shortlisted</option>
                  <option>Interviewing</option>
                  <option>Hired</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Candidate</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Applied Role</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">Match Score</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Stage</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {currentApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={app.avatar} alt={app.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-900 mb-0.5">{app.name}</div>
                            <div className="text-slate-500 text-[11px] font-medium">{app.college}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700 mb-0.5">{app.role}</div>
                        <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1"><Calendar size={10}/> {app.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-[3px] ${
                            app.score >= 90 ? 'border-emerald-500 text-emerald-700 bg-emerald-50' :
                            app.score >= 80 ? 'border-amber-400 text-amber-700 bg-amber-50' :
                            'border-slate-300 text-slate-600 bg-slate-50'
                          }`}>
                            {app.score}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className={`text-xs font-bold rounded-full px-3 py-1 outline-none border cursor-pointer ${
                            app.stage === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            app.stage === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            app.stage === 'Interviewing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            app.stage === 'Hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}
                          defaultValue={app.stage}
                          onChange={(e) => handleStageChange(app.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toast.success(`Viewing profile for ${app.name}`)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 rounded-md transition-colors shadow-sm">
                            View Profile
                          </button>
                          <button onClick={() => toast.success(`Downloading Resume for ${app.name}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Download Resume">
                            <Download size={16} />
                          </button>
                          <button onClick={() => toast.success(`Sending email to ${app.name}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Send Email">
                            <Mail size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-sm text-slate-500">
              <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, ALL_APPLICANTS.length)} of {ALL_APPLICANTS.length} applicants</span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  className="px-3 py-1 text-xs" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Prev
                </Button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button 
                    key={i}
                    variant={currentPage === i + 1 ? "primary" : "outline"}
                    className={`px-3 py-1 text-xs ${currentPage === i + 1 ? 'shadow-md' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                
                <Button 
                  variant="outline" 
                  className="px-3 py-1 text-xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </AnimatedContent>

      </div>
    </CompaniesDashboardLayout>
  );
}
