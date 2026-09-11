import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, LogIn, ArrowRight, Briefcase, GraduationCap, Sparkles, BookOpen } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export type AuthActionType = 'job' | 'internship' | 'course' | 'expert' | 'general';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType?: AuthActionType;
  title?: string;
  description?: string;
  itemTitle?: string;
  returnUrl?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  actionType = 'general',
  title,
  description,
  itemTitle,
  returnUrl,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const effectiveReturnUrl = returnUrl || router.asPath || '/';

  let defaultTitle = 'Login Required';
  let defaultDescription = 'You need to log in to continue.';
  let IconComponent = Lock;
  let gradientFrom = 'from-[#1B2A6B]';
  let gradientTo = 'to-[#2A3E8C]';
  let badgeText = 'Authentication Required';
  let badgeColor = 'text-amber-300 bg-white/15';

  switch (actionType) {
    case 'job':
      defaultTitle = 'Login Required';
      defaultDescription = 'Please log in to apply for this job.';
      IconComponent = Briefcase;
      badgeText = 'Job Application';
      break;
    case 'internship':
      defaultTitle = 'Login Required';
      defaultDescription = 'Please log in to apply for this internship.';
      IconComponent = GraduationCap;
      badgeText = 'Internship Application';
      break;
    case 'course':
      defaultTitle = 'Login Required';
      defaultDescription = 'Please log in to enroll in this course.';
      IconComponent = BookOpen;
      badgeText = 'Course Enrollment';
      break;
    case 'expert':
      defaultTitle = 'Login Required';
      defaultDescription = 'You need to log in to book an expert session.';
      IconComponent = Sparkles;
      badgeText = 'Expert Consultation';
      break;
    default:
      defaultTitle = 'Login Required';
      defaultDescription = 'You need to log in to access this feature.';
      IconComponent = Lock;
      badgeText = 'Account Access';
  }

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  const handleLoginClick = () => {
    onClose();
    router.push(`/login?returnUrl=${encodeURIComponent(effectiveReturnUrl)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden font-inter"
        >
          {/* Header Banner */}
          <div className={`relative bg-gradient-to-r ${gradientFrom} ${gradientTo} p-6 text-white overflow-hidden`}>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${badgeColor} text-[11px] font-bold uppercase tracking-wider mb-2`}>
              <IconComponent size={12} /> {badgeText}
            </div>
            <h3 className="text-xl font-black font-sora">{finalTitle}</h3>
          </div>

          <div className="p-6">
            <div className="text-center py-2 mb-4">
              <div className="w-14 h-14 bg-blue-50 text-[#1B2A6B] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <IconComponent size={28} />
              </div>

              {itemTitle && (
                <div className="mb-2 inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 max-w-full truncate">
                  {itemTitle}
                </div>
              )}

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {finalDescription}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-sm shadow-md shadow-[#1B2A6B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <LogIn size={16} />
                <span>Log In</span>
                <ArrowRight size={14} className="ml-0.5 opacity-80" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account yet?{' '}
                <Link
                  href={`/register?returnUrl=${encodeURIComponent(effectiveReturnUrl)}`}
                  onClick={onClose}
                  className="text-[#1B2A6B] font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};