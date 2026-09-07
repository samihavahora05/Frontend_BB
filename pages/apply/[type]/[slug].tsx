import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../../src/layout/MainLayout";
import { motion } from "framer-motion";
import { CheckCircle2, Upload, FileText, Briefcase, MapPin, Loader2, Download, ShieldCheck, PenTool } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../src/components/ui/Button";
import { useAuth } from "../../../src/context/AuthContext";
import { SignaturePad } from "../../../src/components/common/SignaturePad";
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
    default:           return '/student/applications';
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
    default:           return '/student/dashboard';
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

  // Form data captured across steps
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    degree: '',
    graduationYear: '',
    portfolio: '',
    resumeFile: null as File | null,
    useBlueBoxxResume: false,
    termsAccepted: false,
    signatureData: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Pre-fill with authenticated user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.first_name || user.name?.split(' ')[0] || '',
        lastName: prev.lastName || user.last_name || user.name?.split(' ').slice(1).join(' ') || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleDownloadTermsPdf = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
    const termsUrl = `${baseUrl}/public/documents/terms-and-conditions`;
    window.open(termsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.firstName.trim()) {
        toast.error("Please enter your first name.");
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error("Please enter a valid email address (e.g. name@example.com).");
        return;
      }
      if (!formData.phone.trim()) {
        toast.error("Please enter your contact phone number.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.resumeFile && !formData.useBlueBoxxResume) {
        toast.error("Please upload a resume or select your BlueBoxx resume to continue.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      // Step 3 is Review, Terms & Conditions Acceptance, and Digital Signature
      if (!formData.termsAccepted) {
        toast.error("You must read and agree to the Terms & Conditions before submitting.");
        return;
      }

      if (!formData.signatureData) {
        toast.error("Please provide your digital signature on the signature pad.");
        return;
      }

      setIsSubmitting(true);
      try {
        const isInternship = type === "internship";
        const endpoint = isInternship ? `/public/internships/${id}/apply` : `/public/jobs/${id}/apply`;
        
        const data = new FormData();
        if (formData.firstName) data.append('first_name', formData.firstName);
        if (formData.lastName) data.append('last_name', formData.lastName);
        if (formData.email) data.append('email', formData.email);
        if (formData.phone) data.append('phone', formData.phone);
        if (formData.degree) data.append('degree', formData.degree);
        if (formData.graduationYear) data.append('graduation_year', formData.graduationYear);
        if (formData.portfolio) data.append('portfolio_url', formData.portfolio);
        data.append('cover_letter', formData.portfolio ? `Portfolio: ${formData.portfolio}` : 'Submitted via Application Page');
        if (formData.resumeFile) data.append('resume', formData.resumeFile);
        data.append('source_page', isInternship ? 'Dedicated Internship Apply Page' : 'Dedicated Job Apply Page');
        if (job?.title) data.append('application_type', job.title);

        // Mandatory Terms Consent & Signature
        data.append('terms_accepted', '1');
        data.append('terms_version', 'v1.0');
        data.append('signature', formData.signatureData);

        await api.post(endpoint, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setIsSubmitting(false);
        setStep(4);
        toast.success("Application submitted successfully with verified signature!");

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
        toast.error(err.response?.data?.message || "Failed to submit application. Please check your inputs.");
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
          <h2 className="text-xl font-bold text-slate-800">Opportunity not found.</h2>
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
                You have already submitted an application for {jobTitle}. You can track its approval status in your dashboard.
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
                  <Briefcase size={14} /> {type === "internship" ? "Internship Program" : "Position"} 
                  <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" /> 
                  <MapPin size={14} /> {job.location || 'Remote'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#1B2A6B] text-white flex items-center justify-center font-bold text-xl shadow-xs">
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
                { num: 2, label: "Resume & Links" },
                { num: 3, label: "T&C & Signature" }
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
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal & Academic Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">First Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" placeholder="e.g. Rahul" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" placeholder="e.g. Sharma" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" placeholder="rahul@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" placeholder="+91 9876543210" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Highest Qualification / Degree</label>
                    <input type="text" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" placeholder="B.Tech Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Graduation Year</label>
                    <input type="text" value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" placeholder="2026" />
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" variant="primary" className="w-full py-4 text-base shadow-md">Continue to Resume</Button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Resume & Portfolio Links</h2>
                
                <div 
                  className={`border-2 border-dashed ${formData.resumeFile ? 'border-[#1B2A6B] bg-blue-50' : 'border-slate-200 bg-slate-50'} rounded-2xl p-10 text-center hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-[#1B2A6B]">
                    {formData.resumeFile ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Upload size={24} />}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{formData.resumeFile ? formData.resumeFile.name : 'Upload your resume'}</h3>
                  <p className="text-sm text-slate-500 mb-4">PDF, DOC, DOCX up to 10MB</p>
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
                      <h4 className="font-bold text-slate-800">Use BlueBoxx Profile Resume</h4>
                      <p className="text-xs text-slate-500">Auto-attach credentials and resume from your profile</p>
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
                  <label className="text-xs font-bold text-slate-500 uppercase">Portfolio / GitHub / LinkedIn URL</label>
                  <input type="url" value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none text-sm font-semibold" placeholder="https://github.com/yourhandle" />
                </div>

                <div className="pt-6 flex gap-4">
                  <Button type="button" variant="outline" className="flex-1 py-4 text-base" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 py-4 text-base shadow-md">
                    Review & Sign
                  </Button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Terms & Conditions Agreement & Signature</h2>
                  <p className="text-xs text-slate-500 font-medium">Please review your submission details, agree to the internship terms, and provide your digital signature.</p>
                </div>
                
                {/* Summary Box */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Application Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block">Applicant</span>
                      <strong className="text-slate-800">{`${formData.firstName} ${formData.lastName}`.trim()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Email</span>
                      <strong className="text-slate-800">{formData.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Program</span>
                      <strong className="text-[#1B2A6B] capitalize">{jobTitle}</strong>
                    </div>
                  </div>
                </div>

                {/* TERMS & CONDITIONS SECTION */}
                <div className="p-6 bg-blue-50/40 rounded-2xl border border-blue-200 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#1B2A6B]" />
                        <h3 className="font-extrabold text-sm text-[#1B2A6B] uppercase tracking-wider">Terms & Conditions</h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Please read the Internship Terms & Conditions carefully before submitting your application.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadTermsPdf}
                      className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl text-xs font-extrabold text-[#1B2A6B] inline-flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
                    >
                      <Download size={14} /> Download T&C PDF
                    </button>
                  </div>

                  {/* Mandatory Checkbox */}
                  <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-blue-200/80 cursor-pointer hover:bg-blue-50/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-[#1B2A6B] focus:ring-[#1B2A6B] border-slate-300 cursor-pointer"
                      required
                    />
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      I have read and agree to the Internship Terms & Conditions. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                {/* DIGITAL SIGNATURE / PHOTO SECTION */}
                <div className="p-6 bg-slate-50/60 rounded-2xl border border-slate-200 space-y-3">
                  <SignaturePad
                    label="Digital Signature / Photo"
                    height={160}
                    defaultMode="upload"
                    onChange={(dataUrl) => setFormData({ ...formData, signatureData: dataUrl as string | null })}
                    onClear={() => setFormData({ ...formData, signatureData: null })}
                  />
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload a clear photo of your signature or draw it directly. Your signature will be embedded into your official Appointment Letter.
                  </p>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button type="button" variant="outline" className="flex-1 py-4 text-base" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isSubmitting || !formData.termsAccepted || !formData.signatureData} 
                    className="flex-1 py-4 text-base shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Internship Application"}
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
                <p className="text-slate-600 mb-4 max-w-md mx-auto text-sm leading-relaxed">
                  Your application for <strong>{jobTitle}</strong> has been received with verified Terms & Conditions consent and digital signature. Our administrative team will review your credentials.
                </p>
                <p className="text-xs text-slate-400 mb-6">
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
                      View My Applications
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
