import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckSquare,
  Sparkles,
  Download,
  ExternalLink,
  Github,
  Video,
  X,
  Send,
  FileText,
  Briefcase,
  Building2,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Check,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InternshipService } from '../../../src/lib/api/admin/InternshipService';
import { getImageUrl } from '../../../src/lib/imageUtils';
import toast from 'react-hot-toast';

type TaskStatusFilter = 'all' | 'submitted' | 'in_progress' | 'changes_required' | 'completed' | 'overdue';

export default function AdminTasksPage() {
  // Filters & State
  const [activeTab, setActiveTab] = useState<'all' | 'assigned_by_me' | 'my_tasks'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Query Params
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (statusFilter !== 'all') {
      if (statusFilter === 'submitted') {
        params.status = 'submitted';
      } else {
        params.status = statusFilter;
      }
    }
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    return params;
  }, [statusFilter, priorityFilter, searchQuery]);

  // SWR Hooks
  const { data: tasks, isLoading: tasksLoading, mutate: mutateTasks } = InternshipService.useGlobalTasks(queryParams);
  const { data: stats, mutate: mutateStats } = InternshipService.useGlobalTaskStats();
  const { data: approvedInterns } = InternshipService.useApprovedInterns();

  // Modals
  const [reviewTaskItem, setReviewTaskItem] = useState<any | null>(null);
  const [selectedIterationIndex, setSelectedIterationIndex] = useState<number>(0);
  const [decisionType, setDecisionType] = useState<'approve' | 'request_changes'>('approve');
  const [awardedMarks, setAwardedMarks] = useState<number>(100);
  const [adminFeedback, setAdminFeedback] = useState<string>('');
  const [revisionReason, setRevisionReason] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Detail Modal
  const [detailTaskItem, setDetailTaskItem] = useState<any | null>(null);

  // Create Task Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null);
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [checklistInput, setChecklistInput] = useState<string>('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Helpers
  const parseChecklist = (instructions?: string): string[] => {
    if (!instructions) return [];
    const lines = instructions.split('\n');
    const list: string[] = [];
    let inChecklist = false;

    lines.forEach((line) => {
      if (line.includes('Checklist Requirements:')) {
        inChecklist = true;
        return;
      }
      if (inChecklist && (line.startsWith('• [ ]') || line.startsWith('- [ ]') || line.startsWith('•') || line.startsWith('-'))) {
        const clean = line.replace(/^[•\-]\s*(\[\s*\])?\s*/, '').trim();
        if (clean) list.push(clean);
      }
    });

    return list;
  };

  const getPriorityBadge = (priority?: string) => {
    const p = (priority || 'medium').toLowerCase();
    if (p === 'urgent') return <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-rose-100 text-rose-700">Urgent</span>;
    if (p === 'high') return <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-orange-100 text-orange-700">High</span>;
    if (p === 'low') return <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-slate-100 text-slate-700">Low</span>;
    return <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-sky-100 text-sky-700">Medium</span>;
  };

  const getStatusBadge = (status?: string, isOverdue?: boolean) => {
    if (isOverdue && status !== 'completed' && status !== 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle size={12} /> Overdue
        </span>
      );
    }
    const s = (status || 'assigned').toLowerCase();
    if (s === 'completed' || s === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} /> Approved & Scored
        </span>
      );
    }
    if (s === 'submitted' || s === 'under_review' || s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
          <Clock size={12} /> Submitted For Review
        </span>
      );
    }
    if (s === 'changes_required' || s === 'resubmit') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
          <RotateCcw size={12} /> Needs Revision
        </span>
      );
    }
    if (s === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
          <Clock size={12} /> In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
        Assigned
      </span>
    );
  };

  // Open Review Modal
  const handleOpenReview = async (task: any) => {
    try {
      // Fetch fresh full task detail including submissions
      const full = await InternshipService.getTask(task.id);
      const taskData = full?.data || task;
      setReviewTaskItem(taskData);
      const subs = taskData.submissions || (taskData.latest_submission ? [taskData.latest_submission] : []);
      // Default to latest iteration (highest version)
      setSelectedIterationIndex(0);
      setDecisionType('approve');
      setAwardedMarks(taskData.max_marks || 100);
      setAdminFeedback('Excellent work, all deliverables verified and validated on time.');
      setRevisionReason('');
    } catch {
      setReviewTaskItem(task);
      setSelectedIterationIndex(0);
      setDecisionType('approve');
      setAwardedMarks(100);
      setAdminFeedback('');
      setRevisionReason('');
    }
  };

  // Submit Review Decision (Approve / Request Changes)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTaskItem) return;

    if (decisionType === 'request_changes' && !revisionReason.trim()) {
      toast.error('Please specify the revision reason and required corrections.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const payload: any = {
        action: decisionType === 'approve' ? 'approve' : 'request_changes',
        feedback: decisionType === 'approve' ? adminFeedback.trim() : revisionReason.trim(),
      };
      if (decisionType === 'approve') {
        payload.marks = Number(awardedMarks);
      }

      await InternshipService.reviewTask(reviewTaskItem.id, payload);
      toast.success(decisionType === 'approve' ? 'Task approved and marks awarded!' : 'Revision request sent to intern.');
      setReviewTaskItem(null);
      mutateTasks();
      mutateStats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await InternshipService.deleteTask(taskId);
      toast.success('Task deleted successfully.');
      mutateTasks();
      mutateStats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete task.');
    }
  };

  // Create Task Submit
  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAssignee) {
      toast.error('Please select an assignee.');
      return;
    }
    const form = new FormData(e.currentTarget);
    setIsCreatingTask(true);
    try {
      const instructionsText = (form.get('instructions') as string) || '';
      const checklistStr =
        checklistItems.length > 0
          ? `\n\nChecklist Requirements:\n${checklistItems.map((item) => `• [ ] ${item}`).join('\n')}`
          : '';
      const fullInstructions = (instructionsText + checklistStr).trim();

      await InternshipService.createTask({
        internship_id: selectedAssignee.internship_id,
        assigned_to: selectedAssignee.intern_id,
        company_id: selectedAssignee.company_id || undefined,
        title: form.get('title'),
        priority: form.get('priority') || 'medium',
        max_marks: Number(form.get('max_marks')) || 100,
        due_date: form.get('due_date'),
        description: instructionsText || form.get('title'),
        instructions: fullInstructions,
        expected_deliverable: form.get('expected_deliverable') || 'Complete tasks and submit deliverable proof',
      });

      toast.success('Task created and assigned successfully!');
      setIsCreateModalOpen(false);
      setChecklistItems([]);
      setChecklistInput('');
      setSelectedAssignee(null);
      mutateTasks();
      mutateStats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create task.');
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Checklist handler
  const handleAddChecklistItem = () => {
    const trimmed = checklistInput.trim();
    if (!trimmed) return;
    if (checklistItems.includes(trimmed)) {
      toast.error('Checklist item already added.');
      return;
    }
    setChecklistItems([...checklistItems, trimmed]);
    setChecklistInput('');
  };

  const handleRemoveChecklistItem = (idx: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== idx));
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Internship Tasks & Submissions | Blueboxx DA Admin</title>
      </Head>

      <div className="space-y-6 pb-12">
        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl font-black text-[#0d1635]">Internship Tasks & Submissions</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor, review, grade, and assign internship task deliverables with verified performance tracking
          </p>
        </div>

        {/* ── KPI Metric Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3">
          {/* Card 1: Total Tasks */}
          <div
            onClick={() => setStatusFilter('all')}
            className={`bg-white rounded-2xl p-3.5 min-w-0 border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
              statusFilter === 'all' ? 'border-[#1B2A6B] ring-2 ring-[#1B2A6B]/15 bg-slate-50/40' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Tasks</span>
              <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <ListTodo size={12} />
              </div>
            </div>
            <div className="text-2xl font-black text-[#0d1635]">{stats?.total_tasks ?? 0}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
              <span>All assigned</span>
              {statusFilter === 'all' && (
                <span className="text-[#1B2A6B] bg-blue-50 px-1.5 py-0.5 rounded font-black text-[9px]">Active</span>
              )}
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div
            onClick={() => setStatusFilter('in_progress')}
            className={`bg-white rounded-2xl p-3.5 min-w-0 border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
              statusFilter === 'in_progress' ? 'border-blue-600 ring-2 ring-blue-500/15 bg-blue-50/30' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">In Progress</span>
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock size={12} />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-600">{stats?.in_progress ?? 0}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
              <span>In flight</span>
              {statusFilter === 'in_progress' && (
                <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-black text-[9px]">Active</span>
              )}
            </div>
          </div>

          {/* Card 3: Review Required */}
          <div
            onClick={() => setStatusFilter('submitted')}
            className={`bg-white rounded-2xl p-3.5 min-w-0 border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
              statusFilter === 'submitted'
                ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/15 bg-purple-50/30'
                : 'border-purple-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">Review Required</span>
              <div className="w-6 h-6 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center">
                <Send size={12} />
              </div>
            </div>
            <div className="text-2xl font-black text-[#7C3AED]">{stats?.pending_review ?? 0}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-100 text-[10px] text-purple-700 font-bold">
              <span>Proof uploaded</span>
              {statusFilter === 'submitted' && (
                <span className="text-[#7C3AED] bg-purple-100 px-1.5 py-0.5 rounded font-black text-[9px]">Active</span>
              )}
            </div>
          </div>

          {/* Card 4: Needs Revision */}
          <div
            onClick={() => setStatusFilter('changes_required')}
            className={`bg-white rounded-2xl p-3.5 min-w-0 border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
              statusFilter === 'changes_required' ? 'border-amber-500 ring-2 ring-amber-500/15 bg-amber-50/30' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Needs Revision</span>
              <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <RotateCcw size={12} />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">{stats?.changes_required ?? 0}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
              <span>Feedback sent</span>
            </div>
          </div>

          {/* Card 5: Approved & Scored */}
          <div
            onClick={() => setStatusFilter('completed')}
            className={`bg-white rounded-2xl p-3.5 min-w-0 border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
              statusFilter === 'completed' ? 'border-emerald-600 ring-2 ring-emerald-500/15 bg-emerald-50/30' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Approved & Scored</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award size={12} />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats?.completed ?? 0}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
              <span>100% Marks Score</span>
            </div>
          </div>

          {/* Card 6: Overdue */}
          <div
            onClick={() => setStatusFilter('overdue')}
            className={`bg-white rounded-2xl p-3.5 min-w-0 border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
              statusFilter === 'overdue' ? 'border-rose-600 ring-2 ring-rose-500/15 bg-rose-50/30' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Overdue</span>
              <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={12} />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600">{stats?.overdue ?? 0}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
              <span>Passed deadline</span>
            </div>
          </div>
        </div>

        {/* ── Toolbar: Tabs, Search, Filters, View Switch, Create Button ── */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Tab Switcher & View Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setActiveTab('all'); setStatusFilter('all'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-[#1B2A6B] shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => { setActiveTab('all'); setStatusFilter('submitted'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'submitted' ? 'bg-purple-600 text-white shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Review Required
              </button>
              <button
                onClick={() => { setActiveTab('all'); setStatusFilter('in_progress'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'in_progress' ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => { setActiveTab('all'); setStatusFilter('completed'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'completed' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Approved
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-3">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Table View"
              >
                <TableIcon size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          {/* Right: Search, Status Filter, Priority Filter, Create Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1B2A6B]"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted for Review</option>
              <option value="in_progress">In Progress</option>
              <option value="changes_required">Needs Revision</option>
              <option value="completed">Approved & Scored</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1B2A6B]"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <button
              onClick={() => {
                if (approvedInterns && approvedInterns.length > 0) {
                  setSelectedAssignee(approvedInterns[0]);
                }
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0d1635] hover:bg-[#1B2A6B] text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus size={14} /> Create Task
            </button>
          </div>
        </div>

        {/* ── Tasks Table / Grid View ── */}
        {tasksLoading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center">
            <div className="w-8 h-8 border-3 border-[#1B2A6B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-bold">Loading organization tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ListTodo size={24} />
            </div>
            <h3 className="text-base font-black text-slate-800">No tasks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No organizational tasks matching your active filters. Click "+ Create Task" to assign work to interns.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 w-[40%]">Task Details</th>
                    <th className="px-5 py-4 w-[20%]">Assigned Intern</th>
                    <th className="px-4 py-4 w-[12%]">Due Date</th>
                    <th className="px-4 py-4 text-center w-[14%]">Evaluation & Status</th>
                    <th className="px-6 py-4 text-right w-[14%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {tasks.map((task: any) => {
                    const checklist = parseChecklist(task.instructions);
                    const totalCheckCount = checklist.length;
                    const isSubmitted = task.status === 'submitted' || task.status === 'under_review';
                    const isRevisionNeeded = task.status === 'changes_required' || task.status === 'resubmit';

                    return (
                      <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Task Details - Generous Width & Multi-line title/description */}
                        <td className="px-6 py-4.5">
                          <div className="space-y-1.5 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              {getPriorityBadge(task.priority)}
                              <span className="px-2 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 rounded-md">
                                {task.category || 'General Task'}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                Max {task.max_marks || 100} Marks
                              </span>
                            </div>
                            <h4
                              onClick={() => setDetailTaskItem(task)}
                              className="font-extrabold text-[#0d1635] text-sm hover:text-[#1B2A6B] cursor-pointer transition-colors leading-snug line-clamp-2"
                            >
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
                              {task.description || task.instructions || 'No description provided'}
                            </p>
                            {totalCheckCount > 0 && (
                              <div className="flex items-center gap-2 pt-1">
                                <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-[#1B2A6B] h-1.5 rounded-full w-0" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                  0/{totalCheckCount} Deliverables completed
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Assigned Intern */}
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0d1635] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              {((task.assigned_to?.name || task.assignedTo?.name || task.assigned_to_user?.name || task.assigned_to?.first_name || 'I')[0]).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs">
                                {task.assigned_to?.name || task.assignedTo?.name || task.assigned_to_user?.name || (task.assigned_to ? (`${task.assigned_to.first_name || ''} ${task.assigned_to.last_name || ''}`).trim() : '') || 'Intern'}
                              </p>
                              <p className="text-[11px] text-slate-400 font-semibold truncate max-w-[180px]">
                                {task.internship?.title || task.internship?.company_name || 'Backend Developer Intern'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="px-4 py-4.5 whitespace-nowrap font-medium text-slate-600">
                          {task.due_date ? (
                            <div>
                              <span className={`text-xs block ${task.is_overdue ? 'text-rose-600 font-bold' : 'font-semibold text-slate-700'}`}>
                                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {task.is_overdue && (
                                <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider block">
                                  Overdue
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">No deadline</span>
                          )}
                        </td>

                        {/* Evaluation & Status (Combined) */}
                        <td className="px-4 py-4.5 text-center whitespace-nowrap">
                          <div className="flex flex-col items-center gap-1.5">
                            {getStatusBadge(task.status, task.is_overdue)}
                            {task.marks !== undefined && task.marks !== null ? (
                              <span className="inline-flex px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-black text-[11px]">
                                {task.marks} / {task.max_marks || 100} Marks
                              </span>
                            ) : isSubmitted ? (
                              <span className="text-[10px] font-bold text-purple-600">
                                Deliverable submitted
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">
                                Max {task.max_marks || 100} Marks
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* Verify & Score Button for Submitted or Revision Tasks */}
                            {(isSubmitted || isRevisionNeeded || task.status === 'completed' || task.status === 'in_progress') && (
                              <button
                                onClick={() => handleOpenReview(task)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black transition-all shadow-xs hover:shadow-md cursor-pointer"
                              >
                                <Sparkles size={13} /> Verify & Score
                              </button>
                            )}

                            <button
                              onClick={() => setDetailTaskItem(task)}
                              className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}</tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status, task.is_overdue)}
                  </div>
                  <h3
                    onClick={() => setDetailTaskItem(task)}
                    className="font-black text-[#0d1635] text-base hover:text-[#1B2A6B] cursor-pointer line-clamp-2"
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-3">
                    {task.description || task.instructions || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailTaskItem(task)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleOpenReview(task)}
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={13} /> Verify & Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ── MODAL 1: Admin Task Verification & Manual Evaluation (Screenshots 2, 3, 4) ── */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {reviewTaskItem && (() => {
          const submissions: any[] =
            reviewTaskItem.submissions && reviewTaskItem.submissions.length > 0
              ? reviewTaskItem.submissions
              : reviewTaskItem.latest_submission
              ? [reviewTaskItem.latest_submission]
              : [];

          const currentSubmission = submissions[selectedIterationIndex] || submissions[0] || null;
          const checklist = parseChecklist(reviewTaskItem.instructions);
          const totalCheckCount = checklist.length;

          // Parse proof files
          let proofFiles: string[] = [];
          if (currentSubmission) {
            if (Array.isArray(currentSubmission.proof_files)) {
              proofFiles = currentSubmission.proof_files;
            } else if (Array.isArray(currentSubmission.file_paths)) {
              proofFiles = currentSubmission.file_paths;
            } else if (typeof currentSubmission.proof_files === 'string') {
              try {
                proofFiles = JSON.parse(currentSubmission.proof_files);
              } catch {
                proofFiles = [currentSubmission.proof_files];
              }
            }
          }

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                onClick={() => !isSubmittingReview && setReviewTaskItem(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 relative overflow-hidden max-h-[92vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">
                    Admin Task Verification & Manual Evaluation
                  </h3>
                  <button
                    disabled={isSubmittingReview}
                    onClick={() => setReviewTaskItem(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmitReview} className="p-6 overflow-y-auto space-y-5 text-xs">
                  {/* Card 1: Reviewing Task Info */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Reviewing Task
                      </span>
                      <span className="text-[11px] font-black text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        Max Marks: {reviewTaskItem.max_marks || 100}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-[#0d1635]">{reviewTaskItem.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      Assignee:{' '}
                      <span className="text-slate-800 font-bold">
                        {reviewTaskItem.assigned_to_user?.name || `${reviewTaskItem.assigned_to_user?.first_name || ''} ${reviewTaskItem.assigned_to_user?.last_name || ''}`.trim() || 'Samiha Vahora'}
                      </span>{' '}
                      • Department:{' '}
                      <span className="text-slate-800 font-bold">
                        {reviewTaskItem.internship?.category || 'Engineering'}
                      </span>{' '}
                      • Priority:{' '}
                      <span className="text-slate-800 font-bold capitalize">
                        {reviewTaskItem.priority || 'Medium'}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Scope: {reviewTaskItem.description || reviewTaskItem.instructions || 'Standard Deliverable Evaluation'}
                    </p>
                  </div>

                  {/* Card 2: Checklist Progress */}
                  <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sky-900 font-black text-xs">
                      <CheckSquare size={15} className="text-sky-600" />
                      <span>Checklist Progress</span>
                    </div>
                    <span className="text-[11px] font-bold text-sky-800 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200">
                      0 / {totalCheckCount || 2} Completed (0% Work Done)
                    </span>
                  </div>

                  {/* Card 3: Employee Proof & Deliverables with Iteration Tabs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <FileText size={14} /> Employee Proof & Deliverables
                      </span>

                      {/* Iteration Switcher Pills */}
                      {submissions.length > 1 && (
                        <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-xl border border-purple-100">
                          {submissions.map((sub: any, idx: number) => {
                            const versionNum = sub.version || submissions.length - idx;
                            const isActive = selectedIterationIndex === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedIterationIndex(idx)}
                                className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-[#7C3AED] text-white shadow-xs'
                                    : 'text-purple-700 hover:bg-purple-100'
                                }`}
                              >
                                Iteration #{versionNum}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Active Iteration Content Card */}
                    <div className="bg-purple-50/40 border border-purple-200/80 rounded-2xl p-4.5 space-y-3.5">
                      {currentSubmission ? (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-black text-purple-950">
                              Submission #{currentSubmission.version || submissions.length - selectedIterationIndex}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {currentSubmission.created_at
                                ? new Date(currentSubmission.created_at).toLocaleString()
                                : 'Just now'}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-purple-100 text-purple-800">
                              Ready for Review
                            </span>
                          </div>

                          {/* Employee Completion Note */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-purple-900 mb-1">
                              Employee Completion Note:
                            </label>
                            <div className="bg-white p-3 rounded-xl border border-purple-100 text-xs font-medium text-slate-800 whitespace-pre-line">
                              {currentSubmission.submission_comment ||
                                currentSubmission.submission_text ||
                                'No completion note attached.'}
                            </div>
                          </div>

                          {/* Attached Proof Files */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-purple-900 mb-1.5">
                              Attached Proof Files ({proofFiles.length}):
                            </label>

                            {proofFiles.length > 0 ? (
                              <div className="space-y-2">
                                {proofFiles.map((fileUrl: string, idx: number) => {
                                  const fileName = fileUrl.split('/').pop() || `Proof-Document-${idx + 1}.png`;
                                  const resolvedUrl = getImageUrl(fileUrl);
                                  const isImg = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);

                                  return (
                                    <div
                                      key={idx}
                                      className="bg-white border border-purple-100 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-purple-300 transition-colors"
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black text-[10px] shrink-0">
                                          {isImg ? 'IMG' : 'DOC'}
                                        </div>
                                        <div className="truncate">
                                          <p className="font-bold text-slate-900 text-xs truncate max-w-[240px]">
                                            {fileName}
                                          </p>
                                          <p className="text-[10px] text-slate-400 font-semibold">Ready for inspection</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <a
                                          href={resolvedUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1635] hover:bg-[#1B2A6B] text-white text-[11px] font-bold rounded-xl shadow-xs transition-colors"
                                        >
                                          <Eye size={12} /> View & Inspect Proof
                                        </a>
                                        <a
                                          href={resolvedUrl}
                                          download
                                          target="_blank"
                                          rel="noreferrer"
                                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                          title="Download File"
                                        >
                                          <Download size={14} />
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-slate-400 italic text-[11px]">No file attachments uploaded.</p>
                            )}
                          </div>

                          {/* Extra Links (GitHub / Video) */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {currentSubmission.github_link && (
                              <a
                                href={currentSubmission.github_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                              >
                                <Github size={13} /> View GitHub Repo <ExternalLink size={11} />
                              </a>
                            )}
                            {currentSubmission.video_link && (
                              <a
                                href={currentSubmission.video_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors"
                              >
                                <Video size={13} /> Demo Video <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-slate-400 italic text-xs">No deliverables submitted for this task yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Card 4: Admin Decision Radio Options (Screenshots 3 & 4) */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-800">
                      ADMIN DECISION *
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1: Approve & Award Marks */}
                      <div
                        onClick={() => setDecisionType('approve')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          decisionType === 'approve'
                            ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                            decisionType === 'approve'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {decisionType === 'approve' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-xs">Approve & Award Marks</p>
                          <p className="text-[10px] text-slate-400 font-semibold">task fulfilled & scored</p>
                        </div>
                      </div>

                      {/* Option 2: Request Revision */}
                      <div
                        onClick={() => setDecisionType('request_changes')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                          decisionType === 'request_changes'
                            ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                            decisionType === 'request_changes'
                              ? 'border-amber-600 bg-amber-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {decisionType === 'request_changes' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-xs">Request Revision</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Requires correction</p>
                        </div>
                      </div>
                    </div>

                    {/* Conditional Form Fields based on decision */}
                    {decisionType === 'approve' ? (
                      <div className="space-y-3 bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-emerald-950">
                              Marks Awarded (0 - {reviewTaskItem.max_marks || 100}) *
                            </label>
                            <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                              {awardedMarks} / {reviewTaskItem.max_marks || 100} (
                              {Math.round((awardedMarks / (reviewTaskItem.max_marks || 100)) * 100)}%)
                            </span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            max={reviewTaskItem.max_marks || 100}
                            value={awardedMarks}
                            onChange={(e) => setAwardedMarks(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                          <p className="text-[10px] text-emerald-800 font-medium mt-1">
                            Performance score will be automatically updated based on verified awarded marks.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-emerald-950 mb-1">
                            Admin Feedback / Review Comments <span className="font-normal text-slate-400">(Optional)</span>
                          </label>
                          <textarea
                            rows={3}
                            value={adminFeedback}
                            onChange={(e) => setAdminFeedback(e.target.value)}
                            placeholder="e.g. Excellent work, all deliverables verified and validated on time."
                            className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-amber-50/40 border border-amber-200 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-amber-950 mb-1">
                          Revision Reason & Required Corrections *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={revisionReason}
                          onChange={(e) => setRevisionReason(e.target.value)}
                          placeholder="e.g. Please update the missing April reconciliation figures and re-upload the updated Excel report..."
                          className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Modal Footer Buttons */}
                  <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isSubmittingReview}
                      onClick={() => setReviewTaskItem(null)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    {decisionType === 'approve' ? (
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={14} strokeWidth={3} />{' '}
                        {isSubmittingReview ? 'Saving Marks...' : 'Approve & Save Marks'}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send size={13} />{' '}
                        {isSubmittingReview ? 'Sending...' : 'Send Revision Request'}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* ── MODAL 2: Create & Assign Task with Marks ── */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => !isCreatingTask && setIsCreateModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl z-10 relative overflow-hidden max-h-[92vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-black text-slate-900">
                  Admin Create & Assign Task with Marks
                </h3>
                <button
                  disabled={isCreatingTask}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-xs">
                {/* Assignee Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Target Intern Assignee *
                  </label>
                  <select
                    required
                    value={selectedAssignee?.application_id || ''}
                    onChange={(e) => {
                      const found = (approvedInterns || []).find(
                        (i: any) => String(i.application_id) === e.target.value
                      );
                      setSelectedAssignee(found || null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                  >
                    <option value="">-- Choose Approved Intern --</option>
                    {(approvedInterns || []).map((item: any) => (
                      <option key={item.application_id} value={item.application_id}>
                        {item.intern_name} ({item.internship_title} — {item.company_name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Build User Authentication API"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                  />
                </div>

                {/* Max Marks & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Maximum Evaluation Marks *
                    </label>
                    <input
                      type="number"
                      name="max_marks"
                      required
                      defaultValue="100"
                      min="1"
                      max="100"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                    <select
                      name="priority"
                      defaultValue="medium"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    name="due_date"
                    required
                    defaultValue={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Task Work Instructions & Scope *
                  </label>
                  <textarea
                    rows={3}
                    name="instructions"
                    required
                    placeholder="Describe deliverables and instructions clearly..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B] resize-none"
                  />
                </div>

                {/* Dynamic Checklist Requirements */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Checklist Requirements (Intern can check off)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={checklistInput}
                      onChange={(e) => setChecklistInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddChecklistItem();
                        }
                      }}
                      placeholder="e.g. Design relational database schema in MySQL"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B]"
                    />
                    <button
                      type="button"
                      onClick={handleAddChecklistItem}
                      className="px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#0d1635] transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {checklistItems.length > 0 && (
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 max-h-36 overflow-y-auto">
                      {checklistItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl text-xs"
                        >
                          <span className="text-slate-700 font-medium truncate">• {item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveChecklistItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isCreatingTask}
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingTask}
                    className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {isCreatingTask ? 'Creating...' : 'Create & Assign Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: View Details Modal ── */}
      <AnimatePresence>
        {detailTaskItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setDetailTaskItem(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl z-10 relative overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-black text-slate-900">Task Overview & Instructions</h3>
                <button
                  onClick={() => setDetailTaskItem(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Title</span>
                  <h4 className="text-base font-black text-[#0d1635] mt-0.5">{detailTaskItem.title}</h4>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Work Instructions & Scope
                  </span>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium whitespace-pre-line mt-1">
                    {detailTaskItem.instructions || detailTaskItem.description || 'No instructions provided.'}
                  </div>
                </div>

                {detailTaskItem.marks !== undefined && detailTaskItem.marks !== null && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      Score & Evaluation
                    </span>
                    <p className="text-lg font-black text-emerald-700 mt-1">
                      {detailTaskItem.marks} / {detailTaskItem.max_marks || 100}
                    </p>
                    {detailTaskItem.feedback && (
                      <p className="text-xs text-emerald-900 font-medium mt-1 pt-1 border-t border-emerald-200">
                        {detailTaskItem.feedback}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
                <button
                  onClick={() => setDetailTaskItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminDashboardLayout>
  );
}
