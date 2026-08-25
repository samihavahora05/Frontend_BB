import React from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Trophy, Calendar, CheckCircle2, Clock, XCircle, User, Users } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function ContestsPage() {
  const { data, isLoading, mutate } = useSWR("/student/contests", fetcher);
  const { data: allContestsRes } = useSWR("/contests", (url) => api.get(url).then(res => res.data.data || res.data));

  const activeContests = data?.active || [];
  const pastContests = data?.past || [];
  const availableContests = Array.isArray(allContestsRes) ? allContestsRes : (allContestsRes?.data || []);

  const registeredContestIds = new Set(
    [...activeContests, ...pastContests].map((r: any) => String(r.contest?.id))
  );

  const [registeringContest, setRegisteringContest] = useState<any>(null);
  const [participationType, setParticipationType] = useState<'individual' | 'team'>('individual');
  const [teamName, setTeamName] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [domainTrack, setDomainTrack] = useState('Full-Stack Web Development');
  const [teamMembers, setTeamMembers] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  const resetForm = () => {
    setRegisteringContest(null);
    setParticipationType('individual');
    setTeamName('');
    setPhone('');
    setCollegeName('');
    setDomainTrack('Full-Stack Web Development');
    setTeamMembers('');
    setAgreedTerms(false);
  };

  return (
    <StudentDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">My Contests</h1>
        <p className="text-slate-500 text-sm font-medium">Manage and view your upcoming and past contest participations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Contests */}
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Active & Upcoming</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 font-semibold animate-pulse">Loading contests...</div>
              ) : activeContests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                  <Trophy size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="font-black text-slate-600 mb-1">No active contests</p>
                  <p className="text-xs text-slate-400 font-semibold mb-4">You haven't registered for any upcoming contests.</p>
                  <Link href="/student/contests" className="inline-block bg-[#1B2A6B] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#0d1635] transition-colors">
                    Explore Contests
                  </Link>
                </div>
              ) : (
                activeContests.map((reg: any, i: number) => (
                  <AnimatedContent key={reg.id} direction="up" delay={i * 0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">{reg.contest?.difficulty_level || "Standard"}</span>
                            {reg.contest?.status === "active" && (
                              <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Now
                              </span>
                            )}
                          </div>
                          <h3 className="font-black text-lg text-slate-800 line-clamp-1">{reg.contest?.title || "Coding Challenge"}</h3>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                          <Trophy size={20} className="text-[#C9A227]" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 mb-5">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          {reg.contest?.start_date ? new Date(reg.contest.start_date).toLocaleDateString() : "TBA"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          Duration: {reg.contest?.duration_minutes || 60} mins
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        {reg.contest?.status === "active" ? (
                          <Link href={`/contests/${reg.contest?.id}/arena`} className="bg-[#C9A227] text-[#0d1635] px-6 py-2 rounded-xl text-xs font-black hover:bg-[#d8b02c] transition-colors">
                            Enter Arena
                          </Link>
                        ) : (
                          <button disabled className="bg-slate-100 text-slate-400 px-6 py-2 rounded-xl text-xs font-black cursor-not-allowed">
                            Starts Soon
                          </button>
                        )}
                      </div>
                    </div>
                  </AnimatedContent>
                ))
              )}
            </div>
          </div>

          {/* Past Contests */}
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Past Contests</h2>
            <div className="space-y-4">
              {pastContests.length === 0 && !isLoading ? (
                <div className="p-6 text-center text-slate-400 text-xs font-semibold border-2 border-dashed border-slate-200 rounded-2xl">
                  No past contest history.
                </div>
              ) : (
                pastContests.map((reg: any, i: number) => (
                  <AnimatedContent key={reg.id} direction="up" delay={0.2 + (i * 0.1)} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                              {reg.contest?.difficulty_level || reg.domain_track || "Completed"}
                            </span>
                            {reg.participation_type && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                                {reg.participation_type === 'team' ? `Team (${reg.team_name || 'Group'})` : 'Solo'}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm mb-1">{reg.contest?.title || "Completed Contest"}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
                            {reg.contest?.start_date && (
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(reg.contest.start_date).toLocaleDateString()}
                              </span>
                            )}
                            {reg.score !== undefined && reg.score !== null && (
                              <span className="text-slate-600 font-bold">
                                Score: <span className="text-emerald-600 font-black">{reg.score}</span>
                              </span>
                            )}
                            {reg.rank && (
                              <span className="text-[#C9A227] font-bold">
                                Rank: #{reg.rank}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 size={13} /> Completed
                        </span>
                      </div>
                    </div>
                  </AnimatedContent>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnimatedContent direction="up" delay={0.1} className="bg-[#0d1635] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <Trophy size={28} className="text-[#C9A227] mb-4" />
            <h3 className="text-lg font-black mb-1">Total Participated</h3>
            <p className="text-4xl font-black mb-4">{data?.total_participated || 0}</p>
            <p className="text-xs text-white/50 font-medium">Keep participating to improve your rank on the global leaderboard!</p>
          </AnimatedContent>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-800 mb-4">Available Global Contests</h3>
            <div className="space-y-3">
              {availableContests.length === 0 ? (
                <p className="text-xs font-semibold text-slate-400">No new contests available at the moment.</p>
              ) : (
                availableContests.slice(0, 5).map((c: any) => {
                  const isRegistered = registeredContestIds.has(String(c.id));
                  return (
                    <div key={c.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">{c.status || 'Upcoming'}</p>
                        </div>
                      </div>
                      {isRegistered ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg flex items-center gap-1 border border-emerald-200 shrink-0">
                          <CheckCircle2 size={12} /> Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => setRegisteringContest(c)}
                          className="px-3 py-1.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-[10px] font-bold rounded-lg shrink-0 shadow-sm transition-all"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Contest Registration Modal */}
      {registeringContest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Register for Contest</h2>
                <p className="text-xs font-bold text-[#1B2A6B] line-clamp-1 mt-0.5">{registeringContest.title}</p>
              </div>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><XCircle size={22} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Participation Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Participation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setParticipationType('individual')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${participationType === 'individual'
                        ? 'border-[#1B2A6B] bg-[#1B2A6B]/5 text-[#1B2A6B]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <User size={18} /> Solo Participant
                  </button>
                  <button
                    type="button"
                    onClick={() => setParticipationType('team')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${participationType === 'team'
                        ? 'border-[#1B2A6B] bg-[#1B2A6B]/5 text-[#1B2A6B]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <Users size={18} /> Team / Group
                  </button>
                </div>
              </div>

              {/* Team Details */}
              {participationType === 'team' && (
                <div className="space-y-3 animate-in fade-in duration-200 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Team / Group Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Code Ninjas, Team Alpha"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none bg-white"
                    />
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">You will be designated as Team Leader.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Team Members (Names / Emails) <span className="text-red-500">*</span></label>
                    <textarea
                      rows={2}
                      required
                      value={teamMembers}
                      onChange={(e) => setTeamMembers(e.target.value)}
                      placeholder="e.g. Alex (alex@email.com), Sarah (sarah@email.com)"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none"
                />
              </div>

              {/* College / Institution */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College / Institute / Organization <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Parul University / Independent Learner"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none"
                />
              </div>

              {/* Primary Skill / Track */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Domain / Track Interest <span className="text-red-500">*</span></label>
                <select
                  required
                  value={domainTrack}
                  onChange={(e) => setDomainTrack(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#1B2A6B] focus:outline-none bg-white"
                >
                  <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="Mobile App Development">Mobile App Development (Flutter / React Native)</option>
                  <option value="UI/UX Design & Prototyping">UI/UX Design & Prototyping</option>
                  <option value="Data Analytics & Python">Data Analytics & Python</option>
                  <option value="Cybersecurity & Cloud Computing">Cybersecurity & Cloud Computing</option>
                </select>
              </div>

              {/* Contest Metadata */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600 font-medium">
                <p className="flex justify-between"><span>Status:</span> <strong className="text-slate-800 uppercase">{registeringContest.status || 'Upcoming'}</strong></p>
                <p className="flex justify-between"><span>Start Date:</span> <strong className="text-slate-800">{registeringContest.start_date ? new Date(registeringContest.start_date).toLocaleDateString() : 'TBA'}</strong></p>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]"
                />
                <span className="text-[11px] text-slate-600 font-medium leading-snug">
                  I agree to the contest rules, submission guidelines, and code of conduct. <span className="text-red-500">*</span>
                </span>
              </label>

              {/* Submit Button */}
              <button
                disabled={isSubmittingReg}
                onClick={async () => {
                  if (participationType === 'team' && !teamName.trim()) {
                    toast.error('Please enter your team name');
                    return;
                  }
                  if (participationType === 'team' && !teamMembers.trim()) {
                    toast.error('Please enter team members\' names or emails');
                    return;
                  }
                  if (!phone.trim()) {
                    toast.error('Please enter your phone / WhatsApp number');
                    return;
                  }
                  if (!collegeName.trim()) {
                    toast.error('Please enter your college or organization name');
                    return;
                  }
                  if (!domainTrack) {
                    toast.error('Please select your domain / track interest');
                    return;
                  }
                  if (!agreedTerms) {
                    toast.error('Please agree to the contest terms and rules before registering.');
                    return;
                  }
                  setIsSubmittingReg(true);
                  try {
                    try {
                      await api.post(`/student/contests/${registeringContest.id}/register`, {
                        team_name: participationType === 'team' ? teamName.trim() : null,
                        phone: phone.trim(),
                        college_name: collegeName.trim(),
                        domain_track: domainTrack,
                        team_members: participationType === 'team' ? teamMembers.trim() : null,
                      });
                    } catch (primaryErr: any) {
                      await api.post(`/public/contests/${registeringContest.id}/register`, {
                        team_name: participationType === 'team' ? teamName.trim() : null,
                        phone: phone.trim(),
                        college_name: collegeName.trim(),
                        domain_track: domainTrack,
                        team_members: participationType === 'team' ? teamMembers.trim() : null,
                      });
                    }
                    toast.success(`Successfully registered for ${registeringContest.title}!`);
                    resetForm();
                    mutate();
                  } catch (err: any) {
                    toast.error(err?.response?.data?.message || 'Registration failed');
                  } finally {
                    setIsSubmittingReg(false);
                  }
                }}
                className="w-full py-3 bg-[#1B2A6B] hover:bg-[#121c47] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmittingReg ? 'Processing...' : 'Confirm & Complete Registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentDashboardLayout>
  );
}
