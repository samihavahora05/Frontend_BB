import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { InternshipService } from "../../../src/lib/api/admin/InternshipService";

export default function AdminEditInternshipPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    location: "",
    duration: "",
    stipend: "",
    startDate: "",
    type: "Remote",
    category: "",
    industry: "",
    experienceLevel: "Beginner",
    requirements: "",
    benefits: "",
    applicationDeadline: "",
    vacancy: "",
    status: "open",
    videoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      InternshipService.getInternship(id as string)
        .then((res) => {
          const data = res.data;
          setForm({
            title: data.title || "",
            companyName: data.company?.name || data.company?.first_name || "",
            description: data.description || "",
            location: data.location || "",
            duration: data.duration || "",
            stipend: data.stipend || "",
            startDate: data.start_date ? data.start_date.split('T')[0] : "",
            type: data.mode || "Remote",
            category: data.department || "",
            industry: data.skills_required && data.skills_required.length > 0 ? data.skills_required[0] : "",
            experienceLevel: "Beginner",
            requirements: data.eligibility || "",
            benefits: data.learning_outcomes || "",
            applicationDeadline: data.application_deadline ? data.application_deadline.split('T')[0] : "",
            vacancy: data.openings ? String(data.openings) : "",
            status: data.status || "open",
            videoUrl: "",
          });
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Failed to load internship");
          setIsLoading(false);
        });
    }
  }, [id]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await InternshipService.updateInternship(id as string, {
        title:                form.title,
        description:          form.description,
        location:             form.location || null,
        duration:             form.duration || null,
        stipend:              form.stipend ? Number(String(form.stipend).replace(/[^0-9.]/g, '')) : null,
        start_date:           form.startDate || null,
        mode:                 form.type,
        department:           form.category || null,
        eligibility:          form.requirements || null,
        learning_outcomes:    form.benefits || null,
        application_deadline: form.applicationDeadline || null,
        openings:             form.vacancy ? Number(form.vacancy) : 1,
        status:               form.status,
        skills_required:      form.industry ? [form.industry] : [],
      });
      toast.success("Internship updated successfully!");
      router.push("/admin/internships");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update internship";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-[#1B2A6B]" size={32} />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/internships" className="hover:text-[#1B2A6B]">All Internships</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Edit Internship</span>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">EDIT INTERNSHIP</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-800">Edit Internship Details</h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                  TITLE <span className="text-rose-500">*</span>
                </label>
                <input required value={form.title} onChange={set("title")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                  COMPANY NAME <span className="text-rose-500">*</span>
                </label>
                <input required value={form.companyName} onChange={set("companyName")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                DESCRIPTION <span className="text-rose-500">*</span>
              </label>
              <textarea required rows={4} value={form.description} onChange={set("description")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">LOCATION</label>
                <input value={form.location} onChange={set("location")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">DURATION</label>
                <input value={form.duration} onChange={set("duration")} placeholder="e.g. 3 months" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">STIPEND</label>
                <input value={form.stipend} onChange={set("stipend")} placeholder="e.g. ₹5000/month" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">START DATE</label>
                <input type="date" value={form.startDate} onChange={set("startDate")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">TYPE</label>
                <div className="relative">
                    <select value={form.type} onChange={set("type")} className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">CATEGORY</label>
                <input value={form.category} onChange={set("category")} placeholder="e.g. Software Development" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">INDUSTRY</label>
                <input value={form.industry} onChange={set("industry")} placeholder="e.g. Technology" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">EXPERIENCE LEVEL</label>
                <div className="relative">
                  <select value={form.experienceLevel} onChange={set("experienceLevel")} className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">VACANCY</label>
                <input type="number" min={1} value={form.vacancy} onChange={set("vacancy")} placeholder="e.g. 5" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">REQUIREMENTS</label>
              <textarea rows={3} value={form.requirements} onChange={set("requirements")} placeholder="List the requirements for this internship" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all resize-none" />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">BENEFITS</label>
              <textarea rows={3} value={form.benefits} onChange={set("benefits")} placeholder="List the benefits for this internship" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">APPLICATION DEADLINE</label>
                <input type="date" value={form.applicationDeadline} onChange={set("applicationDeadline")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">STATUS</label>
                <div className="relative">
                  <select value={form.status} onChange={set("status")} className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="open">Open</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                    <option value="archived">Archived</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 border-t border-slate-100 flex items-center gap-3">
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-70">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isSubmitting ? "Updating..." : "Update Internship"}
            </button>
            <Link href="/admin/internships" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-all">Cancel</Link>
          </div>
        </div>
      </form>
    </AdminDashboardLayout>
  );
}
