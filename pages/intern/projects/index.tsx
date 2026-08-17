import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { CodeSquare, Search, Filter, FolderKanban, ChevronRight, Play, X, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import Link from "next/link";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const mockProjects = [
  { id: 1, title: "E-Commerce Rebrand", company: "RetailCo", category: "Frontend UI", difficulty: "Medium", duration: "2 weeks", participants: 12 },
  { id: 2, title: "React Dashboard Architecture", company: "FinTech App", category: "React & State", difficulty: "Hard", duration: "4 weeks", participants: 5 },
  { id: 3, title: "Landing Page Optimization", company: "MarketingPro", category: "Web Design", difficulty: "Easy", duration: "1 week", participants: 28 },
];

export default function InternProjectsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);

  const handleStartProject = (proj: any) => {
    setSelectedProject(proj);
    setIsStarted(false);
    setActiveModal('start-project');
  };

  const confirmStartProject = () => {
    setIsStarted(true);
    setTimeout(() => {
      setActiveModal(null);
      setSelectedProject(null);
    }, 2000);
  };

  return (
    <InternDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Browse Projects</h1>
          <p className="text-slate-500 font-medium text-sm">Find and work on real-world projects to build your portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] w-64 shadow-sm"
            />
          </div>
          <button onClick={() => setActiveModal('filter')} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockProjects.map((project, i) => (
          <AnimatedContent key={project.id} direction="up" delay={i * 0.1}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-[#1B2A6B]/30 transition-all flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderKanban size={20} />
                </div>
                <Badge className={`border-none font-bold ${
                  project.difficulty === 'Hard' ? 'bg-red-50 text-red-600' :
                  project.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {project.difficulty}
                </Badge>
              </div>
              
              <h3 className="font-black text-lg text-slate-800 mb-1 group-hover:text-[#1B2A6B] transition-colors line-clamp-2">{project.title}</h3>
              <p className="text-sm font-semibold text-slate-500 mb-4">{project.company}</p>
              
              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{project.category}</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{project.duration}</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{project.participants} Enrolled</span>
              </div>
              
              <button onClick={() => handleStartProject(project)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-[#1B2A6B] hover:text-white hover:border-[#1B2A6B] transition-colors">
                <Play size={16} /> Start Project
              </button>
            </div>
          </AnimatedContent>
        ))}
      </div>

      <AnimatePresence>
        {activeModal === 'filter' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 relative overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><Filter size={18}/> Filters</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Difficulty</h4>
                  <div className="flex gap-2">
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <button key={d} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors">{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Duration</h4>
                  <div className="flex gap-2 flex-wrap">
                    {['< 1 Week', '1-2 Weeks', '1 Month+'].map(d => (
                      <button key={d} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors">{d}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl transition-colors">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activeModal === 'start-project' && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 relative overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><FolderKanban size={18}/> Project Setup</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="p-8 text-center">
                {isStarted ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800">Project Started!</h4>
                      <p className="text-sm font-medium text-slate-500 mt-2">Setting up your workspace for {selectedProject.title}...</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                      <Play size={28} className="ml-1" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 mb-2">Ready to begin?</h4>
                      <p className="text-sm font-medium text-slate-500">You are about to start working on <strong>{selectedProject.title}</strong> by {selectedProject.company}.</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 text-sm font-bold rounded-xl transition-colors">
                        Cancel
                      </button>
                      <button onClick={confirmStartProject} className="flex-1 py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl transition-colors shadow-md">
                        Start Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </InternDashboardLayout>
  );
}
