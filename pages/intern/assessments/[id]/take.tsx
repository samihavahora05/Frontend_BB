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
import { BASELINE_100_QUESTIONS } from "../../../../src/data/assessmentQuestionsBaseline";
import toast from "react-hot-toast";

export default function TakeAssessmentPage() {
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

  useEffect(() => {
    if (id) {
      startOrResume();
    }
  }, [id]);

  const startOrResume = async () => {
    try {
      setIsLoading(true);
      const res = await AssessmentService.startAssessment(id as string);
      if (res.success) {
        setAssessment(res.data.assessment);
        setAttempt(res.data.attempt);

        // Fetch questions from backend API
        const serverQuestions: AssessmentQuestionItem[] = res.data.questions || [];

        // If backend returns fewer than 100 questions, merge with baseline 100 questions
        let completeQuestions: AssessmentQuestionItem[] = [];
        if (serverQuestions.length >= 100) {
          completeQuestions = serverQuestions;
        } else {
          // Map existing server questions by order or ID
          const serverMapByOrder = new Map<number, AssessmentQuestionItem>();
          serverQuestions.forEach((q) => {
            if (q.order) serverMapByOrder.set(q.order, q);
          });

          completeQuestions = BASELINE_100_QUESTIONS.map((baseQ) => {
            const serverMatch = serverMapByOrder.get(baseQ.order);
            if (serverMatch) {
              return {
                ...baseQ,
                id: serverMatch.id,
                order: serverMatch.order,
                category: serverMatch.category || baseQ.category,
                question: serverMatch.question || baseQ.question,
                option_a: serverMatch.option_a || baseQ.option_a,
                option_b: serverMatch.option_b || baseQ.option_b,
                option_c: serverMatch.option_c || baseQ.option_c,
                option_d: serverMatch.option_d || baseQ.option_d,
                marks: serverMatch.marks || baseQ.marks,
              };
            }
            return baseQ;
          });
        }

        setQuestions(completeQuestions);

        if (res.data.saved_answers) {
          setAnswers(res.data.saved_answers);
        }
      }
    } catch (err: any) {
      console.error(err);
      // Fallback to baseline 100 questions if API network error occurs
      setQuestions(BASELINE_100_QUESTIONS);
      setAssessment({
        id: 1,
        title: "100 MCQ Internship Assessment",
        total_questions: 100,
        total_marks: 100,
        duration_minutes: 60,
      });
      toast.error(err.response?.data?.message || "Connected with 100 MCQ baseline suite.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = async (questionId: number, option: string) => {
    const updated = { ...answers, [questionId]: option };
    setAnswers(updated);

    // Auto-save to server if attempt is active
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

      if (res.success) {
        toast.success("Assessment submitted successfully!");
        router.push(`/intern/assessments/${id}/result/${attempt?.id || res.data?.attempt_id}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe question calculations
  const totalQuestions = questions.length > 0 ? questions.length : 100;
  const currentQ = questions[currentIndex] || questions[0];
  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((k) => Boolean(answers[Number(k)])).length;
  }, [answers]);
  const remainingCount = Math.max(0, totalQuestions - answeredCount);
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Dynamic category tabs counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: questions.length,
      "Web Development": 0,
      "Digital Marketing": 0,
      "Graphic Designing": 0,
    };
    questions.forEach((q) => {
      if (counts[q.category] !== undefined) {
        counts[q.category]++;
      } else {
        counts[q.category] = 1;
      }
    });
    return counts;
  }, [questions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">Loading 100 MCQ Assessment Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Head>
        <title>{assessment?.title || "100 MCQ Assessment"} | BlueBoxx</title>
      </Head>

      {/* Top Fixed Header */}
      <header className="bg-[#0d1635] text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-40 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/intern/assessments" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold">
            <ArrowLeft size={16} /> Exit
          </Link>
          <div className="h-5 w-[1px] bg-white/20" />
          <div>
            <h1 className="text-base font-black tracking-tight">{assessment?.title || "100 MCQ Internship Assessment"}</h1>
            <p className="text-xs text-blue-200">Total: {totalQuestions} Questions • {totalQuestions} Marks</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-white/10 rounded-lg">
            <span className={isSaving ? "text-amber-400 animate-pulse flex items-center gap-1" : "text-emerald-400 flex items-center gap-1"}>
              <CheckCircle2 size={13} /> {isSaving ? "Saving..." : "Auto-saved"}
            </span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Send size={14} /> Submit Assessment
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Question Area (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Question Card */}
          {currentQ ? (
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                {/* Question Metadata Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-[#1B2A6B] font-black text-xs rounded-lg border border-blue-200">
                      Question {currentQ.order || currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg">
                      {currentQ.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{currentQ.marks || 1} Mark</span>
                </div>

                {/* Question Text */}
                <h2 className="text-lg lg:text-xl font-bold text-[#0d1635] leading-relaxed mb-8">
                  {currentQ.question}
                </h2>

                {/* Options List */}
                <div className="space-y-3.5">
                  {[
                    { key: "A", text: currentQ.option_a },
                    { key: "B", text: currentQ.option_b },
                    { key: "C", text: currentQ.option_c },
                    { key: "D", text: currentQ.option_d },
                  ].map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectAnswer(currentQ.id, opt.key)}
                        className={`w-full text-left p-4 lg:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                          isSelected
                            ? "bg-blue-50/90 border-[#1B2A6B] ring-2 ring-[#1B2A6B]/20 shadow-sm"
                            : "bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#1B2A6B] text-white shadow-sm"
                            : "bg-white border border-slate-300 text-slate-600"
                        }`}>
                          {opt.key}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 pt-0.5 leading-relaxed">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons (Previous / Next / Submit) */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
                <div>
                  {answers[currentQ.id] ? (
                    <button
                      onClick={() => handleClearAnswer(currentQ.id)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={13} /> Clear Selection
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Select an option to answer</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      Submit Assessment <Send size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500">
              No questions found.
            </div>
          )}
        </div>

        {/* Right Column: Navigator & Progress (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Overall Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-black text-[#0d1635]">
                {answeredCount} <span className="text-sm text-slate-400 font-bold">/ {totalQuestions} Answered</span>
              </span>
              <span className="text-sm font-black text-emerald-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Answered: {answeredCount}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                <span>Remaining: {remainingCount}</span>
              </div>
            </div>
          </div>

          {/* 1-100 Question Grid Navigator */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0d1635] flex items-center gap-1.5">
                <Layers size={16} className="text-[#1B2A6B]" />
                Question Palette
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {questions.length} Questions
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-slate-100">
              {[
                { label: "All", count: categoryCounts["All"] || questions.length },
                { label: "Web Development", short: "Web Dev", count: categoryCounts["Web Development"] || 40 },
                { label: "Digital Marketing", short: "Marketing", count: categoryCounts["Digital Marketing"] || 30 },
                { label: "Graphic Designing", short: "Design", count: categoryCounts["Graphic Designing"] || 30 },
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setSelectedCategory(tab.label)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                    selectedCategory === tab.label
                      ? "bg-[#1B2A6B] text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  <span>{tab.short || tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === tab.label ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Grid numbers with scrollable container */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]);
                const isCurrent = idx === currentIndex;
                const isCategoryMatch = selectedCategory === "All" || q.category === selectedCategory;

                if (!isCategoryMatch) return null;

                return (
                  <button
                    key={q.id || `q-${q.order || idx + 1}`}
                    onClick={() => setCurrentIndex(idx)}
                    title={`Question ${q.order || idx + 1}: ${q.category} (${isAnswered ? "Answered: " + answers[q.id] : "Unanswered"})`}
                    className={`h-8 text-xs font-bold rounded-lg transition-all flex items-center justify-center relative ${
                      isCurrent
                        ? "bg-[#1B2A6B] text-white ring-2 ring-blue-400 font-black shadow-md scale-105 z-10"
                        : isAnswered
                        ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {q.order || idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Palette Legend */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1B2A6B]" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-100" />
                <span>Unanswered</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <div className="w-12 h-12 bg-blue-50 text-[#1B2A6B] rounded-2xl flex items-center justify-center mb-4">
                <Send size={24} />
              </div>
              <h3 className="text-xl font-black text-[#0d1635] mb-2">Submit Assessment?</h3>
              <p className="text-sm text-slate-500 mb-6">
                {remainingCount > 0 
                  ? `You currently have ${remainingCount} unanswered question${remainingCount === 1 ? "" : "s"}. Are you sure you want to submit? Once submitted, your score will be calculated immediately.`
                  : "You have answered all 100 questions! Are you ready to submit and calculate your final score?"}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Total Questions:</span>
                  <span className="font-bold text-[#0d1635]">{totalQuestions}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-emerald-600">Answered Questions:</span>
                  <span className="font-bold text-emerald-700">{answeredCount}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-amber-600">Unanswered Questions:</span>
                  <span className="font-bold text-amber-700">{remainingCount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Grading..." : "Confirm & Submit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
