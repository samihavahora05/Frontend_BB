import { useRef, useState } from "react";
import { motion, useAnimationFrame, useInView } from "framer-motion";
import { useCountUp } from "../hooks/useAnimations";
import {
  GraduationCap,
  Users,
  Briefcase,
  Star,
  Sparkles,
  Building2,
} from "lucide-react";
import useSWR from "swr";
import api from "../lib/axios";
import { partnerCompanies } from "../data/companies";

interface CompanyType {
  id?: number;
  name: string;
  logo?: string;
}

const AnimatedCount = ({ end, suffix }: { end: number; suffix: string }) => {
  const { ref } = useCountUp(end, 1000);
  return (
    <>
      <span ref={ref}>0</span>
      {suffix}
    </>
  );
};

const GrowthCurve = () => (
  <svg className="w-8 h-4 text-[#C9A227] shrink-0" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 22C8.5 20.5 13.5 10.5 19.5 10.5C25.5 10.5 27.5 17 33.5 13.5C39.5 10 42.5 3 46 2"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// High-contrast clean logo badge component with robust fallback image handling
const CompanyLogo = ({ name, logo }: { name: string; logo?: string }) => {
  const [imgError, setImgError] = useState(false);

  const initials = (name || "Company")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-[190px] h-24 shrink-0 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-3.5 flex items-center justify-center relative overflow-hidden group hover:border-[#1B2A6B]/30 hover:shadow-[0_12px_30px_rgba(27,42,107,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 pointer-events-none" />
      {/* Ambient background glow ring behind logo */}
      <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-slate-200/60 via-slate-100/40 to-amber-100/30 blur-md group-hover:from-amber-200/60 group-hover:via-indigo-100/50 group-hover:to-blue-100/40 transition-all duration-500 pointer-events-none z-0" />

      {logo && !imgError ? (
        <img
          src={logo}
          alt={name}
          className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-300 relative z-10 [filter:drop-shadow(0_4px_10px_rgba(15,23,42,0.55))_drop-shadow(0_0_1.5px_rgba(15,23,42,0.75))]"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1B2A6B] via-indigo-600 to-[#C9A227] flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20 relative z-10">
          {initials}
        </div>
      )}
    </div>
  );
};

const CustomMarquee = ({ companies, speed = 35, reverse = false }: { companies: CompanyType[]; speed?: number; reverse?: boolean }) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const isPaused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (isPaused.current || !innerRef.current) return;
    const dir = reverse ? 1 : -1;
    xRef.current += (dir * speed * delta) / 1000;
    const halfWidth = innerRef.current.scrollWidth / 2;
    if (xRef.current <= -halfWidth) xRef.current = 0;
    if (xRef.current >= 0 && reverse) xRef.current = -halfWidth;
    innerRef.current.style.transform = `translateX(${xRef.current}px)`;
  });

  return (
    <div
      className="relative overflow-hidden py-2"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
    >
      <div ref={innerRef} className="flex will-change-transform gap-6 w-max items-center">
        {companies.map((c, i) => (
          <div key={`a-${c.name}-${i}`} className="shrink-0">
            <CompanyLogo name={c.name} logo={c.logo} />
          </div>
        ))}
        {companies.map((c, i) => (
          <div key={`b-${c.name}-${i}`} className="shrink-0">
            <CompanyLogo name={c.name} logo={c.logo} />
          </div>
        ))}
      </div>
    </div>
  );
};

export interface ClientsSectionProps {
  titlePrefix?: string;
  highlightText?: string;
  subtitle?: string;
}

export const ClientsSection = ({
  titlePrefix = "Clients and ",
  highlightText = "Top Companies",
  subtitle = "We are proud to work with leading corporate hiring partners and clients worldwide"
}: ClientsSectionProps = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "0px" });

  const fetcher = (url: string) => api.get(url).then(res => res.data.data);
  const { data: statsData } = useSWR('/public/stats', fetcher, { revalidateOnFocus: false });

  const fallbackPartners = partnerCompanies.map(c => ({
    name: c.name,
    logo: c.logoUrl
  }));

  const partners = fallbackPartners; // Local source of truth containing valid existing logo files

  const row1 = partners.slice(0, Math.ceil(partners.length / 2));
  const row2 = partners.slice(Math.ceil(partners.length / 2));

  const currentStats = [
    { value: 5000, suffix: "+", label: "Students Trained", icon: GraduationCap },
    { value: statsData?.partners ? Math.max(statsData.partners, 250) : 250, suffix: "+", label: "Hiring Partners", icon: Users },
    { value: statsData?.projects ? Math.max(statsData.projects, 3000) : 3000, suffix: "+", label: "Live Projects", icon: Briefcase },
    { value: 98.4, suffix: "%", label: "Placement Rate", icon: Star },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section ref={containerRef} className="bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 py-[90px] overflow-hidden border-y border-slate-200/80 relative">
      {/* Decorative Dots Pattern Background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 80%)"
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 md:px-6 relative z-20">

        {/* Floating Graphics Element - Left */}
        <div className="absolute left-[-20px] xl:left-0 top-[20px] hidden lg:flex flex-col items-center z-30">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-[0_12px_24px_rgba(15,23,42,0.06)] flex items-center justify-center relative rotate-[-6deg]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/10 text-[#1B2A6B] flex items-center justify-center">
              <Users size={18} />
            </div>
          </motion.div>
        </div>

        {/* Floating Graphics Element - Right */}
        <div className="absolute right-[-20px] xl:right-0 top-[40px] hidden lg:flex flex-col items-center z-30">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-[0_12px_24px_rgba(15,23,42,0.06)] flex items-center justify-center relative rotate-[8deg]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/10 text-[#1B2A6B] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div className="absolute -top-12 -right-8 w-24 h-24 bg-blue-100/40 rounded-full blur-2xl pointer-events-none z-[-1]" />
          </motion.div>
        </div>

        {/* Header Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-[#1B2A6B] border border-slate-200/80 text-xs font-black uppercase tracking-widest mb-4 shadow-sm"
          >
            <Building2 size={13} className="text-[#C9A227]" />
            <span>Corporate Trust & Recruiter Network</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-[#0F172A] font-black text-3xl md:text-5xl tracking-tight mb-3 leading-tight"
          >
            {titlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600">{highlightText}</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-[#64748B] text-sm md:text-base font-semibold leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1150px] mx-auto mb-14"
        >
          {currentStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_15px_35px_rgba(27,42,107,0.1)] transition-all duration-300 hover:border-[#1B2A6B]/30 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#1B2A6B]/10 text-[#1B2A6B] flex items-center justify-center flex-shrink-0 shadow-inner">
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    <AnimatedCount end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-500 mt-1.5 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
              <GrowthCurve />
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Logos Dual-Row Infinite Floating Marquee Stage */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative py-2 my-4"
        >
          {/* Side Fade Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          <div className="flex flex-col gap-5">
            <CustomMarquee companies={row1} speed={30} />
            <CustomMarquee companies={row2} speed={26} reverse={true} />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
