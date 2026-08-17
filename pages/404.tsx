import Link from "next/link";
import { useRouter } from "next/router";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "../src/components/seo/SEO";

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <SEO title="404 – Page Not Found | BlueBoxx" description="The page you are looking for does not exist." robots="noindex, nofollow" />

      <div className="min-h-screen bg-gradient-to-br from-[#0d1635] via-[#1B2A6B] to-[#0d1635] flex flex-col items-center justify-center px-4 relative overflow-hidden">

        {/* Ambient background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-8"
        >
          <Link href="/">
            <img src="/logowhite.png" alt="BlueBoxx DA" className="h-10 w-auto object-contain" />
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-lg relative z-10"
        >
          {/* Giant 404 */}
          <div className="relative mb-6 select-none">
            <div className="text-[10rem] sm:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 tracking-tighter">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center backdrop-blur-sm shadow-xl">
                <Compass size={48} className="text-[#C9A227]" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            You're Off the Map
          </h1>
          <p className="text-slate-400 font-medium text-base mb-10 leading-relaxed">
            The page you're looking for has moved, been deleted, or never existed.
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-[#C9A227] text-[#0d1635] font-black rounded-xl hover:bg-[#d8b02c] transition-all shadow-lg text-sm"
            >
              <Home size={16} /> Back to Homepage
            </Link>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 h-12 px-6 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/20 transition-all text-sm"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>

          {/* Quick Nav */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Maybe you were looking for...
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Courses", href: "/courses" },
                { label: "Internships", href: "/internships" },
                { label: "Expert Mentors", href: "/experts" },
                { label: "Student Dashboard", href: "/student/dashboard" },
                { label: "Admin Panel", href: "/admin/dashboard" },
                { label: "Blog", href: "/blog" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-6 text-xs font-medium text-slate-600"
        >
          © {new Date().getFullYear()} BlueBoxx DA. All rights reserved.
        </motion.p>
      </div>
    </>
  );
}
