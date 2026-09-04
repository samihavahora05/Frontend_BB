import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../src/layout/MainLayout";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent } from "../../src/components/ui/Card";
import { Star, Clock, Video, FileText, ChevronRight, ChevronLeft, MapPin, CheckCircle2, Users, Share2, MessageSquare, Loader2, PlusCircle, X, Send } from "lucide-react";
import { useAuth } from "../../src/context/AuthContext";
import { getActiveToken } from "../../src/lib/authUtils";
import api from "../../src/lib/axios";
import { SEO } from "../../src/components/seo/SEO";
import toast from "react-hot-toast";
import { ExpertService } from "../../src/lib/api/ExpertService";
import { getImageUrl } from "../../src/lib/imageUtils";

export default function ExpertProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { id } = router.query;
  const [selectedService, setSelectedService] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const [expertRaw, setExpertRaw] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Real-time Dynamic Reviews State
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSessionTitle, setReviewSessionTitle] = useState("1:1 Mentorship Session");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const savedBooking = sessionStorage.getItem('pending_booking');
      if (savedBooking) {
        try {
          const parsed = JSON.parse(savedBooking);
          if (String(parsed.expertId) === String(id)) {
            if (parsed.serviceIndex !== undefined) setSelectedService(parsed.serviceIndex);
            if (parsed.selectedDate !== undefined) setSelectedDate(parsed.selectedDate);
            if (parsed.selectedTime !== undefined) setSelectedTime(parsed.selectedTime);
          }
        } catch (e) {
          console.error(e);
        }
        sessionStorage.removeItem('pending_booking');
      }
    }
  }, [id]);

  useEffect(() => {
    if (!router.isReady || !id) return;
    const rawId = Array.isArray(id) ? id[0] : id;
    if (!rawId || rawId === "undefined" || rawId === "[id]") return;
    const cleanId = String(rawId).replace(/\/$/, '').trim();
    if (!cleanId || cleanId === "undefined") return;

    const fetchExpert = async () => {
      try {
        setIsLoading(true);
        setLoadError(false);

        const expertData = await ExpertService.fetchExpertById(cleanId);
        if (expertData) {
          setExpertRaw(expertData);
        } else {
          setLoadError(true);
        }
      } catch (error) {
        console.error("Failed to fetch expert details", error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpert();

    const handleSync = () => {
      fetchExpert();
    };
    window.addEventListener("bb_experts_updated", handleSync);
    window.addEventListener("bb_expert_avatar_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("bb_experts_updated", handleSync);
      window.removeEventListener("bb_expert_avatar_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [router.isReady, id]);

  // Load Real Reviews dynamically from Backend Database API
  useEffect(() => {
    if (!id) return;
    const cleanId = String(Array.isArray(id) ? id[0] : id).replace(/\/$/, '').trim();
    if (!cleanId || cleanId === "undefined") return;

    const loadReviews = async () => {
      try {
        const res = await api.get(`/public/experts/${cleanId}/reviews`);
        if (res.data?.success && Array.isArray(res.data.data)) {
          setReviewsList(res.data.data);
          return;
        }
      } catch (err) {
        // Fallback to reviews array embedded in expert object if endpoint is single show
        if (expertRaw?.reviews_list && Array.isArray(expertRaw.reviews_list)) {
          setReviewsList(expertRaw.reviews_list);
          return;
        }
      }

      if (expertRaw?.reviews_list && Array.isArray(expertRaw.reviews_list)) {
        setReviewsList(expertRaw.reviews_list);
      }
    };

    loadReviews();
  }, [id, expertRaw]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to submit a review.");
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a review comment.");
      return;
    }

    const cleanId = String(Array.isArray(id) ? id[0] : id).replace(/\/$/, '').trim();
    setIsSubmittingReview(true);

    try {
      const res = await api.post(`/public/experts/${cleanId}/reviews`, {
        rating: reviewRating,
        review_text: reviewComment.trim(),
        session_title: reviewSessionTitle,
      });

      if (res.data?.data) {
        setReviewsList(prev => [res.data.data, ...prev]);
      } else {
        // Refresh reviews list from server
        const refreshed = await api.get(`/public/experts/${cleanId}/reviews`);
        if (refreshed.data?.success && Array.isArray(refreshed.data.data)) {
          setReviewsList(refreshed.data.data);
        }
      }

      toast.success(res.data?.message || "Thank you! Your review has been saved successfully.");
      setReviewComment("");
      setReviewRating(5);
      setIsReviewModalOpen(false);
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      toast.error(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const expert = expertRaw ? {
    id: expertRaw.id,
    name: expertRaw.name || (expertRaw.user ? `${expertRaw.user.first_name || ''} ${expertRaw.user.last_name || ''}`.trim() : '') || "Expert",
    role: expertRaw.designation || "Expert",
    company: expertRaw.company || "Independent",
    location: expertRaw.location || "Online",
    rating: Number(expertRaw.average_rating || expertRaw.rating || 5.0).toFixed(1),
    reviews: expertRaw.total_reviews || expertRaw.reviews_count || 0,
    sessionsCount: expertRaw.sessions_count || expertRaw.total_sessions || 0,
    about: expertRaw.bio || expertRaw.about || expertRaw.description || (expertRaw.specialization ? `Specialist in ${expertRaw.specialization}.` : "Industry expert available for 1:1 mentorship."),
    expertise: expertRaw.specialization 
      ? (Array.isArray(expertRaw.specialization) ? expertRaw.specialization : String(expertRaw.specialization).split(',').map((s: string) => s.trim())) 
      : ["Career Mentorship"],
    avatar: getImageUrl(expertRaw.avatar || expertRaw.profile_photo),
    sessions: expertRaw.sessions || []
  } : {
    id: "",
    name: "Expert",
    role: "Expert",
    company: "Independent",
    location: "Online",
    rating: "5.0",
    reviews: 0,
    sessionsCount: 0,
    about: "Expert profile loading...",
    expertise: [],
    avatar: "",
    sessions: []
  };

  const baseRate = Number(expertRaw?.hourly_rate) || 500;
  const services = expert.sessions && expert.sessions.length > 0 
    ? expert.sessions.map((s: any) => ({
        id: s.id,
        title: s.title,
        duration: `${s.duration_minutes} mins`,
        price: `₹${s.price}`,
        icon: Video,
        description: s.description || ""
      }))
    : [
        { id: 1, title: "1:1 Career Guidance", duration: "30 mins", price: `₹${Math.round(baseRate * 0.6)}`, icon: Video, description: "Get personalized advice on your career path, tech stack choices, or general mentorship." },
        { id: 2, title: "Mock Technical Interview", duration: "60 mins", price: `₹${baseRate}`, icon: MessageSquare, description: "A complete DSA, System Design, or domain mock interview followed by detailed feedback." },
        { id: 3, title: "Resume & Portfolio Review", duration: "45 mins", price: `₹${Math.round(baseRate * 0.8)}`, icon: FileText, description: "I'll review your resume line-by-line and help you optimize it for ATS and recruiters." }
      ];

  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

  const today = new Date();
  const baseStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (currentWeekOffset * 5));

  const dates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(baseStartDate.getFullYear(), baseStartDate.getMonth(), baseStartDate.getDate() + i);
    const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateNum = d.getDate();
    const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSunday = d.getDay() === 0;
    return {
      day: dayStr,
      date: dateNum,
      available: !isPast && !isSunday,
      fullDate: d
    };
  });

  const monthYearHeader = baseStartDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(prev => prev - 1);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const timeslots = [
    "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM", "07:30 PM"
  ];

  return (
    <>
      <SEO 
        title={expert.name !== "Loading..." ? `Book a Session with ${expert.name} - ${expert.role} | Blueboxx DA` : "Expert Profile | Blueboxx DA"}
        description={expert.about !== "Expert profile loading..." ? expert.about.substring(0, 160) : "Book a 1:1 mentorship session on Blueboxx DA."}
      />
      <MainLayout>
        <div className="bg-slate-50 min-h-screen pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column (Profile Details) */}
            <div className="flex-1 lg:max-w-3xl space-y-8">
              
              {isLoading ? (
                <div className="flex justify-center py-32"><Loader2 className="animate-spin w-12 h-12 text-[#1B2A6B]" /></div>
              ) : loadError || !expertRaw ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Expert profile could not be loaded.</h2>
                  <p className="text-sm text-slate-500 mb-4">This profile may be unavailable right now. Please try again later.</p>
                  <Button variant="outline" onClick={() => router.push('/experts')}>Browse All Experts</Button>
                </div>
              ) : (
                <>
              
              {/* Profile Header Card */}
              <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#0d1635] to-[#1B2A6B]"></div>
                <CardContent className="px-8 pb-8 pt-0 relative">
                  <div className="flex flex-col md:flex-row gap-6 md:items-end mb-6">
                    <div className="w-28 h-28 bg-white rounded-2xl p-1.5 shadow-md border border-slate-100 shrink-0 relative z-10 -mt-12">
                      <img src={getImageUrl(expert.avatar)} alt={expert.name} className="w-full h-full rounded-xl object-cover" />
                      <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    
                    <div className="flex-1 mt-4 md:mt-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800">{expert.name}</h1>
                        <CheckCircle2 size={20} className="text-[#1B2A6B] fill-blue-50" />
                      </div>
                      <p className="text-[15px] font-bold text-slate-600 mb-2">{expert.role} at <span className="text-[#1B2A6B]">{expert.company}</span></p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {expert.location}</span>
                        <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                          <Star size={14} className="fill-amber-500"/> {reviewsList.length > 0 ? (reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewsList.length).toFixed(1) : expert.rating} ({reviewsList.length > 0 ? reviewsList.length : expert.reviews} Reviews)
                        </span>
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-400"/> {expert.sessionsCount} Sessions</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          const btn = document.getElementById('share-btn');
                          if (btn) {
                            btn.innerHTML = 'Copied!';
                            setTimeout(() => btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2"><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>', 2000);
                          }
                        }}
                        className="w-auto px-3 h-10 p-0 rounded-xl border-slate-200 text-slate-400 hover:text-[#1B2A6B] shrink-0 font-bold text-xs"
                      >
                        <span id="share-btn" className="flex items-center"><Share2 size={16} /></span>
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h2 className="text-lg font-black text-slate-800 mb-3">About Me</h2>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                      {expert.about}
                    </p>

                    <h3 className="text-sm font-extrabold text-slate-800 mb-3">Top Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.expertise.map((skill: string) => (
                        <span key={skill} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Real-time Reviews Section */}
              <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Star size={24} className="text-[#C9A227] fill-[#C9A227]" /> 
                        {reviewsList.length > 0 ? (reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewsList.length).toFixed(1) : expert.rating} Rating 
                        <span className="text-sm font-semibold text-slate-500 ml-1">
                          ({reviewsList.length > 0 ? reviewsList.length : expert.reviews} {reviewsList.length === 1 ? 'Review' : 'Reviews'})
                        </span>
                      </h2>
                      <p className="text-xs font-semibold text-slate-400 mt-1">Verified reviews and feedback from students</p>
                    </div>

                    <Button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle size={15} /> Write a Review
                    </Button>
                  </div>

                  {reviewsList.length === 0 ? (
                    <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                        <Star size={22} className="fill-amber-400 text-amber-400" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mb-1">No reviews yet</h3>
                      <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto mb-4">
                        Be the first student to book a session and share your experience with {expert.name}.
                      </p>
                      <Button
                        onClick={() => setIsReviewModalOpen(true)}
                        variant="outline"
                        className="border-slate-200 text-[#1B2A6B] hover:bg-white text-xs font-bold rounded-xl"
                      >
                        Leave First Review
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {(showAllReviews ? reviewsList : reviewsList.slice(0, 3)).map((rev: any, idx: number) => {
                        const studentName = rev.student_name || rev.student?.name || (rev.student ? `${rev.student.first_name || ''} ${rev.student.last_name || ''}`.trim() : '') || 'Verified Student';
                        const avatar = rev.student_avatar || rev.student?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=random`;
                        const reviewDate = rev.created_at || 'Recent';
                        const sessionType = rev.session_title || '1:1 Mentorship Session';
                        const rating = Number(rev.rating) || 5;

                        return (
                          <div key={rev.id || idx} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getImageUrl(avatar)}
                                  alt={studentName}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-xs"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=random`;
                                  }}
                                />
                                <div>
                                  <div className="text-sm font-black text-slate-800">{studentName}</div>
                                  <div className="text-[10px] font-bold text-slate-400">{reviewDate} • {sessionType}</div>
                                </div>
                              </div>
                              <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} size={13} className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              "{rev.review_text || rev.comment}"
                            </p>
                          </div>
                        );
                      })}

                      {reviewsList.length > 3 && (
                        <Button
                          variant="outline"
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          className="w-full mt-6 border-slate-200 text-[#1B2A6B] font-extrabold h-10 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                        >
                          {showAllReviews ? "Show Less Reviews" : `View All Reviews (${reviewsList.length})`}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              </>
              )}

            </div>

            {/* Right Column (Booking Widget) */}
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="sticky top-32 space-y-6">
                
                <Card className="bg-white border border-slate-100 shadow-[0_20px_40px_rgba(27,42,107,0.06)] rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-[#0d1635] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B2A6B] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <h2 className="text-lg font-black relative z-10">Book a Session</h2>
                    <p className="text-[11px] font-medium text-slate-300 relative z-10">Select a service and time to schedule your 1:1 call.</p>
                  </div>
                  
                  <CardContent className="p-6 space-y-8">
                    
                    {/* Step 1: Select Service */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center text-xs font-black">1</div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Select Service</h3>
                      </div>
                      
                      <div className="space-y-3">
                        {services.map((service: any, i: number) => (
                          <div 
                            key={service.id}
                            onClick={() => setSelectedService(i)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              selectedService === i 
                                ? "border-[#1B2A6B] bg-blue-50/50 shadow-sm" 
                                : "border-slate-100 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedService === i ? 'bg-[#1B2A6B] text-white' : 'bg-slate-50 text-slate-500'}`}>
                                <service.icon size={18} />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className={`font-black text-sm ${selectedService === i ? 'text-[#1B2A6B]' : 'text-slate-800'}`}>{service.title}</h4>
                                  <span className="font-black text-[#1B2A6B]">{service.price}</span>
                                </div>
                                <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-2">
                                  <Clock size={12}/> {service.duration}
                                </div>
                                {selectedService === i && (
                                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-200/50">
                                    {service.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Select Date & Time */}
                    <div className={selectedService !== null ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center text-xs font-black">2</div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Select Date & Time</h3>
                      </div>

                      <div className="mb-4 flex items-center justify-between text-sm font-black text-slate-800 px-2">
                        <span>{monthYearHeader}</span>
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={handlePrevWeek} 
                            disabled={currentWeekOffset <= 0}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Previous dates"
                          >
                            <ChevronLeft size={16}/>
                          </button>
                          <button 
                            type="button"
                            onClick={handleNextWeek} 
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Next dates"
                          >
                            <ChevronRight size={16}/>
                          </button>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mb-4">
                        {dates.map((d, i) => (
                          <div 
                            key={i}
                            onClick={() => d.available && setSelectedDate(i)}
                            className={`flex-1 min-w-[60px] p-2 rounded-xl text-center border-2 cursor-pointer transition-all ${
                              !d.available ? 'opacity-40 bg-slate-50 border-slate-100 cursor-not-allowed' :
                              selectedDate === i ? 'border-[#1B2A6B] bg-[#1B2A6B] text-white shadow-md' : 'border-slate-100 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${selectedDate === i ? 'text-blue-100' : 'text-slate-400'}`}>{d.day}</div>
                            <div className={`text-lg font-black ${selectedDate === i ? 'text-white' : 'text-slate-800'}`}>{d.date}</div>
                          </div>
                        ))}
                      </div>

                      {/* Times */}
                      {selectedDate !== null && (
                        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                          {timeslots.map((time, i) => (
                            <div 
                              key={i}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2.5 rounded-xl text-center text-xs font-black cursor-pointer border-2 transition-all ${
                                selectedTime === time 
                                  ? 'border-[#C9A227] bg-amber-50 text-[#1B2A6B]' 
                                  : 'border-slate-100 hover:border-[#1B2A6B] text-slate-600 hover:text-[#1B2A6B]'
                              }`}
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <div className="pt-6 border-t border-slate-100">
                      <Button 
                        disabled={selectedTime === null || isPaying}
                        onClick={async () => {
                          if (isPaying) return;
                          const service = services[selectedService];

                          const hasToken = typeof window !== 'undefined' && (isAuthenticated || !!getActiveToken());

                          if (!hasToken) {
                            sessionStorage.setItem('pending_booking', JSON.stringify({
                              expertId: id,
                              serviceIndex: selectedService,
                              selectedDate,
                              selectedTime
                            }));
                            toast.error("Please login to complete your session booking.");
                            router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
                            return;
                          }

                          setIsPaying(true);

                          try {
                            // Ensure Razorpay SDK is loaded
                            if (!window.Razorpay) {
                              await new Promise((resolve) => {
                                const script = document.createElement("script");
                                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                                script.onload = resolve;
                                document.body.appendChild(script);
                              });
                            }

                            const sessionId = service.id || 1;
                            const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(selectedDate || 1).padStart(2, '0')}`;

                            const { data: orderRes } = await api.post(`/public/experts/sessions/${sessionId}/book`, {
                              expert_id: expert.id,
                              expert_profile_id: expert.id,
                              booking_date: dateStr,
                              start_time: selectedTime || "10:00",
                              end_time: "11:00",
                              notes: `${service.title} with ${expert.name}`
                            });

                            if (!orderRes?.success || !orderRes?.razorpay_order_id) {
                              toast.error(orderRes?.message || "Failed to create Razorpay Order.");
                              setIsPaying(false);
                              return;
                            }

                            const bookingId = String(orderRes.data?.booking_id || orderRes.booking_id);
                            const orderId = orderRes.razorpay_order_id;
                            const keyId = orderRes.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

                            const options: any = {
                              key: keyId,
                              amount: (orderRes.amount || orderRes.data?.amount || service.price || 999) * 100, // in paise
                              currency: orderRes.currency || "INR",
                              name: "Blueboxx DA",
                              description: `${service.title} with ${expert.name}`,
                              order_id: orderId,
                              handler: async function (response: any) {
                                try {
                                  const verifyRes = await api.post(`/public/experts/bookings/${bookingId}/verify`, {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                  });

                                  if (verifyRes.data?.success) {
                                    sessionStorage.removeItem('pending_booking');
                                    toast.success("Mentorship session booked successfully!");
                                    router.push({
                                      pathname: '/payment-success',
                                      query: {
                                        order_id: response.razorpay_order_id,
                                        payment_id: response.razorpay_payment_id,
                                        amount: orderRes.amount || service.price || 999,
                                        service: service.title,
                                        expert: expert.name
                                      }
                                    });
                                  } else {
                                    toast.error(verifyRes.data?.message || "Payment verification failed.");
                                    router.push('/payment-failed');
                                  }
                                } catch (err: any) {
                                  console.error("Session verification error:", err);
                                  toast.error(err.response?.data?.message || "Payment verification failed.");
                                  router.push('/payment-failed');
                                } finally {
                                  setIsPaying(false);
                                }
                              },
                              prefill: {
                                name: user?.name || user?.first_name || "",
                                email: user?.email || "",
                              },
                              theme: { color: "#0d1635" },
                              modal: {
                                ondismiss: function() {
                                  setIsPaying(false);
                                  toast.error("Payment cancelled.");
                                }
                              }
                            };

                            const rzp = new window.Razorpay(options);
                            rzp.on('payment.failed', function (resp: any) {
                              setIsPaying(false);
                              console.error("Razorpay payment failed:", resp?.error);
                              toast.error(resp?.error?.description || "Payment failed. Please try again.");
                              const desc = resp?.error?.description || 'Payment Failed';
                              const orderId = resp?.error?.metadata?.order_id || '';
                              const paymentId = resp?.error?.metadata?.payment_id || '';
                              router.push(`/payment-failed?reason=${encodeURIComponent(desc)}&order_id=${encodeURIComponent(orderId)}&payment_id=${encodeURIComponent(paymentId)}`);
                            });
                            rzp.open();
                          } catch (err: any) {
                            console.error("Booking error:", err);
                            toast.error(err.response?.data?.message || "Failed to initiate Razorpay payment.");
                            setIsPaying(false);
                          }
                        }}
                        className="w-full bg-[#C9A227] hover:bg-amber-400 text-[#0d1635] font-black h-14 rounded-xl text-sm shadow-[0_8px_20px_rgba(201,162,39,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 uppercase tracking-wider"
                      >
                        {isPaying ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={18} /> Processing...
                          </span>
                        ) : selectedTime ? (
                          `Confirm & Pay ₹${services[selectedService].price}`
                        ) : (
                          'Select a time slot'
                        )}
                      </Button>
                    </div>

                  </CardContent>
                </Card>
                
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#0d1635] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">Write a Review</h3>
                <p className="text-xs text-slate-300">Share your experience with {expert.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star size={28} className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700">{reviewRating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Session Topic / Service</label>
                <select
                  value={reviewSessionTitle}
                  onChange={(e) => setReviewSessionTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                >
                  <option value="1:1 Career Guidance">1:1 Career Guidance</option>
                  <option value="Mock Technical Interview">Mock Technical Interview</option>
                  <option value="Resume & Portfolio Review">Resume & Portfolio Review</option>
                  <option value="System Design Mentorship">System Design Mentorship</option>
                  <option value="General Mentorship Call">General Mentorship Call</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Feedback & Review *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us what you learned, how the expert helped you, and your takeaways..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 rounded-xl h-11 border-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 rounded-xl h-11 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-xs gap-2 cursor-pointer"
                >
                  {isSubmittingReview ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                  Publish Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
    </>
  );
}
