import { motion } from "framer-motion";
import {
  Rocket,
  Users,
  Briefcase,
  Mic2,
  Award,
  Sparkles,
} from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  cardHover,
} from "../animations/variants";

const reasons = [
  {
    icon: Rocket,
    title: "Live Projects",
    desc: "Work on real client projects — not hypothetical assignments. Ship code, design systems, and campaigns that matter.",
    accent: "from-blue-500 to-cyan-400",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "Industry Experts",
    desc: "Get 1-on-1 guidance from professionals at Google, Meta, Stripe, and more. Learn what textbooks can't teach.",
    accent: "from-violet-500 to-purple-400",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Briefcase,
    title: "Placement Support",
    desc: "100+ hiring partners, dedicated placement cell, resume reviews, and interview preparation until you land your dream role.",
    accent: "from-emerald-500 to-green-400",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Mic2,
    title: "Mock Interviews",
    desc: "Practice with real interviewers in structured rounds — technical, HR, and behavioral — with detailed feedback reports.",
    accent: "from-amber-500 to-orange-400",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Award,
    title: "Certifications",
    desc: "Earn industry-recognized certificates that validate your skills and boost your resume for top recruiters.",
    accent: "from-rose-500 to-pink-400",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Sparkles,
    title: "Lifetime Community",
    desc: "Join our active network of 5,000+ alumni and mentors. Gain access to weekly hackathons, study groups, and exclusive job referrals.",
    accent: "from-sky-500 to-cyan-400",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
];

export const WhyChooseSection = () => {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: "linear-gradient(160deg,#f7f9ff 0%,#eef3ff 40%,#f5f0ff 80%,#fff7ed 100%)" }}>
      {/* Hexagonal dot pattern */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "radial-gradient(rgba(27,42,107,0.09) 1.5px,transparent 1.5px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0, 12px 12px",
        opacity: 0.7,
      }} />
      {/* Top animated navy glow */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 -top-8 h-48 w-[52rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(27,42,107,0.12),transparent_68%)]"
        animate={{ y: [0, 14, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Gold bottom-right accent glow */}
      <div aria-hidden className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at bottom right,rgba(201,162,39,0.08),transparent 65%)" }} />


      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#C9A227]">
            Why BlueBoxx
          </p>
          <h2 className="mb-4 text-3xl font-bold text-[#0d1635] md:text-4xl">
            <span className="gradient-text">Everything You Need to Succeed</span>
          </h2>
          <p className="text-base leading-7 text-[#4a5568]">
            A single platform that combines learning, mentorship, real-world experience, and career launch  designed to get you hired.
          </p>
        </motion.div>

        {/* Feature cards — perfectly aligned 3x2 grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
        >
          {reasons.map((reason) => (
            <motion.article
              key={reason.title}
              variants={staggerItem}
              whileHover={cardHover}
              className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_12px_30px_rgba(13,22,53,0.04)] transition-all duration-300 hover:border-[#1B2A6B]/30 hover:shadow-[0_20px_50px_rgba(27,42,107,0.12)]"
            >
              {/* Dynamic top accent line on hover */}
              <div className={`absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r ${reason.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Glow blob */}
              <div className="absolute right-4 top-4 h-12 w-12 rounded-2xl bg-blue-50/50 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Icon */}
              <div
                className={`relative mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-white to-blue-50/30 shadow-[0_6px_16px_rgba(37,99,235,0.05)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-[-4deg] group-hover:border-blue-200/80 group-hover:shadow-[0_8px_18px_rgba(37,99,235,0.15)] ${reason.iconColor}`}
              >
                <reason.icon size={18} />
              </div>

              {/* Content */}
              <h3 className="relative mb-1 text-[15px] font-bold text-[#0F172A]">
                {reason.title}
              </h3>
              <p className="relative text-[12px] leading-snug text-[#64748B]">
                {reason.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>


      </div>
    </section>
  );
};
