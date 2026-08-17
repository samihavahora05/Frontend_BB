import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function AdminQuizEditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('bb_quizzes');
    if (stored) {
      const quizzes = JSON.parse(stored);
      const found = quizzes.find((q: any) => q.id.toString() === id.toString());
      if (found) {
        setQuiz(found);
        setQuestions(found.questionData || [
          { id: Date.now(), text: "", options: ["", "", "", ""], correctIndex: 0 }
        ]);
      } else {
        toast.error("Quiz not found");
        router.push("/admin/education/quiz");
      }
    }
  }, [id, router]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { id: Date.now(), text: "", options: ["", "", "", ""], correctIndex: 0 }
    ]);
  };

  const removeQuestion = (qId: number) => {
    setQuestions(prev => prev.filter(q => q.id !== qId));
  };

  const updateQuestionText = (qId: number, text: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, text } : q));
  };

  const updateOption = (qId: number, optIndex: number, text: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.options];
        newOpts[optIndex] = text;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const setCorrectOption = (qId: number, optIndex: number) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, correctIndex: optIndex } : q));
  };

  const handleSave = () => {
    // Validate
    const invalid = questions.some(q => !q.text.trim() || q.options.some((o: string) => !o.trim()));
    if (invalid) {
      toast.error("Please fill out all question text and options before saving.");
      return;
    }

    setIsSaving(true);
    const stored = localStorage.getItem('bb_quizzes');
    if (stored) {
      const quizzes = JSON.parse(stored);
      const updated = quizzes.map((q: any) => {
        if (q.id.toString() === id?.toString()) {
          return { 
            ...q, 
            questionData: questions,
            questions: questions.length // update the count
          };
        }
        return q;
      });
      localStorage.setItem('bb_quizzes', JSON.stringify(updated));
    }
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Questions Saved Successfully!");
    }, 600);
  };

  if (!quiz) return null;

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-24">
        {/* Header */}
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/education/quiz" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Questions</h1>
              <p className="text-slate-500 text-sm font-semibold">{quiz.title}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleSave} className="shadow-md gap-2 min-w-[140px]" disabled={isSaving}>
              {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18}/>}
              {isSaving ? "Saving..." : "Save Questions"}
            </Button>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Question {idx + 1}</span>
                <button onClick={() => removeQuestion(q.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <textarea 
                    rows={2} 
                    placeholder="Enter your question here..."
                    value={q.text}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isCorrect = q.correctIndex === optIdx;
                    return (
                      <div key={optIdx} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white'} transition-colors`}>
                        <button 
                          onClick={() => setCorrectOption(q.id, optIdx)}
                          className={`shrink-0 ${isCorrect ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'}`}
                          title="Mark as correct answer"
                        >
                          {isCorrect ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                        <input 
                          type="text" 
                          placeholder={`Option ${optIdx + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                          className="flex-1 bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-[#1B2A6B] hover:text-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all gap-2 font-bold text-sm">
            <Plus size={24} />
            Add New Question
          </button>
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}
