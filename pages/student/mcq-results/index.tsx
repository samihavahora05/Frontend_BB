import React, { useState, useEffect } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Award, CheckCircle2, XCircle, Calendar, RefreshCw, BarChart2, Check, X } from "lucide-react";
import api from "../../../src/lib/axios";

interface MCQResult {
  id: number;
  test_title?: string;
  quiz_title?: string;
  test_name?: string;
  course_name?: string;
  course?: { title: string };
  date?: string;
  completed_at?: string;
  created_at?: string;
  total_questions?: number;
  attempted?: number;
  correct?: number;
  incorrect?: number;
  score?: number;
  total_marks?: number;
  percentage?: number;
  is_passed?: boolean;
  status?: string;
  attempt_number?: number;
}

export default function StudentMCQResultsPage() {
  const [results, setResults] = useState<MCQResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      let response;
      try {
        response = await api.get("/student/mcq-results");
      } catch {
        response = await api.get("/student/quiz-results");
      }
      const rawData = response?.data?.data?.data || response?.data?.data || response?.data || [];
      const list = Array.isArray(rawData) ? rawData : [];

      const parsed = list.map((item: any) => {
        const totalQ = item.total_questions || item.total_marks || (item.correct + item.incorrect) || 0;
        const correctQ = item.correct || item.score || 0;
        const percentageVal = item.percentage ?? (totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0);
        const passed = item.is_passed ?? item.passed ?? (percentageVal >= 50);

        return {
          id: item.id,
          test_title: item.test_title || item.quiz_title || item.test_name || item.title || "MCQ Quiz",
          course_name: item.course_name || item.course?.title || "Course Test",
          date: item.completed_at || item.created_at ? new Date(item.completed_at || item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A",
          total_questions: totalQ,
          attempted: item.attempted || (item.correct + item.incorrect) || totalQ,
          correct: correctQ,
          incorrect: item.incorrect ?? Math.max(0, totalQ - correctQ),
          score: item.score || correctQ,
          percentage: percentageVal,
          is_passed: passed,
          attempt_number: item.attempt_number || item.attempt || 1,
        };
      });

      setResults(parsed);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const totalTests = results.length;
  const passedTests = results.filter(r => r.is_passed).length;
  const avgPercentage = totalTests > 0 ? Math.round(results.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalTests) : 0;

  return (
    <StudentDashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">MCQ Test Results</h1>
          <p className="text-slate-500 text-sm font-medium">Review your assessment scores, accuracy, and test performance.</p>
        </div>
        <button
          onClick={fetchResults}
          disabled={isLoading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-[#1B2A6B]" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Tests Attempted", value: totalTests, color: "text-blue-600", bg: "bg-blue-50", icon: BarChart2 },
          { label: "Passed Assessments", value: passedTests, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
          { label: "Average Score", value: `${avgPercentage}%`, color: "text-amber-600", bg: "bg-amber-50", icon: Award },
        ].map((s, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Results Table / Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-100 p-5 h-20 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Assessment & Course</th>
                  <th className="px-6 py-4">Attempt Date</th>
                  <th className="px-6 py-4 text-center">Score / Breakdown</th>
                  <th className="px-6 py-4 text-center">Percentage</th>
                  <th className="px-6 py-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {results.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-black text-slate-800 text-base">{r.test_title}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">{r.course_name} • Attempt #{r.attempt_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        {r.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-3 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                        <span className="text-emerald-600 flex items-center gap-0.5"><Check size={12} /> {r.correct} Correct</span>
                        <span className="text-rose-500 flex items-center gap-0.5"><X size={12} /> {r.incorrect} Wrong</span>
                        <span className="text-slate-400">/ {r.total_questions} Total</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-slate-800 text-base">
                      {r.percentage}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.is_passed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} /> PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-black rounded-full border border-rose-200">
                          <XCircle size={12} /> FAILED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
            <Award size={24} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-1">No MCQ tests completed yet</h3>
          <p className="text-slate-500 text-sm max-w-sm">
            Complete course quizzes and module assessments to view your scores here.
          </p>
        </div>
      )}
    </StudentDashboardLayout>
  );
}
