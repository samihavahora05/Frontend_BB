import { useState, useEffect } from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { TopSearchBar } from "../src/components/ui/TopSearchBar";
import { Pagination } from "../src/components/ui/Pagination";
import { BecomeMentorSection } from "../src/sections/BecomeMentorSection";
import { WhyChooseBlueboxxSection } from "../src/sections/WhyChooseBlueboxxSection";
import { TestimonialsSection } from "../src/sections/TestimonialsSection";
import { InternshipBenefitsSection } from "../src/sections/InternshipBenefitsSection";
import { InternshipEarnSection } from "../src/sections/InternshipEarnSection";
import { PartnersSection } from "../src/sections/PartnersSection";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { Star, Building, Video, X, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSWR from "swr";
import { ExpertService, ExpertData } from "../src/lib/api/ExpertService";
import { getImageUrl } from "../src/lib/imageUtils";

// Simple debounce hook for local use
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const mentorSchema = z.object({
  experience: z.string().min(1, { message: "Please select your experience" }),
  subject: z.string().min(2, { message: "Please enter your domain/subject" }),
});
type MentorFormValues = z.infer<typeof mentorSchema>;

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortOption, setSortOption] = useState("rating_high");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [mentorStep, setMentorStep] = useState(1);
  const [, setMentorData] = useState({ experience: '', subject: '' });

  const { register: registerMentor, handleSubmit: handleSubmitMentor, formState: { errors: mentorErrors, isValid: isMentorValid } } = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema),
    mode: "onChange"
  });

  const onMentorContinue = (data: MentorFormValues) => {
    setMentorData({ experience: data.experience, subject: data.subject });
    setMentorStep(2);
  };

  const { data: rawApiExperts, error, isLoading, mutate } = useSWR(
    "/public/experts?per_page=100",
    () => ExpertService.getAll(),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    const handleSync = () => {
      mutate();
    };
    window.addEventListener("bb_experts_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("bb_experts_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [mutate]);

  const allExperts: ExpertData[] = Array.isArray(rawApiExperts) ? rawApiExperts : [];

  // Filter & Search
  const filteredExperts = allExperts.filter((expert) => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    if (q) {
      const matches =
        (expert.name || "").toLowerCase().includes(q) ||
        (expert.company || "").toLowerCase().includes(q) ||
        (expert.designation || "").toLowerCase().includes(q) ||
        (expert.specialization || "").toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  // Sort
  const sortedExperts = [...filteredExperts].sort((a, b) => {
    if (sortOption === "rating_high") return (b.average_rating || 5) - (a.average_rating || 5);
    if (sortOption === "price_low") return (a.hourly_rate || 0) - (b.hourly_rate || 0);
    if (sortOption === "price_high") return (b.hourly_rate || 0) - (a.hourly_rate || 0);
    return 0;
  });

  const perPage = 8;
  const totalPages = Math.ceil(sortedExperts.length / perPage) || 1;
  const experts = sortedExperts.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalExperts = sortedExperts.length;

  return (
    <>
      <SEO
        title="Learn from 1% Industry Experts | Blueboxx DA Mentors"
        description="Book 1:1 sessions with leading industry mentors and domain experts. Get personalized guidance, resume reviews, and interview prep."
        keywords="Career Guidance, Resume Building, Mock Interview, Placement Preparation, Mentorship, Industry Experts"
      />
      <MainLayout>
        <div>
          {/* Top Hero Banner - Original Design */}
          <div className="bg-[#0d1635] pt-24 pb-16 relative overflow-hidden">
            {/* Premium Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#C9A227] text-xs font-bold mb-6"
              >
                <Star size={12} className="fill-[#C9A227]" /> Top 1% Industry Experts
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
              >
                Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] to-amber-200">Masters</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              >
                Book 1:1 sessions with seasoned industry mentors, tech leads, and domain experts.
              </motion.p>
            </div>
          </div>

          {/* Body Section with Gradient Orbs & Dot Grid - Original Design */}
          <div
            className="py-12 min-h-screen relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f8faff 0%, #fafafa 40%, #fffdf5 100%)" }}
          >
            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.55]"
              style={{ backgroundImage: "radial-gradient(#c7d2fe 1px, transparent 1px)", backgroundSize: "28px 28px" }}
            />
            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-[#1B2A6B]/8 to-transparent rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#C9A227]/8 to-transparent rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-50/60 to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <TopSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search experts by name, role, or specialization..."
              />

              <div className="w-full">
                <main className="w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-slate-800 text-lg">Showing {totalExperts} experts</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 font-semibold">Sort by:</span>
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 px-3 py-1.5 focus:ring-[#C9A227] focus:border-[#C9A227] cursor-pointer outline-none"
                      >
                        <option value="rating_high">Top Rated</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card
                          key={i}
                          className="animate-pulse bg-white rounded-[1.25rem] border border-slate-200 overflow-hidden h-[300px]"
                        >
                          <div className="h-24 bg-slate-200" />
                          <CardContent className="p-4 flex-1 flex flex-col -mt-8 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-slate-300 border-2 border-white mb-3" />
                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                            <div className="h-3 bg-slate-200 rounded w-1/3 mb-4" />
                            <div className="h-3 bg-slate-200 rounded w-2/3 mb-6" />
                            <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between">
                              <div className="h-4 bg-slate-200 rounded w-1/4" />
                              <div className="h-8 bg-slate-200 rounded w-1/3" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : error && allExperts.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
                        <AlertCircle size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Unable to load experts</h3>
                      <p className="text-slate-500 mb-6 text-sm">
                        Please check your connection and try again.
                      </p>
                      <Button
                        onClick={() => mutate()}
                        className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold px-6 py-2 rounded-xl cursor-pointer"
                      >
                        <RefreshCw size={15} className="mr-2" /> Retry
                      </Button>
                    </div>
                  ) : experts.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {experts.map((mentor: ExpertData) => {
                          const avatarUrl = getImageUrl(mentor.avatar || mentor.profile_photo);
                          const initials = mentor.name
                            ? mentor.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
                            : "E";

                          return (
                            <Card
                              key={mentor.id}
                              className="group relative overflow-hidden bg-white border border-slate-200 hover:border-[#1B2A6B]/30 hover:shadow-[0_8px_30px_rgba(27,42,107,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-[1.25rem]"
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1B2A6B]/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                              <CardContent className="p-4 flex-1 flex flex-col relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="w-12 h-12 relative rounded-full border border-slate-100 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300 bg-[#1B2A6B]/5 text-[#1B2A6B] font-black flex items-center justify-center text-sm shrink-0">
                                    <span>{initials}</span>
                                    {avatarUrl ? (
                                      <img
                                        src={avatarUrl}
                                        alt={mentor.name || "Expert"}
                                        className="absolute inset-0 w-full h-full object-cover z-10"
                                        loading="lazy"
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).style.display = "none";
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
                                    <Star size={10} className="fill-amber-500 text-amber-500" />{" "}
                                    {Number(mentor.average_rating || 5.0).toFixed(1)}
                                  </div>
                                </div>

                                <h3 className="text-base font-extrabold text-slate-900 mb-0.5 group-hover:text-[#1B2A6B] transition-colors leading-tight line-clamp-1">
                                  {mentor.name}
                                </h3>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 line-clamp-1">
                                  {mentor.designation}
                                </p>

                                <p className="text-[12px] font-bold text-[#1B2A6B] flex items-center gap-1.5 mb-3">
                                  <Building size={14} /> {mentor.company}
                                </p>

                                {mentor.specialization && (
                                  <div className="mb-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50/70 border border-blue-100 text-[#1B2A6B] text-[11px] font-bold rounded-md max-w-full truncate">
                                      <Sparkles size={10} className="text-[#C9A227] shrink-0" />
                                      <span className="truncate">
                                        {Array.isArray(mentor.specialization) ? mentor.specialization[0] : mentor.specialization.split(',')[0]}
                                      </span>
                                    </span>
                                  </div>
                                )}

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                                  <div className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 tracking-wider">
                                    {(mentor.hourly_rate ?? 0) > 0 ? `₹${Number(mentor.hourly_rate).toLocaleString()}/hr` : "Free"}
                                  </div>
                                  <Link href={`/experts/${mentor.id}`}>
                                    <Button
                                      variant="outline"
                                      className="h-8 text-[11px] font-bold border-slate-200 text-slate-700 bg-slate-50 group-hover:bg-[#1B2A6B] group-hover:text-white group-hover:border-[#1B2A6B] transition-colors shadow-sm rounded-lg px-4"
                                    >
                                      View Profile
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          className="mt-12"
                        />
                      )}
                    </>
                  ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <Video size={48} className="mx-auto text-slate-300 mb-4" />
                      <h3 className="text-xl font-bold text-slate-800 mb-2">No experts found</h3>
                      <p className="text-slate-500">There are no experts available at the moment.</p>
                    </div>
                  )}
                </main>
              </div>
            </div>
          </div>
        </div>

        <BecomeMentorSection onBecomeMentor={() => setIsMentorModalOpen(true)} />
        <WhyChooseBlueboxxSection />
        <PartnersSection
          titlePrefix="Experts from "
          highlightText="Top Companies"
          subtitle="Book 1:1 sessions with verified mentors, senior developers, and industry leaders"
        />


        <AnimatePresence>
          {isMentorModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={() => setIsMentorModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 relative overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-black text-[#0d1635]">Become a Mentor</h3>
                  <button onClick={() => setIsMentorModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8">
                  {mentorStep === 1 && (
                    <form className="space-y-6" onSubmit={handleSubmitMentor(onMentorContinue)}>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">How much experience do you have?</label>
                        <select
                          {...registerMentor("experience")}
                          className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] ${mentorErrors.experience ? "border-red-500" : "border-slate-200"}`}
                        >
                          <option value="">Select experience</option>
                          <option value="1-3">1-3 Years</option>
                          <option value="3-5">3-5 Years</option>
                          <option value="5+">5+ Years</option>
                        </select>
                        {mentorErrors.experience && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">{mentorErrors.experience.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Which subject/domain?</label>
                        <input
                          type="text"
                          {...registerMentor("subject")}
                          placeholder="e.g. React, UI/UX, Python"
                          className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] ${mentorErrors.subject ? "border-red-500" : "border-slate-200"}`}
                        />
                        {mentorErrors.subject && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">{mentorErrors.subject.message}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={!isMentorValid}
                        className="w-full py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </form>
                  )}
                  {mentorStep === 2 && (
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                        <Star size={32} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-800 mb-2">You're a great fit!</h4>
                        <p className="text-sm font-medium text-slate-500">
                          Join our network of elite mentors and start helping students while earning.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          toast.success("Redirecting to onboarding...");
                          setIsMentorModalOpen(false);
                        }}
                        className="w-full py-3 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] text-sm font-bold rounded-xl transition-colors shadow-md"
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Exclusive Benefits for You - Restored */}
        <InternshipBenefitsSection />

        {/* How to Earn With Us - Restored */}
        <InternshipEarnSection />
        <TestimonialsSection />
      </MainLayout>
    </>
  );
}
