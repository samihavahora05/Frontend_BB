import Link from 'next/link';
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  CheckSquare, Search, Filter, Trophy, CheckCircle2, 
  XCircle, Clock, Eye, AlertCircle, RefreshCw, X 
} from "lucide-react";
import { AssessmentService, AttemptItem } from "../../../src/lib/api/AssessmentService";
import toast from "react-hot-toast";

export default function AdminAssessmentsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadResults();
  }, [search]);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      const res = await AssessmentService.getAdminResults({ search });
      if (res.success) {
        setAttempts(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load intern assessment results.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (attemptId: number) => {
    try {
      setDetailLoading(true);
      const res = await AssessmentService.getAdminAttemptDetail(attemptId);
      if (res.success) {
        setSelectedAttempt(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load attempt details.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Intern Assessments Monitoring | BlueBoxx Admin</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <CheckSquare className="text-[#1B2A6B]" size={26} />
              Intern 100 MCQ Assessments
            </h1>
            <p className="text-xs text-slate-500 font-medium">Monitor intern test scores, completion rates, and answer key performance.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/assessments/questions"
              className="px-4 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckSquare size={14} /> Manage Questions in Database
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search intern name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 w-64"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-sm font-bold text-[#0d1635]">Candidate Attempt Submissions</h2>
            <span className="text-xs font-bold text-slate-400">{attempts.length} Records</span>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm font-semibold">
              No assessment attempts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-50/40">
                    <th className="px-6 py-3 font-bold">Intern</th>
                    <th className="px-6 py-3 font-bold">Assessment</th>
                    <th className="px-6 py-3 font-bold">Score</th>
                    <th className="px-6 py-3 font-bold">Percentage</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold">Submitted Date</th>
                    <th className="px-6 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => {
                    const u = att.user || {};
                    const fullName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Intern User';
                    return (
                      <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#0d1635] text-sm">{fullName}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">100 MCQ Assessment</td>
                        <td className="px-6 py-4 font-black text-[#0d1635]">
                          {att.status === 'completed' ? `${att.score} / 100` : '-'}
                        </td>
                        <td className="px-6 py-4 font-black">
                          {att.status === 'completed' ? (
                            <span className={att.percentage >= 50 ? "text-emerald-600" : "text-amber-600"}>
                              {att.percentage}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            att.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {att.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                          {att.submitted_at 
                            ? new Date(att.submitted_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleViewDetail(att.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#1B2A6B] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                          >
                            <Eye size={13} /> View Breakdown
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-[#0d1635]">
                  Candidate Attempt Report (#{selectedAttempt.attempt?.id})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedAttempt.attempt?.user?.name} • {selectedAttempt.attempt?.user?.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                <p className="text-xl font-black text-[#0d1635]">{selectedAttempt.attempt?.score}/100</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl text-center border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-600">Correct</span>
                <p className="text-xl font-black text-emerald-700">{selectedAttempt.attempt?.correct_answers}</p>
              </div>
              <div className="bg-rose-50 p-3 rounded-xl text-center border border-rose-100">
                <span className="text-[10px] uppercase font-bold text-rose-600">Wrong</span>
                <p className="text-xl font-black text-rose-700">{selectedAttempt.attempt?.wrong_answers}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl text-center border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-600">Unanswered</span>
                <p className="text-xl font-black text-amber-700">{selectedAttempt.attempt?.unanswered}</p>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {selectedAttempt.answers?.map((ans: any) => (
                <div key={ans.question_id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#0d1635]">Q{ans.order}. [{ans.category}]</span>
                    <span className={`font-bold ${ans.is_correct ? 'text-emerald-600' : ans.selected_answer ? 'text-rose-600' : 'text-amber-600'}`}>
                      {ans.is_correct ? '✓ Correct (+1)' : ans.selected_answer ? `✗ Wrong (Selected: ${ans.selected_answer}, Correct: ${ans.correct_answer})` : 'Unanswered'}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold mb-2">{ans.question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
