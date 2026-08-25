import React, { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

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

  // Dynamic API Fetching from MySQL Database table student_job_offers
  const { data: apiJobOffers } = useSWR("/public/cms/job-offers", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const studentsList: StudentItem[] = useMemo(() => {
    if (apiJobOffers && Array.isArray(apiJobOffers)) {
      return apiJobOffers.map((item: any, idx: number) => ({
        id: item.id || `student-${idx}`,
        name: item.student_name || item.name || "Student",
        role: item.role || item.designation || "Graduate",
        company: item.company_name || item.company || "",
        image: item.image_url || item.avatar_url || item.photo_url || ""
      }));
    }
    return [];
  }, [apiJobOffers]);

  // Duplicate list for seamless infinite loop
  const duplicatedList = useMemo(() => {
    if (!studentsList || studentsList.length === 0) return [];
    return [...studentsList, ...studentsList];
  }, [studentsList]);

  const getRoleBadgeStyle = (role: string) => {
    const lower = role.toLowerCase();
    if (lower.includes("web") || lower.includes("dev") || lower.includes("react") || lower.includes("python")) {
      return "bg-blue-50/90 text-[#1B2A6B] border-blue-200/70";
    }
    if (lower.includes("market") || lower.includes("digital")) {
      return "bg-emerald-50/90 text-emerald-800 border-emerald-200/70";
    }
    return "bg-amber-50/90 text-amber-800 border-amber-200/70";
  };

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
        {/* Section Heading with Brand Typography */}
        <div className="text-center mb-12">
          {tag && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] border border-[#1B2A6B]/15 text-xs font-black uppercase tracking-wider mb-3.5 shadow-sm">
              <Sparkles size={14} className="text-[#C9A227] animate-pulse" />
              <span>{tag}</span>
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-black text-[#0d1635] tracking-tight uppercase">
            {title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-3 rounded-full" />
          <p className="text-slate-500 text-sm md:text-base font-semibold max-w-2xl mx-auto mt-3">
            {subtitle}
          </p>
        </div>

        {/* Contained Continuous Scrolling Marquee Track */}
        <div 
          className="relative w-full overflow-hidden py-4 rounded-3xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Left & Right Edge Soft Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          <div className={`continuous-glide-track gap-6 px-2 ${isHovered ? "continuous-glide-paused" : ""}`}>
            {duplicatedList.map((student, idx) => (
              <div
                key={`${student.id}-${idx}`}
                className="w-[235px] sm:w-[250px] md:w-[265px] shrink-0 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(27,42,107,0.18)] hover:-translate-y-2.5 transition-all duration-300 overflow-hidden flex flex-col group/card cursor-pointer"
              >
                {/* Student Photo Container */}
                <div className="w-full aspect-[4/4.3] relative overflow-hidden bg-slate-100">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover object-top group-hover/card:scale-108 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`;
                    }}
                  />
                  {/* Subtle top corner gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Student Info Card Body */}
                <div className="p-4 text-center bg-white flex flex-col justify-between items-center grow gap-2">
                  <h3 className="font-black text-sm md:text-base text-slate-800 tracking-tight group-hover/card:text-[#1B2A6B] transition-colors line-clamp-1">
                    {student.name}
                  </h3>

                  {/* Clean Role Badge Pill */}
                  <span className={`inline-block px-3 py-1 rounded-full text-[10.5px] font-bold border capitalize tracking-wide ${getRoleBadgeStyle(student.role)}`}>
                    {student.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
