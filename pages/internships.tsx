import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../src/layout/MainLayout";
import { Filter, Briefcase, Clock, ArrowRight, Building, Loader2, Search, MapPin, CheckCircle2, Play, X, Star, ShieldCheck } from "lucide-react";
import { SidebarFilter } from "../src/components/ui/SidebarFilter";
import { Pagination } from "../src/components/ui/Pagination";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../src/components/seo/SEO";
import api from "../src/lib/axios";
import { useAuth } from "../src/context/AuthContext";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import { ApplyModal } from "../src/components/internship/ApplyModal";
import { PartnersSection } from "../src/sections/PartnersSection";

export default function InternshipsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  // Hero Apply Form State
  const [heroForm, setHeroForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    degree: "",
    graduation_year: "",
    message: ""
  });
  const [isSubmittingHeroForm, setIsSubmittingHeroForm] = useState(false);

  // Video Popup State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Quick Apply Modal State
  const [selectedInternshipForApply, setSelectedInternshipForApply] = useState<any>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [internships, setInternships] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInternships, setTotalInternships] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);

  // Load wishlist
  useSWR(isAuthenticated ? "/student/wishlist" : null, (url) =>
    api.get(url).then(res => res.data.data)
  , {
    onSuccess: (data) => {
      if (data?.saved_internship_ids) {
        setSavedIds(new Set(data.saved_internship_ids.map(Number)));
      }
    }
  });

  const toggleSave = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to save items.");
      return;
    }
    if (saving === id) return;
    setSaving(id);
    const isSaved = savedIds.has(id);
    try {
      if (isSaved) {
        await api.delete(`/student/save/internship/${id}`);
        setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        toast.success("Removed from saved items");
      } else {
        await api.post(`/student/save/internship/${id}`);
        setSavedIds(prev => new Set([...prev, id]));
        toast.success("Internship saved to your Saved Items!");
      }
      mutate("/student/wishlist");
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setIsLoading(true);
        const params: any = {
          page: currentPage,
          per_page: 6,
          sort: sortOption,
        };

        let searchTerms = [];
        if (searchQuery) searchTerms.push(searchQuery);
        if (locationQuery) searchTerms.push(locationQuery);
        if (categoryFilter !== "All") searchTerms.push(categoryFilter);
        if (activeFilters.domain) searchTerms.push(activeFilters.domain);
        if (searchTerms.length > 0) params.search = searchTerms.join(' ');

        if (activeFilters.mode) {
           params.type = activeFilters.mode === "On-Site" ? "Onsite" : activeFilters.mode;
        }
        if (activeFilters.duration) {
           params.duration = activeFilters.duration;
        }
        if (activeFilters.level) {
           params.experience_level = activeFilters.level;
        }

        const res = await api.get("/public/internships", { params });
        if (res.data.success) {
          setInternships(res.data.data);
          setTotalPages(res.data.pagination.last_page);
          setTotalInternships(res.data.pagination.total);
        }
      } catch (error) {
        console.error("Failed to fetch internships:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const delayDebounceFn = setTimeout(() => {
      fetchInternships();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, sortOption, searchQuery, locationQuery, categoryFilter, activeFilters]);

  const handleOpenApply = (internship: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for internships.");
      router.push("/login?redirect=" + encodeURIComponent(`/internships`));
      return;
    }
    setSelectedInternshipForApply(internship);
    setIsApplyModalOpen(true);
  };

  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.first_name || !heroForm.email || !heroForm.phone || !heroForm.degree || !heroForm.graduation_year) {
      toast.error("Please fill in all required fields (*)");
      return;
    }
    setIsSubmittingHeroForm(true);
    try {
      await api.post(`/public/internships/apply-general`, {
        first_name: heroForm.first_name,
        last_name: heroForm.last_name,
        email: heroForm.email,
        phone: heroForm.phone,
        degree: heroForm.degree,
        graduation_year: heroForm.graduation_year,
        message: heroForm.message,
        application_type: "Fast Track Program Application",
        source_page: "Internship Hero Form",
      });
      toast.success("Application received successfully! Our team will contact you shortly.");
      setHeroForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        degree: "",
        graduation_year: "",
        message: ""
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Application received! Our placement counselor will get in touch with you.");
    } finally {
      setIsSubmittingHeroForm(false);
    }
  };

  return (
    <>
      <SEO 
        title="Blueboxx Internship Program for Career Growth | Guaranteed Paid Internships"
        description="Join 50 Days LIVE Projects + Real Internship or 3 Months LIVE Training. Government certified, 100% placement assistance, real client projects, and monthly stipends."
        keywords="Blueboxx Internship Program, Live Projects, Paid Internship, Government Certified Internship, Vadodara IT Internship, Web Development, UI/UX Design"
      />
      <MainLayout>

        {/* ========================================================
            SECTION 1: HERO & PROGRAM CARDS + APPLICATION FORM
            ======================================================== */}
        <div className="pt-28 pb-16 bg-[#0d1635] text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A227]/15 blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Program Info & Cards */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#C9A227] text-xs font-black uppercase tracking-wider shadow-xs">
                  <ShieldCheck size={16} /> Government-certified ⭐ 4.8 Rating
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                  <span className="text-[#C9A227]">Blueboxx</span> Internship Program for Career Growth
                </h1>

                <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
                  Gain industry-driven hands-on experience working on live client projects. Build a portfolio that gets you hired.
                </p>

                {/* Program Card 1 */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-[#C9A227]/40 transition-all shadow-xl relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-extrabold text-white group-hover:text-[#C9A227] transition-colors">
                      50 Days <span className="text-[#C9A227]">Online LIVE Projects + Real Internship</span>
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-300">Batch starts: <strong className="text-white">1st August 2026</strong></span>
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">Limited seats only</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xs text-slate-300 font-bold">Program Fee:</span>
                    <span className="text-2xl font-black text-[#C9A227]">₹4,999</span>
                    <span className="text-sm font-bold text-slate-400 line-through">₹9,999</span>
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">Save ₹5,000</span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-semibold italic">
                    Valid till 31st August 2026 registrations only
                  </p>
                </div>

                {/* Program Card 2 */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-[#C9A227]/40 transition-all shadow-xl relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-extrabold text-white group-hover:text-[#C9A227] transition-colors">
                      3 Months <span className="text-[#C9A227]">Online LIVE Training + Internship + Live Projects</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-300">Batch starts: <strong className="text-white">1st August 2026</strong></span>
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">Limited seats only</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xs text-slate-300 font-bold">Program Fee:</span>
                    <span className="text-2xl font-black text-[#C9A227]">₹14,999</span>
                    <span className="text-sm font-bold text-slate-400 line-through">₹34,999</span>
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">Save ₹20,000</span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-semibold italic">
                    Next Batch starts: 1st November 2026
                  </p>
                </div>

              </div>

              {/* Right Column: Interested? Apply Now Form */}
              <div className="lg:col-span-5">
                <div className="bg-white text-slate-900 p-7 md:p-8 rounded-3xl shadow-2xl border border-slate-100 relative">
                  
                  <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#1B2A6B]/10 text-[#1B2A6B] inline-block mb-1.5">
                      Fast Track Admission
                    </span>
                    <h2 className="text-2xl font-black text-[#0d1635]">Interested? Apply Now</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Fill out your details to get a free career advisory call.</p>
                  </div>

                  <form onSubmit={handleHeroFormSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">First Name *</label>
                        <input 
                          type="text"
                          required
                          value={heroForm.first_name}
                          onChange={(e) => setHeroForm({ ...heroForm, first_name: e.target.value })}
                          placeholder="Enter first name"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
                        <input 
                          type="text"
                          value={heroForm.last_name}
                          onChange={(e) => setHeroForm({ ...heroForm, last_name: e.target.value })}
                          placeholder="Enter last name"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={heroForm.email}
                        onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
                        placeholder="Enter email address"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B2A6B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Mobile Number *</label>
                      <input 
                        type="tel"
                        required
                        value={heroForm.phone}
                        onChange={(e) => setHeroForm({ ...heroForm, phone: e.target.value })}
                        placeholder="Enter mobile number"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B2A6B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Degree *</label>
                        <select 
                          required
                          value={heroForm.degree}
                          onChange={(e) => setHeroForm({ ...heroForm, degree: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] cursor-pointer"
                        >
                          <option value="">Select degree</option>
                          <option value="BCA">BCA</option>
                          <option value="B.Tech">B.Tech / B.E</option>
                          <option value="MCA">MCA</option>
                          <option value="B.Sc">B.Sc / M.Sc</option>
                          <option value="BBA">BBA / MBA</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Graduation Year *</label>
                        <select 
                          required
                          value={heroForm.graduation_year}
                          onChange={(e) => setHeroForm({ ...heroForm, graduation_year: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] cursor-pointer"
                        >
                          <option value="">Select year</option>
                          <option value="Pursuing">Currently Pursuing</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="Other">Earlier</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Message (Optional)</label>
                      <textarea 
                        rows={2}
                        value={heroForm.message}
                        onChange={(e) => setHeroForm({ ...heroForm, message: e.target.value })}
                        placeholder="Tell us why you're interested..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1B2A6B] resize-none"
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmittingHeroForm}
                      className="w-full h-12 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg gap-2 mt-2"
                    >
                      {isSubmittingHeroForm ? "Submitting..." : "Apply Now"}
                    </Button>

                    <p className="text-[10px] text-center text-slate-400 font-semibold mt-2">
                      By continuing to apply, you agree to our Terms & Privacy Policy.
                    </p>

                  </form>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: VIDEO TESTIMONIAL & STUDENT SHOWCASE
            ======================================================== */}
        <div className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-6xl">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#1B2A6B]/10 text-[#1B2A6B] inline-block mb-3">
                Student Testimonials
              </span>
              <h2 className="text-3xl font-black text-[#0d1635]">Watch How Our Learners Excel</h2>
              <p className="text-xs text-slate-500 font-semibold mt-2">Real feedback from students who transformed their technical skills into corporate placements.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Video Thumbnail & Player Box */}
              <div className="md:col-span-6 relative rounded-2xl overflow-hidden group shadow-lg aspect-video bg-slate-900 border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                  alt="Student Video Testimonial" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Play Button Overlay */}
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#C9A227] hover:bg-[#1B2A6B] text-slate-950 hover:text-white transition-all duration-300 flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110"
                >
                  <Play size={28} className="fill-current ml-1" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-amber-300">Success Story</span>
                  <h4 className="text-sm font-bold mt-1">Blueboxx Industrial Internship Overview</h4>
                </div>
              </div>

              {/* Right Testimonial Quote */}
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={18} className="fill-current" />
                  <Star size={18} className="fill-current" />
                  <Star size={18} className="fill-current" />
                  <Star size={18} className="fill-current" />
                  <Star size={18} className="fill-current" />
                </div>
                
                <blockquote className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed italic">
                  “The course was very well structured, comprehensive, and gave me the flexibility of learning at my own pace. I was able to build real-world projects, attend mock viva sessions, and clear interviews confidently!”
                </blockquote>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1B2A6B] text-white font-bold flex items-center justify-center text-sm shadow-md">
                    DT
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-[#0d1635]">Disha Thakkar</h5>
                    <p className="text-[11px] font-bold text-slate-500">Software UI Designer</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {isVideoModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            >
              <div className="bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border border-slate-800">
                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="aspect-video w-full">
                  <video 
                    controls 
                    autoPlay 
                    className="w-full h-full object-cover"
                    src="/api/video"
                  >
                    <source src="/api/video" type="video/mp4" />
                    <source src="/uploads/Internship.mp4" type="video/mp4" />
                    <source src="https://blueboxx.in/public/uploads/Internship.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            SECTION 3: FILTERABLE LIVE PROJECTS & INTERNSHIPS GRID
            ======================================================== */}
        <div className="py-16 min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f8faff 0%, #fafafa 40%, #fffdf5 100%)" }}>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">

            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-black text-[#0d1635]">Live Projects & Opportunities</h2>
              <p className="text-xs text-slate-500 font-semibold mt-2">Filter opportunities by role, duration, work mode, and stipend structure.</p>
            </div>

            {/* Multi-Field Search Container (Site Theme) */}
            <div className="bg-white p-3 rounded-2xl md:rounded-full shadow-xl border border-slate-200 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2 text-slate-800 mb-10">
              <div className="md:col-span-4 flex items-center px-4 py-2 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none border-b md:border-b-0 md:border-r border-slate-200">
                <Search size={18} className="text-[#1B2A6B] mr-3 shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Role, skill, or company..."
                  className="w-full text-xs md:text-sm font-semibold bg-transparent focus:outline-none placeholder-slate-400"
                />
              </div>

              <div className="md:col-span-3 flex items-center px-4 py-2 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none border-b md:border-b-0 md:border-r border-slate-200">
                <Briefcase size={18} className="text-[#C9A227] mr-3 shrink-0" />
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs md:text-sm font-semibold bg-transparent focus:outline-none text-slate-700 cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering / Web</option>
                  <option value="Design">UI/UX & Product Design</option>
                  <option value="Data Science">Data Analytics</option>
                  <option value="Marketing">Digital Marketing</option>
                </select>
              </div>

              <div className="md:col-span-3 flex items-center px-4 py-2 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none border-b md:border-b-0 md:border-r border-slate-200">
                <MapPin size={18} className="text-[#1B2A6B] mr-3 shrink-0" />
                <input 
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Location (e.g. Remote, Vadodara)..."
                  className="w-full text-xs md:text-sm font-semibold bg-transparent focus:outline-none placeholder-slate-400"
                />
              </div>

              <div className="md:col-span-2 flex items-center px-1">
                <Button 
                  onClick={() => setCurrentPage(1)}
                  className="w-full h-11 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold rounded-xl md:rounded-full text-xs uppercase tracking-wider shadow-md gap-1 px-2"
                >
                  <Search size={14} /> Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden col-span-1">
                <Button 
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} 
                  variant="outline" 
                  className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-xs h-12 rounded-xl gap-2 font-extrabold text-sm uppercase tracking-wider"
                >
                  <Filter size={16} /> Filters
                </Button>
              </div>

              {/* Sidebar Filter */}
              <div className={`lg:col-span-1 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
                <SidebarFilter type="internships" onFilterChange={setActiveFilters} />
              </div>

              {/* Listings */}
              <main className="lg:col-span-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-extrabold text-slate-800 text-base md:text-lg">
                    Showing <span className="text-[#1B2A6B]">{totalInternships}</span> Open Positions
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sort:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 px-3 py-1.5 focus:ring-[#1B2A6B] focus:border-[#1B2A6B] cursor-pointer outline-none shadow-xs"
                    >
                      <option value="latest">Latest First</option>
                      <option value="salary_high">Highest Stipend</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="py-20 text-center flex justify-center">
                    <Loader2 className="animate-spin text-[#1B2A6B] w-10 h-10" />
                  </div>
                ) : internships.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {internships.map((internship) => (
                        <Card 
                          key={internship.id} 
                          className="group relative overflow-hidden bg-white border border-slate-200/90 hover:border-[#1B2A6B]/40 hover:shadow-[0_12px_35px_rgba(27,42,107,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-[1.25rem]"
                        >
                          <CardContent className="p-5 flex-1 flex flex-col relative z-10">
                            
                            {/* Card Top Row */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 shadow-xs shrink-0 overflow-hidden flex items-center justify-center font-black text-[#1B2A6B] text-lg">
                                {internship.company_logo ? (
                                  <img src={internship.company_logo} alt={internship.company_name} className="w-full h-full object-cover" />
                                ) : (
                                  (internship.company_name?.[0] || 'B')
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  internship.type === 'Remote' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                                  internship.type === 'Hybrid' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                                  'bg-blue-50 border border-blue-200 text-blue-700'
                                }`}>
                                  {internship.type || 'Remote'}
                                </span>

                                <button
                                  onClick={(e) => toggleSave(e, internship.id)}
                                  disabled={saving === internship.id}
                                  title={savedIds.has(internship.id) ? "Remove from saved" : "Save this internship"}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    savedIds.has(internship.id) 
                                      ? "bg-amber-50 border-amber-200 text-[#C9A227]" 
                                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={savedIds.has(internship.id) ? "#C9A227" : "none"} stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                                </button>
                              </div>
                            </div>

                            {/* Title & Company */}
                            <h3 className="text-base font-extrabold text-[#0d1635] mb-1 group-hover:text-[#1B2A6B] transition-colors leading-snug line-clamp-2">
                              {internship.title}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1">
                              <Building size={13} className="text-[#C9A227]" /> {internship.company_name} • <MapPin size={13} /> {internship.location}
                            </p>

                            {/* Meta row */}
                            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="flex items-center gap-1">
                                <Clock size={12} className="text-[#1B2A6B]" /> {internship.duration}
                              </span>
                              <span>•</span>
                              <span className="text-slate-600 font-bold">
                                {internship.department || 'Track'}
                              </span>
                            </div>

                            {/* Stipend Display Box (Site Theme) */}
                            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-3 rounded-xl border border-blue-100/80 mb-5">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Monthly Stipend</p>
                              <p className="text-sm font-black text-emerald-600">
                                {internship.stipend_text || (internship.stipend > 0 ? `₹${Number(internship.stipend).toLocaleString('en-IN')} / month` : 'Performance Based')}
                              </p>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                {internship.posted_at || 'RECENT'}
                              </span>

                              <Button 
                                onClick={() => handleOpenApply(internship)}
                                disabled={internship.has_applied}
                                className={`h-9 px-4 text-xs font-black rounded-xl transition-all shadow-xs gap-1 ${
                                  internship.has_applied 
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                    : "bg-[#1B2A6B] hover:bg-[#0d1635] text-white"
                                }`}
                              >
                                {internship.has_applied ? (
                                  <><CheckCircle2 size={13} /> Applied</>
                                ) : (
                                  <>Apply Now <ArrowRight size={13} /></>
                                )}
                              </Button>
                            </div>

                          </CardContent>
                        </Card>
                      ))}
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
                  <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <Briefcase size={36} className="text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No internships found</h3>
                    <p className="text-xs text-slate-500 font-medium">Try clearing your filters or searching for different keywords.</p>
                  </div>
                )}
              </main>

            </div>
          </div>
        </div>

        <PartnersSection 
          titlePrefix="Companies Hiring " 
          highlightText="Top Talent" 
          subtitle="We are proud to work with leading corporate hiring partners and clients worldwide" 
        />

        {/* Application Modal */}
        <ApplyModal 
          internship={selectedInternshipForApply}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            mutate("/public/internships");
          }}
        />
      </MainLayout>
    </>
  );
}
