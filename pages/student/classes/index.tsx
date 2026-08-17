import React, { useState } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { PlayCircle, Video, Calendar, Clock, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const CLASSES = [
  { id: 1, title: "React Context API Deep Dive", course: "Advanced React Patterns", instructor: "Arjun Mehta", date: "Today", time: "4:00 PM – 5:30 PM", status: "live", joinUrl: "#" },
  { id: 2, title: "State Machine Patterns", course: "Advanced React Patterns", instructor: "Arjun Mehta", date: "Tomorrow", time: "4:00 PM – 5:30 PM", status: "upcoming", joinUrl: "#" },
  { id: 3, title: "Wireframing with Figma", course: "UI/UX Design Masterclass", instructor: "Meera Joshi", date: "Mon, 7 Jul", time: "6:00 PM – 7:30 PM", status: "upcoming", joinUrl: "#" },
  { id: 4, title: "Pandas & NumPy Basics", course: "Python for Data Science", instructor: "Ravi Shankar", date: "Thu, 3 Jul", time: "5:00 PM – 6:30 PM", status: "recorded", recordingUrl: "#" },
  { id: 5, title: "Google Analytics Setup", course: "Digital Marketing Pro", instructor: "Priya Nair", date: "Wed, 2 Jul", time: "3:00 PM – 4:00 PM", status: "recorded", recordingUrl: "#" },
  { id: 6, title: "SEO Fundamentals", course: "Digital Marketing Pro", instructor: "Priya Nair", date: "Fri, 27 Jun", time: "3:00 PM – 4:00 PM", status: "recorded", recordingUrl: "#" },
];

const STATUS_COLORS: Record<string, string> = {
  live: "bg-red-500 text-white animate-pulse",
  upcoming: "bg-blue-50 text-blue-700",
  recorded: "bg-slate-100 text-slate-600",
};

export default function LiveClassesPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? CLASSES : CLASSES.filter(c => c.status === filter);

  const handleAction = (action: string) => {
    toast.success(action);
  };

  return (
    <StudentDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Live Classes</h1>
        <p className="text-slate-500 text-sm font-medium">Join live sessions or catch up with recordings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Live Now", value: CLASSES.filter(c => c.status === "live").length, color: "text-red-600", bg: "bg-red-50", icon: PlayCircle },
          { label: "Upcoming", value: CLASSES.filter(c => c.status === "upcoming").length, color: "text-blue-600", bg: "bg-blue-50", icon: Calendar },
          { label: "Recorded", value: CLASSES.filter(c => c.status === "recorded").length, color: "text-slate-600", bg: "bg-slate-100", icon: Video },
        ].map((s, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 w-fit mb-6">
        {["all", "live", "upcoming", "recorded"].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize ${filter === t ? "bg-[#1B2A6B] text-white shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Class list */}
      <div className="space-y-4">
        {filtered.map((cls, i) => (
          <AnimatedContent key={cls.id} direction="up" delay={i * 0.07} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cls.status === "live" ? "bg-red-500" : cls.status === "upcoming" ? "bg-blue-50" : "bg-slate-100"}`}>
              {cls.status === "recorded" ? <Video size={20} className="text-slate-500" /> : <PlayCircle size={20} className={cls.status === "live" ? "text-white" : "text-blue-600"} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-black text-slate-800 text-sm">{cls.title}</h3>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase ${STATUS_COLORS[cls.status]}`}>
                  {cls.status === "live" ? "LIVE" : cls.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mb-1">{cls.course} · {cls.instructor}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Calendar size={11} /> {cls.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {cls.time}</span>
              </div>
            </div>

            <div className="shrink-0">
              {cls.status === "live" && (
                <button onClick={(e) => { e.preventDefault(); handleAction("Joining Live Class..."); }} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-colors text-sm">
                  Join Now <ExternalLink size={13} />
                </button>
              )}
              {cls.status === "upcoming" && (
                <button onClick={() => handleAction("Reminder Set! You will be notified before the class starts.")} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] transition-colors text-sm">
                  Set Reminder <Calendar size={13} />
                </button>
              )}
              {cls.status === "recorded" && (
                <button onClick={(e) => { e.preventDefault(); handleAction("Opening Recording..."); }} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                  Watch <Video size={13} />
                </button>
              )}
            </div>
          </AnimatedContent>
        ))}
      </div>
    </StudentDashboardLayout>
  );
}
