import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../src/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Loader2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../src/lib/axios';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'next/router';
import { SEO } from '../../src/components/seo/SEO';

export default function ScholarshipsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [essay, setEssay] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/public/scholarships');
        if (res.data.success) {
          setScholarships(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch scholarships", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  const handleApplyClick = (scholarship: any) => {
    if (!user) {
      toast.error('Please login to apply for scholarships.');
      router.push('/login');
      return;
    }
    setSelectedScholarship(scholarship);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload a supporting document (PDF, PNG, JPG).');
      return;
    }

    setIsApplying(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      if (essay) formData.append('essay', essay);

      const res = await api.post(`/public/scholarships/${selectedScholarship.id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Application submitted successfully!');
        localStorage.setItem('bb_scholarship_applied_global', 'true');
        setSelectedScholarship(null);
        setEssay('');
        setFile(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <MainLayout>
      <SEO title="Scholarships & Talent Programs | Blueboxx DA" description="We are on a mission to discover the next generation of tech leaders. Compete and apply for scholarships to accelerate your learning journey." />
      <div className="bg-transparent min-h-screen font-sans relative">
        
        {/* Hero Section */}
        <section className="bg-[#0d1635] relative pt-24 pb-16 overflow-hidden">
          {/* Premium Grid Background */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
          <motion.div 
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#C9A227] blur-[150px] pointer-events-none will-change-opacity transform-gpu" 
          />
          
          <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#C9A227] text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-default"
            >
              <Trophy size={14} /> 2026 Talent Drive Active
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-md"
            >
              Scholarships & <br className="hidden md:block" /> <span className="text-[#C9A227] inline-block">Talent Programs</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8"
            >
              We are on a mission to discover the next generation of tech leaders. Compete and apply for scholarships to accelerate your learning journey.
            </motion.p>
          </div>
        </section>

        {/* Scholarships List Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Available Scholarships</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Apply for active scholarship programs before the deadline.</p>
            </div>

            {isLoading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-[#1B2A6B]" />
              </div>
            ) : scholarships.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Active Scholarships</h3>
                <p className="text-slate-500">Check back later for upcoming talent drives and scholarships.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((scholarship) => (
                  <motion.div 
                    key={scholarship.id}
                    whileHover={{ y: -8 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227] blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" />
                    
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4 inline-flex self-start">
                      Active
                    </span>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{scholarship.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">{scholarship.description}</p>
                    
                    <div className="mt-auto space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Amount</p>
                          <p className="text-[#1B2A6B] text-lg font-black">₹{Number(scholarship.amount).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Deadline</p>
                          <p className="text-slate-700 text-sm font-bold flex items-center gap-1 justify-end"><Calendar size={14}/> {scholarship.deadline}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplyClick(scholarship)}
                        className="w-full bg-[#1B2A6B] hover:bg-indigo-900 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                      >
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedScholarship && (
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
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => { setSelectedScholarship(null); setFile(null); setEssay(''); }} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Apply for Scholarship</h3>
                <p className="text-sm text-slate-500">{selectedScholarship.title}</p>
              </div>
              
              <form onSubmit={handleApplySubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Supporting Document</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                    {file ? (
                      <p className="text-sm font-bold text-[#1B2A6B]">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-slate-600 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400">PDF, PNG, JPG (Max 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Essay / Motivation Letter <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <textarea 
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    rows={4} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none resize-none" 
                    placeholder="Tell us why you deserve this scholarship..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isApplying || !file}
                    className="w-full bg-[#C9A227] hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1635] font-black text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    {isApplying ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      'Submit Application'
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
