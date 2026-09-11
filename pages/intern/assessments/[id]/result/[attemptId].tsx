import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { InternDashboardLayout } from "../../../../../src/layout/InternDashboardLayout";
import { 
  Trophy, CheckCircle2, XCircle, AlertCircle, 
  ArrowLeft, RotateCcw, CheckSquare, Sparkles, 
  ChevronDown, ChevronUp, Clock, HelpCircle, Layers
} from "lucide-react";
import { motion } from "framer-motion";
import { AssessmentService, AnswerReviewItem, AttemptItem } from "../../../../../src/lib/api/AssessmentService";
import toast from "react-hot-toast";

export default function AssessmentResultPage() {
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
      if (res.success) {
        setAttempt(res.data.attempt);
        setAnswers(res.data.answers);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load score result.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <InternDashboardLayout>
        <div className="max-w-5xl mx-auto py-20 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-500">Loading Assessment Scorecard...</p>
        </div>
      </InternDashboardLayout>
    );
  }

  if (!attempt) {
    return (
      <InternDashboardLayout>
        <div className="max-w-md mx-auto py-20 text-center">
          <AlertCircle size={40} className="mx-auto text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Result Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">Could not load this assessment attempt.</p>
          <Link href="/intern/assessments" className="px-5 py-2.5 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl">
            Back to Assessments
          </Link>
        </div>
      </InternDashboardLayout>
    );
  }

  const isPassed = attempt.percentage >= 50;
  const filteredAnswers = answers.filter((a) => {
    const matchCat = categoryFilter === "All" || a.category === categoryFilter;
    let matchStatus = true;
    if (statusFilter === "Correct") matchStatus = a.is_correct === true;
    if (statusFilter === "Wrong") matchStatus = a.is_correct === false;
    if (statusFilter === "Unanswered") matchStatus = a.selected_answer === null;
    return matchCat && matchStatus;
  });

  return (
    <InternDashboardLayout>
      <Head>
        <title>Assessment Result | {attempt.score}/100 | BlueBoxx</title>
      </Head>

      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/intern/assessments" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1B2A6B] transition-colors">
            <ArrowLeft size={16} /> Back to Assessments
          </Link>
          <span className="text-xs font-mono font-bold text-slate-400">Attempt ID: #{attempt.id}</span>
        </div>

        {/* Hero Scorecard Banner */}
        <div className="bg-gradient-to-br from-[#0d1635] via-[#1B2A6B] to-[#25398a] rounded-3xl p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-200 border border-white/10">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Assessment Completed</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                100 MCQ Assessment Result
              </h1>
              <p className="text-sm text-blue-100 max-w-md">
                Detailed performance scorecard across Web Development, Digital Marketing, and Graphic Designing.
              </p>
            </div>

            {/* Score Badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center min-w-[220px] shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Your Score</span>
              <div className="text-5xl font-black tracking-tight my-1 text-white">
                {attempt.score} <span className="text-xl font-bold text-blue-200">/ 100</span>
              </div>
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black mt-2">
                {attempt.percentage}% • {isPassed ? "PASSED" : "NEEDS IMPROVEMENT"}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0d1635]">{attempt.correct_answers}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correct Answers</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold">
              <XCircle size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0d1635]">{attempt.wrong_answers}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wrong Answers</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0d1635]">{attempt.unanswered}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unanswered</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        {attempt.category_scores && (
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black text-[#0d1635] mb-6 flex items-center gap-2">
              <Layers className="text-[#1B2A6B]" size={20} />
              Subject Performance Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(attempt.category_scores).map(([category, stats]: any) => {
                const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={category} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-[#0d1635]">{category}</h3>
                      <span className="text-xs font-black text-blue-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                      <div className="bg-[#1B2A6B] h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Score: <strong className="text-slate-800">{stats.score}/{stats.total}</strong></span>
                      <span>Correct: <strong className="text-emerald-600">{stats.correct}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question-by-Question Detailed Review */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
                <CheckSquare className="text-[#1B2A6B]" size={20} />
                Question Analysis & Review ({filteredAnswers.length})
              </h2>
              <p className="text-xs text-slate-500 font-medium">Review your answers against the official answer keys and explanations.</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl text-slate-700"
              >
                <option value="All">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Graphic Designing">Graphic Designing</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl text-slate-700"
              >
                <option value="All">All Results</option>
                <option value="Correct">Correct Only</option>
                <option value="Wrong">Wrong Only</option>
                <option value="Unanswered">Unanswered Only</option>
              </select>
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-6">
            {filteredAnswers.map((item) => {
              const isCorrect = item.is_correct === true;
              const isWrong = item.is_correct === false;
              const isUnanswered = item.selected_answer === null;

              return (
                <div
                  key={item.question_id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? "bg-emerald-50/40 border-emerald-200"
                      : isWrong
                      ? "bg-rose-50/40 border-rose-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#0d1635]">
                        Q{item.order}.
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 bg-white rounded-md border border-slate-200">
                        {item.category}
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isCorrect
                        ? "bg-emerald-100 text-emerald-800"
                        : isWrong
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {isCorrect && <CheckCircle2 size={12} />}
                      {isWrong && <XCircle size={12} />}
                      {isUnanswered && <AlertCircle size={12} />}
                      {isCorrect ? "+1 Mark" : isWrong ? "Wrong (0)" : "Unanswered (0)"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 mb-4">{item.question}</h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
                    {[
                      { key: "A", text: item.option_a },
                      { key: "B", text: item.option_b },
                      { key: "C", text: item.option_c },
                      { key: "D", text: item.option_d },
                    ].map((opt) => {
                      const isUserChoice = item.selected_answer === opt.key;
                      const isRealCorrect = item.correct_answer === opt.key;

                      let optStyle = "bg-white border-slate-200 text-slate-600";
                      if (isRealCorrect) {
                        optStyle = "bg-emerald-100/80 border-emerald-300 text-emerald-900 font-bold";
                      } else if (isUserChoice && !isRealCorrect) {
                        optStyle = "bg-rose-100/80 border-rose-300 text-rose-900 font-bold";
                      }

                      return (
                        <div key={opt.key} className={`p-3 rounded-xl border flex items-start gap-2 ${optStyle}`}>
                          <span className="font-bold shrink-0">{opt.key}.</span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {item.explanation && (
                    <div className="bg-white/80 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Explanation: </strong>
                      {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </InternDashboardLayout>
  );
}
