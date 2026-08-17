import React, { useState, useEffect } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { PlayCircle, Video, Calendar, Clock, ExternalLink, RefreshCw } from "lucide-react";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";

interface VirtualClass {
  id: number;
  title: string;
  course_name?: string;
  course?: { title: string };
  instructor_name?: string;
  instructor?: { name: string };
  date?: string;
  start_time?: string;
  end_time?: string;
  duration?: string;
  meeting_platform?: string;
  meeting_link?: string;
  status?: "upcoming" | "live" | "completed" | string;
}

const STATUS_COLORS: Record<string, string> = {
  live: "bg-red-500 text-white animate-pulse",
  upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  completed: "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function StudentVirtualClassesPage() {
  const [filter, setFilter] = useState("all");
  const [classes, setClasses] = useState<VirtualClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      let response;
      try {
        response = await api.get("/student/virtual-classes");
      } catch {
        response = await api.get("/student/classes");
      }
      const rawData = response.data?.data?.data || response.data?.data || response.data || [];
      const list = Array.isArray(rawData) ? rawData : [];
      
      const now = new Date();
      const parsed = list.map((item: any) => {
        let status = item.status || "upcoming";
        if (item.start_time && item.end_time) {
          const startTime = new Date(item.start_time).getTime();
          const endTime = new Date(item.end_time).getTime();
          const currentTime = now.getTime();
          if (currentTime >= startTime && currentTime <= endTime) {
            status = "live";
          } else if (currentTime > endTime) {
            status = "completed";
          } else {
            status = "upcoming";
          }
        }
        return {
          id: item.id,
          title: item.title || item.name || "Virtual Class",
          course_name: item.course_name || item.course?.title || item.course_title || "General",
          instructor_name: item.instructor_name || item.instructor?.name || item.expert_name || "Instructor",
          date: item.date || (item.start_time ? new Date(item.start_time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Scheduled"),
          start_time: item.start_time ? new Date(item.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : (item.time || ""),
          end_time: item.end_time ? new Date(item.end_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
          duration: item.duration || "60 mins",
          meeting_platform: item.meeting_platform || "BlueBoxx Live",
          meeting_link: item.meeting_link || item.join_url || item.link || "#",
          status,
        };
      });

      setClasses(parsed);
    } catch (err: any) {
      console.error("Error fetching virtual classes:", err);
      toast.error(err.response?.data?.message || "Failed to load virtual classes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filtered = filter === "all" ? classes : classes.filter(c => c.status === filter);

  return (
    <StudentDashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Virtual Classes</h1>
          <p className="text-slate-500 text-sm font-medium">Join live interactive sessions and review past recorded classes.</p>
        </div>
        <button
          onClick={fetchClasses}
          disabled={isLoading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-[#1B2A6B]" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Live Now", value: classes.filter(c => c.status === "live").length, color: "text-red-600", bg: "bg-red-50", icon: PlayCircle },
          { label: "Upcoming", value: classes.filter(c => c.status === "upcoming").length, color: "text-blue-600", bg: "bg-blue-50", icon: Calendar },
          { label: "Completed", value: classes.filter(c => c.status === "completed").length, color: "text-slate-600", bg: "bg-slate-100", icon: Video },
        ].map((s, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-[#fff] rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
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
        {["all", "live", "upcoming", "completed"].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize ${filter === t ? "bg-[#1B2A6B] text-white shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Class List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-100 p-5 h-24 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((cls, i) => (
            <AnimatedContent key={cls.id} direction="up" delay={i * 0.05} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cls.status === "live" ? "bg-red-500" : cls.status === "upcoming" ? "bg-blue-50" : "bg-slate-100"}`}>
                {cls.status === "completed" ? <Video size={20} className="text-slate-500" /> : <PlayCircle size={20} className={cls.status === "live" ? "text-white" : "text-blue-600"} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-black text-slate-800 text-sm">{cls.title}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase ${STATUS_COLORS[cls.status || "upcoming"]}`}>
                    {cls.status === "live" ? "LIVE NOW" : cls.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mb-1">{cls.course_name} · {cls.instructor_name}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {cls.date}</span>
                  {cls.start_time && <span className="flex items-center gap-1"><Clock size={11} /> {cls.start_time} {cls.end_time ? `– ${cls.end_time}` : ""}</span>}
                </div>
              </div>

              <div className="shrink-0">
                {cls.status === "live" ? (
                  <a
                    href={cls.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-colors text-sm shadow-md shadow-red-500/20"
                  >
                    Join Class <ExternalLink size={13} />
                  </a>
                ) : cls.status === "upcoming" ? (
                  <a
                    href={cls.meeting_link !== "#" ? cls.meeting_link : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] transition-colors text-sm"
                  >
                    View Details <Calendar size={13} />
                  </a>
                ) : (
                  <span className="px-4 py-2 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs">
                    Session Ended
                  </span>
                )}
              </div>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
            <Video size={24} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-1">No virtual classes found</h3>
          <p className="text-slate-500 text-sm max-w-sm">
            {filter === "all" ? "You have no scheduled virtual classes at the moment." : `There are no ${filter} virtual classes.`}
          </p>
        </div>
      )}
    </StudentDashboardLayout>
  );
}
