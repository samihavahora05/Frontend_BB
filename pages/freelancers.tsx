import { useState, useMemo } from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { SEO } from "../src/components/seo/SEO";
import { Card, CardContent } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { TopSearchBar } from "../src/components/ui/TopSearchBar";
import { WhyChooseBlueboxxSection } from "../src/sections/WhyChooseBlueboxxSection";
import { TestimonialsSection } from "../src/sections/TestimonialsSection";
import { PartnersSection } from "../src/sections/PartnersSection";
import { 
  Star, Briefcase, MapPin, CheckCircle2, Clock, Globe, 
  ArrowRight, Sparkles, Filter, Mail, ExternalLink, ShieldCheck,
  Send, Users, Award, Code2, Palette, Video, Megaphone, Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

interface Freelancer {
  id: number;
  name: string;
  role: string;
  category: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: string;
  completedProjects: number;
  location: string;
  bio: string;
  skills: string[];
  isVerified: boolean;
  isAvailable: boolean;
  featuredProject: string;
}

const CATEGORIES = [
  "All Domains",
  "Full Stack & Web",
  "UI/UX Design",
  "3D & Animation",
  "Video Editing",
  "Digital Marketing",
  "Mobile Apps"
];

const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Senior Full Stack & Next.js Developer",
    category: "Full Stack & Web",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    rating: 4.9,
    reviewsCount: 42,
    hourlyRate: "₹1,500/hr",
    completedProjects: 58,
    location: "Ahmedabad, India",
    bio: "Specializing in high-performance SaaS applications with React, Next.js, Laravel, and scalable cloud architectures.",
    skills: ["React", "Next.js", "Laravel", "Node.js", "TypeScript", "Tailwind CSS"],
    isVerified: true,
    isAvailable: true,
    featuredProject: "Enterprise CRM & Analytics Suite"
  },
  {
    id: 2,
    name: "Sneha Patel",
    role: "Lead UI/UX & Product Designer",
    category: "UI/UX Design",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    rating: 5.0,
    reviewsCount: 67,
    hourlyRate: "₹1,800/hr",
    completedProjects: 84,
    location: "Mumbai, India",
    bio: "Crafting human-centric interfaces, design systems, and micro-interactions for modern Web3 and Fintech brands.",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Mobile UI"],
    isVerified: true,
    isAvailable: true,
    featuredProject: "Fintech Mobile Wallet Redesign"
  },
  {
    id: 3,
    name: "Rohan Vora",
    role: "3D Artist & Motion Designer",
    category: "3D & Animation",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rating: 4.8,
    reviewsCount: 31,
    hourlyRate: "₹2,200/hr",
    completedProjects: 39,
    location: "Pune, India",
    bio: "Creating cinematic 3D product commercial animations, Blender visual assets, and game-ready low poly models.",
    skills: ["Blender", "Cinema 4D", "After Effects", "Product Rendering", "Unreal Engine"],
    isVerified: true,
    isAvailable: false,
    featuredProject: "Hyper-realistic Luxury Watch 3D Commercial"
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "Video Editor & Post-Production Specialist",
    category: "Video Editing",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    rating: 4.9,
    reviewsCount: 53,
    hourlyRate: "₹1,200/hr",
    completedProjects: 110,
    location: "Bengaluru, India",
    bio: "Crafting engaging reels, corporate brand documentaries, YouTube content, and storytelling that converts.",
    skills: ["Premiere Pro", "DaVinci Resolve", "Color Grading", "Sound Design", "Motion Graphics"],
    isVerified: true,
    isAvailable: true,
    featuredProject: "Viral Series with 5M+ Impressions"
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    role: "Mobile App Engineer (Flutter & iOS)",
    category: "Mobile Apps",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    rating: 4.8,
    reviewsCount: 29,
    hourlyRate: "₹1,600/hr",
    completedProjects: 34,
    location: "Delhi NCR, India",
    bio: "Building cross-platform iOS and Android apps with smooth 60fps animations, offline sync, and Razorpay/Stripe integrations.",
    skills: ["Flutter", "Dart", "Swift", "Firebase", "REST APIs", "App Store Deployment"],
    isVerified: true,
    isAvailable: true,
    featuredProject: "Quick-Commerce Grocery Delivery App"
  },
  {
    id: 6,
    name: "Pooja Mehta",
    role: "Performance Marketer & Growth Strategist",
    category: "Digital Marketing",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    rating: 5.0,
    reviewsCount: 38,
    hourlyRate: "₹1,400/hr",
    completedProjects: 46,
    location: "Surat, India",
    bio: "Scaling D2C brands with Meta ads, Google Performance Max, SEO optimization, and data-driven conversion funnels.",
    skills: ["Meta Ads", "Google Ads", "SEO", "Conversion Rate", "Analytics", "Email Marketing"],
    isVerified: true,
    isAvailable: true,
    featuredProject: "Scaled E-commerce brand to 4.2x ROAS"
  }
];

