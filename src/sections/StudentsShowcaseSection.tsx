import React, { useRef, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Briefcase, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";

export interface StudentItem {
  id: number | string;
  name: string;
  role: string;
  image: string;
  company?: string;
  offered_on?: string;
}

interface StudentsShowcaseSectionProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  type?: "all" | "internship" | "job";
}

// Built-in list with real student photos
const DEFAULT_STUDENTS: StudentItem[] = [
  {
    id: 1,
    name: "Yuvraj Parmar",
    role: "Graphic design",
    image: "/students/yuvraj_parmar.png"
  },
  {
    id: 2,
    name: "Vikas",
    role: "Graphic design",
    image: "/students/vikas.png"
  },
  {
    id: 3,
    name: "Vaidehi",
    role: "Graphic design, digital marketing",
    image: "/students/vaidehi.png"
  },
  {
    id: 4,
    name: "Tushar",
    role: "Graphic design",
    image: "/students/tushar.png"
  },
  {
    id: 5,
    name: "Tisha Padhiyar",
    role: "web development",
    image: "/students/tisha_padhiyar.png"
  },
  {
    id: 6,
    name: "Tax Patel",
    role: "Digital Marketing",
    image: "/students/tax_patel.png"
  },
  {
    id: 7,
    name: "Swapnesh",
    role: "web development",
    image: "/students/swapnesh.png"
  },
  {
    id: 8,
    name: "Suhani Dhuri",
    role: "web development",
    image: "/students/suhani_dhuri.png"
  },
  {
    id: 9,
    name: "Shruti Jadhav",
    role: "Graphic design",
    image: "/students/shruti_jadhav.png"
  },
  {
    id: 10,
    name: "Shivam",
    role: "Graphic design",
    image: "/students/shivam.png"
  },
  {
    id: 11,
    name: "Samuel Gabi",
    role: "Graphic design, digital marketing",
    image: "/students/samuel_gabi.png"
  },
  {
    id: 12,
    name: "Rehan Bavla",
    role: "Graphic design",
    image: "/students/rehan_bavla.png"
  },
  {
    id: 13,
    name: "Priyal Chauhan",
    role: "web development",
    image: "/students/priyal_chauhan.png"
  },
  {
    id: 14,
    name: "Prem",
    role: "Graphic design, digital marketing",
    image: "/students/prem.png"
  },
  {
    id: 15,
    name: "Pratik Sirsath",
    role: "Graphic design, digital marketing",
    image: "/students/pratik_sirsath.png"
  },
  {
    id: 16,
    name: "Parul",
    role: "Graphic design",
    image: "/students/parul.png"
  },
  {
    id: 17,
    name: "Nishant Prajapati",
    role: "web development",
    image: "/students/nishant_prajapati.png"
  },
  {
    id: 18,
    name: "Nancy Shah",
    role: "web development",
    image: "/students/nancy_shah.png"
  },
  {
    id: 19,
    name: "Namrata Spakal",
    role: "Graphic design",
    image: "/students/namrata_spakal.png"
  },
  {
    id: 20,
    name: "Mitansh Solanki",
    role: "Graphic design, digital marketing",
    image: "/students/mitansh_solanki.png"
  },
  {
    id: 21,
    name: "Mayuri Thakre",
    role: "Graphic design",
    image: "/students/mayuri_thakre.png"
  },
  {
    id: 22,
    name: "Manthan Parmar",
    role: "Graphic design",
    image: "/students/manthan_parmar.png"
  },
  {
    id: 23,
    name: "Manoj Patil",
    role: "Graphic design",
    image: "/students/manoj_patil.png"
  },
  {
    id: 24,
    name: "Manav Kharva",
    role: "Digital Marketing",
    image: "/students/manav_kharva.png"
  },
  {
    id: 25,
    name: "Manasvi Yadav",
    role: "web development",
    image: "/students/manasvi_yadav.png"
  },
  {
    id: 26,
    name: "Mahir Dipoti",
    role: "web development",
    image: "/students/mahir_dipoti.png"
  },
  {
    id: 27,
    name: "Lata Bhambani",
    role: "Graphic design",
    image: "/students/lata_bhambani.png"
  }
];

export const StudentsShowcaseSection = ({
  title = "OUR STUDENTS",
  subtitle = "Celebrating our talented learners and placed alumni across top technology & design programs.",
  tag = "Placement & Internship Network",
  type = "all"
}: StudentsShowcaseSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic API Fetching from Backend Database
  const { data: apiJobOffers } = useSWR("/public/cms/job-offers", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { data: apiTestimonials } = useSWR("/public/cms/testimonials", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const studentsList: StudentItem[] = useMemo(() => {
    // If backend database returns student records from student_job_offers table
    if (apiJobOffers && Array.isArray(apiJobOffers) && apiJobOffers.length > 0) {
      return apiJobOffers.map((item: any, idx: number) => ({
        id: item.id || `student-${idx}`,
        name: item.student_name || item.name || "Student",
        role: item.role || item.designation || "Graduate",
        company: item.company_name || item.company || "",
        image: item.image_url || item.avatar_url || item.photo_url || DEFAULT_STUDENTS[idx % DEFAULT_STUDENTS.length]?.image || ""
      }));
    }

    return DEFAULT_STUDENTS;
  }, [apiJobOffers, apiTestimonials]);

  const [activeIndex, setActiveIndex] = useState(0);

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
      {/* Background Subtle Gradient & Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #0d1635 1px, transparent 1px), linear-gradient(to bottom, #0d1635 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#1B2A6B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          {tag && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] border border-[#1B2A6B]/15 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-[#C9A227]" />
              <span>{tag}</span>
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-black text-[#0d1635] tracking-tight uppercase font-sora">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-2xl mx-auto mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Container with Left/Right Navigation */}
        <div className="relative group px-2 sm:px-4">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            aria-label="Previous Students"
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#0d1635] text-white flex items-center justify-center shadow-xl hover:bg-[#1B2A6B] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none border-2 border-white cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Scrollable Track */}
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
