import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Mail, Lock, User, ChevronRight, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthBranding } from "../../src/components/AuthBranding";
import { motion } from "framer-motion";
import { useAuth } from "../../src/context/AuthContext";
import { SEO } from "../../src/components/seo/SEO";

// Define allowed roles and their UI configurations
const ROLE_CONFIG: Record<string, { title: string, nameLabel: string, namePlaceholder: string, icon: any }> = {
  student: { title: "Student", nameLabel: "Full Name", namePlaceholder: "e.g. Rahul Sharma", icon: User },
  intern: { title: "Intern", nameLabel: "Full Name", namePlaceholder: "e.g. Rahul Sharma", icon: User },
  jobseeker: { title: "Job Seeker", nameLabel: "Full Name", namePlaceholder: "e.g. Rahul Sharma", icon: User },
  "job-seeker": { title: "Job Seeker", nameLabel: "Full Name", namePlaceholder: "e.g. Rahul Sharma", icon: User },
  company: { title: "Company", nameLabel: "Company Name", namePlaceholder: "e.g. Blueboxx Technologies", icon: User },
  college: { title: "College/University", nameLabel: "Institution Name", namePlaceholder: "e.g. IIT Delhi", icon: User },
  expert: { title: "Expert/Instructor", nameLabel: "Full Name", namePlaceholder: "e.g. Dr. Rahul Sharma", icon: User },
};

