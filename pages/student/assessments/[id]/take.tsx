import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  CheckSquare, Clock, ArrowLeft, ArrowRight, Save, 
  CheckCircle2, AlertCircle, HelpCircle, Layers, 
  Send, Sparkles, X, ChevronLeft, ChevronRight, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssessmentService, AssessmentQuestionItem } from "../../../../src/lib/api/AssessmentService";
import itSkillsData from "../../../../src/data/itSkillsAssessment50.json";
import toast from "react-hot-toast";

export default function StudentTakeAssessmentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [assessment, setAssessment] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<AssessmentQuestionItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback 50 questions from JSON
  const fallback50Questions: AssessmentQuestionItem[] = useMemo(() => {
    return (itSkillsData.questions || []).map((q: any) => ({
      id: q.id,
      assessment_id: 1,
      order: q.id,
      category: q.category,
      question: q.question,
      option_a: q.options?.A || "",
      option_b: q.options?.B || "",
      option_c: q.options?.C || "",
      option_d: q.options?.D || "",
      correct_answer: q.correct_answer,
      marks: 1,
      explanation: `Difficulty: ${q.difficulty || "Medium"}`
    }));
  }, []);

  useEffect(() => {
    if (id) {
      startOrResume();
    }
  }, [id]);

  const startOrResume = async () => {
    try {
      setIsLoading(true);
      const res = await AssessmentService.startAssessment(id as string);
      if (res && res.success) {
        setAssessment(res.data.assessment);
        setAttempt(res.data.attempt);

        const serverQuestions: AssessmentQuestionItem[] = res.data.questions || [];
        if (serverQuestions.length >= 50) {
          setQuestions(serverQuestions);
        } else {
          setQuestions(fallback50Questions);
        }

        if (res.data.saved_answers) {
          setAnswers(res.data.saved_answers);
        }
      } else {
        throw new Error("Unable to initialize from server");
      }
    } catch (err: any) {
      console.warn("Using offline/fallback assessment state:", err);
      setQuestions(fallback50Questions);
      setAssessment({
        id: 1,
        title: itSkillsData.title || "Common IT & Digital Skills Assessment",
        total_questions: itSkillsData.totalQuestions || 50,
        total_marks: itSkillsData.totalMarks || 50,
        duration_minutes: itSkillsData.durationMinutes || 40,
      });
      // Try to recover any saved answers from localStorage for resiliency
      try {
        const localSaved = localStorage.getItem(`bb_assessment_${id}_answers`);
        if (localSaved) {
          setAnswers(JSON.parse(localSaved));
        }
      } catch (e) {
        // ignore
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = async (questionId: number, option: string) => {
    const updated = { ...answers, [questionId]: option };
    setAnswers(updated);

    try {
      localStorage.setItem(`bb_assessment_${id}_answers`, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    if (attempt?.id) {
      try {
        setIsSaving(true);
        await AssessmentService.saveAnswer(id as string, {
          attempt_id: attempt.id,
          question_id: questionId,
          selected_answer: option,
        });
      } catch (err) {
        console.warn("Auto-save sync note:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleClearAnswer = async (questionId: number) => {
    const updated = { ...answers };
    delete updated[questionId];
    setAnswers(updated);

    try {
      localStorage.setItem(`bb_assessment_${id}_answers`, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    if (attempt?.id) {
      try {
        setIsSaving(true);
        await AssessmentService.saveAnswer(id as string, {
          attempt_id: attempt.id,
          question_id: questionId,
          selected_answer: null,
        });
      } catch (err) {
        console.warn("Clear sync note:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await AssessmentService.submitAssessment(id as string, {
        attempt_id: attempt?.id,
        answers: answers,
      });

      if (res && res.success) {
        toast.success("Assessment submitted successfully!");
        try {
          localStorage.removeItem(`bb_assessment_${id}_answers`);
        } catch (e) {}
        router.push(`/student/assessments/${id}/result/${attempt?.id || res.data?.attempt_id}`);
      } else {
        throw new Error("Submit returned unsuccessful");
      }
    } catch (err: any) {
      console.error(err);
      // If server submission failed, create a client-side attempt record to allow review
      let correctCount = 0;
      fallback50Questions.forEach((q) => {
        if (answers[q.id] && answers[q.id] === q.correct_answer) {
          correctCount++;
        }
      });
      const clientAttemptId = Date.now();
      const mockResult = {
        attempt: {
          id: clientAttemptId,
          assessment_id: Number(id) || 1,
          score: correctCount,
          total_questions: 50,
          correct_answers: correctCount,
          wrong_answers: Object.keys(answers).length - correctCount,
          unanswered: 50 - Object.keys(answers).length,
          percentage: Math.round((correctCount / 50) * 100),
          status: "completed",
          started_at: new Date().toISOString(),
        },
        answers: fallback50Questions.map((q) => ({
          question_id: q.id,
          order: q.order,
          category: q.category,
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          selected_answer: answers[q.id] || null,
          correct_answer: q.correct_answer,
          is_correct: answers[q.id] ? answers[q.id] === q.correct_answer : null,
          marks_obtained: answers[q.id] === q.correct_answer ? 1 : 0,
          explanation: q.explanation,
        }))
      };
      try {
        sessionStorage.setItem(`bb_attempt_result_${clientAttemptId}`, JSON.stringify(mockResult));
        toast.success("Assessment evaluated successfully!");
        router.push(`/student/assessments/${id}/result/${clientAttemptId}`);
      } catch (storageErr) {
        toast.error("Submission failed. Please check network and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.category) set.add(q.category);
    });
    return ["All", ...Array.from(set)];
  }, [questions]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "All") return questions;
    return questions.filter((q) => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  const currentQuestion = filteredQuestions[currentIndex] || questions[0];

  const totalAnswered = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? Math.round((totalAnswered / questions.length) * 100) : 0;

  // Countdown timer: 40 mins default
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(40 * 60);

  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center">
        <div>
          <div className="w-14 h-14 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-black">Loading 50 MCQ Assessment...</h2>
          <p className="text-xs text-slate-400 mt-2">Preparing your standardized question sheet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Head>
        <title>{assessment?.title || "Assessment"} | BlueBoxx Student Portal</title>
      </Head>

      {/* Top Fixed Nav */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/student/assessments"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft size={14} /> Exit
          </Link>
          <div className="hidden sm:block border-l border-slate-700 h-5" />
          <div>
            <h1 className="text-sm md:text-base font-black text-white leading-tight">
              {assessment?.title || "Common IT & Digital Skills Assessment"}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">50 Multiple-Choice Questions · 1 Mark Each</p>
          </div>
        </div>

        {/* Center / Right: Timer & Submit */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-black text-xs md:text-sm ${
            timeLeftSeconds < 300 
              ? "bg-rose-950/60 border-rose-700/60 text-rose-400 animate-pulse" 
              : "bg-slate-800/80 border-slate-700 text-amber-400"
          }`}>
            <Clock size={15} />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C9A227] hover:bg-[#b08d20] text-[#0d1635] text-xs font-black rounded-xl transition-all shadow-lg shadow-[#C9A227]/20"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Finish & Submit</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Question Paper UI (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          
          {/* Question Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Order Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-full">
                  <Layers size={13} />
                  {currentQuestion?.category || "General"}
                </span>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
                  {answers[currentQuestion?.id] && (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40 text-[10px]">
                      <CheckCircle2 size={11} /> Saved
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="pt-2">
                <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                  Q{currentQuestion?.order || (currentIndex + 1)}. {currentQuestion?.question}
                </h2>
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {[
                  { key: "A", label: currentQuestion?.option_a },
                  { key: "B", label: currentQuestion?.option_b },
                  { key: "C", label: currentQuestion?.option_c },
                  { key: "D", label: currentQuestion?.option_d },
                ].map((opt) => {
                  const isSelected = answers[currentQuestion?.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectAnswer(currentQuestion.id, opt.key)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                        isSelected
                          ? "bg-[#1B2A6B]/80 border-blue-400 text-white shadow-lg ring-2 ring-blue-400/30"
                          : "bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected
                          ? "bg-[#C9A227] text-[#0d1635]"
                          : "bg-slate-700 text-slate-300"
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm font-medium pt-0.5 leading-snug">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-6 mt-8 border-t border-slate-700/80 flex items-center justify-between gap-3">
              <button
                onClick={() => handleClearAnswer(currentQuestion?.id)}
                disabled={!answers[currentQuestion?.id]}
                className="text-xs font-bold text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Clear Selection
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <ChevronLeft size={15} /> Prev
                </button>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                  disabled={currentIndex === filteredQuestions.length - 1}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#1B2A6B] hover:bg-[#25398d] disabled:opacity-30 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Palette & Category Filter (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Progress Overview */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-300">Total Progress</span>
              <span className="text-[#C9A227]">{totalAnswered} / {questions.length} Attempted ({progressPercent}%)</span>
            </div>

            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#C9A227] to-amber-300 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="pt-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2 block">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? "bg-[#C9A227] text-[#0d1635]"
                        : "bg-slate-700/80 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center justify-between">
              <span>Question Palette ({filteredQuestions.length})</span>
              <span className="text-slate-500 font-medium">Click to jump</span>
            </h3>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 w-full rounded-xl text-xs font-black transition-all flex items-center justify-center border ${
                      isCurrent
                        ? "ring-2 ring-[#C9A227] border-white text-white bg-[#C9A227]/30"
                        : isAnswered
                        ? "bg-emerald-600/30 border-emerald-500/60 text-emerald-300"
                        : "bg-slate-700/60 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {q.order || (idx + 1)}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-5 mt-5 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-700 border border-slate-600" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded ring-2 ring-[#C9A227]" />
                <span>Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                <HelpCircle size={28} />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Ready to Submit?</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  You have answered <span className="font-bold text-white">{totalAnswered}</span> out of{" "}
                  <span className="font-bold text-white">{questions.length}</span> questions.
                  {questions.length - totalAnswered > 0 && (
                    <span className="block text-amber-400 mt-1">
                      ⚠️ {questions.length - totalAnswered} questions are still unanswered.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Review More
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#C9A227] hover:bg-[#b08d20] text-[#0d1635] font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#0d1635] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Confirm & Submit
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
