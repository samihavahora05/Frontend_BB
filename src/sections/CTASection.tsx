import { motion } from "framer-motion";
import { staggerContainer, staggerItem, EASE_OUT_EXPO } from "../animations/variants";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
export const CTASection = () => {

  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0d1635] via-[#1B2A6B] to-[#0f1f4d] px-6 py-16 text-center shadow-[0_26px_80px_rgba(13,22,53,0.30)] md:p-20 max-w-5xl mx-auto"
        >
          {/* Gold accent top glow */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-0 h-44 w-[44rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.15),transparent_68%)]"
            animate={{ y: [0, 16, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Decorative dots */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#C9A227 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-white/8 text-white border border-white/15 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] animate-pulse" />
              Now accepting applications
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
              className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl"
            >
              Ready to Start Your <span className="text-[#C9A227]">Dream Career?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.55, ease: EASE_OUT_EXPO }}
              className="mx-auto mb-10 max-w-lg text-base leading-7 text-blue-200/80"
            >
              Join 5,000+ students transforming learning, internships, mentorship, and placement into one premium pathway.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.div variants={staggerItem} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} data-magnetic>
                <Link
                  href="/courses"
                  className="bg-gradient-to-r from-[#C9A227] to-[#e0b840] text-[#0d1635] font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(201,162,39,0.25)]"
                >
                  Enroll Now <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div variants={staggerItem} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/internships"
                  className="inline-block bg-transparent text-white border border-white/25 hover:bg-white/8 transition-all px-8 py-3.5 rounded-xl font-bold"
                >
                  Apply for Internship
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-blue-200/70"
            >
              {["No hidden fees", "7-day money-back guarantee", "Certificate included"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#C9A227]" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