export default function RoleSignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Extract role from URL
  const { role: rawRole } = router.query;
  const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : '';

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Validate role on mount
  useEffect(() => {
    if (router.isReady && role) {
      if (!ROLE_CONFIG[role]) {
        // Block invalid roles (like admin) and redirect to login
        router.replace('/login');
      }
    }
  }, [router.isReady, role, router]);

  const config = ROLE_CONFIG[role];

  // Password strength calculation
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.match(/[A-Z]/)) score += 25;
    if (pass.match(/[0-9]/)) score += 25;
    if (pass.match(/[^A-Za-z0-9]/)) score += 25;
    return score;
  };

  const strength = getStrength(password);
  let strengthColor = "bg-slate-200";
  let strengthText = "";
  if (strength > 0) { strengthColor = "bg-rose-500"; strengthText = "Weak"; }
  if (strength > 25) { strengthColor = "bg-amber-400"; strengthText = "Fair"; }
  if (strength > 50) { strengthColor = "bg-blue-500"; strengthText = "Good"; }
  if (strength > 75) { strengthColor = "bg-emerald-500"; strengthText = "Strong"; }

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || strength < 50) return;
    
    setIsLoading(true);
    setError("");

    try {
      const api = (await import("../../src/lib/axios")).default;
      // Send the role explicitly as the URL param (mapped to backend role)
      const backendRole = role === 'jobseeker' ? 'job-seeker' : role;

      const response = await api.post("/register", {
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
        role: backendRole,
      });

      const token = response.data.token || response.data.data?.token || response.data.access_token || "";
      const userData = response.data.user || response.data.data?.user || response.data.data || {};
      
      if (response.data.status === 'pending_approval' || userData.status === 'pending_approval') {
        router.push('/pending-approval');
      } else {
        const userRole = (userData.roles && userData.roles.length > 0 ? userData.roles[0].name : (userData.role || backendRole)) || "student";
        
        const mappedUser = {
          name: userData.name || `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || name,
          email: userData.email || email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name || name)}`,
          role: userRole
        };
        
        login(mappedUser, token);
        
        // Redirect to appropriate dashboard based on role
        const normalizedRole = String(userRole).toLowerCase();
        if (normalizedRole === 'expert' || normalizedRole === 'mentor') router.push("/expert/dashboard");
        else if (normalizedRole === 'company') router.push("/company/dashboard");
        else if (normalizedRole === 'college') router.push("/college/dashboard");
        else if (normalizedRole === 'intern') router.push("/intern/dashboard");
        else if (normalizedRole === 'job-seeker' || normalizedRole === 'jobseeker') router.push("/jobseeker/dashboard");
        else router.push("/student/dashboard");
      }
    } catch (err: any) {
      let errMsg = err.response?.data?.message;
      if (err.response?.data?.errors) {
        const errorValues = Object.values(err.response.data.errors).flat();
        if (errorValues.length > 0) {
          errMsg = String(errorValues[0]);
        }
      }
      setError(errMsg || (err.message === "Network Error" ? "Network error: Unable to reach backend server." : "An error occurred during signup."));
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (!config) return null; // Avoid rendering until config is loaded or redirect happens

  return (
    <div className="min-h-screen bg-white flex">
      <SEO title={`${config.title} Registration | Blueboxx DA`} description={`Register as a ${config.title} at Blueboxx DA to explore premium IT training, internships, and job opportunities.`} />

      {/* Left Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[450px] shrink-0 flex flex-col justify-center px-8 sm:px-12 py-4 relative overflow-y-auto custom-scrollbar z-10 shadow-[20px_0_40px_rgba(0,0,0,0.05)] bg-white font-inter"
      >
        <div className="w-full mx-auto max-w-sm py-2 relative">

          {/* Back Button */}
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1B2A6B] transition-colors text-sm font-bold mb-4 group">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#1B2A6B]/10 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
            </div>
            Back to Login
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-6 mt-4">
            <img src="/Boxxlogo.png" alt="BlueBoxx" className="h-9 w-auto object-contain" />
          </Link>

          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1B2A6B]/10 text-[#1B2A6B] text-[10px] font-black uppercase tracking-widest mb-3">
              {config.title} Registration
            </motion.div>
            <motion.h2 variants={item} className="text-2xl font-black text-slate-800 mb-1 font-sora">Create an account</motion.h2>
            <motion.p variants={item} className="text-xs text-slate-500 font-medium mb-2">Join BlueBoxx and start building your future.</motion.p>
            <motion.p variants={item} className="text-sm font-medium text-slate-600 mt-2">
              Already have an account? <Link href="/login" className="font-extrabold text-[#1B2A6B] hover:text-[#0d1635] underline decoration-2 underline-offset-2">Log in</Link>
            </motion.p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-200">
              {error}
            </motion.div>
          )}

          <motion.form variants={container} initial="hidden" animate="show" onSubmit={handleSignup} className="space-y-4">
            <motion.div variants={item} className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">{config.nameLabel}</label>
              <div className="relative">
                <config.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={config.namePlaceholder}
                  autoComplete="off"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800 text-sm bg-white shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={item} className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">+91</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  autoComplete="off"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800 text-sm bg-white shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={item} className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="off"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800 text-sm bg-white shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={item} className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full h-11 pl-11 pr-11 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800 text-sm tracking-widest bg-white shadow-sm"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {password && (
                <div className="pt-2 px-1">
                  <div className="flex gap-1.5 h-1.5 w-full mb-2">
                    <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength > 0 ? strengthColor : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength > 25 ? strengthColor : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength > 50 ? strengthColor : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength > 75 ? strengthColor : 'bg-slate-200'}`} />
                  </div>
                  <p className={`text-[10px] font-bold ${strength > 50 ? 'text-emerald-600' : 'text-slate-500'} flex justify-between`}>
                    <span>Password Strength: {strengthText}</span>
                    {strength > 75 && <span className="flex items-center gap-1"><CheckCircle2 size={12}/> Awesome</span>}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div variants={item} className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full h-11 pl-11 pr-11 rounded-xl border focus:ring-2 outline-none transition-all font-semibold text-slate-800 text-sm tracking-widest bg-white shadow-sm ${
                    !passwordsMatch 
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
                      : 'border-slate-200 focus:border-[#1B2A6B] focus:ring-[#1B2A6B]/20'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-[10px] font-bold text-rose-500 ml-1 mt-0.5">Passwords do not match.</p>
              )}
            </motion.div>

            <motion.div variants={item} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || !email || !password || !name || !passwordsMatch || strength < 50}
                className="w-full h-12 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-black rounded-xl text-sm shadow-[0_4px_15px_rgba(27,42,107,0.2)] transition-all group disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Create {config.title} Account <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </motion.div>

            <motion.p variants={item} className="text-[10px] font-semibold text-slate-400 text-center pt-2">
              By creating an account, you agree to our <Link href="/terms" className="text-[#1B2A6B] hover:underline">Terms</Link> and <Link href="/privacy-policy" className="text-[#1B2A6B] hover:underline">Privacy</Link>.
            </motion.p>
          </motion.form>
        </div>
      </motion.div>

      {/* Right Column - Branding */}
      <AuthBranding />

    </div>
  );
}
