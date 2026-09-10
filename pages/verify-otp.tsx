import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../src/components/ui/Button";
import { AuthBranding } from "../src/components/AuthBranding";
import { motion } from "framer-motion";
import api from "../src/lib/axios";
import { useAuth } from "../src/context/AuthContext";
import { SEO } from "../src/components/seo/SEO";
import { ShieldCheck, ArrowLeft, RefreshCw, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { email: queryEmail, role: queryRole } = router.query;
  const email = typeof queryEmail === "string" ? queryEmail.trim().toLowerCase() : "";
  const role = typeof queryRole === "string" ? queryRole.trim().toLowerCase() : "student";

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [expirySeconds, setExpirySeconds] = useState(600); // 10 minutes
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds
  const { login } = useAuth();

  // Expiration countdown timer
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [expirySeconds]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const newDigits = [...otpDigits];
    
    // Handle paste of multiple characters
    if (cleaned.length > 1) {
      const pastedChars = cleaned.slice(0, 6).split("");
      pastedChars.forEach((char, i) => {
        if (index + i < 6) {
          newDigits[index + i] = char;
        }
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(index + pastedChars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = cleaned.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance focus
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullOtp = otpDigits.join("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullOtp.length !== 6 || !email) return;

    if (expirySeconds <= 0) {
      setError("This OTP has expired. Please click 'Resend OTP' to receive a new code.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post("/verify-otp", {
        email,
        otp: fullOtp,
      });

      const { data } = response;

      // 1. If Expert / College / Company: Pending Admin Approval
      if (data.status === "pending_admin_approval" || data.requires_approval) {
        toast.success("Email verified successfully! Awaiting administrator approval.");
        setSuccessMsg("Email verified! Redirecting to approval status page...");
        setTimeout(() => {
          router.push("/pending-approval");
        }, 1200);
        return;
      }

      // 2. If Student / Intern / Jobseeker: Auto-Active
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      const fetchedUser = data.user || {};
      const userRole = (fetchedUser.roles && fetchedUser.roles.length > 0)
        ? fetchedUser.roles[0].name
        : (role || "student");

      const mappedUser = {
        name: fetchedUser.name || "User",
        email: fetchedUser.email || email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fetchedUser.name || email)}`,
        role: userRole,
      };

      login(mappedUser, data.token || "");
      toast.success("Email verified successfully! Welcome to Sarvakshetra.");

      setTimeout(() => {
        const normalizedRole = String(userRole).toLowerCase();
        if (normalizedRole === "intern") router.push("/intern/dashboard");
        else if (normalizedRole === "job-seeker" || normalizedRole === "jobseeker") router.push("/jobseeker/dashboard");
        else router.push("/student/dashboard");
      }, 1000);

    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err.response?.data?.message || "Invalid or expired OTP code.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post("/resend-otp", { email });
      setSuccessMsg("A new 6-digit verification code has been sent to your email.");
      setExpirySeconds(600); // Reset 10 minutes
      setResendCooldown(60); // Reset 60 seconds
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.success("New OTP sent successfully!");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to resend OTP. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsResending(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white flex font-inter">
      <SEO
        title="Verify Email OTP | Sarvakshetra"
        description="Verify your email address using the one-time password code sent to you."
      />

      {/* Left Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[480px] shrink-0 flex flex-col justify-center px-8 sm:px-12 py-8 relative overflow-y-auto custom-scrollbar z-10 shadow-[20px_0_40px_rgba(0,0,0,0.05)] bg-white"
      >
        <div className="w-full mx-auto max-w-sm py-4">
          
          {/* Back link */}
          <Link
            href={`/signup/${role}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1B2A6B] transition-colors text-xs font-bold mb-6 group"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#1B2A6B]/10 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Registration
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-6">
            <img src="/Boxxlogo.png" alt="Sarvakshetra" className="h-10 w-auto object-contain" />
          </Link>

          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B2A6B]/10 text-[#1B2A6B] text-[11px] font-black uppercase tracking-wider mb-3">
              <ShieldCheck size={14} /> Email Verification
            </div>
            <motion.h1 variants={item} className="text-2xl font-black text-slate-800 mb-1.5 font-sora">
              Verify Your Email
            </motion.h1>
            <motion.p variants={item} className="text-sm text-slate-500 font-medium leading-relaxed">
              We have sent a 6-digit security code to:
            </motion.p>
            <motion.p variants={item} className="text-sm font-bold text-slate-800 mt-1 break-all bg-slate-50 p-2 rounded-lg border border-slate-200">
              {email || "your registered email"}
            </motion.p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-start gap-2.5"
            >
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <motion.form variants={container} initial="hidden" animate="show" onSubmit={handleVerify} className="space-y-5">
            <motion.div variants={item} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">
                  Enter 6-Digit Code
                </label>
                <span className={`text-xs font-bold flex items-center gap-1 ${expirySeconds < 120 ? 'text-rose-600' : 'text-slate-500'}`}>
                  <Clock size={12} /> {formatTime(expirySeconds)}
                </span>
              </div>

              {/* 6 Individual Digit Inputs */}
              <div className="flex items-center justify-between gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 sm:w-12 h-14 text-center text-2xl font-black rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all text-slate-800 bg-white shadow-sm"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div variants={item} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || fullOtp.length !== 6 || !email || expirySeconds <= 0}
                className="w-full h-12 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-black rounded-xl text-sm shadow-[0_4px_15px_rgba(27,42,107,0.2)] transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    Verifying OTP...
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </motion.div>

            {/* Resend Cooldown Section */}
            <motion.div variants={item} className="text-center pt-2">
              <p className="text-xs font-medium text-slate-500">
                Didn't receive the email code?
              </p>
              <div className="mt-1.5">
                {resendCooldown > 0 ? (
                  <span className="text-xs font-bold text-slate-400 inline-flex items-center gap-1.5">
                    <Clock size={12} /> Resend available in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-xs font-black text-[#1B2A6B] hover:underline disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div variants={item} className="text-center border-t border-slate-100 pt-4 mt-4">
              <p className="text-xs text-slate-400">
                Need to change your email?{" "}
                <Link href={`/signup/${role}`} className="font-bold text-[#1B2A6B] hover:underline">
                  Sign up again
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>

      {/* Right Column - Branding */}
      <AuthBranding />
    </div>
  );
}
