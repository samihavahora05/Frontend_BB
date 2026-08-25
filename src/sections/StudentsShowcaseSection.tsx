import React, { useRef, useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Briefcase, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic API Fetching from MySQL Database table student_job_offers
  const { data: apiJobOffers, isLoading } = useSWR("/public/cms/job-offers", fetcher, {
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

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll effect: advances every 2.8s when user is not hovering/interacting
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 20) {
          // Reached end, loop back smoothly
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
          setActiveIndex(0);
        } else {
          // Scroll forward by one card step (~300px)
          scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isHovered, studentsList.length]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        const progress = scrollLeft / totalScrollable;
        const index = Math.round(progress * (studentsList.length - 1));
        setActiveIndex(index);
      }
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 290;
      scrollContainerRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

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
        <div className="text-center mb-14">
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

        {/* Carousel Container with Left/Right Navigation */}
        <div 
          className="relative group px-2 sm:px-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            aria-label="Previous Students"
            className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0d1635] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(13,22,53,0.3)] hover:bg-[#1B2A6B] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none border-2 border-white cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            aria-label="Next Students"
            className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0d1635] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(13,22,53,0.3)] hover:bg-[#1B2A6B] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none border-2 border-white cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>

          {/* Scrollable Cards Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-6 px-3 -mx-3 select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {studentsList.map((student, idx) => (
              <motion.div
                key={student.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: (idx % 4) * 0.05 }}
                className="w-[245px] sm:w-[265px] md:w-[280px] shrink-0 bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(27,42,107,0.18)] hover:-translate-y-2.5 transition-all duration-300 overflow-hidden flex flex-col group/card"
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
                <div className="p-5 text-center bg-white flex flex-col justify-between items-center grow gap-2.5">
                  <h3 className="font-black text-base md:text-lg text-slate-800 tracking-tight group-hover/card:text-[#1B2A6B] transition-colors line-clamp-1">
                    {student.name}
                  </h3>

                  {/* Clean Role Badge Pill */}
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border capitalize tracking-wide ${getRoleBadgeStyle(student.role)}`}>
                    {student.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Streamlined Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {Array.from({ length: Math.min(10, Math.ceil(studentsList.length / 4)) }).map((_, i) => {
            const isActive = Math.floor(activeIndex / 4) === i || (i === 9 && activeIndex >= 36);
            return (
              <button
                key={i}
                onClick={() => scrollToIndex(i * 4)}
                aria-label={`Go to slide group ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? "w-8 bg-[#1B2A6B]" : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
