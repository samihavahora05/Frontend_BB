import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { Calendar, Trophy, Briefcase, ChevronRight, FileEdit, ArrowRight, Bell, Star, Upload, X, Gift } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useAuth } from "../../../src/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { OnboardingTour } from "../../../src/components/OnboardingTour";

import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Student";
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Live Dashboard State
  const { data: dashboardData, isLoading: isDashboardLoading } = useSWR('/dashboard/student', fetcher, {
    revalidateOnFocus: false,
  });

  const { data: allAppsRes, isLoading: isAppsLoading } = useSWR('/student/all-applications', fetcher, {
    revalidateOnFocus: false,
  });

  const isLoading = isDashboardLoading && isAppsLoading;

  const rawAppsList = Array.isArray(allAppsRes?.data) ? allAppsRes.data : Array.isArray(allAppsRes) ? allAppsRes : [];
  
  const displayApplications = (dashboardData?.applications && dashboardData.applications.length > 0)
    ? dashboardData.applications
    : rawAppsList.slice(0, 3).map((a: any) => ({
        id: a.id,
        role: a.title || 'Internship Application',
        company: a.company || 'Blueboxx Partner',
        appliedDate: a.applied_on || 'Recently',
        status: a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : 'Applied',
        statusColor: 'bg-blue-50 text-blue-700'
      }));

  const activeAppsCount = dashboardData?.stats?.active_applications 
    ?? (rawAppsList.length > 0 ? rawAppsList.filter((a: any) => !['rejected', 'failed', 'hired', 'declined'].includes((a.status || '').toLowerCase())).length : 0);

  const interviewsCount = dashboardData?.stats?.interviews_scheduled 
    ?? (rawAppsList.length > 0 ? rawAppsList.filter((a: any) => ['shortlisted', 'interview', 'in consideration'].includes((a.status || '').toLowerCase())).length : 0);

  const offersCount = dashboardData?.stats?.offers_received 
    ?? (rawAppsList.length > 0 ? rawAppsList.filter((a: any) => ['hired', 'offer', 'awarded', 'accepted'].includes((a.status || '').toLowerCase())).length : 0);

  useEffect(() => {
    const hasSeen = localStorage.getItem("bb_student_tour_done");
    if (!hasSeen) {
      setTimeout(() => setShowTour(true), 800);
    }
  }, []);

  const handleTourComplete = () => {
    localStorage.setItem("bb_student_tour_done", "1");
    setShowTour(false);
  };

  const TOUR_STEPS = [
    {
      target: "#stat-applications",
      title: "Your Applications",
      description: "Track all your internship and job applications here in real time.",
      position: "bottom" as const,
    },
    {
      target: "#resume-btn",
      title: "Build Your Resume",
      description: "Use our AI-powered resume builder to create a job-ready resume in minutes.",
      position: "bottom" as const,
    },
  ];

  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('resume', file);

      setIsUploading(true);
      try {
        const res = await api.post('/student/resume/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data.success) {
          toast.success(`Resume "${file.name}" uploaded successfully!`);
          setIsResumeModalOpen(false);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to upload resume');
      } finally {
        setIsUploading(false);
        if (e.target) {
          e.target.value = ''; // Reset input
        }
      }
    }
  };

  return (
    <StudentDashboardLayout>
      {/* Welcome header */}
      <AnimatedContent direction="up" delay={0.05}>
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Welcome back, {firstName}!</h1>
            <p className="text-slate-500 font-medium text-sm">Here's what's happening with your applications today.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsResumeModalOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-[#0d1635] rounded-xl text-sm font-black shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
              <Upload size={16} /> Upload Resume
            </button>
            <Link
              id="resume-btn"
              href="/student/resume-builder"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] text-[#0d1635] font-black rounded-xl hover:bg-[#d8b02c] transition-all shadow-md text-sm shrink-0"
            >
              <FileEdit size={16} /> Build Resume
            </Link>
          </div>
        </div>
      </AnimatedContent>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            id: "stat-applications",
            label: "Active Applications",
            value: activeAppsCount,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            href: "/student/applications?status=applied"
          },
          {
            id: "stat-interviews",
            label: "Interviews Scheduled",
            value: interviewsCount,
            icon: Calendar,
            color: "text-amber-600",
            bg: "bg-amber-50",
            href: "/student/applications?status=interview"
          },
          {
            id: "stat-offers",
            label: "Offers Received",
            value: offersCount,
            icon: Trophy,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            href: "/student/applications?status=offer"
          },
        ].map((stat, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.08}>
            <Link
              id={stat.id}
              href={stat.href}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block h-full"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} mb-3`}>
                <stat.icon size={18} />
              </div>
              {isLoading ? (
                <div className="w-12 h-6 bg-slate-200 rounded animate-pulse mb-1"></div>
              ) : (
                <h3 className="text-2xl font-black text-slate-800 mb-1">{stat.value}</h3>
              )}
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </Link>
          </AnimatedContent>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Explore Opportunities */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Star size={17} className="text-[#1B2A6B]" /> Explore Opportunities
              </h2>
              <Link href="/student/internships" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-1">
                View All <ChevronRight size={13} />
              </Link>
            </div>

            <div className="p-5">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Briefcase size={28} className="text-[#1B2A6B]" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Ready to kickstart your career?</h3>
                <p className="text-sm font-semibold text-slate-600 mb-6 max-w-md">
                  Explore top internships and job opportunities curated just for you. Apply with your AI-built resume in one click!
                </p>
                <Link
                  href="/student/internships"
                  className="px-6 py-3 bg-[#1B2A6B] text-white font-black rounded-xl hover:bg-[#0d1635] transition-all shadow-md flex items-center gap-2"
                >
                  Browse Internships <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </AnimatedContent>
        </div>

        {/* Right: Applications + Quick Links */}
        <div className="space-y-6">

          {/* Applications */}
          <AnimatedContent direction="up" delay={0.5} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Briefcase size={15} className="text-[#1B2A6B]" /> Applications
              </h2>
              <Link href="/student/applications" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-1">
                View All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-4 flex gap-4 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ) : displayApplications?.length > 0 ? (
                displayApplications.map((app: any) => (
                  <Link key={app.id} href="/student/applications" className="p-4 flex items-center gap-3 hover:bg-slate-50/50 transition-colors block">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] text-white font-black text-xs flex items-center justify-center shrink-0 uppercase">
                      {app.company ? app.company[0] : 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{app.role}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{app.company} · {app.appliedDate}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full shrink-0 ${app.statusColor}`}>{app.status}</span>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-xs font-bold text-slate-400">
                  No applications submitted yet.
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link
                href="/student/internships"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1B2A6B] text-white text-xs font-black rounded-xl hover:bg-[#0d1635] transition-colors"
              >
                Apply Now <ArrowRight size={13} />
              </Link>
            </div>
          </AnimatedContent>

          {/* Quick Actions */}
          <AnimatedContent direction="up" delay={0.6} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-black text-slate-800 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Referral & Earn", desc: "Invite friends, get rewards", href: "/student/referrals", icon: Gift, color: "text-[#C9A227] bg-[#C9A227]/10" },
                { label: "Get Help", desc: "Contact support", href: "/student/support", icon: Bell, color: "text-emerald-600 bg-emerald-50" },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                    <action.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{action.label}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{action.desc}</p>
                  </div>
                  <ChevronRight size={13} className="ml-auto text-slate-300" />
                </Link>
              ))}
            </div>
          </AnimatedContent>
        </div>
      </div>

      {/* Resume Upload Modal */}
      <AnimatePresence>
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsResumeModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><Upload size={18} className="text-[#1B2A6B]" /> Upload Resume</h3>
                <button onClick={() => setIsResumeModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-6">
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-[#1B2A6B] transition-colors group">
                  {isUploading ? (
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 animate-spin">
                      <Upload size={24} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                  )}
                  <p className="text-sm font-bold text-slate-700 mb-1">{isUploading ? 'Uploading...' : 'Click to browse or drag file here'}</p>
                  <p className="text-xs text-slate-500 font-medium">Supports PDF, DOCX (Max 5MB)</p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* First-Time Onboarding Tour */}
      {showTour && (
        <OnboardingTour
          steps={TOUR_STEPS}
          onComplete={handleTourComplete}
          onSkip={handleTourComplete}
        />
      )}
    </StudentDashboardLayout>
  );
}
