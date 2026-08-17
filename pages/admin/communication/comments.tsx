import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { MessageSquare, Shield, ShieldAlert, Search, Filter, CheckCircle2, Trash2, X, Save } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { useState } from "react";

const INITIAL_COMMENTS = [
  { id: 1, author: "Rahul Sharma", text: "This blog post was incredibly helpful for my upcoming interview. Thanks!", source: "Blog: Future of AI", date: "2 hours ago", status: "Pending" },
  { id: 2, author: "SpamBot99", text: "Click here to win a free iPhone! http://spam.link", source: "Course: Frontend Web Dev", date: "5 hours ago", status: "Flagged" },
  { id: 3, author: "Priya Patel", text: "Could you explain the React Hooks section in more detail?", source: "Course: Advanced React", date: "1 day ago", status: "Approved" },
];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [activeTab, setActiveTab] = useState("Pending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateStatus = (id: number, newStatus: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDelete = (id: number) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const filteredComments = comments.filter(c => c.status === activeTab);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Comment Moderation</h1>
            <p className="text-slate-500 text-sm">Review, approve, and moderate user comments across blogs and courses.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2 bg-white text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => setIsModalOpen(true)}>
               <ShieldAlert size={16}/> Auto-Mod Settings
             </Button>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => setActiveTab("Pending")} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'Pending' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Pending Review</button>
               <button onClick={() => setActiveTab("Flagged")} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'Flagged' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}>
                 Flagged <Badge className="bg-rose-100 text-rose-700 px-1.5 py-0">{comments.filter(c => c.status === 'Flagged').length}</Badge>
               </button>
               <button onClick={() => setActiveTab("Approved")} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'Approved' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Approved</button>
             </div>
             
             <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search comments..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
             </div>
          </div>

          <div className="divide-y divide-slate-100">
             {filteredComments.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium flex flex-col items-center justify-center">
                   <Shield size={48} className="mb-4 text-slate-200" />
                   No comments in this queue. You're all caught up!
                </div>
             ) : (
               filteredComments.map((comment) => (
                 <div key={comment.id} className="p-6 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900">{comment.author}</h4>
                          <span className="text-xs font-semibold text-slate-400">&bull; {comment.date}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded ml-2">{comment.source}</span>
                       </div>
                       <p className="text-sm font-medium text-slate-700 mb-3">{comment.text}</p>
                       
                       <div className="flex gap-2">
                          {activeTab !== 'Approved' && (
                            <Button variant="outline" onClick={() => updateStatus(comment.id, 'Approved')} className="h-8 text-xs font-bold gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 bg-white"><CheckCircle2 size={14}/> Approve</Button>
                          )}
                          {activeTab !== 'Flagged' && (
                            <Button variant="outline" onClick={() => updateStatus(comment.id, 'Flagged')} className="h-8 text-xs font-bold gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 bg-white"><ShieldAlert size={14}/> Flag Spam</Button>
                          )}
                          <Button variant="outline" onClick={() => handleDelete(comment.id)} className="h-8 text-xs font-bold gap-1.5 text-slate-500 hover:bg-slate-100 bg-white"><Trash2 size={14}/> Delete</Button>
                       </div>
                    </div>
                 </div>
               ))
             )}
          </div>
        </AnimatedContent>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AnimatedContent direction="up" className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-rose-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ShieldAlert size={20} className="text-rose-600" /> Auto-Mod Settings</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                 <input type="checkbox" defaultChecked className="w-4 h-4 text-[#1B2A6B] rounded focus:ring-[#1B2A6B]" />
                 <div>
                   <p className="font-bold text-sm text-slate-800">Block Links</p>
                   <p className="text-xs text-slate-500 font-medium mt-0.5">Automatically flag comments containing external URLs.</p>
                 </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                 <input type="checkbox" defaultChecked className="w-4 h-4 text-[#1B2A6B] rounded focus:ring-[#1B2A6B]" />
                 <div>
                   <p className="font-bold text-sm text-slate-800">Profanity Filter</p>
                   <p className="text-xs text-slate-500 font-medium mt-0.5">Mask or flag comments with inappropriate language.</p>
                 </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                 <input type="checkbox" className="w-4 h-4 text-[#1B2A6B] rounded focus:ring-[#1B2A6B]" />
                 <div>
                   <p className="font-bold text-sm text-slate-800">Manual Approval Required</p>
                   <p className="text-xs text-slate-500 font-medium mt-0.5">All new comments go to the Pending queue by default.</p>
                 </div>
              </label>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1 shadow-md gap-2 bg-rose-600 hover:bg-rose-700 border-rose-600" onClick={() => setIsModalOpen(false)}>
                  <Save size={16}/> Save Rules
                </Button>
              </div>
            </div>
          </AnimatedContent>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
