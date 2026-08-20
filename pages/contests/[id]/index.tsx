import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { MainLayout } from "../../../src/layout/MainLayout";
import { SEO } from "../../../src/components/seo/SEO";
import api from "../../../src/lib/axios";
import {
  Trophy,
  Calendar,
  Clock,
  Award,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data || res.data);

export default function ContestDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: contestData, isLoading } = useSWR(
    id ? `/contests/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const contest = contestData ? {
    id: contestData.id || id,
    title: contestData.title || 'Contest Details',
    description: contestData.description || 'View details for this contest.',
    category: contestData.category || contestData.type || 'Contest',
    prize: contestData.prize || contestData.rewards || 'Certificate & Badges',
    start_date: contestData.start_date || contestData.created_at,
    duration_minutes: contestData.duration_minutes || contestData.duration || 60,
    total_registered: contestData.total_registered || contestData.participants_count || 0,
    status: contestData.status || 'Active'
  } : null;

  return (
    <>
      <SEO
        title={`${contest?.title || 'Contest'} | Blueboxx DA`}
        description={contest?.description || 'Contest details'}
      />
      <MainLayout>
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <Link
              href="/contests"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#1B2A6B] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-x-1"
            >
              <ArrowLeft size={16} /> Back to Contests
            </Link>

            {isLoading ? (
              <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center shadow-sm">
                <div className="w-10 h-10 border-4 border-[#1B2A6B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-600">Loading contest details...</p>
              </div>
            ) : !contest ? (
              <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center shadow-sm space-y-4">
                <Trophy size={48} className="text-slate-300 mx-auto" />
                <h2 className="text-2xl font-black text-slate-800">Contest Not Found</h2>
                <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
                  The requested contest could not be found.
                </p>
                <Link
                  href="/contests"
                  className="inline-block px-6 py-3 bg-[#1B2A6B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#0d1635] transition-colors"
                >
                  Return to Contests
                </Link>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {contest.category}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {contest.status}
                  </span>
                </div>

                <h1 className="text-3xl font-black text-slate-900 leading-tight">
                  {contest.title}
                </h1>

                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {contest.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <Award size={24} className="text-[#C9A227]" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Prize Pool</span>
                      <span className="font-extrabold text-slate-900 text-sm">{contest.prize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <Calendar size={24} className="text-indigo-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Start Date</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {contest.start_date ? new Date(contest.start_date).toLocaleDateString() : "TBA"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <Clock size={24} className="text-blue-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Duration</span>
                      <span className="font-extrabold text-slate-900 text-sm">{contest.duration_minutes} Minutes</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/contests/${id}/arena`}
                    className="block w-full text-center py-3.5 px-6 bg-[#C9A227] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-colors shadow-md"
                  >
                    Enter Contest Arena
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
