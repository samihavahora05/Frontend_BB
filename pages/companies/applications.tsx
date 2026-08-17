import { useState } from "react";
import { CompaniesLayout } from "../../src/layout/CompaniesLayout";
import { Card, CardContent } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { Badge } from "../../src/components/ui/Badge";
import { Search, Filter, Download, MoreVertical, CheckCircle2, Calendar, Star, FileText } from "lucide-react";

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "interview">("all");

  const applications = [
    {
      id: 1,
      name: "Sneha Reddy",
      role: "Frontend Developer Intern",
      score: 92,
      appliedOn: "Oct 20, 2026",
      status: "shortlisted",
      image: "https://ui-avatars.com/api/?name=Sneha+Reddy&background=random",
      college: "VIT University"
    },
    {
      id: 2,
      name: "Aman Gupta",
      role: "React Native Engineer",
      score: 88,
      appliedOn: "Oct 19, 2026",
      status: "interview",
      image: "https://ui-avatars.com/api/?name=Aman+Gupta&background=random",
      college: "IIT Bombay"
    },
    {
      id: 3,
      name: "Vikram Singh",
      role: "Frontend Developer Intern",
      score: 65,
      appliedOn: "Oct 18, 2026",
      status: "pending",
      image: "https://ui-avatars.com/api/?name=Vikram+Singh&background=random",
      college: "NIT Trichy"
    }
  ];

  const filteredApps = activeTab === "all" ? applications : applications.filter(a => a.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'shortlisted': return <Badge className="bg-blue-100 text-blue-700 border-none">Shortlisted</Badge>;
      case 'interview': return <Badge className="bg-emerald-100 text-emerald-700 border-none">Interviewing</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-none">Rejected</Badge>;
      default: return <Badge className="bg-slate-100 text-slate-700 border-none">Pending Review</Badge>;
    }
  };

  return (
    <CompaniesLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Applications</h1>
            <p className="text-sm font-semibold text-slate-500">Review and manage candidates across all your job postings.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 text-slate-600 font-extrabold rounded-xl h-11 px-4 gap-2 hidden md:flex">
              <Download size={16} /> Export CSV
            </Button>
          </div>
        </div>

        {/* Filters and Tabs */}
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
              {["all", "shortlisted", "interview"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
                    activeTab === tab 
                      ? "bg-[#1B2A6B] text-white shadow-md" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search by name or role..." className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none" />
              </div>
              <Button variant="outline" className="border-slate-200 h-10 px-3 rounded-xl">
                <Filter size={16} className="text-slate-500" />
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <Card key={app.id} className="bg-white border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  
                  {/* Candidate Info */}
                  <div className="p-5 flex items-center gap-4 flex-1 w-full relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#C9A227] transition-colors"></div>
                    <div className="relative">
                      <img src={app.image} alt={app.name} className="w-14 h-14 rounded-xl shadow-sm object-cover" />
                      <div className={`absolute -bottom-2 -right-2 text-white text-[10px] font-black px-1.5 py-0.5 rounded border-2 border-white shadow-sm ${app.score >= 90 ? 'bg-emerald-500' : app.score >= 75 ? 'bg-blue-500' : 'bg-amber-500'}`}>
                        {app.score}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-black text-slate-800 truncate">{app.name}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-[13px] font-semibold text-slate-500 truncate mb-1">{app.role}</p>
                      <p className="text-[11px] font-bold text-slate-400">{app.college} • Applied {app.appliedOn}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 border-t md:border-t-0 md:border-l border-slate-100 flex items-center gap-2 w-full md:w-auto bg-slate-50/50">
                    <Button variant="outline" className="flex-1 md:flex-none border-slate-200 text-slate-600 hover:text-[#1B2A6B] hover:border-[#1B2A6B]/30 hover:bg-blue-50 h-9 rounded-lg shadow-sm px-3 gap-1.5 text-[11px] font-extrabold transition-all">
                      <FileText size={14} /> Resume
                    </Button>
                    
                    {app.status === 'pending' && (
                      <Button className="flex-1 md:flex-none bg-[#1B2A6B] hover:bg-[#0d1635] text-white h-9 rounded-lg shadow-sm px-4 gap-1.5 text-[11px] font-extrabold transition-all">
                        <CheckCircle2 size={14} /> Shortlist
                      </Button>
                    )}
                    {app.status === 'shortlisted' && (
                      <Button className="flex-1 md:flex-none bg-[#C9A227] hover:bg-amber-400 text-[#0d1635] h-9 rounded-lg shadow-sm px-4 gap-1.5 text-[11px] font-extrabold transition-all border-none">
                        <Calendar size={14} /> Interview
                      </Button>
                    )}
                    {app.status === 'interview' && (
                      <Button className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white h-9 rounded-lg shadow-sm px-4 gap-1.5 text-[11px] font-extrabold transition-all border-none">
                        <Star size={14} /> Hire
                      </Button>
                    )}

                    <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </CompaniesLayout>
  );
}
