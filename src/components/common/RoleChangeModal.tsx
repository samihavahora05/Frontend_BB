import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShieldAlert, CheckCircle2, Clock, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
  targetRole: string;
  targetRoleDisplay?: string;
  onSuccess?: () => void;
}

export const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  targetRole,
  targetRoleDisplay,
  onSuccess
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPending, setHasPending] = useState(false);
  const [pendingRole, setPendingRole] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const displayTarget = targetRoleDisplay || (targetRole === 'jobseeker' ? 'Jobseeker' : targetRole === 'intern' ? 'Intern' : 'Student');
  const displayCurrent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

  // Check if user already has a pending request
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      return;
    }

    const checkStatus = async () => {
      setIsLoadingStatus(true);
      try {
        const res = await api.get('/role-change-requests/my-status');
        if (res.data?.has_pending) {
          setHasPending(true);
          const reqRole = res.data.pending_request?.requested_role;
          setPendingRole(reqRole ? reqRole.replace('-', ' ') : 'Target Role');
        } else {
          setHasPending(false);
        }
      } catch (err) {
        // Non-blocking
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkStatus();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const backendTarget = targetRole === 'jobseeker' ? 'job-seeker' : targetRole;
      const res = await api.post('/role-change-requests', {
        requested_role: backendTarget,
        reason: reason.trim() || `Request to transition from ${displayCurrent} to ${displayTarget} to apply for opportunities.`
      });

      if (res.data?.success) {
        setIsSubmitted(true);
        toast.success('Role change request submitted for Admin review.');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit role change request. Please try again.';
      toast.error(msg);
      if (err.response?.status === 409) {
        setHasPending(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden font-inter"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#1B2A6B] to-[#2A3E8C] p-6 text-white overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
            >
              <X size={16} />
            </button>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
              <Sparkles size={12} /> Account Role Transition
            </div>
            <h3 className="text-xl font-black font-sora">Request Role Change</h3>
            <p className="text-xs text-white/80 mt-1">
              Switch your profile to unlock new opportunity application permissions.
            </p>
          </div>

          <div className="p-6">
            {isLoadingStatus ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
                <p className="text-xs font-medium">Checking request status...</p>
              </div>
            ) : isSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Request Submitted!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
                  Your request to transition from <strong className="text-slate-800">{displayCurrent}</strong> to <strong className="text-[#1B2A6B]">{displayTarget}</strong> has been sent to the administrators for review. You will receive an update once approved.
                </p>
                <Button
                  onClick={onClose}
                  className="w-full bg-[#1B2A6B] hover:bg-[#0d1635] text-white py-3 rounded-xl font-bold text-sm"
                >
                  Understood
                </Button>
              </div>
            ) : hasPending ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Review in Progress</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
                  You already have an active request pending administrator review to change your role to <strong className="text-amber-800 capitalize">{pendingRole}</strong>.
                </p>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-left mb-6">
                  Our team typically reviews role requests within 24 hours. Once approved, your application permissions will update automatically.
                </div>
                <Button
                  onClick={onClose}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-sm"
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Transition Badges */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-center flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Current Role</span>
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-200 text-slate-700 font-black text-xs">
                      {displayCurrent}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400">
                    <ArrowRight size={14} />
                  </div>
                  <div className="text-center flex-1">
                    <span className="text-[10px] font-bold text-[#1B2A6B] uppercase tracking-widest block mb-0.5">Requested Role</span>
                    <span className="inline-block px-3 py-1 rounded-lg bg-[#1B2A6B]/10 text-[#1B2A6B] font-black text-xs">
                      {displayTarget}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium leading-relaxed flex items-start gap-2.5">
                  <ShieldAlert size={16} className="text-[#1B2A6B] shrink-0 mt-0.5" />
                  <div>
                    Becoming a <strong className="font-bold">{displayTarget}</strong> will enable direct applications for {displayTarget === 'Jobseeker' ? 'full-time jobs' : 'internship positions'}.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Reason for Role Change <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder={`e.g., I have graduated / completed my studies and am actively looking for ${displayTarget === 'Jobseeker' ? 'full-time job opportunities' : 'hands-on internships'}...`}
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all text-xs text-slate-800 font-medium resize-none bg-white shadow-xs placeholder:text-slate-400"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-xs shadow-md shadow-[#1B2A6B]/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
