import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Trophy, Plus, Users, Calendar, Clock, Edit3, Trash2 } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { useState } from "react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";

const INITIAL_CONTESTS = [
  { id: 1, title: "Global CodeFest 2026", type: "Hackathon", company: "Google", participants: 1250, date: "Nov 15, 2026", duration: "48 Hours", status: "Upcoming", prize: "₹5,00,000" },
  { id: 2, title: "Frontend Challenge", type: "UI/UX Contest", company: "BlueBoxx", participants: 450, date: "Oct 28, 2026", duration: "1 Week", status: "Active", prize: "₹50,000" },
  { id: 3, title: "AI/ML Datathon", type: "Data Science", company: "Microsoft", participants: 800, date: "Sep 10, 2026", duration: "72 Hours", status: "Completed", prize: "₹2,00,000" },
];

export default function AdminContestPage() {
  const [contests, setContests] = useState(INITIAL_CONTESTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const confirmAction = useConfirm();

  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete Contest", description: "Delete this contest?", isDestructive: true })) {
      setContests(prev => prev.filter(c => c.id !== id));
      toast.success("Contest deleted");
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Contests & Hackathons</h1>
            <p className="text-slate-500 text-sm">Organize and manage hiring challenges and coding competitions.</p>
          </div>
          <Button variant="primary" className="shadow-md gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18}/> Create Contest
          </Button>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><Trophy size={24}/></div>
             <p className="text-3xl font-black text-slate-800">12</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Contests</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4"><Users size={24}/></div>
             <p className="text-3xl font-black text-slate-800">2,500+</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Participants</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-[#1B2A6B]/5 text-[#1B2A6B] rounded-full flex items-center justify-center mb-4"><Calendar size={24}/></div>
             <p className="text-3xl font-black text-slate-800">₹7.5L</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Prize Money Distributed</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="space-y-4">
          {contests.map((contest) => (
            <Card key={contest.id} className="border border-slate-200 shadow-sm overflow-hidden bg-white hover:border-[#1B2A6B]/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{contest.title}</h3>
                      <Badge variant={
                        contest.status === 'Active' ? 'success' : 
                        contest.status === 'Upcoming' ? 'warning' : 'secondary'
                      }>{contest.status}</Badge>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">{contest.type}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-4">Sponsored by <strong className="text-slate-800">{contest.company}</strong> &bull; Prize Pool: <strong className="text-emerald-600">{contest.prize}</strong></p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-400"/> {contest.date}</span>
                      <span className="flex items-center gap-2"><Clock size={16} className="text-slate-400"/> {contest.duration}</span>
                      <span className="flex items-center gap-2"><Users size={16} className="text-slate-400"/> {contest.participants} Registered</span>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button variant="outline" className="flex-1 text-slate-600 gap-2"><Edit3 size={16}/> Edit</Button>
                    <Button variant="outline" className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 gap-2"><Trophy size={16}/> View Leaderboard</Button>
                    <Button variant="outline" onClick={() => handleDelete(contest.id)} className="flex-1 text-red-600 border-red-200 hover:bg-red-50 gap-2"><Trash2 size={16}/> Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimatedContent>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-lg font-black text-slate-800 mb-4">Create New Contest</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Contest Title" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              <input type="text" placeholder="Company/Sponsor" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              <div className="flex gap-2">
                 <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                 <Button variant="primary" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>Create</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
