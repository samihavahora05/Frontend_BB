import { MainLayout } from "../src/layout/MainLayout";
import { Award } from "lucide-react";
import { motion } from "framer-motion";

import useSWR from "swr";
import { fetcher } from "../src/lib/fetcher";
import { partnerCompanies } from "../src/data/companies"; // fallback
import { SEO } from "../src/components/seo/SEO";
import { WhyChooseBlueboxxSection } from "../src/sections/WhyChooseBlueboxxSection";

export default function PlacementPartnersPage() {
  const { data } = useSWR("/public/cms/placement-partners", fetcher);
  const partnersList = (data && data.length > 20) ? data : partnerCompanies; // force local array to show all partners

  return (
    <>
      <SEO title="Our Placement Partners & Top Recruiters | Blueboxx DA" description="Discover the elite hiring network and placement partners working with Blueboxx DA to hire our top talent." />
      <MainLayout>
        {/* Hero Section */}
      <div className="pt-24 pb-16 bg-[#0d1635] text-white relative overflow-hidden">
        {/* Premium Grid Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white uppercase tracking-[0.2em] mb-6"
          >
            Placement Partners
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Our Elite <br className="hidden md:block" />
            <span className="text-[#C9A227]">Hiring Network.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We collaborate with industry leaders and innovative startups to ensure our learners land their dream roles.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partnersList.map((partner: any, i: number) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="group relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/40 border border-slate-200/80 hover:border-amber-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(201,162,39,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full rounded-[28px] p-6 cursor-pointer text-center">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-600 to-[#1B2A6B] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Borderless Floating Logo Stage */}
                  <div className="w-full h-32 shrink-0 flex items-center justify-center relative p-3 my-1">
                    <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-slate-200/60 via-slate-100/40 to-amber-100/30 blur-md group-hover:from-amber-200/50 group-hover:via-indigo-100/40 group-hover:to-blue-100/30 transition-all duration-500 pointer-events-none" />
                    <img
                      src={partner.logo_url || partner.logoUrl}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain filter group-hover:scale-110 transition-transform duration-500 relative z-10 [filter:drop-shadow(0_4px_10px_rgba(15,23,42,0.55))_drop-shadow(0_0_1.5px_rgba(15,23,42,0.75))]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=1B2A6B&color=fff&bold=true`;
                      }}
                    />
                  </div>

                  <div className="w-full my-3 relative z-10">
                    <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-[#1B2A6B] transition-colors leading-tight line-clamp-1">
                      {partner.name}
                    </h3>
                    
                    <span className="inline-block px-3.5 py-1 rounded-full bg-slate-200/50 text-slate-700 text-[11px] font-bold group-hover:bg-[#1B2A6B] group-hover:text-white transition-all duration-300">
                      {partner.industry?.name || partner.industry || "Corporate Partner"}
                    </span>
                  </div>

                  <div className="mt-auto pt-3 w-full border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#C9A227] relative z-10">
                    <Award size={14} /> Verified Partner
                  </div>
                </div>
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
