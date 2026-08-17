import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SEO } from "../src/components/seo/SEO";

export default function RefundPolicyPage() {
  return (
    <MainLayout>
      <SEO title="Refund Policy | Blueboxx DA" description="Read our refund policy to understand our non-refundable fee structure." />
      <div className="pt-24 pb-16 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6">Refund Policy</h1>
          <p className="text-[#64748B] max-w-2xl mx-auto mb-10 text-lg">This page is part of the premium frontend experience.</p>
          <Link href="/" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2">Back to Home <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    </MainLayout>
  );
}
