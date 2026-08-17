import React, { useState, useEffect } from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageSquare, Code, Loader2, Calendar, X } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import api from "../src/lib/axios";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [contests, setContests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [teamName, setTeamName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.get('/public/contests');
        if (res.data.success) {
          setContests(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch contests", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContests();
  }, []);

  const handleRegisterClick = (contest: any) => {
    if (!user) {
      toast.error("Please login to register for hackathons");
      router.push('/login');
      return;
    }
    setSelectedContest(contest);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContest) return;

    setIsRegistering(true);
    try {
      const res = await api.post(`/public/contests/${selectedContest.id}/register`, {
        team_name: teamName
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Registered successfully!');
        setSelectedContest(null);
        setTeamName("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register for contest.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <MainLayout>
      <SEO title="Community & Hackathons | Blueboxx DA" description="Join the Blueboxx DA community, participate in hackathons, and connect with peers and experts." />
      {/* Hero Section */}
      <div className="pt-24 pb-20 bg-[#0d1635] text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight"
          >
            Join the <span className="text-[#C9A227]">BlueBoxx</span> Community
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Connect with thousands of learners, alumni, and mentors. Build your network, share your projects, and grow together.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Button variant="gold" size="lg" className="px-8 font-bold">Join Discord Server</Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Discussion Forums</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Ask questions, share your knowledge, and participate in technical discussions with peers and mentors.
                </p>
                <Button variant="outline">Browse Forums</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Study Groups</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Find a study partner or join a group of students working on the same course or project.
                </p>
                <Button variant="outline">Find a Group</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contests / Hackathons Section */}
      <div className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Active Hackathons & Contests</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Participate in our specialized coding tracks to prove your skills.</p>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-[#1B2A6B] w-10 h-10" />
            </div>
          ) : contests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Code size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Active Contests</h3>
              <p className="text-slate-500">Check back later for upcoming hackathons and challenges.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest) => (
                <motion.div 
                  key={contest.id}
                  whileHover={{ y: -8 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227] blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#1B2A6B] mb-5">
                    <Code size={24} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block self-start ${contest.status === 'Active' ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'}`}>
                    {contest.status}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{contest.title}</h3>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-3">{contest.description}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Starts</p>
                      <p className="text-slate-900 text-sm font-extrabold flex items-center gap-1.5"><Calendar size={14} className="text-[#1B2A6B]"/> {contest.start_date}</p>
                    </div>
                    <Button onClick={() => handleRegisterClick(contest)} variant="outline" className="w-full font-bold border-[#1B2A6B] text-[#1B2A6B] hover:bg-[#1B2A6B] hover:text-white transition-colors">
                      Register Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedContest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => { setSelectedContest(null); setTeamName(""); }} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Register for Contest</h3>
                <p className="text-sm text-slate-500">{selectedContest.title}</p>
              </div>
              
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Team Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input 
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none" 
                    placeholder="Enter your team name (if applicable)"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isRegistering}
                    className="w-full bg-[#1B2A6B] hover:bg-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    {isRegistering ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                    ) : (
                      'Confirm Registration'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </MainLayout>
  );
}
