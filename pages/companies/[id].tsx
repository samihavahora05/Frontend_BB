import { useRouter } from "next/router";
import { MainLayout } from "../../src/layout/MainLayout";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { 
  Building2, MapPin, Users, Globe, ExternalLink, 
  Briefcase, CheckCircle2, DollarSign, ChevronRight
} from "lucide-react";
import { SEO } from "../../src/components/seo/SEO";

export default function CompanyProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  // Mock data for the company
  const company = {
    name: "TechCorp Inc.",
    industry: "Financial Technology (FinTech)",
    location: "Mumbai, India (Global Remote)",
    size: "500 - 1000 Employees",
    website: "www.techcorp.example.com",
    logo: "https://ui-avatars.com/api/?name=TechCorp&background=0d1635&color=fff",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    about: "TechCorp is a leading financial technology company focused on democratizing access to enterprise-grade tools for small and medium businesses. Founded in 2020, we've rapidly grown into a global team of passionate engineers, designers, and thinkers who are reshaping the future of digital finance.",
    perks: [
      "Flexible Remote Work", "Comprehensive Health Insurance", 
      "Learning & Development Stipend", "Stock Options (ESOPs)", 
      "Unlimited Paid Time Off", "Latest MacBook Pro provided"
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
        <div className="h-48 md:h-72 w-full relative">
          <div className="absolute inset-0 bg-[#0d1635]/60 z-10" />
          <img src={company.cover} alt="Office" className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative -mt-16 md:-mt-24 z-20">
          <div className="flex flex-col md:flex-row gap-6 md:items-end mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] shrink-0">
              <img src={company.logo} alt={company.name} className="w-full h-full rounded-2xl object-cover" />
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
              <Button variant="outline" className="flex-1 md:flex-none border-slate-200 text-[#1B2A6B] font-extrabold h-12 rounded-xl text-sm shadow-sm gap-2 uppercase tracking-wider">
                <Globe size={16} /> Visit Website
              </Button>
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
