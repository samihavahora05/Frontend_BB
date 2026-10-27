import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldAlert, CheckCircle2, FileText, Mail } from "lucide-react";
import { SEO } from "../src/components/seo/SEO";

export default function RefundPolicyPage() {
  return (
    <MainLayout>
      <SEO 
        title="Official Refund & Fee Policy | BlueBoxx" 
        description="Official fee structure, non-refundable platform policy, and terms governing deposits, courses, and internship applications at BlueBoxx." 
        keywords="Refund Policy, Fee Policy, Blueboxx Refund, Payment Terms, Non-refundable Fee, Student Policy"
      />
      <div className="pt-28 pb-20 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldAlert size={14} /> Legal & Financial Compliance
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Refund & Fee Policy</h1>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                BlueBoxx operates with full transparency regarding platform enrollment, mentorship allocations, and administrative deposits.
              </p>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText size={20} className="text-[#1B2A6B]" /> 1. Platform Fee Structure
                </h3>
                <p>
                  Platform fees charged during registration cover customized workspace provisioning, learning dashboards, KRA/KPI tracking systems, milestone review infrastructure, and technical support.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80">
                <h3 className="text-lg font-bold text-amber-900 mb-2">2. Non-Refundable Fee Policy</h3>
                <p className="text-amber-800 text-sm mb-3">
                  All fees collected — including Platform Fees, Mentor Booking Fees, and Administrative Deposit Fees — are strictly non-refundable once dashboard access is provisioned or service onboarding commences.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-amber-900/90">
                  <li>Refunds will not be granted for academic scheduling conflicts, medical reasons, personal schedule changes, or device/network issues.</li>
                  <li>Failure to attend allocated mentor sessions or failure to meet KPI deliverables does not constitute grounds for refund.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#1B2A6B]" /> 3. Deposit Adjustments
                </h3>
                <p>
                  Security or administrative deposits, where applicable, may be adjusted internally against platform services or course upgrades, subject to written management approval.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  For full terms, please inspect our complete <Link href="/terms" className="font-bold text-[#1B2A6B] hover:underline">Terms & Conditions of Service</Link>.
                </div>
                <div className="flex gap-3">
                  <Link href="/terms" className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors">
                    Read Terms & Conditions
                  </Link>
                  <Link href="/contact" className="px-5 py-2.5 rounded-xl bg-[#1B2A6B] text-white font-bold text-xs hover:bg-[#0d1635] transition-colors">
                    Contact Billing Support
                  </Link>
                </div>
              </div>

            </div>

          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
