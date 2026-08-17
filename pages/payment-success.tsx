import React from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircle2, Download, ArrowRight, ShieldCheck, 
  Sparkles, Calendar, UserCheck, HelpCircle, LayoutDashboard
} from "lucide-react";
import { AnimatedContent } from "../src/components/reactbits/AnimatedContent";
import { useRouter } from "next/router";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { order_id, payment_id, amount, service, expert } = router.query;
  const today = new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });

  const handlePrintInvoice = () => {
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

        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[140px] pointer-events-none no-print" 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.25, 0.4, 0.25] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-[#C9A227]/15 rounded-full blur-[120px] pointer-events-none no-print" 
        />

        <div className="container mx-auto px-4 md:px-6 max-w-2xl relative z-10">
          <AnimatedContent direction="up" delay={0.1}>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-[0_20px_50px_rgba(13,22,53,0.06)] text-center print-receipt-card">
              
              {/* Print Only Header Logo */}
              <div className="hidden print:flex items-center justify-between border-b-2 border-[#1B2A6B] pb-4 mb-6 text-left">
                <div>
                  <h2 className="text-xl font-black text-[#0d1635] tracking-tight">BLUEBOXX DA PVT. LTD.</h2>
                  <p className="text-xs text-slate-500 font-semibold">Official Payment Receipt & Tax Invoice</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-600 block">{today}</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PAID & VERIFIED</span>
                </div>
              </div>

              {/* Success Badge Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.18, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md no-print" 
                />
                <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25 relative z-10">
                  <CheckCircle2 size={44} className="text-white" />
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
                <Sparkles size={14} className="text-[#C9A227]" /> Payment Confirmed & Access Granted
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-[#0d1635] mb-3 tracking-tight">
                Payment Successful!
              </h1>
              <p className="text-slate-600 text-sm md:text-base max-w-lg mx-auto mb-8 font-medium leading-relaxed">
                Thank you for your transaction with <span className="text-[#0d1635] font-black">Blueboxx DA</span>. Your payment has been verified by Razorpay and your booking is now active.
              </p>

              {/* Order Receipt Card */}
              <div className="bg-slate-50/80 rounded-2xl p-6 mb-8 border border-slate-200 text-left space-y-4 shadow-xs">
                {service && (
                  <div className="pb-3 border-b border-slate-200/80">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Item / Session</span>
                    <span className="text-sm font-black text-[#0d1635]">
                      {String(service)} {expert ? `with ${expert}` : ''}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Order ID</span>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block">
                      {order_id || 'ORD-VERIFIED'}
                    </span>
                  </div>
                  {payment_id && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment ID</span>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 inline-block">
                        {payment_id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date</span>
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" /> {today}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Amount Paid</span>
                    <span className="text-base font-black text-emerald-600">
                      ₹{amount ? Number(amount).toLocaleString('en-IN') : 'Confirmed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs font-medium">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-600" /> Payment Security
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Razorpay 256-Bit Verified
                  </span>
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="bg-blue-50/60 rounded-2xl p-5 mb-8 border border-blue-100 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0d1635] mb-2 flex items-center gap-1.5">
                  <UserCheck size={16} className="text-blue-600" /> What Happens Next?
                </h4>
                <ul className="text-xs font-medium text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Your mentorship / course materials are immediately active in your Student Dashboard.</li>
                  <li>A formal confirmation receipt has been issued for your records.</li>
                  <li>Our support team is available if you need guidance joining your session.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
                <button 
                  onClick={handlePrintInvoice}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all shadow-xs"
                >
                  <Download size={18} /> Print Invoice
                </button>

                <Link 
                  href="/student/dashboard" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0d1635] hover:bg-slate-800 text-white font-black text-sm transition-all shadow-lg shadow-[#0d1635]/20 hover:scale-[1.02]"
                >
                  <LayoutDashboard size={18} /> Go to Dashboard <ArrowRight size={18} />
                </Link>
              </div>

              {/* Need Help Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-semibold no-print">
                <span>Need assistance?</span>
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
                  <HelpCircle size={14} /> Contact Support
                </Link>
              </div>

            </div>
          </AnimatedContent>
        </div>
      </div>
    </MainLayout>
  );
}
