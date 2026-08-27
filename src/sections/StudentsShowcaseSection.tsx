import React, { useMemo, useState, useEffect, useRef } from "react";
import { Sparkles, ChevronLeft, ChevronRight, GraduationCap, Briefcase, Star, Award } from "lucide-react";
import { useAnimationFrame } from "framer-motion";
import { defaultStudents, StudentShowcaseItem } from "../data/studentsData";
import { getImageUrl } from "../lib/imageUtils";

export interface StudentItem {
  id: number | string;
  name: string;
  role: string;
  company?: string;
  image: string;
}

interface StudentsShowcaseSectionProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  type?: "all" | "interns" | "job_seekers" | "recent";
}

export const StudentsShowcaseSection = ({
  title,
  subtitle,
  tag = "Proven Career Success & Alumni",
  type = "all"
}: StudentsShowcaseSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [localStudents, setLocalStudents] = useState<StudentItem[]>([]);

  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);

    const loadLocal = () => {
      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('blueboxx_students_showcase');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLocalStudents(
                parsed
                  .filter((item: any) => item && (item.student_name || item.name))
                  .map((item: any, idx: number) => ({
                    id: item.id || `student-${idx}`,
                    name: item.student_name || item.name || "Student",
                    role: item.role || item.designation || "Graphic Design",
                    company: item.company_name || item.company || "",
                    image: getImageUrl(item.image_url || item.avatar_url || item.image || '')
                  }))
              );
            }
          }
        }
      } catch (e) {}
    };

    loadLocal();
    window.addEventListener('showcase-updated', loadLocal);
    window.addEventListener('storage', loadLocal);
    return () => {
      window.removeEventListener('showcase-updated', loadLocal);
      window.removeEventListener('storage', loadLocal);
    };
  }, []);

  const studentsList: StudentItem[] = useMemo(() => {
    // Verified 44 students with correct photos and designated roles
    const baseDefaultStudents: StudentItem[] = defaultStudents.map(st => ({
      ...st,
      image: getImageUrl(st.image)
    }));

    // If custom students are configured locally via admin showcase tool
    if (localStudents && localStudents.length >= 40) {
      return localStudents;
    }

    if (localStudents && localStudents.length > 0) {
      const customNames = new Set(localStudents.map(s => s.name.toLowerCase().trim()));
      const remainingDefaults = baseDefaultStudents.filter(s => !customNames.has(s.name.toLowerCase().trim()));
      return [...localStudents, ...remainingDefaults];
    }

    return baseDefaultStudents;
  }, [localStudents]);

  // Duplicate list for seamless infinite loop
  const duplicatedList = useMemo(() => {
    if (!studentsList || studentsList.length === 0) return [];
    return [...studentsList, ...studentsList];
  }, [studentsList]);

  // Smooth continuous scroll velocity (px per second)
  const speed = 40;

  useAnimationFrame((_, delta) => {
    if (isHovered || !trackRef.current || duplicatedList.length === 0) return;

    xRef.current -= (speed * delta) / 1000;

    const halfWidth = trackRef.current.scrollWidth / 2;
    if (halfWidth > 0 && Math.abs(xRef.current) >= halfWidth) {
      xRef.current = 0;
    }

    trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  });

  const handleManualScroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const scrollStep = 280;
    const dir = direction === "left" ? 1 : -1;
    xRef.current += dir * scrollStep;

    const halfWidth = trackRef.current.scrollWidth / 2;
    if (halfWidth > 0) {
      if (xRef.current > 0) {
        xRef.current = -halfWidth + (xRef.current % halfWidth);
      } else if (Math.abs(xRef.current) >= halfWidth) {
        xRef.current = -(Math.abs(xRef.current) % halfWidth);
      }
    }
    trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  };

  const displayTitle = title || (
    <>
      Meet The <span className="text-[#1B2A6B]">Future Leaders</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600">Achievers</span>
    </>
  );

  const displaySubtitle = subtitle || "From mastering practical skills to building live industry-grade projects — explore our talented learners and placed alumni stepping into high-growth career roles.";

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden border-t border-slate-200/70">
      {/* Background Soft Ambient Elements */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0d1635 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#1B2A6B]/5 via-amber-500/5 to-[#1B2A6B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Centered Premium Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          {tag && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] border border-[#1B2A6B]/15 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles size={14} className="text-[#C9A227] animate-pulse" />
              <span>{tag}</span>
            </div>
          )}
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight leading-[1.15] mb-4">
            {displayTitle}
          </h2>
          
          <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto mb-6">
            {displaySubtitle}
          </p>

          {/* Quick Credibility Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
              <GraduationCap size={13} className="text-[#1B2A6B]" />
              <span>5,000+ Trained</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
              <Briefcase size={13} className="text-amber-600" />
              <span>250+ Hiring Partners</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
              <Star size={13} className="fill-[#C9A227] text-[#C9A227]" />
              <span>4.9/5 Student Rating</span>
            </div>
          </div>

          {/* Centered Intuitive Navigation Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleManualScroll("left")}
              className="p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-[#1B2A6B] hover:text-white hover:border-[#1B2A6B] transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Prev</span>
            </button>
            
            <div className="px-3.5 py-1.5 bg-slate-100/80 text-slate-500 rounded-xl text-xs font-semibold border border-slate-200/60">
              Hover to Pause • Drag or Click to Navigate
            </div>

            <button
              onClick={() => handleManualScroll("right")}
              className="p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-[#1B2A6B] hover:text-white hover:border-[#1B2A6B] transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              aria-label="Scroll right"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Single Row Continuous Smooth Scrolling Marquee Track */}
        <div 
          className="relative w-full overflow-hidden py-4 rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Single Row Glide Track */}
          <div 
            ref={trackRef}
            className="flex gap-6 px-2 w-max will-change-transform"
          >
            {isMounted && duplicatedList.length > 0 ? (
              duplicatedList.map((student, idx) => (
                <div
                  key={`${student.id}-${idx}`}
                  className="w-[230px] sm:w-[245px] md:w-[260px] shrink-0 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(27,42,107,0.16)] hover:-translate-y-2.5 transition-all duration-300 overflow-hidden flex flex-col group/card cursor-pointer select-none"
                >
                  {/* Student Photo Container */}
                  <div className="w-full aspect-[4/4.3] relative overflow-hidden bg-slate-100">
                    <img
                      src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`}
                      alt={student.name}
                      className="w-full h-full object-cover object-top group-hover/card:scale-108 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`;
                        if (target.src !== avatarFallback) {
                          target.src = avatarFallback;
                        }
                      }}
                    />
                    {/* Subtle top corner gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Student Info Card Body */}
                  <div className="p-4 text-center bg-white flex flex-col justify-center items-center grow gap-1.5">
                    <h3 className="font-bold text-base text-slate-800 tracking-tight group-hover/card:text-[#1B2A6B] transition-colors line-clamp-1">
                      {student.name}
                    </h3>

                    {/* Standardized Role Text */}
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-[#1B2A6B] font-bold text-[11px] border border-slate-200/70 line-clamp-1">
                      {student.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Skeleton cards during initial SSR mount to prevent layout shift & hydration mismatch
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="w-[230px] sm:w-[245px] md:w-[260px] shrink-0 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col animate-pulse"
                >
                  <div className="w-full aspect-[4/4.3] bg-slate-100" />
                  <div className="p-4 flex flex-col items-center gap-2">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                    <div className="w-16 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
