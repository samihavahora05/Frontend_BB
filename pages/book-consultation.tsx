import { MainLayout } from "../src/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Video, User, CheckCircle2, ChevronRight, ChevronLeft, 
  GraduationCap, Star, Building2, Sparkles, Search, Check, AlertCircle, RefreshCw,
  ChevronDown, X, Briefcase, Award
} from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { Input } from "../src/components/ui/Input";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import api from "../src/lib/axios";
import { SEO } from "../src/components/seo/SEO";
import { ExpertService, ExpertData } from "../src/lib/api/ExpertService";
import { getImageUrl } from "../src/lib/imageUtils";

const bookingSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number" }),
  courseInterest: z.string().min(1, { message: "Please select a course or topic" }),
  notes: z.string().optional(),
});
type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookConsultationPage() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("2:00 PM");

  // Real Experts State from Database
  const [experts, setExperts] = useState<ExpertData[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string | number | "any">("any");
  const [expertSearch, setExpertSearch] = useState("");
  const [isLoadingExperts, setIsLoadingExperts] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load real experts dynamically from database
  const loadLiveExperts = async () => {
    setIsLoadingExperts(true);
    try {
      const data = await ExpertService.getAll();
      setExperts(data || []);
    } catch {
      const fresh = ExpertService.getLocalExperts();
      setExperts(fresh || []);
    } finally {
      setIsLoadingExperts(false);
    }
  };

  useEffect(() => {
    loadLiveExperts();

    // Live sync whenever new experts are added, imported, or updated
    const handleSync = () => {
      loadLiveExperts();
    };
    window.addEventListener('bb_experts_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('bb_experts_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Preselect expert from query param if provided (e.g. ?expertId=101 or ?expert=Rajesh)
  useEffect(() => {
    if (router.isReady && experts.length > 0) {
      const qId = router.query.expertId || router.query.expert || router.query.slug;
      if (qId) {
        const found = experts.find(
          e => String(e.id) === String(qId) || 
               String(e.user_id) === String(qId) || 
               e.name.toLowerCase().includes(String(qId).toLowerCase())
        );
        if (found) {
          setSelectedExpertId(found.id);
        }
      }
    }
  }, [router.isReady, router.query, experts]);

  const selectedExpert = useMemo(() => {
    if (selectedExpertId === "any") return null;
    return experts.find(e => String(e.id) === String(selectedExpertId) || String(e.user_id) === String(selectedExpertId)) || null;
  }, [selectedExpertId, experts]);

  const filteredExperts = useMemo(() => {
    if (!expertSearch.trim()) return experts;
    const q = expertSearch.toLowerCase().trim();
    return experts.filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.company.toLowerCase().includes(q) ||
      e.specialization.toLowerCase().includes(q)
    );
  }, [experts, expertSearch]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      courseInterest: "Full Stack Web Development"
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    const expertName = selectedExpert ? selectedExpert.name : "Senior Career Expert";
    const expertDesignation = selectedExpert ? `${selectedExpert.designation} (${selectedExpert.company})` : "General Career Consultant";
    const dateStr = selectedDate.toISOString().split('T')[0];

    try {
      // 1. Submit consultation request to CRM / Contact API
      await api.post("/public/contact", {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        subject: `1:1 Consultation with ${expertName}`,
        message: `Assigned Expert: ${expertName} [ID: ${selectedExpert ? selectedExpert.id : 'General'}]\nExpert Designation: ${expertDesignation}\nCourse/Interest: ${data.courseInterest}\nDate: ${dateStr}\nTime Slot: ${selectedTime}\nNotes: ${data.notes || 'None'}`,
        source_page: "/book-consultation"
      });

      // 2. Also record in consultations table if available
      try {
        await api.post("/consultations", {
          student_name: data.fullName,
          student_email: data.email,
          student_phone: data.phone,
          expert_id: selectedExpert ? selectedExpert.id : null,
          expert_name: expertName,
          booking_date: dateStr,
          booking_time: selectedTime,
          course_interest: data.courseInterest,
          status: 'Confirmed'
        });
      } catch {}

      toast.success(`Consultation booked successfully with ${expertName} for ${selectedDate.toDateString()} at ${selectedTime}! Meeting details sent to ${data.email}.`);
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book consultation. Please try again.");
    }
  };

  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); 
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // 0 for Monday

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const currentMonthName = monthNames[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  const getInitials = (name?: string) => {
    const displayName = (name || 'Expert').trim();
    const parts = displayName.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return displayName.slice(0, 2).toUpperCase();
  };

  return (
    <MainLayout>
      <SEO 
        title="Book a Free Career Consultation | Blueboxx DA" 
        description="Book a free 1:1 career consultation session with real verified industry experts at Blueboxx DA. Get a personalized roadmap for your career." 
      />
      <div className="bg-[#0d1635] min-h-screen pt-24 pb-20 relative overflow-hidden text-white">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Left Side: Value Proposition & Active Expert Display */}
            <div className="w-full lg:w-5/12 lg:pt-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#C9A227] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles size={14} /> Free 1:1 Session
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight font-sora">
                  Let's map out your <span className="text-[#C9A227]">Dream Career.</span>
                </h1>
                <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-8 font-medium">
                  Not sure which course or specialization is right for you? Book a free 30-minute consultation with our verified industry mentors to get a personalized career roadmap.
                </p>

                {/* Currently Selected Expert Badge */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Consultation Mentor
                  </span>
                  {selectedExpert ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-[#1B2A6B] overflow-hidden flex items-center justify-center text-white font-black text-sm shrink-0 border border-white/20 shadow-md">
                        {selectedExpert.avatar || selectedExpert.profile_photo ? (
                          <img 
                            src={getImageUrl(selectedExpert.avatar || selectedExpert.profile_photo)} 
                            alt={selectedExpert.name}
                            className="w-full h-full object-cover"
                            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span>{getInitials(selectedExpert.name)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-base flex items-center gap-1.5 truncate">
                          {selectedExpert.name}
                          <CheckCircle2 size={16} className="text-[#C9A227] shrink-0" />
                        </h4>
                        <p className="text-xs text-slate-300 font-medium truncate">{selectedExpert.designation} • {selectedExpert.company}</p>
                        <p className="text-[11px] text-[#C9A227] font-semibold mt-0.5 truncate">{selectedExpert.specialization}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center shrink-0">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">Senior Career Expert</h4>
                        <p className="text-xs text-slate-300 font-medium">Automatic matching with top available industry mentor</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {[
                    { title: "Personalized Roadmap", desc: "Get a step-by-step guide tailored to your background and career goals." },
                    { title: "Course Recommendations", desc: "Find exactly which skills you need to learn to crack product companies." },
                    { title: "Placement Clarity", desc: "Understand our placement process, partner companies, and guarantee terms." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/80 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={20} className="text-[#C9A227]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-0.5">{item.title}</h3>
                        <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </div>

            {/* Right Side: Expert Selector Dropdown, Calendar & Form */}
            <div className="w-full lg:w-7/12">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Card className="shadow-2xl shadow-black/60 border border-white/10 overflow-visible text-slate-900 bg-white rounded-3xl">
                  
                  {/* Step 1 Header: Choose Real Expert with Dropdown */}
                  <div className="bg-slate-50 border-b border-slate-100 p-6 relative rounded-t-3xl" ref={dropdownRef}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 font-sora flex items-center gap-2">
                          1. Select Career Expert
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1B2A6B]">
                            {experts.length} available
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          Select a verified mentor from the dropdown list or choose instant matching
                        </p>
                      </div>
                    </div>

                    {/* PROPER DROPDOWN SELECTOR */}
                    <div className="relative">
                      {/* Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full p-3.5 bg-white rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer shadow-sm ${
                          isDropdownOpen 
                            ? "border-[#1B2A6B] ring-4 ring-[#1B2A6B]/10 shadow-md" 
                            : "border-slate-200 hover:border-[#1B2A6B]/50 hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                          {selectedExpert ? (
                            <>
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-[#1B2A6B] overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0 border border-slate-200 shadow-xs">
                                {selectedExpert.avatar || selectedExpert.profile_photo ? (
                                  <img 
                                    src={getImageUrl(selectedExpert.avatar || selectedExpert.profile_photo)} 
                                    alt={selectedExpert.name}
                                    className="w-full h-full object-cover"
                                    onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                ) : (
                                  <span>{getInitials(selectedExpert.name)}</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900 truncate">
                                    {selectedExpert.name}
                                  </span>
                                  <CheckCircle2 size={15} className="text-[#C9A227] shrink-0" />
                                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5 shrink-0">
                                    <Star size={10} className="fill-amber-400 text-amber-400" /> {selectedExpert.average_rating || '5.0'}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                  {selectedExpert.designation} • <span className="text-slate-700 font-semibold">{selectedExpert.company}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] text-[#C9A227] flex items-center justify-center shrink-0 shadow-xs">
                                <GraduationCap size={22} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900">
                                    Any Available Mentor
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    Instant Matching
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                  System will match you with the best available top verified industry expert
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                          <ChevronDown 
                            size={18} 
                            className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#1B2A6B]" : ""}`} 
                          />
                        </div>
                      </button>

                      {/* Dropdown Menu Popover */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden"
                          >
                            {/* Search Box in Dropdown */}
                            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                              <Search size={15} className="text-slate-400 shrink-0 ml-1" />
                              <input
                                type="text"
                                placeholder="Search by mentor name, company, or specialization..."
                                value={expertSearch}
                                onChange={(e) => setExpertSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                                className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                              />
                              {expertSearch && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setExpertSearch(""); }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>

                            {/* Dropdown Options List */}
                            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                              
                              {/* Option: Any Available Mentor */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedExpertId("any");
                                  setIsDropdownOpen(false);
                                  setExpertSearch("");
                                }}
                                className={`w-full p-3 px-4 flex items-center justify-between text-left transition-colors cursor-pointer ${
                                  selectedExpertId === "any" 
                                    ? "bg-blue-50/70 text-[#1B2A6B]" 
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    selectedExpertId === "any" 
                                      ? "bg-[#1B2A6B] text-[#C9A227]" 
                                      : "bg-slate-100 text-slate-600"
                                  }`}>
                                    <GraduationCap size={18} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                                      Any Available Mentor
                                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Instant Match
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                                      Fastest confirmation with verified industry mentor
                                    </div>
                                  </div>
                                </div>
                                {selectedExpertId === "any" && (
                                  <Check size={16} className="text-[#1B2A6B] font-bold shrink-0 ml-2" />
                                )}
                              </button>

                              {/* Real Verified Experts */}
                              {filteredExperts.length > 0 ? (
                                filteredExperts.map((exp) => {
                                  const isSelected = String(selectedExpertId) === String(exp.id) || String(selectedExpertId) === String(exp.user_id);
                                  const avatarUrl = getImageUrl(exp.avatar || exp.profile_photo);

                                  return (
                                    <button
                                      key={exp.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedExpertId(exp.id);
                                        setIsDropdownOpen(false);
                                        setExpertSearch("");
                                      }}
                                      className={`w-full p-3 px-4 flex items-center justify-between text-left transition-colors cursor-pointer ${
                                        isSelected 
                                          ? "bg-blue-50/70 text-[#1B2A6B]" 
                                          : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center text-slate-800 font-bold text-xs shrink-0 border border-slate-300">
                                          {avatarUrl ? (
                                            <img 
                                              src={avatarUrl} 
                                              alt={exp.name} 
                                              className="w-full h-full object-cover" 
                                              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                          ) : (
                                            <span>{getInitials(exp.name)}</span>
                                          )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-xs text-slate-900 truncate">
                                              {exp.name}
                                            </span>
                                            <CheckCircle2 size={13} className="text-[#C9A227] shrink-0" />
                                            <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5 shrink-0">
                                              <Star size={9} className="fill-amber-400 text-amber-400" /> {exp.average_rating || '5.0'}
                                            </span>
                                          </div>
                                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                            {exp.designation} {exp.company ? `• ${exp.company}` : ''}
                                          </div>
                                          {exp.specialization && (
                                            <div className="text-[10px] text-indigo-600 font-semibold truncate mt-0.5">
                                              {exp.specialization}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {isSelected && (
                                        <Check size={16} className="text-[#1B2A6B] font-bold shrink-0" />
                                      )}
                                    </button>
                                  );
                                })
                              ) : (
                                <div className="p-6 text-center text-slate-500">
                                  <p className="text-xs font-semibold">No mentors found matching "{expertSearch}"</p>
                                  <p className="text-[11px] text-slate-400 mt-1">Try searching with a different name or skill</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Step 2: Calendar & Time Slots */}
                  <div className="bg-slate-50/50 border-b border-slate-100 p-4 px-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 font-sora">
                        2. Select Date & Time Slot
                      </h2>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1.5"><Video size={13} className="text-[#1B2A6B]"/> 1:1 Live Video Call</span>
                        <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#1B2A6B]"/> 30 Mins Duration</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" onClick={prevMonth} variant="outline" size="icon" className="w-8 h-8 rounded-lg"><ChevronLeft size={16}/></Button>
                      <Button type="button" onClick={nextMonth} variant="outline" size="icon" className="w-8 h-8 rounded-lg"><ChevronRight size={16}/></Button>
                    </div>
                  </div>

                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row border-b border-slate-100">
                      
                      {/* Calendar UI */}
                      <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-100">
                        <h3 className="font-bold text-slate-800 text-center mb-4 text-xs uppercase tracking-wider">{currentMonthName} {currentYear}</h3>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                            <div key={d} className="text-[11px] font-bold text-slate-400">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {[...Array(startDayOffset)].map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const isToday = dateObj.toDateString() === today.toDateString();
                            const isSelected = selectedDate.toDateString() === dateObj.toDateString();
                            const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                            return (
                              <button 
                                key={i} 
                                type="button"
                                onClick={() => setSelectedDate(dateObj)}
                                disabled={isPast}
                                className={`w-8 h-8 mx-auto rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                                  isSelected ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20 scale-105" : 
                                  isToday ? "border border-[#1B2A6B] text-[#1B2A6B] font-black" : 
                                  isPast ? "text-slate-300 cursor-not-allowed" : 
                                  "text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="w-full md:w-1/2 p-6 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-center mb-4 text-xs uppercase tracking-wider">
                          {dayNames[selectedDate.getDay()]}, {shortMonthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
                        </h3>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                          {timeSlots.map((time, i) => (
                            <button 
                              key={i} 
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                                selectedTime === time 
                                  ? "bg-[#1B2A6B] border-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20" 
                                  : "bg-white border-slate-200 text-slate-700 hover:border-[#1B2A6B]/50 hover:bg-blue-50"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Step 3: Candidate Details Form */}
                    <div className="p-6">
                      <h2 className="text-base font-bold text-slate-900 font-sora mb-4">
                        3. Your Information & Career Goal
                      </h2>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                            <Input 
                              placeholder="e.g. Rahul Sharma" 
                              {...register("fullName")}
                              className="bg-slate-50 border-slate-200 text-xs rounded-xl focus:bg-white"
                            />
                            {errors.fullName && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.fullName.message}</p>}
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                            <Input 
                              type="email" 
                              placeholder="e.g. rahul@example.com" 
                              {...register("email")}
                              className="bg-slate-50 border-slate-200 text-xs rounded-xl focus:bg-white"
                            />
                            {errors.email && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.email.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number (WhatsApp) *</label>
                            <Input 
                              placeholder="e.g. 9876543210" 
                              {...register("phone")}
                              className="bg-slate-50 border-slate-200 text-xs rounded-xl focus:bg-white"
                            />
                            {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.phone.message}</p>}
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Domain of Interest *</label>
                            <select 
                              {...register("courseInterest")}
                              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:bg-white"
                            >
                              <option value="Full Stack Web Development">Full Stack Web Development</option>
                              <option value="Data Science & AI/ML">Data Science & AI / ML</option>
                              <option value="UI/UX & Graphic Design">UI/UX & Graphic Design</option>
                              <option value="Digital Marketing & SEO">Digital Marketing & SEO</option>
                              <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                              <option value="Internship & Placement Drive">Internship & Placement Drive</option>
                            </select>
                            {errors.courseInterest && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.courseInterest.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Specific Questions or Background (Optional)</label>
                          <textarea 
                            rows={2} 
                            placeholder="Tell us about your current college, year, or specific questions you'd like to ask the mentor..."
                            {...register("notes")}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1B2A6B] focus:bg-white"
                          />
                        </div>

                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-6 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-sm rounded-2xl shadow-xl shadow-[#1B2A6B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <RefreshCw size={18} className="animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 size={18} className="text-[#C9A227]" />
                                <span>Confirm Free Consultation with {selectedExpert ? selectedExpert.name : "Senior Expert"}</span>
                              </>
                            )}
                          </Button>
                          <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">
                            100% Free • No Credit Card Required • Google Meet link sent on email
                          </p>
                        </div>
                      </form>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}