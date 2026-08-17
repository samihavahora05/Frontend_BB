import { Button } from "../src/components/ui/Button";
import { CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AuthBranding } from "../src/components/AuthBranding";
import { SEO } from "../src/components/seo/SEO";

export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen bg-white flex">
      <SEO title="Verification Pending | Blueboxx DA" description="Your account is currently under review by our admin team." robots="noindex, nofollow" />
      {/* Left Column - Content */}
      <div className="w-full lg:w-[500px] shrink-0 flex flex-col justify-center px-8 sm:px-12 py-12 relative overflow-y-auto custom-scrollbar z-10 shadow-[20px_0_40px_rgba(0,0,0,0.05)] bg-white">
        <div className="w-full mx-auto max-w-sm">
          
          <Link href="/" className="flex items-center gap-3 mb-8">
            <img src="/logoblue.png" alt="BlueBoxx" className="h-10 w-auto object-contain" />
          </Link>

          <div className="mb-8">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 shadow-sm animate-pulse">
              <Clock size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-3 leading-tight">Verification<br/>Pending</h1>
            <p className="text-slate-500 font-medium">Thank you for submitting your application. Our team is carefully reviewing your credentials to ensure platform quality.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex gap-4">
              <div className="text-emerald-500 shrink-0 mt-0.5"><CheckCircle2 size={18} /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Application Submitted</h4>
                <p className="text-xs text-slate-500 font-medium">Your profile and documents have been securely uploaded.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex gap-4">
              <div className="text-amber-500 shrink-0 mt-0.5"><Clock size={18} /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">In Review Process</h4>
                <p className="text-xs text-slate-500 font-medium">Our admin team typically completes reviews within 24-48 hours.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex gap-4 opacity-50">
              <div className="text-slate-400 shrink-0 mt-0.5"><ShieldCheck size={18} /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Access Granted</h4>
                <p className="text-xs text-slate-500 font-medium">You will be notified via email once your dashboard is unlocked.</p>
              </div>
            </div>
          </div>

          <Link href="/">
            <Button className="w-full h-12 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2">
              Return to Homepage <ArrowRight size={16} />
            </Button>
          </Link>

        </div>
      </div>

      {/* Right Column - Branding */}
      <AuthBranding />
    </div>
  );
}
