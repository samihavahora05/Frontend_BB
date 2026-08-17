import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Plus, Trash2, Image as ImageIcon, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { ContestService } from "../../../src/lib/api/admin/ContestService";

interface Task {
  id: number;
  title: string;
  marks: number;
}

export default function AdminAddContestPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    price: "",
    status: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalMarks = tasks.reduce((sum, t) => sum + t.marks, 0);

  const handleImageBrowse = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    input.click();
  };

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: "", marks: 10 },
    ]);
  };

  const updateTask = (id: number, field: "title" | "marks", value: string | number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    if (!form.description) { toast.error("Description is required"); return; }
    if (!form.startDate || !form.endDate) { toast.error("Start and end dates are required"); return; }
    if (new Date(form.endDate) <= new Date(form.startDate)) { toast.error("End date must be after start date"); return; }
    if (!form.status) { toast.error("Status is required"); return; }

    setIsSubmitting(true);
    try {
      await ContestService.createContest({
        title: form.title,
        description: form.description,
        start_date: form.startDate,
        end_date: form.endDate,
        status: form.status as "upcoming" | "ongoing" | "completed",
      });
      toast.success("Contest created successfully!");
      router.push("/admin/contests");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create contest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminDashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/contests" className="hover:text-[#1B2A6B]">All Contest</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Add Contest</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">ADD CONTEST</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-800">Add Contest</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                TITLE <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder=""
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                DESCRIPTION
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Image */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                IMAGE
              </label>
              <div
                className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all"
                onClick={handleImageBrowse}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <ImageIcon size={18} className="text-slate-400" />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-500">
                  {imageFile ? imageFile.name : "BROWSE"}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleImageBrowse(); }}
                  className="ml-auto px-5 py-2 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-xs font-black rounded-lg transition-all"
                >
                  BROWSE
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5">Recommended size (800x600)</p>
            </div>

            {/* Tasks */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-black text-slate-800">Tasks</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Total Marks: {totalMarks}/100
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addTask}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-xs font-black rounded-lg transition-all"
                >
                  <Plus size={13} /> Add Task
                </button>
              </div>
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-sm font-semibold text-slate-400">
                  No tasks added yet. Click "+ Add Task" to begin.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 p-4 space-y-3">
                  {tasks.map((task, idx) => (
                    <div key={task.id} className="flex items-center gap-3 pt-3 first:pt-0">
                      <span className="text-xs font-black text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        value={task.title}
                        onChange={(e) => updateTask(task.id, "title", e.target.value)}
                        placeholder="Task title..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={task.marks}
                        onChange={(e) => updateTask(task.id, "marks", Number(e.target.value))}
                        className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] text-center"
                      />
                      <span className="text-xs text-slate-400 font-semibold">marks</span>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  START DATE
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  END DATE
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white"
                />
              </div>
            </div>

            {/* Price & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  PRICE
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                  STATUS
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                >
                  <option value="">Select Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="px-6 py-5 border-t border-slate-100 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {isSubmitting ? "Creating..." : "Create Contest"}
            </button>
            <Link href="/admin/contests" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-all">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </AdminDashboardLayout>
  );
}
