import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Users, CheckCircle, XCircle, Search, Calendar,
  Mail, Phone, Download, Clock, Star, MessageSquare,
  FileText, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

import { JobApplicationService } from '../../../src/lib/api/admin/JobApplicationService';

type AppStatus = 'applied' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'offer_sent' | 'accepted' | 'joined' | 'completed' | 'rejected';

interface Applicant {
  id: number;
  job_id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  job: {
    title: string;
    job_id_prefix: string;
  };
  created_at: string;
  status: AppStatus;
  resume_path?: string;
  notes?: string;
  rating?: number;
}

export default function JobApplications() {
  const router = useRouter();
  const { jobId } = router.query;
  const { data: applicantsData, mutate, isLoading } = JobApplicationService.useJobApplications(jobId as string);
  // applicants is moved inside useMemo to prevent exhaustive-deps warning
  
  const [selectedApp, setSelectedApp] = useState<Applicant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AppStatus | 'all'>('all');
  const [noteInput, setNoteInput] = useState('');

  const filteredApplicants = React.useMemo(() => {
    const applicants = applicantsData || [];
    return applicants.filter((a: any) => {
      if (jobId && String(a.job_id) !== String(jobId)) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (searchQuery && !(a.user?.first_name + ' ' + a.user?.last_name).toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [applicantsData, jobId, filterStatus, searchQuery]);

  // Initial selection
  useEffect(() => {
    if (!selectedApp && filteredApplicants.length > 0) {
      setSelectedApp(filteredApplicants[0]);
    }
  }, [selectedApp, filteredApplicants]);



  const handleStatusChange = async (newStatus: string) => {
    if (!selectedApp) return;
    try {
      await JobApplicationService.updateStatus(selectedApp.id, newStatus, selectedApp.notes);
      toast.success(`Applicant moved to ${newStatus.replace('_', ' ')}`);
      setSelectedApp({ ...selectedApp, status: newStatus as AppStatus });
      mutate();
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  const saveNote = async () => {
    if (!selectedApp || !noteInput.trim()) return;
    const newNotes = selectedApp.notes ? `${selectedApp.notes}\n- ${noteInput}` : `- ${noteInput}`;
    try {
      await JobApplicationService.updateStatus(selectedApp.id, selectedApp.status, newNotes);
      setSelectedApp({ ...selectedApp, notes: newNotes });
      setNoteInput('');
      toast.success('Note added');
      mutate();
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const getStatusColor = (status: AppStatus) => {
    switch(status) {
      case 'applied': return 'bg-gray-100 text-gray-700';
      case 'under_review': return 'bg-blue-50 text-blue-600';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'offer_sent': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-emerald-50 text-emerald-600';
      case 'joined': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-emerald-200 text-emerald-900';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const statuses: AppStatus[] = ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'offer_sent', 'accepted', 'joined', 'completed', 'rejected'];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Applicant Tracking | BlueBoxx DA</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1635] flex items-center gap-2">
            <Users size={28} className="text-[#C9A227]"/> Applicant Tracking
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {jobId ? `Viewing applicants for ${jobId}` : 'Manage all job applications and candidates.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
        
        {/* Left Panel - Applicant List */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
            >
              <option value="all">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto admin-scrollbar">
            {filteredApplicants.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredApplicants.map(app => (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedApp?.id === app.id ? 'bg-[#1B2A6B]/5 border-l-4 border-l-[#1B2A6B]' : 'border-l-4 border-l-transparent'}`}
                  >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {app.user?.first_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate">{app.user?.first_name} {app.user?.last_name}</h4>
                          <p className="text-xs font-semibold text-gray-500 truncate mb-1">{app.job?.title}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(app.status)} uppercase`}>{app.status.replace('_', ' ')}</span>
                            <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1"><Clock size={10}/> {new Date(app.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 font-medium text-sm">No applicants found.</div>
            )}
          </div>
        </div>

        {/* Right Panel - Applicant Details & ATS */}
        <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
          {selectedApp ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-white shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                      {selectedApp.user?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#1B2A6B]">{selectedApp.user?.first_name} {selectedApp.user?.last_name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusColor(selectedApp.status)} uppercase`}>{selectedApp.status.replace('_', ' ')}</span>
                        <span className="text-sm font-bold text-gray-500">Applied for: <span className="text-gray-800">{selectedApp.job?.title}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pipeline Actions */}
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.status === 'applied' && <button onClick={() => handleStatusChange('under_review')} className="px-3 py-1.5 text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm">Review Resume</button>}
                    {selectedApp.status === 'under_review' && <button onClick={() => handleStatusChange('shortlisted')} className="px-3 py-1.5 text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded shadow-sm">Shortlist</button>}
                    {selectedApp.status === 'shortlisted' && <button onClick={() => handleStatusChange('interview_scheduled')} className="px-3 py-1.5 text-xs font-bold bg-purple-500 hover:bg-purple-600 text-white rounded shadow-sm">Schedule Interview</button>}
                    {selectedApp.status === 'interview_scheduled' && <button onClick={() => handleStatusChange('offer_sent')} className="px-3 py-1.5 text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow-sm">Send Offer</button>}
                    {selectedApp.status === 'offer_sent' && <button onClick={() => handleStatusChange('accepted')} className="px-3 py-1.5 text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white rounded shadow-sm">Mark Accepted</button>}
                    {selectedApp.status === 'accepted' && <button onClick={() => handleStatusChange('joined')} className="px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded shadow-sm">Mark Joined</button>}
                    {selectedApp.status !== 'rejected' && selectedApp.status !== 'joined' && selectedApp.status !== 'completed' && <button onClick={() => handleStatusChange('rejected')} className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 rounded shadow-sm">Reject</button>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400"/> <span className="font-semibold text-gray-700">{selectedApp.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-400"/> <span className="font-semibold text-gray-700">{selectedApp.user?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={16} className="text-gray-400"/> <span className="font-semibold text-gray-700">{selectedApp.job?.job_id_prefix}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star}
                        onClick={() => {
                          // Not supported in this simplified mock implementation
                          toast.error('Rating requires backend update implementation');
                        }}
                        className={`p-1 hover:scale-110 transition-transform ${(selectedApp.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star size={16} fill={(selectedApp.rating || 0) >= star ? "currentColor" : "none"}/>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content (Split) */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Resume Preview Box */}
                <div className="w-full md:w-3/5 p-6 border-r border-gray-100 overflow-y-auto admin-scrollbar bg-gray-50/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Resume Preview</h3>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A6B] hover:underline bg-[#1B2A6B]/5 px-3 py-1.5 rounded-lg">
                      <Download size={14}/> Download PDF
                    </button>
                  </div>
                  
                  {/* Simulated PDF Viewer */}
                  <div className="w-full h-[600px] bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex flex-col">
                    <div className="border-b-2 border-gray-800 pb-4 mb-6">
                      <h1 className="text-3xl font-serif text-gray-900 uppercase">{selectedApp.user?.first_name} {selectedApp.user?.last_name}</h1>
                      <p className="text-sm text-gray-600 mt-2">{selectedApp.user?.email} • {selectedApp.user?.phone}</p>
                    </div>
                    <div className="flex-1 space-y-6 text-sm text-gray-700">
                      <div>
                        <h2 className="font-bold text-gray-900 uppercase tracking-wider mb-2">Experience</h2>
                        <div className="mb-3">
                          <div className="flex justify-between font-bold"><span>Previous Company Inc.</span><span>2020 - Present</span></div>
                          <div className="italic text-gray-600 mb-1">{selectedApp.job?.title}</div>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Led a team of 5 developers to build scalable applications.</li>
                            <li>Increased revenue by 15% through UI optimizations.</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 uppercase tracking-wider mb-2">Education</h2>
                        <div>
                          <div className="flex justify-between font-bold"><span>State University</span><span>2016 - 2020</span></div>
                          <div className="italic text-gray-600">B.S. in Computer Science</div>
                        </div>
                      </div>
                      <div className="mt-auto pt-8 flex items-center justify-center opacity-50">
                        <FileText size={48} className="text-gray-300"/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline & Notes */}
                <div className="w-full md:w-2/5 p-6 overflow-y-auto admin-scrollbar flex flex-col">
                  
                  {/* ATS Timeline Tracker */}
                  <div className="mb-8">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Application Pipeline</h3>
                    <div className="space-y-4">
                      {statuses.map((step, idx) => {
                        const currentIndex = statuses.indexOf(selectedApp.status);
                        const stepIndex = statuses.indexOf(step);
                        let state = 'pending';
                        if (stepIndex < currentIndex) state = 'completed';
                        if (stepIndex === currentIndex) state = 'current';
                        
                        // If Rejected, logic changes
                        if (selectedApp.status === 'rejected') {
                          if (step === 'rejected') state = 'current-rejected';
                          else if (stepIndex > statuses.indexOf('applied')) state = 'pending'; // or whatever step they were rejected at, simplify to pending for others
                        } else if (step === 'rejected') {
                          state = 'pending';
                        }

                        return (
                          <div key={step} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                              state === 'completed' ? 'bg-emerald-500 text-white' :
                              state === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-100' :
                              state === 'current-rejected' ? 'bg-red-500 text-white ring-4 ring-red-100' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {state === 'completed' ? <CheckCircle size={14}/> : 
                               state === 'current-rejected' ? <XCircle size={14}/> : 
                               <span className="text-[10px] font-bold">{idx + 1}</span>}
                            </div>
                            <span className={`text-sm font-bold uppercase ${
                              state === 'current' ? 'text-blue-600' : 
                              state === 'current-rejected' ? 'text-red-600' :
                              state === 'completed' ? 'text-gray-800' : 'text-gray-400'
                            }`}>{step.replace('_', ' ')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Internal Notes</h3>
                    
                    <div className="flex-1 bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 mb-4 overflow-y-auto whitespace-pre-wrap text-sm text-gray-700 font-medium">
                      {selectedApp.notes || <span className="text-gray-400 italic">No notes added yet.</span>}
                    </div>

                    <div className="mt-auto">
                      <textarea 
                        rows={3} 
                        placeholder="Add a note about this candidate..." 
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none mb-2"
                      />
                      <button onClick={saveNote} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white rounded-lg font-bold text-sm transition-colors">
                        <MessageSquare size={16}/> Save Note
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Users size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-bold text-gray-600">Select an applicant</p>
              <p className="text-sm font-medium">Choose a candidate from the list to view their details.</p>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
