import { getImageUrl } from "../../src/lib/imageUtils";
import { useRouter } from "next/router";
import useSWR from "swr";
import api from "../../src/lib/axios";
import { MainLayout } from "../../src/layout/MainLayout";
import { SEO } from "../../src/components/seo/SEO";
import { GraduationCap, MapPin, CheckCircle2, ChevronRight, Award, Briefcase, FileText, Link as LinkIcon, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../../src/components/ui/Button";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CollegeDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: college, error } = useSWR(slug ? `/public/cms/colleges/${slug}` : null, fetcher);
  const isLoading = !college && !error;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B2A6B]"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !college) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-center px-4">
          <GraduationCap size={64} className="text-slate-300 mb-6" />
          <h1 className="text-2xl font-black text-slate-800 mb-2">University Not Found</h1>
          <p className="text-slate-500 mb-6">The university you're looking for might have been removed or doesn't exist.</p>
          <Link href="/colleges">
            <Button>View All Universities</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <SEO 
        title={college.seo_title || `${college.name} | Online Universities | Blueboxx DA`} 
        description={college.seo_description || college.short_description || `Join ${college.name} through Blueboxx DA.`} 
      />
      <MainLayout>
        
        {/* Hero Section with Banner */}
        <div className="relative pt-24 pb-16 min-h-[400px] flex items-center bg-[#0d1635] overflow-hidden">
          {college.banner_image && (
            <div className="absolute inset-0 z-0">
               <img src={getImageUrl(college.banner_image)} alt={college.name} className="w-full h-full object-cover opacity-30" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635] via-[#0d1635]/80 to-transparent"></div>
            </div>
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/colleges" className="hover:text-white transition-colors">Universities</Link>
              <ChevronRight size={14} />
              <span className="text-[#C9A227]">{college.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              {/* Logo Box */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-4 shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-white/10">
                {college.logo_url ? (
                  <img src={getImageUrl(college.logo_url)} alt={college.name} className="w-full h-full object-contain" />
                ) : (
                  <Building2 size={48} className="text-slate-300" />
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 text-white">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-5xl font-black mb-4 leading-tight"
                >
                  {college.name}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="flex flex-wrap items-center gap-4 text-sm font-bold mb-6"
                >
                  {college.location && (
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <MapPin size={16} className="text-[#C9A227]" /> {college.location}
                    </span>
                  )}
                  {college.is_ugc_approved && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                      <CheckCircle2 size={14} /> UGC Approved
                    </span>
                  )}
                  {college.naac_grade && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                      <Award size={14} /> NAAC {college.naac_grade}
                    </span>
                  )}
                  {college.is_wes_approved && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                      <Award size={14} /> WES Approved
                    </span>
                  )}
                  {college.nirf_ranking && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                      <Award size={14} /> NIRF: {college.nirf_ranking}
                    </span>
                  )}
                </motion.div>
                
                {college.short_description && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-slate-300 text-lg max-w-3xl leading-relaxed"
                  >
                    {college.short_description}
                  </motion.p>
                )}
              </div>
              
              {/* Call to Action */}
              <div className="flex flex-col gap-3 flex-shrink-0 w-full lg:w-auto">
                <Link href="/signup/student">
                  <Button className="w-full lg:w-48 py-6 text-base font-black shadow-xl bg-[#C9A227] text-slate-900 hover:bg-yellow-400 hover:scale-105 transition-all">
                    Apply Now
                  </Button>
                </Link>
                {college.website_url && (
                  <a href={college.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full lg:w-48 py-6 text-base font-black border-white/20 text-white hover:bg-white/10">
                      <LinkIcon size={16} className="mr-2" /> Visit Website
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-16 bg-slate-50 min-h-screen">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column (Main Content) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* About Section */}
                {college.full_description && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black text-[#1B2A6B] mb-6 flex items-center gap-3">
                      <Building2 className="text-[#C9A227]" /> About the University
                    </h2>
                    <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed">
                      {college.full_description.split('\\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admission Process */}
                {college.admission_process && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black text-[#1B2A6B] mb-6 flex items-center gap-3">
                      <FileText className="text-[#C9A227]" /> Admission Process
                    </h2>
                    <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed">
                      {college.admission_process.split('\\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Placement Support */}
                {college.placement_support && (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black text-[#1B2A6B] mb-6 flex items-center gap-3">
                      <Briefcase className="text-[#C9A227]" /> Placement Support
                    </h2>
                    <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed">
                      {college.placement_support.split('\\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Sidebar) */}
              <div className="space-y-6">
                
                {/* Academic Details Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                    <GraduationCap className="text-[#1B2A6B]" /> Academic Details
                  </h3>
                  
                  <div className="space-y-6">
                    {college.degree_types && college.degree_types.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Degree Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {college.degree_types.map((degree: string, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-100">
                              {degree}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {college.duration && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration</h4>
                        <p className="text-sm font-bold text-slate-700">{college.duration}</p>
                      </div>
                    )}
                    
                    {college.eligibility && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eligibility Criteria</h4>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed">{college.eligibility}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Popular Courses Card */}
                {college.popular_courses && college.popular_courses.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                      <Award className="text-[#1B2A6B]" /> Popular Courses
                    </h3>
                    <ul className="space-y-3">
                      {college.popular_courses.map((course: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-[#C9A227] shrink-0 mt-0.5" />
                          <span className="text-sm font-semibold text-slate-700">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Apply Card */}
                <div className="bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] rounded-3xl p-8 text-center shadow-lg relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[40px] pointer-events-none" />
                  <GraduationCap size={40} className="mx-auto text-[#C9A227] mb-4 relative z-10" />
                  <h3 className="text-xl font-black text-white mb-2 relative z-10">Start Your Journey</h3>
                  <p className="text-sm text-slate-300 font-medium mb-6 relative z-10 leading-relaxed">
                    Enroll in {college.name} through Blueboxx DA and unlock exclusive placement support.
                  </p>
                  <Link href="/signup/student" className="block relative z-10">
                    <Button className="w-full bg-[#C9A227] text-slate-900 hover:bg-yellow-400 font-black shadow-md">
                      Apply Now
                    </Button>
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </div>

      </MainLayout>
    </>
  );
}
