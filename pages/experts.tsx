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
import { 
  Star, Building, Video, X, Sparkles, AlertCircle, RefreshCw, 
  CheckCircle2, Clock, ShieldAlert, ArrowRight, UserCheck, Briefcase, 
  Award, Globe, DollarSign, Loader2, LogIn, ExternalLink, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSWR from "swr";
import { ExpertService, ExpertData } from "../src/lib/api/ExpertService";
import { getImageUrl } from "../src/lib/imageUtils";
import { useAuth } from "../src/context/AuthContext";
import api from "../src/lib/axios";

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

const mentorApplicationSchema = z.object({
  experience: z.string().min(1, { message: "Please select your professional experience" }),
  subject: z.string().min(2, { message: "Please enter your domain or specialization (e.g. React, Python, UI/UX, AI/ML)" }),
  company: z.string().min(2, { message: "Please enter your current company, organization, or 'Freelance'" }),
  designation: z.string().min(2, { message: "Please enter your current designation / title" }),
  hourly_rate: z.string().optional(),
  linkedin_url: z.string().optional(),
  bio: z.string().min(10, { message: "Please provide a brief bio or reason for role exchange (min 10 characters)" }),
});
type MentorApplicationFormValues = z.infer<typeof mentorApplicationSchema>;

export default function ExpertsPage() {
  const router = useRouter();
  const { user, isAuthenticated, role } = useAuth();
  const currentRole = (role || (user as any)?.role || 'student').toLowerCase();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortOption, setSortOption] = useState("rating_high");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  // Role Exchange & Mentor Application State
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [isSubmittingMentor, setIsSubmittingMentor] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const { 
    register: registerMentor, 
    handleSubmit: handleSubmitMentor, 
    reset: resetMentorForm,
    formState: { errors: mentorErrors, isValid: isMentorValid } 
  } = useForm<MentorApplicationFormValues>({
    resolver: zodResolver(mentorApplicationSchema),
    mode: "onChange",
    defaultValues: {
      experience: "",
      subject: "",
      company: "",
      designation: "",
      hourly_rate: "500",
      linkedin_url: "",
      bio: ""
    }
  });

  // Check if user already has an active pending role exchange request
  useEffect(() => {
    if (!isMentorModalOpen) {
      setIsSubmittedSuccess(false);
      return;
    }

    if (isAuthenticated) {
      setCheckingStatus(true);
      api.get('/role-change-requests/my-status')
        .then((res) => {
          if (res.data?.has_pending) {
            setHasPendingRequest(true);
            setPendingRequestData(res.data.pending_request);
          } else {
            setHasPendingRequest(false);
            setPendingRequestData(null);
          }
        })
        .catch(() => {
          setHasPendingRequest(false);
        })
        .finally(() => {
          setCheckingStatus(false);
        });
    }
  }, [isMentorModalOpen, isAuthenticated]);

  const onSubmitMentorApplication = async (data: MentorApplicationFormValues) => {
    if (isSubmittingMentor) return;
    setIsSubmittingMentor(true);

    try {
      const formattedReason = [
        `Role Transition: ${currentRole.toUpperCase()} -> EXPERT (Mentor Application)`,
        `Experience: ${data.experience}`,
        `Subject/Domain: ${data.subject}`,
        `Company: ${data.company}`,
        `Designation: ${data.designation}`,
        data.hourly_rate ? `Expected Hourly Rate: ₹${data.hourly_rate}/hr` : 'Hourly Rate: Open/Negotiable',
        data.linkedin_url ? `LinkedIn / Portfolio: ${data.linkedin_url}` : null,
        `Qualifications & Mentorship Statement: ${data.bio}`,
      ].filter(Boolean).join('\n');

      const res = await api.post('/role-change-requests', {
        requested_role: 'expert',
        reason: formattedReason,
        experience: data.experience,
        subject: data.subject,
        company: data.company,
        designation: data.designation,
        hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : 0,
        linkedin_url: data.linkedin_url,
        bio: data.bio
      });

      if (res.data?.success || res.status === 201 || res.status === 200) {
        setIsSubmittedSuccess(true);
        resetMentorForm();
        toast.success('Your Role Exchange Application to become an Expert has been submitted for Admin Review!', { duration: 6000 });
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setHasPendingRequest(true);
        toast.error(err.response?.data?.message || 'You already have an active pending role request.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit application. Please verify your details.');
      }
    } finally {
      setIsSubmittingMentor(false);
    }
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
                                        src={getImageUrl(avatarUrl)}
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

        <BecomeMentorSection 
          onBecomeMentor={() => setIsMentorModalOpen(true)} 
          userRole={currentRole}
        />
        <WhyChooseBlueboxxSection />
        <PartnersSection
          titlePrefix="Experts from "
          highlightText="Top Companies"
          subtitle="Book 1:1 sessions with verified mentors, senior developers, and industry leaders"
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            BECOME AN EXPERT & ROLE EXCHANGE APPLICATION MODAL
        ═══════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isMentorModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setIsMentorModalOpen(false)}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 relative overflow-hidden my-8 border border-slate-100 flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#2E45A3] p-6 text-white shrink-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A227]/15 rounded-full blur-3xl pointer-events-none" />
                  
                  <button 
                    onClick={() => setIsMentorModalOpen(false)} 
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A227] text-xs font-black uppercase tracking-wider mb-2">
                    <Sparkles size={12} /> Become a Verified Mentor
                  </div>
                  <h3 className="text-2xl font-black font-sora">Role Exchange: Apply as an Expert</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    Share your real-world industry experience, mentor students, and unlock paid 1-on-1 consultations.
                  </p>
                </div>

                {/* Modal Body Container with Scroll */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-inter">

                  {/* Case 1: Checking status */}
                  {checkingStatus ? (
                    <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
                      <p className="text-xs font-semibold">Checking your account status & permissions...</p>
                    </div>
                  ) : !isAuthenticated ? (
                    /* Case 2: Not authenticated */
                    <div className="text-center py-8 space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C9A227] border border-amber-200/60 flex items-center justify-center mx-auto shadow-xs">
                        <LogIn size={28} />
                      </div>
                      <div className="max-w-md mx-auto">
                        <h4 className="text-xl font-bold text-slate-900 font-sora mb-2">Sign in to Apply as a Mentor</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          You must be signed in with your Blueboxx account to submit your mentor profile and role exchange application.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Button
                          onClick={() => {
                            setIsMentorModalOpen(false);
                            router.push('/login?redirect=/experts');
                          }}
                          className="w-full sm:w-auto px-8 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl h-12 text-sm shadow-md"
                        >
                          Sign In with Account
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsMentorModalOpen(false);
                            router.push('/register');
                          }}
                          className="w-full sm:w-auto px-8 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl h-12 text-sm"
                        >
                          Create New Account
                        </Button>
                      </div>
                    </div>
                  ) : currentRole === 'expert' || currentRole === 'admin' ? (
                    /* Case 3: Already an expert */
                    <div className="text-center py-8 space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                        <UserCheck size={32} />
                      </div>
                      <div className="max-w-md mx-auto">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                          <CheckCircle2 size={13} /> Verified Expert
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 font-sora mb-2">You're Already an Expert!</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Your account is already authorized with Expert privileges. You can manage your availability, session pricing, and incoming booking requests from your dashboard.
                        </p>
                      </div>
                      <div className="pt-2 flex justify-center">
                        <Button
                          onClick={() => {
                            setIsMentorModalOpen(false);
                            router.push('/student/dashboard');
                          }}
                          className="px-8 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl h-12 text-sm shadow-md cursor-pointer"
                        >
                          Go to Dashboard
                        </Button>
                      </div>
                    </div>
                  ) : isSubmittedSuccess ? (
                    /* Case 4: Successfully Submitted */
                    <div className="text-center py-8 space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 size={32} />
                      </div>
                      <div className="max-w-md mx-auto space-y-2">
                        <h4 className="text-2xl font-bold text-slate-900 font-sora">Application Submitted!</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Your Role Exchange Application to become an <strong>Expert / Mentor</strong> has been received by the Blueboxx administration team.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <Clock size={14} className="text-[#C9A227]" /> What happens next?
                        </div>
                        <p>1. Our team reviews your industry background, domain expertise, and submitted credentials within <strong>24–48 hours</strong>.</p>
                        <p>2. Once verified and approved, your account role will transition from <strong>Student</strong> to <strong>Expert</strong> automatically.</p>
                      </div>
                      <div className="pt-2 flex justify-center">
                        <Button
                          onClick={() => setIsMentorModalOpen(false)}
                          className="px-8 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl h-12 text-sm shadow-md"
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : hasPendingRequest ? (
                    /* Case 5: Has active pending request */
                    <div className="text-center py-8 space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
                        <Clock size={32} />
                      </div>
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                          <Clock size={13} /> Review In Progress
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 font-sora">Application Under Review</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          You already have an active role exchange application pending review with the administration team.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-left text-xs text-amber-900 space-y-2.5 max-w-md mx-auto">
                        <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
                          <span className="font-bold text-slate-700">Requested Role:</span>
                          <span className="font-black text-[#1B2A6B] uppercase tracking-wider">{pendingRequestData?.requested_role || 'Expert'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
                          <span className="font-bold text-slate-700">Current Role:</span>
                          <span className="font-semibold text-slate-600 capitalize">{currentRole}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700">Status:</span>
                          <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending Administrator Approval
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-center">
                        <Button
                          onClick={() => setIsMentorModalOpen(false)}
                          className="px-8 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl h-12 text-sm shadow-md"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Case 6: Role Exchange Application Form (For Student / non-expert) */
                    <form onSubmit={handleSubmitMentor(onSubmitMentorApplication)} className="space-y-6">
                      
                      {/* Notice Banner explaining Role Exchange */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <span className="font-bold block text-slate-800">Role Exchange Required for Students</span>
                          <p className="text-slate-600 leading-relaxed font-normal">
                            Your account is currently registered as a <strong className="text-slate-800 capitalize font-bold">{currentRole}</strong>. 
                            Students cannot mentor directly without an authorized transition. Submit your industry credentials below for administrator verification.
                          </p>
                        </div>
                      </div>

                      {/* Row 1: Experience & Subject */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Industry Experience *
                          </label>
                          <select
                            {...registerMentor("experience")}
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] transition-colors ${
                              mentorErrors.experience ? "border-red-500 bg-red-50/30" : "border-slate-200"
                            }`}
                          >
                            <option value="">Select experience level</option>
                            <option value="1-2 Years">1 - 2 Years</option>
                            <option value="2-4 Years">2 - 4 Years</option>
                            <option value="4-7 Years">4 - 7 Years</option>
                            <option value="7+ Years">7+ Years (Senior Lead / Architect)</option>
                          </select>
                          {mentorErrors.experience && (
                            <p className="text-red-500 text-[11px] mt-1 font-semibold">{mentorErrors.experience.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Domain / Primary Specialization *
                          </label>
                          <input
                            type="text"
                            {...registerMentor("subject")}
                            placeholder="e.g. Fullstack React, AI/ML, Cloud DevOps"
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] transition-colors placeholder:text-slate-400 ${
                              mentorErrors.subject ? "border-red-500 bg-red-50/30" : "border-slate-200"
                            }`}
                          />
                          {mentorErrors.subject && (
                            <p className="text-red-500 text-[11px] mt-1 font-semibold">{mentorErrors.subject.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Company & Designation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Current Company / Organization *
                          </label>
                          <div className="relative">
                            <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              {...registerMentor("company")}
                              placeholder="e.g. Google, Infosys, Freelance"
                              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] transition-colors placeholder:text-slate-400 ${
                                mentorErrors.company ? "border-red-500 bg-red-50/30" : "border-slate-200"
                              }`}
                            />
                          </div>
                          {mentorErrors.company && (
                            <p className="text-red-500 text-[11px] mt-1 font-semibold">{mentorErrors.company.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Current Designation / Title *
                          </label>
                          <div className="relative">
                            <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              {...registerMentor("designation")}
                              placeholder="e.g. Senior Software Engineer, Tech Lead"
                              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] transition-colors placeholder:text-slate-400 ${
                                mentorErrors.designation ? "border-red-500 bg-red-50/30" : "border-slate-200"
                              }`}
                            />
                          </div>
                          {mentorErrors.designation && (
                            <p className="text-red-500 text-[11px] mt-1 font-semibold">{mentorErrors.designation.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 3: Hourly Rate & LinkedIn URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Expected Hourly Rate (₹ / Hour)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                            <input
                              type="number"
                              min="0"
                              step="50"
                              {...registerMentor("hourly_rate")}
                              placeholder="e.g. 500 (or 0 for Free)"
                              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] transition-colors"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">You can adjust this later in your expert profile.</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            LinkedIn / Portfolio URL (Optional)
                          </label>
                          <div className="relative">
                            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="url"
                              {...registerMentor("linkedin_url")}
                              placeholder="https://linkedin.com/in/username"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] transition-colors placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Bio / Reason for Role Exchange */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Mentorship Statement & Qualifications *
                        </label>
                        <textarea
                          rows={3}
                          {...registerMentor("bio")}
                          placeholder="Tell the admin team about your mentoring background, key skills, and why you want to transition from Student to Expert..."
                          className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] transition-colors resize-none placeholder:text-slate-400 ${
                            mentorErrors.bio ? "border-red-500 bg-red-50/30" : "border-slate-200"
                          }`}
                        />
                        {mentorErrors.bio && (
                          <p className="text-red-500 text-[11px] mt-1 font-semibold">{mentorErrors.bio.message}</p>
                        )}
                      </div>

                      {/* Submit Actions */}
                      <div className="pt-2 flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsMentorModalOpen(false)}
                          className="w-1/3 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl h-12 text-sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!isMentorValid || isSubmittingMentor}
                          className="w-2/3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl h-12 text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmittingMentor ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> Submitting Application...
                            </>
                          ) : (
                            <>
                              Submit Role Exchange Application <ArrowRight size={16} />
                            </>
                          )}
                        </Button>
                      </div>

                    </form>
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
