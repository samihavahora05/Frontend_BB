import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { StudentDashboardLayout } from "../../../../../src/layout/StudentDashboardLayout";
import { 
  Trophy, CheckCircle2, XCircle, AlertCircle, 
  ArrowLeft, RotateCcw, CheckSquare, Sparkles, 
  ChevronDown, ChevronUp, Clock, HelpCircle, Layers
} from "lucide-react";
import { motion } from "framer-motion";
import { AssessmentService, AnswerReviewItem, AttemptItem } from "../../../../../src/lib/api/AssessmentService";
import toast from "react-hot-toast";

export default function StudentAssessmentResultPage() {
  const router = useRouter();
  const { id, attemptId } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState<AttemptItem | null>(null);
  const [answers, setAnswers] = useState<AnswerReviewItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (id && attemptId) {
      loadResult();
    }
  }, [id, attemptId]);

  const loadResult = async () => {
    try {
      setIsLoading(true);
      const res = await AssessmentService.getResult(id as string, attemptId as string);
      if (res && res.success) {
        setAttempt(res.data.attempt);
        setAnswers(res.data.answers);
      } else {
        throw new Error("Unable to fetch result from API");
      }
    } catch (err: any) {
      console.warn("Checking sessionStorage for attempt result:", err);
      try {
        const stored = sessionStorage.getItem(`bb_attempt_result_${attemptId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setAttempt(parsed.attempt);
          setAnswers(parsed.answers);
          return;
        }
      } catch (storageErr) {
        // ignore
      }
      toast.error(err.response?.data?.message || "Failed to load score result.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <StudentDashboardLayout>
        <div className="max-w-5xl mx-auto py-20 text-center">
          <div className="w-12 h-12 border-4 border-[#1B2A6B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-500">Loading Assessment Scorecard...</p>
        </div>
      </StudentDashboardLayout>
    );
  }

  if (!attempt) {
    return (
      <StudentDashboardLayout>
        <div className="max-w-md mx-auto py-20 text-center">
          <AlertCircle size={40} className="mx-auto text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Result Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">Could not load this assessment attempt.</p>
          <Link href="/student/assessments" className="px-5 py-2.5 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl">
            Back to Assessments
          </Link>
        </div>
      </StudentDashboardLayout>
    );
  }

  const isPassed = (attempt.percentage ?? 0) >= 50;

  // Categories list
  const categories = ["All", ...Array.from(new Set(answers.map((a) => a.category).filter(Boolean)))];

  // Filtered review items
  const filteredAnswers = answers.filter((a) => {
    const matchCat = categoryFilter === "All" || a.category === categoryFilter;
    let matchStatus = true;
    if (statusFilter === "correct") matchStatus = a.is_correct === true;
    if (statusFilter === "wrong") matchStatus = a.is_correct === false;
    if (statusFilter === "unanswered") matchStatus = !a.selected_answer;
    return matchCat && matchStatus;
  });

  return (
    <StudentDashboardLayout>
      <Head>
        <title>Assessment Result | Student Portal | BlueBoxx</title>
      </Head>

      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <Link href="/student/assessments" className="flex items-center gap-1 hover:text-[#1B2A6B]">
            <ArrowLeft size={13} /> Assessment Center
          </Link>
          <span>/</span>
          <span className="text-slate-800">Scorecard & Detailed Review</span>
        </div>

        {/* Score Banner Hero */}
        <div className={`rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl ${
          isPassed 
            ? "bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#164e63]" 
            : "bg-gradient-to-r from-[#0d1635] via-[#334155] to-[#475569]"
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/10 border border-white/10">
                <Sparkles size={14} className="text-[#C9A227]" />
                <span>Common IT & Digital Skills Assessment</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black">
                {isPassed ? "🎉 Assessment Passed!" : "Assessment Completed"}
              </h1>
              <p className="text-blue-100 text-xs md:text-sm max-w-xl">
                {isPassed 
                  ? "Great job! You achieved the required benchmark. Review your answers below to strengthen your subject knowledge." 
                  : "You didn't reach the 50% passing threshold this time. Review the solution explanations below and retake the test anytime."}
              </p>
            </div>

            {/* Circular / Badge Score */}
            <div className="flex items-center gap-6 shrink-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Total Score</p>
                <p className="text-4xl font-black text-white mt-1">
                  {attempt.score} <span className="text-lg text-blue-200 font-bold">/ {attempt.total_questions}</span>
                </p>
                <p className="text-xs font-black text-[#C9A227] mt-1">{attempt.percentage}% Accuracy</p>
              </div>

              <div className="border-l border-white/10 pl-6 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 size={14} /> {attempt.correct_answers} Correct
                </div>
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <XCircle size={14} /> {attempt.wrong_answers} Incorrect
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <AlertCircle size={14} /> {attempt.unanswered} Skipped
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Pills */}
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                statusFilter === "All"
                  ? "bg-[#1B2A6B] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              All ({answers.length})
            </button>
            <button
              onClick={() => setStatusFilter("correct")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                statusFilter === "correct"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              Correct ({attempt.correct_answers})
            </button>
            <button
              onClick={() => setStatusFilter("wrong")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                statusFilter === "wrong"
                  ? "bg-rose-600 text-white"
                  : "bg-white border border-slate-200 text-rose-700 hover:bg-rose-50"
              }`}
            >
              Incorrect ({attempt.wrong_answers})
            </button>
            <button
              onClick={() => setStatusFilter("unanswered")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                statusFilter === "unanswered"
                  ? "bg-slate-700 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Skipped ({attempt.unanswered})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/student/assessments/${id}/take`}
              className="flex items-center gap-2 px-4 py-2 bg-[#C9A227] hover:bg-[#b08d20] text-[#0d1635] text-xs font-black rounded-xl transition-all shadow-sm"
            >
              <RotateCcw size={14} /> Retake Assessment
            </Link>
            <Link
              href="/student/assessments"
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Assessment Center
            </Link>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-400 shrink-0">Filter Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Review Questions List */}
        <div className="space-y-4">
          {filteredAnswers.map((item, idx) => {
            const isCorrect = item.is_correct === true;
            const isUnanswered = !item.selected_answer;

            return (
              <div
                key={item.question_id || idx}
                className={`bg-white rounded-3xl p-6 md:p-8 border shadow-sm transition-all ${
                  isCorrect
                    ? "border-emerald-200"
                    : isUnanswered
                    ? "border-slate-200"
                    : "border-rose-200"
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      Q{item.order || (idx + 1)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {item.category}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isCorrect
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isUnanswered
                      ? "bg-slate-100 text-slate-600 border border-slate-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}>
                    {isCorrect ? <CheckCircle2 size={13} /> : isUnanswered ? <AlertCircle size={13} /> : <XCircle size={13} />}
                    {isCorrect ? "Correct (+1 Mark)" : isUnanswered ? "Not Attempted (0 Marks)" : "Incorrect (0 Marks)"}
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-base font-black text-slate-800 mb-5 leading-relaxed">
                  {item.question}
                </h3>

                {/* Options List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {[
                    { key: "A", label: item.option_a },
                    { key: "B", label: item.option_b },
                    { key: "C", label: item.option_c },
                    { key: "D", label: item.option_d },
                  ].map((opt) => {
                    const isUserChoice = item.selected_answer === opt.key;
                    const isRightAnswer = item.correct_answer === opt.key;

                    let cardClass = "bg-slate-50 border-slate-200 text-slate-700";
                    let badgeClass = "bg-slate-200 text-slate-700";

                    if (isRightAnswer) {
                      cardClass = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-1 ring-emerald-300";
                      badgeClass = "bg-emerald-600 text-white";
                    } else if (isUserChoice && !isCorrect) {
                      cardClass = "bg-rose-50 border-rose-300 text-rose-900 line-through opacity-80";
                      badgeClass = "bg-rose-600 text-white";
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs leading-snug ${cardClass}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black shrink-0 ${badgeClass}`}>
                          {opt.key}
                        </span>
                        <div className="flex-1 pt-0.5">
                          <span>{opt.label}</span>
                          {isRightAnswer && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black text-emerald-700">
                              ✓ Correct Answer
                            </span>
                          )}
                          {isUserChoice && !isRightAnswer && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black text-rose-700">
                              ✗ Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-2.5">
                    <Sparkles size={16} className="text-[#1B2A6B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Reference Note:</span>
                      <p className="text-slate-700 leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StudentDashboardLayout>
  );
}
