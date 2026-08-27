import React, { useMemo, useState, useEffect, useRef } from "react";
import { Sparkles, CheckCircle2, Building2 } from "lucide-react";
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
  tag = "Placement & Alumni Directory",
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
  const speed = 38;

  useAnimationFrame((_, delta) => {
    if (isHovered || !trackRef.current || duplicatedList.length === 0) return;

    xRef.current -= (speed * delta) / 1000;

    const halfWidth = trackRef.current.scrollWidth / 2;
    if (halfWidth > 0 && Math.abs(xRef.current) >= halfWidth) {
      xRef.current = 0;
    }

    trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  });

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden border-t border-slate-200/70">
      {/* Background Soft Glows & Ambient Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #0d1635 1px, transparent 1px), linear-gradient(to bottom, #0d1635 1px, transparent 1px)",
          backgroundSize: "36px 36px"
        }}
      />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[300px] bg-[#1B2A6B]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[250px] bg-[#C9A227]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Clean, Elevated Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          {tag && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#1B2A6B]/15 bg-[#1B2A6B]/5 text-[#1B2A6B] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <Sparkles size={13} className="text-[#C9A227] animate-pulse" />
              <span>{tag}</span>
            </div>
          )}

          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0d1635] tracking-tight leading-tight mb-3 font-sora">
            {title ? (
              title
            ) : (
              <>
                Meet Our <span className="text-[#C9A227]">Graduates</span> & Alumni
              </>
            )}
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-medium font-inter leading-relaxed max-w-xl mx-auto">
            {subtitle || "Empowering ambitious learners to master high-demand tech & design skills, build real projects, and secure top industry roles."}
          </p>
        </div>

        {/* Single Row Continuous Smooth Scrolling Marquee Track */}
        <div 
          className="relative w-full overflow-hidden py-3"
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
                  className="w-[245px] sm:w-[260px] md:w-[275px] shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(27,42,107,0.12)] hover:border-[#1B2A6B]/30 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col p-3 group/card cursor-pointer select-none"
                >
                  {/* Framed Portrait Photo Container */}
                  <div className="w-full aspect-[4/4.4] relative rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                    {/* Placed Verification Tag */}
                    <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-[#1B2A6B] shadow-xs border border-slate-200/60 flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-emerald-500" />
                      <span>Placed</span>
                    </div>

                    <img
                      src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`}
                      alt={student.name}
                      className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`;
                        if (target.src !== avatarFallback) {
                          target.src = avatarFallback;
                        }
                      }}
                    />
                    {/* Subtle vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Student Info Card Body */}
                  <div className="pt-3 pb-1 px-1 flex flex-col items-center text-center gap-1.5">
                    <h3 className="font-extrabold text-[15px] text-[#0d1635] tracking-tight group-hover/card:text-[#1B2A6B] transition-colors truncate max-w-full">
                      {student.name}
                    </h3>

                    {/* Standardized Role Tag */}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B2A6B]/6 text-[#1B2A6B] text-[11px] font-bold tracking-tight truncate max-w-full">
                      {student.role}
                    </span>

                    {/* Company Tag */}
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-0.5 truncate max-w-full">
                      <Building2 size={11} className="shrink-0 text-slate-400" />
                      <span className="truncate">{student.company || "Blueboxx Partner"}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Skeleton cards during initial SSR mount to prevent layout shift & hydration mismatch
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="w-[245px] sm:w-[260px] md:w-[275px] shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col p-3 animate-pulse"
                >
                  <div className="w-full aspect-[4/4.4] rounded-xl bg-slate-100" />
                  <div className="pt-3 flex flex-col items-center gap-2">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                    <div className="w-16 h-3 bg-slate-100 rounded-full" />
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
