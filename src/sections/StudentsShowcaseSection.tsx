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

  return (
    <section className="py-20 bg-white relative overflow-hidden border-t border-slate-200/80">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #0d1635 1px, transparent 1px), linear-gradient(to bottom, #0d1635 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#1B2A6B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-12">
          {tag && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] border border-[#1B2A6B]/15 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-[#C9A227]" />
              <span>{tag}</span>
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-black text-[#0d1635] tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-semibold max-w-2xl mx-auto mt-3">
            {subtitle}
          </p>
        </div>

        <div 
          className="relative group px-2 sm:px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <button
            onClick={scrollLeft}
            aria-label="Previous Students"
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0d1635] text-white flex items-center justify-center shadow-xl hover:bg-[#1B2A6B] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none border-2 border-white cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={scrollRight}
            aria-label="Next Students"
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0d1635] text-white flex items-center justify-center shadow-xl hover:bg-[#1B2A6B] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none border-2 border-white cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-4 px-2 -mx-2 select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {studentsList.map((student, idx) => (
              <motion.div
                key={student.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: (idx % 4) * 0.05 }}
                className="w-[240px] sm:w-[260px] md:w-[275px] shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group/card"
              >
                {/* Student Photo Container */}
                <div className="w-full aspect-[4/4.2] relative overflow-hidden bg-slate-100">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=400&bold=true`;
                    }}
                  />
                </div>

                {/* Student Info Card Body */}
                <div className="p-4 text-center bg-white flex flex-col justify-center min-h-[75px]">
                  <h3 className="font-bold text-base md:text-lg text-slate-800 tracking-tight group-hover/card:text-[#1B2A6B] transition-colors line-clamp-1">
                    {student.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1 line-clamp-2 leading-snug">
                    {student.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            aria-label="Next Students"
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0d1635] text-white flex items-center justify-center shadow-xl hover:bg-[#1B2A6B] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none border-2 border-white cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Carousel Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {studentsList.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to student slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? "w-6 bg-[#1B2A6B]" : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
