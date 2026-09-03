import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { MainLayout } from '../src/layout/MainLayout';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { Pagination } from '../src/components/ui/Pagination';
import { TopSearchBar } from '../src/components/ui/TopSearchBar';
import { SidebarFilter } from '../src/components/ui/SidebarFilter';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { PartnersSection } from '../src/sections/PartnersSection';
import { WhyChooseBlueboxxSection } from '../src/sections/WhyChooseBlueboxxSection';
import { StudentsShowcaseSection } from '../src/sections/StudentsShowcaseSection';
import { TestimonialsSection } from '../src/sections/TestimonialsSection';
import { SEO } from '../src/components/seo/SEO';
import Image from 'next/image';
import useSWR, { mutate } from 'swr';
import api from '../src/lib/axios';
import { useAuth } from '../src/context/AuthContext';
import { AuthNoticeBanner } from '../src/components/common/AuthNoticeBanner';
import toast from 'react-hot-toast';

// Simple debounce hook for local use
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortOption, setSortOption] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const getImageUrl = (path: string | null) => {
    if (!path) return '/logoblue.png';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    if (cleanPath.startsWith('storage/')) {
      return `${backendUrl}/${cleanPath}`;
    }
    return `${backendUrl}/storage/${cleanPath}`;
  };

  const normalizeCourses = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.data)) return data.data.data;
    if (Array.isArray(data.courses)) return data.courses;
    if (Array.isArray(data.data?.courses)) return data.data.courses;
    return [];
  };

  // SWR Fetcher with resilient fallbacks
  const fetcher = async (url: string) => {
    try {
      const res = await api.get(url);
      if (res?.data) return res.data;
    } catch (e) {
      // ignore
    }
    try {
      const fallback = await api.get('/courses');
      if (fallback?.data) return fallback.data;
    } catch (e) {}
    try {
      const adminFallback = await api.get('/admin/courses?per_page=50');
      if (adminFallback?.data) return adminFallback.data;
    } catch (e) {}
    return { data: [] };
  };

  const { data: coursesData, isLoading } = useSWR('/public/courses', fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  });

  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);

  // Load which courses are already saved
  useSWR(isAuthenticated ? "/student/wishlist" : null, (url) =>
    api.get(url).then(res => res.data.data)
  , {
    onSuccess: (data) => {
      if (data?.saved_course_ids) {
        setSavedIds(new Set(data.saved_course_ids.map(Number)));
      }
    }
  });

  const toggleSave = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to save courses.");
      return;
    }
    if (saving === id) return;
    setSaving(id);
    const isSaved = savedIds.has(id);
    try {
      if (isSaved) {
        await api.delete(`/student/save/course/${id}`);
        setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        toast.success("Removed from saved items");
      } else {
        await api.post(`/student/save/course/${id}`);
        setSavedIds(prev => new Set([...prev, id]));
        toast.success("Course saved to your Saved Items!");
      }
      mutate("/student/wishlist");
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const [sidebarFilters, setSidebarFilters] = useState<any>({});

  const courses = normalizeCourses(coursesData);
  let sortedCourses = [...courses];
  
  if (debouncedSearchQuery) {
    sortedCourses = sortedCourses.filter(c => {
      const titleMatch = c.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const catName = c.category?.name || c.category_name || c.category;
      const catMatch = typeof catName === 'string' && catName.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const descMatch = (c.short_description || c.shortDesc || c.description)?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return titleMatch || catMatch || descMatch;
    });
  }

  // Apply Sidebar Filters
  if (sidebarFilters.category) {
    sortedCourses = sortedCourses.filter(c => {
      const catName = c.category?.name || c.category_name || c.category;
      return typeof catName === 'string' && catName.toLowerCase().includes(sidebarFilters.category.toLowerCase());
    });
  }
  if (sidebarFilters.level) {
    sortedCourses = sortedCourses.filter(c => {
      const levelName = c.level?.title || c.level?.name || c.level;
      return (typeof levelName === 'string' && levelName.toLowerCase() === sidebarFilters.level.toLowerCase()) || 
             (c.level && String(c.level).toLowerCase() === sidebarFilters.level.toLowerCase());
    });
  }
  if (sidebarFilters.duration) {
    sortedCourses = sortedCourses.filter(c => {
       if (!c.duration) return false;
       return c.duration.toLowerCase().includes(sidebarFilters.duration.toLowerCase()) ||
              sidebarFilters.duration.toLowerCase().includes(c.duration.toLowerCase());
    });
  }
  
  if (sortOption === "price-asc") sortedCourses.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  if (sortOption === "price-desc") sortedCourses.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  if (sortOption === "rating-desc") sortedCourses.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

  return (
    <>
      <SEO 
        title="Premium Tech Courses & Programs | Blueboxx DA"
        description="Browse our industry-aligned curriculum built by experts from top product companies. Master Full Stack, AI/ML, and more with 100% placement support."
        keywords="Web Development Course Vadodara, Full Stack Development Course, MERN Stack Course, React JS Training Vadodara, Artificial Intelligence Course, Machine Learning Course, Graphic Design Course, UI UX Design Course, Digital Marketing Course, Mobile App Development Course, SEO Training, Best Full Stack Development Course in Vadodara, Learn Web Development from Industry Experts"
      />
      <MainLayout>
        {/* Hero Section */}
      <div className="pt-24 pb-16 bg-[#0d1635] text-white relative overflow-hidden">
        {/* Premium Grid Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Explore Premium <span className="text-[#C9A227]">Programs</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Industry-aligned curriculum built by experts from top product companies.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 min-h-screen relative overflow-hidden" style={{background: "linear-gradient(135deg, #f8faff 0%, #fafafa 40%, #fffdf5 100%)"}}>
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.55]" style={{backgroundImage: "radial-gradient(#c7d2fe 1px, transparent 1px)", backgroundSize: "28px 28px"}} />
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-[#1B2A6B]/8 to-transparent rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#C9A227]/8 to-transparent rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-50/60 to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <AuthNoticeBanner 
            title="Login to Enroll in Premium Courses & Masterclasses" 
            description="Sign in to your account to enroll in live courses, access interactive modules & assignments, get certified, and track your learning progress." 
          />

          <TopSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search courses by title, category, or skills..." />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 hidden lg:block">
              <SidebarFilter type="courses" onFilterChange={setSidebarFilters} />
            </div>

            <main className="lg:col-span-3">
              <div className="flex justify-end items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-semibold">Sort by:</span>
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent text-sm font-bold text-slate-800 border-none focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[400px]">
                      <div className="w-full h-44 bg-slate-200"></div>
                      <div className="p-4 space-y-4">
                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        <div className="pt-4 mt-6 border-t border-slate-100 flex justify-between">
                          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sortedCourses.slice((currentPage - 1) * 6, currentPage * 6).map((course) => (
                      <Card 
                        key={course.id} 
                        className="overflow-hidden group flex flex-col hover:border-[#1B2A6B]/30 hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
                        onClick={() => router.push(`/courses/${course.slug || course.id}`)}
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 shrink-0">
                          <img 
                            src={getImageUrl(course.thumbnail)} 
                            alt={course.title || "Course thumbnail"} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            onError={(e: any) => { e.currentTarget.src = '/logoblue.png'; }}
                          />
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
                            <Badge className="bg-white/90 text-slate-900 hover:bg-white border-none shadow-sm backdrop-blur-sm text-[10px] py-0 pointer-events-auto">
                              {course.category?.name || course.category_name || (typeof course.category === 'string' ? course.category : "Tech")}
                            </Badge>
                            {course.is_popular && (
                              <Badge variant="gold" className="shadow-sm text-[10px] py-0 px-2 pointer-events-auto">Popular</Badge>
                            )}
                          </div>
                          <div className="absolute top-2 right-2 flex items-center justify-center pointer-events-auto">
                            <button
                              onClick={(e) => toggleSave(e, course.id)}
                              disabled={saving === course.id}
                              title={savedIds.has(course.id) ? "Remove from saved" : "Save this course"}
                              className={`p-1.5 rounded-full border transition-all pointer-events-auto shadow-sm backdrop-blur-sm ${
                                savedIds.has(course.id) 
                                  ? "bg-white/90 border-amber-200 text-[#C9A227]" 
                                  : "bg-white/70 border-white/40 text-slate-500 hover:text-slate-800 hover:bg-white"
                              } ${saving === course.id ? "animate-pulse" : ""}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={savedIds.has(course.id) ? "#C9A227" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#1B2A6B] transition-colors line-clamp-2 leading-tight mb-1.5">
                            {course.title}
                          </h3>
                          
                          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{course.short_description || course.shortDesc || course.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 mb-5 mt-auto">
                            <div className="flex items-center gap-1"><Clock size={12} className="text-[#1B2A6B]"/> {course.duration || 'Flexible'}</div>
                            <div className="flex items-center gap-1"><Star size={12} className="text-[#C9A227] fill-[#C9A227]"/> {course.rating || '4.9'}</div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-slate-400 font-bold line-through mb-0.5">
                                ₹{(Number(course.original_price) || (Number(course.discount_price) && Number(course.price) ? Number(course.price) : Number(course.price || 0) * 1.5)).toLocaleString()}
                              </div>
                              <div className="text-lg font-black text-slate-900 leading-none">
                                ₹{(Number(course.discount_price) || Number(course.price) || 0).toLocaleString()}
                              </div>
                            </div>
                            <button className="h-8 flex items-center justify-center text-xs font-bold bg-[#1B2A6B] hover:bg-[#0d1635] text-white transition-all rounded-lg shadow-md px-4 gap-1.5 border-none cursor-pointer group-hover:bg-[#C9A227] group-hover:text-[#0d1635] group-hover:shadow-lg">
                              Enroll <ArrowRight size={14}/>
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  {Math.ceil(sortedCourses.length / 6) > 1 && (
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={Math.ceil(sortedCourses.length / 6)} 
                      onPageChange={setCurrentPage} 
                      className="mt-12"
                    />
                  )}
                </>
              ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No courses found</h3>
                  <p className="text-slate-500">There are no courses available at the moment.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <WhyChooseBlueboxxSection />
      <StudentsShowcaseSection />
      <PartnersSection 
        titlePrefix="Instructors from " 
        highlightText="Top Companies" 
        subtitle="Learn from instructors at world's top tech and product companies" 
      />
      <TestimonialsSection />
    </MainLayout>
    </>
  );
}
