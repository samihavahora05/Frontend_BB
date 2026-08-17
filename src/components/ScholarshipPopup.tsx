import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ArrowRight, Zap, Target } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const CAMPAIGN_ID = 'bb_scholarship_popup_seen_2026_talent';

export const ScholarshipPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Don't show on dashboard routes, if they are admins/companies, or if already on scholarships page
  const isDashboard = router.pathname.startsWith('/admin') || router.pathname.startsWith('/company');
  const isScholarshipsPage = router.pathname === '/scholarships';
  const isTargetAudience = user?.role === 'student';

  useEffect(() => {
    if (isDashboard || isScholarshipsPage || !isTargetAudience) return;

    const hasSeenPopup = localStorage.getItem(CAMPAIGN_ID);
    const hasAppliedGlobally = localStorage.getItem('bb_scholarship_applied_global');
    if (hasSeenPopup || hasAppliedGlobally) return;

    // Trigger 1: Time Delay (20 seconds)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 20000);

    // Trigger 2: Exit Intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDashboard, isScholarshipsPage, isTargetAudience]);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(CAMPAIGN_ID, 'true');
  };

  const handleApply = () => {
    setIsOpen(false);
    localStorage.setItem(CAMPAIGN_ID, 'true');
    // If they click apply here, let's assume they want to go to the page. 
    // They might not actually submit, so we don't set the global flag here, just the campaign dismissed flag.
    router.push('/scholarships');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-[#0d1635] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="p-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A227] to-amber-600 flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(201,162,39,0.3)]">
                <Award size={32} />
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                Unlock Your <span className="text-[#C9A227]">Potential.</span>
              </h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Apply for the Blueboxx DA Scholarship & Talent Challenge. Win cash prizes, guaranteed internships, and pro memberships.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Zap size={16} />
                  </div>
                  <div>
                    <p className="font-bold">₹50,000 Prize Pool</p>
                    <p className="text-[10px] text-slate-400">For top performers in coding & design.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Target size={16} />
                  </div>
                  <div>
                    <p className="font-bold">Guaranteed Internships</p>
                    <p className="text-[10px] text-slate-400">Direct placement for challenge winners.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-[#C9A227] hover:bg-amber-500 text-[#0d1635] font-black py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#C9A227]/20 flex items-center justify-center gap-2 group"
                >
                  Apply Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-xl transition-all border border-white/10"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
