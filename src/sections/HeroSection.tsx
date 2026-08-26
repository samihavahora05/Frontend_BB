import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Star, Target } from "lucide-react";
import { useCountUp } from "../hooks/useAnimations";
import Link from "next/link";
import { useGlobalSettings } from "../contexts/SettingsContext";
import useSWR from "swr";
import api from "../lib/axios";

const EASE = [0.16, 1, 0.3, 1] as const;
const WORDS = ["Skills.", "Projects.", "Careers.", "Internships.", "Placement.", "Futures."];
const WORD_ROTATE_MS = 4500;
const ORBIT_RADIUS = 222;
const ORBIT_DURATION = 48;
const HUB_SIZE = 210;

const ORBIT_CARDS = [
  { icon: Target, title: "Career Roadmap", sub: "Structured Paths" },
  { icon: GraduationCap, title: "1:1 Expert Guidance", sub: "Industry leaders" },
  { icon: BookOpen, title: "Real Client Projects", sub: "3,000+ Built" },
  { icon: CheckCircle2, title: "Company Tie-ups", sub: "250+ Partners" },
  { icon: Star, title: "Student Satisfaction", sub: "4.9/5 Average" },
] as const;

const StatBlock = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { ref } = useCountUp(end, 1000);
  return (
    <div>
      <p className="text-2xl font-bold leading-tight text-white font-sora">
        <span ref={ref}>0</span>
        {suffix}
      </p>
      <p className="mt-0.5 text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
};

const ProofCardContent = ({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ElementType;
  title: string;
  sub: string;
}) => (
  <div className="flex items-center gap-3 whitespace-nowrap rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all hover:border-[#C9A227]/40 hover:bg-white/15">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/10">
      <Icon size={18} className="text-[#C9A227]" strokeWidth={2} />
    </div>
    <div>
      <p className="text-[13px] font-bold leading-tight text-white">{title}</p>
      <p className="mt-0.5 text-[11px] text-slate-300 font-semibold">{sub}</p>
    </div>
  </div>
);

