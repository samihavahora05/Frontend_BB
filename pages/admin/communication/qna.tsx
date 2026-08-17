import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { HelpCircle, Search, Filter, CheckCircle2, MessageSquare, Trash2, ArrowRight } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { useState } from "react";

const INITIAL_QUESTIONS = [
  { id: 1, student: "Ananya Gupta", course: "Frontend Web Development", question: "Why is my useEffect running twice on mount in Next.js?", date: "1 hour ago", status: "Unanswered", answers: 0, replies: [] as {text: string, isInstructor: boolean}[] },
  { id: 2, student: "Vikram Singh", course: "AI/ML Basic (Python)", question: "What is the difference between supervised and unsupervised learning?", date: "3 hours ago", status: "Answered", answers: 2, replies: [{text: "Supervised uses labeled data, unsupervised uses unlabeled data.", isInstructor: true}] },
  { id: 3, student: "Rohan Das", course: "Advanced Figma Pro", question: "How to export assets properly for developers?", date: "1 day ago", status: "Answered", answers: 5, replies: [{text: "Use the export panel on the right sidebar and select 2x for retina.", isInstructor: true}] },
];

export default function AdminQnAPage() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [activeQuestionId, setActiveQuestionId] = useState(1);
  const [replyText, setReplyText] = useState("");

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  const handleDelete = (id: number) => {
     setQuestions(prev => prev.filter(q => q.id !== id));
     if (activeQuestionId === id) setActiveQuestionId(questions[0]?.id || 0);
  };

  const handleAddAnswer = () => {
    if (!replyText.trim() || !activeQuestion) return;
    
    const updatedQuestions = questions.map(q => {
      if (q.id === activeQuestion.id) {
        return {
          ...q,
          status: "Answered",
          answers: q.answers + 1,
          replies: [...q.replies, { text: replyText, isInstructor: true }]
        };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    setReplyText("");
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Q&A Forums</h1>
            <p className="text-slate-500 text-sm">Monitor student questions, provide official answers, and moderate discussions.</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex h-[600px]">
           {/* Left Sidebar - Question List */}
           <div className="w-96 border-r border-slate-100 flex flex-col bg-slate-50 hidden md:flex">
              <div className="p-4 border-b border-slate-100 bg-white space-y-3">
                 <div className="flex gap-2">
                    <Button variant="primary" className="flex-1 h-8 text-xs font-bold">All Questions</Button>
                 </div>
                 <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search Q&A..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {questions.map((q) => (
                   <div key={q.id} onClick={() => setActiveQuestionId(q.id)} className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${q.id === activeQuestionId ? 'bg-white border-l-4 border-l-[#1B2A6B]' : 'hover:bg-white border-l-4 border-l-transparent'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <Badge variant={q.status === 'Answered' ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">{q.status}</Badge>
                         <span className="text-[10px] font-semibold text-slate-400">{q.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">{q.question}</h4>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-xs font-medium text-slate-500">{q.student}</span>
                         <span className="flex items-center gap-1 text-xs font-bold text-slate-400"><MessageSquare size={12}/> {q.answers}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           {/* Right Panel - Active Question Detail */}
           <div className="flex-1 flex flex-col bg-white">
             {activeQuestion ? (
               <>
                  <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0">
                     <div>
                        <Badge className="bg-purple-50 text-purple-600 mb-3">{activeQuestion.course}</Badge>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">{activeQuestion.question}</h2>
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0"><div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">{activeQuestion.student[0]}</div></div>
                           <span className="text-sm font-bold text-slate-700">{activeQuestion.student}</span>
                           <span className="text-xs font-medium text-slate-400">&bull; {activeQuestion.date}</span>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(activeQuestion.id)}><Trash2 size={16}/></Button>
                     </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
                      {activeQuestion.replies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center h-full text-slate-400">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><HelpCircle size={24}/></div>
                          <h3 className="text-lg font-bold text-slate-800 mb-1">No Answers Yet</h3>
                          <p className="text-sm text-slate-500 max-w-md">Be the first to help {activeQuestion.student} by providing an official instructor answer.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           {activeQuestion.replies.map((reply, i) => (
                             <div key={i} className={`p-4 rounded-2xl max-w-2xl ${reply.isInstructor ? 'bg-blue-50 border border-blue-100 ml-auto' : 'bg-white border border-slate-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${reply.isInstructor ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{reply.isInstructor ? 'IN' : 'ST'}</div>
                                   <span className="text-xs font-bold text-slate-700">{reply.isInstructor ? 'Instructor' : activeQuestion.student}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">{reply.text}</p>
                             </div>
                           ))}
                        </div>
                      )}
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                     <div className="flex gap-2">
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type an official answer..." 
                          className="flex-1 h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none"
                        ></textarea>
                        <Button variant="primary" onClick={handleAddAnswer} className="h-auto w-16 shadow-md"><ArrowRight size={20}/></Button>
                     </div>
                  </div>
               </>
             ) : (
               <div className="flex-1 flex items-center justify-center text-slate-400">Select a question to view</div>
             )}
           </div>
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}
