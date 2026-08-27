import React, { useMemo, useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
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
  tag = "Placement & Alumni Network",
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

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden border-t border-slate-200/70">
      {/* Background Soft Glows & Tech Grid */}
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
        {/* Clean Centered Section Header */}
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
                Our <span className="text-[#C9A227]">Students</span>
              </>
            )}
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-medium font-inter leading-relaxed max-w-xl mx-auto">
            {subtitle || "Celebrating our talented learners and placed alumni across top technology & design programs."}
          </p>
        </div>

        {/* Single Row Continuous Smooth Scrolling Marquee Track */}
        <div 
          className="relative w-full overflow-hidden py-2"
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
                  <div className="p-4 text-center bg-white flex flex-col justify-center items-center grow gap-1">
                    <h3 className="font-bold text-base text-slate-800 tracking-tight group-hover/card:text-[#1B2A6B] transition-colors line-clamp-1">
                      {student.name}
                    </h3>

                    {/* Standardized Role Text */}
                    <p className="text-xs font-medium text-slate-500 line-clamp-1">
                      {student.role}
                    </p>
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