const OrbitRing = () => {
  const count = ORBIT_CARDS.length;
  const step = 360 / count;
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setRotation((elapsed / ORBIT_DURATION) * 360);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      {ORBIT_CARDS.map((card, i) => {
        const angleRad = ((step * i + rotation) * Math.PI) / 180;
        const x = (Math.sin(angleRad) * ORBIT_RADIUS).toFixed(2);
        const y = (-Math.cos(angleRad) * ORBIT_RADIUS).toFixed(2);

        return (
          <div
            key={card.title}
            className="pointer-events-auto absolute left-1/2 top-1/2 will-change-transform"
            style={{
              zIndex: Number(y) > 20 ? 20 : 8,
              transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`,
            }}
          >
            <ProofCardContent {...card} />
          </div>
        );
      })}
    </>
  );
};

export const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const { settings } = useGlobalSettings();

  const fetcher = (url: string) => api.get(url).then(res => res.data.data);
  const { data: stats } = useSWR('/public/stats', fetcher, {
    revalidateOnFocus: false,
    fallbackData: {
      students: 5000,
      placed: 1200,
      projects: 850,
      partners: 100
    }
  });

  useEffect(() => {
    const id = setInterval(() => setWordIndex((p) => (p + 1) % WORDS.length), WORD_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex items-center min-h-[calc(100vh-80px)] bg-[#0d1635] text-white py-10 lg:py-16 overflow-hidden">
      {/* Smooth blurred glowing gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A227]/12 blur-[140px]" />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[160px]" />
        {/* Frosted glass backdrop blur for blending */}
        <div className="absolute inset-0 bg-[#0d1635]/15 backdrop-blur-[70px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10 mx-auto w-full max-w-[1300px] overflow-visible px-6 pb-6 sm:px-8 sm:pb-10 lg:px-10">
        <div className="grid items-center gap-12 overflow-visible lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative z-10 overflow-visible"
          >
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-4 overflow-visible text-[2.25rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-[2.85rem] lg:text-5xl font-sora"
            >
              {settings.hero_title ? (
                <span className="block mb-2">{settings.hero_title}</span>
              ) : (
                <>
                  <span className="block">Build your future</span>
                  <span className="block">with</span>
                  <span className="block mb-2">industry-aligned</span>
                </>
              )}
              <span className="inline-grid overflow-visible">
                <span
                  className="invisible col-start-1 row-start-1 whitespace-nowrap text-[#C9A227] select-none pb-2"
                  aria-hidden="true"
                >
                  Internships.
                </span>
                <span className="col-start-1 row-start-1 overflow-visible">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={wordIndex}
                      initial={{ y: 28, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -28, opacity: 0 }}
                      transition={{ duration: 0.65, ease: EASE }}
                      className="text-[#C9A227] inline-block whitespace-nowrap pb-2"
                      aria-live="polite"
                    >
                      {WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </motion.h1>

            <p className="mb-5 max-w-[480px] text-[15px] leading-relaxed text-slate-300 sm:text-base sm:leading-[1.75]">
              {settings.hero_subtitle || 'Master high-demand skills through expert-led programs, hands-on live projects, and guaranteed internship opportunities tailored for the modern workforce.'}
            </p>

            <div className="mb-6 flex gap-2 sm:gap-3 w-full max-w-md">
              <motion.div whileHover={{ scale: 1.025, y: -1 }} whileTap={{ scale: 0.97 }} className="flex-1">
                <Link href="/courses" className="w-full px-2 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-base inline-flex justify-center items-center gap-1.5 sm:gap-2 whitespace-nowrap bg-[#C9A227] hover:bg-[#b08d20] text-[#0d1635] font-black rounded-xl shadow-lg shadow-[#C9A227]/25 transition-all">
                  Explore Programs <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.025, y: -1 }} whileTap={{ scale: 0.97 }} className="flex-1">
                <Link href="/book-consultation" className="w-full px-2 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-base inline-flex justify-center items-center gap-1.5 sm:gap-2 whitespace-nowrap bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-xl font-bold transition-all shadow-sm">
                  Book Consultation
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-4">
              <StatBlock end={5000} suffix="+" label="Students" />
              <StatBlock end={stats?.placed ? Math.max(stats.placed, 4000) : 4000} suffix="+" label="Placed" />
              <StatBlock end={stats?.projects ? Math.max(stats.projects, 3000) : 3000} suffix="+" label="Projects" />
              <StatBlock end={stats?.partners ? Math.max(stats.partners, 250) : 250} suffix="+" label="Partners" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="relative hidden h-[580px] w-full items-center justify-center overflow-visible lg:flex -mt-8 lg:-mt-12"
          >
            <div className="relative h-[580px] w-[580px] shrink-0">
              {/* Outer boundary solid ring */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                style={{ width: ORBIT_RADIUS * 2 + 60, height: ORBIT_RADIUS * 2 + 60 }}
              />

              {/* Gold dashed main orbital track (Perfect alignment) */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#C9A227]/30"
                style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
              />

              {/* Inner dashed ring */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
                style={{ width: HUB_SIZE + 60, height: HUB_SIZE + 60 }}
              />

              {/* Inner solid ring */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                style={{ width: HUB_SIZE + 20, height: HUB_SIZE + 20 }}
              />

              <OrbitRing />

              {/* Central hub (Glassmorphic) */}
              <div className="absolute left-1/2 top-1/2 z-[15] -translate-x-1/2 -translate-y-1/2">
                <div
                  className="flex flex-col items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  style={{ width: HUB_SIZE, height: HUB_SIZE }}
                >
                  <div className="mb-3 flex items-center justify-center">
                    <img src="/Boxxlogo.png" alt="BlueBoxx logo" className="h-20 w-20 object-contain drop-shadow-xl" />
                  </div>
                  <p className="text-base font-bold text-white font-sora">Career Ecosystem</p>
                  <p className="mt-1.5 max-w-[150px] text-[11px] leading-4 text-slate-300 font-semibold">
                    Structured learning paths for professionals.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
