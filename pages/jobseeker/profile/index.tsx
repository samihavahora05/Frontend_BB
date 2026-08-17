import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { User, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Edit2, Plus, CheckCircle2, Download, X } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function JobseekerProfilePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data, isLoading } = useSWR("/jobseeker/profile", fetcher);
  
  const closeModal = () => setActiveModal(null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    
    try {
      await api.put("/jobseeker/profile", payload);
      toast.success("Profile updated!");
      mutate("/jobseeker/profile");
      closeModal();
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const skillsString = formData.get("skills") as string;
    const skillsArray = skillsString.split(",").map(s => s.trim()).filter(Boolean);
    
    try {
      await api.put("/jobseeker/profile", { skills: skillsArray });
      toast.success("Skills updated!");
      mutate("/jobseeker/profile");
      closeModal();
    } catch (error) {
      toast.error("Failed to update skills.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <JobseekerDashboardLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">Loading profile...</div>
      </JobseekerDashboardLayout>
    );
  }

  const user = data?.data?.user || {};
  const profile = data?.data?.profile || {};
  const education = data?.data?.education || [];
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Job Seeker';
  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1B2A6B&color=fff&size=100`;

  return (
    <JobseekerDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] mb-2">My Profile</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your public profile to attract the best opportunities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-[#1B2A6B] to-[#0d1635] relative">
              <button onClick={() => setActiveModal('edit-profile')} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors backdrop-blur-sm">
                <Edit2 size={16} />
              </button>
            </div>
            <div className="px-8 pb-8 relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 shadow-md absolute -top-12 left-8 overflow-hidden">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="pt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
                    {fullName} {profile.profile_completion >= 80 && <CheckCircle2 size={18} className="text-emerald-500" />}
                  </h2>
                  <p className="text-slate-600 font-bold mb-2">{profile.headline || 'Add a professional headline'}</p>
                  <p className="text-slate-500 text-sm font-medium flex items-center gap-1">
                    <MapPin size={14} /> {profile.preferred_location || 'Location not specified'}
                  </p>
                </div>
                {profile.resume_path ? (
                  <a href={profile.resume_path.startsWith('http') ? profile.resume_path : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${profile.resume_path}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] font-bold rounded-xl shadow-md transition-colors text-sm flex items-center gap-2">
                    <Download size={16} /> Download Resume
                  </a>
                ) : (
                  <button disabled className="px-5 py-2.5 bg-slate-100 text-slate-500 font-bold rounded-xl shadow-sm text-sm flex items-center gap-2 cursor-not-allowed">
                    <Download size={16} /> No Resume Uploaded
                  </button>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><User size={16} /> About Me</h3>
                {profile.about_me ? (
                  <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line">
                    {profile.about_me}
                  </p>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-100 border-dashed">
                    <p className="text-sm font-semibold text-slate-500 mb-3">You haven't written an about me section yet.</p>
                    <button onClick={() => setActiveModal('edit-profile')} className="text-sm font-bold text-[#1B2A6B] hover:underline">Add About Me</button>
                  </div>
                )}
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Briefcase size={20} className="text-[#1B2A6B]"/> Experience</h3>
              <button onClick={() => toast("Experience section relies on StudentEducation/StudentExperience models in DB.")} className="text-[#1B2A6B] hover:bg-slate-100 p-2 rounded-lg transition-colors"><Plus size={18}/></button>
            </div>
            <div className="space-y-6">
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <Briefcase size={24} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">No experience added yet.</p>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><GraduationCap size={20} className="text-[#1B2A6B]"/> Education</h3>
              <button onClick={() => toast("Education tracking requires a separate integration.")} className="text-[#1B2A6B] hover:bg-slate-100 p-2 rounded-lg transition-colors"><Plus size={18}/></button>
            </div>
            <div className="space-y-6">
              {education.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <GraduationCap size={24} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">No education history added yet.</p>
                </div>
              ) : (
                education.map((edu: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{edu.degree}</h4>
                      <p className="text-sm font-semibold text-slate-600 mb-1">{edu.institution_name}</p>
                      <p className="text-xs text-slate-400 font-medium mb-2">Graduating {edu.end_year}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AnimatedContent>
        </div>

        {/* Right Col - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <AnimatedContent direction="up" delay={0.4} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-800">Skills</h3>
              <button onClick={() => setActiveModal('edit-skills')} className="text-[#1B2A6B] hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><Edit2 size={14}/></button>
            </div>
            {(!profile.skills || profile.skills.length === 0) ? (
              <div className="text-center p-4 text-sm text-slate-500">No skills added.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.5} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-800">Social Links</h3>
              <button onClick={() => setActiveModal('edit-profile')} className="text-[#1B2A6B] hover:bg-slate-100 p-1.5 rounded-lg transition-colors"><Edit2 size={14}/></button>
            </div>
            <div className="space-y-3">
              {profile.github && (
                <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#1B2A6B] hover:bg-slate-50 transition-colors group">
                  <Github size={20} className="text-slate-600 group-hover:text-[#1B2A6B]" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800">GitHub</p>
                    <p className="text-[10px] font-medium text-slate-500 truncate">{profile.github}</p>
                  </div>
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#1B2A6B] hover:bg-slate-50 transition-colors group">
                  <Linkedin size={20} className="text-slate-600 group-hover:text-[#1B2A6B]" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800">LinkedIn</p>
                    <p className="text-[10px] font-medium text-slate-500 truncate">{profile.linkedin}</p>
                  </div>
                </a>
              )}
              {profile.portfolio && (
                <a href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#1B2A6B] hover:bg-slate-50 transition-colors group">
                  <Globe size={20} className="text-slate-600 group-hover:text-[#1B2A6B]" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800">Portfolio</p>
                    <p className="text-[10px] font-medium text-slate-500 truncate">{profile.portfolio}</p>
                  </div>
                </a>
              )}
              {(!profile.github && !profile.linkedin && !profile.portfolio) && (
                <div className="text-center p-4 text-sm text-slate-500">No social links added.</div>
              )}
            </div>
          </AnimatedContent>
        </div>
      </div>

      {/* Unified Modal Rendering */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 relative overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-20">
                <h3 className="text-lg font-black text-[#0d1635]">
                  {activeModal === 'download-resume' ? 'Download Resume' :
                   activeModal === 'edit-skills' ? 'Edit Skills' :
                   'Edit Profile'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">

                {activeModal === 'edit-skills' && (
                  <form onSubmit={handleSkillsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Add Skills (comma separated)</label>
                      <textarea name="skills" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] min-h-[100px]" defaultValue={(profile.skills || []).join(', ')} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Updating...' : 'Update Skills'}
                    </button>
                  </form>
                )}

                {activeModal === 'edit-profile' && (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name</label>
                        <input type="text" name="first_name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" defaultValue={user.first_name} required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                        <input type="text" name="last_name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" defaultValue={user.last_name} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Headline</label>
                      <input type="text" name="headline" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" defaultValue={profile.headline || ''} placeholder="e.g. Frontend Developer" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
                      <input type="text" name="preferred_location" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" defaultValue={profile.preferred_location || ''} placeholder="e.g. Hyderabad, India" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">About Me</label>
                      <textarea name="about_me" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] min-h-[100px]" defaultValue={profile.about_me || ''} placeholder="Write a short summary..." />
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">GitHub URL</label>
                      <input type="text" name="github" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" defaultValue={profile.github || ''} placeholder="github.com/username" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">LinkedIn URL</label>
                      <input type="text" name="linkedin" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" defaultValue={profile.linkedin || ''} placeholder="linkedin.com/in/username" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Portfolio URL</label>
                      <input type="text" name="portfolio" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" defaultValue={profile.portfolio || ''} placeholder="yourwebsite.com" />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 mt-4">
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </JobseekerDashboardLayout>
  );
}
