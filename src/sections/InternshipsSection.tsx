import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../animations/variants";
import { Award, Target, Briefcase, ArrowRight, CheckCircle, Code, PenTool, TrendingUp, Cpu, BarChart, Smartphone } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "../components/ui/TiltCard";
import { dummyInternships } from "../data/internships";

// fallback icons based on some logic or hardcode for now
const getIcon = (title: string) => {
  if (title.includes('Web')) return Code;
  if (title.includes('Design')) return PenTool;
  if (title.includes('Digital')) return TrendingUp;
  if (title.includes('AI') || title.includes('Machine')) return Cpu;
  if (title.includes('Data')) return BarChart;
  if (title.includes('App')) return Smartphone;
  return Briefcase;
};

const features = [
  { icon: Award, text: "Industry-Recognized Certificate" },
  { icon: Target, text: "Real Live Project Work" },
  { icon: Briefcase, text: "Dedicated Placement Support" },
  { icon: CheckCircle, text: "Performance-based Stipend" },
];

export const InternshipsSection = () => {
  // const fetcher = (url: string) => api.get(url).then(res => res.data.data);
  // const { data: internshipsData } = useSWR('/public/internships-cms', fetcher, { revalidateOnFocus: false });
  const currentInternships = dummyInternships.slice(0, 6);

  if (currentInternships.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50/20 to-slate-50 overflow-hidden border-y border-slate-100 relative">
      {/* Decorative Wave Gradient SVG */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          className="w-full h-auto translate-y-1"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,96 C288,160 576,64 864,128 C1152,192 1296,128 1440,160 L1440,200 L0,200 Z"
            fill="url(#wave-grad)"
          />
          <defs>
            <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(219, 234, 254, 0.2)" />
              <stop offset="100%" stopColor="rgba(241, 245, 249, 0.8)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* Left: Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="w-full lg:w-5/12"
          >
            <motion.p variants={staggerItem} className="text-xs font-bold tracking-widest uppercase text-[#C9A227] mb-3">
              Internships
            </motion.p>
            <motion.h2 variants={staggerItem} className="text-3xl md:text-4xl font-bold text-[#0d1635] mb-4">
              Guaranteed Internships
            </motion.h2>
            <motion.p variants={staggerItem} className="text-base text-[#4a5568] mb-8">
              Gain practical experience by working on real projects with top companies. Build a portfolio that stands out.
            </motion.p>

            <motion.ul variants={staggerContainer} className="space-y-3 mb-8">
              {features.map((f) => (
                <motion.li
                  key={f.text}
                  variants={staggerItem}
                  className="flex items-center gap-3 text-slate-700 text-sm font-medium"
                >
                  <div className="w-6 h-6 rounded-md bg-[#1B2A6B]/8 text-[#1B2A6B] flex items-center justify-center flex-shrink-0">
                    <f.icon size={14} />
                  </div>
                  {f.text}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={staggerItem}>
              <Link href="/internships" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg btn-primary font-medium text-sm">
                Explore Internships <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Domain grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="w-full lg:w-7/12 grid grid-cols-2 sm:grid-cols-3 gap-4 perspective-1000"
          >
            {currentInternships.map((item: any) => {
              const Icon = getIcon(item.title);
              return (
              <motion.div key={item.title} variants={staggerItem}>
                <TiltCard>
                  <Link
                    href={`/internships?search=${encodeURIComponent(item.title)}`}
                    className="group p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#1B2A6B]/25 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-3 w-full h-full block"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all duration-300 group-hover:bg-[#1B2A6B] group-hover:text-white group-hover:border-[#1B2A6B] group-hover:scale-110 group-hover:rotate-[-6deg] group-hover:shadow-[0_4px_12px_rgba(27,42,107,0.2)]">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#1B2A6B] transition-colors">{item.title}</span>
                  </Link>
                </TiltCard>
              </motion.div>
            )})}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
