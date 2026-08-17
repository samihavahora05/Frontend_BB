import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../../src/layout/MainLayout";
import { motion } from "framer-motion";
import { CheckCircle2, Upload, FileText, Briefcase, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../src/components/ui/Button";
import { useAuth } from "../../../src/context/AuthContext";

import api from "../../../src/lib/axios";
import toast from "react-hot-toast";

function getApplicationsUrl(role?: string | null): string {
  switch (role) {
    case 'student':    return '/student/applications';
    case 'intern':     return '/student/applications';
    case 'job-seeker':
    case 'jobseeker':  return '/jobseeker/applications';
    case 'company':    return '/company/applicants';
    case 'expert':     return '/expert/sessions';
    default:           return '/jobseeker/applications';
  }
}

function getDashboardUrl(role?: string | null): string {
  switch (role) {
    case 'student':    return '/student/dashboard';
    case 'intern':     return '/student/dashboard';
    case 'job-seeker':
    case 'jobseeker':  return '/jobseeker/dashboard';
    case 'company':    return '/company/dashboard';
    case 'expert':     return '/expert/dashboard';
    default:           return '/jobseeker/dashboard';
  }
}

export default function ApplicationFlowPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { type, slug: id } = router.query;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !type) return;
    const fetchData = async () => {
      try {
        const endpoint = type === 'internship' ? `/public/internships/${id}` : `/public/jobs/${id}`;
        const res = await api.get(endpoint);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  // Form data captured across steps
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', portfolio: '',
    resumeFile: null as File | null, useBlueBoxxResume: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (step === 1 && !isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    if (step === 2 && !formData.resumeFile && !formData.useBlueBoxxResume) {
      toast.error("Please upload a resume or select your BlueBoxx resume to continue.");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const isInternship = type === "internship";
        const endpoint = isInternship ? `/public/internships/${id}/apply` : `/public/jobs/${id}/apply`;
        
        const data = new FormData();
        if (formData.firstName) data.append('first_name', formData.firstName);
        if (formData.lastName) data.append('last_name', formData.lastName);
        if (formData.email) data.append('email', formData.email);
        if (formData.phone) data.append('phone', formData.phone);
        if (formData.portfolio) data.append('portfolio_url', formData.portfolio);
        data.append('cover_letter', formData.portfolio ? `Portfolio: ${formData.portfolio}` : 'Submitted via Application Page');
        if (formData.resumeFile) data.append('resume', formData.resumeFile);
        data.append('source_page', isInternship ? 'Dedicated Internship Apply Page' : 'Dedicated Job Apply Page');
        if (job?.title) data.append('application_type', job.title);

        await api.post(endpoint, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setIsSubmitting(false);
        setStep(4);
        toast.success("Application submitted successfully!");

        // Auto-redirect to dashboard after countdown
        const dashboardUrl = getDashboardUrl(user?.role);
        let count = 4;
        setCountdown(count);
        const timer = setInterval(() => {
          count--;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(timer);
            router.push(dashboardUrl);
          }
        }, 1000);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to submit application. Make sure you are logged in.");
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-transparent pt-28">
          <Loader2 className="w-10 h-10 animate-spin text-[#1B2A6B]" />
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-transparent pt-28">
          <h2 className="text-xl font-bold text-slate-800">Job/Internship not found.</h2>
        </div>
      </MainLayout>
    );
  }

  const jobTitle = job.title;



  if (job.has_applied && step < 4) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-transparent py-12 pt-28">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 mb-8 text-center mt-10">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Already Applied</h2>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                You have already submitted an application for {jobTitle}. You can track its status in your dashboard.
              </p>
              <Link href={getApplicationsUrl(user?.role)}>
                <Button variant="primary" className="py-3 px-8 text-base shadow-md">View My Applications</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-transparent py-12 pt-28">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header Info */}
          {step < 4 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 capitalize">Apply for {jobTitle}</h1>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                  <Briefcase size={14} /> {type === "internship" ? "Internship" : "Full-time"} 
                  <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" /> 
                  <MapPin size={14} /> Remote
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                {String(job?.company_name || jobTitle || "C").charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Stepper */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1B2A6B] rounded-full z-0 transition-all duration-500" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
              {[
                { num: 1, label: "Personal Info" },
                { num: 2, label: "Resume" },
                { num: 3, label: "Review" }
              ].map((s) => (
                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s.num ? 'bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                    {step > s.num ? <CheckCircle2 size={18} /> : s.num}
                  </div>
                  <span className={`text-xs font-bold ${step >= s.num ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
            {step === 1 && (
              <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                    <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none" placeholder="+91 9876543210" required />
                </div>
                <div className="pt-6">
                  <Button type="submit" variant="primary" className="w-full py-4 text-base shadow-md">Continue to Resume</Button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Resume & Portfolio</h2>
                
                <div 
                  className={`border-2 border-dashed ${formData.resumeFile ? 'border-[#1B2A6B] bg-blue-50' : 'border-slate-200 bg-slate-50'} rounded-2xl p-10 text-center hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-[#1B2A6B]">
                    {formData.resumeFile ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Upload size={24} />}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{formData.resumeFile ? formData.resumeFile.name : 'Upload your resume'}</h3>
                  <p className="text-sm text-slate-500 mb-4">PDF, DOC, DOCX up to 5MB</p>
                  <Button variant="outline" type="button" className="mx-auto" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    Browse Files
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({...formData, resumeFile: e.target.files[0], useBlueBoxxResume: false});
                      }
                    }}
                  />
                </div>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</div>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div className={`border ${formData.useBlueBoxxResume ? 'border-[#1B2A6B] bg-blue-50/50' : 'border-slate-200'} rounded-2xl p-6 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Use BlueBoxx Resume</h4>
                      <p className="text-xs text-slate-500">Auto-generated from your profile</p>
                    </div>
                  </div>
                  <Button 
                    variant={formData.useBlueBoxxResume ? "primary" : "outline"} 
                    type="button" 
                    size="sm" 
                    className="font-bold"
                    onClick={() => setFormData({...formData, useBlueBoxxResume: true, resumeFile: null})}
                  >
                    {formData.useBlueBoxxResume ? 'Selected' : 'Select'}
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-xs font-bold text-slate-500 uppercase">Portfolio / LinkedIn URL</label>
                  <input type="url" value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none" placeholder="https://" />
                </div>

                <div className="pt-6 flex gap-4">
                  <Button type="button" variant="outline" className="flex-1 py-4 text-base" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 py-4 text-base shadow-md">
                    Review Application
                  </Button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Application</h2>
                
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Personal Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Name</span>
                        <div className="font-semibold text-slate-800">{`${formData.firstName} ${formData.lastName}`.trim() || 'John Doe'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Email</span>
                        <div className="font-semibold text-slate-800">{formData.email || 'john@example.com'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Phone</span>
                        <div className="font-semibold text-slate-800">{formData.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Role Applied</span>
                        <div className="font-semibold text-slate-800 capitalize">{jobTitle}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Resume</h4>
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-[#1B2A6B]" />
                      <span className="font-semibold text-slate-800 text-sm">
                        {formData.useBlueBoxxResume ? "BlueBoxx Resume" : (formData.resumeFile ? formData.resumeFile.name : "No resume uploaded")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button type="button" variant="outline" className="flex-1 py-4 text-base" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1 py-4 text-base shadow-md">
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </motion.form>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Application Submitted!</h2>
                <p className="text-slate-500 mb-4 max-w-sm mx-auto">
                  Your application for <strong>{jobTitle}</strong> has been successfully submitted. We will notify you of any updates.
                </p>
                <p className="text-sm text-slate-400 mb-6">
                  Redirecting to your dashboard in <span className="font-bold text-[#1B2A6B]">{countdown}s</span>...
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href={getDashboardUrl(user?.role)}>
                    <Button variant="primary" className="py-3 px-8 text-base shadow-md">
                      Go to Dashboard Now
                    </Button>
                  </Link>
                  <Link href={getApplicationsUrl(user?.role)}>
                    <Button variant="outline" className="py-3 px-8 text-base">
                      View All Applications
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
