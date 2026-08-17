import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { HelpCircle, Plus, Search, Filter, MoreHorizontal, Clock, Users, BookOpenCheck, Edit3, Trash2, X, CheckCircle2 } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";

const INITIAL_QUIZZES = [
  { id: 1, title: "React Fundamentals Assessment", course: "Frontend Web Development", questions: 25, duration: "30 mins", participants: 145, status: "Active" },
  { id: 2, title: "Python Data Structures", course: "AI/ML Basic (Python)", questions: 50, duration: "60 mins", participants: 320, status: "Active" },
  { id: 3, title: "UI/UX Design Principles", course: "Advanced Figma Pro", questions: 15, duration: "20 mins", participants: 85, status: "Draft" },
];

export default function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const router = useRouter();
  const confirmAction = useConfirm();

  useEffect(() => {
    const stored = localStorage.getItem('bb_quizzes');
    if (stored) {
      setQuizzes(JSON.parse(stored));
    } else {
      setQuizzes(INITIAL_QUIZZES);
      localStorage.setItem('bb_quizzes', JSON.stringify(INITIAL_QUIZZES));
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  
  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete Quiz", description: "Are you sure you want to delete this quiz?", isDestructive: true })) {
      const updated = quizzes.filter(q => q.id !== id);
      setQuizzes(updated);
      localStorage.setItem('bb_quizzes', JSON.stringify(updated));
      toast.success("Quiz deleted.");
    }
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;
    
    const updated = [
      { id: Date.now(), title: newQuizTitle, course: "Unassigned", questions: 0, duration: "10 mins", participants: 0, status: "Draft" },
      ...quizzes
    ];
    setQuizzes(updated);
    localStorage.setItem('bb_quizzes', JSON.stringify(updated));
    setNewQuizTitle("");
    setIsModalOpen(false);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Quiz & MCQ Management</h1>
            <p className="text-slate-500 text-sm">Create and evaluate assessments for your courses.</p>
          </div>
          <Button variant="primary" className="shadow-md gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18}/> Create Assessment
          </Button>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search quizzes by title or course..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
            />
          </div>
          <Button variant="outline" className="gap-2 shrink-0"><Filter size={16}/> Filters</Button>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border border-slate-200 shadow-sm overflow-hidden bg-white hover:border-[#1B2A6B]/30 transition-colors group">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><HelpCircle size={18}/></div>
                      <h3 className="text-lg font-bold text-slate-900">{quiz.title}</h3>
                      <Badge variant={quiz.status === 'Active' ? 'success' : 'secondary'}>{quiz.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-4 pl-12">Linked Course: <strong className="text-slate-800">{quiz.course}</strong></p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 ml-12">
                      <span className="flex items-center gap-2"><BookOpenCheck size={16} className="text-slate-400"/> {quiz.questions} Questions</span>
                      <span className="flex items-center gap-2"><Clock size={16} className="text-slate-400"/> {quiz.duration}</span>
                      <span className="flex items-center gap-2"><Users size={16} className="text-slate-400"/> {quiz.participants} Attempts</span>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 shrink-0 justify-center">
                    <Button variant="outline" className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 gap-2" onClick={() => router.push(`/admin/education/quiz-edit?id=${quiz.id}`)}><Edit3 size={16}/> Edit Questions</Button>
                    <Button variant="outline" className="flex-1 text-slate-600 gap-2 hover:bg-slate-50" onClick={() => toast.success("Results loaded!")}><MoreHorizontal size={16}/> View Results</Button>
                    <Button variant="outline" onClick={() => handleDelete(quiz.id)} className="flex-1 text-red-600 border-red-200 hover:bg-red-50 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/> Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimatedContent>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AnimatedContent direction="up" className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Plus size={20} className="text-[#1B2A6B]" /> Quiz Builder</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateQuiz} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz Title</label>
                <input 
                  required
                  type="text" 
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" 
                  placeholder="e.g. End of term test" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1 shadow-md gap-2">Create Quiz</Button>
              </div>
            </form>
          </AnimatedContent>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
