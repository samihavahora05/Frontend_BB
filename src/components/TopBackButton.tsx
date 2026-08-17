"use client";

import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const TopBackButton = () => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  if (isHome) return null;

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8 z-30 relative shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center">
        <button onClick={() => router.back()} className="appearance-none focus:outline-none">
          <motion.div 
            whileHover={{ x: -4, backgroundColor: 'rgba(248, 250, 252, 1)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#1B2A6B] transition-colors group px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={16} className="text-slate-400 group-hover:text-[#1B2A6B] transition-colors" />
            <span className="text-sm font-bold tracking-wide">Go Back</span>
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
};
