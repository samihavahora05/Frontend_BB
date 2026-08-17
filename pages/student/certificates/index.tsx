import React, { useState } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Award, Download, Share2, Calendar, CheckCircle2, ExternalLink, Copy, X, Linkedin, Twitter } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../src/lib/axios";

interface CertificateItem {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  grade: string;
  skills: string[];
}

import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CertificatesPage() {
  const [shareModal, setShareModal] = useState<CertificateItem | null>(null);
  const { data: responseData, isLoading } = useSWR("/student/certificates", fetcher);
  
  const rawEarned = responseData?.data?.earned || [];
  const inProgress = responseData?.data?.in_progress || [];

  const earnedCertificates = rawEarned.map((c: any) => ({
    id: c.id,
    title: c.course?.title || "Course Certificate",
    issuer: "BlueBoxx DA",
    date: c.issued_at ? new Date(c.issued_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "Just now",
    credentialId: c.credential_id || "BB-PENDING",
    grade: c.grade || "A",
    skills: c.course?.skills || ["Web Dev", "LMS"]
  }));

  const handleDownload = (cert: CertificateItem) => {
    toast.success(`Downloading "${cert.title}" certificate...`);
  };

  const handleCopyLink = (cert: CertificateItem) => {
    navigator.clipboard?.writeText(`https://blueboxxda.in/verify/${cert.credentialId}`);
    toast.success("Verification link copied!");
  };

  return (
    <StudentDashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">My Certificates</h1>
        <p className="text-slate-500 text-sm font-medium">Download, share, and verify your earned certificates.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <AnimatedContent direction="up" delay={0.05} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1B2A6B]/5 flex items-center justify-center shrink-0">
            <Award size={22} className="text-[#C9A227]" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800">{earnedCertificates.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates Earned</p>
          </div>
        </AnimatedContent>
        <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1B2A6B]/5 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} className="text-[#1B2A6B]" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800">{inProgress.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</p>
          </div>
        </AnimatedContent>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Certificate Gallery */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Earned Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {isLoading ? (
              <div className="col-span-2 p-12 text-center text-slate-400 font-semibold animate-pulse">Loading certificates...</div>
            ) : earnedCertificates.length > 0 ? (
              earnedCertificates.map((cert: any, i: number) => (
                <AnimatedContent
                  key={cert.id}
                  direction="up"
                  delay={i * 0.08}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                {/* Certificate Visual — always navy + gold accent */}
                <div className="h-40 bg-[#0d1635] p-5 relative flex flex-col justify-between overflow-hidden">
                  {/* Decorative */}
                  <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#C9A227]/10 rounded-full" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/3 rounded-full -ml-6 -mb-6" />
                  {/* Gold accent line */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C9A227] to-transparent" />

                  <div className="flex items-center gap-2 relative z-10">
                    <img src="/logoblue.png" alt="BlueBoxx" className="h-5 w-auto object-contain" />
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Certificate of Completion</span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-white font-black text-base leading-tight mb-1">{cert.title}</h3>
                    <p className="text-white/50 text-xs font-semibold">{cert.issuer}</p>
                  </div>

                  {/* Grade badge — gold */}
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-xl bg-[#C9A227] flex items-center justify-center shadow-lg shadow-[#C9A227]/30 z-10">
                    <span className="text-[#0d1635] font-black text-sm">{cert.grade}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                      <Calendar size={11} /> {cert.date}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{cert.credentialId}</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skills.map((s: string) => (
                      <span key={s} className="text-[10px] font-bold bg-[#1B2A6B]/5 text-[#1B2A6B] px-2 py-0.5 rounded-full border border-[#1B2A6B]/10">{s}</span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(cert)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#0d1635] transition-colors"
                    >
                      <Download size={13} /> Download
                    </button>
                    <button
                      onClick={() => setShareModal(cert)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <Share2 size={13} /> Share
                    </button>
                  </div>
                </div>
                </AnimatedContent>
              ))
            ) : (
              <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Award size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="font-black text-slate-600 mb-1">No certificates earned yet</p>
                <p className="text-xs text-slate-400 font-semibold">Complete your enrolled courses to receive verified certifications.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">In Progress</h2>
            <div className="space-y-3">
              {isLoading ? (
                <div className="p-4 text-center text-slate-400 text-xs font-semibold animate-pulse">Loading...</div>
              ) : inProgress.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-bold mb-1">No courses in progress</p>
                  <p className="text-[10px] text-slate-400">Enroll in a course to see your progress here.</p>
                </div>
              ) : (
                inProgress.map((c: any, i: number) => (
                  <AnimatedContent key={i} direction="up" delay={0.3 + i * 0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1B2A6B]/5 flex items-center justify-center shrink-0">
                        <Award size={16} className="text-[#1B2A6B]" />
                      </div>
                      <p className="text-sm font-black text-slate-700 leading-tight line-clamp-1">{c.course?.title || "Course Name"}</p>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                      <span>Progress</span><span className="text-[#1B2A6B]">{c.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1B2A6B] rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  </AnimatedContent>
                ))
              )}
            </div>
          </div>

          {/* Verify Banner */}
          <div className="bg-[#0d1635] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C9A227] to-transparent" />
            <div className="w-10 h-10 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl flex items-center justify-center mb-3">
              <ExternalLink size={18} className="text-[#C9A227]" />
            </div>
            <h3 className="font-black text-base mb-1">Verify Credentials</h3>
            <p className="text-white/50 text-xs font-medium mb-4">Share a verification link with employers to instantly validate your certificates.</p>
            <button
              onClick={() => { navigator.clipboard?.writeText("https://blueboxxda.in/verify/"); toast.success("Verification portal link copied!"); }}
              className="w-full h-9 bg-[#C9A227] text-[#0d1635] text-xs font-black rounded-xl hover:bg-[#d8b02c] transition-colors"
            >
              Copy Verify Link
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShareModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm z-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black text-slate-800">Share Certificate</h3>
              <button onClick={() => setShareModal(null)} className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl"><X size={16} /></button>
            </div>

            {/* Preview */}
            <div className="h-24 bg-[#0d1635] rounded-2xl p-4 mb-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C9A227] to-transparent" />
              <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">BlueBoxx DA · Certificate</span>
              <div>
                <p className="text-white font-black">{shareModal.title}</p>
                <p className="text-white/40 text-[10px] font-mono">{shareModal.credentialId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button onClick={() => handleCopyLink(shareModal)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center"><Copy size={16} className="text-slate-600" /></div>
                <div><p className="text-sm font-bold text-slate-800">Copy Verification Link</p><p className="text-xs text-slate-400">Share with employers</p></div>
              </button>
              <button onClick={() => { toast("Opening LinkedIn...", { icon: "💼" }); setShareModal(null); }} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 transition-colors">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center"><Linkedin size={16} className="text-white" /></div>
                <div><p className="text-sm font-bold text-slate-800">Add to LinkedIn</p><p className="text-xs text-slate-400">Certifications section</p></div>
              </button>
              <button onClick={() => { toast("Opening Twitter/X...", { icon: "🐦" }); setShareModal(null); }} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-sky-50 transition-colors">
                <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center"><Twitter size={16} className="text-white" /></div>
                <div><p className="text-sm font-bold text-slate-800">Share on Twitter/X</p><p className="text-xs text-slate-400">Post to your network</p></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentDashboardLayout>
  );
}
