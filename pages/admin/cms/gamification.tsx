import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Gamepad2, Trophy, Medal, Star, Plus, Target, Trash2, X, Zap, MessageCircle } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { useState } from "react";

const INITIAL_BADGES = [
  { id: 1, name: "Fast Learner", description: "Completed 3 courses in a month", points: 500, iconName: "zap", color: "bg-amber-100" },
  { id: 2, name: "Top Contributor", description: "Answered 50 questions in Q&A", points: 1000, iconName: "message", color: "bg-blue-100" },
  { id: 3, name: "Code Master", description: "Won 1st place in a Hackathon", points: 2500, iconName: "trophy", color: "bg-emerald-100" },
];

export default function AdminGamificationPage() {
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBadge, setNewBadge] = useState({ name: "", description: "", points: 100, color: "bg-purple-100", iconName: "star" });

  const renderIcon = (name: string, colorClass: string) => {
    let baseColor = colorClass.replace('bg-', 'text-').replace('100', '500');
    if (colorClass === 'bg-slate-100') baseColor = 'text-slate-500';

    switch(name) {
       case "zap": return <Zap size={24} className={baseColor} />;
       case "message": return <MessageCircle size={24} className={baseColor} />;
       case "trophy": return <Trophy size={24} className={baseColor} />;
       default: return <Star size={24} className={baseColor} />;
    }
  };

  const handleAddBadge = (e: React.FormEvent) => {
     e.preventDefault();
     const badge = {
        id: badges.length + 1,
        ...newBadge
     };
     setBadges([...badges, badge]);
     setIsModalOpen(false);
     setNewBadge({ name: "", description: "", points: 100, color: "bg-purple-100", iconName: "star" });
  };

  const handleDeleteBadge = (id: number) => {
     setBadges(badges.filter(b => b.id !== id));
  };

  const [pointsSaved, setPointsSaved] = useState(false);
  const handleSavePoints = () => {
     setPointsSaved(true);
     setTimeout(() => setPointsSaved(false), 2000);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Gamification System</h1>
            <p className="text-slate-500 text-sm">Design badges, manage points, and oversee student leaderboards.</p>
          </div>
          <Button variant="primary" className="shadow-md gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18}/> Create New Badge
          </Button>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#1B2A6B] to-[#2B44A8] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 text-white/10"><Gamepad2 size={100}/></div>
             <p className="text-3xl font-black mb-1 relative z-10">2.4M</p>
             <p className="text-xs font-medium text-blue-100 uppercase tracking-widest relative z-10">Total Points Awarded</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
             <p className="text-3xl font-black text-slate-800 mb-1">{badges.length}</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Badges</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
             <p className="text-3xl font-black text-slate-800 mb-1">Top 5%</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Leaderboard Tier</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
             <p className="text-3xl font-black text-slate-800 mb-1">450+</p>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Streaks &gt; 30</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Medal size={18} className="text-[#1B2A6B]" /> Platform Badges & Achievements
            </h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div key={badge.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-[#1B2A6B]/30 transition-all text-center flex flex-col items-center group relative">
                 <button onClick={() => handleDeleteBadge(badge.id)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-700">
                    <Trash2 size={16} />
                 </button>
                 <div className={`w-20 h-20 rounded-full ${badge.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                   {renderIcon(badge.iconName, badge.color)}
                 </div>
                 <h3 className="font-bold text-lg text-slate-900 mb-1">{badge.name}</h3>
                 <p className="text-sm font-medium text-slate-500 mb-4">{badge.description}</p>
                 <Badge className="bg-slate-100 text-slate-700 w-full justify-center text-sm py-1.5"><Star size={14} className="text-amber-500 mr-1.5 fill-current"/> {badge.points} Points</Badge>
              </div>
            ))}
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.4} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Target size={18} className="text-[#1B2A6B]" /> Points Configuration
            </h2>
            <Button variant={pointsSaved ? "primary" : "outline"} onClick={handleSavePoints} className={pointsSaved ? "bg-emerald-600 border-emerald-600 text-xs py-1.5 h-8" : "bg-white text-xs py-1.5 h-8"}>
               {pointsSaved ? "Rules Saved!" : "Save Rules"}
            </Button>
          </div>
          
          <div className="p-6">
             <table className="w-full text-left text-sm">
                <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                   <tr>
                      <th className="pb-3">User Action</th>
                      <th className="pb-3 w-48 text-right">Points Awarded</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                   <tr>
                      <td className="py-4">Completing a Course Module</td>
                      <td className="py-4 text-right"><input type="number" defaultValue="50" className="w-24 text-right px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></td>
                   </tr>
                   <tr>
                      <td className="py-4">Scoring 100% on a Quiz</td>
                      <td className="py-4 text-right"><input type="number" defaultValue="200" className="w-24 text-right px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></td>
                   </tr>
                   <tr>
                      <td className="py-4">Answering a Q&A question</td>
                      <td className="py-4 text-right"><input type="number" defaultValue="10" className="w-24 text-right px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></td>
                   </tr>
                </tbody>
             </table>
          </div>
        </AnimatedContent>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AnimatedContent direction="up" className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Create New Badge</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddBadge} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badge Name</label>
                <input 
                  required
                  type="text" 
                  value={newBadge.name}
                  onChange={(e) => setNewBadge({...newBadge, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" 
                  placeholder="e.g. Master Contributor" 
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <input 
                  required
                  type="text" 
                  value={newBadge.description}
                  onChange={(e) => setNewBadge({...newBadge, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" 
                  placeholder="e.g. Answered 100 questions" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Points</label>
                  <input 
                    required
                    type="number" 
                    value={newBadge.points}
                    onChange={(e) => setNewBadge({...newBadge, points: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color Theme</label>
                  <select 
                    value={newBadge.color}
                    onChange={(e) => setNewBadge({...newBadge, color: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                  >
                    <option value="bg-purple-100">Purple</option>
                    <option value="bg-amber-100">Amber</option>
                    <option value="bg-blue-100">Blue</option>
                    <option value="bg-emerald-100">Emerald</option>
                    <option value="bg-rose-100">Rose</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1 shadow-md">Create Badge</Button>
              </div>
            </form>
          </AnimatedContent>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
