import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../src/components/ui/Button";
import { Mail, ChevronRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import api from "../src/lib/axios";
import toast from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      await api.post("/forgot-password", { email });
      toast.success("OTP sent to your email.");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset email.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1635] flex items-center justify-center p-4 relative overflow-hidden">
      <SEO title="Forgot Password | Blueboxx DA" description="Reset your Blueboxx DA password securely via email OTP." />
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
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat mix-blend-overlay grayscale"
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
        className="w-full max-w-[390px] bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 z-10 flex flex-col relative font-inter"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <img src="/Boxxlogo.png" alt="BlueBoxx" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        <Link href="/login" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#1B2A6B] transition-colors mb-6 w-fit">
          <ArrowLeft size={14} /> Back to Login
        </Link>

          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-slate-800 leading-tight font-sora">Reset password</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">We'll send you an OTP to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/15 outline-none transition-all text-xs font-semibold text-slate-800 bg-slate-50/20"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-11 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    Send OTP <ChevronRight size={16} />
                  </div>
                )}
              </Button>
            </form>
          </div>
      </motion.div>
    </div>
  );
}
