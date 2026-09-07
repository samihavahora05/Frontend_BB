import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import {
  Briefcase, Calendar, CheckCircle2, Clock,
  XCircle, ChevronDown, Plus, ExternalLink,
  FileText, TrendingUp, Trophy, Code, Download,
  ShieldCheck, PenTool, Award
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../src/lib/axios";

type AppStatus = "submitted" | "applied" | "review" | "interview" | "approved" | "rejected";

interface TimelineStep {
  step: string;
  date: string;
  done: boolean;
}

interface Application {
  id: string;
  rawId?: number;
  title: string;
  type: string;
  appliedDate: string;
  status: AppStatus;
  timeline: TimelineStep[];
  notes?: string;
  link: string;
  termsAccepted?: boolean;
  termsVersion?: string;
  signatureUrl?: string;
  rejectionReason?: string;
  hasAppointmentLetter?: boolean;
}

const STATUS_STYLES: Record<string, { label: string; pill: string; border: string }> = {
  submitted: { label: "Submitted", pill: "bg-blue-50 text-blue-700 font-extrabold", border: "border-blue-200" },
  applied:   { label: "Applied",   pill: "bg-blue-50 text-blue-700 font-extrabold", border: "border-blue-200" },
  review:    { label: "In Review", pill: "bg-amber-50 text-amber-700 font-extrabold", border: "border-amber-200" },
  interview: { label: "Interview / Shortlist", pill: "bg-purple-50 text-purple-700 font-extrabold", border: "border-purple-200" },
  approved:  { label: "Approved",  pill: "bg-emerald-50 text-emerald-700 font-black border border-emerald-300", border: "border-emerald-400" },
  offer:     { label: "Approved",  pill: "bg-emerald-50 text-emerald-700 font-black border border-emerald-300", border: "border-emerald-400" },
  rejected:  { label: "Rejected",  pill: "bg-red-50 text-red-600 font-extrabold", border: "border-red-200" },
};

export default function ApplicationsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const router = useRouter();
  const { status: statusQuery } = router.query;

  React.useEffect(() => {
    if (statusQuery && typeof statusQuery === "string") {
      const q = statusQuery.toLowerCase();
      if (["submitted", "applied", "review", "interview", "approved", "rejected"].includes(q)) {
        setFilter(q);
      }
    }
  }, [statusQuery]);

  const loadApplications = () => {
    api.get("/student/all-applications")
      .then((res) => {
        const rawList = res.data?.data || res.data || [];
        const mapped = (Array.isArray(rawList) ? rawList : [])
          .filter((app: any) => (app.type || '').toLowerCase() !== 'contest')
          .map((app: any) => {
            let status: AppStatus = "submitted";
            const rawStatus = (app.status || "").toLowerCase();
            
            if (["approved", "hired", "offer", "selected", "completed"].includes(rawStatus)) {
              status = "approved";
            } else if (["shortlisted", "interview", "in consideration"].includes(rawStatus)) {
              status = "interview";
            } else if (["rejected", "failed", "declined"].includes(rawStatus)) {
              status = "rejected";
            } else if (["review", "under_review", "in_review", "application under review"].includes(rawStatus)) {
              status = "review";
            } else {
              status = "submitted";
            }

            const isInternship = (app.type || '').toLowerCase() === 'internship';
            const rawId = app.raw_id || (typeof app.id === 'string' && app.id.startsWith('internship_') ? parseInt(app.id.replace('internship_', ''), 10) : (typeof app.id === 'number' ? app.id : undefined));

            return {
              id: String(app.id),
              rawId: rawId,
              title: app.title || app.job_title || app.internship_title || "Application",
              type: app.type || "Application",
              appliedDate: app.applied_on_formatted || (app.applied_on ? new Date(app.applied_on).toLocaleDateString() : "Just now"),
              status: status,
              link: app.link || "/student/applications",
              notes: app.notes || "",
              termsAccepted: isInternship ? (app.terms_accepted ?? true) : false,
              termsVersion: app.terms_version || 'v1.0',
              signatureUrl: app.signature_url,
              rejectionReason: app.rejection_reason,
              hasAppointmentLetter: isInternship && (status === 'approved' || app.has_appointment_letter),
              timeline: [
                { step: "Application Submitted", date: app.applied_on_formatted || "Submitted", done: true },
                { step: "Under Review", date: "Admin Review", done: status !== "submitted" },
                { step: "Evaluation / Review", date: "In Progress", done: status === "interview" || status === "approved" || status === "rejected" },
                { step: status === "approved" ? "Approved & Letter Issued" : (status === "rejected" ? "Decision Finalized" : "Final Decision"), date: status === "approved" ? "Approved" : (status === "rejected" ? "Rejected" : "Pending"), done: status === "approved" || status === "rejected" }
              ]
            };
          });
        setApplications(mapped);
        
        const notesMap: Record<string, string> = {};
        mapped.forEach((a: any) => {
          notesMap[a.id] = a.notes || "";
        });
        setNotes(notesMap);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading student applications:", err);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    loadApplications();
  }, []);

  const handleDownloadAppointmentLetter = async (rawId?: number) => {
    if (!rawId) {
      toast.error("Application identifier missing.");
      return;
    }
    setDownloadingId(rawId);
    toast.loading("Preparing your Appointment Letter...", { id: "app-letter-download" });

    try {
      const response = await api.get(`/student/applications/${rawId}/appointment-letter`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Blueboxx_Appointment_Letter_App_${rawId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Appointment Letter downloaded successfully!", { id: "app-letter-download" });
    } catch (err: any) {
      toast.error("Appointment Letter is being processed or unavailable.", { id: "app-letter-download" });
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  const toggleExpand = (id: string) => setExpanded(prev => prev === id ? null : id);

  const approvedCount = applications.filter(a => a.status === "approved").length;
  const successRate = applications.length > 0 
    ? Math.round((approvedCount / applications.length) * 100)
    : 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Job': return <Briefcase size={20} />;
      case 'Internship': return <Briefcase size={20} />;
      case 'Scholarship': return <Trophy size={20} />;
      case 'Contest': return <Code size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <StudentDashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">My Applications & Status</h1>
          <p className="text-slate-500 text-sm font-medium">
            Track your internship applications, Terms & Conditions consent, approvals, and download appointment letters.
          </p>
        </div>
        <Link
          href="/student/internships"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] transition-colors text-sm shrink-0 shadow-xs"
        >
          <Plus size={16} /> Explore Internships
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { key: "all", label: "All" },
          { key: "submitted", label: "Submitted" },
          { key: "review", label: "In Review" },
          { key: "interview", label: "Shortlisted" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map((item, i) => {
          const count = item.key === "all" ? applications.length : applications.filter(a => a.status === item.key).length;
          const isSelected = filter === item.key;
          return (
            <AnimatedContent key={item.key} direction="up" delay={i * 0.05}>
              <button
                onClick={() => setFilter(item.key)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected ? "bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-md shadow-[#1B2A6B]/20" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>{item.label}</span>
                <span className="text-2xl font-black">{count}</span>
              </button>
            </AnimatedContent>
          );
        })}
      </div>

      {/* Application Progress Banner */}
      <AnimatedContent direction="up" delay={0.2} className="bg-gradient-to-r from-[#1B2A6B] to-[#2E45A3] rounded-2xl p-6 mb-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-[#C9A227]" />
            <span className="text-sm font-black">Application & Approval Progress</span>
          </div>
          <p className="text-xs text-blue-200 font-semibold">{applications.length} applications submitted · {approvedCount} approved with appointment letters</p>
        </div>
        <div className="w-full sm:w-48">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-blue-200">Approval rate</span>
            <span className="text-white">{successRate}%</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[#C9A227] rounded-full transition-all" style={{ width: `${successRate}%` }} />
          </div>
        </div>
      </AnimatedContent>

      {/* Application cards */}
      <div className="space-y-4">
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FileText size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="font-black text-slate-600">No applications in this category</p>
            <Link href="/student/internships" className="text-sm text-[#1B2A6B] font-bold hover:underline mt-2 inline-block">Browse Internships →</Link>
          </div>
        )}

        {filtered.map((app, i) => {
          const s = STATUS_STYLES[app.status] || STATUS_STYLES.submitted;
          const isOpen = expanded === app.id;
          return (
            <AnimatedContent key={app.id} direction="up" delay={i * 0.05}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isOpen ? `border-l-4 ${s.border}` : "border-slate-200 hover:shadow-md"}`}
            >
              {/* Card header – click to toggle */}
              <div
                className="p-5 flex items-center gap-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
                onClick={() => toggleExpand(app.id)}
              >
                {/* Type avatar */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                  {getIcon(app.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="font-black text-slate-800 text-sm">{app.title}</h3>
                    <span className={`px-2.5 py-0.5 text-[10px] rounded-full ${s.pill}`}>
                      {s.label}
                    </span>
                    {app.termsAccepted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck size={11} /> T&C Agreed
                      </span>
                    )}
                    {app.type === 'Internship' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        <PenTool size={11} /> Digitally Signed
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 font-bold text-[#1B2A6B] uppercase tracking-wider">{app.type}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> Applied {app.appliedDate}</span>
                  </div>
                </div>

                <div className={`text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                  <ChevronDown size={18} />
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/30">
                  
                  {/* APPROVAL & APPOINTMENT LETTER HIGHLIGHT (IF APPROVED) */}
                  {app.status === 'approved' && app.hasAppointmentLetter && (
                    <div className="mx-6 my-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Award size={22} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-emerald-900 text-xs uppercase tracking-wider">Congratulations! Your Application is Approved</h4>
                          <p className="text-[11px] text-emerald-700 font-medium">Your official Internship Appointment Letter has been generated and is ready for download.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadAppointmentLetter(app.rawId)}
                        disabled={downloadingId === app.rawId}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Download size={14} /> {downloadingId === app.rawId ? "Downloading..." : "Download Appointment Letter"}
                      </button>
                    </div>
                  )}

                  {/* REJECTION REASON (IF REJECTED) */}
                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="mx-6 my-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                        <XCircle size={14} /> Reviewer Feedback
                      </div>
                      <p className="text-xs text-rose-700 font-medium pl-5">{app.rejectionReason}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="px-6 py-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Application Workflow Timeline</p>
                    <div className="relative flex gap-0">
                      {app.timeline.map((step, idx) => {
                        const isLast = idx === app.timeline.length - 1;
                        const isRejectedLast = app.status === "rejected" && isLast;
                        const isDone = step.done;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center relative">
                            {!isLast && (
                              <div className={`absolute top-4 left-1/2 w-full h-0.5 z-0 ${isDone ? "bg-[#1B2A6B]" : "bg-slate-200"}`} />
                            )}
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${
                              isRejectedLast
                                ? "bg-red-50 border-red-300 text-red-500"
                                : isDone
                                  ? "bg-[#1B2A6B] border-[#1B2A6B] text-white shadow-xs"
                                  : "bg-white border-slate-200 text-slate-400"
                            }`}>
                              {isRejectedLast ? <XCircle size={14} /> : isDone ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            </div>
                            <p className={`text-[10px] font-black text-center ${isDone ? "text-slate-800" : "text-slate-400"}`}>{step.step}</p>
                            <p className="text-[9px] text-slate-400 font-semibold text-center">{step.date}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="px-6 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Notes</p>
                      <button
                        onClick={() => setEditNoteId(editNoteId === app.id ? null : app.id)}
                        className="text-[10px] font-black text-[#1B2A6B] hover:underline cursor-pointer"
                      >
                        {editNoteId === app.id ? "Save" : "Edit"}
                      </button>
                    </div>
                    {editNoteId === app.id ? (
                      <textarea
                        value={notes[app.id]}
                        onChange={e => setNotes(p => ({ ...p, [app.id]: e.target.value }))}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                        placeholder="Add private notes..."
                      />
                    ) : (
                      <p className="text-xs text-slate-600 font-semibold bg-white border border-slate-200 rounded-xl px-4 py-3 italic">
                        {notes[app.id] || "No notes yet. Click Edit to add."}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-5 flex gap-2 flex-wrap items-center">
                    {app.status === 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleDownloadAppointmentLetter(app.rawId)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <Download size={13} /> Download Appointment Letter
                      </button>
                    )}
                    <Link href="/student/internships" className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
                      <ExternalLink size={12} /> View Opportunity Details
                    </Link>
                  </div>

                </div>
              )}
            </AnimatedContent>
          );
        })}
      </div>
    </StudentDashboardLayout>
  );
}
