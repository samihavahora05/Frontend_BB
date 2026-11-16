import Link from 'next/link';
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  CheckSquare, Search, Filter, Trophy, CheckCircle2, 
  XCircle, Clock, Eye, AlertCircle, RefreshCw, X, Video, ExternalLink,
  Download, FileCheck, Check, Send
} from "lucide-react";
import { AssessmentService, AttemptItem } from "../../../src/lib/api/AssessmentService";
import toast from "react-hot-toast";

export default function AdminAssessmentsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [stats, setStats] = useState<{ total_completed: number; qualified_30_plus: number; not_qualified: number }>({
    total_completed: 0,
    qualified_30_plus: 0,
    not_qualified: 0,
  });
  const [filterTab, setFilterTab] = useState<"all" | "qualified" | "not_qualified">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadResults();
  }, [search, filterTab]);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      const params: any = { search };
      if (filterTab !== "all") {
        params.filter = filterTab;
      }
      const res = await AssessmentService.getAdminResults(params);
      if (res.success) {
        setAttempts(res.data.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
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

  const handleDownloadAppointment = async (attemptId: number) => {
    try {
      setActionLoading(true);
      await AssessmentService.downloadSignedAppointmentLetter(attemptId);
      toast.success("Appointment Letter downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to download Appointment Letter PDF.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendInterview = async (attemptId: number) => {
    const customLink = prompt("Enter specific Google Meet link (leave blank to auto-generate):");
    if (customLink === null) return;

    try {
      setActionLoading(true);
      const res = await AssessmentService.resendInterview(attemptId, { meet_link: customLink.trim() || undefined });
      if (res.success) {
        toast.success(res.message || "Interview link updated and resent via Email & WhatsApp!");
        handleViewDetail(attemptId);
        loadResults();
      } else {
        toast.error(res.message || "Failed to update interview.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to resend interview.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveInternship = async (attemptId: number) => {
    if (!confirm("Are you sure you want to approve this candidate's internship and send the official Offer Letter via email?")) {
      return;
    }
    try {
      setActionLoading(true);
      const res = await AssessmentService.approveInternship(attemptId);
      if (res.success) {
        toast.success(res.message || "Internship approved & Offer Letter mailed!");
        // Refresh detail
        handleViewDetail(attemptId);
        loadResults();
      } else {
        toast.error(res.message || "Approval failed.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Approval failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendInterview = async (attemptId: number) => {
    const customLink = prompt("Enter specific Google Meet link (leave blank to auto-generate):");
    if (customLink === null) return;

    try {
      setActionLoading(true);
      const res = await AssessmentService.resendInterview(attemptId, { meet_link: customLink.trim() || undefined });
      if (res.success) {
        toast.success(res.message || "Interview link updated and resent via Email & WhatsApp!");
        handleViewDetail(attemptId);
        loadResults();
      } else {
        toast.error(res.message || "Failed to update interview.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to resend interview.");
    } finally {
      setActionLoading(false);
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
              Intern 50 MCQ Assessments
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

        {/* Stats & Filter Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setFilterTab("all")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterTab === "all"
                ? "bg-white border-[#1B2A6B] shadow-md ring-2 ring-[#1B2A6B]/20"
                : "bg-white/60 hover:bg-white border-slate-200"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Completed</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-[#0d1635]">{stats.total_completed}</span>
              <span className="text-xs font-bold text-slate-500">All Attempts</span>
            </div>
          </button>

          <button
            onClick={() => setFilterTab("qualified")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterTab === "qualified"
                ? "bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                : "bg-white hover:bg-emerald-50/30 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Qualified for Interview (30+ Marks)</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-emerald-700">{stats.qualified_30_plus}</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Pass (≥ 30)</span>
            </div>
          </button>

          <button
            onClick={() => setFilterTab("not_qualified")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterTab === "not_qualified"
                ? "bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20"
                : "bg-white hover:bg-amber-50/30 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Under 30 Marks</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-amber-700">{stats.not_qualified}</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Fail (&lt; 30)</span>
            </div>
          </button>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-[#0d1635]">
                {filterTab === "qualified" ? "Qualified Interns (30+ Marks) - Ready for Interview" : filterTab === "not_qualified" ? "Candidate Attempts (< 30 Marks)" : "Candidate Attempt Submissions"}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Interns with 30+ marks qualify for automatic interview scheduling</p>
            </div>
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
                    <th className="px-6 py-3 font-bold">Result (30+ Pass)</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                    <th className="px-6 py-3 font-bold">Google Meet Link</th>
                    <th className="px-6 py-3 font-bold">Submitted Date</th>
                    <th className="px-6 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => {
                    const u = att.user || {};
                    const fullName = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Intern User';
                    const isPassed = att.score >= 30;
                    return (
                      <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#0d1635] text-sm">{fullName}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                          {u.phone && <p className="text-[11px] text-slate-400 font-mono">{u.phone}</p>}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">50 MCQ Assessment</td>
                        <td className="px-6 py-4 font-black text-[#0d1635]">
                          {att.status === 'completed' ? `${att.score} / ${att.assessment?.total_marks || 50}` : '-'}
                        </td>
                        <td className="px-6 py-4 font-black">
                          {att.status === 'completed' ? (
                            isPassed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                                <CheckCircle2 size={13} /> Passed (Interview Ready)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-full">
                                <XCircle size={13} /> Not Qualified (&lt; 30)
                              </span>
                            )
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
                        <td className="px-6 py-4">
                          {att.meet_link ? (
                            <a
                              href={att.meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
                            >
                              <Video size={12} /> Join Meet <ExternalLink size={10} />
                            </a>
                          ) : isPassed ? (
                            <span className="text-[11px] text-slate-400 font-medium">Link Generated</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
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

            {/* Internship Approval & E-Sign Pipeline Banner */}
            <div className="mb-6 p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCheck size={18} className="text-[#1B2A6B]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#0d1635]">Internship Approval & Appointment Status</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {selectedAttempt.is_signed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                        <Check size={12} /> Appointment Letter E-Signed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                        <AlertCircle size={12} /> Candidate Has Not E-Signed Yet
                      </span>
                    )}

                    {selectedAttempt.is_approved ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                        <CheckCircle2 size={12} /> Internship Approved & Offer Letter Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">
                        Pending Approval
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleResendInterview(selectedAttempt.attempt?.id)}
                    disabled={actionLoading}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Video size={14} /> Resend / Update Meet Link
                  </button>

                  {selectedAttempt.is_signed && (
                    <button
                      onClick={() => handleDownloadAppointment(selectedAttempt.attempt?.id)}
                      disabled={actionLoading}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-[#1B2A6B] border border-[#1B2A6B]/30 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Download size={14} /> Download Signed PDF
                    </button>
                  )}

                  {!selectedAttempt.is_approved ? (
                    <button
                      onClick={() => handleApproveInternship(selectedAttempt.attempt?.id)}
                      disabled={actionLoading || !selectedAttempt.is_signed}
                      title={!selectedAttempt.is_signed ? "Candidate must E-sign appointment letter before approval" : ""}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-md ${
                        selectedAttempt.is_signed 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Send size={14} /> Approve Internship & Mail Offer Letter
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                      ✓ Approved & Active
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                <p className="text-xl font-black text-[#0d1635]">{selectedAttempt.attempt?.score}/{selectedAttempt.attempt?.assessment?.total_marks || 50}</p>
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