export default function FreelancersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Domains");
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);

  const filteredFreelancers = useMemo(() => {
    return MOCK_FREELANCERS.filter((f) => {
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = 
        selectedCategory === "All Domains" || f.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleHireClick = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Inquiry sent to ${selectedFreelancer?.name}! They will contact you shortly.`);
    setSelectedFreelancer(null);
  };

  return (
    <MainLayout>
      <SEO 
        title="Hire Verified Freelancers | Blueboxx Designs & Animation"
        description="Hire top vetted freelance developers, UI/UX designers, 3D animators, video editors, and digital marketers from the Blueboxx talent network."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#0d1635] text-white overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1B2A6B]/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C9A227]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-[#F2C94C] mb-6">
              <Sparkles size={14} /> Blueboxx Talent Cloud
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Hire Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] to-[#C9A227]">Freelance Talent</span> for Your Vision
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10 leading-relaxed">
              Connect directly with verified developers, UI/UX designers, 3D artists, and creators trained and vetted by Blueboxx Designs & Animation.
            </p>

            {/* Quick Stat Pill */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#F2C94C]" /> 100% Vetted Portfolios
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#F2C94C]" /> Fast Project Kickoff
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#F2C94C]" /> Guaranteed Quality Deliverables
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="py-16 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search & Filter Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-10">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, skill (React, 3D, Figma)..."
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="text-sm font-bold text-slate-600">
                Showing <span className="text-[#1B2A6B] font-extrabold">{filteredFreelancers.length}</span> Verified Freelancers
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredFreelancers.map((freelancer) => (
                <motion.div
                  key={freelancer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col justify-between border-slate-200/80 hover:border-[#1B2A6B]/40 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white group">
                    <CardContent className="p-7 flex flex-col flex-1">
                      
                      {/* Top Header: Avatar + Details */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative">
                          <img
                            src={freelancer.avatar}
                            alt={freelancer.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                          />
                          {freelancer.isAvailable && (
                            <span 
                              title="Available for hire"
                              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h3 className="text-lg font-black text-slate-900 truncate">
                              {freelancer.name}
                            </h3>
                            {freelancer.isVerified && (
                              <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-500 truncate mb-1">
                            {freelancer.role}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                              <Star size={13} fill="currentColor" /> {freelancer.rating}
                            </span>
                            <span>({freelancer.reviewsCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5">
                        {freelancer.bio}
                      </p>

                      {/* Featured Project */}
                      <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="font-extrabold text-slate-400 uppercase tracking-wider block text-[10px] mb-0.5">
                          Top Highlight
                        </span>
                        <span className="font-bold text-slate-800 line-clamp-1">
                          {freelancer.featuredProject}
                        </span>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {freelancer.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                        {freelancer.skills.length > 4 && (
                          <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-400 text-[11px] font-bold">
                            +{freelancer.skills.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Rate</span>
                          <span className="text-base font-black text-[#1B2A6B]">
                            {freelancer.hourlyRate}
                          </span>
                        </div>

                        <Button
                          variant="primary"
                          onClick={() => handleHireClick(freelancer)}
                          className="gap-2 px-5 py-2.5 rounded-xl font-bold text-xs"
                        >
                          Hire Talent <ArrowRight size={14} />
                        </Button>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredFreelancers.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-extrabold text-slate-800 mb-2">No Freelancers Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Try clearing your search query or switching categories.
              </p>
              <Button
                variant="outline"
                onClick={() => { setSearchQuery(""); setSelectedCategory("All Domains"); }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* Become a Freelancer CTA Banner */}
          <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B2A6B] to-[#0d1635] p-8 md:p-14 text-white shadow-xl">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#C9A227]/20 rounded-full blur-[80px]" />
            <div className="relative z-10 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[#F2C94C] text-xs font-bold inline-block mb-4">
                Join Blueboxx Network
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                Are You a Freelance Developer, Designer, or 3D Artist?
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                Get discovered by top startups, companies, and clients seeking verified talent. Build your verified portfolio with Blueboxx.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/contact?subject=FreelancerApplication">
                  <Button variant="secondary" className="gap-2 bg-[#F2C94C] hover:bg-[#C9A227] text-slate-950 font-extrabold px-6 py-3 h-auto shadow-lg">
                    Apply as a Freelancer <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="text-white border-2 border-white/60 bg-white/10 hover:bg-white hover:text-[#0d1635] font-bold px-6 py-3 h-auto backdrop-blur-md transition-all">
                    Explore Our Agency Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedFreelancer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => setSelectedFreelancer(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6">
                <img
                  src={selectedFreelancer.avatar}
                  alt={selectedFreelancer.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Hire {selectedFreelancer.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {selectedFreelancer.role} • {selectedFreelancer.hourlyRate}
                  </p>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Project Summary & Timeline</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brief description of requirements, deliverable timeline, and expected budget..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedFreelancer(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 gap-2 bg-[#1B2A6B] hover:bg-[#152052]"
                  >
                    Send Request <Send size={14} />
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <WhyChooseBlueboxxSection />
      <TestimonialsSection />
      <PartnersSection />
    </MainLayout>
  );
}
