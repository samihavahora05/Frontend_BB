import React, { useMemo, useState, useEffect, useRef } from "react";
import { 
  Sparkles, CheckCircle2, Building2,
  ArrowUpRight, X, Zap
} from "lucide-react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
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

// Reusable Ultra-Modern Alumni Card
const AlumniCard = ({
  student,
  onSelect
}: {
  student: StudentItem;
  onSelect: (student: StudentItem) => void;
}) => {
  return (
    <div
      onClick={() => onSelect(student)}
      className="group relative w-[240px] sm:w-[260px] md:w-[280px] shrink-0 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-2.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(27,42,107,0.15)] hover:border-[#1B2A6B]/40 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden select-none"
    >
      {/* Top Ambient Highlight Gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#1B2A6B]/40 to-[#C9A227]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Photo Container */}
      <div className="relative w-full aspect-[3.8/4.2] rounded-xl overflow-hidden bg-slate-100 shadow-inner">
        <img
          src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`}
          alt={student.name}
          className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`;
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
        />

        {/* Gradient Scrim for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635]/85 via-[#0d1635]/25 to-transparent pointer-events-none" />

        {/* Floating Quick Action Icon on Hover */}
        <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-[#1B2A6B] text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-md translate-y-1 group-hover:translate-y-0">
          <ArrowUpRight size={14} />
        </div>

        {/* Overlay Student Name & Role directly on image */}
        <div className="absolute bottom-3 inset-x-3.5 z-10 text-white">
          <h3 className="font-extrabold text-base tracking-tight leading-snug drop-shadow-sm truncate">
            {student.name}
          </h3>
          <p className="text-xs font-semibold text-amber-300/90 truncate mt-0.5">
            {student.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export const StudentsShowcaseSection = ({
  title,
  subtitle,
  tag = "Alumni Success Ecosystem",
  type = "all"
}: StudentsShowcaseSectionProps) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [localStudents, setLocalStudents] = useState<StudentItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  const loadShowcaseData = () => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("blueboxx_students_showcase");
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
                  image: item.image_url || item.avatar_url || item.image || ""
                }))
            );
            return;
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    setIsMounted(true);
    loadShowcaseData();

    // Listen to real-time custom events and storage changes
    if (typeof window !== "undefined") {
      window.addEventListener("showcase-updated", loadShowcaseData);
      window.addEventListener("storage", loadShowcaseData);
      return () => {
        window.removeEventListener("showcase-updated", loadShowcaseData);
        window.removeEventListener("storage", loadShowcaseData);
      };
    }
  }, []);

  const allStudents: StudentItem[] = useMemo(() => {
    const baseDefaultStudents: StudentItem[] = defaultStudents.map(st => ({
      ...st,
      image: getImageUrl(st.image)
    }));

    if (!isMounted) {
      return baseDefaultStudents;
    }

    if (localStudents && localStudents.length > 0) {
      if (localStudents.length >= baseDefaultStudents.length) {
        return localStudents;
      }
      const localNames = new Set(localStudents.map(s => s.name.toLowerCase().trim()));
      const remaining = baseDefaultStudents.filter(s => !localNames.has(s.name.toLowerCase().trim()));
      return [...localStudents, ...remaining];
    }

    return baseDefaultStudents;
  }, [localStudents, isMounted]);

  // Duplicate for seamless infinite loop
  const displayList = useMemo(() => {
    if (!allStudents || allStudents.length === 0) return [];
    return [...allStudents, ...allStudents];
  }, [allStudents]);

  const speed = 85;

  useAnimationFrame((_, delta) => {
    if (!isMounted || isPaused || !trackRef.current || displayList.length === 0) return;

    xRef.current -= (speed * delta) / 1000;

    const halfWidth = trackRef.current.scrollWidth / 2;
    if (halfWidth > 0 && Math.abs(xRef.current) >= halfWidth) {
      xRef.current = 0;
    }

    trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  });

  return (
    <section className="pt-20 pb-8 bg-gradient-to-b from-white via-slate-50/70 to-white relative overflow-hidden border-t border-slate-200/80">
      {/* Background Ambience & Fine Radial Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0d1635 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[350px] bg-gradient-to-r from-[#1B2A6B]/6 via-[#C9A227]/6 to-[#1B2A6B]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          {tag && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1B2A6B]/15 bg-[#1B2A6B]/5 text-[#1B2A6B] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs">
              <Sparkles size={14} className="text-[#C9A227] animate-pulse" />
              <span>{tag}</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight leading-[1.15] mb-4 font-sora">
            {title ? (
              title
            ) : (
              <>
                Where Ambition Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B2A6B] via-[#2E45A3] to-[#C9A227]">Real Success</span>
              </>
            )}
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-medium font-inter leading-relaxed max-w-2xl mx-auto mb-6">
            {subtitle || "Celebrating 5,000+ passionate learners who built production projects, mastered top industry tools, and stepped into rewarding roles across leading organizations."}
          </p>

          {/* Quick Highlight Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
              <Zap size={13} className="text-amber-500 fill-amber-500" />
              <span>44+ Placed Learners</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
              <Building2 size={13} className="text-[#1B2A6B]" />
              <span>250+ Hiring Partners</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>100% Practical Exposure</span>
            </div>
          </div>
        </div>

        {/* Single-Row Continuous Floating Marquee Stream */}
        <div 
          className="relative w-full overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex gap-6 px-2 w-max will-change-transform"
          >
            {displayList.map((student, idx) => (
              <AlumniCard
                key={`${student.id}-${idx}`}
                student={student}
                onSelect={setSelectedStudent}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Student Career Spotlight Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-[#0d1635]/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 p-6 md:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Large Avatar */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-4 ring-[#1B2A6B]/10 mb-4 bg-slate-100">
                  <img
                    src={getImageUrl(selectedStudent.image)}
                    alt={selectedStudent.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black">
                    PLACED
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-2xl font-black text-[#0d1635] tracking-tight mb-1">
                  {selectedStudent.name}
                </h3>
                <span className="px-3 py-1 rounded-full bg-[#1B2A6B]/8 text-[#1B2A6B] text-xs font-bold mb-4">
                  {selectedStudent.role}
                </span>

                {/* Details Block */}
                <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 flex flex-col gap-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Domain / Role:</span>
                    <span className="text-xs font-extrabold text-[#0d1635]">
                      {selectedStudent.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Program Track:</span>
                    <span className="text-xs font-bold text-slate-700">Live Client Training</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Placement Status:</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Successfully Placed
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1B2A6B] to-[#2E45A3] text-white shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
