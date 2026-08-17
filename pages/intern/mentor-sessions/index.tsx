import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Video, Calendar as CalendarIcon, Clock, Link as LinkIcon, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import useSWR from "swr";
import api from "../../../src/lib/axios";
import { EmptyState } from "../../../src/components/common/EmptyState";
import { Users } from "lucide-react";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function InternMentorSessionsPage() {
  const { data, isLoading } = useSWR("/intern/mentor-sessions", fetcher);
  const sessions = data?.data || [];
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filteredSessions = sessions.filter((session: any) => session.status === activeTab);

  const handleJoinCall = (link: string | null) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      toast.error("No active meeting link found for this session.");
    }
  };

  return (
    <InternDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <AnimatedContent direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">1:1 Mentorships</h1>
              <p className="text-slate-500 font-medium text-sm">Manage your upcoming 1:1 calls and view past sessions.</p>
            </div>
            <Link href="/experts">
              <Button variant="primary" className="gap-2 shadow-md bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold h-11 px-6 rounded-xl"><Search size={16}/> Book New Session</Button>
            </Link>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2}>
          <div className="flex gap-2 border-b border-slate-200 pb-4">
            {["Upcoming", "Completed"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                  activeTab === tab ? "bg-[#1B2A6B] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3}>
          {isLoading ? (
            <div className="text-center text-slate-500 py-12">Loading sessions...</div>
          ) : filteredSessions.length === 0 ? (
            <EmptyState
              icon={Users}
              title={`No ${activeTab.toLowerCase()} sessions`}
              message="You haven't booked any mentorship sessions yet."
              actionLabel="Find a Mentor"
              onAction={() => window.location.href = "/experts"}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session: any, i: number) => (
                <Card key={i} className={`hover:border-slate-300 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden transition-colors ${session.status === 'Completed' ? 'opacity-70 grayscale-[20%]' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img src={session.avatar} alt={session.mentor} className="w-10 h-10 rounded-full border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-800 text-sm leading-tight">{session.mentor}</div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Mentor</div>
                        </div>
                      </div>
                      {session.status === "Upcoming" ? (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded border border-emerald-200">Upcoming</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">Completed</span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-800 mb-4 h-10 line-clamp-2">{session.title}</h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <CalendarIcon size={14} className="text-[#1B2A6B]" /> {session.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Clock size={14} className="text-[#1B2A6B]" /> {session.time}
                      </div>
                    </div>

                    {session.status === "Upcoming" ? (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleJoinCall(session.link)}
                          variant="primary" 
                          className="flex-1 text-sm font-bold gap-2 shadow-md bg-[#1B2A6B] hover:bg-[#0d1635] text-white py-2.5 rounded-xl flex items-center justify-center"
                        >
                          <Video size={16}/> Join Call
                        </Button>
                        <Button 
                          onClick={() => {
                            if (session.link) {
                              navigator.clipboard.writeText(session.link);
                              toast.success("Meeting link copied to clipboard!");
                            } else {
                              toast.error("No meeting link available.");
                            }
                          }}
                          variant="outline" 
                          className="w-11 h-11 px-0 shrink-0 border border-slate-200 hover:bg-slate-50 flex items-center justify-center rounded-xl bg-white shadow-sm"
                        >
                          <LinkIcon size={16}/>
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => toast.success("Opening feedback dialog...")} variant="outline" className="w-full text-sm font-bold border border-slate-200 hover:bg-slate-50 rounded-xl bg-white shadow-sm py-2">View Feedback</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AnimatedContent>
      </div>
    </InternDashboardLayout>
  );
}
