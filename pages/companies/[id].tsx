import { getImageUrl } from "../../src/lib/imageUtils";
import { useRouter } from "next/router";
import { MainLayout } from "../../src/layout/MainLayout";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { 
  Building2, MapPin, Users, Globe, ExternalLink, 
  Briefcase, CheckCircle2, DollarSign, ChevronRight, ArrowLeft
} from "lucide-react";
import { SEO } from "../../src/components/seo/SEO";
import { useState, useEffect } from "react";
import { CompanyService, CMSCompany } from "../../src/lib/api/CompanyService";
import Link from "next/link";

export default function CompanyProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [companyData, setCompanyData] = useState<CMSCompany | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = CompanyService.getCompanyByIdOrSlug(id as string);
    if (found) {
      setCompanyData(found);
    } else {
      CompanyService.getAll().then(() => {
        const refound = CompanyService.getCompanyByIdOrSlug(id as string);
        if (refound) setCompanyData(refound);
      });
    }
  }, [id]);

  // Derived or fallback data for the company
  const company = {
    name: companyData?.name || "Corporate Partner",
    industry: companyData?.industry || "IT & Software Development",
    location: companyData?.location || "India",
    size: "50 - 500 Employees",
    website: companyData?.website_url || "https://blueboxxda.com",
    logo: companyData?.logoUrl || "/logo/damyaa.png",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    about: `${companyData?.name || "This company"} is a verified corporate partner of Blueboxx DA. Through our partnership, students and graduates gain practical industry exposure, live project opportunities, and direct hiring pathways across high-growth corporate domains.`,
    perks: [
      "Practical Hands-on Projects", "Direct Industry Mentorship", 
      "Placement & Internship Opportunities", "Certificate of Experience", 
      "Verified Corporate Endorsement", "Skill-based Hiring"
    ]
  };

  const openRoles = [
    { id: 1, title: "Frontend Developer Intern", type: "Internship", location: "Remote", salary: "₹50k/month" },
    { id: 2, title: "React Native Engineer", type: "Full-Time", location: "Mumbai", salary: "₹18LPA" },
    { id: 3, title: "Product Designer (UI/UX)", type: "Full-Time", location: "Remote", salary: "₹15LPA" },
  ];

  return (
    <>
      <SEO 
        title={`${company.name} | Hiring Partner at Blueboxx DA`}
        description={company.about.substring(0, 160)}
      />
      <MainLayout>
        {/* Cover Image & Header */}
        <div className="relative pt-[72px] md:pt-[80px]">
          <div className="container mx-auto px-4 max-w-7xl pt-4 pb-2">
            <Link href="/companies" className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-[#1B2A6B] transition-colors">
              <ArrowLeft size={14} /> Back to Companies Directory
            </Link>
          </div>
          <div className="h-48 md:h-72 w-full relative">
            <div className="absolute inset-0 bg-[#0d1635]/60 z-10" />
            <img src={getImageUrl(company.cover)} alt="Office" className="w-full h-full object-cover" />
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative -mt-16 md:-mt-24 z-20">
            <div className="flex flex-col md:flex-row gap-6 md:items-end mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] shrink-0 flex items-center justify-center">
                <img src={getImageUrl(company.logo)} alt={company.name} className="max-w-full max-h-full object-contain" />
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5"><Building2 size={16} className="text-[#1B2A6B]"/> {company.industry}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {company.location}</span>
                  <span className="flex items-center gap-1.5"><Users size={16} className="text-slate-400"/> {company.size}</span>
                </div>
              </div>

              <div className="flex gap-3 pb-2 w-full md:w-auto">
                <a href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                  <Button variant="outline" className="w-full border-slate-200 text-[#1B2A6B] font-extrabold h-12 rounded-xl text-sm shadow-sm gap-2 uppercase tracking-wider">
                    <Globe size={16} /> Visit Website <ExternalLink size={14} />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-7xl pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column (About & Perks) */}
          <div className="flex-1 lg:max-w-3xl space-y-12 mt-6">
            
            {/* About Us */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-4">About Us</h2>
              <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                {company.about}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h2 className="text-lg font-black text-slate-800 mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {["React.js", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"].map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Perks & Benefits */}
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Perks & Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle2 size={20} className="text-[#C9A227] shrink-0 mt-0.5" />
                    <span className="text-sm font-bold text-slate-700">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Open Roles) */}
          <div className="w-full lg:w-[420px] shrink-0 mt-6 lg:mt-0">
            <div className="sticky top-32 space-y-6">
              
              <Card className="bg-white border border-slate-100 shadow-[0_20px_40px_rgba(27,42,107,0.06)] rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Briefcase size={20} className="text-[#1B2A6B]" /> Open Roles
                  </h2>
                  <Badge className="bg-[#1B2A6B] text-white border-none">{openRoles.length}</Badge>
                </div>
                
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {openRoles.map((role) => (
                      <div key={role.id} className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-extrabold text-[15px] text-slate-800 group-hover:text-[#1B2A6B] transition-colors">{role.title}</h3>
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 text-[9px] uppercase tracking-widest font-extrabold">{role.type}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-[12px] font-semibold text-slate-500 mb-4">
                          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {role.location}</span>
                          <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-500"/> {role.salary}</span>
                        </div>

                        <Button className="w-full bg-white border border-slate-200 text-[#1B2A6B] hover:border-[#1B2A6B] font-extrabold h-10 rounded-xl text-xs transition-colors group-hover:bg-[#1B2A6B] group-hover:text-white">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </MainLayout>
    </>
  );
}
