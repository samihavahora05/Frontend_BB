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
import { SEO } from '../src/components/seo/SEO';
import Image from 'next/image';
import useSWR, { mutate } from 'swr';
import api from '../src/lib/axios';
import { useAuth } from '../src/context/AuthContext';
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

  // SWR Fetcher
  const fetcher = (url: string) => api.get(url).then(res => res.data.data || res.data);
  const { data: coursesData, isLoading } = useSWR('/public/courses?per_page=50', fetcher, {
    revalidateOnFocus: false, // Prevents aggressive refetching
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

  const courses = coursesData || [];
  let sortedCourses = [...courses];
  
  if (debouncedSearchQuery) {
    sortedCourses = sortedCourses.filter(c => {
      const titleMatch = c.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const catName = c.category?.name || c.category;
      const catMatch = typeof catName === 'string' && catName.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const descMatch = (c.short_description || c.shortDesc)?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return titleMatch || catMatch || descMatch;
    });
  }

  // Apply Sidebar Filters
  if (sidebarFilters.category) {
    sortedCourses = sortedCourses.filter(c => {
      const catName = c.category?.name || c.category;
      return typeof catName === 'string' && catName.toLowerCase().includes(sidebarFilters.category.toLowerCase());
    });
  }
  if (sidebarFilters.level) {
    sortedCourses = sortedCourses.filter(c => {
      const levelName = c.level?.title || c.level;
      // Also match string fields if API returns level directly
      return (typeof levelName === 'string' && levelName.toLowerCase() === sidebarFilters.level.toLowerCase()) || 
             (c.level && String(c.level).toLowerCase() === sidebarFilters.level.toLowerCase());
    });
  }
  if (sidebarFilters.duration) {
    // Basic duration matching (assuming duration string matching for now)
    sortedCourses = sortedCourses.filter(c => {
       if (!c.duration) return false;
       // For exact match or simple mapping
       return c.duration.toLowerCase().includes(sidebarFilters.duration.toLowerCase()) ||
              sidebarFilters.duration.toLowerCase().includes(c.duration.toLowerCase());
    });
  }
  
  if (sortOption === "price-asc") sortedCourses.sort((a, b) => a.price - b.price);
  if (sortOption === "price-desc") sortedCourses.sort((a, b) => b.price - a.price);
  if (sortOption === "rating-desc") sortedCourses.sort((a, b) => b.rating - a.rating);

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
                        onClick={() => router.push(`/courses/${course.slug}`)}
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 shrink-0">
                          <Image src={course.thumbnail || "/logoblue.png"} alt={course.title || "Course thumbnail"} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
                            <Badge className="bg-white/90 text-slate-900 hover:bg-white border-none shadow-sm backdrop-blur-sm text-[10px] py-0 pointer-events-auto">
                              {course.category?.name || "Tech"}
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
                          
                          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{course.short_description || course.shortDesc}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 mb-5 mt-auto">
                            <div className="flex items-center gap-1"><Clock size={12} className="text-[#1B2A6B]"/> {course.duration}</div>
                            <div className="flex items-center gap-1"><Star size={12} className="text-[#C9A227] fill-[#C9A227]"/> {course.rating}</div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-slate-400 font-bold line-through mb-0.5">₹{(course.original_price || course.price * 1.5).toLocaleString()}</div>
                              <div className="text-lg font-black text-slate-900 leading-none">₹{(course.price || 0).toLocaleString()}</div>
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
      <PartnersSection 
        titlePrefix="Instructors from " 
        highlightText="Top Companies" 
        subtitle="Learn from instructors at world's top tech and product companies" 
      />
    </MainLayout>
    </>
  );
}
