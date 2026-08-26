import React, { useMemo, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
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
  title = "OUR STUDENTS",
  subtitle = "Celebrating our talented learners and placed alumni across top technology & design programs.",
  tag = "Placement & Internship Network",
  type = "all"
}: StudentsShowcaseSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [localStudents, setLocalStudents] = useState<StudentItem[]>([]);

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
                parsed.map((item: any, idx: number) => ({
                  id: item.id || `student-${idx}`,
                  name: item.student_name || item.name || "Student",
                  role: item.role || item.designation || "Graduate",
                  company: item.company_name || item.company || "",
                  image: getImageUrl(item.image_url || item.avatar_url || item.image || defaultStudents[idx % defaultStudents.length]?.image)
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

  // Dynamic API Fetching from Database
  const { data: apiJobOffers } = useSWR("/public/cms/job-offers", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const studentsList: StudentItem[] = useMemo(() => {
    // Baseline complete 44 students
    const baseDefaultStudents: StudentItem[] = defaultStudents.map(st => ({
      ...st,
      image: getImageUrl(st.image)
    }));

    // Determine custom/API students list
    const customList = (localStudents && localStudents.length > 0 ? localStudents : (
      apiJobOffers && Array.isArray(apiJobOffers) && apiJobOffers.length > 0
        ? apiJobOffers
            .filter((item: any) => item && (item.student_name || item.name))
            .map((item: any, idx: number) => {
              const rawImg = item.image_url || item.avatar_url || item.photo_url || item.image || "";
              const defaultPhoto = defaultStudents[idx % defaultStudents.length]?.image || '/students/yuvraj_parmar.png';
              const resolvedImg = rawImg ? getImageUrl(rawImg) : getImageUrl(defaultPhoto);
              return {
                id: item.id || `student-${idx}`,
                name: item.student_name || item.name || "Student",
                role: item.role || item.designation || "Graduate",
                company: item.company_name || item.company || "",
                image: resolvedImg || getImageUrl(defaultPhoto)
              };
            })
        : []
    ));

    if (customList.length === 0) {
      return baseDefaultStudents;
    }

    // If customList already has 40+ students (full uploaded list), return it directly
    if (customList.length >= 40) {
      return customList;
    }

    // If there are a few custom/DB records (e.g. 3 new students), prepend them to all 44 students without duplicates!
    const customNames = new Set(customList.map(s => s.name.toLowerCase().trim()));
    const remainingDefaults = baseDefaultStudents.filter(s => !customNames.has(s.name.toLowerCase().trim()));
    
    return [...customList, ...remainingDefaults];
  }, [localStudents, apiJobOffers]);

  // Duplicate list for seamless infinite loop
  const duplicatedList = useMemo(() => {
    if (!studentsList || studentsList.length === 0) return [];
    return [...studentsList, ...studentsList];
  }, [studentsList]);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden border-t border-slate-200/70">
      {/* Dynamic Keyframes for Ultra-Smooth Continuous Hardware-Accelerated Marquee */}
      <style jsx global>{`
        @keyframes continuousGlide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .continuous-glide-track {
          display: flex;
          width: max-content;
          animation: continuousGlide 75s linear infinite;
        }
        .continuous-glide-track:hover,
        .continuous-glide-paused {
          animation-play-state: paused !important;
        }
      `}</style>

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
        {/* Section Heading matching reference typography */}
        <div className="text-center mb-12">
          {tag && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] border border-[#1B2A6B]/15 text-xs font-black uppercase tracking-wider mb-3.5 shadow-sm">
              <Sparkles size={14} className="text-[#C9A227] animate-pulse" />
              <span>{tag}</span>
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-black text-[#0d1635] tracking-tight">
            Our <span className="text-[#C9A227]">Students</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-semibold max-w-2xl mx-auto mt-3">
            {subtitle}
          </p>
        </div>

        {/* Single Row Continuous Smooth Scrolling Marquee Track */}
        <div 
          className="relative w-full overflow-hidden py-4 rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Single Row Glide Track */}
          <div className={`continuous-glide-track gap-6 px-2 ${isHovered ? "continuous-glide-paused" : ""}`}>
            {isMounted && duplicatedList.length > 0 ? (
              duplicatedList.map((student, idx) => (
                <div
                  key={`${student.id}-${idx}`}
                  className="w-[230px] sm:w-[245px] md:w-[260px] shrink-0 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(27,42,107,0.18)] hover:-translate-y-2.5 transition-all duration-300 overflow-hidden flex flex-col group/card cursor-pointer"
                >
                  {/* Student Photo Container */}
                  <div className="w-full aspect-[4/4.3] relative overflow-hidden bg-slate-100">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-full h-full object-cover object-top group-hover/card:scale-108 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = defaultStudents[idx % defaultStudents.length]?.image || '/students/yuvraj_parmar.png';
                        if (!target.src.includes(fallback) && !target.src.endsWith(fallback)) {
                          target.src = fallback;
                        } else {
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`;
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

                    {/* Simple Clean Role Text */}
                    <p className="text-xs font-medium text-slate-500 capitalize line-clamp-1">
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
