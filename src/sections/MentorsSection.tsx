import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../animations/variants";
import { Star, Video, MessageSquare, Shield, ArrowRight, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { getImageUrl } from "../lib/imageUtils";
import { ExpertService, ExpertData } from "../lib/api/ExpertService";

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
  mentor: ExpertData;
  variants?: any;
}

export const ExpertCard = ({ mentor, variants }: ExpertCardProps) => {
  const [imageError, setImageError] = useState(false);

  const rawPhoto = mentor.avatar || mentor.profile_photo;
  const photoUrl = rawPhoto && !imageError ? getImageUrl(rawPhoto) : null;

  const initials = getInitials(mentor.name);
  const designationText = mentor.designation || "Industry Expert";
  const ratingVal = Number(mentor.average_rating || 5.0).toFixed(1);
  const specializationList = mentor.specialization
    ? (Array.isArray(mentor.specialization) ? mentor.specialization : [mentor.specialization])
    : ["Career Mentorship"];

  return (
    <Link href={`/experts/${mentor.id}`} className="block h-full">
      <motion.div
        variants={variants}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#1B2A6B]/25 hover:shadow-[0_20px_50px_rgba(27,42,107,0.12)] transition-all duration-300 flex flex-col h-full"
      >
        {/* Gradient Header Banner */}
        <div
          className="relative p-5 md:p-6 pb-6 overflow-hidden flex flex-col justify-between"
          style={{ background: "linear-gradient(135deg, #1B2A6B, #2E45A3)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          {/* Top Header Row: Avatar + Name/Role & Star Rating Badge */}
          <div className="relative flex items-start justify-between gap-3 mb-4 z-10">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-16 h-16 rounded-full shrink-0 relative border-2 border-white/30 ring-2 ring-white/15 shadow-md bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white overflow-hidden">
                {photoUrl ? (
                  <img
                    src={getImageUrl(photoUrl)}
                    alt={mentor.name || "Expert"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-lg font-extrabold tracking-wider select-none">{initials}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white leading-tight truncate" title={mentor.name}>
                  {mentor.name}
                </h3>
                <p className="text-xs text-white/80 leading-snug line-clamp-2 mt-1" title={designationText}>
                  {designationText}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-white/15 border border-white/20 text-white rounded-lg backdrop-blur-md shadow-sm">
              <Star size={11} className="fill-[#C9A227] text-[#C9A227]" />
              <span>{ratingVal}</span>
            </div>
          </div>

          {/* Expert Company Pill */}
          <div className="relative z-10">
            <span className="inline-flex items-center px-2.5 py-1 bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-xs font-semibold rounded-lg truncate max-w-[200px]">
              <Building2 size={12} className="inline mr-1 shrink-0" /> {mentor.company || "Independent"}
            </span>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-5 md:p-6 -mt-3 bg-white rounded-t-2xl relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-[#4a5568] mb-4">
              <span className="flex items-center gap-1">
                <Shield size={13} className="text-[#1B2A6B]" /> Verified Expert
              </span>
              <span>·</span>
              <span>1:1 Mentorship</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {specializationList.slice(0, 3).map((s: string, idx: number) => (
                <span key={idx} className="px-2.5 py-0.5 bg-[#1B2A6B]/6 text-[#1B2A6B] text-xs font-medium rounded-md border border-[#1B2A6B]/12">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <span className="text-base font-bold text-[#0d1635]">
              ₹{Number(mentor.hourly_rate || 1500).toLocaleString()}/hr
            </span>
            <div className="flex gap-2">
              <div
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1B2A6B, #2E45A3)", color: "white" }}
              >
                <Video size={13} /> Book 1:1
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
  const { data: experts, isLoading } = useSWR(
    "/public/experts?per_page=6",
    () => ExpertService.getAll(),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );

  const mentorsList = (Array.isArray(experts) ? experts : []).slice(0, 3);

  if (!isLoading && mentorsList.length === 0) return null;

  return (
    <section className="py-24 border-y border-slate-200 relative overflow-hidden bg-slate-50">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#1B2A6B]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#C9A227]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/15 text-[#1B2A6B] text-xs font-bold tracking-wider uppercase mb-4">
              <Sparkles size={14} className="text-[#C9A227]" />
              <span>1% Elite Mentorship</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1635] tracking-tight">
              Learn from <span className="text-[#1B2A6B]">Top Industry Leaders</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#4a5568] leading-relaxed">
              Get personalized, unscripted 1:1 mentorship from verified tech leads and executives at top organizations.
            </p>
          </div>

          <Link
            href="/experts"
            className="inline-flex items-center gap-2 text-[#1B2A6B] font-bold text-sm hover:text-[#C9A227] transition-colors group self-start md:self-auto"
          >
            <span>Explore all verified experts</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {mentorsList.map((mentor) => (
              <ExpertCard key={mentor.id} mentor={mentor} variants={staggerItem} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
