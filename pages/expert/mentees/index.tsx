import { ExpertDashboardLayout } from "../../../src/layout/ExpertDashboardLayout";
import { Search, MoreHorizontal, MessageSquare, Star, User, CheckSquare, XSquare } from "lucide-react";
import { useState } from "react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { ChatModal } from "../../../src/components/ChatModal";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import { SearchX, Users } from "lucide-react";
import { AdvancedFilterPanel, FilterCategory } from "../../../src/components/ui/AdvancedFilterPanel";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ExpertMentees() {
  const { data, isLoading, mutate } = useSWR("/expert/mentees", fetcher);
  const mentees = data?.data || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [chatUser, setChatUser] = useState(null as string | null);
  const [activeMenuId, setActiveMenuId] = useState(null as number | null);
  
  const [activeFilters, setActiveFilters] = useState<{ [categoryId: string]: string[] }>({
    role: [],
    status: [],
    rating: []
  });
  
  const filterCategories: FilterCategory[] = [
    {
      id: "role",
      title: "Target Role",
      options: [
        { id: "Frontend Engineer", label: "Frontend Engineer" },
        { id: "Backend Engineer", label: "Backend Engineer" },
        { id: "Full Stack Developer", label: "Full Stack Developer" },
        { id: "Data Scientist", label: "Data Scientist" },
      ]
    },
    {
      id: "status",
      title: "Status",
      options: [
        { id: "Active", label: "Active" },
        { id: "Completed", label: "Completed" },
        { id: "Paused", label: "Paused" },
      ]
    },
    {
      id: "rating",
      title: "Rating (Min)",
      options: [
        { id: "4.5", label: "4.5 & up" },
        { id: "4.0", label: "4.0 & up" },
      ]
    }
  ];

  const handleFilterChange = (categoryId: string, optionId: string) => {
    setActiveFilters(prev => {
      const current = prev[categoryId] || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      return { ...prev, [categoryId]: updated };
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({ role: [], status: [], rating: [] });
  };

  const filteredMentees = mentees.filter((mentee: any) => {
    const matchesSearch = mentee.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = activeFilters.role.length === 0 || activeFilters.role.includes(mentee.role);
    const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(mentee.status);
    
    const matchesRating = activeFilters.rating.length === 0 || activeFilters.rating.some(r => parseFloat(mentee.rating) >= parseFloat(r));

    return matchesSearch && matchesRole && matchesStatus && matchesRating;
  });

  const handleRemoveMentee = async (menteeId: number) => {
    // Optimistic UI update
    const updated = mentees.filter((m: any) => m.id !== menteeId);
    mutate({ ...data, data: updated }, false);
    toast.success("Mentee removed");
    // API Call would go here: await api.delete(`/expert/mentees/${menteeId}`);
    mutate();
  };

  return (
    <ExpertDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] mb-1">My Meetings</h1>
          <p className="text-slate-500 font-medium text-sm">Track progress, review feedback, and manage your active meetings.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/50">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search meetings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 transition-all shadow-sm" 
            />
          </div>
          <AdvancedFilterPanel 
            categories={filterCategories} 
            activeFilters={activeFilters} 
            onFilterChange={handleFilterChange} 
            onClearAll={handleClearAllFilters} 
          />
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading meetings...</div>
        ) : filteredMentees.length === 0 ? (
          <div className="p-8">
            <EmptyState 
              icon={mentees.length === 0 ? Users : SearchX} 
              title={mentees.length === 0 ? "No Meetings Yet" : "No results found"} 
              description={mentees.length === 0 ? "You haven't accepted any meetings yet. Check your dashboard for pending requests." : "Try adjusting your search or filters to find what you're looking for."}
              actionText={mentees.length > 0 ? "Clear Filters" : undefined}
              onAction={() => setSearchTerm("")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status & Progress</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMentees.map((mentee: any, i: number) => (
                <tr key={mentee.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                        {mentee.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-800">{mentee.name}</span>
                        <span className="text-[10px] font-semibold text-slate-500">Mentee since Aug 2023</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{mentee.role}</p>
                    <p className="text-xs text-slate-500 font-medium">{mentee.company}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${
                        mentee.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {mentee.status}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{mentee.progress}%</span>
                    </div>
                    <div className="w-full max-w-[120px] bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <AnimatedContent direction="right" delay={i * 0.1} className="h-full">
                        <div className="bg-[#1B2A6B] h-1.5 rounded-full" style={{ width: `${mentee.progress}%` }}></div>
                      </AnimatedContent>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                      <Star size={14} className="text-amber-400 fill-amber-400" /> {mentee.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 relative">
                    <button onClick={() => setChatUser(mentee.name)} className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors">
                      <MessageSquare size={16} />
                    </button>
                    <button onClick={() => setActiveMenuId(activeMenuId === mentee.id ? null : mentee.id)} className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                    <AnimatePresence>
                      {activeMenuId === mentee.id && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-6 top-full mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                          <button onClick={() => { setActiveMenuId(null); toast.success("Viewed Profile"); }} className="w-full px-4 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><User size={14}/> View Profile</button>
                          <button onClick={() => { setActiveMenuId(null); toast.success("Marked as Completed"); }} className="w-full px-4 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><CheckSquare size={14}/> Complete</button>
                          <div className="border-t border-slate-100 my-1"></div>
                          <button onClick={() => { setActiveMenuId(null); handleRemoveMentee(mentee.id); }} className="w-full px-4 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"><XSquare size={14}/> Remove</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <ChatModal 
        isOpen={!!chatUser} 
        onClose={() => setChatUser(null)} 
        menteeName={chatUser || ""} 
      />
    </ExpertDashboardLayout>
  );
}
