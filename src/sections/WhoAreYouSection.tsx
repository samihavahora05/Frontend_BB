import { motion } from "framer-motion";
import { Briefcase, Building2, GraduationCap, Search, UserCheck, Users } from "lucide-react";
import { cardHover, staggerContainer, staggerItem } from "../animations/variants";

const personas = [
  { title: "Student", desc: "Build industry-ready skills with structured foundations and guided practice.", icon: GraduationCap },
  { title: "Intern", desc: "Work on live projects, ship portfolio proof, and learn professional workflows.", icon: Briefcase },
  { title: "Job Seeker", desc: "Prepare for interviews, resumes, mock rounds, and placement conversations.", icon: Search },
  { title: "Mentee", desc: "Get focused 1-on-1 guidance from practitioners who have done the work.", icon: UserCheck },
  { title: "Business Owner", desc: "Launch sharper websites, brand systems, and digital growth engines.", icon: Building2 },
  { title: "Company Hiring", desc: "Access trained, pre-vetted talent aligned with modern business needs.", icon: Users },
];

export const WhoAreYouSection = () => {
  return (
    <section className="relative overflow-hidden border-y border-[#E2E8F0] bg-white py-24">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#1B2A6B]/10 blur-[120px]" />
        <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#C9A227]/10 blur-[130px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[45%] h-[45%] rounded-full bg-[#1B2A6B]/8 blur-[110px]" />
      </div>
      <motion.div
        aria-hidden
        className="absolute right-0 top-12 h-40 w-[34rem] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.13),transparent_68%)]"
        animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#C9A227]">Career Pathways</p>
          <h2 className="mb-4 text-3xl font-bold text-[#0F172A] md:text-4xl">
            <span className="gradient-text">Designed for Every Stage</span>
          </h2>
          <p className="text-base leading-7 text-[#64748B]">
            Whether you are starting out or scaling up, each track is crafted to accelerate skill, proof, and outcomes.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <svg
            className="pointer-events-none absolute inset-x-6 top-20 hidden h-[58%] w-[calc(100%-3rem)] lg:block"
            viewBox="0 0 1000 360"
            fill="none"
            aria-hidden
            preserveAspectRatio="none"
          >
            <motion.path
              d="M40 80 C220 10 280 150 430 112 C610 66 620 276 790 222 C888 192 924 260 960 294"
              stroke="url(#stagePath)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 12"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="stagePath" x1="40" y1="80" x2="960" y2="294" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B2A6B" />
                <stop offset="0.5" stopColor="#C9A227" />
                <stop offset="1" stopColor="#1B2A6B" />
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {personas.map((persona) => (
              <motion.article
                key={persona.title}
                variants={staggerItem}
                whileHover={cardHover}
                className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_12px_30px_rgba(13,22,53,0.04)] transition-all duration-300 hover:border-[#1B2A6B]/25 hover:shadow-[0_20px_50px_rgba(27,42,107,0.12)]"
              >
                {/* Top accent line on hover */}
                <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-[#1B2A6B] to-[#C9A227] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute right-4 top-4 h-12 w-12 rounded-2xl bg-[#1B2A6B]/5 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Icon box */}
                <div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#1B2A6B]/5 text-[#1B2A6B] shadow-[0_6px_16px_rgba(27,42,107,0.05)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-[-3deg] group-hover:border-[#1B2A6B]/20 group-hover:shadow-[0_8px_18px_rgba(27,42,107,0.15)]"
                >
                  <persona.icon size={18} />
                </div>

                {/* Content */}
                <h3 className="mb-1 text-[15px] font-bold text-[#0d1635]">{persona.title}</h3>
                <p className="text-[12px] leading-snug text-[#4a5568]">{persona.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
