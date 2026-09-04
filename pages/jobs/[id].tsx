import { getImageUrl } from "../../src/lib/imageUtils";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../src/layout/MainLayout";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { 
  MapPin, Briefcase, DollarSign, Clock, Users, Building2, 
  CheckCircle2, ChevronRight, Share2, Bookmark, FileText, Loader2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { SEO } from "../../src/components/seo/SEO";
import api from "../../src/lib/axios";
import { mutate } from "swr";

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        const res = await api.get(`/public/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleBookmark = async () => {
    try {
      const res = await api.post(`/public/jobs/${id}/bookmark`);
      if (res.data.success) {
        setJob({ ...job, is_bookmarked: res.data.bookmarked });
        toast.success(res.data.bookmarked ? "Job bookmarked!" : "Bookmark removed");
        mutate("/student/wishlist");
      }
    } catch (err) {
      toast.error("Please login to bookmark jobs");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#1B2A6B]" />
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <h2 className="text-xl font-bold text-slate-800">Job not found.</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <SEO 
        title={job.title ? `${job.title} at ${job.company_name} | Blueboxx DA` : "Job Details | Blueboxx DA"}
        description={job.description ? job.description.substring(0, 160) : "Apply for this job on Blueboxx DA."}
      />
      <MainLayout>
        {/* Header Section */}
      <div className="bg-slate-50 border-b border-slate-200 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-md border border-slate-100 shrink-0">
                <img src={getImageUrl(job.company_logo || `https://ui-avatars.com/api/?name=${job.company_name}&background=random`)} alt={job.company_name} className="w-full h-full rounded-xl object-cover" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-800">{job.title}</h1>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none ml-2 shadow-sm font-extrabold uppercase tracking-wider text-[10px]">{job.job_type}</Badge>
                </div>
                <div className="text-lg font-bold text-[#1B2A6B] mb-4 flex items-center gap-2">
                  <Building2 size={20} /> {job.company_name}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><MapPin size={16} className="text-slate-400"/> {job.location}</span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><DollarSign size={16} className="text-emerald-500"/> {job.hide_salary ? 'Undisclosed' : `₹${job.salary_min} - ₹${job.salary_max}`}</span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"><Briefcase size={16} className="text-amber-500"/> {job.experience_level}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <Button variant="outline" className="w-12 h-12 p-0 rounded-xl border-slate-200 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 shrink-0">
                <Share2 size={20} />
              </Button>
              <Button onClick={handleBookmark} variant="outline" className={`w-12 h-12 p-0 rounded-xl border-slate-200 shrink-0 ${job.is_bookmarked ? 'text-[#C9A227] bg-amber-50' : 'text-slate-400 hover:text-[#C9A227] hover:bg-amber-50'}`}>
                <Bookmark size={20} className={job.is_bookmarked ? 'fill-current' : ''} />
              </Button>
              {job.has_applied ? (
                <Button disabled className="flex-1 lg:w-48 bg-emerald-600 text-white font-black h-12 rounded-xl text-sm shadow-[0_4px_15px_rgba(16,185,129,0.2)] transition-all gap-2 uppercase tracking-wider">
                  <CheckCircle2 size={16} /> Applied
                </Button>
              ) : (
                <Link href={`/apply/job/${job.id}`}>
                  <Button className="flex-1 lg:w-48 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-black h-12 rounded-xl text-sm shadow-[0_4px_15px_rgba(27,42,107,0.2)] transition-all gap-2 uppercase tracking-wider">
                    Apply Now <ChevronRight size={16} />
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column (Job Details) */}
          <div className="flex-1 lg:max-w-3xl space-y-12">
            
            {job.required_skills?.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-[#1B2A6B] transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.description && (
              <div>
                <h2 className="text-xl font-black text-slate-800 mb-6">Job Description</h2>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            )}

            {job.responsibilities?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-slate-800 mb-6">Key Responsibilities</h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#1B2A6B]"></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-slate-800 mb-6">What We're Looking For</h2>
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <ul className="space-y-4">
                    {job.requirements.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {job.company_description && (
              <div>
                <h2 className="text-xl font-black text-slate-800 mb-4">About {job.company_name}</h2>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                  {job.company_description}
                </p>
                <Button variant="outline" className="border-[#1B2A6B]/20 text-[#1B2A6B] h-10 text-[11px] font-extrabold uppercase tracking-wider rounded-lg px-6 hover:bg-blue-50">
                  View Company Profile
                </Button>
              </div>
            )}

          </div>

          {/* Right Column (Sticky Apply Card) */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-32 space-y-6">
              
              <Card className="bg-white border border-slate-100 shadow-[0_20px_40px_rgba(27,42,107,0.06)] rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-500 flex items-center gap-2"><Clock size={16}/> Posted</span>
                      <span className="font-black text-slate-800">{job.posted_at}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-500 flex items-center gap-2"><Users size={16}/> Applicants</span>
                      <span className="font-black text-slate-800">{job.application_count} applied</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {job.has_applied ? (
                      <Button disabled className="w-full bg-emerald-600 text-white font-black h-14 rounded-xl text-sm shadow-[0_8px_20px_rgba(16,185,129,0.2)] transition-all gap-2 uppercase tracking-wider">
                        <CheckCircle2 size={18} /> You Have Applied
                      </Button>
                    ) : (
                      <Link href={`/apply/job/${job.id}`}>
                        <Button className="w-full bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-black h-14 rounded-xl text-sm shadow-[0_8px_20px_rgba(27,42,107,0.2)] transition-all hover:-translate-y-1 gap-2 uppercase tracking-wider">
                          <FileText size={18} /> Apply with Profile
                        </Button>
                      </Link>
                    )}
                    <p className="text-center text-[11px] font-bold text-slate-400 mt-2">
                      Uses your BlueBoxx student profile & resume.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs Promo */}
              <Card className="bg-gradient-to-br from-[#0d1635] to-[#1B2A6B] border-none shadow-lg rounded-3xl overflow-hidden text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-6 relative z-10">
                  <h3 className="font-black text-lg mb-2">Want to ace the interview?</h3>
                  <p className="text-xs text-slate-300 font-medium mb-5 leading-relaxed">Book a 1:1 session with an expert who works at TechCorp.</p>
                  <Button className="w-full h-10 text-[10px] font-black bg-[#C9A227] hover:bg-amber-400 text-[#0d1635] transition-all rounded-xl shadow-lg uppercase tracking-wider border-none">
                    Find a Mentor
                  </Button>
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
