import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { Calendar, Clock, MapPin, Video, Building, ChevronRight, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
    rescheduled: "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${map[status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600'}`}>
      {status || 'Scheduled'}
    </span>
  );
}

export default function JobseekerInterviewsPage() {
  const { data, isLoading } = useSWR("/jobseeker/interviews", fetcher);
  const interviews = data?.data || [];

  return (
    <JobseekerDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] mb-2">Interview Schedule</h1>
        <p className="text-slate-500 font-medium text-sm">All your upcoming and past interviews in one place.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : interviews.length === 0 ? (
        <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300">
            <Calendar size={36} />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-3">No Interviews Scheduled Yet</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            When a company schedules an interview for you, it will appear here with the date, time, and joining link.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <AlertCircle size={14} />
            <span>Apply to more jobs to get interviews!</span>
          </div>
        </AnimatedContent>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview: any, i: number) => (
            <AnimatedContent key={interview.id} direction="up" delay={i * 0.08} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-5">
                {/* Company Logo */}
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {interview.company_logo ? (
                    <img src={interview.company_logo} alt={interview.company_name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Building size={24} className="text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-black text-[#0d1635] mb-0.5">{interview.job_title}</h3>
                      <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                        <Building size={14} className="text-slate-400" /> {interview.company_name}
                      </p>
                    </div>
                    <StatusBadge status={interview.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Calendar size={14} className="text-blue-600" />
                      </div>
                      <span className="font-semibold">{interview.scheduled_at || 'Date TBD'}</span>
                    </div>
                    {interview.time && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Clock size={14} className="text-amber-600" />
                        </div>
                        <span className="font-semibold">{interview.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        {interview.type?.toLowerCase().includes('video') ? (
                          <Video size={14} className="text-purple-600" />
                        ) : (
                          <MapPin size={14} className="text-purple-600" />
                        )}
                      </div>
                      <span className="font-semibold capitalize">{interview.type || 'Video Call'}</span>
                    </div>
                    {interview.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <MapPin size={14} />
                        <span>{interview.location}</span>
                      </div>
                    )}
                  </div>

                  {interview.notes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-medium border border-slate-100">
                      📝 {interview.notes}
                    </div>
                  )}
                </div>

                {/* Join Button */}
                {interview.meeting_link && (
                  <div className="shrink-0">
                    <a
                      href={interview.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-colors"
                    >
                      <Video size={16} />
                      Join Interview
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </AnimatedContent>
          ))}
        </div>
      )}
    </JobseekerDashboardLayout>
  );
}
