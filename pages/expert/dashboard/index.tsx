import { ExpertDashboardLayout } from "../../../src/layout/ExpertDashboardLayout";
import { Users, Calendar, DollarSign, Clock, Star, Play, MessageSquare, Check, X as CloseIcon } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { BarChart } from "../../../src/components/ui/BarChart";
import { OnboardingTour } from "../../../src/components/ui/OnboardingTour";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { ChatModal } from "../../../src/components/ChatModal";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ExpertDashboard() {
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [chatUser, setChatUser] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isSavingLink, setIsSavingLink] = useState(false);
  const { data: metricsRes, isLoading: isLoadingMetrics } = useSWR("/expert/metrics", fetcher);
  const { data: sessionsRes, isLoading: isLoadingSessions, mutate: mutateSessions } = useSWR("/expert/sessions/upcoming", fetcher);
  const { data: chartRes, isLoading: isLoadingChart } = useSWR("/expert/earnings/chart", fetcher);
  const { data: requestsRes, mutate: mutateRequests } = useSWR("/expert/mentees/requests", fetcher);

  const metrics = metricsRes?.data || { active_mentees: 0, hours_mentored: 0, pending_payout: 0, average_rating: 0 };
  const upcomingSessions = sessionsRes?.data || [];
  const earningsData = chartRes?.data || [];
  const menteeRequests = requestsRes?.data || [];

  const handleOpenJoinModal = (session: any) => {
    setActiveSession(session);
    setMeetingLink(session.meeting_link || "");
  };

  const handleSaveAndJoin = async () => {
    if (!meetingLink) {
      toast.error("Please enter a meeting link");
      return;
    }
    
    // Check if link needs to be saved/updated
    if (meetingLink !== activeSession.meeting_link) {
      setIsSavingLink(true);
      try {
        await api.put(`/expert/sessions/${activeSession.id}/meeting-link`, { meeting_link: meetingLink });
        mutateSessions();
      } catch (err) {
        toast.error("Failed to save meeting link");
        setIsSavingLink(false);
        return;
      }
      setIsSavingLink(false);
    }
    
    setIsJoining(true);
    toast.loading("Connecting to secure video channel...", { id: "join" });
    setTimeout(() => {
      toast.success("Joined successfully!", { id: "join" });
      setIsJoining(false);
      setActiveSession(null);
      window.open(meetingLink, "_blank"); // Open the actual link
    }, 1500);
  };

  const handleRequestAction = async (id: number, action: "accept" | "decline") => {
    // Optimistic update
    mutateRequests({ ...requestsRes, data: menteeRequests.filter((r: any) => r.id !== id) }, false);
    
    try {
      await api.post(`/expert/mentees/requests/${id}/${action}`);
      if (action === "accept") {
        toast.success("Mentee request accepted! Session is now scheduled.");
      } else {
        toast("Mentee request declined", { icon: "❌" });
      }
      mutateRequests();
    } catch (e) {
      toast.error("Failed to perform action");
      mutateRequests();
    }
  };

  return (
    <ExpertDashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0d1635] mb-2">Expert Portal</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your mentorship sessions, track mentee progress, and view earnings.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/expert/schedule" className="px-5 py-2.5 bg-[#1B2A6B] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#0d1635] transition-all flex items-center gap-2">
            <Calendar size={16} /> View Schedule
          </Link>
        </div>
      </div>

      <div id="tour-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Mentees", value: isLoadingMetrics ? "-" : metrics.active_mentees.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Hours Mentored", value: isLoadingMetrics ? "-" : metrics.hours_mentored.toString(), icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Pending Payout", value: isLoadingMetrics ? "-" : `$${metrics.pending_payout}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Average Rating", value: isLoadingMetrics ? "-" : metrics.average_rating.toString(), icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-[#0d1635] leading-none">{stat.value}</h3>
            </div>
          </AnimatedContent>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatedContent id="tour-schedule" direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
                <Calendar size={18} className="text-[#1B2A6B]" /> Upcoming Sessions
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {isLoadingSessions ? (
                <div className="p-8 text-center text-slate-400">Loading sessions...</div>
              ) : upcomingSessions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No upcoming sessions.</div>
              ) : (
                upcomingSessions.map((session: any) => (
                  <div key={session.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm border border-indigo-100">
                        {session.mentee.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0d1635] mb-1">{session.mentee}</h3>
                        <p className="text-xs text-slate-500 font-semibold">{session.topic} &bull; <span className="text-[#1B2A6B]">{session.time}</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => setChatUser(session.mentee)} className="flex-1 sm:flex-none p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-[#1B2A6B] hover:bg-slate-50 rounded-xl transition-colors text-center flex justify-center">
                        <MessageSquare size={16} />
                      </button>
                      <button onClick={() => handleOpenJoinModal(session)} className="flex-1 sm:flex-none px-5 py-2.5 bg-[#C9A227] text-[#0d1635] text-xs font-bold rounded-xl shadow-sm hover:bg-[#b08d22] transition-colors flex justify-center items-center gap-2">
                        <Play size={14} /> Join Session
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.35} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2 mb-6">
              <DollarSign size={18} className="text-emerald-600" /> Earnings Overview (6 Months)
            </h2>
            {isLoadingChart ? (
              <div className="h-48 flex items-center justify-center text-slate-400">Loading chart...</div>
            ) : (
              <BarChart 
                data={earningsData} 
                color="#059669" // emerald-600
                prefix="$" 
              />
            )}
          </AnimatedContent>
        </div>

        {/* Right Column: Mentee Requests */}
        <div className="lg:col-span-1 space-y-6">
          <AnimatedContent id="tour-requests" direction="up" delay={0.4} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
                <Users size={18} className="text-[#1B2A6B]" /> Mentee Requests
              </h2>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <AnimatePresence>
                {!requestsRes ? (
                  <div className="text-center py-8 text-slate-400">Loading requests...</div>
                ) : menteeRequests.length === 0 ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                     <p className="text-slate-400 text-sm font-semibold">No new requests.</p>
                   </motion.div>
                ) : (
                  menteeRequests.map((req: any) => (
                    <motion.div key={req.id} initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-black text-xs flex items-center justify-center">{req.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{req.name}</p>
                          <p className="text-[10px] font-semibold text-slate-500">{req.reqType}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleRequestAction(req.id, "accept")} className="flex-1 py-1.5 bg-[#1B2A6B] text-white text-[10px] font-bold rounded-lg hover:bg-[#0d1635] flex items-center justify-center gap-1">
                          <Check size={12}/> Accept
                        </button>
                        <button onClick={() => handleRequestAction(req.id, "decline")} className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1">
                          <CloseIcon size={12}/> Decline
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            <Link href="/expert/mentees" className="block p-4 text-center text-xs font-bold text-[#1B2A6B] hover:bg-slate-50 border-t border-slate-100 transition-colors">
              View all mentees
            </Link>
          </AnimatedContent>
        </div>
      </div>

      <AnimatePresence>
        {activeSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !isJoining && setActiveSession(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 relative overflow-hidden text-center p-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Play size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Join Video Call</h3>
              <p className="text-sm font-medium text-slate-500 mb-4">You are about to join the mentorship session with {activeSession.mentee}.</p>
              
              <div className="text-left mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link (Zoom, Meet, etc)</label>
                <input 
                  type="url" 
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2A6B]"
                />
              </div>

              <div className="flex gap-3 justify-center">
                <button disabled={isJoining || isSavingLink} onClick={() => setActiveSession(null)} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50">Cancel</button>
                <button disabled={isJoining || isSavingLink || !meetingLink} onClick={handleSaveAndJoin} className="px-6 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] transition-colors shadow-md disabled:opacity-50">
                  {isJoining || isSavingLink ? "Connecting..." : "Join Now"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChatModal 
        isOpen={!!chatUser} 
        onClose={() => setChatUser(null)} 
        menteeName={chatUser || ""} 
      />

      <OnboardingTour 
        tourId="expert_dashboard_v1"
        steps={[
          {
            targetId: "tour-stats",
            title: "Performance Overview",
            content: "Welcome to your Expert Dashboard! Keep track of your total mentees, hours mentored, and pending payouts right here at a glance."
          },
          {
            targetId: "tour-schedule",
            title: "Manage Sessions",
            content: "Here you can see all your upcoming mentorship sessions. Click 'Join Session' to instantly connect with your mentees via video call."
          },
          {
            targetId: "tour-requests",
            title: "Mentee Requests",
            content: "Review and accept incoming mentorship requests from students. Build your network and start guiding the next generation of tech talent!"
          }
        ]}
      />
    </ExpertDashboardLayout>
  );
}
