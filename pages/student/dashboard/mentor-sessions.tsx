import { useState } from "react";
import { DashboardLayout } from "../../../src/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { Button } from "../../../src/components/ui/Button";
import { Calendar, Video, FileText, Star, User, ChevronRight, PlayCircle } from "lucide-react";

import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function MentorSessionsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const { data: sessionsData, isLoading: loadingSessions } = useSWR("/mentor-sessions", fetcher, { revalidateOnFocus: false });
  const { data: expertsData, isLoading: loadingExperts } = useSWR("/public/experts", fetcher, { revalidateOnFocus: false });

  const sessions = sessionsData?.data || [];
  const experts = expertsData?.data || [];

  const upcomingSessions = sessions.filter((s: any) => s.status === 'scheduled' || new Date(s.scheduled_at) > new Date()).map((s: any) => {
    const d = new Date(s.scheduled_at);
    return {
      id: s.id,
      mentor: s.expert?.name || "Expert",
      role: s.expert?.expertProfile?.title || "Industry Expert",
      topic: s.notes || "Mentorship Session",
      date: d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
      status: s.status,
      image: s.expert?.profile_photo_path ? `/storage/${s.expert.profile_photo_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.expert?.name || 'Expert')}&background=1B2A6B&color=fff`,
    };
  });

  const pastSessions = sessions.filter((s: any) => s.status === 'completed' || (s.status !== 'scheduled' && new Date(s.scheduled_at) <= new Date())).map((s: any) => {
    const d = new Date(s.scheduled_at);
    return {
      id: s.id,
      mentor: s.expert?.name || "Expert",
      role: s.expert?.expertProfile?.title || "Industry Expert",
      topic: s.notes || "Mentorship Session",
      date: d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
      status: s.status,
      image: s.expert?.profile_photo_path ? `/storage/${s.expert.profile_photo_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.expert?.name || 'Expert')}&background=C9A227&color=fff`,
      recordingAvailable: s.status === 'completed',
    };
  });

  const availableMentors = experts.slice(0, 3).map((e: any) => ({
    id: e.id,
    name: e.name,
    role: e.expertProfile?.title || "Mentor",
    expertise: e.expertProfile?.expertise || ["Guidance"],
    rating: "5.0",
    reviews: Math.floor(Math.random() * 50) + 10,
    image: e.profile_photo_path ? `/storage/${e.profile_photo_path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(e.name || 'Expert')}&background=random`,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Mentor Sessions</h1>
            <p className="text-sm font-semibold text-slate-500">Book 1:1 calls with industry experts to accelerate your career.</p>
          </div>
          <Button className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl px-6 h-11">
            Find a Mentor
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Custom Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab("upcoming")}
                className={`pb-3 px-2 text-sm font-extrabold transition-all relative ${
                  activeTab === "upcoming" ? "text-[#1B2A6B]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Upcoming Sessions
                {activeTab === "upcoming" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2A6B] rounded-t-md"></div>
                )}
              </button>
              <button 
                onClick={() => setActiveTab("past")}
                className={`pb-3 px-2 text-sm font-extrabold transition-all relative ${
                  activeTab === "past" ? "text-[#1B2A6B]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Past Sessions
                {activeTab === "past" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2A6B] rounded-t-md"></div>
                )}
              </button>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              {loadingSessions ? (
                <div className="p-8 text-center text-slate-400">Loading sessions...</div>
              ) : activeTab === "upcoming" ? (
                upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session: any) => (
                    <Card key={session.id} className="bg-white border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Date/Time Block */}
                          <div className="bg-[#0d1635] text-white p-6 sm:w-48 flex flex-col justify-center items-center text-center relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B2A6B] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                            <Calendar size={24} className="text-[#C9A227] mb-2 relative z-10" />
                            <span className="text-sm font-bold text-slate-300 relative z-10">{session.date}</span>
                            <span className="text-[11px] font-extrabold text-[#C9A227] uppercase tracking-widest mt-1 relative z-10">{session.time}</span>
                          </div>
                          
                          {/* Details Block */}
                          <div className="p-6 flex-1 flex flex-col justify-center relative">
                            <Badge className="w-fit mb-3 bg-blue-100 text-blue-700 border-none text-[10px] uppercase tracking-widest font-extrabold shadow-sm">Upcoming</Badge>
                            <h3 className="text-lg font-black text-slate-800 mb-1 group-hover:text-[#1B2A6B] transition-colors">{session.topic}</h3>
                            <div className="flex items-center gap-3 mb-5">
                              <img src={session.image} alt={session.mentor} className="w-8 h-8 rounded-full shadow-sm" />
                              <div>
                                <p className="text-sm font-bold text-slate-800 leading-tight">{session.mentor}</p>
                                <p className="text-[11px] font-semibold text-slate-500">{session.role}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-auto">
                              <Button className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold text-xs h-9 px-5 rounded-lg shadow-sm gap-2 transition-all">
                                <Video size={14} /> Join Call
                              </Button>
                              <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold text-xs h-9 px-5 rounded-lg gap-2 transition-all">
                                Reschedule
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                    <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">No upcoming sessions</h3>
                    <p className="text-sm text-slate-500">Book a session with a mentor to get started.</p>
                  </div>
                )
              ) : (
                pastSessions.length > 0 ? (
                  pastSessions.map((session: any) => (
                    <Card key={session.id} className="bg-white border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] transition-all rounded-3xl overflow-hidden group">
                      <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative">
                      <img src={session.image} alt={session.mentor} className="w-16 h-16 rounded-2xl shadow-sm object-cover group-hover:scale-105 transition-transform" />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-[15px] font-black text-slate-800 group-hover:text-[#1B2A6B] transition-colors">{session.topic}</h3>
                          <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-700 font-extrabold uppercase tracking-widest hidden sm:flex">Completed</Badge>
                        </div>
                        <p className="text-[13px] font-semibold text-slate-500 mb-3">with {session.mentor}</p>
                        
                        <div className="flex items-center gap-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#C9A227]"/> {session.date}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        {session.recordingAvailable && (
                          <Button variant="outline" className="flex-1 border-[#1B2A6B]/20 text-[#1B2A6B] hover:bg-blue-50 font-extrabold text-[11px] h-8 rounded-lg shadow-sm gap-1.5 uppercase tracking-wider">
                            <PlayCircle size={12} /> Recording
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold text-[11px] h-8 rounded-lg shadow-sm gap-1.5 uppercase tracking-wider">
                          <FileText size={12} /> Notes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
               ) : (
                 <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                   <h3 className="text-lg font-bold text-slate-700 mb-1">No past sessions</h3>
                 </div>
               )
              )}
            </div>
            
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Find a Mentor Banner */}
            <Card className="bg-gradient-to-br from-[#0d1635] to-[#1B2A6B] border-none shadow-[0_8px_30px_rgba(13,22,53,0.3)] rounded-3xl overflow-hidden text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/20 backdrop-blur-md">
                  <User size={24} className="text-[#C9A227]" />
                </div>
                <h3 className="font-black text-lg mb-2">Need guidance?</h3>
                <p className="text-[13px] text-slate-300 font-medium mb-5">Connect with industry experts for mock interviews, resume reviews, and career advice.</p>
                <Button className="w-full h-10 text-[11px] font-extrabold bg-[#C9A227] hover:bg-amber-400 text-[#0d1635] transition-all rounded-xl shadow-lg uppercase tracking-wider border-none">
                  Book a Session
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Mentors */}
            <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-base font-extrabold text-slate-800">Available Mentors</CardTitle>
                <button className="text-[11px] font-bold text-[#1B2A6B] hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors">View All <ChevronRight size={12}/></button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {loadingExperts ? (
                    <div className="p-8 text-center text-slate-400">Loading mentors...</div>
                  ) : availableMentors.map((mentor: any) => (
                    <div key={mentor.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors group cursor-pointer relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#C9A227] transition-colors"></div>
                      <img src={mentor.image} alt={mentor.name} className="w-12 h-12 rounded-full shadow-sm group-hover:scale-105 transition-transform object-cover" />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-extrabold text-[14px] text-slate-800 group-hover:text-[#1B2A6B] transition-colors">{mentor.name}</h4>
                          <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Star size={10} className="fill-amber-500 text-amber-500" /> {mentor.rating}
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-2">{mentor.role}</p>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {mentor.expertise.slice(0, 3).map((skill: string, i: number) => (
                            <span key={i} className="text-[9px] font-extrabold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
