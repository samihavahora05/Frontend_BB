import { getImageUrl } from "../../src/lib/imageUtils";
import { useEffect, useState } from "react";
import { MainLayout } from "../../src/layout/MainLayout";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  Building, MapPin, Clock, DollarSign, Briefcase, 
  CheckCircle2, Share2, Bookmark, Loader2, ArrowRight,
  Lock, Sparkles, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import api from "../../src/lib/axios";
import toast from "react-hot-toast";
import { SEO } from "../../src/components/seo/SEO";
import { useAuth } from "../../src/context/AuthContext";
import { getOpportunityPermission } from "../../src/lib/opportunityPermissions";
import { RoleChangeModal } from "../../src/components/common/RoleChangeModal";
import { AuthRequiredModal } from "../../src/components/common/AuthRequiredModal";

export default function InternshipDetailsPage() {
  const router = useRouter();
  const { slug: id } = router.query;
  const [internship, setInternship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetchInternship = async () => {
      try {
        const res = await api.get(`/public/internships/${id}`);
        if (res.data.success) {
          setInternship(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load internship details.");
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save internships");
      return;
    }

    try {
      if (internship.is_bookmarked) {
        await api.delete(`/student/save/internship/${internship.id}`);
        setInternship({ ...internship, is_bookmarked: false });
        toast.success("Bookmark removed");
      } else {
        await api.post(`/student/save/internship/${internship.id}`);
        setInternship({ ...internship, is_bookmarked: true });
        toast.success("Internship saved!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save internship");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#1B2A6B]" />
        </div>
        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          actionType="internship"
          itemTitle={internship?.title}
          returnUrl={`/apply/internship/${internship?.id}`}
        />
      </MainLayout>
    );
  }

  if (!internship) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <h2 className="text-xl font-bold text-slate-800">Internship not found.</h2>
        </div>
        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          actionType="internship"
          itemTitle={internship?.title}
          returnUrl={`/apply/internship/${internship?.id}`}
        />
      </MainLayout>
    );
  }

  const roleTitle = internship.title;
  const isExpired = internship.application_deadline && new Date(internship.application_deadline) < new Date(new Date().setHours(0,0,0,0));
  const isClosed = internship.status === 'closed' || isExpired;
  const perm = getOpportunityPermission(user?.role, 'internship');

  return (
    <>
      <SEO 
        title={internship.title ? `${internship.title} Internship at ${internship.company_name} | Blueboxx DA` : "Internship Details | Blueboxx DA"}
        description={internship.description ? internship.description.substring(0, 160) : "Apply for this internship on Blueboxx DA."}
      />
      <MainLayout>
        {/* Hero Section */}
        <div className="pt-24 pb-12 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="flex gap-5">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl font-extrabold shrink-0 shadow-sm border border-indigo-200 overflow-hidden">
                    <img src={getImageUrl(internship.company_logo || `https://ui-avatars.com/api/?name=${internship.company_name}&background=random`)} alt={internship.company_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 capitalize leading-tight">
                      {roleTitle}
                    </h1>
                    <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
                      <Building size={20} className="text-slate-400" /> {internship.company_name || 'Blueboxx Partner'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button onClick={handleBookmark} variant="outline" size="icon" className={`h-12 w-12 rounded-xl border-slate-300 ${internship.is_bookmarked ? 'text-[#C9A227] bg-amber-50' : 'text-slate-500 hover:text-[#C9A227] hover:bg-amber-50'}`}>
                    <Bookmark size={20} className={internship.is_bookmarked ? 'fill-current' : ''} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl text-slate-500 border-slate-300">
                    <Share2 size={20} />
                  </Button>

                  {internship.has_applied ? (
                    <Button disabled className="h-12 px-8 text-base shadow-lg bg-emerald-600 text-white">
                      <CheckCircle2 size={18} className="mr-2" /> Applied
                    </Button>
                  ) : isClosed ? (
                    <Button disabled className="h-12 px-8 text-base shadow-lg bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed">
                      Application Closed
                    </Button>
                  ) : !isAuthenticated ? (
                    <Link href="/login">
                      <Button variant="primary" size="lg" className="h-12 px-8 text-base shadow-lg shadow-[#1B2A6B]/20 bg-[#1B2A6B] hover:bg-[#0d1635] text-white">
                        Log In to Apply <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                  ) : perm.canApply ? (
                    <Link href={`/apply/internship/${internship.id}`}>
                      <Button variant="primary" size="lg" className="h-12 px-8 text-base shadow-lg shadow-[#1B2A6B]/20 bg-[#1B2A6B] hover:bg-[#0d1635] text-white">
                        Apply Now <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                  ) : perm.canRequestRoleChange ? (
                    <Button 
                      size="lg"
                      onClick={() => setShowRoleModal(true)}
                      className="h-12 px-8 text-base shadow-lg shadow-amber-600/20 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                    >
                      <Sparkles size={18} className="mr-2" /> Request Role Change
                    </Button>
                  ) : (
                    <Button disabled className="h-12 px-8 text-base shadow-lg bg-slate-200 text-slate-500 font-bold cursor-not-allowed">
                      <Lock size={16} className="mr-2" /> Application Restricted
                    </Button>
                  )}
                </div>
              </div>

              {/* Opportunity Alert if Restricted */}
              {isAuthenticated && !perm.canApply && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5 shadow-xs">
                  <ShieldAlert size={20} className="text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-0.5">Application Notice</h4>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      {perm.message}
                    </p>
                    {perm.canRequestRoleChange && (
                      <button
                        onClick={() => setShowRoleModal(true)}
                        className="mt-2 text-xs font-bold text-amber-900 underline hover:text-amber-950 inline-flex items-center gap-1"
                      >
                        <Sparkles size={12} /> Request Role Change to {perm.targetRoleDisplay} &rarr;
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Meta Row */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</div>
                    <div className="font-semibold text-slate-800">{internship.location || "Remote"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <DollarSign size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stipend</div>
                    <div className="font-semibold text-emerald-600">
                      {internship.stipend ? `₹${Number(internship.stipend).toLocaleString()}/month` : "Unpaid / Performance Stipend"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</div>
                    <div className="font-semibold text-slate-800">{internship.duration_weeks ? `${internship.duration_weeks} Weeks` : "Flexible"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</div>
                    <div className="font-semibold text-slate-800">{internship.type || "Internship"}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Body */}
        <div className="container mx-auto px-4 max-w-5xl py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column */}
            <div className="w-full lg:w-2/3 space-y-10">
              
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 text-center md:text-left">About the Internship</h2>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line text-justify md:text-left">
                  {internship.description || "No description provided."}
                </p>
              </section>

              {internship.responsibilities && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 text-center md:text-left">Responsibilities</h2>
                  {Array.isArray(internship.responsibilities) ? (
                    <ul className="space-y-3">
                      {internship.responsibilities.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-sm text-justify md:text-left">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line text-justify md:text-left">
                      {internship.responsibilities}
                    </p>
                  )}
                </section>
              )}

              {internship.learning_outcomes && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 text-center md:text-left">Learning Outcomes</h2>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line text-justify md:text-left">
                    {internship.learning_outcomes}
                  </p>
                </section>
              )}

              {internship.eligibility && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 text-center md:text-left">Eligibility Criteria</h2>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line text-justify md:text-left">
                    {internship.eligibility}
                  </p>
                </section>
              )}

              {internship.skills_required?.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 text-center md:text-left">Required Skills</h2>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {internship.skills_required.map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-medium text-slate-700 bg-white border border-slate-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/3">
              <div className="space-y-6 sticky top-28">
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Perks & Benefits</h3>
                    <ul className="space-y-4">
                      {[
                        { icon: DollarSign, text: "Competitive Stipend" },
                        { icon: Clock, text: "Flexible Working Hours" },
                        { icon: Building, text: "Pre-placement Offer (PPO)" },
                        { icon: Briefcase, text: "Letter of Recommendation" },
                      ].map((perk, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                            <perk.icon size={14} className="text-indigo-600" />
                          </div>
                          <span className="text-slate-700 text-sm font-medium">{perk.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Recruitment Timeline</h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                      {[
                        { step: "Application Review", date: "Within 2 days" },
                        { step: "Technical Assignment", date: "Day 3-5" },
                        { step: "Technical Interview", date: "Day 7" },
                        { step: "HR Round & Offer", date: "Day 10" },
                      ].map((timeline, i) => (
                        <div key={i} className="relative flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 z-10">
                            {i + 1}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{timeline.step}</div>
                            <div className="text-xs text-slate-500">{timeline.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>

          </div>
        </div>

        {/* Role Change Modal */}
        {user && (
          <RoleChangeModal
            isOpen={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            currentRole={user.role || 'student'}
            targetRole="intern"
            targetRoleDisplay="Intern"
          />
        )}
        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          actionType="internship"
          itemTitle={internship?.title}
          returnUrl={`/apply/internship/${internship?.id}`}
        />
      </MainLayout>
    </>
  );
}
