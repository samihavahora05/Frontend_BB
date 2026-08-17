import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem, EASE_OUT_EXPO } from "../animations/variants";
import Link from "next/link";
import useSWR from "swr";
import api from "../lib/axios";

const faqs = [
  { q: "Do you provide placement guarantee?", a: "We provide best-in-class placement assistance with 100+ hiring partners. Our curriculum ensures you're 100% industry-ready with a strong portfolio and interview preparation." },
  { q: "Are the internships paid?", a: "Yes, we offer stipend-based internships (₹5,000–₹15,000/month) based on your skillset and the company. Unpaid internships also come with an industry-recognized certificate." },
  { q: "Can I book a mentor session without enrolling in a course?", a: "Absolutely. Our mentorship platform is open to everyone. Book 1-on-1 sessions for career guidance, mock interviews, or portfolio reviews — no enrollment required." },
  { q: "What is the refund policy?", a: "We offer a 7-day no-questions-asked refund policy. If the course doesn't meet your expectations in the first week, we will process a full refund immediately." },
  { q: "Do you offer EMI options?", a: "Yes! We offer 0% interest EMI through leading banks and payment platforms like Razorpay, ensuring our courses are accessible to everyone." },
  { q: "How is BlueBoxx different from other edtech platforms?", a: "BlueBoxx is an end-to-end career ecosystem — not just a course marketplace. We combine learning + portfolio + internships + mentorship + placements + agency under one roof." },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const fetcher = (url: string) => api.get(url).then(res => res.data.data || res.data);
  const { data: faqsData } = useSWR('/faqs', fetcher, { revalidateOnFocus: false });

  const currentFaqs = faqsData?.length 
    ? faqsData.map((f: any) => ({ q: f.question, a: f.answer })) 
    : faqs;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg,#fffdf7 0%,#fffbf2 50%,#fff8ee 100%)" }}>
      {/* Sparse navy dot grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "radial-gradient(rgba(27,42,107,0.08) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* Gold corner glow — bottom right */}
      <div aria-hidden className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at bottom right,rgba(201,162,39,0.12),transparent 65%)" }} />
      {/* Navy corner glow — top left */}
      <div aria-hidden className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at top left,rgba(27,42,107,0.06),transparent 65%)" }} />
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={staggerItem} className="text-xs font-bold tracking-widest uppercase text-[#C9A227] mb-3">
            FAQ
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </motion.h2>
        </motion.div>

        <div className="space-y-2">
          {currentFaqs.map((faq: any, index: number) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: EASE_OUT_EXPO }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-primary/25 bg-card shadow-md shadow-primary/5"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-semibold text-base leading-snug transition-colors ${isOpen ? "text-[#1B2A6B]" : "text-foreground group-hover:text-[#1B2A6B]"}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "#1B2A6B" : "hsl(var(--muted))" }}
                    transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ color: isOpen ? "white" : "hsl(var(--muted-foreground))" }}
                  >
                    <Plus size={14} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.45, ease: EASE_OUT_EXPO }}
          className="mt-12 text-center"
        >
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white border border-[#1B2A6B]/20 text-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-colors">
            Need More Help? Contact Us <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
