import React from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthBranding } from '../src/components/AuthBranding';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[450px] shrink-0 flex flex-col justify-center px-8 sm:px-12 py-12 relative z-10 shadow-[20px_0_40px_rgba(0,0,0,0.05)] bg-white font-inter"
      >
        <div className="w-full mx-auto max-w-sm text-center">
          {/* Logo */}
          <Link href="/" className="inline-block mb-10">
            <img src="/Boxxlogo.png" alt="BlueBoxx" className="h-12 w-auto object-contain mx-auto" />
          </Link>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Clock className="w-10 h-10 text-amber-500" />
          </motion.div>

          <h1 className="text-2xl font-black text-slate-800 mb-3 font-sora">
            Application Received!
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
            Thank you for registering with BlueBoxx DA. Your account is currently <strong className="text-amber-500 font-bold">Pending Approval</strong> from our Admin team. 
            We will review your details and send you an email once your account has been activated.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#1B2A6B] hover:bg-[#131F53] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#1B2A6B]/20">
              Go to Login
            </Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <ArrowLeft size={16} /> Return to Homepage
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Branding */}
      <AuthBranding />
    </div>
  );
}
