import React, { useState } from "react";
import { useRouter } from "next/router";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Briefcase, MapPin, Building, Target, X, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../src/lib/axios";

type JobCategory = "Job" | "Internship";

export default function PostJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript"]);
  const [newSkill, setNewSkill] = useState("");
  const [category, setCategory] = useState<JobCategory>("Job");

  const [form, setForm] = useState({
    title: "",
    type: "Full-Time",
    locationType: "Remote",
    location: "",
    salary: "",
    description: "",
  });

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);

    try {
      // Basic salary parsing
      let salaryMin = null;
      let salaryMax = null;
      if (form.salary) {
        const numbers = form.salary.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          salaryMin = parseInt(numbers[0]);
          salaryMax = parseInt(numbers[1]);
        } else if (numbers && numbers.length === 1) {
          salaryMin = parseInt(numbers[0]);
          salaryMax = parseInt(numbers[0]);
        }
      }

      await api.post("/company/jobs", {
        title: form.title,
        employment_type: category === "Internship" ? "Internship" : form.type,
        experience_level: "Entry Level", // Fallback, could add to form
        remote_type: form.locationType,
        location: form.locationType === "Remote" ? "Remote" : form.location,
        salary_min: salaryMin,
        salary_max: salaryMax,
        description: form.description,
        required_skills: skills,
        status: "active" // Or draft if we want
      });
      setSubmitted(true);
      toast.success("Job posted successfully!");
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error("Failed to post job: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all";
  const labelCls = "block text-xs font-bold text-slate-600 uppercase mb-2";

  // ── Success Screen ──
  if (submitted) {
    return (
      <CompanyDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <AnimatedContent direction="up" className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {category} Submitted!
            </h2>
            <p className="text-slate-500 font-medium mb-6">
              Your {category.toLowerCase()} posting &quot;{form.title}&quot; has been submitted for admin review. You&apos;ll be notified once it&apos;s approved.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => router.push("/company/jobs")}
                className="px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl hover:bg-[#0d1635] transition-colors"
              >
                View My Postings
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ title: "", type: "Full-Time", locationType: "Remote", location: "", salary: "", description: "" });
                  setSkills([]);
                }}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
              >
                Post Another
              </button>
            </div>
          </AnimatedContent>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Post a New {category}</h1>
        <p className="text-slate-500 font-medium text-sm">
          Create a new {category.toLowerCase()} posting. It will be sent to Blueboxx admins for approval before going live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2">
          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Category Toggle */}
              <div>
                <label className={labelCls}>Posting Type *</label>
                <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 w-fit">
                  {(["Job", "Internship"] as JobCategory[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                        category === c
                          ? "bg-[#1B2A6B] text-white shadow"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className={labelCls}>{category} Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={category === "Job" ? "e.g. Senior Frontend Developer" : "e.g. UI/UX Design Intern"}
                    className={inputCls}
                  />
                </div>

                {category === "Job" && (
                  <div>
                    <label className={labelCls}>Role Type *</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className={inputCls}
                    >
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className={labelCls}>{category === "Internship" ? "Stipend" : "Salary"}</label>
                  <input
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    placeholder={category === "Internship" ? "e.g. ₹15,000/month" : "e.g. ₹15LPA"}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Workplace Type *</label>
                  <select
                    value={form.locationType}
                    onChange={(e) => setForm({ ...form, locationType: e.target.value })}
                    className={inputCls}
                  >
                    <option>Remote</option>
                    <option>On-site</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                {form.locationType !== "Remote" && (
                  <div>
                    <label className={labelCls}>Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Bangalore, India"
                      className={inputCls}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>Required Skills</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#1B2A6B] transition-all">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>{category} Description *</label>
                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the responsibilities, requirements, and benefits..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all disabled:opacity-70"
                >
                  {submitting ? <>Publishing...</> : <>Publish {category} <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          </AnimatedContent>
        </div>

        {/* Live Preview Pane */}
        <div className="lg:col-span-1 hidden lg:block space-y-4">
          <h2 className="text-sm font-black text-slate-600 uppercase tracking-wider px-2">Live Preview</h2>
          <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden sticky top-28 pointer-events-none p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] flex items-center justify-center text-white shadow-inner">
                <Building size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Company Name</p>
                <h3 className="font-black text-slate-800 text-base leading-tight">
                  {form.title || `${category} Title`}
                </h3>
              </div>
            </div>

            <div className="mb-3">
              <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${category === "Internship" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                {category}
              </span>
              <span className="ml-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-100 text-amber-700">
                Pending Review
              </span>
            </div>

            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Target size={14} className="text-slate-400" />{" "}
                {category === "Internship" ? "Internship" : form.type}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin size={14} className="text-slate-400" />{" "}
                {form.locationType === "Remote" ? "Remote" : form.location || "Location"}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Briefcase size={14} className="text-slate-400" />{" "}
                {form.salary || (category === "Internship" ? "Stipend" : "Salary") + " Undisclosed"}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {skills.slice(0, 4).map((skill) => (
                <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                  +{skills.length - 4}
                </span>
              )}
            </div>

            <div className="w-full py-2.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              Apply Now <ArrowRight size={14} />
            </div>
          </AnimatedContent>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
