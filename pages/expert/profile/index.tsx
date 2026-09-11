import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { ExpertDashboardLayout } from "../../../src/layout/ExpertDashboardLayout";
import { 
  User, Mail, Phone, Briefcase, Building, Award, 
  DollarSign, Globe, Linkedin, Github, ExternalLink, 
  Save, Camera, CheckCircle2, AlertCircle, RefreshCw, 
  Sparkles, Check, X, ShieldCheck, Clock, Layers, HelpCircle
} from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import { ExpertService } from "../../../src/lib/api/ExpertService";
import { getImageUrl } from "../../../src/lib/imageUtils";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ExpertProfilePage() {
  const { data: profileRes, isLoading, mutate } = useSWR("/expert/profile", fetcher);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    designation: "",
    company: "",
    specialization: "",
    hourly_rate: "1500",
    experience_years: "5",
    highest_qualification: "",
    bio: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    website: "",
    is_available: true,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileRes?.data) {
      const u = profileRes.data.user || {};
      const p = profileRes.data.profile || {};
      setFormData({
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        email: u.email || "",
        phone: u.phone || "",
        designation: p.designation || "",
        company: p.company || "",
        specialization: p.specialization || "",
        hourly_rate: String(p.hourly_rate || 1500),
        experience_years: p.experience_years !== null && p.experience_years !== undefined ? String(p.experience_years) : "5",
        highest_qualification: p.highest_qualification || "",
        bio: p.bio || "",
        linkedin_url: p.linkedin_url || "",
        github_url: p.github_url || "",
        portfolio_url: p.portfolio_url || "",
        website: p.website || "",
        is_available: p.is_available !== undefined ? Boolean(p.is_available) : true,
      });

      if (p.profile_photo || p.avatar) {
        setAvatarPreview(getImageUrl(p.profile_photo || p.avatar));
      }
    }
  }, [profileRes]);

  const completion = profileRes?.data?.completion || {
    percentage: 0,
    completed_count: 0,
    total_count: 12,
    checklist: []
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file must be under 5MB");
        return;
      }

      setIsUploadingPhoto(true);
      toast.loading("Uploading profile photo...", { id: "photo_up" });

      try {
        const res = await ExpertService.uploadExpertPhoto(file);
        if (res?.data?.avatar || res?.data?.profile_photo) {
          const freshUrl = getImageUrl(res.data.avatar || res.data.profile_photo);
          setAvatarPreview(`${freshUrl}?t=${Date.now()}`);
          toast.success("Profile photo updated successfully!", { id: "photo_up" });
          mutate();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to upload photo", { id: "photo_up" });
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    toast.loading("Saving profile changes...", { id: "save_prof" });

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        designation: formData.designation.trim(),
        company: formData.company.trim(),
        specialization: formData.specialization.trim(),
        hourly_rate: Number(formData.hourly_rate) || 1500,
        experience_years: Number(formData.experience_years) || 0,
        highest_qualification: formData.highest_qualification.trim(),
        bio: formData.bio.trim(),
        linkedin_url: formData.linkedin_url.trim(),
        github_url: formData.github_url.trim(),
        portfolio_url: formData.portfolio_url.trim(),
        website: formData.website.trim(),
        is_available: formData.is_available,
      };

      await ExpertService.updateExpertProfile(payload);
      toast.success("Profile updated successfully! All students and admins can now see your latest details.", { id: "save_prof" });
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile. Please try again.", { id: "save_prof" });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    const fn = formData.first_name || "E";
    const ln = formData.last_name || "X";
    return `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase();
  };

  return (
    <ExpertDashboardLayout>
      <Head>
        <title>My Expert Profile | BlueBoxx DA</title>
      </Head>

      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0d1635] flex items-center gap-3">
              <User size={30} className="text-[#C9A227]" /> Expert Profile
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Complete your profile details. All updates are automatically displayed across the student directory and booking pages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSaving || isLoading}
              className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-xl text-sm font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Save Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Progress Card */}
        <AnimatedContent direction="up" delay={0.1} className="bg-gradient-to-br from-[#0d1635] to-[#1B2A6B] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#C9A227] backdrop-blur-xs">
                <Sparkles size={14} /> Profile Strength & Visibility
              </div>
              <h2 className="text-2xl font-black">
                Profile Completion: <span className="text-[#C9A227]">{completion.percentage}%</span>
              </h2>
              <p className="text-slate-300 text-xs font-medium max-w-xl">
                {completion.percentage === 100
                  ? "Outstanding! Your profile is 100% complete. Students can easily find, review, and book 1:1 sessions with you."
                  : `Your profile is ${completion.percentage}% complete. Fill in the remaining fields below to boost your ranking and bookings.`}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="w-24 h-24 rounded-full border-4 border-white/20 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
                <span className="text-2xl font-black text-[#C9A227]">{completion.percentage}%</span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-300">Complete</span>
              </div>
            </div>
          </div>

          {/* Checklist Pills */}
          {completion.checklist && completion.checklist.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {completion.checklist.map((item: any) => (
                <div 
                  key={item.key} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    item.completed 
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" 
                      : "bg-white/5 text-slate-300 border border-white/10"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </AnimatedContent>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Profile Photo & Basic Identity */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2 pb-4 border-b border-slate-100">
              <Camera size={20} className="text-[#1B2A6B]" /> Profile Photo & Basic Details
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-slate-100 shadow-md bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] flex items-center justify-center text-white font-black text-2xl">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Expert avatar" 
                      className="w-full h-full object-cover"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span>{getInitials()}</span>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoSelect} 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="absolute bottom-0 right-0 p-2.5 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] rounded-full shadow-lg transition-transform transform active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Upload New Profile Photo"
                >
                  {isUploadingPhoto ? <RefreshCw size={15} className="animate-spin" /> : <Camera size={15} />}
                </button>
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-800">Expert Profile Picture</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Upload a clear, professional portrait. Supported formats: JPG, PNG, WEBP (Max 5MB).
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Camera size={14} /> Change Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="e.g. Aarav"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="e.g. Sharma"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">Locked Identity</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={formData.email}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed outline-none"
                  />
                  <ShieldCheck size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  Email is your login identifier. Contact Admin if you require an email change.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details & Rates */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2 pb-4 border-b border-slate-100">
              <Briefcase size={20} className="text-[#1B2A6B]" /> Professional Experience & Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Designation / Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Principal Software Architect"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Company / Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. CloudTech Labs or Freelance"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Specialization / Domain Expertise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Cloud Computing, AI/ML, System Design"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hourly Rate (INR ₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={formData.hourly_rate}
                    onChange={e => setFormData({ ...formData, hourly_rate: e.target.value })}
                    placeholder="1500"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Total Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.experience_years}
                  onChange={e => setFormData({ ...formData, experience_years: e.target.value })}
                  placeholder="e.g. 8"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={formData.highest_qualification}
                  onChange={e => setFormData({ ...formData, highest_qualification: e.target.value })}
                  placeholder="e.g. M.Tech / B.E. in Computer Science"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                About / Professional Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your background, achievements, mentorship philosophy, and what students will gain from booking a session with you..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all resize-y"
              />
              <p className="text-[11px] text-slate-400 font-medium text-right mt-1">
                {formData.bio.length} characters
              </p>
            </div>
          </div>

          {/* Section 3: Social & Portfolio Links */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2 pb-4 border-b border-slate-100">
              <Globe size={20} className="text-[#1B2A6B]" /> Online Links & Social Profiles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Linkedin size={14} className="text-blue-600" /> LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Github size={14} className="text-slate-800" /> GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ExternalLink size={14} className="text-[#C9A227]" /> Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-600" /> Personal / Tech Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Mentorship Availability Toggle */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-black text-[#0d1635] flex items-center gap-2">
                <Clock size={18} className="text-[#C9A227]" /> Availability for 1:1 Bookings
              </h4>
              <p className="text-xs text-slate-500 font-medium max-w-xl">
                When active, your profile appears in public listings and students can book available slots on your schedule.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={formData.is_available} 
                onChange={e => setFormData({ ...formData, is_available: e.target.checked })} 
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="px-8 py-3.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-2xl text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              <span>Save & Publish Profile</span>
            </button>
          </div>
        </form>
      </div>
    </ExpertDashboardLayout>
  );
}
