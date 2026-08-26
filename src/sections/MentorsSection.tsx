import React, { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../animations/variants";
import { Star, Video, MessageSquare, Shield, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import api from "../lib/axios";
import { getImageUrl } from "../lib/imageUtils";

// Default fallback expert data matching top industry leaders
const defaultFallbackMentors = [
  {
    id: 1,
    name: "Rajesh Sharma",
    role: "Senior System Architect & AI Researcher | Principal Software Engineer",
    company: "Google India",
    rating: "4.9",
    exp: "12 yrs",
    sessions: "120",
    skills: ["Career Guidance", "System Design", "AI & ML"],
    price: "499/30m",
    gradientFrom: "#1B2A6B",
    gradientTo: "#2E45A3",
  },
  {
    id: 2,
    name: "Priya Desai",
    role: "Full Stack Development Lead | Engineering Lead",
    company: "Microsoft",
    rating: "4.9",
    exp: "9 yrs",
    sessions: "95",
    skills: ["React & Next.js", "Node.js", "System Architecture"],
    price: "499/30m",
    gradientFrom: "#1B2A6B",
    gradientTo: "#2E45A3",
  },
  {
    id: 3,
    name: "Vikram Verma",
    role: "Cloud Operations & DevOps Specialist | DevOps Architect",
    company: "AWS",
    rating: "4.9",
    exp: "10 yrs",
    sessions: "110",
    skills: ["Cloud Architecture", "DevOps & K8s", "General"],
    price: "499/30m",
    gradientFrom: "#1B2A6B",
    gradientTo: "#2E45A3",
  },
];

// Helper function to extract initials from expert's full name
export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return "EX";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  return words[0].substring(0, 2).toUpperCase();
};

export interface ExpertCardProps {
  mentor: any;
  variants?: any;
}

/**
 * Reusable Expert Card Component
 * - Fixed 64px circular avatar with object-cover and ring/border
 * - Fallback initials display when photo is missing or fails to load
 * - Side-by-side avatar & text layout with line-clamp: 2 on designation
 * - Top-right pinned rating badge with no photo overlap
 * - Equal height flex-col structure
 */
export const ExpertCard = ({ mentor, variants }: ExpertCardProps) => {
  const [imageError, setImageError] = useState(false);

  const rawPhoto = mentor.profile_picture || mentor.avatar || mentor.photo || mentor.profile_photo;
  const photoUrl = rawPhoto && !imageError ? getImageUrl(rawPhoto) : null;

  const initials = getInitials(mentor.name);
  const designationText = mentor.role || mentor.designation || mentor.title || "Industry Expert";
  const ratingVal = mentor.rating || mentor.average_rating || "4.9";
  const avatarBgGradient = mentor.avatarBg || "from-blue-600 to-indigo-700";

  return (
    <Link href={`/experts/${mentor.slug || mentor.id}`} className="block h-full">
      <motion.div
        variants={variants}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#1B2A6B]/25 hover:shadow-[0_20px_50px_rgba(27,42,107,0.12)] transition-all duration-300 flex flex-col h-full"
      >
        {/* Gradient Header Banner */}
        <div
          className="relative p-5 md:p-6 pb-6 overflow-hidden flex flex-col justify-between"
          style={{ background: `linear-gradient(135deg, ${mentor.gradientFrom || '#1B2A6B'}, ${mentor.gradientTo || '#2E45A3'})` }}
        >
          {/* Decorative dots on gradient header */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* Glow backdrop */}
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          {/* Top Header Row: Avatar + Name/Role & Star Rating Badge */}
          <div className="relative flex items-start justify-between gap-3 mb-4 z-10">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* Photo / Avatar Container: Fixed 64px circular container */}
              <div className={`w-16 h-16 rounded-full shrink-0 relative border-2 border-white/30 ring-2 ring-white/15 shadow-md bg-gradient-to-br ${avatarBgGradient} flex items-center justify-center text-white overflow-hidden`}>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={mentor.name || "Expert"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-lg font-extrabold tracking-wider select-none">{initials}</span>
                )}
              </div>

              {/* Name & Role Text Block with line-clamp */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white leading-tight truncate" title={mentor.name}>
                  {mentor.name}
                </h3>
                <p className="text-xs text-white/80 leading-snug line-clamp-2 mt-1" title={designationText}>
                  {designationText}
                </p>
              </div>
            </div>

            {/* Rating Badge pinned to top-right corner */}
            <div className="shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-white/15 border border-white/20 text-white rounded-lg backdrop-blur-md shadow-sm">
              <Star size={11} className="fill-[#C9A227] text-[#C9A227]" />
              <span>{ratingVal}</span>
            </div>
          </div>

          {/* Expert / Badge Pill */}
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-xs font-semibold rounded-lg">
              {mentor.badge || mentor.company || 'Expert'}
            </span>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-5 md:p-6 -mt-3 bg-white rounded-t-2xl relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-[#4a5568] mb-4">
              <span className="flex items-center gap-1">
                <Shield size={13} className="text-[#1B2A6B]" /> {mentor.exp || mentor.experience || mentor.experience_years || '5 yrs'} exp
              </span>
              <span>·</span>
              <span>{mentor.sessions || mentor.total_reviews || '10'}+ sessions</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {(mentor.skills || mentor.expertise || ['Career Guidance', 'General'])?.slice(0, 3).map((s: any, idx: number) => {
                const skillName = typeof s === 'string' ? s : (s?.name || 'Skill');
                return (
                  <span key={idx} className="px-2.5 py-0.5 bg-[#1B2A6B]/6 text-[#1B2A6B] text-xs font-medium rounded-md border border-[#1B2A6B]/12">
                    {skillName}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <span className="text-base font-bold text-[#0d1635]">
              ₹{String(mentor.price || mentor.rate_per_session || mentor.hourly_rate || '499/30m').replace(/^₹\s*/, '')}
            </span>
            <div className="flex gap-2">
              <div
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, #1B2A6B, #2E45A3)`, color: "white" }}
              >
                <Video size={13} /> Book
              </div>
              <div className="p-2 rounded-lg border border-slate-200 text-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-colors">
                <MessageSquare size={15} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export const MentorsSection = () => {
  const fetcher = (url: string) => api.get(url).then(res => res.data.data);
  const { data: mentorsData, isLoading } = useSWR('/public/experts', fetcher, { revalidateOnFocus: false });
  const mentorsList = (mentorsData && Array.isArray(mentorsData) && mentorsData.length > 0)
    ? mentorsData.slice(0, 3)
    : defaultFallbackMentors;

  return (
    <section className="py-24 border-y border-slate-200 relative overflow-hidden bg-slate-50">
      {/* Soft Light Background with Subtle Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#C9A227]/10 blur-[120px]" />
      </div>
      {/* Subtle Light Dot Grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.5] z-0"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 2px, transparent 2px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.p variants={staggerItem} className="text-xs font-bold tracking-widest uppercase text-[#1B2A6B] mb-3">
            Expert Guidance
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-3xl md:text-4xl font-bold mb-4 text-[#0d1635]">
            <span>Learn from </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B2A6B] to-[#C9A227]">Industry Leaders</span>
          </motion.h2>
          <motion.p variants={staggerItem} className="text-base text-slate-600">
            Book 1-on-1 sessions for mock interviews, career guidance, and portfolio reviews with top professionals.
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[380px]">
                <div className="w-full h-32 bg-slate-200"></div>
                <div className="p-6 flex flex-col h-full gap-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                    <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mt-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="mt-auto flex justify-between">
                    <div className="w-20 h-8 bg-slate-200 rounded-lg"></div>
                    <div className="w-24 h-8 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {mentorsList.map((mentor: any) => (
                <ExpertCard key={mentor.id} mentor={mentor} variants={staggerItem} />
              ))}
            </motion.div>

            {/* Browse All Experts Button */}
            <div className="mt-12 text-center">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/experts"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm transition-all border-2 border-[#1B2A6B] text-[#1B2A6B] hover:bg-[#1B2A6B] hover:text-white"
                >
                  <Sparkles size={15} />
                  Browse All Experts
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

