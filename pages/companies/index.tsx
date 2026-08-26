import React, { useState, useMemo } from "react";
import { MainLayout } from "../../src/layout/MainLayout";
import { partnerCompanies } from "../../src/data/companies";
import {
  Building2, ArrowRight, PlayCircle, ExternalLink, Layers,
  Globe, Smartphone, Monitor, TrendingUp, Compass, Award,
  Search, X, ShieldCheck, Filter, Sparkles, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "../../src/lib/fetcher";
import { SEO } from "../../src/components/seo/SEO";
import { WhyChooseBlueboxxSection } from "../../src/sections/WhyChooseBlueboxxSection";
import { TestimonialsSection } from "../../src/sections/TestimonialsSection";

// Fallback seed projects for portfolios if database is empty/loading
const mockProjects = [
  {
    id: 1,
    title: "Brand Identity & 3D Promo Film",
    studio: "Anibrain Studios",
    category: "3D Animation",
    icon: "Monitor",
    color: "bg-purple-50 text-purple-700 border-purple-200/80",
    image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    description: "End-to-end brand film featuring photorealistic 3D product animation and motion graphics for theatrical release.",
    tags: ["3D Modeling", "VFX", "Motion Graphics"],
    duration: "8 weeks",
    deliverables: "Brand Film + 3 Teasers",
  },
  {
    id: 2,
    title: "Corporate E-Learning Platform",
    studio: "AISECT",
    category: "Web Development",
    icon: "Globe",
    color: "bg-blue-50 text-blue-700 border-blue-200/80",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    description: "Custom LMS web platform with live sessions, course tracking, certificate generation and payment integration.",
    tags: ["React", "Node.js", "MongoDB"],
    duration: "12 weeks",
    deliverables: "Full Platform + Admin Dashboard",
  },
  {
    id: 3,
    title: "Social Media Growth Campaign",
    studio: "Lakshya Digital",
    category: "Digital Marketing",
    icon: "TrendingUp",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    image_url: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80",
    description: "360 degree digital marketing campaign across Instagram, YouTube and Google Ads delivering 3x ROI in 90 days.",
    tags: ["SEO", "Paid Ads", "Content Strategy"],
    duration: "3 months",
    deliverables: "Campaign Report + Creative Assets",
  },
  {
    id: 4,
    title: "2D Explainer Series",
    studio: "DQ Entertainment",
    category: "2D Animation",
    icon: "PlayCircle",
    color: "bg-amber-50 text-amber-700 border-amber-200/80",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    description: "Series of 10 animated explainer videos for a children's educational brand with custom characters and storyboards.",
    tags: ["2D Animation", "Storyboarding", "Voice-over"],
    duration: "6 weeks",
    deliverables: "10 Animated Videos",
  },
  {
    id: 5,
    title: "Product Packaging & Brand Design",
    studio: "Vistaprint India",
    category: "Graphic Design",
    icon: "Layers",
    color: "bg-rose-50 text-rose-700 border-rose-200/80",
    image_url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
    description: "Complete brand identity redesign including logo, packaging, stationery, and brand guidelines for a product line.",
    tags: ["Logo Design", "Packaging", "Brand Identity"],
    duration: "4 weeks",
    deliverables: "Brand Kit + Style Guide",
  },
  {
    id: 6,
    title: "Mobile App UI/UX Design",
    studio: "Hopmotion",
    category: "UI/UX Design",
    icon: "Smartphone",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    image_url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80",
    description: "Full mobile app UI/UX design with user research, wireframes, prototypes and a pixel-perfect Figma design system.",
    tags: ["Figma", "UX Research", "Prototyping"],
    duration: "5 weeks",
    deliverables: "Figma Prototype + Design System",
  },
];

// Helper component for borderless floating company logo rendering suitable for all logo colors
const CompanyLogo = ({ company }: { company: any }) => {
  const [imgError, setImgError] = useState(false);
  const logoUrl = company.logo_url || company.logoUrl || company.logo;

  const initials = (company.name || "Company")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full h-32 shrink-0 flex items-center justify-center relative p-3 my-1">
      {/* Ambient background glow ring behind logo */}
      <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-slate-200/60 via-slate-100/40 to-amber-100/30 blur-md group-hover:from-amber-200/60 group-hover:via-indigo-100/50 group-hover:to-blue-100/40 transition-all duration-500 pointer-events-none" />
      
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={company.name}
          className="max-w-full max-h-full object-contain filter group-hover:scale-110 transition-transform duration-500 relative z-10 [filter:drop-shadow(0_4px_10px_rgba(15,23,42,0.55))_drop-shadow(0_0_1.5px_rgba(15,23,42,0.75))]"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1B2A6B] via-indigo-600 to-[#C9A227] flex items-center justify-center font-black text-lg text-white shadow-lg border border-white/30 relative z-10 group-hover:scale-105 transition-transform">
          {initials}
        </div>
      )}
    </div>
  );
};

