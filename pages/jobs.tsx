import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { Filter, Briefcase, Clock, Building, Loader2 } from "lucide-react";
import { TopSearchBar } from "../src/components/ui/TopSearchBar";
import { SidebarFilter } from "../src/components/ui/SidebarFilter";
import { Pagination } from "../src/components/ui/Pagination";
import { Card, CardContent } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { TestimonialSection } from "../src/sections/TestimonialSection";
import { PartnersSection } from "../src/sections/PartnersSection";
import { SEO } from "../src/components/seo/SEO";
import api from "../src/lib/axios";
import { fetcher } from "../src/lib/fetcher";
import { useAuth } from "../src/context/AuthContext";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);

  // Load which jobs are already saved
  useSWR(isAuthenticated ? "/student/wishlist" : null, (url) =>
    api.get(url).then(res => res.data.data)
  , {
    onSuccess: (data) => {
      if (data?.saved_job_ids) {
        setSavedIds(new Set(data.saved_job_ids.map(Number)));
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
        await api.delete(`/student/save/job/${id}`);
        setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        toast.success("Removed from saved items");
      } else {
        await api.post(`/student/save/job/${id}`);
        setSavedIds(prev => new Set([...prev, id]));
        toast.success("Job saved to your Saved Items!");
      }
      mutate("/student/wishlist");
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const params: any = {
          page: currentPage,
          per_page: 6,
          sort: sortOption,
        };
        
        let searchTerms = [];
        if (searchQuery) searchTerms.push(searchQuery);
        if (activeFilters.role) searchTerms.push(activeFilters.role);
        if (searchTerms.length > 0) params.search = searchTerms.join(' ');
        
        if (activeFilters.mode) {
           params.location = activeFilters.mode;
        }
        if (activeFilters.experience) {
           params.experience_level = activeFilters.experience.split(' ')[0];
        }
        if (activeFilters.type) {
           params.job_type = activeFilters.type;
        }
        if (activeFilters.salary) {
           const match = activeFilters.salary.match(/(\d+)(?:-(\d+))?\s+LPA/);
           if (match) {
               params.min_salary = parseInt(match[1]) * 100000;
               if (match[2]) params.max_salary = parseInt(match[2]) * 100000;
           } else if (activeFilters.salary === "25+ LPA") {
               params.min_salary = 2500000;
           }
        }

        const res = await api.get("/public/jobs", { params });
        if (res.data.success) {
          setJobs(res.data.data);
          setTotalPages(res.data.pagination.last_page);
          setTotalJobs(res.data.pagination.total);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add debounce for search query
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, sortOption, searchQuery, activeFilters]);

  return (
    <>
      <SEO 
        title="Find Top IT Jobs & Placements | Blueboxx DA"
        description="Browse hundreds of curated job openings from top product companies and fast-growing startups. 100% placement assistance available."
        keywords="Blueboxx Placement, Blueboxx Jobs, IT Jobs Vadodara, Software Developer Jobs, Placement Assistance, Campus Placement, Job Portal, Hiring Platform, Career Opportunities, Job Ready Program"
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
            Find Your <span className="text-[#C9A227]">Next Big Opportunity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Browse hundreds of curated job openings from top product companies and fast-growing startups.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f8faff 0%, #fafafa 40%, #fffdf5 100%)" }}>
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.55]" style={{ backgroundImage: "radial-gradient(#c7d2fe 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-[#1B2A6B]/8 to-transparent rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#C9A227]/8 to-transparent rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-50/60 to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">

          <TopSearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search jobs by role or company..." />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:hidden">
              <Button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} 
                variant="outline" 
                className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm h-12 rounded-xl gap-2 font-extrabold text-sm uppercase tracking-wider"
              >
                <Filter size={16} /> Filters
              </Button>
            </div>

            <div className={`lg:col-span-1 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
              <SidebarFilter type="jobs" onFilterChange={setActiveFilters} />
            </div>

            <main className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-slate-800 text-lg">Showing {totalJobs} jobs</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-semibold">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 px-3 py-1.5 focus:ring-[#C9A227] focus:border-[#C9A227] cursor-pointer outline-none"
                  >
                    <option value="newest">Most Recent</option>
                    <option value="salary_high">Highest Salary</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="py-20 text-center flex justify-center">
                  <Loader2 className="animate-spin text-[#1B2A6B] w-10 h-10" />
                </div>
              ) : jobs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map((job) => (
                      <Card key={job.id} className="group relative overflow-hidden bg-white border border-slate-200 hover:border-[#1B2A6B]/30 hover:shadow-[0_8px_30px_rgba(27,42,107,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-[1.25rem]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1B2A6B]/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"></div>
                        <CardContent className="p-4 flex-1 flex flex-col relative z-10">
                          <div className="flex justify-between items-start mb-3">
                            <div className="w-10 h-10 rounded-lg border border-slate-100 bg-slate-50 shadow-sm shrink-0 overflow-hidden">
                              <img src={job.company_logo || `https://ui-avatars.com/api/?name=${job.company_name}&background=random`} alt={job.company_name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
                                <Briefcase size={10} className="text-[#1B2A6B]" /> {job.experience_level || job.job_type}
                              </div>
                              <button
                                onClick={(e) => toggleSave(e, job.id)}
                                disabled={saving === job.id}
                                title={savedIds.has(job.id) ? "Remove from saved" : "Save this job"}
                                className={`p-1.5 rounded-md border transition-all pointer-events-auto ${
                                  savedIds.has(job.id) 
                                    ? "bg-amber-50 border-amber-200 text-[#C9A227]" 
                                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                } ${saving === job.id ? "animate-pulse" : ""}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={savedIds.has(job.id) ? "#C9A227" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                              </button>
                            </div>
                          </div>

                          <h3 className="text-base font-extrabold text-slate-900 mb-0.5 group-hover:text-[#1B2A6B] transition-colors leading-tight line-clamp-1">{job.title}</h3>
                          <p className="text-[11px] font-bold text-slate-500 mb-3 flex items-center gap-1">
                            <Building size={12} /> {job.company_name} • {job.location}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mb-5">
                            {job.is_featured && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-bold text-[9px] px-2 py-0.5 rounded-md shadow-sm">Featured</Badge>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                            <div>
                              <div className="text-xs font-extrabold text-emerald-600 mb-0.5">
                                {job.hide_salary ? 'Undisclosed' : job.salary_min ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}` : 'Not Specified'}
                              </div>
                              <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                                <Clock size={10} /> POSTED {job.posted_at?.toUpperCase()}
                              </div>
                            </div>
                            <Link href={`/apply/job/${job.id}`}>
                              <Button variant="outline" className="h-7 text-xs font-bold border-slate-200 text-slate-700 bg-slate-50 group-hover:bg-[#1B2A6B] group-hover:text-white group-hover:border-[#1B2A6B] transition-colors shadow-sm rounded-lg px-3">
                                Apply
                              </Button>
                            </Link>
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
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No jobs found</h3>
                  <p className="text-slate-500">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <JobOffersSection />
      <TestimonialSection 
        type="job" 
        titleHighlight="Alumni"
        subtitle="Read success stories from our alumni who landed their dream jobs through our placement network."
      />
      <PartnersSection 
        titlePrefix="Top Hiring " 
        highlightText="Companies" 
        subtitle="Browse opportunities from 100+ hiring partners across industries" 
      />
    </MainLayout>
    </>
  );
}

function JobOffersSection() {
  const { data: offersData } = useSWR("/public/cms/job-offers", fetcher);

  const offersList = useMemo(() => {
    if (offersData && Array.isArray(offersData) && offersData.length > 0) {
      return offersData;
    }
    return [
      { id: 1, student_name: "Ananya Sharma", degree: "B.Tech - CSE", company_name: "Infosys", role: "Software Engineer", offered_on: "10 Mar 2025" },
      { id: 2, student_name: "Rahul Verma", degree: "MBA - Marketing", company_name: "HDFC Bank", role: "Business Analyst", offered_on: "25 Feb 2025" },
      { id: 3, student_name: "Priya Nair", degree: "B.Sc - Data Science", company_name: "TCS", role: "Data Analyst", offered_on: "05 Apr 2025" },
    ];
  }, [offersData]);

  const avatarGradients = [
    "from-[#2dd4bf] to-[#06b6d4]",
    "from-[#38bdf8] to-[#2563eb]",
    "from-[#818cf8] to-[#4f46e5]",
    "from-[#fbbf24] to-[#ea580c]",
    "from-[#34d399] to-[#059669]",
  ];

  return (
    <section className="py-16 bg-[#f8fafc] border-y border-slate-200/80">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3 uppercase">
            <span className="text-3xl md:text-4xl">🎓</span> STUDENTS WHO GOT JOB OFFERS
          </h2>
          <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-xl mx-auto font-medium">
            Celebrating our learners who successfully cracked corporate selection rounds and secured high-growth job offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offersList.map((item: any, idx: number) => {
            const initials = (item.student_name || "Student")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w: string) => w[0])
              .join("")
              .toUpperCase();

            const gradient = avatarGradients[idx % avatarGradients.length];

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (idx % 3) * 0.08 }}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group"
              >
                {/* Avatar Initials Circle */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0 tracking-wider`}>
                  {initials}
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug truncate group-hover:text-[#1B2A6B] transition-colors">
                    {item.student_name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mb-2 truncate">
                    {item.degree || 'Graduate'}
                  </p>
                  <p className="text-xs leading-normal">
                    <span className="font-bold text-[#2563eb]">{item.company_name}</span>
                    <span className="text-slate-400 mx-1">—</span>
                    <span className="font-semibold text-slate-700">{item.role}</span>
                  </p>
                  {item.offered_on && (
                    <p className="text-[11px] font-medium text-slate-400 mt-2">
                      Offered on: <strong className="text-slate-700 font-bold">{item.offered_on}</strong>
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
