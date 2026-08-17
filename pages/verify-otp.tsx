import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../src/components/ui/Button";
import { AuthBranding } from "../src/components/AuthBranding";
import { motion } from "framer-motion";
import api from "../src/lib/axios";
import { useAuth } from "../src/context/AuthContext";
import { SEO } from "../src/components/seo/SEO";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { email } = router.query;
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { login } = useAuth();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !email) return;
    
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post("/verify-otp", { email, otp });
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }
      
      if (response.data.user) {
        const fetchedUser = response.data.user;
        const role = fetchedUser.roles && fetchedUser.roles.length > 0 
          ? fetchedUser.roles[0].name 
          : "student";

        const mappedUser = {
          name: fetchedUser.name,
          email: fetchedUser.email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fetchedUser.name)}`,
          role: role
        };

        login(mappedUser, response.data.token || "");
      }

      setSuccessMsg("Email verified successfully!");
      setTimeout(() => {
        router.push("/onboarding");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError("");
    setSuccessMsg("");
    try {
      await api.post("/resend-otp", { email });
      setSuccessMsg("A new OTP has been sent to your email and phone.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
    setIsResending(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <SEO title="Verify OTP | Blueboxx DA" description="Verify your email address using the one-time password sent to you." />
      {/* Left Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[450px] shrink-0 flex flex-col justify-center px-8 sm:px-12 py-6 relative overflow-y-auto custom-scrollbar z-10 shadow-[20px_0_40px_rgba(0,0,0,0.05)] bg-white font-inter"
      >
        <div className="w-full mx-auto max-w-sm py-4">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <img src="/Boxxlogo.png" alt="BlueBoxx" className="h-10 w-auto object-contain" />
          </Link>

          <motion.div variants={container} initial="hidden" animate="show" className="mb-6">
            <motion.h2 variants={item} className="text-2xl font-black text-slate-800 mb-1.5 font-sora">Verify Account</motion.h2>
            <motion.p variants={item} className="text-sm text-slate-500 font-medium">
              We've sent a 6-digit code to <span className="font-bold text-slate-800">{email}</span>.
            </motion.p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-200">
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-200">
              {successMsg}
            </motion.div>
          )}

          <motion.form variants={container} initial="hidden" animate="show" onSubmit={handleVerify} className="space-y-4">
            <motion.div variants={item} className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full h-14 text-center text-2xl tracking-[0.5em] rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-black text-slate-800 bg-white"
              />
            </motion.div>

            <motion.div variants={item}>
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6 || !email}
                className="w-full h-11 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-black rounded-xl text-sm shadow-[0_4px_15px_rgba(27,42,107,0.2)] transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider mt-2"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>
            </motion.div>

            <motion.p variants={item} className="text-center text-xs font-medium text-slate-600 mt-4 pb-2">
              Didn't receive the code?{" "}
              <button 
                type="button" 
                onClick={handleResend}
                disabled={isResending}
                className="font-bold text-[#1B2A6B] hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            </motion.p>
          </motion.form>
        </div>
      </motion.div>

      {/* Right Column - Branding */}
      <AuthBranding />
    </div>
  );
}
