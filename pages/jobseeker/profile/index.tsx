import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { User, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Edit2, Plus, CheckCircle2, Download, Upload, Sparkles, X, FileText, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function JobseekerProfilePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  
  const { data, isLoading, mutate: mutateLocal } = useSWR("/jobseeker/profile", fetcher);
  
  const closeModal = () => setActiveModal(null);

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("resume", file);
      
      try {
        setIsSubmitting(true);
        await api.post("/jobseeker/resume", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success(`Resume "${file.name}" uploaded successfully!`);
        await mutateLocal();
        mutate("/jobseeker/profile");
        mutate("/jobseeker/dashboard");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to upload resume.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    
    try {
      await api.put("/jobseeker/profile", payload);
      toast.success("Profile updated!");
      await mutateLocal();
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
      await mutateLocal();
      mutate("/jobseeker/profile");
      closeModal();
    } catch (error) {
      toast.error("Failed to update skills.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const user = data?.data?.user || {};
  const profile = data?.data?.profile || {};
  const apiEducation = data?.data?.education || [];

  // Parse structured data from about_me JSON if available
  const parsedBio = useMemo(() => {
    if (!profile.about_me) return null;
    if (typeof profile.about_me === "string" && (profile.about_me.startsWith('{') || profile.about_me.startsWith('['))) {
      try {
        return JSON.parse(profile.about_me);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [profile.about_me]);

  const fullName = (user.first_name || user.last_name)
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : (parsedBio?.fullName || user.name || 'Job Seeker');

  const headline = profile.headline || parsedBio?.jobTitle || 'Frontend Developer';
  const location = profile.preferred_location || parsedBio?.location || 'Bangalore, India';
  const aboutMeText = parsedBio ? (parsedBio.summary || parsedBio.objective || '') : (profile.about_me || '');
  
  const displaySkills = useMemo(() => {
    if (profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0) {
      return profile.skills;
    }
    if (parsedBio?.skillCategories) {
      return Object.values(parsedBio.skillCategories).flat().filter(Boolean);
    }
    return [];
  }, [profile.skills, parsedBio]);

  const displayExperience = useMemo(() => {
    const list: any[] = [];
    if (parsedBio?.expList && Array.isArray(parsedBio.expList)) {
      list.push(...parsedBio.expList.filter((e: any) => e.company));
    }
    if (parsedBio?.internshipList && Array.isArray(parsedBio.internshipList)) {
      list.push(...parsedBio.internshipList.filter((e: any) => e.company));
    }
    return list;
  }, [parsedBio]);

  const displayEducation = useMemo(() => {
    if (apiEducation && apiEducation.length > 0) return apiEducation;
    if (parsedBio?.eduList && Array.isArray(parsedBio.eduList)) {
      return parsedBio.eduList.filter((e: any) => e.school || e.degree);
    }
    return [];
  }, [apiEducation, parsedBio]);

  const linkedinUrl = profile.linkedin || parsedBio?.linkedin;
  const githubUrl = profile.github || parsedBio?.github;
  const portfolioUrl = profile.portfolio || parsedBio?.portfolio;

  const resumeHref = profile.resume_url || (profile.resume_path ? (
    profile.resume_path.startsWith('http') 
      ? profile.resume_path 
      : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/storage/${profile.resume_path}`
  ) : null);

  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1B2A6B&color=fff&size=100`;

  if (isLoading) {
    return (
      <JobseekerDashboardLayout>
        <div className="flex items-center justify-center h-64 text-slate-400 font-semibold">Loading profile...</div>
      </JobseekerDashboardLayout>
    );
  }

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
                    {fullName} <CheckCircle2 size={18} className="text-emerald-500" />
                  </h2>
                  <p className="text-slate-600 font-bold mb-2">{headline}</p>
                  <p className="text-slate-500 text-sm font-medium flex items-center gap-1">
                    <MapPin size={14} /> {location}
                  </p>
                </div>
                
                {/* Resume Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={handleResumeFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  {resumeHref ? (
                    <>
                      <a
                        href={resumeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] font-bold rounded-xl shadow-md transition-colors text-sm flex items-center gap-2"
                      >
                        <Download size={16} /> Download Resume
                      </a>
                      <button
                        onClick={() => resumeInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition-colors text-sm flex items-center gap-2"
                      >
                        <Upload size={16} /> Replace
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => resumeInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-colors text-sm flex items-center gap-2"
                      >
                        <Upload size={16} /> Upload Resume
                      </button>
                      <Link
                        href="/jobseeker/resume-builder"
                        className="px-4 py-2.5 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#0d1635] font-bold rounded-xl text-sm flex items-center gap-2 transition-all"
                      >
                        <Sparkles size={16} className="text-[#C9A227]" /> Build with AI
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><User size={16} /> About Me</h3>
                {aboutMeText ? (
                  <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line">
                    {aboutMeText}
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

          {/* Dedicated Resume Document Card with In-Page Preview */}
          <AnimatedContent direction="up" delay={0.15} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B2A6B] flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                    Resume Document
                    {resumeHref && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider">Active</span>}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {resumeHref ? (profile.resume_path ? profile.resume_path.split('/').pop() : 'Resume Uploaded') : 'No resume file uploaded yet'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {resumeHref && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showPreview ? "Hide Preview" : "Preview PDF"}
                  </button>
                )}
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Upload size={14} /> {resumeHref ? "Upload New" : "Upload File"}
                </button>
                {resumeHref && (
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={14} /> Download
                  </a>
                )}
              </div>
            </div>

            {/* Embedded Live PDF Viewer when toggled */}
            <AnimatePresence>
              {showPreview && resumeHref && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "600px" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50"
                >
                  <iframe
                    src={resumeHref}
                    className="w-full h-full border-none"
                    title="Resume Document Preview"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedContent>

          {/* Experience Section */}
          <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Briefcase size={20} className="text-[#1B2A6B]"/> Experience</h3>
              <Link href="/jobseeker/resume-builder" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-1">
                Edit in AI Resume Builder
              </Link>
            </div>
            <div className="space-y-4">
              {displayExperience.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <Briefcase size={24} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">No experience added yet.</p>
                </div>
              ) : (
                displayExperience.map((exp: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{exp.role}</h4>
                        <p className="text-xs font-semibold text-[#1B2A6B]">{exp.company}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{exp.duration}</span>
                    </div>
                    {exp.desc && (
                      <p className="text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed font-medium">{exp.desc}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </AnimatedContent>

          {/* Education Section */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><GraduationCap size={20} className="text-[#1B2A6B]"/> Education</h3>
              <Link href="/jobseeker/resume-builder" className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-1">
                Edit in AI Resume Builder
              </Link>
            </div>
            <div className="space-y-4">
              {displayEducation.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <GraduationCap size={24} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">No education history added yet.</p>
                </div>
              ) : (
                displayEducation.map((edu: any, i: number) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{edu.degree}</h4>
                      <p className="text-sm font-semibold text-slate-600 mb-1">{edu.institution_name || edu.school}</p>
                      <p className="text-xs text-slate-400 font-medium mb-1">
                        {edu.end_year ? `Graduating ${edu.end_year}` : (edu.duration || '')}
                        {edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ''}
                      </p>
                      {edu.coursework && (
                        <p className="text-xs text-slate-500 font-medium">Coursework: {edu.coursework}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </AnimatedContent>
        </div>

        {/* Right Col - Sidebar Details */}
        <div className="space-y-6">
          {/* Quick AI Resume Card */}
          <AnimatedContent direction="up" delay={0.15} className="bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-[#C9A227]" size={20} />
              <h3 className="font-black text-base">ATS Resume Builder</h3>
            </div>
            <p className="text-xs text-white/70 font-medium mb-4 leading-relaxed">
              Build an ATS-optimized, professional 2-column resume with real-time scoring.
            </p>
            <Link
              href="/jobseeker/resume-builder"
              className="w-full flex items-center justify-center py-2.5 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] font-black rounded-xl text-xs transition-colors shadow-sm"
            >
              Open AI Resume Builder
            </Link>
          </AnimatedContent>

          {/* Skills */}
          <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-800">Skills ({displaySkills.length})</h3>
              <button onClick={() => setActiveModal('edit-skills')} className="text-slate-400 hover:text-[#1B2A6B]">
                <Edit2 size={16} />
              </button>
            </div>
            {displaySkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs font-medium text-center py-4">No skills added.</p>
            )}
          </AnimatedContent>

          {/* Social Links */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-800">Social Links</h3>
              <button onClick={() => setActiveModal('edit-profile')} className="text-slate-400 hover:text-[#1B2A6B]">
                <Edit2 size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {linkedinUrl ? (
                <a href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-[#1B2A6B] text-sm font-semibold">
                  <Linkedin size={18} className="text-blue-600" /> LinkedIn
                </a>
              ) : null}
              {githubUrl ? (
                <a href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-[#1B2A6B] text-sm font-semibold">
                  <Github size={18} className="text-slate-800" /> GitHub
                </a>
              ) : null}
              {portfolioUrl ? (
                <a href={portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-[#1B2A6B] text-sm font-semibold">
                  <Globe size={18} className="text-emerald-600" /> Portfolio
                </a>
              ) : null}
              {!linkedinUrl && !githubUrl && !portfolioUrl && (
                <p className="text-slate-400 text-xs font-medium text-center py-4">No social links added.</p>
              )}
            </div>
          </AnimatedContent>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {activeModal === 'edit-profile' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <h2 className="text-xl font-black text-[#0d1635] mb-4">Edit Profile</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Headline</label>
                  <input type="text" name="headline" defaultValue={profile.headline || headline || ''} placeholder="e.g. Senior Frontend Developer" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                  <input type="text" name="preferred_location" defaultValue={profile.preferred_location || location || ''} placeholder="e.g. Bangalore, India" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">About Me</label>
                  <textarea name="about_me" defaultValue={aboutMeText || ''} rows={4} placeholder="Brief summary of your experience..." className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
                  <input type="text" name="linkedin" defaultValue={profile.linkedin || linkedinUrl || ''} placeholder="linkedin.com/in/username" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GitHub URL</label>
                  <input type="text" name="github" defaultValue={profile.github || githubUrl || ''} placeholder="github.com/username" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Portfolio URL</label>
                  <input type="text" name="portfolio" defaultValue={profile.portfolio || portfolioUrl || ''} placeholder="myportfolio.com" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-colors text-sm">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Skills Modal */}
        {activeModal === 'edit-skills' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <h2 className="text-xl font-black text-[#0d1635] mb-4">Edit Skills</h2>
              <form onSubmit={handleSkillsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Skills (comma separated)</label>
                  <textarea name="skills" defaultValue={displaySkills.join(', ')} rows={4} placeholder="React, Node.js, TypeScript, Next.js..." className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm resize-none" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-colors text-sm">
                  {isSubmitting ? 'Saving...' : 'Save Skills'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </JobseekerDashboardLayout>
  );
}
