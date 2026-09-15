import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
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
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../src/lib/imageUtils";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

type FilterStatus = "all" | "assigned" | "in_progress" | "submitted" | "changes_required" | "completed" | "overdue";

export default function CompanyTasksPage() {
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Review Modal State
  const [reviewTask, setReviewTask] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "request_changes">("approve");
  const [awardedMarks, setAwardedMarks] = useState<number>(100);
  const [reviewFeedback, setReviewFeedback] = useState<string>("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(0);

  // Detail Modal State
  const [detailTask, setDetailTask] = useState<any>(null);

  // Create Task Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [checklistInput, setChecklistInput] = useState("");

  const queryParams = new URLSearchParams();
  const effectiveStatus = statusFilter !== "all" ? statusFilter : activeTab;
  if (effectiveStatus !== "all") queryParams.set("status", effectiveStatus);
  if (priorityFilter !== "all") queryParams.set("priority", priorityFilter);
  if (searchQuery.trim()) queryParams.set("search", searchQuery.trim());

  const { data: taskResponse, isLoading, mutate } = useSWR(
    `/company/tasks${queryParams.toString() ? "?" + queryParams.toString() : ""}`,
    fetcher
  );

  const { data: approvedInternsResponse } = useSWR("/company/interns", fetcher);

  const tasks = taskResponse?.data?.data || [];
  const stats = taskResponse?.stats || {
    total: 0,
    assigned: 0,
    in_progress: 0,
    pending_review: 0,
    completed: 0,
    changes_required: 0,
    overdue: 0,
  };
  const approvedInterns = approvedInternsResponse?.data || [];

  const handleOpenReview = (task: any) => {
    setReviewTask(task);
    setReviewAction("approve");
    setAwardedMarks(task.marks || 100);
    setReviewFeedback(task.feedback || "");
    setActiveVersionIndex(0);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTask) return;

    if (reviewAction === "request_changes" && !reviewFeedback.trim()) {
      toast.error("Please provide revision feedback explaining what needs improvement.");
      return;
    }

    try {
      setIsReviewing(true);
      const res = await api.post(`/company/tasks/${reviewTask.id}/review`, {
        action: reviewAction,
        marks: reviewAction === "approve" ? Number(awardedMarks) : undefined,
        feedback: reviewFeedback.trim(),
      });

      if (res.data?.success) {
        toast.success(
          reviewAction === "approve"
            ? `Task approved and ${awardedMarks} marks awarded!`
            : "Revision requested. Intern has been notified to resubmit deliverables."
        );
        setReviewTask(null);
        mutate();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const assignedTo = form.get("assigned_to");
    if (!assignedTo) {
      toast.error("Please select an approved intern to assign this task to.");
      return;
    }

    try {
      setIsCreating(true);
      const instructions = (form.get("instructions") as string) || "";
      const checklistStr =
        checklistItems.length > 0
          ? `\n\nChecklist Requirements:\n${checklistItems.map((item) => `• [ ] ${item}`).join("\n")}`
          : "";

      await api.post("/company/tasks", {
        assigned_to: assignedTo,
        title: form.get("title"),
        description: form.get("description"),
        instructions: (instructions + checklistStr).trim(),
        expected_deliverable: form.get("expected_deliverable"),
        priority: form.get("priority") || "medium",
        due_date: form.get("due_date"),
        max_marks: 100,
      });

      toast.success("Task assigned successfully to intern!");
      setIsCreateModalOpen(false);
      setChecklistItems([]);
      setChecklistInput("");
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create task.");
    } finally {
      setIsCreating(false);
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
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">Review Required</span>;
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
    <CompanyDashboardLayout>
      <Head>
        <title>Intern Task Management & Evaluation | Company Portal</title>
      </Head>

      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Intern Tasks & Evaluation</h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
              Assign tasks, inspect proof deliverables, evaluate submissions, and award performance marks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Assign New Task</span>
            </button>

            <button
              onClick={() => mutate()}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* 6 Top KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">TOTAL TASKS</span>
              <div className="w-7 h-7 rounded-lg bg-[#1B2A6B] text-white flex items-center justify-center">
                <ListTodo size={14} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{isLoading ? "-" : stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">IN PROGRESS</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock size={14} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600">{isLoading ? "-" : stats.in_progress}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">REVIEW REQUIRED</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Send size={14} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-600">{isLoading ? "-" : stats.pending_review}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">NEEDS REVISION</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <RefreshCw size={14} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{isLoading ? "-" : stats.changes_required}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">APPROVED & SCORED</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award size={14} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{isLoading ? "-" : stats.completed}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider">OVERDUE</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={14} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-rose-600">{isLoading ? "-" : stats.overdue}</p>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 flex-nowrap [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[
                { id: "all", label: "All Tasks" },
                { id: "assigned", label: "Assigned" },
                { id: "in_progress", label: "In Progress" },
                { id: "submitted", label: "Review Required" },
                { id: "changes_required", label: "Needs Revision" },
                { id: "completed", label: "Approved & Scored" },
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

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-52">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks or intern..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B2A6B] w-full"
                />
              </div>

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
                >
                  <TableIcon size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white text-[#1B2A6B] shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <LayoutGrid size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 animate-pulse space-y-4">
            <div className="h-6 bg-slate-100 rounded-xl w-1/4" />
            <div className="h-12 bg-slate-50 rounded-xl w-full" />
            <div className="h-12 bg-slate-50 rounded-xl w-full" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-blue-50 text-[#1B2A6B] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ListTodo size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">No Tasks Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
              Assign tasks to your active interns to track their deliverables and grade performance.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0d1635] transition-colors"
            >
              Assign First Task
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 w-2/5">Task Details</th>
                    <th className="px-5 py-3.5">Assigned Intern</th>
                    <th className="px-5 py-3.5">Due Date</th>
                    <th className="px-5 py-3.5 text-center">Marks Awarded</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {tasks.map((task: any) => (
                    <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {getPriorityBadge(task.priority)}
                            <span className="px-2 py-0.5 text-[9px] font-bold text-slate-500 bg-slate-100 rounded-md">
                              {task.internship?.title || "General Task"}
                            </span>
                          </div>
                          <h4
                            onClick={() => setDetailTask(task)}
                            className="font-black text-slate-900 text-sm hover:text-[#1B2A6B] cursor-pointer transition-colors"
                          >
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-normal line-clamp-1 truncate max-w-md">
                            {task.description || "No description"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center font-black text-xs shrink-0">
                            {(task.assigned_to_user?.first_name || task.assigned_to_user?.name || "I")[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">
                              {task.assigned_to_user?.first_name ? `${task.assigned_to_user.first_name} ${task.assigned_to_user.last_name || ""}` : "Assigned Intern"}
                            </p>
                            <p className="text-[10px] text-slate-400">{task.assigned_to_user?.email || ""}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-600 whitespace-nowrap">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {task.marks !== null && task.marks !== undefined ? (
                          <span className="inline-flex px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-black text-xs">
                            {task.marks} / 100
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {getStatusBadge(task.status, task.is_overdue)}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {(task.status === "submitted" || task.status === "under_review" || task.latest_submission) && (
                            <button
                              onClick={() => handleOpenReview(task)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <Award size={13} />
                              <span>Review & Grade</span>
                            </button>
                          )}

                          <button
                            onClick={() => setDetailTask(task)}
                            className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Review & Manual Grading Modal */}
      <AnimatePresence>
        {reviewTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#1B2A6B] text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black">Company Task Verification & Evaluation</h3>
                    <p className="text-[11px] text-slate-300">Review deliverables and record official evaluation</p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewTask(null)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Task Summary Banner */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Task Title</span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">{reviewTask.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Max Score</span>
                    <p className="text-sm font-black text-[#1B2A6B]">100 Marks</p>
                  </div>
                </div>

                {/* Submissions / Proof Inspection */}
                <div>
                  <h5 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[10px]">
                    Submitted Deliverables & Proof Files
                  </h5>
                  {reviewTask.submissions && reviewTask.submissions.length > 0 ? (
                    <div className="space-y-3">
                      {reviewTask.submissions.map((sub: any, idx: number) => (
                        <div key={sub.id || idx} className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                              Iteration #{sub.version || idx + 1}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {sub.created_at ? new Date(sub.created_at).toLocaleString() : ""}
                            </span>
                          </div>

                          <p className="text-slate-700 whitespace-pre-line font-medium">{sub.submission_comment || sub.submission_text}</p>

                          {/* Proof Files */}
                          {sub.proof_files && sub.proof_files.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {sub.proof_files.map((file: string, fIdx: number) => (
                                <a
                                  key={fIdx}
                                  href={getImageUrl(file)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-purple-200 text-purple-900 rounded-lg text-xs font-bold hover:bg-purple-100/50 transition-colors"
                                >
                                  <Eye size={12} /> View Proof File #{fIdx + 1}
                                </a>
                              ))}
                            </div>
                          )}

                          {sub.github_link && (
                            <a
                              href={sub.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
                            >
                              <Github size={13} /> View GitHub Repository
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic p-3 bg-slate-50 rounded-xl">No submissions uploaded yet.</p>
                  )}
                </div>

                {/* Supervisor Evaluation Decision */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Supervisor Decision</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        reviewAction === "approve"
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reviewAction"
                        checked={reviewAction === "approve"}
                        onChange={() => setReviewAction("approve")}
                        className="sr-only"
                      />
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                        {reviewAction === "approve" && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                      </div>
                      <div>
                        <p className="font-black text-emerald-950 text-xs">Approve & Award Marks</p>
                        <p className="text-[10px] text-slate-500">Marks count toward performance</p>
                      </div>
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        reviewAction === "request_changes"
                          ? "border-amber-500 bg-amber-50/50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reviewAction"
                        checked={reviewAction === "request_changes"}
                        onChange={() => setReviewAction("request_changes")}
                        className="sr-only"
                      />
                      <div className="w-5 h-5 rounded-full border-2 border-amber-600 flex items-center justify-center">
                        {reviewAction === "request_changes" && <div className="w-2.5 h-2.5 bg-amber-600 rounded-full" />}
                      </div>
                      <div>
                        <p className="font-black text-amber-950 text-xs">Request Revision</p>
                        <p className="text-[10px] text-slate-500">Require intern to resubmit</p>
                      </div>
                    </label>
                  </div>

                  {reviewAction === "approve" ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Award Marks (0 – 100) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        required
                        value={awardedMarks}
                        onChange={(e) => setAwardedMarks(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Revision Reason & Mandatory Instructions *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={reviewFeedback}
                        onChange={(e) => setReviewFeedback(e.target.value)}
                        placeholder="Explain specific defects or missing requirements..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>
                  )}

                  {reviewAction === "approve" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Evaluator Feedback <span className="font-normal text-slate-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={reviewFeedback}
                        onChange={(e) => setReviewFeedback(e.target.value)}
                        placeholder="Praise, observations, or mentorship tips..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B] resize-none"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isReviewing}
                    onClick={() => setReviewTask(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReviewing}
                    className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      reviewAction === "approve"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    <Check size={14} /> {isReviewing ? "Saving..." : "Confirm Evaluation"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign New Task Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#1B2A6B] text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-black">Assign New Task to Intern</h3>
                    <p className="text-[11px] text-blue-200">Delegate tasks with guidelines & due dates</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="p-5 overflow-y-auto space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign to Approved Intern *</label>
                  <select
                    name="assigned_to"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                  >
                    <option value="">Select Intern...</option>
                    {approvedInterns.map((intern: any) => (
                      <option key={intern.user_id || intern.id} value={intern.user_id || intern.user?.id || intern.id}>
                        {intern.user?.name || `${intern.first_name || ""} ${intern.last_name || ""}`.trim()} ({intern.internship?.title || "Intern"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Build authentication endpoints with JWT"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Description *</label>
                  <textarea
                    rows={2}
                    name="description"
                    required
                    placeholder="Detailed explanation of requirements..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      defaultValue="medium"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      name="due_date"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Deliverables</label>
                  <input
                    type="text"
                    name="expected_deliverable"
                    placeholder="e.g. GitHub Pull Request + PDF API test documentation"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-5 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={14} /> {isCreating ? "Assigning..." : "Assign Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CompanyDashboardLayout>
  );
}
