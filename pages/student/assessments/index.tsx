import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { 
  CheckSquare, Clock, Award, BookOpen, AlertCircle, 
  ChevronRight, Play, CheckCircle2, XCircle, RotateCcw, 
  Layers, Sparkles, Trophy, HelpCircle, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { AssessmentService, AssessmentItem, AttemptItem } from "../../../src/lib/api/AssessmentService";
import itSkillsData from "../../../src/data/itSkillsAssessment50.json";
import toast from "react-hot-toast";

export default function StudentAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [history, setHistory] = useState<AttemptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [assessRes, historyRes] = await Promise.allSettled([
        AssessmentService.getAssessments(),
        AssessmentService.getHistory(),
      ]);

      let items: AssessmentItem[] = [];
      if (assessRes.status === "fulfilled" && assessRes.value?.data?.length > 0) {
        items = assessRes.value.data;
      }

      // If backend didn't return the 50 MCQ assessment, add fallback
      if (items.length === 0) {
        items = [
          {
            id: 1,
            title: itSkillsData.title || "Common IT & Digital Skills Assessment",
            slug: "blueboxx-common-it-digital-skills-50",
            description: "Assess and benchmark your core skills in Computer Fundamentals, Networking, Web Dev, Cybersecurity, UI/UX, Digital Marketing, and AI.",
            total_questions: itSkillsData.totalQuestions || 50,
            total_marks: itSkillsData.totalMarks || 50,
            passing_percentage: 50,
            duration_minutes: itSkillsData.durationMinutes || 40,
            category_breakdown: [
              { category: "Computer Fundamentals", count: 8, marks: 8 },
              { category: "Internet & Networking", count: 7, marks: 7 },
              { category: "Programming & Web Development", count: 8, marks: 8 },
              { category: "Cybersecurity", count: 7, marks: 7 },
              { category: "Graphic Designing & UI/UX", count: 7, marks: 7 },
              { category: "Digital Marketing", count: 7, marks: 7 },
              { category: "AI & Emerging Technologies", count: 6, marks: 6 },
            ],
            has_active_attempt: false,
            total_attempts: 0,
          }
        ];
      }
      setAssessments(items);

      if (historyRes.status === "fulfilled" && historyRes.value?.data) {
        setHistory(historyRes.value.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load assessments data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentDashboardLayout>
      <Head>
        <title>MCQ Assessments | Student Portal | BlueBoxx</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#2a3f9d] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 mb-4 border border-white/10">
              <Sparkles size={14} className="text-[#C9A227]" />
              <span>Skill Verification & Benchmark</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">
              Student Assessment Center
            </h1>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Take comprehensive MCQ assessments to benchmark your skills, highlight strengths on your profile, and qualify for top internship & placement opportunities.
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-20 bg-slate-100 rounded-xl"></div>
                <div className="h-10 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Available Assessments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Available MCQ Assessments</h2>
                  <p className="text-xs text-slate-500">Official BlueBoxx standardized assessment modules</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-[#1B2A6B] rounded-full border border-blue-100">
                  {assessments.length} Test{assessments.length > 1 ? "s" : ""} Available
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assessments.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                          <CheckSquare size={13} />
                          {item.total_questions} Questions
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                          <Clock size={13} />
                          {item.duration_minutes} Mins
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                          <Award size={13} />
                          Passing: {item.passing_percentage}%
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-black text-slate-900 mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      {/* Category Breakdown Chips */}
                      {item.category_breakdown && item.category_breakdown.length > 0 && (
                        <div className="mb-6">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <Layers size={13} /> Topics Covered
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.category_breakdown.map((cat, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-lg"
                              >
                                {cat.category} ({cat.count} Qs)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Attempt stats if available */}
                      {item.total_attempts > 0 && (
                        <div className="bg-slate-50 rounded-2xl p-3.5 mb-6 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Your Best Score</p>
                            <p className="text-base font-black text-slate-800">
                              {item.best_score ?? 0} / {item.total_marks} ({item.best_percentage ?? 0}%)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Total Attempts</p>
                            <p className="text-base font-black text-slate-800">{item.total_attempts}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-slate-100 mt-auto">
                      {item.has_active_attempt ? (
                        <Link
                          href={`/student/assessments/${item.id}/take`}
                          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#C9A227] hover:bg-[#b08d20] text-[#0d1635] text-sm font-black rounded-xl transition-all shadow-md"
                        >
                          <Play size={16} fill="currentColor" /> Resume Assessment
                        </Link>
                      ) : (
                        <Link
                          href={`/student/assessments/${item.id}/take`}
                          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-black rounded-xl transition-all shadow-md group"
                        >
                          <span>{item.total_attempts > 0 ? "Retake Assessment" : "Start 50 MCQ Assessment"}</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Test Instructions Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#1B2A6B]" /> Assessment Instructions & Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">⏱️ 40 Minutes Duration</p>
                  <p>The timer runs automatically. Make sure to complete and submit before the clock expires.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">✅ 1 Mark Per Question</p>
                  <p>Each question carries 1 mark. Total score is evaluated out of 50 marks.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">🎯 No Negative Marking</p>
                  <p>Attempt all questions without penalty. You can change answers anytime before submission.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">💾 Auto-Save Progress</p>
                  <p>Your answers are saved automatically as you select them, so you never lose your progress.</p>
                </div>
              </div>
            </div>

            {/* Past Attempts History */}
            {history.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Your Attempt History</h2>
                    <p className="text-xs text-slate-500">Track and review past assessment results</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Assessment</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Score</th>
                          <th className="px-6 py-4">Accuracy</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {history.map((att) => {
                          const isPassed = (att.percentage || 0) >= 50;
                          return (
                            <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-black text-slate-800">
                                Common IT & Digital Skills Assessment
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                {new Date(att.started_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </td>
                              <td className="px-6 py-4 font-black text-slate-800">
                                {att.score} / {att.total_questions}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-600">
                                {att.percentage}%
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  isPassed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                }`}>
                                  {isPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                  {isPassed ? "Passed" : "Needs Improvement"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Link
                                  href={`/student/assessments/${att.assessment_id}/result/${att.id}`}
                                  className="text-xs font-bold text-[#1B2A6B] hover:underline"
                                >
                                  View Scorecard →
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </StudentDashboardLayout>
  );
}
