import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { LucideIcon, BookOpen, FolderGit2, Briefcase, Users, Target, Rocket } from "lucide-react";

interface StepType {
  id: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: StepType[] = [
  { id: 1, icon: BookOpen, title: "Learn", desc: "Master in-demand skills through expert-led, project-based courses." },
  { id: 2, icon: FolderGit2, title: "Build Portfolio", desc: "Work on real-world assignments, capstone projects, and case studies." },
  { id: 3, icon: Briefcase, title: "Internship", desc: "Get matched with top companies for hands-on industry experience." },
  { id: 4, icon: Users, title: "Expert Guidance", desc: "One-on-one sessions with senior professionals who've been there." },
  { id: 5, icon: Target, title: "Companies", desc: "Ace interviews, receive offer letters, and land your dream job at top tier companies." },
  { id: 6, icon: Rocket, title: "Career Growth", desc: "Continuous learning support, salary negotiation, and promotions." },
];

const EcosystemStep = ({ step, isLeft }: { step: StepType; isLeft: boolean }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  // Detects when the step row is in the middle 20% of the viewport (40% from top to 40% from bottom)
  const isActive = useInView(rowRef, {
    once: false,
    margin: "-40% 0px -40% 0px"
  });

  return (
    <div ref={rowRef} className="md:grid md:grid-cols-2 gap-8 items-center relative md:mb-12 mb-8 last:mb-0">
      {/* Step Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`${isLeft ? "md:col-start-1" : "md:col-start-2"} relative group`}
      >
        <div
          className={`p-6 rounded-xl transition-all duration-500 relative overflow-hidden flex items-start gap-4 border ${isActive
            ? "bg-white border-[#1B2A6B]/40 shadow-[0_20px_50px_rgba(27,42,107,0.12)] scale-[1.02]"
            : "bg-white border-slate-200/80 shadow-[0_10px_30px_rgba(13,22,53,0.04)] hover:border-slate-300"
            }`}
        >
          {/* Top border accent that lights up */}
          <div
            className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#1B2A6B] via-[#2E45A3] to-[#C9A227] transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Glowing background bubble */}
          <div
            className={`absolute right-0 top-0 w-24 h-24 bg-blue-50/50 rounded-bl-full blur-xl transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
              }`}
          />

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive ? "bg-[#1B2A6B] text-white shadow-lg shadow-[#1B2A6B]/30 scale-105" : "bg-[#1B2A6B]/8 text-[#1B2A6B]"
              }`}
          >
            <step.icon size={20} />
          </div>
          <div className="relative z-10">
            <h3
              className={`text-lg font-bold mb-1 transition-colors duration-500 ${isActive ? "text-[#1B2A6B]" : "text-slate-900"
                }`}
            >
              {step.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
          </div>
        </div>
      </motion.div>

      {/* Center Circle Node removed as requested */}

      {isLeft && <div className="hidden md:block md:col-start-2" />}
    </div>
  );
};

export const EcosystemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tracks the scroll progress of the roadmap container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Transform scroll progress to line height percentage
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-24 text-slate-900 overflow-hidden relative" style={{ backgroundColor: "#f8fafc", position: "relative" }}>
      {/* Blueprint grid lines (Main 48px grid) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(to right, rgba(27,42,107,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,42,107,0.05) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      {/* Blueprint grid lines (Sub 12px grid) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(to right, rgba(27,42,107,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,42,107,0.02) 1px, transparent 1px)",
        backgroundSize: "12px 12px",
      }} />
      {/* Corner glows to add depth */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.08),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_left,rgba(27,42,107,0.08),transparent_60%)] pointer-events-none z-0" />

      {/* Decorative SVG network lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.22] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M 100 200 Q 250 80 400 350 T 800 150 T 1100 450" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 6" />
        <path d="M -50 600 Q 150 400 350 700 T 750 500 T 1300 800" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 6" />
        <circle cx="250" cy="80" r="3" fill="#1B2A6B" />
        <circle cx="800" cy="150" r="3.5" fill="#1B2A6B" />
        <circle cx="150" cy="400" r="2.5" fill="#C9A227" />
        <circle cx="750" cy="500" r="3" fill="#C9A227" />
      </svg>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#C9A227]">Learning Path</p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            The Complete Career Roadmap
          </h2>
          <p className="text-base text-slate-600">
            A structured, proven path from zero skills to a high-paying career.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Scroll-driven progress line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[24px] bottom-[24px] w-[3px] bg-slate-100 rounded-full hidden md:block">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#1B2A6B] via-[#2E45A3] to-[#C9A227] rounded-full shadow-[0_0_8px_rgba(27,42,107,0.4)]"
              style={{
                height: lineHeight,
                originY: 0
              }}
            />
          </div>

          <div className="space-y-6 md:space-y-0 relative">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <EcosystemStep
                  key={step.id}
                  step={step}
                  isLeft={isLeft}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
