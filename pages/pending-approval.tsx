import React from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, CheckCircle2, ShieldCheck, Mail, HelpCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthBranding } from '../src/components/AuthBranding';
import { SEO } from '../src/components/seo/SEO';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-white flex font-inter">
      <SEO
        title="Account Under Review | Sarvakshetra"
        description="Your Sarvakshetra account registration is currently pending administrator approval."
      />

      {/* Left Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[480px] shrink-0 flex flex-col justify-center px-8 sm:px-12 py-10 relative overflow-y-auto custom-scrollbar z-10 shadow-[20px_0_40px_rgba(0,0,0,0.05)] bg-white"
      >
        <div className="w-full mx-auto max-w-sm py-4">
          
          {/* Logo */}
          <Link href="/" className="inline-block mb-6">
            <img src="/Boxxlogo.png" alt="Sarvakshetra" className="h-10 w-auto object-contain" />
          </Link>

          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
          >
            <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
          </motion.div>

          <h1 className="text-2xl font-black text-slate-800 mb-2 font-sora">
            Account Under Review
          </h1>
          
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
            Your email address has been successfully verified. Your registration is now being reviewed by the Sarvakshetra administration team.
          </p>

          {/* Progress Steps Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Registration Progress
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="stroke-[3]" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800">Registration Submitted</p>
                  <p className="text-slate-500 text-[11px]">Basic details provided</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="stroke-[3]" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800">Email Verified</p>
                  <p className="text-slate-500 text-[11px]">6-digit OTP confirmed</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={14} className="stroke-[2.5] animate-spin" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-amber-700">Administrator Approval Pending</p>
                  <p className="text-amber-600/80 text-[11px]">Profile credentials under review</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3.5 mb-6 flex items-start gap-2.5">
            <Mail size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-blue-900 leading-relaxed">
              You will receive an email confirmation once your account has been approved, after which you can log in.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-[#1B2A6B]/20"
            >
              <LogIn size={16} /> Return to Login
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Branding */}
      <AuthBranding />
    </div>
  );
}
