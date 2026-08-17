import { DashboardLayout } from "../../../src/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Link as LinkIcon, FileText, CheckCircle2 } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import Link from "next/link";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ProfilePage() {
  const { data, isLoading } = useSWR("/profile", fetcher);
  
  const user = data?.user || {};
  const profile = data?.profile || {};
  const skills = profile.skills || [];
  const certs = profile.certifications || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">My Profile</h1>
            <p className="text-sm font-semibold text-slate-500">Manage your personal information and resume.</p>
          </div>
          <Link href="/student/dashboard/settings">
            <Button className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl px-6 h-11">
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Basic Info */}
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-100">Loading profile...</div>
            ) : (
            <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden relative group">
              <div className="h-24 bg-gradient-to-r from-[#0d1635] to-[#1B2A6B]"></div>
              <CardContent className="px-6 pb-6 pt-0 relative">
                <div className="w-20 h-20 bg-white rounded-full p-1 -mt-10 mb-4 border-2 border-slate-100 shadow-sm relative">
                  <img src={profile.profile_photo ? `/storage/${profile.profile_photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=1B2A6B&color=fff`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                
                <h2 className="text-xl font-black text-slate-800">{user.name || "Student User"}</h2>
                <p className="text-xs font-semibold text-slate-500 mb-4">{profile.bio || "Student at BlueBoxx"}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" /> {user.email || "No email provided"}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-slate-400" /> {user.phone}
                    </div>
                  )}
                  {(profile.city || profile.state || profile.country) && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin size={16} className="text-slate-400" /> {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            )}

            <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-base font-extrabold text-slate-800">Portfolio Links</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {isLoading ? (
                  <div className="text-slate-400 text-sm">Loading links...</div>
                ) : [
                  { label: "LinkedIn", url: profile.linkedin_url, icon: LinkIcon, color: "text-blue-600 bg-blue-50" },
                  { label: "GitHub", url: profile.github_url, icon: LinkIcon, color: "text-slate-800 bg-slate-100" },
                  { label: "Portfolio", url: profile.portfolio_url, icon: LinkIcon, color: "text-purple-600 bg-purple-50" },
                ].filter(link => link.url).map((link, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => window.open(link.url.startsWith('http') ? link.url : `https://${link.url}`, '_blank')}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${link.color}`}>
                      <link.icon size={14} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{link.label}</p>
                      <p className="text-sm font-semibold text-[#1B2A6B] truncate hover:underline">{link.url.replace(/^https?:\/\/(www\.)?/, '')}</p>
                    </div>
                  </div>
                ))}
                {!isLoading && !profile.linkedin_url && !profile.github_url && !profile.portfolio_url && (
                  <p className="text-slate-400 text-sm italic">No portfolio links added yet.</p>
                )}
              </CardContent>
            </Card>

          {/* Main Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            
            <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-extrabold text-slate-800">Resume & Skills</CardTitle>
                <Button variant="outline" className="border-[#1B2A6B]/20 text-[#1B2A6B] h-8 text-[11px] font-extrabold uppercase tracking-wider rounded-lg px-4 gap-1.5 hover:bg-blue-50">
                  <FileText size={14} /> Upload Resume
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-12 text-slate-400">Loading...</div>
                ) : (
                <>
                <div className="mb-8">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-[#C9A227]" /> Top Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? skills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors cursor-default">
                        {skill}
                      </span>
                    )) : (
                      <span className="text-slate-400 text-sm italic">No skills added yet.</span>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                    <GraduationCap size={16} className="text-blue-600" /> Education
                  </h3>
                  {profile.course || profile.college_name ? (
                    <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                      <div className="relative">
                        <span className="absolute -left-[31px] w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></span>
                        <h4 className="font-extrabold text-sm text-slate-800">{profile.course} {profile.specialization && `in ${profile.specialization}`}</h4>
                        <p className="text-xs font-semibold text-slate-500">{profile.college_name || profile.university} {profile.graduation_year && `• Class of ${profile.graduation_year}`}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No education details added yet.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Certifications
                  </h3>
                  {certs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {certs.map((cert: any, i: number) => (
                        <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                          <h4 className="font-bold text-sm text-slate-800 mb-1">{cert.title || cert}</h4>
                          {cert.issuer && <p className="text-xs text-slate-500 mb-3">{cert.issuer} {cert.year && `• ${cert.year}`}</p>}
                          {cert.url && <a href={cert.url} target="_blank" rel="noreferrer" className="text-[11px] font-extrabold text-[#1B2A6B] uppercase tracking-wider hover:underline">View Credential</a>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No certifications added yet.</p>
                  )}
                </div>
                </>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
