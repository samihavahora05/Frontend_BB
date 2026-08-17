import Link from "next/link";
import { useRouter } from "next/router";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Head from "next/head";

export default function Custom500() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>500 – Server Error | BlueBoxx</title>
        <meta name="description" content="An internal server error occurred. Our team has been notified." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#0d1635] via-[#1B2A6B] to-[#0d1635] flex flex-col items-center justify-center px-4 relative overflow-hidden">

        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-8"
        >
          <Link href="/">
            <img src="/logoblue.png" alt="BlueBoxx" className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-lg relative z-10"
        >
          {/* Giant 500 */}
          <div className="relative mb-6 select-none">
            <h1 className="text-[10rem] sm:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 tracking-tighter">
              500
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border border-rose-400/30 flex items-center justify-center backdrop-blur-sm shadow-xl">
                <AlertTriangle size={48} className="text-rose-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            Something Went Wrong
          </h2>
          <p className="text-slate-400 font-medium text-base mb-10 leading-relaxed">
            Our servers hit an unexpected bump. Our engineering team has been automatically notified and is working to resolve this.
          </p>

          {/* Status indicator */}
          <div className="bg-rose-500/10 border border-rose-400/20 rounded-2xl p-4 mb-8 flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-rose-500/20 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-300">Internal Server Error (500)</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Incident ID: BB-{Date.now().toString(36).toUpperCase()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.reload()}
              className="flex items-center justify-center gap-2 h-12 px-6 bg-[#C9A227] text-[#0d1635] font-black rounded-xl hover:bg-[#d8b02c] transition-all shadow-lg text-sm"
            >
              <RefreshCcw size={16} /> Try Again
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/20 transition-all text-sm"
            >
              <Home size={16} /> Back to Home
            </Link>
          </div>
        </motion.div>

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
