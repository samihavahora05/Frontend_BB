import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { localTestimonials } from "../data/testimonials";
import { motion } from "framer-motion";

export interface TestimonialSectionProps {
  titlePrefix?: string;
  titleHighlight?: string;
  subtitle?: string;
  type?: "default" | "internship" | "job";
}

interface TestimonialType {
  id: number;
  name: string;
  designation?: string | null;
  role?: string | null;
  company?: string | null;
  rating?: number;
  review?: string | null;
  content?: string | null;
  image_url?: string | null;
  photo_url?: string | null;
  avatar?: string | null;
  type?: string;
}

export const TestimonialSection = ({
  titlePrefix = "Our ",
  titleHighlight = "Learners",
  subtitle = "Real success feedback from learners who cracked top positions through Blueboxx DA.",
  type = "default"
}: TestimonialSectionProps) => {

  // Dynamic API Fetching from Backend Database
  const { data: apiTestimonials } = useSWR("/public/cms/testimonials", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const testimonialsList: TestimonialType[] = useMemo(() => {
    // If backend database API returns testimonials array, use dynamic database data
    if (apiTestimonials && Array.isArray(apiTestimonials) && apiTestimonials.length > 0) {
      if (type === "default") return apiTestimonials;
      return apiTestimonials.filter((t: any) => (t.type || "job").toLowerCase() === type.toLowerCase());
    }
    // Fallback to local testimonials array if API loading or empty
    if (type === "default") return localTestimonials as any;
    return localTestimonials.filter(t => t.type === type) as any;
  }, [apiTestimonials, type]);

  return (
    <div className="bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 py-20 relative overflow-hidden border-t border-slate-200/80">
      {/* Decorative Dots Pattern & Background Glow Orbs */}
      <div 
        className="absolute inset-0 opacity-[0.35] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1B2A6B]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
            <Star size={14} className="fill-[#C9A227] text-[#C9A227]" /> 
            <span>4.9 / 5 Average Alumni Rating</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {titlePrefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B2A6B] via-indigo-600 to-[#C9A227]">
              {titleHighlight}
            </span>
          </h2>
          <p className="text-sm md:text-base font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        {/* Dynamic Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialsList.map((t, idx) => {
            const reviewerName = t.name || "Alumni Learner";
            const reviewText = t.review || t.content || "Outstanding experience learning and getting placed with Blueboxx DA.";
            const reviewerRole = t.designation || t.role || "Placed Graduate";
            const reviewerCompany = t.company || "Partner Company";
            const starRating = t.rating || 5;
            const avatarUrl = t.image_url || t.photo_url || t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=1B2A6B&color=fff&bold=true`;

            return (
              <motion.div 
                key={t.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (idx % 3) * 0.06 }}
                className="group bg-white border border-slate-200/90 hover:border-[#1B2A6B]/40 hover:shadow-[0_20px_45px_rgba(27,42,107,0.12)] hover:-translate-y-2 transition-all duration-300 rounded-[24px] p-6 flex flex-col justify-between relative cursor-pointer overflow-hidden"
              >
                {/* Top Subtle Hover Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-600 to-[#1B2A6B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating & Decorative Quote */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex gap-1">
                    {Array.from({ length: starRating }).map((_, star) => (
                      <Star key={star} size={14} className="fill-[#C9A227] text-[#C9A227]" />
                    ))}
                  </div>
                  <Quote size={24} className="text-slate-200 group-hover:text-amber-400/40 transition-colors" />
                </div>

                {/* Testimonial Quote */}
                <p className="text-slate-700 text-xs md:text-sm font-semibold leading-relaxed mb-6 italic relative z-10">
                  "{reviewText}"
                </p>
                
                {/* Reviewer Profile */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 mt-auto relative z-10">
                  <div className="relative">
                    <img 
                      src={avatarUrl}
                      alt={reviewerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/80 shadow-md group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=1B2A6B&color=fff&bold=true`;
                      }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 size={10} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-[#1B2A6B] transition-colors">
                      {reviewerName}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-500 truncate">
                      {reviewerRole} {reviewerCompany ? `• ${reviewerCompany}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
