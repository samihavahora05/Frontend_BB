import React from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '../../src/layout/MainLayout';
import { SEO } from '../../src/components/seo/SEO';
import { Trophy, Calendar, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import useSWR from 'swr';
import api from '../../src/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '../../src/context/AuthContext';

const fetcher = (url: string) => api.get(url).then(res => res.data.data || res.data);

export default function PublicContestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: contestsRes, isLoading } = useSWR('/contests', fetcher);
  const { data: studentRegs } = useSWR(user ? '/student/contests' : null, fetcher);

  const contests = Array.isArray(contestsRes) ? contestsRes : (contestsRes?.data || []);
  const activeRegs = studentRegs?.active || [];
  const pastRegs = studentRegs?.past || [];
  const registeredIds = new Set([...activeRegs, ...pastRegs].map((r: any) => String(r.contest?.id)));

  const handleRegister = async (contestId: number | string) => {
    if (!user) {
      toast.error('Please login to register for contests.');
      router.push('/login?redirect=/student/contests');
      return;
    }
    try {
      await api.post(`/student/contests/${contestId}/register`);
      toast.success('Registered for contest successfully!');
      router.push('/student/contests');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Already registered or registration closed.');
    }
  };

  return (
    <MainLayout>
      <SEO 
        title="Coding Contests & Hackathons | BlueBoxx DA" 
        description="Participate in national coding contests, UI/UX hackathons, and AI challenges on BlueBoxx DA." 
      />

      {/* Hero Banner */}
      <section className="relative bg-[#0d1635] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A6B] to-[#0d1635] opacity-90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A227] text-xs font-bold mb-4 backdrop-blur-sm">
            <Trophy size={14} /> National Hackathons & Challenges
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Compete, Innovate & <span className="text-[#C9A227]">Win Big</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base font-medium mb-8">
            Showcase your skills in real-world engineering challenges, earn global recognition, and get hired by top enterprise tech companies.
          </p>
          {user ? (
            <Link href="/student/contests" className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#d8b02c] text-[#0d1635] font-black px-6 py-3 rounded-xl text-sm shadow-lg transition-transform hover:scale-105">
              Go to My Contests <ArrowRight size={16} />
            </Link>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#d8b02c] text-[#0d1635] font-black px-6 py-3 rounded-xl text-sm shadow-lg transition-transform hover:scale-105">
              Join Contest Arena <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>

      {/* Contests List */}
      <section className="py-12 bg-slate-50 min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Active & Upcoming Challenges</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Register today to secure your spot.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400 font-semibold">
              Loading challenges...
            </div>
          ) : contests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-500">
              <Trophy size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-lg text-slate-700">No Contests Right Now</h3>
              <p className="text-xs text-slate-400 mt-1">Check back soon for new coding hackathons and design sprints.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((c: any) => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                        {c.category?.name || 'General Challenge'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        c.status === 'ongoing' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {c.status === 'ongoing' ? '● Live Now' : 'Upcoming'}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-800 mb-2 line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-3 mb-6">
                      {c.description || 'Join this competitive programming & engineering sprint. Demonstrate your expertise and earn prizes.'}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> {c.start_date ? new Date(c.start_date).toLocaleDateString() : 'TBA'}</span>
                      <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500"/> Verified</span>
                    </div>

                    {registeredIds.has(String(c.id)) ? (
                      <Link
                        href="/student/contests"
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={14} /> Registered — View in Dashboard
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleRegister(c.id)}
                        className="w-full py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <Sparkles size={14} className="text-[#C9A227]" /> Register Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