export default function CompaniesPublicPage() {
  const [activeProjectCategory, setActiveProjectCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const iconMap: Record<string, React.ReactNode> = {
    Monitor: <Monitor size={14} />,
    Globe: <Globe size={14} />,
    TrendingUp: <TrendingUp size={14} />,
    PlayCircle: <PlayCircle size={14} />,
    Layers: <Layers size={14} />,
    Smartphone: <Smartphone size={14} />,
  };

  // --- DYNAMIC DATABASE API FETCHING ---
  // 1. Portfolios / Client Deliverables Endpoint
  const { data: apiPortfolios, isLoading: isPortfoliosLoading } = useSWR("/public/cms/portfolios", fetcher);

  // 2. Corporate Companies / Hiring Partners Endpoint
  const { data: apiCompanies, isLoading: isCompaniesLoading } = useSWR("/public/cms/companies", fetcher);

  // Dynamic Portfolio / Project Data
  const projectsList = useMemo(() => {
    if (apiPortfolios && Array.isArray(apiPortfolios) && apiPortfolios.length > 0) {
      return apiPortfolios;
    }
    return mockProjects;
  }, [apiPortfolios]);

  // Dynamically extract categories from Portfolio data
  const projectCategories = useMemo(() => {
    const catSet = new Set<string>();
    projectsList.forEach((p: any) => {
      if (p.category && typeof p.category === "string" && p.category.trim() !== "") {
        catSet.add(p.category.trim());
      }
    });
    return ["All", ...Array.from(catSet).sort()];
  }, [projectsList]);

  const filteredProjects = useMemo(() => {
    if (activeProjectCategory === "All") return projectsList;
    return projectsList.filter(
      (p: any) => (p.category || "").toLowerCase() === activeProjectCategory.toLowerCase()
    );
  }, [projectsList, activeProjectCategory]);

  // Dynamic Companies Data (Merges API companies with fallback partnerCompanies array)
  const companiesList = useMemo(() => {
    if (apiCompanies && Array.isArray(apiCompanies) && apiCompanies.length > 0) {
      return apiCompanies;
    }
    return partnerCompanies;
  }, [apiCompanies]);

  // Dynamically extract unique industries from Companies data
  const availableIndustries = useMemo(() => {
    const indSet = new Set<string>();
    companiesList.forEach((c: any) => {
      const ind = c.industry?.name || c.industry;
      if (ind && typeof ind === "string" && ind.trim() !== "") {
        indSet.add(ind.trim());
      }
    });
    return ["All", ...Array.from(indSet).sort()];
  }, [companiesList]);

  // Filter companies based on search query & industry
  const filteredCompanies = useMemo(() => {
    return companiesList.filter((company: any) => {
      const name = (company.name || "").toLowerCase();
      const ind = (company.industry?.name || company.industry || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || ind.includes(query);
      const matchesIndustry =
        selectedIndustry === "All" ||
        ind === selectedIndustry.toLowerCase() ||
        ind.includes(selectedIndustry.toLowerCase());

      return matchesSearch && matchesIndustry;
    });
  }, [companiesList, searchQuery, selectedIndustry]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleIndustrySelect = (ind: string) => {
    setSelectedIndustry(ind);
  };

  return (
    <>
      <SEO
        title="Top Corporate Hiring Partners & Client Projects | Blueboxx DA"
        description="Explore 60+ top corporate hiring partners, client project deliverables, and career placement networks with Blueboxx DA."
        keywords="Hire Developers, Hire Interns, Campus Hiring, Recruit Freshers, Client Projects, Corporate Partners, Blueboxx DA"
      />
      <MainLayout>
        {/* HERO SECTION */}
        <div className="pt-28 pb-20 bg-[#080d21] text-white relative overflow-hidden">
          {/* Subtle Ambient Light Grid & Gradient Orbs */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-amber-500/20 to-[#1B2A6B]/50 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black text-amber-300 uppercase tracking-[0.2em] mb-6 backdrop-blur-md shadow-lg"
            >
              <Sparkles size={14} className="text-[#C9A227]" />
              <span>Global Hiring & Client Deliverables Network</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight"
            >
              Collaborate with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                Industry Leaders & Global Brands.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-12"
            >
              Over <strong>60+ corporate hiring partners</strong> actively collaborate with Blueboxx DA to recruit job-ready talent and execute high-impact client deliverables across IT, 3D Animation, Marketing, and Consulting.
            </motion.p>

            {/* Live Metric Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4"
            >
              {[
                { label: "Corporate Partners", value: "60+", icon: <Building2 className="text-amber-400" size={18} /> },
                { label: "Live Deliverables", value: "100+", icon: <Layers className="text-indigo-400" size={18} /> },
                { label: "Placement Rate", value: "98.4%", icon: <CheckCircle2 className="text-emerald-400" size={18} /> },
                { label: "Active Domains", value: "15+", icon: <Compass className="text-blue-400" size={18} /> },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center hover:border-amber-400/40 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    {stat.icon}
                    <span className="text-2xl md:text-3xl font-black text-white">{stat.value}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* SECTION 1: FEATURED CLIENT DELIVERABLES / PORTFOLIOS */}
        <div className="py-20 bg-white relative overflow-hidden border-b border-slate-200/80">
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B2A6B]/10 text-[#1B2A6B] border border-[#1B2A6B]/20 text-xs font-extrabold tracking-wide mb-4">
                <Compass size={14} />
                <span>Project Portfolios</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Featured Deliverables
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Real-world client work managed and executed across technical and creative domains.
              </p>
            </motion.div>

            {/* Dynamic Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {projectCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveProjectCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeProjectCategory === cat
                      ? "bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-md shadow-indigo-100"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dynamic Project Cards Grid */}
            {isPortfoliosLoading && !apiPortfolios ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-3xl h-80 animate-pulse p-6" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project: any, i: number) => {
                  const clientName = project.studio || project.client || "Partner Studio";
                  const categoryName = project.category || "Project Deliverable";
                  const imageUrl = project.image_url || project.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80";
                  const tagsList: string[] = Array.isArray(project.tags)
                    ? project.tags
                    : (typeof project.tags === "string" ? JSON.parse(project.tags || "[]") : []);

                  return (
                    <motion.div
                      key={project.id || i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: (i % 3) * 0.04 }}
                      whileHover={{ y: -6 }}
                      className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-[#1B2A6B]/40 hover:shadow-[0_20px_45px_rgba(27,42,107,0.12)] transition-all duration-300 flex flex-col h-full cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border shadow-sm bg-white/90 backdrop-blur-md text-[#1B2A6B] border-slate-200/60">
                          {iconMap[project.icon] || <Monitor size={14} />}
                          <span>{categoryName}</span>
                        </div>

                        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold shadow-sm border border-slate-200/40">
                          {clientName}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#1B2A6B] transition-colors leading-tight">
                          {project.title}
                        </h3>

                        <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3">
                          {project.description}
                        </p>

                        {tagsList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                            {tagsList.map(tag => (
                              <span key={tag} className="px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-bold border border-slate-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-3">
                            {project.duration && <span>⏱ {project.duration}</span>}
                            {project.duration && project.deliverables && <span>•</span>}
                            {project.deliverables && <span>📦 {project.deliverables}</span>}
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#1B2A6B]/10 group-hover:text-[#1B2A6B] flex items-center justify-center transition-all duration-300 border border-slate-200/60">
                            <ExternalLink size={12} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <p className="text-slate-500 text-xs font-semibold mb-4 uppercase tracking-wider">Interested in working with us?</p>
              <Link href="/contact">
                <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B2A6B] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#0d1635] transition-all shadow-md hover:-translate-y-0.5">
                  Start a Project <ArrowRight size={14} />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* SECTION 2: CORPORATE HIRING PARTNERS DIRECTORY */}
        <div className="py-20 bg-slate-50/80 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl relative z-10">

            {/* Header & Search Control */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B2A6B]/10 text-[#1B2A6B] border border-[#1B2A6B]/20 text-xs font-extrabold tracking-wide mb-3">
                  <ShieldCheck size={14} className="text-[#1B2A6B]" />
                  <span>Verified Corporate Network</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Corporate Partners Directory
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Explore 60+ companies actively recruiting and offering placement opportunities through Blueboxx DA.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by company name or industry..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/10 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Industry Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider flex items-center gap-1">
                <Filter size={12} /> Industry:
              </span>
              {availableIndustries.slice(0, 10).map(ind => (
                <button
                  key={ind}
                  onClick={() => handleIndustrySelect(ind)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${selectedIndustry === ind
                      ? "bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            {/* Results Count & Reset */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500">
                Showing <strong className="text-slate-900">{filteredCompanies.length}</strong> {filteredCompanies.length === 1 ? 'Company' : 'Companies'}
              </span>
              {(searchQuery || selectedIndustry !== "All") && (
                <button
                  onClick={() => { setSearchQuery(""); setSelectedIndustry("All"); }}
                  className="text-xs font-bold text-[#1B2A6B] hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Dynamic Corporate Partners Directory Grid */}
            <CompanyDirectoryGrid
              companies={filteredCompanies}
              isLoading={isCompaniesLoading && !apiCompanies}
            />

            {/* SECTION 3: PARTNER CTA BANNER */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 rounded-[32px] bg-gradient-to-r from-[#0a0f24] via-[#1B2A6B] to-[#0a0f24] text-white p-8 md:p-12 relative overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-black text-amber-300 uppercase tracking-widest mb-4">
                    <Building2 size={14} /> Corporate & Recruiter Hub
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black mb-3 leading-snug">
                    Looking to Hire Trained Talent or Outsource Projects?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Partner with Blueboxx DA to gain access to pre-vetted interns, developers, designers, and custom project execution teams.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                  <Link href="/contact">
                    <button className="px-6 py-3.5 rounded-xl bg-[#C9A227] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg hover:scale-105">
                      Become a Partner
                    </button>
                  </Link>
                  <Link href="/book-consultation">
                    <button className="px-6 py-3.5 rounded-xl bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-white/20 transition-all border border-white/20">
                      Request Consultation
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <WhyChooseBlueboxxSection />
        <TestimonialsSection />
      </MainLayout>
    </>
  );
}

function CompanyDirectoryGrid({
  companies,
  isLoading,
}: {
  companies: any[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/80 border border-slate-200/80 rounded-[28px] p-6 animate-pulse flex flex-col items-center justify-between h-[310px]"
          >
            <div className="w-full h-32 bg-slate-200/60 rounded-2xl mb-4" />
            <div className="w-full space-y-2 flex flex-col items-center">
              <div className="h-4 bg-slate-200/60 rounded w-3/4 mb-1" />
              <div className="h-3 bg-slate-200/60 rounded w-1/2" />
            </div>
            <div className="w-full h-3 bg-slate-100 rounded mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="py-20 text-center bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-sm">
        <Building2 size={48} className="mx-auto text-slate-300 mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">No partner companies available</h3>
        <p className="text-slate-400 text-xs">There are no hiring partners matching your selection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {companies.map((company: any, idx: number) => {
        const industryName = company.industry?.name || company.industry || 'Corporate Partner';
        const locationText = company.location || company.city || 'India / Remote';

        return (
          <motion.div
            key={company.id || company.slug || idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: (idx % 4) * 0.04 }}
          >
            <Link href={`/companies/${company.id || 'c1'}`} className="block h-full">
              <div className="group relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/40 border border-slate-200/80 hover:border-amber-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(201,162,39,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full rounded-[28px] p-5 cursor-pointer">
                {/* Top Subtle Hover Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-600 to-[#1B2A6B] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Bar Badges */}
                <div className="flex items-center justify-between gap-2 relative z-10 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider">
                    <ShieldCheck size={11} className="text-emerald-600" /> Verified
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 truncate max-w-[130px]">
                    📍 {locationText}
                  </span>
                </div>

                {/* Borderless Floating Logo Stage */}
                <CompanyLogo company={company} />

                {/* Company Name & Industry Tag */}
                <div className="text-center relative z-10 my-2">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#1B2A6B] transition-colors leading-snug line-clamp-1">
                    {company.name}
                  </h3>
                  
                  <div className="mt-2 flex flex-wrap items-center justify-center">
                    <span className="px-3.5 py-1 rounded-full bg-slate-200/50 text-slate-700 text-[11px] font-bold group-hover:bg-[#1B2A6B] group-hover:text-white transition-all duration-300 line-clamp-1">
                      {industryName}
                    </span>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-extrabold relative z-10 w-full">
                  <span className="text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Award size={12} /> Top Partner
                  </span>
                  <span className="text-[#1B2A6B] flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-300">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
