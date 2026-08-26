import { MainLayout } from "../src/layout/MainLayout";
import { Card, CardContent } from "../src/components/ui/Card";
import { GraduationCap, ExternalLink, Award, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
import api from "../src/lib/axios";
import { SEO } from "../src/components/seo/SEO";
import { WhyChooseBlueboxxSection } from "../src/sections/WhyChooseBlueboxxSection";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CollegesPage() {
  const { data: collegesList, error } = useSWR("/public/cms/colleges", fetcher);
  const isLoading = !collegesList && !error;

  return (
    <>
      <SEO title="Online Universities & Academic Partners | Blueboxx DA" description="Blueboxx DA partners with India's leading online universities to provide UGC-approved degree programs, industry-aligned curricula, and placement assistance." />
      <MainLayout>
        {/* Hero Section */}
      <div className="pt-24 pb-16 bg-[#0d1635] text-white relative overflow-hidden">
        {/* Premium Grid Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white uppercase tracking-[0.2em] mb-6"
          >
            Online Universities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Empowering Students Through <br className="hidden md:block" />
            <span className="text-[#C9A227]">Premium Tie-Ups.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Approved by UGC, WES, NAAC Grade A/A+ & Recognized by NIRF and Industry.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A6B]"></div>
            </div>
          )}

          {(!isLoading && (!collegesList || collegesList.length === 0)) && (
            <div className="text-center text-slate-500 py-12">
              No online universities are available at the moment. Please check back later.
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collegesList && collegesList.map((college: any, i: number) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/colleges/${college.slug}`} className="block h-full">
                  <Card className="group relative overflow-hidden bg-white hover:border-[#1B2A6B]/40 hover:shadow-[0_12px_40px_rgba(27,42,107,0.1)] hover:-translate-y-2.5 transition-all duration-300 h-full cursor-pointer rounded-2xl flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <CardContent className="p-6 text-center relative z-10 flex flex-col h-full flex-1">
                      {/* Logo Section */}
                      <div className="w-24 h-24 mx-auto rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4 mb-5 group-hover:bg-slate-50 transition-all duration-500 shadow-sm shrink-0">
                        {college.logo_url ? (
                          <img
                            src={college.logo_url}
                            alt={college.name}
                            className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=random&color=fff`;
                            }}
                          />
                        ) : (
                          <GraduationCap size={32} className="text-slate-400 group-hover:text-[#1B2A6B] transition-colors" />
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col items-center">
                          <h3 className="text-[15px] font-extrabold text-slate-900 mb-2 group-hover:text-[#1B2A6B] transition-colors line-clamp-2 leading-tight">
                            {college.name}
                          </h3>

                          {college.short_description && (
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                                {college.short_description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                              {college.is_ugc_approved && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                                      <CheckCircle2 size={10} /> UGC
                                  </span>
                              )}
                              {college.naac_grade && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">
                                      NAAC {college.naac_grade}
                                  </span>
                              )}
                              {college.is_wes_approved && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                                      WES
                                  </span>
                              )}
                          </div>
                      </div>

                      {/* Footer Section */}
                      <div className="pt-4 mt-auto w-full border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#C9A227] uppercase tracking-wider flex items-center gap-1.5">
                          <Award size={12} /> View Details
                        </span>
                        <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#1B2A6B] group-hover:text-white transition-all duration-300">
                          <ExternalLink size={10} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <WhyChooseBlueboxxSection />
    </MainLayout>
    </>
  );
}
