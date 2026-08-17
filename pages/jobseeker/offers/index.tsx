import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { Gift, Building, CheckCircle2, XCircle, Clock, Loader2, AlertCircle, DollarSign, CalendarCheck } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR, { mutate } from "swr";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";

const fetcher = (url: string) => api.get(url).then(res => res.data);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    pending:  { cls: "bg-amber-50 text-amber-700",  label: "⏳ Pending Decision" },
    accepted: { cls: "bg-emerald-50 text-emerald-700", label: "Accepted" },
    rejected: { cls: "bg-red-50 text-red-700",     label: "Declined" },
  };
  const s = map[status?.toLowerCase()] ?? { cls: "bg-slate-100 text-slate-600", label: status };
  return (
    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function JobseekerOffersPage() {
  const { data, isLoading } = useSWR("/jobseeker/offers", fetcher);
  const offers = data?.data || [];

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{id: number; action: 'accept' | 'reject'; title: string} | null>(null);

  const handleAction = async (id: number, action: 'accept' | 'reject') => {
    setProcessingId(id);
    setConfirmModal(null);
    try {
      await api.post(`/jobseeker/offers/${id}/${action}`);
      toast.success(action === 'accept' ? 'Offer accepted! Congratulations!' : 'Offer declined successfully.');
      mutate("/jobseeker/offers");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <JobseekerDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] mb-2">Job Offers</h1>
        <p className="text-slate-500 font-medium text-sm">Review and respond to your job offers. Accept or decline before they expire.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={36} className="text-[#C9A227]" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-3">No Offers Yet</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            When a company extends a job offer to you, it will appear here. Keep applying and preparing!
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <AlertCircle size={14} />
            <span>Offers are time-sensitive — respond promptly!</span>
          </div>
        </AnimatedContent>
      ) : (
        <div className="space-y-5">
          {offers.map((offer: any, i: number) => (
            <AnimatedContent key={offer.id} direction="up" delay={i * 0.08} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Gold accent bar for pending offers */}
              {offer.status === 'pending' && (
                <div className="h-1 bg-gradient-to-r from-[#C9A227] to-[#1B2A6B]" />
              )}
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                {/* Company Logo */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {offer.company_logo ? (
                    <img src={offer.company_logo} alt={offer.company_name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Building size={28} className="text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <h3 className="text-xl font-black text-[#0d1635] mb-1">{offer.job_title}</h3>
                      <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                        <Building size={14} className="text-slate-400" /> {offer.company_name}
                      </p>
                    </div>
                    <StatusBadge status={offer.status} />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {offer.salary && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <DollarSign size={14} className="text-emerald-600" />
                        </div>
                        <span className="font-black text-slate-800">
                          ₹{Number(offer.salary).toLocaleString('en-IN')}
                          <span className="text-slate-400 font-semibold ml-1">/ {offer.salary_type || 'Year'}</span>
                        </span>
                      </div>
                    )}
                    {offer.joining_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <CalendarCheck size={14} className="text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-700">
                          Join by: <span className="text-slate-800">{offer.joining_date}</span>
                        </span>
                      </div>
                    )}
                    {offer.valid_until && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <Clock size={14} className="text-red-500" />
                        </div>
                        <span className="font-semibold text-slate-700">
                          Expires: <span className="text-red-600 font-black">{offer.valid_until}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {offer.message && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl text-sm text-slate-600 font-medium border border-slate-100 italic">
                      "{offer.message}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                {offer.status === 'pending' && (
                  <div className="flex flex-col gap-3 shrink-0 min-w-[160px]">
                    <button
                      onClick={() => setConfirmModal({ id: offer.id, action: 'accept', title: offer.job_title })}
                      disabled={processingId === offer.id}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                    >
                      {processingId === offer.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      Accept Offer
                    </button>
                    <button
                      onClick={() => setConfirmModal({ id: offer.id, action: 'reject', title: offer.job_title })}
                      disabled={processingId === offer.id}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </AnimatedContent>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setConfirmModal(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 relative p-6"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.action === 'accept' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {confirmModal.action === 'accept' ? (
                  <CheckCircle2 size={32} className="text-emerald-600" />
                ) : (
                  <XCircle size={32} className="text-red-500" />
                )}
              </div>
              <h3 className="text-lg font-black text-slate-900 text-center mb-2">
                {confirmModal.action === 'accept' ? 'Accept this Offer?' : 'Decline this Offer?'}
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                {confirmModal.action === 'accept'
                  ? `You're about to accept the offer for "${confirmModal.title}". This action will notify the company.`
                  : `You're about to decline the offer for "${confirmModal.title}". This cannot be undone.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(confirmModal.id, confirmModal.action)}
                  className={`flex-1 py-2.5 text-white text-sm font-bold rounded-xl transition-colors ${
                    confirmModal.action === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {confirmModal.action === 'accept' ? 'Yes, Accept!' : 'Yes, Decline'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </JobseekerDashboardLayout>
  );
}
