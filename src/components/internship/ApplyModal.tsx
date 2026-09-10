import React, { useState, useEffect } from "react";
import { 
  X, Upload, Send, Building, MapPin, Download, CheckCircle2, 
  FileText, ShieldCheck, PenTool, ArrowRight, ArrowLeft, ExternalLink,
  ShieldAlert, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { SignaturePad } from "../common/SignaturePad";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { getOpportunityPermission } from "../../lib/opportunityPermissions";
import { RoleChangeModal } from "../common/RoleChangeModal";

interface ApplyModalProps {
  internship: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ internship, isOpen, onClose, onSuccess }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<number | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const perm = getOpportunityPermission(user?.role, 'internship');

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTermsAccepted(false);
      setSignatureData(null);
      setSubmittedAppId(null);

      if (user) {
        setFirstName(user.first_name || user.name?.split(" ")[0] || "");
        setLastName(user.last_name || user.name?.split(" ").slice(1).join(" ") || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setDegree((user as any)?.degree || "");
      }
    }
  }, [isOpen, user]);

  if (!isOpen || !internship) return null;

  const handleDownloadTermsPdf = () => {
    const link = document.createElement('a');
    link.href = '/documents/terms-and-conditions.pdf';
    link.target = '_blank';
    link.download = 'BlueBoxx_Internship_Terms_and_Conditions.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !perm.canApply) {
      toast.error(perm.message);
      setShowRoleModal(true);
      return;
    }
    if (!firstName.trim()) {
      toast.error("Please enter your first name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your contact phone number.");
      return;
    }
    if (!resumeFile) {
      toast.error("Please upload your updated resume (PDF or DOCX).");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user && !perm.canApply) {
      toast.error(perm.message);
      setShowRoleModal(true);
      return;
    }

    if (!termsAccepted) {
      toast.error("You must agree to the Terms & Conditions before submitting.");
      return;
    }

    if (!signatureData) {
      toast.error("Please provide your digital signature on the canvas pad.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (firstName) formData.append("first_name", firstName);
      if (lastName) formData.append("last_name", lastName);
      if (email) formData.append("email", email);
      if (phone) formData.append("phone", phone);
      if (degree) formData.append("degree", degree);
      if (graduationYear) formData.append("graduation_year", graduationYear);
      if (portfolioUrl) formData.append("portfolio_url", portfolioUrl);
      if (coverLetter) formData.append("cover_letter", coverLetter);
      if (resumeFile) formData.append("resume", resumeFile);
      
      formData.append("source_page", "Internship Application Modal");
      if (internship?.title) formData.append("application_type", internship.title);

      // Terms & Signature
      formData.append("terms_accepted", "1");
      formData.append("terms_version", "v1.0");
      formData.append("signature", signatureData);

      const res = await api.post(`/public/internships/${internship.id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Application submitted successfully!");
        setSubmittedAppId(res.data?.data?.id || null);
        setStep(3);
        onSuccess();
      } else {
        toast.error(res.data?.message || "Failed to submit application.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(", ") : (err.message || "Error submitting application. Please try again."));
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#0d1635] text-white p-6 relative shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center justify-between pr-8 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#C9A227] inline-block">
              {step === 3 ? "Application Complete" : "Internship Application Process"}
            </span>

            {step !== 3 && (
              <Link 
                href={`/apply/internship/${internship.id}`} 
                onClick={onClose}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-bold underline transition-colors"
              >
                Open Full Page <ExternalLink size={12} />
              </Link>
            )}
          </div>

          <h2 className="text-xl font-black text-white">{internship.title}</h2>
          <p className="text-xs text-slate-300 font-semibold mt-1 flex items-center gap-1.5">
            <Building size={14} className="text-[#C9A227]" /> {internship.company_name || 'Blueboxx DA'} • <MapPin size={14} /> {internship.location || 'Remote'}
          </p>

          {/* Stepper Header indicator */}
          {step !== 3 && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
              <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#C9A227]' : 'text-emerald-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                  step === 1 ? 'bg-[#C9A227] text-[#0d1635]' : 'bg-emerald-500 text-white'
                }`}>
                  {step > 1 ? '✓' : '1'}
                </span>
                <span>1. Applicant & Resume</span>
              </div>
              <div className="h-0.5 flex-1 mx-3 bg-white/10">
                <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-400 w-full' : 'w-0'}`} />
              </div>
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#C9A227]' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                  step === 2 ? 'bg-[#C9A227] text-[#0d1635]' : 'bg-white/10 text-slate-400'
                }`}>
                  2
                </span>
                <span>2. T&C & Digital Signature</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {user && !perm.canApply && step !== 3 ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1 font-sora">Internship Application Restricted</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                  {perm.message}
                </p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="text-amber-800 font-medium">Your Current Role:</span>
                  <span className="font-extrabold text-slate-800 uppercase tracking-wide">{user.role || 'Student'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="text-amber-800 font-medium">Required Role:</span>
                  <span className="font-extrabold text-[#1B2A6B]">Intern</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-amber-800 font-medium">Role Switch:</span>
                  <span className="font-bold text-emerald-700">1-Click Fast-Track Request</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                {perm.canRequestRoleChange && (
                  <Button
                    onClick={() => setShowRoleModal(true)}
                    className="w-full sm:w-auto h-11 px-6 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold rounded-xl text-xs shadow-md gap-2"
                  >
                    <Sparkles size={14} /> Request Role Change to Intern
                  </Button>
                )}
                <Link href="/courses" onClick={onClose} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full h-11 px-5 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold"
                  >
                    Browse Courses (Open to All)
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* ================= STEP 1: APPLICANT DETAILS & RESUME ================= */}
              {step === 1 && (
                <form id="step1-form" onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Degree / Qualification
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Updated Resume (PDF or DOCX) <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#1B2A6B] bg-slate-50/70 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    required={!resumeFile}
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  />
                  <Upload size={22} className="text-[#1B2A6B] mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">
                    {resumeFile ? resumeFile.name : "Click or drag to upload your updated Resume / CV"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">PDF or Word format (Max 10MB)</p>
                </div>
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Portfolio / GitHub / LinkedIn URL (Optional)
                </label>
                <input 
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/username or https://myportfolio.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Cover Letter / Short Introduction
                </label>
                <textarea 
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly share why you are excited to join this internship role..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] resize-none"
                />
              </div>
            </form>
          )}

          {/* ================= STEP 2: TERMS & CONDITIONS + DIGITAL SIGNATURE ================= */}
          {step === 2 && (
            <form id="step2-form" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Terms & Conditions Notice Box with PDF Download */}
              <div className="bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-amber-50/50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#1B2A6B] text-white rounded-lg">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#0d1635] uppercase tracking-wide">
                        Internship Terms & Conditions
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        Version 1.0 • Blueboxx Industrial Internship Policy
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadTermsPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#1B2A6B] text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-[1.02] shrink-0"
                  >
                    <Download size={13} />
                    <span>Download T&C PDF</span>
                  </button>
                </div>

                {/* Key Summary bullet points */}
                <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-1.5 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                    <span><strong>Conduct & Non-Disclosure:</strong> Confidential company data and source code must remain protected.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                    <span><strong>Attendance & Deliverables:</strong> Regular milestone participation is required for successful completion.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                    <span><strong>Appointment Letter:</strong> Upon admin approval, your official appointment letter will be generated automatically.</span>
                  </div>
                </div>

                {/* Mandatory Agreement Checkbox */}
                <label className="flex items-start gap-3 mt-3 cursor-pointer pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 leading-snug">
                    I have read, understood, and solemnly agree to the{" "}
                    <button
                      type="button"
                      onClick={handleDownloadTermsPdf}
                      className="text-[#1B2A6B] underline hover:text-[#0d1635]"
                    >
                      Blueboxx Internship Terms & Conditions
                    </button>{" "}
                    and certify that all submitted information is accurate. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Digital Signature / Photo Section */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <SignaturePad 
                  height={150}
                  defaultMode="upload"
                  onChange={(sig) => setSignatureData(sig as string | null)} 
                  onClear={() => setSignatureData(null)}
                />
              </div>

            </form>
          )}
        </>
      )}

          {/* ================= STEP 3: SUBMITTED / SUCCESS VIEW ================= */}
          {step === 3 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 max-w-md mx-auto">
                  Your application for <strong>{internship.title}</strong> has been received and is currently <span className="text-amber-600 font-bold">Pending Admin Review</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Applicant:</span>
                  <span className="font-bold text-slate-800">{firstName} {lastName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Terms & Conditions:</span>
                  <span className="font-bold text-emerald-600">✓ Accepted (v1.0)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Digital Signature:</span>
                  <span className="font-bold text-emerald-600">✓ Signed & Verified</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Next Step:</span>
                  <span className="font-bold text-[#1B2A6B]">Admin Review & Appointment Letter</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 font-medium max-w-md mx-auto">
                💡 <strong>What happens next?</strong> Once the admin reviews and approves your application, your official Appointment Letter will be generated and ready for instant PDF download on your student portal.
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    router.push('/student/applications');
                  }}
                  className="w-full sm:w-auto h-11 px-6 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold rounded-xl text-xs shadow-md gap-2"
                >
                  <FileText size={14} /> View My Applications Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto h-11 px-5 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        {step !== 3 && (!user || perm.canApply) && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {step === 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="h-10 px-4 border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)}
                className="h-10 px-4 border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold gap-1"
              >
                <ArrowLeft size={13} /> Back to Details
              </Button>
            )}

            {step === 1 ? (
              <Button 
                type="submit" 
                form="step1-form"
                className="h-10 px-5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold rounded-xl text-xs shadow-md gap-1.5"
              >
                Continue to Terms & Signature <ArrowRight size={13} />
              </Button>
            ) : (
              <Button 
                type="submit" 
                form="step2-form"
                disabled={isSubmitting || !termsAccepted || !signatureData}
                className="h-10 px-6 bg-[#0d1635] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md gap-2 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : <>Submit Application <Send size={13} /></>}
              </Button>
            )}
          </div>
        )}

      </div>

      <RoleChangeModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole={user?.role || 'student'}
        targetRole="intern"
        targetRoleDisplay="Intern"
      />
    </div>
  );
};
