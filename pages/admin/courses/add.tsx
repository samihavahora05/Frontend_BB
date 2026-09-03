import React, { useState } from "react";
import Head from "next/head";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ArrowLeft, Save, Image as ImageIcon, Video, FileText, Check, UploadCloud, Link as LinkIcon, DollarSign, Type, AlignLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { CourseService } from "../../../src/lib/api/admin/CourseService";
import { CourseCategoryService } from "../../../src/lib/api/admin/CourseCategoryService";
import { InstructorService } from "../../../src/lib/api/admin/InstructorService";
import { CourseLevelService } from "../../../src/lib/api/admin/CourseLevelService";

export default function AdminCreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  
  const { data: categories } = CourseCategoryService.useCategories({ per_page: 'all' });
  const { data: instructors } = InstructorService.useInstructors({ page: 1, per_page: 100 });
  const { data: levels } = CourseLevelService.useLevels();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    thumbnail: "",
    title: "",
    short_description: "",
    category_id: "",
    level_id: "",
    language: "English",
    duration: "",
    expert_id: "",
    preview_video_url: "",
    demo_pdf_url: "",
    landing_page_url: "",
    price: "",
    discount_price: "",
    course_type: "Paid",
    status: "Draft",
    description: "",
  });

  const getInstructorDisplayName = (inst: any) => {
    if (!inst) return 'Unknown';
    if (inst.name && typeof inst.name === 'string' && inst.name.trim()) return inst.name.trim();
    if (inst.full_name && typeof inst.full_name === 'string' && inst.full_name.trim()) return inst.full_name.trim();
    const user = inst.user;
    if (user) {
      if (user.name && typeof user.name === 'string' && user.name.trim()) return user.name.trim();
      const userCombined = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      if (userCombined) return userCombined;
      if (user.email) return user.email;
    }
    const directCombined = `${inst.first_name || ''} ${inst.last_name || ''}`.trim();
    if (directCombined) return directCombined;
    if (inst.title) return inst.title;
    if (inst.designation) return inst.designation;
    if (inst.email) return inst.email;
    return `Instructor #${inst.id || 'N/A'}`;
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setThumbnailFile(file);
      setForm(prev => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
    }
  };

  const submitCourse = async (saveAsDraft: boolean) => {
    if (!form.title || !form.short_description || !form.category_id) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const isDraftingCall = saveAsDraft;
      isDraftingCall ? setIsDrafting(true) : setIsSubmitting(true);
      
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'thumbnail') {
          const val = (form as any)[key];
          if (val !== undefined && val !== null) {
            formData.append(key, val);
          }
        }
      });
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      formData.set('status', saveAsDraft ? 'Draft' : 'Published');
      
      const res = await CourseService.create(formData);
      toast.success(saveAsDraft ? "Course saved as draft" : "Course published successfully!");
      if (res.data?.id) {
          router.push(`/admin/courses/curriculum?courseId=${res.data.id}`);
      } else {
          router.push("/admin/courses");
      }
    } catch (e: any) {
      const errData = e?.response?.data;
      const msg = errData?.errors 
        ? Object.values(errData.errors).flat().join(" ") 
        : (errData?.message || "Failed to save course. Check fields.");
      toast.error(msg);
      setIsDrafting(false);
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => submitCourse(true);
  
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    submitCourse(false);
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Create New Course | BlueBoxx DA</title>
      </Head>

      <form onSubmit={handlePublish} className="max-w-6xl mx-auto pb-20">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin/courses" className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-black text-[#0d1635]">Create New Course</h1>
            </div>
            <p className="text-slate-500 font-medium text-sm ml-7">Create and publish a new course.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/admin/courses" className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm">
              Cancel
            </Link>
            <button type="button" onClick={handleSaveDraft} disabled={isDrafting || isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm">
              {isDrafting ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Save size={16}/>} 
              Save Draft
            </button>
            <button type="submit" disabled={isSubmitting || isDrafting} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-black rounded-xl shadow-md transition-all disabled:opacity-70">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16}/>}
              Publish Course
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Type size={16} className="text-[#1B2A6B]"/> Basic Information</h2>
              </div>
              <div className="p-6 space-y-6">
                
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Course Thumbnail</label>
                  <div className="flex items-center gap-6">
                    {form.thumbnail ? (
                      <div className="relative group">
                        <img src={form.thumbnail} alt="Thumbnail" className="w-48 h-32 object-cover rounded-xl border border-slate-200 shadow-sm" />
                        <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity font-bold text-sm">
                          <UploadCloud size={20} className="mb-1"/> Change
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="w-48 h-32 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#1B2A6B]">
                        <UploadCloud size={28} className="mb-2"/>
                        <span className="text-xs font-bold">Upload Image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                    <div className="text-xs font-medium text-slate-500 space-y-1">
                      <p>Upload a high-quality 16:9 image.</p>
                      <p>Supported formats: <strong className="text-slate-700">JPG, PNG</strong></p>
                      <p>Max file size: <strong className="text-slate-700">5MB</strong></p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Course Title <span className="text-red-500">*</span></label>
                  <input required value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Master Advanced React Patterns" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all" />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Short Description <span className="text-red-500">*</span></label>
                  <textarea required rows={3} value={form.short_description} onChange={e => handleChange('short_description', e.target.value)} placeholder="Brief summary of the course..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Course Category <span className="text-red-500">*</span></label>
                    <select required value={form.category_id} onChange={e => handleChange('category_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                      <option value="">Select Category...</option>
                      {categories?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Duration</label>
                    <input value={form.duration} onChange={e => handleChange('duration', e.target.value)} placeholder="e.g. 8 Weeks, 20 Hours" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">Course Level</label>
                    <div className="flex flex-wrap gap-4">
                      {levels?.map((lvl: any) => (
                        <label key={lvl.id} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="level_id" value={lvl.id} checked={String(form.level_id) === String(lvl.id)} onChange={() => handleChange('level_id', String(lvl.id))} className="w-4 h-4 text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{lvl.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">Course Language</label>
                    <div className="flex gap-4">
                      {['English', 'Hindi', 'Gujarati'].map(lang => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="language" value={lang} checked={form.language === lang} onChange={() => handleChange('language', lang)} className="w-4 h-4 text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Description (Rich Text) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><AlignLeft size={16} className="text-[#1B2A6B]"/> Course Description</h2>
              </div>
              <div className="p-6">
                {/* Simulated Rich Text Editor Toolbar */}
                <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold">B</button>
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 italic">I</button>
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 underline">U</button>
                  <div className="w-px h-4 bg-slate-300 mx-2"></div>
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><LinkIcon size={14}/></button>
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><ImageIcon size={14}/></button>
                </div>
                <textarea rows={10} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Write the full course description here..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-vertical" />
              </div>
            </div>
            
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            
            {/* Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Visibility Status</h2>
              </div>
              <div className="p-6">
                <select value={form.status} onChange={e => handleChange('status', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Private</option>
                </select>
                <p className="text-xs font-semibold text-slate-400 mt-3 leading-relaxed">
                  Published courses are visible to everyone. Private courses require an invite link.
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><DollarSign size={16} className="text-emerald-600"/> Pricing</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">Course Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="courseType" value="Free" checked={form.course_type === 'Free'} onChange={() => handleChange('course_type', 'Free')} className="w-4 h-4 text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Free</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="courseType" value="Paid" checked={form.course_type === 'Paid'} onChange={() => handleChange('course_type', 'Paid')} className="w-4 h-4 text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Paid</span>
                    </label>
                  </div>
                </div>

                {form.course_type === 'Paid' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Regular Price (₹)</label>
                      <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="0.00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Discount Price (₹)</label>
                      <input type="number" value={form.discount_price} onChange={e => handleChange('discount_price', e.target.value)} placeholder="0.00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Instructor</h2>
              </div>
              <div className="p-6">
                <select value={form.expert_id} onChange={e => handleChange('expert_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option value="">Select Instructor...</option>
                  {instructors?.map((inst: any) => (
                    <option key={inst.id} value={inst.id}>{getInstructorDisplayName(inst)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course Links */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={16} className="text-blue-500"/> Course Links</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Video size={14}/> Preview Video</label>
                  <input type="url" value={form.preview_video_url} onChange={e => handleChange('preview_video_url', e.target.value)} placeholder="YouTube / Vimeo URL" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={14}/> Demo PDF (Optional)</label>
                  <input type="url" value={form.demo_pdf_url} onChange={e => handleChange('demo_pdf_url', e.target.value)} placeholder="URL to PDF file" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><LinkIcon size={14}/> Landing Page (Optional)</label>
                  <input type="url" value={form.landing_page_url} onChange={e => handleChange('landing_page_url', e.target.value)} placeholder="Custom landing page URL" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </form>
    </AdminDashboardLayout>
  );
}
