import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { 
  CheckSquare, Clock, Award, BookOpen, AlertCircle, 
  ChevronRight, Play, CheckCircle2, XCircle, RotateCcw, 
  Layers, Sparkles, Trophy, HelpCircle, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { AssessmentService, AssessmentItem, AttemptItem } from "../../../src/lib/api/AssessmentService";
import toast from "react-hot-toast";

export default function InternAssessmentsPage() {
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
      const [assessRes, historyRes] = await Promise.all([
        AssessmentService.getAssessments(),
        AssessmentService.getHistory(),
      ]);
      if (assessRes?.data) setAssessments(assessRes.data);
      if (historyRes?.data) setHistory(historyRes.data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load assessments data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InternDashboardLayout>
      <Head>
        <title>MCQ Assessments | Intern Portal | BlueBoxx</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#2a3f9d] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 mb-4 border border-white/10">
              <Sparkles size={14} className="text-yellow-400" />
              <span>Skill Verification & Benchmark</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">
              Intern Assessment Center
            </h1>
            <p className="text-blue-100 text-sm lg:text-base leading-relaxed">
              Validate your technical expertise across industry core tracks: Web Development, Digital Marketing, and Graphic Designing. Complete assessments to earn verified performance ratings and accelerate your career.
            </p>
          </div>
        </div>

        {/* Available Assessments Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1635] flex items-center gap-2">
                <CheckSquare className="text-[#1B2A6B]" size={22} />
                Available Assessments
              </h2>
              <p className="text-xs text-slate-500 font-medium">Standardized tests curated for internship certification.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse h-64" />
              ))}
            </div>
          ) : assessments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <AlertCircle size={40} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No active assessments found</h3>
              <p className="text-sm text-slate-500">Assessments will appear here once published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {assessments.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                            100 MCQs • 100 Marks
                          </span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1">
                            <Clock size={12} /> {item.duration_minutes || 120} Minutes
                          </span>
                          {item.best_score !== undefined && item.best_score !== null && (
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-full flex items-center gap-1">
                              <Trophy size={12} /> Best: {item.best_score}/100 ({item.best_percentage}%)
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-black text-[#0d1635] mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
                        <Link
                          href={`/intern/assessments/${item.id}/take`}
                          className="px-6 py-3.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          {item.has_active_attempt ? (
                            <>
                              <RotateCcw size={16} /> Resume Assessment
                            </>
                          ) : (
                            <>
                              <Play size={16} /> Start Assessment
                            </>
                          )}
                        </Link>
                      </div>
                    </div>

                    {/* Category Breakdown Cards */}
                    <div className="pt-6">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                        Assessment Syllabus & Weightage Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Track 1</span>
                            <h5 className="text-sm font-bold text-[#0d1635]">Web Development</h5>
                            <p className="text-xs text-slate-500 font-medium">HTML, CSS, JS, React, REST APIs, SQL</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-[#0d1635]">35</span>
                            <p className="text-[10px] font-semibold text-slate-400">Questions</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Track 2</span>
                            <h5 className="text-sm font-bold text-[#0d1635]">Digital Marketing</h5>
                            <p className="text-xs text-slate-500 font-medium">SEO, PPC, Social Ads, GA4, Funnels</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-[#0d1635]">35</span>
                            <p className="text-[10px] font-semibold text-slate-400">Questions</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">Track 3</span>
                            <h5 className="text-sm font-bold text-[#0d1635]">Graphic Designing</h5>
                            <p className="text-xs text-slate-500 font-medium">Color, Typography, UI/UX, Vector/Raster</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-[#0d1635]">30</span>
                            <p className="text-[10px] font-semibold text-slate-400">Questions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Attempt History Section */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1635] flex items-center gap-2">
                <Trophy className="text-amber-500" size={22} />
                Your Assessment History
              </h2>
              <p className="text-xs text-slate-500 font-medium">Permanent record of all your assessment attempts and score reports.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-slate-400">You haven't completed any assessments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-bold">Attempt ID</th>
                    <th className="pb-3 font-bold">Assessment</th>
                    <th className="pb-3 font-bold">Date</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Score</th>
                    <th className="pb-3 font-bold">Percentage</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 font-mono text-xs font-bold text-slate-500">#{att.id}</td>
                      <td className="py-4 font-bold text-[#0d1635]">100 MCQ Assessment</td>
                      <td className="py-4 text-xs text-slate-500 font-medium">
                        {att.submitted_at 
                          ? new Date(att.submitted_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : new Date(att.started_at).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          att.status === 'completed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {att.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-[#0d1635]">
                        {att.status === 'completed' ? `${att.score} / 100` : '-'}
                      </td>
                      <td className="py-4 font-black">
                        {att.status === 'completed' ? (
                          <span className={att.percentage >= 50 ? "text-emerald-600" : "text-amber-600"}>
                            {att.percentage}%
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-4 text-right">
                        {att.status === 'completed' ? (
                          <Link
                            href={`/intern/assessments/${att.assessment_id}/result/${att.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-[#1B2A6B] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-all"
                          >
                            View Scorecard <ChevronRight size={14} />
                          </Link>
                        ) : (
                          <Link
                            href={`/intern/assessments/${att.assessment_id}/take`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all"
                          >
                            Resume <ChevronRight size={14} />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </InternDashboardLayout>
  );
}
