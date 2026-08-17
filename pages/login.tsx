import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../src/components/ui/Button";
import { useAuth } from "../src/context/AuthContext";
import api from "../src/lib/axios";
import { Mail, Lock, ChevronRight, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const { login, isAuthenticated, role } = useAuth();

  // Email memory removed as per user request to keep login fresh

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
    } else if (lockoutTimer === 0 && failedAttempts >= 3) {
      setFailedAttempts(0);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer, failedAttempts]);

  useEffect(() => {
    if (isAuthenticated) {
      const { redirect, returnUrl } = router.query;
      const targetUrl = (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('/login'))
        ? redirect
        : (typeof returnUrl === 'string' && returnUrl.startsWith('/') && !returnUrl.startsWith('/login'))
        ? returnUrl
        : null;

      const roleToDashboard: Record<string, string> = {
        admin:       '/admin/dashboard',
        super_admin: '/admin/dashboard',
        student:     '/student/dashboard',
        expert:      '/expert/dashboard',
        company:     '/company/dashboard',
        college:     '/college/dashboard',
        intern:      '/intern/dashboard',
        'job-seeker':'/jobseeker/dashboard',
        jobseeker:   '/jobseeker/dashboard',
      };
      router.replace(targetUrl || roleToDashboard[role?.toLowerCase() || 'student'] || '/student/dashboard');
    }
  }, [isAuthenticated, role, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setIsLoading(true);

    try {
      const response = await api.post("/login", { email, password });
      
      const { token, user } = response.data;
      
      // Extract role
      let userRole = "student";
      if (user.roles && user.roles.length > 0) {
        const roleNames = user.roles.map((r: any) => r.name);
        if (roleNames.includes('super_admin')) userRole = 'super_admin';
        else if (roleNames.includes('admin')) userRole = 'admin';
        else userRole = roleNames[0];
      }
      
      // Map to context structure
      const mappedUser = {
        name: user.name,
        email: user.email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        role: userRole as any
      };

      login(mappedUser, token);
      
      // Remember me logic removed to keep login fresh

      toast.success("Logged in successfully!");
      setIsLoading(false);

      // Map role to correct dashboard route (handles hyphenated roles)
      const roleToDashboard: Record<string, string> = {
        admin:       '/admin/dashboard',
        super_admin: '/admin/dashboard',
        student:     '/student/dashboard',
        expert:      '/expert/dashboard',
        company:     '/company/dashboard',
        college:     '/college/dashboard',
        intern:      '/intern/dashboard',
        'job-seeker':'/jobseeker/dashboard',
        jobseeker:   '/jobseeker/dashboard',
      };
      
      const { redirect, returnUrl } = router.query;
      const destination = (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('/login'))
        ? redirect 
        : (typeof returnUrl === 'string' && returnUrl.startsWith('/') && !returnUrl.startsWith('/login'))
        ? returnUrl
        : (roleToDashboard[userRole] ?? '/student/dashboard');
        
      router.push(destination);
    } catch (err: any) {
      setIsLoading(false);
      const message = err.response?.data?.message || "Invalid credentials.";
      toast.error(message);
      
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTimer(300); // 5 minute lock for frontend consistency
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1635] flex items-center justify-center p-4 relative overflow-hidden">
      <SEO title="Login | Blueboxx DA" description="Sign in to your Blueboxx DA account to access your dashboard, courses, and job applications." />
      {/* Background glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A227]/10 blur-[130px]" />
      </div>

      {/* EdTech Background Image Overlay */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat mix-blend-overlay grayscale pointer-events-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80")' }} 
      />

      {/* Grid Pattern Overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[390px] bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-5 sm:p-6 z-10 flex flex-col relative font-inter"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link href="/">
            <img src="/Boxxlogo.png" alt="BlueBoxx" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-black text-slate-800 leading-tight font-sora">Welcome back</h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3" autoComplete="off">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                name="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/15 outline-none transition-all text-xs font-semibold text-slate-800 bg-slate-50/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-[10px] font-bold text-[#1B2A6B] hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className={`w-full h-11 pl-10 pr-10 rounded-xl border focus:ring-2 outline-none transition-all text-xs font-semibold text-slate-800 tracking-wider bg-slate-50/20 ${
                  failedAttempts > 0 
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15' 
                    : 'border-slate-200 focus:border-[#1B2A6B] focus:ring-[#1B2A6B]/15'
                }`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none z-30 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {failedAttempts > 0 && failedAttempts < 3 && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">Invalid credentials. {3 - failedAttempts} attempts remaining.</p>
            )}
          </div>

          {/* Remember me section removed to keep form clean */}

          {lockoutTimer > 0 ? (
            <div className="w-full h-11 bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 uppercase tracking-wider mt-3">
              <AlertCircle size={16} /> Locked out for {lockoutTimer}s
            </div>
          ) : (
            <Button 
              type="submit"
              disabled={isLoading || !email || !password || lockoutTimer > 0}
              className="w-full h-11 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  Sign In <ChevronRight size={16} />
                </div>
              )}
            </Button>
          )}

          <div className="flex justify-center items-center gap-1.5 mt-3 text-slate-400 text-[10px] font-bold tracking-wide">
            <ShieldCheck size={14} className="text-emerald-500" /> Secured via 256-bit SSL
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 text-center space-y-2">
            <p className="text-xs font-medium text-slate-500">
              Don't have an account? <Link href="/signup/student" className="font-bold text-[#1B2A6B] hover:underline">Register as Student</Link>
            </p>
            <p className="text-[10px] font-medium text-slate-400">
              Other Roles: 
              <Link href="/signup/intern" className="hover:text-[#1B2A6B] hover:underline mx-1">Intern</Link>|
              <Link href="/signup/jobseeker" className="hover:text-[#1B2A6B] hover:underline mx-1">Job Seeker</Link>|
              <Link href="/signup/company" className="hover:text-[#1B2A6B] hover:underline mx-1">Company</Link>|
              <Link href="/signup/college" className="hover:text-[#1B2A6B] hover:underline mx-1">College</Link>|
              <Link href="/signup/expert" className="hover:text-[#1B2A6B] hover:underline mx-1">Expert</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
