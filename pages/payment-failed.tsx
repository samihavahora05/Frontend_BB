import React from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  XCircle, ArrowLeft, HeadphonesIcon, RefreshCw, AlertTriangle, 
  ShieldAlert, HelpCircle, Download
} from "lucide-react";
import { AnimatedContent } from "../src/components/reactbits/AnimatedContent";
import { useRouter } from "next/router";

export default function PaymentFailedPage() {
  const router = useRouter();
  const { reason, order_id, payment_id } = router.query;
  const today = new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });

  const handlePrintNotice = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 text-slate-800 min-h-screen pt-28 pb-24 flex items-center justify-center relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 no-print" 
          style={{ 
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", 
            backgroundSize: "28px 28px" 
          }} 
        />

        {/* Glow Ambient Effects */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-rose-200/40 rounded-full blur-[140px] pointer-events-none no-print" 
        />

        <div className="container mx-auto px-4 md:px-6 max-w-2xl relative z-10">
          <AnimatedContent direction="up" delay={0.1}>
            <div className="bg-white rounded-3xl border border-rose-200/80 p-8 md:p-12 text-center shadow-[0_20px_50px_rgba(225,29,72,0.06)] print-receipt-card">
              
              {/* Print Only Header Logo */}
              <div className="hidden print:flex items-center justify-between border-b-2 border-rose-600 pb-4 mb-6 text-left">
                <div>
                  <h2 className="text-xl font-black text-[#0d1635] tracking-tight">BLUEBOXX DA PVT. LTD.</h2>
                  <p className="text-xs text-slate-500 font-semibold">Transaction Status & Failure Notice</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-600 block">{today}</span>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded border border-rose-200">DECLINED / CANCELLED</span>
                </div>
              </div>

              {/* Failed Badge Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-rose-400/20 rounded-full blur-md no-print" 
                />
                <div className="w-20 h-20 bg-gradient-to-tr from-rose-600 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/25 relative z-10">
                  <XCircle size={44} className="text-white" />
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
                <AlertTriangle size={14} /> Transaction Declined
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-[#0d1635] mb-3 tracking-tight">
                Payment Not Completed
              </h1>
              <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto mb-8 font-medium leading-relaxed">
                We couldn't finalize your transaction. If any funds were deducted, your bank will automatically release them within 3-5 business days.
              </p>

              {/* Status & Error Reason Box */}
              <div className="bg-rose-50/40 rounded-2xl p-6 mb-8 text-left border border-rose-200/80 space-y-3 shadow-xs">
                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-rose-200/60 gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Reason</span>
                  <span className="text-xs font-bold text-rose-700 bg-white px-3 py-1 rounded-lg border border-rose-200">
                    {reason ? String(reason) : 'Payment Cancelled or Bank Declined'}
                  </span>
                </div>

                {(order_id || payment_id) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-rose-200/60">
                    {order_id && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Order Ref</span>
                        <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block">
                          {String(order_id)}
                        </span>
                      </div>
                    )}
                    {payment_id && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Attempt Ref</span>
                        <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 inline-block">
                          {String(payment_id)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs font-medium">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-rose-600" /> Security Guarantee
                  </span>
                  <span className="text-slate-800 font-bold">
                    Zero Deductions Confirmed
                  </span>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-slate-50/80 rounded-2xl p-5 mb-8 border border-slate-200 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0d1635] mb-2 flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-blue-600" /> Recommended Actions
                </h4>
                <ul className="text-xs font-medium text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Try another payment method (UPI / Card / NetBanking).</li>
                  <li>Ensure international / online transactions are enabled on your card.</li>
                  <li>Contact your bank if your card requires additional authentication.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
                <button 
                  onClick={() => router.back()} 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#0d1635] hover:bg-slate-800 text-white font-black text-sm transition-all shadow-lg shadow-[#0d1635]/20 hover:scale-[1.02]"
                >
                  <RefreshCw size={18} /> Retry Payment
                </button>

                <button 
                  onClick={handlePrintNotice}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all shadow-xs"
                >
                  <Download size={18} /> Print Notice
                </button>

                <Link 
                  href="/contact" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all shadow-xs"
                >
                  <HeadphonesIcon size={18} /> Contact Support
                </Link>
              </div>

              {/* Return link */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center no-print">
                <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0d1635] transition-colors">
                  <ArrowLeft size={16} /> Return to Catalog
                </Link>
              </div>

            </div>
          </AnimatedContent>
        </div>
      </div>
    </MainLayout>
  );
}
