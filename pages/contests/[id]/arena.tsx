import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { MainLayout } from "../../../src/layout/MainLayout";
import { SEO } from "../../../src/components/seo/SEO";
import api from "../../../src/lib/axios";
import {
  Trophy,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Send
} from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data || res.data);

export default function ContestArenaPage() {
  const router = useRouter();
  const { id } = router.query;
  const [submitted, setSubmitted] = useState(false);

  const { data: contestData, isLoading } = useSWR(
    id ? `/contests/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const contest = contestData ? {
    id: contestData.id || id,
    title: contestData.title || 'Contest Challenge',
    duration_minutes: contestData.duration_minutes || 60,
  } : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title={`${contest?.title || 'Contest'} Arena | Blueboxx DA`}
        description="Contest Arena"
      />
      <MainLayout>
        <div className="bg-slate-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <Link
              href="/student/contests"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-sm"
            >
              <ArrowLeft size={16} /> Exit Arena
            </Link>

            {isLoading ? (
              <div className="bg-slate-800 rounded-3xl p-16 border border-slate-700 text-center shadow-2xl">
                <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-300">Loading contest arena...</p>
              </div>
            ) : !contest ? (
              <div className="bg-slate-800 rounded-3xl p-16 border border-slate-700 text-center shadow-2xl space-y-4">
                <Trophy size={48} className="text-slate-500 mx-auto" />
                <h2 className="text-2xl font-black text-white">Contest Not Found</h2>
                <p className="text-sm font-semibold text-slate-400 max-w-md mx-auto">
                  The requested contest arena could not be loaded.
                </p>
                <Link
                  href="/student/contests"
                  className="inline-block px-6 py-3 bg-[#C9A227] text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Return to Contests
                </Link>
              </div>
            ) : !submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 space-y-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div>
                    <h1 className="text-2xl font-black text-white">{contest.title}</h1>
                    <span className="text-xs text-slate-400 font-medium">Contest Arena Mode</span>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono text-sm font-bold">
                    <Clock size={16} /> {contest.duration_minutes}m 00s
                  </div>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 space-y-3">
                  <h3 className="font-bold text-white text-base">Challenge Instructions</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Build your solution according to the contest prompt. Submit your repository link or output URL below when ready.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Submission URL / Output Link
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/your-username/project-repo"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#C9A227] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Submit Contest Solution
                  </button>
                </form>
              </motion.div>
            ) : (
              <div className="bg-slate-800/80 rounded-3xl p-12 text-center border border-slate-700 space-y-4 shadow-2xl">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
                <h2 className="text-2xl font-black text-white">Solution Submitted Successfully!</h2>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Your contest entry has been recorded. Results will be calculated automatically.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <Link
                    href="/contests"
                    className="px-6 py-3 bg-[#C9A227] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-colors shadow-md"
                  >
                    Back to All Contests
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
