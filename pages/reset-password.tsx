import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../src/components/ui/Button";
import { Lock, Eye, EyeOff, ChevronRight, CheckCircle2, ArrowLeft, Mail, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import api from "../src/lib/axios";
import toast from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync email from router query once available
  useEffect(() => {
    if (router.isReady) {
      const qEmail = Array.isArray(router.query.email) ? router.query.email[0] : router.query.email;
      if (qEmail && typeof qEmail === "string") {
        setEmailInput(qEmail);
      }
    }
  }, [router.isReady, router.query.email]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

  const handleResendOtp = async () => {
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your registered email address first.");
      setIsEditingEmail(true);
      return;
    }
    if (isResending || resendCooldown > 0) return;
    setIsResending(true);
    try {
      const res = await api.post("/forgot-password", { email: trimmedEmail });
      toast.success(res.data?.message || `New OTP sent to ${trimmedEmail}`, { duration: 5000 });
      setResendCooldown(45);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP code. Please check email address.");
    } finally {
      setIsResending(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) {
      toast.error("Registered email is required.");
      setIsEditingEmail(true);
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP code.");
      return;
    }
    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }
    if (strength < 50) {
      toast.error("Please choose a stronger password.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post("/reset-password", {
        email: trimmedEmail,
        otp: otp.trim(),
        password,
        password_confirmation: confirmPassword
      });
      
      toast.success(response.data?.message || "Password reset successfully! Redirecting to login...", { duration: 4000 });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please verify the OTP code.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1635] flex items-center justify-center p-4 relative overflow-hidden">
      <SEO title="Set New Password | Blueboxx DA" description="Set your new Blueboxx DA password securely." />
      
      {/* Background glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A227]/10 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 z-10 flex flex-col relative font-inter"
      >
        <div className="flex justify-center mb-5">
          <Link href="/">
            <img src="/Boxxlogo.png" alt="BlueBoxx" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        <Link href="/forgot-password" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#1B2A6B] transition-colors mb-5 w-fit">
          <ArrowLeft size={14} /> Request New OTP
        </Link>

        <div className="text-center mb-5">
          <h2 className="text-xl font-black text-slate-800 leading-tight font-sora">Set New Password</h2>
          
          {/* Registered Email Card */}
          {emailInput && !isEditingEmail ? (
            <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-left flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900">OTP Sent to Registered Email:</p>
                  <p className="text-xs font-black text-blue-700 truncate">{emailInput}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline shrink-0 cursor-pointer pt-0.5"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-1 text-left">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Registered Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/15 outline-none transition-all text-xs font-semibold text-slate-800 bg-slate-50/20"
                />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">6-Digit OTP Code</label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || resendCooldown > 0 || !emailInput}
                className="text-[11px] font-bold text-[#1B2A6B] hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={11} className={isResending ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : (isResending ? 'Sending...' : 'Resend OTP')}
              </button>
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full h-11 text-center text-lg tracking-[0.5em] rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-black text-slate-800 bg-slate-50/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/15 outline-none transition-all text-xs font-semibold text-slate-800 tracking-wider bg-slate-50/20"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Password Strength Meter */}
            {password && (
              <div className="pt-1.5">
                <div className="flex gap-1.5 h-1 w-full mb-1">
                  <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 25 ? strengthColor : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 50 ? strengthColor : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 75 ? strengthColor : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 100 ? strengthColor : 'bg-slate-200'}`} />
                </div>
                <p className="text-[10px] font-bold flex justify-between text-slate-500">
                  <span>Strength: {strengthText}</span>
                  {strength > 75 && <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12}/> Secure</span>}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/15 outline-none transition-all text-xs font-semibold text-slate-800 tracking-wider bg-slate-50/20"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> Passwords do not match.
              </p>
            )}
          </div>

          <Button 
            type="submit"
            disabled={isLoading || !passwordsMatch || strength < 50 || otp.length !== 6 || !emailInput}
            className="w-full h-11 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Resetting Password...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                Set New Password <ChevronRight size={16} />
              </div>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
