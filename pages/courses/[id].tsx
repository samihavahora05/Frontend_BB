import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../src/layout/MainLayout";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent } from "../../src/components/ui/Card";
import { 
  PlayCircle, Star, Users, Clock, FileText, Smartphone, Award, 
  CheckCircle2, ChevronDown, ChevronUp, X, Loader2
} from "lucide-react";
import { useStore } from "../../src/store/useStore";
import { useAuth } from "../../src/context/AuthContext";
import api from "../../src/lib/axios";
import { SEO } from "../../src/components/seo/SEO";
import { StudentsShowcaseSection } from "../../src/sections/StudentsShowcaseSection";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { mutate } from "swr";

export default function CourseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollingFree, setIsEnrollingFree] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const addToCart = useStore(state => state.addToCart);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) return;
    const rawId = Array.isArray(id) ? id[0] : id;
    const cleanId = rawId.replace(/\/$/, '').trim();
    if (!cleanId) return;
    
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/public/courses/${cleanId}`);
        setCourse(res.data.data);
        if (res.data.data?.curriculum?.length > 0) {
          setOpenModule(res.data.data.curriculum[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#1B2A6B] w-12 h-12" />
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Course Not Found</h1>
            <p className="text-slate-500 mb-6">The course you are looking for does not exist.</p>
            <Button onClick={() => router.push('/courses')} className="bg-[#1B2A6B] text-white">
              Browse All Courses
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Fallback lists if backend doesn't provide them
  const whatYouWillLearn = [
    "Build real-world applications from scratch",
    "Master the core concepts and advanced features",
    "Best practices for clean, scalable, and maintainable code",
    "Prepare for technical interviews with confidence"
  ];

  const isFree = parseFloat(course.price) === 0 || course.course_type === 'Free';

  const handleFreeEnrollment = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${id}`);
      return;
    }

    setIsEnrollingFree(true);
    try {
      await api.post(`/student/courses/${course.id}/enroll`);
      setEnrollSuccess(true);
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error("Free enrollment failed", error);
      alert(error.response?.data?.message || "Failed to enroll. Please try again.");
      setIsEnrollingFree(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login as a student to save courses");
      return;
    }
    if (user?.role !== 'student') {
      toast.error("Only students can save courses");
      return;
    }

    try {
      if (course.is_bookmarked) {
        await api.delete(`/student/save/course/${course.id}`);
        setCourse({ ...course, is_bookmarked: false });
        toast.success("Bookmark removed");
      } else {
        await api.post(`/student/save/course/${course.id}`);
        setCourse({ ...course, is_bookmarked: true });
        toast.success("Course saved to wishlist!");
      }
      mutate("/student/wishlist");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save course");
    }
  };

  return (
    <>
      <SEO 
        title={course.title ? `${course.title} | Blueboxx DA` : "Course Details | Blueboxx DA"}
        description={course.short_description || "Explore this premium course on Blueboxx DA."}
      />
      <MainLayout>
        {/* Dark Hero Section */}
      <div className="bg-[#0d1635] text-white pt-32 pb-12 md:pb-24 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B2A6B] rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#C9A227] rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Left Content (Text) */}
            <div className="flex-1 lg:max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#C9A227] mb-6">
                <span>{course.category?.name || "Tech"}</span>
                <span className="text-white/30">•</span>
                <span>{course.level?.title || "All Levels"}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{course.title}</h1>
              <p className="text-lg text-slate-300 font-medium mb-6 leading-relaxed">{course.short_description}</p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm mb-6">
                <div className="flex items-center gap-1.5 text-amber-400 font-black">
                  <Star size={16} className="fill-amber-400" />
                  <span>4.8</span>
                  <span className="text-slate-400 font-medium underline">(120 ratings)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users size={16} className="text-slate-400" /> {course.enrolled_count?.toLocaleString() || 0} students
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
                <div>Language <span className="text-white font-bold">{course.language || 'English'}</span></div>
                <div className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400"/> Duration {course.duration || 'Flexible'}</div>
              </div>
            </div>

            {/* Right Content (Floating Card for Desktop) */}
            <div className="hidden lg:block w-[400px] shrink-0">
              {/* This is a spacer, the actual card is fixed/sticky below */}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-7xl py-12 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column (Details) */}
          <div className="flex-1 lg:max-w-2xl space-y-12">
            
            {/* What you'll learn */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Course Content</h2>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-4 px-2">
                <div>{course.curriculum?.length || 0} sections • {course.total_lessons || 0} topics • {Math.floor((course.total_minutes || 0)/60)}h {(course.total_minutes || 0)%60}m total length</div>
                <button className="text-[#1B2A6B] hover:underline">Expand all sections</button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
                {course.curriculum?.map((module: any) => (
                  <div key={module.id} className="group">
                    {/* Accordion Header */}
                    <button 
                      onClick={() => setOpenModule(openModule === module.id ? null : module.id)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {openModule === module.id ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                        <h3 className="font-extrabold text-slate-800 text-left">{module.title}</h3>
                      </div>
                      <div className="hidden sm:block text-xs font-bold text-slate-500">
                        {module.lessons?.length || 0} topics
                      </div>
                    </button>
                    
                    {/* Accordion Body */}
                    {openModule === module.id && (
                      <div className="px-6 py-2 bg-white">
                        {module.lessons?.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between py-3 group/item">
                            <div className="flex items-center gap-3">
                              {item.type === 'video' ? (
                                <PlayCircle size={14} className="text-slate-400 group-hover/item:text-[#1B2A6B] transition-colors" />
                              ) : (
                                <FileText size={14} className="text-slate-400 group-hover/item:text-[#1B2A6B] transition-colors" />
                              )}
                              <span className="text-sm font-semibold text-slate-600 group-hover/item:text-[#1B2A6B] transition-colors cursor-pointer">{item.title}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-400">{item.duration_minutes}m</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Description</h2>
              {course.description ? (
                <div 
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-[#1B2A6B]" 
                  dangerouslySetInnerHTML={{__html: course.description}} 
                />
              ) : (
                <p className="text-slate-600 font-medium">Detailed description coming soon.</p>
              )}
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div>
                <h2 className="text-2xl font-black text-slate-800 mb-6">Instructor</h2>
                <div className="flex items-start gap-6">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=1B2A6B&color=fff`} alt={course.instructor.name} className="w-24 h-24 rounded-full shadow-lg" />
                  <div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">{course.instructor.name}</h3>
                    <p className="text-sm font-extrabold text-slate-500 mb-3">{course.instructor.title}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 mb-4">
                      <span className="flex items-center gap-1.5"><Star size={14} className="text-[#C9A227]"/> 4.8 Rating</span>
                      <span className="flex items-center gap-1.5"><Award size={14} className="text-slate-400"/> 12,450 Reviews</span>
                      <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-400"/> 85,200 Students</span>
                    </div>

                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Blueboxx DA expert instructors are industry veterans with years of hands-on experience at top product companies. They bring real-world insights and best practices directly into the classroom.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Floating/Sticky Card) */}
          <div className="lg:absolute lg:top-[-280px] lg:right-4 w-full lg:w-[400px] z-20">
            <Card className="bg-white border border-slate-100 shadow-[0_20px_40px_rgba(27,42,107,0.1)] rounded-3xl overflow-hidden sticky top-32">
              {/* Video Preview Image */}
              <div 
                className="relative h-56 bg-slate-200 group cursor-pointer overflow-hidden"
                onClick={() => setIsVideoOpen(true)}
              >
                <img src={course.thumbnail || '/logoblue.png'} alt="Course Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-[#0d1635]/40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:bg-[#1B2A6B] transition-colors shadow-lg">
                    <PlayCircle size={32} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-white text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2">
                    Preview this course
                  </span>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-slate-800">₹{(course.price || 0).toLocaleString()}</span>
                  {course.discount_price && (
                    <>
                      <span className="text-lg font-bold text-slate-400 line-through mb-1">₹{(course.discount_price).toLocaleString()}</span>
                      <span className="text-sm font-black text-emerald-600 mb-1.5">Save discount</span>
                    </>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {isFree ? (
                    <Button 
                      onClick={handleFreeEnrollment}
                      disabled={isEnrollingFree || enrollSuccess}
                      className={`w-full font-black h-14 rounded-xl text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                        enrollSuccess 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-[#1B2A6B] hover:bg-[#0d1635] text-white hover:shadow-xl hover:-translate-y-0.5'
                      }`}
                    >
                      {enrollSuccess ? (
                        <>
                          <CheckCircle2 size={20} /> Successfully Enrolled
                        </>
                      ) : isEnrollingFree ? (
                        <>
                          <Loader2 className="animate-spin" size={20} /> Enrolling...
                        </>
                      ) : (
                        "Enroll for Free"
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error("Please login to purchase this course.");
                            router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
                            return;
                          }
                          addToCart({
                            id: course?.id || id as string || course.title,
                            title: course.title,
                            price: course.price,
                            thumbnail: course.thumbnail,
                            type: 'course'
                          });
                          router.push('/checkout');
                        }}
                        className="w-full bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-black h-14 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                      >
                        Buy Now
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error("Please login to add courses to your cart.");
                            router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
                            return;
                          }
                          addToCart({
                            id: course?.id || id as string || course.title,
                            title: course.title,
                            price: course.price,
                            thumbnail: course.thumbnail,
                            type: 'course'
                          });
                        }}
                        className="w-full border-slate-200 text-slate-600 font-extrabold h-12 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Add to Cart
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleBookmark}
                    className={`w-full border-slate-200 h-12 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 ${course.is_bookmarked ? 'text-[#C9A227] bg-amber-50' : 'text-slate-600 font-extrabold'}`}
                  >
                    <Bookmark size={18} className={course.is_bookmarked ? 'fill-current' : ''} /> {course.is_bookmarked ? 'Saved to Wishlist' : 'Save to Wishlist'}
                  </Button>
                </div>
                <div className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-6">
                  30-Day Money-Back Guarantee
                </div>

                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-800 text-sm">This course includes:</h4>
                  <ul className="space-y-3">
                    {[
                      { icon: PlayCircle, text: "8.5 hours on-demand video" },
                      { icon: FileText, text: "12 articles" },
                      { icon: Award, text: "Certificate of completion" },
                      { icon: Smartphone, text: "Access on mobile and TV" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                        <item.icon size={16} className="text-slate-400 shrink-0" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <StudentsShowcaseSection />

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[100] p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors border border-white/20"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full bg-black">
              {course.preview_video_url ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={course.preview_video_url} 
                  title={`${course.title} Preview Video`} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                  No preview video available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
    </>
  );
}
