import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "../src/components/ui/Button";
import { 
  GraduationCap, Briefcase, Building2, User, ChevronRight, 
  ArrowLeft, CheckCircle2, ShieldCheck, UploadCloud, Monitor, Code, PenTool
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";

export default function OnboardingPage() {
  const router = useRouter();
  
  // Overall flow step: 1 (OTP), 2 (Role), 3 (Role Specific Details)
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  
  // Form States
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    // If token exists, they already verified their OTP. Skip to role selection.
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      setStep(2);
    }
  }, []);

  // File Upload Refs and State
  const expertFileInputRef = useRef<HTMLInputElement>(null);
  const collegeFileInputRef = useRef<HTMLInputElement>(null);
  const [expertFile, setExpertFile] = useState<File | null>(null);
  const [collegeFile, setCollegeFile] = useState<File | null>(null);

  // Expert specific
  const [expertDesignation, setExpertDesignation] = useState("");
  const [expertCompany, setExpertCompany] = useState("");
  
  // Company specific
  const [companyName, setCompanyName] = useState("");
  const [companyGst, setCompanyGst] = useState("");

  // College specific
  const [collegeName, setCollegeName] = useState("");
  const [aicteCode, setAicteCode] = useState("");

  const roles = [
    { id: "student", title: "Student / Learner", desc: "Access courses, internships, and placements.", icon: GraduationCap },
    { id: "expert", title: "Industry Expert", desc: "Mentor students and review projects.", icon: User },
    { id: "company", title: "Company / HR", desc: "Hire verified talent and post jobs.", icon: Building2 },
    { id: "college", title: "University / College", desc: "Manage placement drives and students.", icon: Briefcase },
  ];

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
      toast.success("Email verified successfully!");
    }, 1500);
  };

  const submitOnboarding = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Route based on role
      if (role === "student") {
        router.push("/student/dashboard");
      } else {
        // All other roles require admin verification
        router.push("/verification-pending");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <SEO title="Complete Your Profile | Blueboxx DA" description="Set up your Blueboxx DA profile to unlock personalized features." />
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-100 rounded-full blur-[100px] opacity-40 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Header */}
      <div className="p-6 md:p-10 relative z-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logoblue.png" alt="BlueBoxx" className="h-10 w-auto object-contain" />
        </Link>
        
        {/* Dynamic Progress Tracker */}
        <div className="hidden md:block w-48 relative bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1B2A6B] to-[#C9A227] rounded-full"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Content Box */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 relative z-10 w-full max-w-3xl mx-auto">
        <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(27,42,107,0.06)] border border-slate-100 p-8 md:p-12 overflow-hidden relative min-h-[500px] flex flex-col justify-center">
          
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#1B2A6B] hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: OTP VERIFICATION */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto w-full text-center"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">Verify your email</h1>
                <p className="text-slate-500 font-medium text-sm mb-8">We've sent a 6-digit security code to your email. Please enter it below to verify your account.</p>
                
                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-black rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
                    />
                  ))}
                </div>

                <Button 
                  onClick={verifyOtp}
                  disabled={isVerifying || otp.join("").length !== 6}
                  className="w-full h-12 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-all uppercase tracking-wider"
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>
                <button className="mt-6 text-xs font-bold text-slate-400 hover:text-[#1B2A6B] transition-colors">Resend Code</button>
              </motion.div>
            )}

            {/* STEP 2: ROLE SELECTION */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl mx-auto w-full"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-black text-slate-800 mb-2">Select your role</h1>
                  <p className="text-slate-500 font-medium text-sm">How do you plan to use BlueBoxx? This determines your platform experience.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((r) => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={r.id} 
                      onClick={() => setRole(r.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 relative ${
                        role === r.id 
                          ? "border-[#1B2A6B] bg-blue-50/50 shadow-md" 
                          : "border-slate-100 hover:border-[#1B2A6B]/30 hover:bg-slate-50 shadow-sm"
                      }`}
                    >
                      {role === r.id && (
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute top-3 right-3 text-[#C9A227]"
                        >
                          <CheckCircle2 size={20} />
                        </motion.div>
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        role === r.id ? "bg-[#1B2A6B] text-white" : "bg-white border border-slate-200 text-slate-400"
                      }`}>
                        <r.icon size={24} />
                      </div>
                      <div>
                        <h3 className={`font-black mb-1 ${role === r.id ? "text-[#1B2A6B]" : "text-slate-800"}`}>{r.title}</h3>
                        <p className="text-[11px] font-semibold text-slate-500">{r.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button 
                    disabled={!role}
                    onClick={() => setStep(3)}
                    className="w-full h-12 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    Continue Setup <ChevronRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ROLE SPECIFIC ONBOARDING */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl mx-auto w-full"
              >
                
                {/* EXPERT FORM */}
                {role === "expert" && (
                  <div>
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-black text-slate-800 mb-2">Expert Verification</h1>
                      <p className="text-slate-500 font-medium text-sm">Provide your professional credentials. These will be reviewed by our team.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Current Designation</label>
                        <input type="text" value={expertDesignation} onChange={e=>setExpertDesignation(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Current Company</label>
                        <input type="text" value={expertCompany} onChange={e=>setExpertCompany(e.target.value)} placeholder="e.g. Google, Microsoft, Startup" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">LinkedIn Profile URL</label>
                        <input type="url" placeholder="https://linkedin.com/in/..." className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                      <div className="pt-2">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 block">Upload Resume (PDF)</label>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          className="hidden" 
                          ref={expertFileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setExpertFile(e.target.files[0]);
                            }
                          }}
                        />
                        <div 
                          onClick={() => expertFileInputRef.current?.click()}
                          className={`w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                            expertFile 
                              ? 'border-[#1B2A6B] bg-blue-50/50 text-[#1B2A6B]' 
                              : 'border-slate-300 text-slate-400 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          {expertFile ? (
                            <>
                              <CheckCircle2 size={24} className="mb-1 text-emerald-500" />
                              <span className="text-[10px] font-bold truncate max-w-[200px]">{expertFile.name}</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud size={24} className="mb-1" />
                              <span className="text-[10px] font-bold">Click to browse files</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* COMPANY FORM */}
                {role === "company" && (
                  <div>
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-black text-slate-800 mb-2">Company Registration</h1>
                      <p className="text-slate-500 font-medium text-sm">Register your organization to start hiring verified talent.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Company Name</label>
                        <input type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Official Website</label>
                        <input type="url" placeholder="https://..." className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">GST / CIN Number</label>
                        <input type="text" value={companyGst} onChange={e=>setCompanyGst(e.target.value)} placeholder="Business Registration Number" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                    </div>
                  </div>
                )}

                {/* COLLEGE FORM */}
                {role === "college" && (
                  <div>
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-black text-slate-800 mb-2">Institution Registration</h1>
                      <p className="text-slate-500 font-medium text-sm">Onboard your college to track student placements and drives.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Institution Name</label>
                        <input type="text" value={collegeName} onChange={e=>setCollegeName(e.target.value)} placeholder="e.g. IIT Delhi" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">AICTE / UGC Code</label>
                        <input type="text" value={aicteCode} onChange={e=>setAicteCode(e.target.value)} placeholder="Registration Code" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] outline-none text-sm font-semibold bg-slate-50/50" />
                      </div>
                      <div className="pt-2">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 block">Upload Verification Letter (PDF)</label>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          className="hidden" 
                          ref={collegeFileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setCollegeFile(e.target.files[0]);
                            }
                          }}
                        />
                        <div 
                          onClick={() => collegeFileInputRef.current?.click()}
                          className={`w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                            collegeFile 
                              ? 'border-[#1B2A6B] bg-blue-50/50 text-[#1B2A6B]' 
                              : 'border-slate-300 text-slate-400 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          {collegeFile ? (
                            <>
                              <CheckCircle2 size={24} className="mb-1 text-emerald-500" />
                              <span className="text-[10px] font-bold truncate max-w-[200px]">{collegeFile.name}</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud size={24} className="mb-1" />
                              <span className="text-[10px] font-bold">Upload letter on official letterhead</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STUDENT FORM */}
                {role === "student" && (
                  <div>
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-black text-slate-800 mb-2">What are your interests?</h1>
                      <p className="text-slate-500 font-medium text-sm">Select up to 3 domains you want to focus on for recommendations.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "frontend", label: "Frontend", icon: Monitor },
                        { id: "backend", label: "Backend", icon: Code },
                        { id: "design", label: "UI/UX", icon: PenTool },
                        { id: "data", label: "Data Science", icon: ShieldCheck }
                      ].map((skill) => {
                        const isSelected = selectedSkills.includes(skill.id);
                        return (
                          <div 
                            key={skill.id}
                            onClick={() => {
                              if (isSelected) setSelectedSkills(selectedSkills.filter(s => s !== skill.id));
                              else if (selectedSkills.length < 3) setSelectedSkills([...selectedSkills, skill.id]);
                            }}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                              isSelected 
                                ? "border-[#1B2A6B] bg-blue-50/50 shadow-sm" 
                                : "border-slate-100 hover:bg-slate-50"
                            }`}
                          >
                            <skill.icon size={24} className={isSelected ? "text-[#1B2A6B]" : "text-slate-400"} />
                            <span className={`text-xs font-bold ${isSelected ? "text-[#1B2A6B]" : "text-slate-600"}`}>
                              {skill.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <Button 
                    disabled={isSubmitting}
                    onClick={submitOnboarding}
                    className="w-full h-12 bg-[#C9A227] hover:bg-amber-400 text-[#0d1635] font-black rounded-xl shadow-md transition-all disabled:opacity-50 uppercase tracking-wider"
                  >
                    {isSubmitting ? "Submitting Application..." : role === "student" ? "Complete Setup" : "Submit for Verification"}
                  </Button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
