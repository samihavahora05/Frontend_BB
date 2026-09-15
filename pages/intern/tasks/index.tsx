import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  UploadCloud,
  Upload,
  FileText,
  ExternalLink,
  Github,
  Video,
  X,
  Search,
  Filter,
  Briefcase,
  Building2,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Send,
  RefreshCw,
  Eye,
  CheckSquare,
  LayoutGrid,
  Table as TableIcon,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskService, TaskItem, TaskStats, InternPerformanceResponse, EvaluatedTaskItem } from "../../../src/lib/api/intern/TaskService";
import { getImageUrl } from "../../../src/lib/imageUtils";
import toast from "react-hot-toast";

type FilterStatus = "all" | "assigned" | "in_progress" | "pending_review" | "changes_required" | "completed" | "overdue";

export default function InternTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    assigned: 0,
    in_progress: 0,
    pending_review: 0,
    completed: 0,
    changes_required: 0,
    overdue: 0,
  });
  const [performanceData, setPerformanceData] = useState<InternPerformanceResponse["data"] | null>(null);
  const [isScoreHistoryModalOpen, setIsScoreHistoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Views
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Persistent Checklist checked state (task_id -> array of checked indices)
  const [checkedItems, setCheckedItems] = useState<Record<number, number[]>>({});

  // Load persisted checklist state on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("blueboxx_intern_task_checklists_v1");
        if (saved) {
          setCheckedItems(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.error("Error loading checklist state from localStorage:", e);
    }
  }, []);

  // Submission Form State
  const [completionNote, setCompletionNote] = useState("");
  const [deliverableSummary, setDeliverableSummary] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {};

      const effectiveStatus = statusFilter !== "all" ? statusFilter : activeTab;
      if (effectiveStatus !== "all") {
        if (effectiveStatus === "pending_review") {
          params.status = "submitted";
        } else {
          params.status = effectiveStatus;
        }
      }
      if (priorityFilter !== "all") params.priority = priorityFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [res, perfRes] = await Promise.allSettled([
        TaskService.getTasks(params),
        TaskService.getPerformance(),
      ]);

      if (res.status === "fulfilled" && res.value?.success) {
        setTasks(res.value.data?.data || []);
        if (res.value.stats) setStats(res.value.stats);
      }

      if (perfRes.status === "fulfilled" && perfRes.value?.success) {
        setPerformanceData(perfRes.value.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load assigned tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, priorityFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStartTask = async (task: TaskItem) => {
    try {
      const res = await TaskService.startTask(task.id);
      if (res.success) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              } bg-[#064e3b] text-white px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-600/30 pointer-events-auto transition-all duration-200 min-w-[340px] max-w-md justify-between`}
            >
              <div className="flex items-center gap-2.5 text-xs font-bold">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>🚀 Task started! Status changed to In Progress.</span>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-emerald-300 hover:text-white p-0.5 rounded-lg hover:bg-emerald-800/50 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          ),
          { duration: 4000 }
        );
        fetchTasks();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start task.");
    }
  };

  const openSubmitModal = (task: TaskItem) => {
    setSelectedTask(task);
    setCompletionNote("");
    setDeliverableSummary("");
    setAdditionalComments("");
    setSelectedFile(null);
    setIsSubmitModalOpen(true);
  };

  const openDetailModal = (task: TaskItem) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const toggleChecklistItem = (taskId: number, index: number) => {
    setCheckedItems((prev) => {
      const current = prev[taskId] || [];
      const updated = current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index];
      const nextState = { ...prev, [taskId]: updated };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("blueboxx_intern_task_checklists_v1", JSON.stringify(nextState));
        }
      } catch (e) {
        console.error("Error saving checklist state to localStorage:", e);
      }
      return nextState;
    });
  };

  const parseChecklist = (instructions?: string): string[] => {
    if (!instructions) return [];
    const lines = instructions.split("\n");
    const checklist: string[] = [];
    let inChecklist = false;

    lines.forEach((line) => {
      if (line.includes("Checklist Requirements:")) {
        inChecklist = true;
        return;
      }
      if (inChecklist && (line.startsWith("• [ ]") || line.startsWith("- [ ]") || line.startsWith("•") || line.startsWith("-"))) {
        const clean = line.replace(/^[•\-]\s*(\[\s*\])?\s*/, "").trim();
        if (clean) checklist.push(clean);
      }
    });

    return checklist;
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (!completionNote.trim()) {
      toast.error("Please explain what was done in the completion note.");
      return;
    }

    if (!selectedFile && !additionalComments.trim()) {
      toast.error("Proof / Supporting deliverable files are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const combinedComment = `${completionNote.trim()}${
        deliverableSummary.trim() ? `\n\nWhat was completed:\n${deliverableSummary.trim()}` : ""
      }${additionalComments.trim() ? `\n\nAdditional Comments:\n${additionalComments.trim()}` : ""}`;

      const formData = new FormData();
      formData.append("submission_comment", combinedComment);
      if (additionalComments.trim().startsWith("http")) {
        formData.append("github_link", additionalComments.trim());
      }
      if (selectedFile) formData.append("file", selectedFile);

      const res = await TaskService.submitTask(selectedTask.id, formData);
      if (res.success) {
        toast.success("Deliverable submitted for admin review!");
        setIsSubmitModalOpen(false);
        fetchTasks();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit deliverable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-rose-50 text-rose-600 border border-rose-200">Urgent</span>;
      case "high":
        return <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-orange-50 text-orange-600 border border-orange-200">High</span>;
      case "medium":
        return <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-blue-50 text-blue-600 border border-blue-200">Medium</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-slate-100 text-slate-600 border border-slate-200">Low</span>;
    }
  };

  const getStatusBadge = (status: string, isOverdue?: boolean) => {
    if (isOverdue && status !== "completed" && status !== "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle size={12} /> Overdue
        </span>
      );
    }
    switch (status) {
      case "assigned":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Assigned</span>;
      case "in_progress":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">In Progress</span>;
      case "submitted":
      case "under_review":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">Under Review</span>;
      case "completed":
      case "approved":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case "changes_required":
      case "resubmit":
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">Needs Revision</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <InternDashboardLayout>
      <Head>
        <title>Organization Task Tasker | Intern Portal | BlueBoxx</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6 pt-2 pb-16">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0d1635] tracking-tight">Organization Task Tasker</h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
              Monitor, execute, and submit deliverables for assigned organizational tasks.
            </p>
          </div>
          <button
            onClick={() => fetchTasks()}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Top 6 Clickable KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Tasks */}
          <div
            onClick={() => {
              setActiveTab("all");
              setStatusFilter("all");
            }}
            className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 ${
              activeTab === "all" && statusFilter === "all"
                ? "border-[#1B2A6B] ring-2 ring-[#1B2A6B]/20 shadow-sm"
                : "border-slate-200/80 hover:border-[#1B2A6B]/40 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">TOTAL TASKS</span>
              <div className="w-7 h-7 rounded-lg bg-[#0d1635] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ListTodo size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#0d1635]">{isLoading ? "-" : stats.total}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-semibold text-slate-400">All tasks</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${activeTab === "all" && statusFilter === "all" ? "bg-[#1B2A6B] text-white" : "bg-blue-50 text-[#1B2A6B]"}`}>
                  {activeTab === "all" && statusFilter === "all" ? "Active" : "Filter"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. In Progress */}
          <div
            onClick={() => {
              setActiveTab("in_progress");
              setStatusFilter("all");
            }}
            className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 ${
              activeTab === "in_progress" || statusFilter === "in_progress"
                ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
                : "border-slate-200/80 hover:border-indigo-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">IN PROGRESS</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600">{isLoading ? "-" : stats.in_progress}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-semibold text-slate-400">In flight</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${activeTab === "in_progress" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                  {activeTab === "in_progress" ? "Active" : "Filter"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Under Review */}
          <div
            onClick={() => {
              setActiveTab("pending_review");
              setStatusFilter("all");
            }}
            className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 ${
              activeTab === "pending_review" || statusFilter === "submitted"
                ? "border-purple-600 ring-2 ring-purple-500/20 shadow-sm"
                : "border-slate-200/80 hover:border-purple-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">UNDER REVIEW</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Send size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-purple-600">{isLoading ? "-" : stats.pending_review}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-semibold text-slate-400">Proof sent</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${activeTab === "pending_review" ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-600"}`}>
                  {activeTab === "pending_review" ? "Active" : "Filter"}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Needs Revision */}
          <div
            onClick={() => {
              setActiveTab("changes_required");
              setStatusFilter("all");
            }}
            className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 ${
              activeTab === "changes_required" || statusFilter === "changes_required"
                ? "border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                : "border-slate-200/80 hover:border-amber-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">NEEDS REVISION</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <RefreshCw size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-600">{isLoading ? "-" : stats.changes_required}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-semibold text-slate-400">Revisions</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${activeTab === "changes_required" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-600"}`}>
                  {activeTab === "changes_required" ? "Active" : "Filter"}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Approved & Scored */}
          <div
            onClick={() => {
              setActiveTab("completed");
              setStatusFilter("all");
            }}
            className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 ${
              activeTab === "completed" || statusFilter === "completed"
                ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm"
                : "border-slate-200/80 hover:border-emerald-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">APPROVED</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Award size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">{isLoading ? "-" : stats.completed}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-emerald-600/90">Graded</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${activeTab === "completed" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                  {activeTab === "completed" ? "Active" : "Filter"}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Overdue */}
          <div
            onClick={() => {
              setActiveTab("overdue");
              setStatusFilter("all");
            }}
            className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5 ${
              activeTab === "overdue"
                ? "border-rose-600 ring-2 ring-rose-500/20 shadow-sm"
                : "border-slate-200/80 hover:border-rose-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">OVERDUE</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <AlertTriangle size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-rose-600">{isLoading ? "-" : stats.overdue}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-semibold text-slate-400">Overdue</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${activeTab === "overdue" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600"}`}>
                  {activeTab === "overdue" ? "Active" : "Filter"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance & Quality Rating Banner */}
        {performanceData && (
          <div className="bg-gradient-to-r from-[#0d1635] via-[#152347] to-[#0b132b] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-white/10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              {/* Left Side: Score & Description */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <Sparkles size={11} className="text-emerald-400" />
                    Verified Performance Rating
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    Calculated only from supervisor-approved evaluations
                  </span>
                </div>

                <div className="flex items-baseline gap-3 pt-0.5">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {performanceData.stats.completed_tasks > 0 ? `${performanceData.stats.performance_rate}%` : "No Score Yet"}
                  </div>
                  {performanceData.stats.completed_tasks > 0 && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                      {performanceData.stats.performance_rate >= 90
                        ? "⭐ Outstanding (A+)"
                        : performanceData.stats.performance_rate >= 75
                        ? "🌟 Proficient (A)"
                        : performanceData.stats.performance_rate >= 60
                        ? "👍 Competent (B)"
                        : "🌱 Developing"}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                  {performanceData.stats.completed_tasks > 0
                    ? `Your performance score is based on ${performanceData.stats.completed_tasks} approved task${performanceData.stats.completed_tasks > 1 ? 's' : ''} (${performanceData.stats.total_marks_obtained}/${performanceData.stats.total_max_marks} marks awarded).`
                    : "Complete and submit your tasks. Once an authorized supervisor approves your deliverables, your marks and verified performance rate will appear here."}
                </p>
              </div>

              {/* Right Side: Quick Stats & Breakdown Button */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 min-w-[120px]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                    Evaluated Tasks
                  </span>
                  <div className="text-xl font-black text-white">
                    {performanceData.stats.completed_tasks}
                    <span className="text-xs text-slate-400 font-normal ml-1">/ {performanceData.stats.total_tasks}</span>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 min-w-[120px]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">
                    Average Marks
                  </span>
                  <div className="text-xl font-black text-emerald-300">
                    {performanceData.stats.average_marks > 0 ? `${performanceData.stats.average_marks}/100` : "—"}
                  </div>
                </div>

                {performanceData.evaluated_history?.length > 0 && (
                  <button
                    onClick={() => setIsScoreHistoryModalOpen(true)}
                    className="px-3.5 py-3 bg-[#C9A227] hover:bg-[#b58f1f] text-[#0d1635] rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Award size={15} />
                    <span>Score Breakdown</span>
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Navigation Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
            {/* Status Pills without native scrollbar */}
            <div 
              className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 flex-nowrap [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[
                { id: "all", label: "All Tasks" },
                { id: "assigned", label: "To Do" },
                { id: "in_progress", label: "In Progress" },
                { id: "pending_review", label: "Review Required" },
                { id: "changes_required", label: "Needs Revision" },
                { id: "completed", label: "Approved & Scored" },
                { id: "overdue", label: "Overdue" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as FilterStatus);
                    setStatusFilter("all");
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#1B2A6B] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right Tools: Search, Status, Priority & View Mode */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-52">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B2A6B] w-full"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1B2A6B]"
              >
                <option value="all">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Under Review</option>
                <option value="changes_required">Needs Revision</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1B2A6B]"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "table" ? "bg-white text-[#1B2A6B] shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
                  title="Table View"
                >
                  <TableIcon size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white text-[#1B2A6B] shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
                  title="Card Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: Table / Grid */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 animate-pulse space-y-4">
            <div className="h-6 bg-slate-100 rounded-xl w-1/4" />
            <div className="h-12 bg-slate-50 rounded-xl w-full" />
            <div className="h-12 bg-slate-50 rounded-xl w-full" />
            <div className="h-12 bg-slate-50 rounded-xl w-full" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-blue-50 text-[#1B2A6B] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ListTodo size={28} />
            </div>
            <h3 className="text-lg font-black text-[#0d1635] mb-1.5">No Tasks Found</h3>
            <p className="text-xs font-medium text-slate-500 max-w-md mx-auto mb-5">
              {activeTab === "all"
                ? "You currently have no tasks assigned. Once your internship application is approved, your assigned tasks will appear here."
                : `No tasks found matching "${activeTab.replace("_", " ")}".`}
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/internships"
                className="px-4 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Find Internships
              </Link>
            </div>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 w-2/5">Task Details</th>
                    <th className="px-5 py-3.5">Assigned By / Internship</th>
                    <th className="px-5 py-3.5">Due Date</th>
                    <th className="px-5 py-3.5 text-center">Max Marks</th>
                    <th className="px-5 py-3.5 text-center">Marks Awarded</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Review / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {tasks.map((task) => {
                    const checklist = parseChecklist(task.instructions);
                    const completedCheckCount = (checkedItems[task.id] || []).length;
                    const totalCheckCount = checklist.length;
                    const checkPercent = totalCheckCount > 0 ? Math.round((completedCheckCount / totalCheckCount) * 100) : 0;

                    return (
                      <tr
                        key={task.id}
                        onClick={() => openDetailModal(task)}
                        className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                      >
                        {/* Task Details */}
                        <td className="px-5 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {getPriorityBadge(task.priority)}
                              <span className="px-2 py-0.5 text-[9px] font-bold text-slate-500 bg-slate-100 rounded-md">
                                General Task
                              </span>
                            </div>
                            <h4 className="font-black text-[#0d1635] text-sm group-hover:text-[#1B2A6B] transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-normal line-clamp-1 truncate max-w-md">
                              {task.description || "No description provided"}
                            </p>

                            {(task.status === "changes_required" || task.status === "resubmit") && task.feedback && (
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 font-medium flex items-start gap-2">
                                <RotateCcw size={13} className="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-amber-950">Revision Feedback: </span>
                                  <span>{task.feedback}</span>
                                </div>
                              </div>
                            )}

                            {totalCheckCount > 0 && (
                              <div className="flex items-center gap-2 pt-0.5">
                                <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${
                                      checkPercent === 100 ? "bg-emerald-500" : "bg-[#1B2A6B]"
                                    }`}
                                    style={{ width: `${checkPercent}%` }}
                                  />
                                </div>
                                <span className={`text-[10px] font-bold ${checkPercent === 100 ? "text-emerald-600" : "text-slate-400"}`}>
                                  {completedCheckCount}/{totalCheckCount} ({checkPercent}% done)
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Assigned By */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center font-black text-xs shrink-0">
                              {(task.internship?.company_name || task.company?.name || "B")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">
                                {task.internship?.company_name || task.company?.name || "BlueBoxx DA Pvt. Ltd."}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">
                                {task.internship?.title || "Backend Developer Intern"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="px-5 py-4 font-semibold text-slate-600 whitespace-nowrap">
                          {task.due_date ? (
                            <span className={task.is_overdue ? "text-rose-600 font-bold" : ""}>
                              {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No deadline</span>
                          )}
                        </td>

                        {/* Max Marks */}
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs">
                            100
                          </span>
                        </td>

                        {/* Marks Awarded */}
                        <td className="px-5 py-4 text-center font-bold">
                          {task.marks !== undefined && task.marks !== null ? (
                            <span className="inline-flex px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-black text-xs">
                              {task.marks} / 100
                            </span>
                          ) : (
                            <span className="text-slate-300 font-bold">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          {getStatusBadge(task.status, task.is_overdue)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {task.status === "assigned" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartTask(task);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                              >
                                <Play size={11} fill="white" /> Start Task
                              </button>
                            )}

                            {(task.status === "in_progress" || task.status === "changes_required" || task.status === "resubmit") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openSubmitModal(task);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                              >
                                <Upload size={12} /> Submit Deliverable
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailModal(task);
                              }}
                              className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task) => {
              const checklist = parseChecklist(task.instructions);
              const completedCheckCount = (checkedItems[task.id] || []).length;
              const totalCheckCount = checklist.length;
              const checkPercent = totalCheckCount > 0 ? Math.round((completedCheckCount / totalCheckCount) * 100) : 0;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openDetailModal(task)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
                >
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status, task.is_overdue)}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-[#0d1635] group-hover:text-[#1B2A6B] transition-colors leading-snug line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    {totalCheckCount > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Checklist progress</span>
                          <span className={checkPercent === 100 ? "text-emerald-600" : "text-[#1B2A6B]"}>
                            {completedCheckCount}/{totalCheckCount} ({checkPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              checkPercent === 100 ? "bg-emerald-500" : "bg-[#1B2A6B]"
                            }`}
                            style={{ width: `${checkPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {(task.status === "changes_required" || task.status === "resubmit") && task.feedback && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-medium">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-0.5">
                          <RotateCcw size={12} className="text-amber-600" />
                          <span>Revision Feedback:</span>
                        </div>
                        <p className="line-clamp-2">{task.feedback}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-400">Assigned By:</span>
                        <span className="font-bold text-slate-800">{task.internship?.company_name || task.company?.name || "BlueBoxx DA Pvt. Ltd."}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-400">Due Date:</span>
                        <span className={`font-bold ${task.is_overdue ? "text-rose-600" : "text-slate-800"}`}>
                          {task.due_date ? new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No deadline"}
                        </span>
                      </div>
                      {task.marks !== undefined && task.marks !== null && (
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="font-semibold text-slate-400">Marks Awarded:</span>
                          <span className="font-black text-emerald-600">{task.marks} / 100</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(task);
                      }}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Details
                    </button>

                    {task.status === "assigned" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTask(task);
                        }}
                        className="px-4 py-1.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play size={11} fill="white" /> Start Task
                      </button>
                    )}

                    {(task.status === "in_progress" || task.status === "changes_required" || task.status === "resubmit") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSubmitModal(task);
                        }}
                        className="px-4 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload size={12} /> Submit
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Details Drawer/Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getPriorityBadge(selectedTask.priority)}
                    {getStatusBadge(selectedTask.status, selectedTask.is_overdue)}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{selectedTask.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedTask.internship?.company_name || selectedTask.company?.name || "BlueBoxx DA Pvt. Ltd."} • {selectedTask.internship?.title || "Internship Task"}
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
                {selectedTask.description && (
                  <div>
                    <h5 className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[10px]">Description</h5>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                      {selectedTask.description}
                    </p>
                  </div>
                )}

                {selectedTask.instructions && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Instructions & Checklist</h5>
                      {parseChecklist(selectedTask.instructions).length > 0 && (
                        <span className="text-[10px] font-bold text-slate-400">
                          Click any item to check off (auto-saved)
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {parseChecklist(selectedTask.instructions).map((item, idx) => {
                        const isChecked = (checkedItems[selectedTask.id] || []).includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleChecklistItem(selectedTask.id, idx)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border ${
                              isChecked
                                ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-900"
                                : "bg-white hover:bg-slate-100/80 border-slate-200/80 text-slate-700 shadow-2xs"
                            }`}
                          >
                            <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                              isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {isChecked && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span className={`text-xs select-none leading-relaxed ${isChecked ? "line-through text-slate-400 font-normal" : "text-slate-700 font-semibold"}`}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                      {parseChecklist(selectedTask.instructions).length === 0 && (
                        <p className="text-slate-600 whitespace-pre-line font-medium">{selectedTask.instructions}</p>
                      )}
                    </div>
                  </div>
                )}

                {(selectedTask.status === "changes_required" || selectedTask.status === "resubmit") && selectedTask.feedback && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <RotateCcw size={14} className="text-amber-600" />
                      <span>Reviewer Revision Instructions:</span>
                    </div>
                    <p className="font-medium whitespace-pre-line text-amber-800">{selectedTask.feedback}</p>
                  </div>
                )}

                {selectedTask.marks !== undefined && selectedTask.marks !== null && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Evaluation Result:</span>
                      <span className="text-[11px] text-emerald-700">Verified by supervisor</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-700">{selectedTask.marks} / 100 Marks</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
                {(selectedTask.status === "in_progress" || selectedTask.status === "changes_required" || selectedTask.status === "resubmit") && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      openSubmitModal(selectedTask);
                    }}
                    className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload size={13} /> Submit Deliverable
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit Deliverable Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-300">
                    <Upload size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-black">Submit Task for Review</h3>
                    <p className="text-[11px] text-purple-200 truncate max-w-sm">{selectedTask.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Field 1: Completion Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Completion Note * <span className="font-normal text-slate-400">(Explain what was accomplished)</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    placeholder="e.g. Completed the required data models, built the API endpoints, and ran tests..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>

                {/* Field 2: What was completed */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deliverables Summary <span className="font-normal text-slate-400">(Key outputs)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={deliverableSummary}
                    onChange={(e) => setDeliverableSummary(e.target.value)}
                    placeholder="Key deliverables: source code, documentation PDF, testing report..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>

                {/* Field 3: Proof / Deliverable File */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Proof / Supporting Deliverable Files * <span className="font-normal text-slate-400">(PDF, DOCX, ZIP, Images)</span>
                  </label>
                  <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl bg-purple-50/20 hover:bg-purple-50/40 transition-all cursor-pointer group">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Upload size={16} />
                    </div>
                    <p className="text-xs font-bold text-purple-900">
                      {selectedFile ? selectedFile.name : "Click to browse or drop proof file"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB selected`
                        : "Supported: PDF, DOCX, XLSX, PPTX, JPG, PNG, ZIP (Max 20MB)"}
                    </p>
                  </label>
                </div>

                {/* Field 4: Optional Links */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GitHub / Live Project URL <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send size={12} /> {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Score History Modal */}
      <AnimatePresence>
        {isScoreHistoryModalOpen && performanceData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#0d1635] to-[#1B2A6B] text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black">Evaluated Task Marks & Feedback</h3>
                    <p className="text-[11px] text-slate-300">Official evaluation record awarded by supervisors</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsScoreHistoryModalOpen(false)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-3.5 max-h-[60vh]">
                {performanceData.evaluated_history.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="text-xs font-bold">No evaluated tasks recorded yet.</p>
                  </div>
                ) : (
                  performanceData.evaluated_history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                            {item.internship_title} • {item.company_name}
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-0.5">{item.title}</h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                            {item.marks} / {item.max_marks} Marks
                          </span>
                        </div>
                      </div>

                      {item.feedback ? (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200/70 text-xs text-slate-700">
                          <span className="font-bold text-slate-900 block text-[10px] mb-0.5">Supervisor Feedback:</span>
                          <p className="whitespace-pre-line text-slate-600 font-medium">{item.feedback}</p>
                        </div>
                      ) : (
                        <div className="text-[10px] italic text-slate-400">No written feedback provided.</div>
                      )}

                      <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                        <Calendar size={11} />
                        Approved on: {item.completed_at ? new Date(item.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsScoreHistoryModalOpen(false)}
                  className="px-4 py-1.5 bg-[#0d1635] text-white rounded-xl text-xs font-bold hover:bg-[#1B2A6B] transition-colors cursor-pointer"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </InternDashboardLayout>
  );
}
