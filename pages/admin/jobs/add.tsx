import React, { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Check, Building2, Briefcase, MapPin, DollarSign, Calendar, Gift, Video, Settings, Save, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { JobService } from "../../../src/lib/api/admin/JobService";

const generateJobId = () => `JOB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

export default function AdminAddJobPage() {
  const router = useRouter();
  
  // State for all form fields
  const [form, setForm] = useState({
    // Company
    companyLogo: "",
    companyName: "",
    companyWebsite: "",
    recruiterName: "",
    recruiterEmail: "",
    recruiterPhone: "",
    // Job Details
    title: "",
    jobId: "",
    description: "",
    responsibilities: "",
    requiredSkills: "",
    qualification: "",
    experience: "",
    openings: "",
    // Job Info
    type: "Full Time",
    workMode: "On-site",
    location: "",
    industry: "",
    category: "",
    // Salary
    minSalary: "",
    maxSalary: "",
    salaryType: "Per Year",
    // Timeline
    applicationStartDate: "",
    applicationDeadline: "",
    joiningDate: "",
    // Benefits
    benefits: "",
    // Media
    companyBanner: "",
    videoUrl: "",
    // Settings
    status: "Active",
    featuredJob: false,
    urgentHiring: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    setForm(prev => ({ ...prev, jobId: generateJobId() }));
  }, []);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, [field]: url }));
      toast.success("Image uploaded for preview");
    }
  };

  const validateForm = () => {
    if (!form.companyName.trim()) { toast.error("Company Name is required"); return false; }
    if (!form.title.trim()) { toast.error("Job Title is required"); return false; }
    if (!form.description.trim()) { toast.error("Job Description is required"); return false; }
    return true;
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        employment_type: form.type,
        experience_level: form.experience,
        remote_type: form.workMode,
        salary_min: form.minSalary,
        salary_max: form.maxSalary,
        application_deadline: form.applicationDeadline,
        status: 'active'
      };
      await JobService.createJob(payload);
      toast.success("Job published successfully!");
      router.push("/admin/jobs");
    } catch (error) {
      toast.error("Failed to publish job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        employment_type: form.type,
        experience_level: form.experience,
        remote_type: form.workMode,
        salary_min: form.minSalary,
        salary_max: form.maxSalary,
        application_deadline: form.applicationDeadline,
        status: 'draft'
      };
      await JobService.createJob(payload);
      toast.success("Job saved as draft!");
      router.push("/admin/jobs");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const duplicateJob = () => {
    setForm(prev => ({
      ...prev,
      jobId: generateJobId(),
      title: `${prev.title} (Copy)`
    }));
    toast.success("Job details duplicated. A new Job ID was generated.");
  };

  return (
    <AdminDashboardLayout>
      {/* Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
          <ChevronRight size={12} />
          <Link href="/admin/jobs" className="hover:text-[#1B2A6B]">Jobs Management</Link>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-bold">Post New Job</span>
        </div>
        <button type="button" onClick={duplicateJob} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
          Duplicate Existing Job Fields
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide flex items-center gap-2">
        <Briefcase className="text-[#C9A227]"/> 
        {isPreviewMode ? 'PREVIEW JOB POSTING' : 'POST NEW JOB'}
      </h1>

      {isPreviewMode ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              {form.companyLogo ? (
                <img src={form.companyLogo} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm"/>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><Building2 size={24}/></div>
              )}
              <div>
                <h2 className="text-2xl font-black text-[#1B2A6B]">{form.title || 'Job Title'}</h2>
                <p className="text-sm font-bold text-slate-600">{form.companyName || 'Company Name'} • {form.location || 'Location'}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">{form.type}</span>
              <span className="text-xs font-bold text-slate-400">ID: {form.jobId}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{form.description || 'No description provided.'}</p>
              </div>
              {form.responsibilities && (
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Responsibilities</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{form.responsibilities}</p>
                </div>
              )}
              {form.requiredSkills && (
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Required Skills</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{form.requiredSkills}</p>
                </div>
              )}
            </div>
            <div className="space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Job Overview</h3>
              <div className="space-y-4">
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p><p className="text-sm font-bold text-slate-800">{form.experience || 'Not specified'}</p></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Mode</p><p className="text-sm font-bold text-slate-800">{form.workMode}</p></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salary</p><p className="text-sm font-bold text-emerald-600">{form.minSalary && form.maxSalary ? `₹${form.minSalary} - ₹${form.maxSalary} ${form.salaryType}` : 'Not disclosed'}</p></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Openings</p><p className="text-sm font-bold text-slate-800">{form.openings || 'Not specified'}</p></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</p><p className="text-sm font-bold text-red-500">{form.applicationDeadline || 'Not specified'}</p></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={togglePreview} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-all">Back to Edit</button>
            <button onClick={handlePublish} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-70">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />} Publish Job
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* Company Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Building2 size={18} className="text-[#1B2A6B]"/>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Company Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex items-center gap-4">
                {form.companyLogo ? (
                  <img src={form.companyLogo} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm"/>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400"><Building2 size={24}/></div>
                )}
                <div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">Company Logo (Max 2MB)</p>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload("companyLogo")} className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1B2A6B]/10 file:text-[#1B2A6B]" />
                </div>
              </div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Company Name <span className="text-red-500">*</span></label><input required value={form.companyName} onChange={set("companyName")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Company Website</label><input type="url" value={form.companyWebsite} onChange={set("companyWebsite")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Recruiter Name</label><input value={form.recruiterName} onChange={set("recruiterName")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Recruiter Email</label><input type="email" value={form.recruiterEmail} onChange={set("recruiterEmail")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Recruiter Phone</label><input value={form.recruiterPhone} onChange={set("recruiterPhone")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-75">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Briefcase size={18} className="text-[#1B2A6B]"/>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Job Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Job Title <span className="text-red-500">*</span></label><input required value={form.title} onChange={set("title")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Job ID (Auto Generated)</label><input readOnly value={form.jobId} className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 outline-none cursor-not-allowed" /></div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Job Description <span className="text-red-500">*</span></label>
                  <span className={`text-[10px] font-black ${form.description.length > 2000 ? 'text-red-500' : 'text-slate-400'}`}>{form.description.length}/2000</span>
                </div>
                <textarea required rows={4} maxLength={2000} value={form.description} onChange={set("description")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none" />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Responsibilities</label>
                <textarea rows={3} value={form.responsibilities} onChange={set("responsibilities")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Required Skills</label>
                <textarea rows={2} value={form.requiredSkills} onChange={set("requiredSkills")} placeholder="Comma separated skills..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none" />
              </div>

              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Qualification</label><input value={form.qualification} onChange={set("qualification")} placeholder="e.g. B.Tech / MCA" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Experience</label><input value={form.experience} onChange={set("experience")} placeholder="e.g. 2-5 Years" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Openings</label><input type="number" min="1" value={form.openings} onChange={set("openings")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <MapPin size={18} className="text-[#1B2A6B]"/>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Job Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Job Type</label>
                <select value={form.type} onChange={set("type")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Full Time</option><option>Part Time</option><option>Contract</option><option>Freelance</option><option>Internship</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Work Mode</label>
                <select value={form.workMode} onChange={set("workMode")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>On-site</option><option>Remote</option><option>Hybrid</option>
                </select>
              </div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Location</label><input value={form.location} onChange={set("location")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Industry</label><input value={form.industry} onChange={set("industry")} placeholder="e.g. IT Services" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Category</label><input value={form.category} onChange={set("category")} placeholder="e.g. Software Development" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
            </div>
          </div>

          {/* Salary & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-150">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <DollarSign size={18} className="text-[#1B2A6B]"/>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Salary Info</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Min Salary (₹)</label><input type="number" value={form.minSalary} onChange={set("minSalary")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Max Salary (₹)</label><input type="number" value={form.maxSalary} onChange={set("maxSalary")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Salary Type</label>
                  <select value={form.salaryType} onChange={set("salaryType")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option>Per Year</option><option>Per Month</option><option>Per Hour</option><option>Negotiable</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <Calendar size={18} className="text-[#1B2A6B]"/>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Timeline</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Start Date</label><input type="date" value={form.applicationStartDate} onChange={set("applicationStartDate")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
                <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Deadline</label><input type="date" value={form.applicationDeadline} onChange={set("applicationDeadline")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
                <div className="md:col-span-2"><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Joining Date / Expected</label><input type="date" value={form.joiningDate} onChange={set("joiningDate")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" /></div>
              </div>
            </div>
          </div>

          {/* Benefits & Media */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-300">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <Gift size={18} className="text-[#1B2A6B]"/>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Benefits</h2>
              </div>
              <div className="p-6">
                <textarea rows={5} value={form.benefits} onChange={set("benefits")} placeholder="Health insurance, Flexible hours, etc." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-300">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <Video size={18} className="text-[#1B2A6B]"/>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Media</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Company Banner Image</label>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload("companyBanner")} className="w-full px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1B2A6B]/10 file:text-[#1B2A6B]" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Preview Video URL</label>
                  <input type="url" value={form.videoUrl} onChange={set("videoUrl")} placeholder="YouTube / Vimeo URL" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-500">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <Settings size={18} className="text-[#1B2A6B]"/>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Settings</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                <select value={form.status} onChange={set("status")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Active</option><option>Draft</option><option>Closed</option>
                </select>
              </div>
              <div className="flex items-center gap-3 md:mt-6">
                <input type="checkbox" id="feat" checked={form.featuredJob} onChange={set("featuredJob")} className="w-5 h-5 rounded border-gray-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                <label htmlFor="feat" className="text-sm font-bold text-slate-700 cursor-pointer">Featured Job</label>
              </div>
              <div className="flex items-center gap-3 md:mt-6">
                <input type="checkbox" id="urgent" checked={form.urgentHiring} onChange={set("urgentHiring")} className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                <label htmlFor="urgent" className="text-sm font-bold text-slate-700 cursor-pointer">Urgent Hiring</label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleSaveDraft} disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-all disabled:opacity-50">
                <Save size={16}/> Save Draft
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => router.push("/admin/jobs")} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-black rounded-xl transition-all">Cancel</button>
              <button type="button" onClick={togglePreview} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-black rounded-xl transition-all">
                <Eye size={16}/> Preview
              </button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-md transition-all disabled:opacity-70">
                {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />} 
                Publish Job
              </button>
            </div>
          </div>

        </form>
      )}

    </AdminDashboardLayout>
  );
}
