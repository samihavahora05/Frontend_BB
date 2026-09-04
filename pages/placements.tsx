import { getImageUrl } from "../src/lib/imageUtils";
import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, Building2, Briefcase, Award } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Input } from "../src/components/ui/Input";
import { partnerCompanies, INDUSTRIES } from "../src/data/companies";
import { CompanyService, CMSCompany } from "../src/lib/api/CompanyService";
import { SEO } from "../src/components/seo/SEO";
import { WhyChooseBlueboxxSection } from "../src/sections/WhyChooseBlueboxxSection";
import { TestimonialsSection } from "../src/sections/TestimonialsSection";

// Helper component for fallback company logos
const CompanyLogo = ({ company }: { company: any }) => {
  const [imgError, setImgError] = useState(false);
  const logo = company.logoUrl || company.logo_url;

  if (!logo || imgError) {
    // Generate initials from company name
    const initials = (company.name || "Company")
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase();
    
    // Consistent color based on company name length
    const colors = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-purple-100 text-purple-700", "bg-rose-100 text-rose-700"];
    const colorClass = colors[(company.name || "").length % colors.length];

    return (
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl ${colorClass}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2 overflow-hidden relative">
      <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-slate-200/50 via-slate-100/30 to-amber-100/20 blur-sm pointer-events-none" />
      <img 
        src={logo} 
        alt={company.name} 
        className="max-w-full max-h-full object-contain relative z-10 [filter:drop-shadow(0_4px_8px_rgba(15,23,42,0.55))_drop-shadow(0_0_1.5px_rgba(15,23,42,0.75))]"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

import useSWR from "swr";
import { fetcher } from "../src/lib/fetcher";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [companies, setCompanies] = useState<CMSCompany[]>([]);

  // Live API sync with background revalidation
  const { data: apiCompanies, mutate: mutateCompanies } = useSWR("/cms/companies", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
    refreshInterval: 5000,
  });

  useEffect(() => {
    // Initial fetch from CompanyService
    CompanyService.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCompanies(data);
      }
    });

    // Real-time subscription across tabs
    const unsubscribe = CompanyService.subscribe((updated) => {
      setCompanies(updated);
      mutateCompanies();
    });

    return () => unsubscribe();
  }, [mutateCompanies]);

  const activeSource = (apiCompanies && Array.isArray(apiCompanies) && apiCompanies.length > 0)
    ? apiCompanies
    : (companies.length > 0 ? companies : partnerCompanies);

  const companiesList = activeSource.filter((c: any) => !c.status || c.status === "published" || c.status === "active");

  const filteredCompanies = companiesList.filter((company: any) => {
    const indName = company.industry?.name || company.industry || "";
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          indName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "All Industries" || indName.toLowerCase() === selectedIndustry.toLowerCase() || indName.toLowerCase().includes(selectedIndustry.toLowerCase());
    
    return matchesSearch && matchesIndustry;
  });

  return (
    <MainLayout>
      <SEO title="Our Partner Companies & Recruiters | Blueboxx DA" description="Explore the wide range of top product companies and startups that hire our talented students through Blueboxx DA." />
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-[#0d1635] text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 mb-6 uppercase tracking-widest">
              <span>Home</span> <span className="text-slate-600">/</span> <span className="text-[#C9A227]">Companies</span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              Empowering Growth Through <span className="text-[#C9A227]">Smart Partnerships.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto"
            >
              We collaborate with industry leaders and fast-growing startups to bring you real-world projects, internships, and full-time opportunities.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto relative"
            >
              <Input 
                icon={<Search size={20}/>} 
                placeholder="Search companies by name or description..." 
                className="py-4 text-base pl-12 shadow-xl bg-white/10 border-white/20 text-white placeholder:text-slate-400 backdrop-blur-md focus-visible:ring-[#C9A227] focus-visible:border-[#C9A227]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar: Filters */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-[#1B2A6B]" />
                  Industries
                </h3>
                <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {INDUSTRIES.map((industry) => {
                    const isSelected = selectedIndustry === industry;
                    return (
                      <button
                        key={industry}
                        onClick={() => setSelectedIndustry(industry)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
                          isSelected 
                            ? "bg-[#1B2A6B] text-white shadow-md" 
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {industry}
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>

            {/* Right Content: Companies Grid */}
            <main className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 text-lg">
                  Showing {filteredCompanies.length} partner{filteredCompanies.length !== 1 && 's'}
                </h2>
                {selectedIndustry !== "All Industries" && (
                  <Badge variant="secondary" className="bg-[#1B2A6B]/10 text-[#1B2A6B]">
                    {selectedIndustry}
                  </Badge>
                )}
              </div>

              {filteredCompanies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filteredCompanies.map((company) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        key={company.id}
                      >
                        <Card className="h-full hover:border-[#1B2A6B]/30 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
                          <CardContent className="p-6 flex flex-col items-center text-center h-full">
                            <div className="mb-4 transform group-hover:-translate-y-1 transition-transform duration-300">
                              <CompanyLogo company={company} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#1B2A6B] transition-colors">{company.name}</h3>
                            <Badge variant="outline" className="mt-auto text-xs font-semibold bg-slate-50 text-slate-600 border-slate-200">
                              {company.industry}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No companies found</h3>
                  <p className="text-slate-500">Try adjusting your search or selecting a different industry.</p>
                  <button 
                    onClick={() => {setSearchTerm(""); setSelectedIndustry("All Industries");}}
                    className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </main>

          </div>
        </div>
      </div>

      {/* Why Choose Blueboxx Section */}
      <WhyChooseBlueboxxSection />
      {/* Success Stories Section */}
      <TestimonialsSection />
    </MainLayout>
  );
}
