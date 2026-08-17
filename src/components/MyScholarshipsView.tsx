import React from 'react';
import { Trophy, Clock, CheckCircle, XCircle, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import useSWR from 'swr';
import api from '../lib/axios';

const fetcher = (url: string) => api.get(url).then(res => res.data);

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'In Review':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200"><Clock size={14} /> In Review</span>;
    case 'Shortlisted':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200"><CheckCircle size={14} /> Shortlisted</span>;
    case 'Rejected':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200"><XCircle size={14} /> Not Selected</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">{status}</span>;
  }
};

export const MyScholarshipsView = ({ userRole: _userRole }: { userRole: 'student' | 'intern' }) => {
  const { data: responseData, isLoading } = useSWR('/student/scholarships', fetcher);

  const scholarships = responseData?.data?.scholarships || [];
  
  React.useEffect(() => {
    if (scholarships.length > 0) {
      localStorage.setItem('bb_scholarship_applied_global', 'true');
    }
  }, [scholarships.length]);

  const contests = responseData?.data?.contests || [];
  const allApplications = [...scholarships, ...contests];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] blur-[100px] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#0d1635] mb-2 flex items-center gap-3">
              <Trophy className="text-[#C9A227]" size={32} />
              My Scholarships & Challenges
            </h1>
            <p className="text-slate-500">Track your applications for scholarships, hackathons, and talent drives.</p>
          </div>
          <Link
            href="/scholarships"
            className="bg-[#0d1635] hover:bg-[#1B2A6B] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
          >
            Explore New Challenges <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-semibold animate-pulse">Loading your applications...</div>
      ) : allApplications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allApplications.map((app: any, idx: number) => {
            const isScholarship = !!app.scholarship_program_id;
            const title = isScholarship ? app.program?.title : app.contest?.title;
            const prize = isScholarship ? `₹${app.program?.amount}` : (app.contest?.prize || 'Trophy');
            const type = isScholarship ? 'Scholarship' : 'Hackathon';
            const date = new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <div key={`${type}-${app.id}-${idx}`} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1B2A6B] bg-indigo-50 px-2.5 py-1 rounded-full">
                      {type}
                    </span>
                    {getStatusBadge(app.status)}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                    Applied on: {date}
                  </p>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Potential Reward</p>
                      <p className="text-slate-900 font-extrabold text-sm">{prize}</p>
                    </div>
                    <button className="text-[#C9A227] hover:text-amber-500 bg-amber-50 hover:bg-amber-100 p-2 rounded-lg transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Trophy size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">You haven't applied to any scholarships or talent challenges yet. Start competing to win massive prizes!</p>
          <Link
            href="/scholarships"
            className="bg-[#C9A227] hover:bg-amber-500 text-[#0d1635] px-8 py-3 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
          >
            Apply Now <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};
