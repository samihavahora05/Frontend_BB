import React, { useState } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Calendar, Star, Clock, Video, CheckCircle2, TrendingUp, MessageSquare } from "lucide-react";

const INTERVIEWS = [
  { id: 1, title: "Mock Technical Interview", type: "Technical", mentor: "Arjun Mehta", date: "Jul 5, 2026", time: "3:00 PM", status: "upcoming", scheduled: true },
  { id: 2, title: "HR Round Simulation", type: "HR", mentor: "Priya Nair", date: "Jul 8, 2026", time: "5:00 PM", status: "upcoming", scheduled: true },
  { id: 3, title: "System Design Interview", type: "Technical", mentor: "Kiran Patel", date: "Jun 28, 2026", time: "4:00 PM", status: "completed", score: 85, feedback: "Good problem solving, work on communication." },
  { id: 4, title: "Behavioural Interview", type: "HR", mentor: "Meera Joshi", date: "Jun 20, 2026", time: "6:00 PM", status: "completed", score: 90, feedback: "Excellent STAR answers, very confident." },
];

const SKILLS_SCORES = [
  { skill: "Problem Solving", score: 85 },
  { skill: "Communication", score: 72 },
  { skill: "Technical Depth", score: 88 },
  { skill: "System Design", score: 68 },
  { skill: "Behavioural", score: 90 },
];

export default function MockInterviewsPage() {
  const [booking, setBooking] = useState(false);

  return (
    <StudentDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Mock Interviews</h1>
          <p className="text-slate-500 text-sm font-medium">Practice with expert mentors and improve your interview skills.</p>
        </div>
        <button
          onClick={() => setBooking(!booking)}
          className="px-5 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] transition-colors text-sm flex items-center gap-2"
        >
          <Calendar size={16} /> Book Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left – interviews list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming */}
          <div>
            <h2 className="text-sm font-black text-slate-600 uppercase tracking-wider mb-3">Upcoming</h2>
            <div className="space-y-3">
              {INTERVIEWS.filter(i => i.status === "upcoming").map((item, i) => (
                <AnimatedContent key={item.id} direction="up" delay={i * 0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B2A6B]/10 flex items-center justify-center shrink-0">
                    <Video size={20} className="text-[#1B2A6B]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">with {item.mentor}</p>
                    <div className="flex gap-3 mt-1.5 text-xs text-slate-400 font-bold">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {item.date}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {item.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full">{item.type}</span>
                    <button className="px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#0d1635] transition-colors">
                      Join Room
                    </button>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h2 className="text-sm font-black text-slate-600 uppercase tracking-wider mb-3">Completed</h2>
            <div className="space-y-3">
              {INTERVIEWS.filter(i => i.status === "completed").map((item, i) => (
                <AnimatedContent key={item.id} direction="up" delay={i * 0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800 text-sm">{item.title}</h3>
                      <p className="text-xs text-slate-400 font-semibold">{item.mentor} · {item.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#1B2A6B]">{item.score}</div>
                      <div className="text-[10px] font-bold text-slate-400">/ 100</div>
                    </div>
                  </div>
                  {item.feedback && (
                    <div className="flex items-start gap-2 bg-slate-50 rounded-xl p-3">
                      <MessageSquare size={13} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-600 font-semibold italic">{item.feedback}</p>
                    </div>
                  )}
                </AnimatedContent>
              ))}
            </div>
          </div>
        </div>

        {/* Right – skills radar */}
        <div className="space-y-4">
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#1B2A6B]" /> Skill Scores
            </h2>
            <div className="space-y-4">
              {SKILLS_SCORES.map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>{s.skill}</span>
                    <span className="text-[#1B2A6B]">{s.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1B2A6B] rounded-full" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-semibold text-center">Overall Score</p>
              <p className="text-3xl font-black text-[#1B2A6B] text-center mt-1">
                {Math.round(SKILLS_SCORES.reduce((a, s) => a + s.score, 0) / SKILLS_SCORES.length)}
                <span className="text-base text-slate-400 font-bold">/100</span>
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.4} className="bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] rounded-2xl p-6 text-white">
            <Star size={20} className="text-[#C9A227] mb-2" />
            <h3 className="font-black mb-1 text-sm">Premium Mock Interview</h3>
            <p className="text-xs text-slate-300 font-semibold mb-4">Get 1:1 interview prep with industry experts from top companies.</p>
            <button className="w-full py-2.5 bg-[#C9A227] text-[#0d1635] font-black rounded-xl text-sm hover:bg-[#d8b02c] transition-colors">
              Upgrade to Premium
            </button>
          </AnimatedContent>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}
