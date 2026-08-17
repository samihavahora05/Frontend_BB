import { CollegesDashboardLayout } from "../../../src/layout/CollegesDashboardLayout";
import { Building2, Search, Filter, Briefcase, MoreVertical, MapPin, CheckCircle2, ChevronDown, MessageSquare, ExternalLink, XCircle, SearchX } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useMockData } from "../../../src/context/MockDataContext";
import { EmptyState } from "../../../src/components/ui/EmptyState";

type PlacementData = {
  id: number;
  name: string;
  company: string;
  role: string;
  location: string;
  status: "applied" | "interviewing" | "offered";
};

export default function CollegePlacements() {
  const { placements, setPlacements } = useMockData();
  const [activeTab, setActiveTab] = useState("Board View");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null as number | null);

  const filteredItems = placements.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("itemId", id.toString());
  };

  const handleDrop = (e: React.DragEvent, status: "applied" | "interviewing" | "offered") => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData("itemId"));
    if (!itemId) return;

    setPlacements(prev => prev.map(item => {
      if (item.id === itemId) {
        if (item.status !== status) {
          toast.success(`${item.name} moved to ${status}`);
        }
        return { ...item, status };
      }
      return item;
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderCard = (item: PlacementData, _index: number, colorClass: string, bgClass: string, Icon?: any) => (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      className={`bg-white p-4 rounded-xl border ${colorClass} shadow-sm hover:shadow-md transition-all cursor-move relative overflow-hidden group`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${bgClass}`}></div>
      <div className="flex justify-between items-start mb-2 pl-2">
        <h4 className="font-bold text-sm text-[#0d1635] flex items-center gap-1">
          {item.name} {Icon && <Icon size={14} className="text-emerald-500" />}
        </h4>
        <div className="relative">
          <button onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)} className="text-slate-400 hover:text-[#1B2A6B] bg-slate-50 rounded p-1"><MoreVertical size={14}/></button>
          <AnimatePresence>
            {activeMenuId === item.id && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                <button onClick={() => { setActiveMenuId(null); toast.success("Opening chat..."); }} className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><MessageSquare size={12}/> Message</button>
                <button onClick={() => { setActiveMenuId(null); toast.success("Opening profile..."); }} className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><ExternalLink size={12}/> View Profile</button>
                <div className="border-t border-slate-100 my-1"></div>
                <button onClick={() => { setActiveMenuId(null); setPlacements(prev => prev.filter(i => i.id !== item.id)); toast.success("Application withdrawn"); }} className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"><XCircle size={12}/> Withdraw</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B2A6B] mb-3 pl-2">
        <Building2 size={12} /> {item.company}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 pl-2">
        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Briefcase size={10}/> {item.role}</span>
        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={10}/> {item.location}</span>
      </div>
    </div>
  );

  return (
    <CollegesDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] mb-1">Placement Tracker</h1>
          <p className="text-slate-500 font-medium text-sm">Track your students' application statuses across partner companies.</p>
        </div>
        <div className="flex gap-3 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          {['Board View', 'List View'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === tab ? 'bg-[#1B2A6B] text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by student or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] shadow-sm" 
          />
        </div>
        <div className="relative">
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm shrink-0">
            <Filter size={16} /> Filters <ChevronDown size={14}/>
          </button>
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 0 }} className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                <div className="px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">Company Filter</div>
                {["All Companies", "Google", "Amazon", "Infosys"].map(comp => (
                  <button key={comp} onClick={() => setIsFilterOpen(false)} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    {comp}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-8">
          <EmptyState 
            icon={SearchX} 
            title="No placements found" 
            description="We couldn't find any placement records matching your current filters or search terms."
            actionLabel="Clear Filters"
            onAction={() => setSearchTerm("")}
          />
        </div>
      ) : activeTab === "Board View" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
          
          {/* Applied Column */}
          <div 
            className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 min-w-[300px]"
            onDrop={(e) => handleDrop(e, "applied")}
            onDragOver={handleDragOver}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Applied
                <span className="bg-white text-slate-500 px-2 py-0.5 rounded-md text-xs border border-slate-200">
                  {filteredItems.filter(i => i.status === "applied").length}
                </span>
              </h3>
            </div>
            <div className="space-y-3 min-h-[100px]">
              {filteredItems.filter(i => i.status === "applied").map((item, i) => 
                renderCard(item, i, "border-slate-200", "bg-transparent")
              )}
            </div>
          </div>

          {/* Interviewing Column */}
          <div 
            className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 min-w-[300px]"
            onDrop={(e) => handleDrop(e, "interviewing")}
            onDragOver={handleDragOver}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> Interviewing
                <span className="bg-white text-slate-500 px-2 py-0.5 rounded-md text-xs border border-slate-200">
                  {filteredItems.filter(i => i.status === "interviewing").length}
                </span>
              </h3>
            </div>
            <div className="space-y-3 min-h-[100px]">
              {filteredItems.filter(i => i.status === "interviewing").map((item, i) => 
                renderCard(item, i, "border-amber-200", "bg-amber-400")
              )}
            </div>
          </div>

          {/* Offered Column */}
          <div 
            className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 min-w-[300px]"
            onDrop={(e) => handleDrop(e, "offered")}
            onDragOver={handleDragOver}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Offered
                <span className="bg-white text-slate-500 px-2 py-0.5 rounded-md text-xs border border-slate-200">
                  {filteredItems.filter(i => i.status === "offered").length}
                </span>
              </h3>
            </div>
            <div className="space-y-3 min-h-[100px]">
              {filteredItems.filter(i => i.status === "offered").map((item, i) => 
                renderCard(item, i, "border-emerald-200", "bg-emerald-400", CheckCircle2)
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-500 font-medium">List View coming soon.</p>
        </div>
      )}
    </CollegesDashboardLayout>
  );
}
