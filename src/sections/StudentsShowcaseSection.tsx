import React, { useMemo, useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Building2, ChevronDown, ChevronUp, Layers, Palette, Code, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

type DomainCategory = "all" | "design" | "development" | "marketing";

const categories: { id: DomainCategory; label: string; icon: any }[] = [
  { id: "all", label: "All Alumni", icon: Layers },
  { id: "design", label: "Graphic & UI Design", icon: Palette },
  { id: "development", label: "Web & Software Dev", icon: Code },
  { id: "marketing", label: "Digital Marketing", icon: TrendingUp },
];

export const StudentsShowcaseSection = ({
  title,
  subtitle,
  tag = "Placement & Alumni Network",
  type = "all"
}: StudentsShowcaseSectionProps) => {
  const [activeTab, setActiveTab] = useState<DomainCategory>("all");
  const [showAll, setShowAll] = useState(false);
  const [localStudents, setLocalStudents] = useState<StudentItem[]>([]);

  useEffect(() => {
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
                  image: getImageUrl(item.image_url || item.avatar_url || item.image || "")
                }))
            );
          }
        }
      }
    } catch (e) {}
  }, []);

  const allStudents: StudentItem[] = useMemo(() => {
    const baseDefaultStudents: StudentItem[] = defaultStudents.map(st => ({
      ...st,
      image: getImageUrl(st.image)
    }));

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

  // Filter students based on active domain tab
  const filteredStudents = useMemo(() => {
    if (activeTab === "all") return allStudents;
    if (activeTab === "design") {
      return allStudents.filter(s => s.role.toLowerCase().includes("design"));
    }
    if (activeTab === "development") {
      return allStudents.filter(s => s.role.toLowerCase().includes("web") || s.role.toLowerCase().includes("dev"));
    }
    if (activeTab === "marketing") {
      return allStudents.filter(s => s.role.toLowerCase().includes("marketing"));
    }
    return allStudents;
  }, [allStudents, activeTab]);

  // Initial display limit
  const INITIAL_COUNT = 8;
  const displayedStudents = showAll ? filteredStudents : filteredStudents.slice(0, INITIAL_COUNT);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden border-t border-slate-200/80">
      {/* Background Soft Glows & Ambient Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0d1635 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[300px] bg-[#1B2A6B]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[250px] bg-[#C9A227]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {tag && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1B2A6B]/15 bg-[#1B2A6B]/5 text-[#1B2A6B] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <Sparkles size={14} className="text-[#C9A227] animate-pulse" />
              <span>{tag}</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0d1635] tracking-tight leading-tight mb-4 font-sora">
            {title ? (
              title
            ) : (
              <>
                Meet Our <span className="text-[#C9A227]">Graduates</span> & Alumni
              </>
            )}
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-medium font-inter leading-relaxed max-w-2xl mx-auto">
            {subtitle || "Celebrating our high-achieving students across design, software development, and digital marketing who built live projects and joined top industry teams."}
          </p>
        </div>

        {/* Domain Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            const count = cat.id === "all" 
              ? allStudents.length 
              : cat.id === "design" 
                ? allStudents.filter(s => s.role.toLowerCase().includes("design")).length 
                : cat.id === "development" 
                  ? allStudents.filter(s => s.role.toLowerCase().includes("web") || s.role.toLowerCase().includes("dev")).length 
                  : allStudents.filter(s => s.role.toLowerCase().includes("marketing")).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setShowAll(false);
                }}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20 scale-102"
                    : "bg-white text-slate-600 hover:text-[#1B2A6B] hover:bg-slate-50 border border-slate-200/80 shadow-xs"
                }`}
              >
                <Icon size={15} className={isActive ? "text-[#C9A227]" : "text-slate-400"} />
                <span>{cat.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modern Bento / Card Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {displayedStudents.map((student, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                key={`${student.id}-${student.name}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(27,42,107,0.12)] hover:border-[#1B2A6B]/30 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col p-3.5 group/card cursor-pointer"
              >
                {/* Framed Photo Container */}
                <div className="w-full aspect-[4/4.3] relative rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                  {/* Verified Placed Tag */}
                  <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-[#1B2A6B] shadow-xs border border-slate-200/60 flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-emerald-500" />
                    <span>Placed</span>
                  </div>

                  <img
                    src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`}
                    alt={student.name}
                    className="w-full h-full object-cover object-top group-hover/card:scale-106 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`;
                      if (target.src !== avatarFallback) {
                        target.src = avatarFallback;
                      }
                    }}
                  />
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635]/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Card Body */}
                <div className="pt-3.5 pb-1 px-1 flex flex-col items-center text-center gap-1.5 grow justify-between">
                  <div className="w-full flex flex-col items-center">
                    <h3 className="font-extrabold text-base text-[#0d1635] tracking-tight group-hover/card:text-[#1B2A6B] transition-colors truncate max-w-full">
                      {student.name}
                    </h3>

                    {/* Role Tag */}
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#1B2A6B]/6 text-[#1B2A6B] text-[11px] font-bold tracking-tight truncate max-w-full">
                      {student.role}
                    </span>
                  </div>

                  {/* Company Tag */}
                  <div className="w-full pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 mt-1">
                    <Building2 size={12} className="shrink-0 text-slate-400" />
                    <span className="truncate">{student.company || "Blueboxx Partner"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Expand / View More Button */}
        {filteredStudents.length > INITIAL_COUNT && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 border-[#1B2A6B] text-[#1B2A6B] hover:bg-[#1B2A6B] hover:text-white cursor-pointer shadow-sm active:scale-98"
            >
              <span>{showAll ? "Show Less" : `View All ${filteredStudents.length} Graduates`}</span>
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
