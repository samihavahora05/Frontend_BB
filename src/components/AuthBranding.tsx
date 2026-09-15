import { getImageUrl } from "../lib/imageUtils";
import { motion, useAnimationFrame } from "framer-motion";
import { partnerCompanies, Company } from "../data/companies";
import { CompanyService, CMSCompany } from "../lib/api/CompanyService";
import { useState, useEffect, useRef, useMemo } from "react";

function AuthCompanyLogo({ company }: { company: any }) {
  const [imgError, setImgError] = useState(false);
  const logo = company.logoUrl || company.logo_url || company.logo;

  return (
    <div className="flex items-center justify-center h-12 px-4 shrink-0 select-none">
      {logo && !imgError ? (
        <img
          src={getImageUrl(logo)}
          alt={company.name}
          className="h-10 max-w-[140px] w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] filter brightness-110"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-lg md:text-xl font-black tracking-tight font-sora text-white/90 whitespace-nowrap">
          {company.name?.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function AuthMarquee({ companies, speed = 35 }: { companies: any[]; speed?: number }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const isPaused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (isPaused.current || !innerRef.current) return;
    xRef.current -= (speed * delta) / 1000;
    const halfWidth = innerRef.current.scrollWidth / 2;
    if (halfWidth > 0 && xRef.current <= -halfWidth) {
      xRef.current = 0;
    }
    innerRef.current.style.transform = `translateX(${xRef.current}px)`;
  });

  return (
    <div
      className="relative overflow-hidden w-full group py-1"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
    >
      <div ref={innerRef} className="flex will-change-transform gap-12 w-max items-center">
        {companies.map((company, i) => (
          <AuthCompanyLogo key={`a-${company.id || company.name}-${i}`} company={company} />
        ))}
        {companies.map((company, i) => (
          <AuthCompanyLogo key={`b-${company.id || company.name}-${i}`} company={company} />
        ))}
      </div>
    </div>
  );
}

export function AuthBranding() {
  const [companies, setCompanies] = useState<CMSCompany[]>([]);

  useEffect(() => {
    // 1. Initialize immediately with local companies or default partnerCompanies
    const local = CompanyService.getLocalCompanies();
    if (local && local.length >= partnerCompanies.length) {
      setCompanies(local);
    } else {
      setCompanies(partnerCompanies as any);
    }

    // 2. Fetch fresh dataset
    CompanyService.getAll()
      .then((res) => {
        if (res && res.length > 0) {
          setCompanies(res);
        }
      })
      .catch(() => {});

    const unsubscribe = CompanyService.subscribe((updated) => {
      if (updated && updated.length > 0) {
        setCompanies(updated);
      }
    });
    return () => unsubscribe();
  }, []);

  const displayCompanies = useMemo(() => {
    const baseList = companies && companies.length >= partnerCompanies.length ? companies : partnerCompanies;
    return baseList.filter((c: any) => !c.status || c.status === "published" || c.status === "active");
  }, [companies]);

  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#0d1635]">
      {/* Deep Blue Theme Background */}
      <div className="absolute inset-0 bg-[#0d1635] z-0" />

      {/* EdTech Background Image Overlay */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat mix-blend-overlay grayscale"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80")' }}
      />

      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1B2A6B] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -30, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A227] rounded-full blur-[140px] translate-y-1/3 -translate-x-1/3 z-0"
      />

      {/* Animated Grid Lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 p-12 flex flex-col justify-center h-full w-full max-w-2xl mx-auto pb-32">

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 w-fit"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Join the learning revolution</span>
        </motion.div>

        {/* Headline with Shinesweep */}
        <div className="relative overflow-hidden w-fit group">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl font-black text-white mb-4 leading-[1.1] tracking-tight relative z-10"
          >
            Fast-track your <br />
            <span className="text-[#C9A227]">career journey.</span>
          </motion.h1>
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shinesweep_1.5s_ease-in-out_forwards] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none transform -skew-x-12" />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-slate-300 font-medium mb-12 max-w-lg leading-relaxed"
        >
          Master in-demand skills, build real-world projects, and get hired by top companies through our intensive programs.
        </motion.p>

        {/* Timeline Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-2 md:gap-4 mb-20"
        >
          {[
            { id: 1, label: "LEARN", active: true },
            { id: 2, label: "PROJECTS", active: false },
            { id: 3, label: "INTERNSHIP", active: false },
            { id: 4, label: "PLACEMENT", active: false }
          ].map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + (index * 0.2) }}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className={`
                px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg transition-all duration-300
                ${step.active
                  ? "bg-[#0d1635] border-[#C9A227] text-[#C9A227] ring-2 ring-[#C9A227]/20 scale-105"
                  : "bg-white/5 border-white/10 text-white/60 backdrop-blur-sm hover:border-white/30"
                }
              `}>
                {step.label}
              </div>
              {index < 3 && (
                <div className="relative h-[1px] w-full bg-white/10 mx-2 overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A227]/50 to-transparent"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Trusted By */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Trusted by top companies
          </h4>
          <AuthMarquee companies={displayCompanies} speed={35} />
        </motion.div>

      </div>
    </div>
  );
}
