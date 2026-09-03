import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthNoticeBannerProps {
  title?: string;
  description?: string;
  compact?: boolean;
}

export const AuthNoticeBanner: React.FC<AuthNoticeBannerProps> = ({
  title = "Sign in to access all Courses, Internships, Jobs & Platform Services",
  description = "Join Blueboxx to explore full course content, apply for live job & internship openings, connect with industry experts, and track your career journey.",
  compact = false,
}) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const router = useRouter();

  // If user is already authenticated or auth hasn't initialized, don't show
  if (!isAuthReady || isAuthenticated) {
    return null;
  }

  const loginRedirectUrl = `/login?redirect=${encodeURIComponent(router.asPath)}`;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#1B2A6B] to-[#2d4499] text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border border-amber-400/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 shrink-0">
            <Lock size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{title}</h4>
            <p className="text-xs text-blue-100/80">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Link
            href={loginRedirectUrl}
            className="flex-1 sm:flex-initial text-center px-4 py-2 bg-[#C9A227] hover:bg-[#e0b730] text-slate-900 font-bold text-xs rounded-lg transition-all shadow-sm"
          >
            Login First
          </Link>
          <Link
            href="/signup/student"
            className="flex-1 sm:flex-initial text-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-lg transition-all border border-white/20"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B2A6B] via-[#162256] to-[#0d1635] text-white p-6 sm:p-8 mb-8 shadow-xl border border-amber-400/20"
    >
      {/* Background glow decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Lock size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles size={12} /> Login Required for Full Access
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <Link
            href={loginRedirectUrl}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C9A227] to-[#dfb738] hover:from-[#dfb738] hover:to-[#C9A227] text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <UserCheck size={16} />
            Login First
          </Link>
          <Link
            href="/signup/student"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
          >
            Register <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
