import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { DataTable, Column } from '../../../src/components/DataTable';
import { ContestService } from '../../../src/lib/api/admin/ContestService';
import { 
  Trophy, Plus, Edit2, Trash2, CheckCircle, XCircle, Users, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'Contests' | 'Applications' | 'Submissions' | 'Leaderboard';

// Models
interface Contest {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: 'Upcoming' | 'Active' | 'Ongoing' | 'Completed';
}

interface Application {
  id: string;
  studentName: string;
  contestTitle: string;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Submission {
  id: string;
  studentName: string;
  taskTitle: string;
  contestTitle: string;
  submittedAt: string;
  status: 'Pending Review' | 'Graded';
  files: string[];
  link: string;
  score?: number;
  totalMarks: number;
}

const dummyApps: Application[] = [
  { id: 'a1', studentName: 'Michael Scott', contestTitle: 'Global Coding Challenge 2023', appliedDate: '2023-10-28', status: 'Pending' },
  { id: 'a2', studentName: 'Jim Halpert', contestTitle: 'UI/UX Design Sprint', appliedDate: '2023-10-24', status: 'Approved' },
  { id: 'a3', studentName: 'Dwight Schrute', contestTitle: 'Global Coding Challenge 2023', appliedDate: '2023-10-28', status: 'Pending' },
];

const dummySubmissions: Submission[] = [
  { id: 's1', studentName: 'Jim Halpert', taskTitle: 'Mobile App Wireframe', contestTitle: 'UI/UX Design Sprint', submittedAt: '2023-10-26 14:30', status: 'Pending Review', files: ['wireframe.pdf'], link: 'https://figma.com/file/123', totalMarks: 100 },
  { id: 's2', studentName: 'Pam Beesly', taskTitle: 'Dashboard UI', contestTitle: 'UI/UX Design Sprint', submittedAt: '2023-10-25 09:15', status: 'Graded', files: ['dashboard.png'], link: '', score: 92, totalMarks: 100 },
];

export default function ContestsManager() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Contests');

  const { data: contestsData, isLoading: isContestsLoading, mutate: mutateContests } = ContestService.useContests({ per_page: 50 });
  const contests: Contest[] = (contestsData?.data || []).map((c: any) => ({
    id: String(c.id),
    title: c.title,
    type: c.category?.name || 'General',
    startDate: c.start_date ? new Date(c.start_date).toLocaleDateString() : 'TBD',
    endDate: c.end_date ? new Date(c.end_date).toLocaleDateString() : 'TBD',
    participants: c.registrations_count ?? 0,
    status: c.status ? (c.status.charAt(0).toUpperCase() + c.status.slice(1)) as Contest['status'] : 'Upcoming',
  }));

  const [apps, setApps] = useState<Application[]>(dummyApps);
  const [submissions, setSubmissions] = useState<Submission[]>(dummySubmissions);

  // Modals
  const [gradeSubId, setGradeSubId] = useState<Submission | null>(null);
  const [assignTaskId, setAssignTaskId] = useState<string | null>(null);
  const [editingContest, setEditingContest] = useState<any>(null);

  const handleDeleteContest = async (id: string) => {
    if (!confirm('Delete this contest? This cannot be undone.')) return;
    try {
      await ContestService.deleteContest(id);
      toast.success('Contest deleted');
      mutateContests();
    } catch (error) {
      toast.error('Failed to delete contest');
    }
  };

  const handleApproveApp = (id: string) => {
    toast.success('Registration Approved!');
    setApps(apps.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleRejectApp = (id: string) => {
    toast.error('Registration Rejected');
    setApps(apps.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  const handleGrade = (id: string, score: number) => {
    toast.success(`Submission graded with ${score} marks!`);
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'Graded', score } : s));
    setGradeSubId(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Active':
      case 'Ongoing': return 'bg-emerald-100 text-emerald-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-emerald-100 text-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Graded': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const contestCols: Column<Contest>[] = [
    { key: 'title', label: 'Contest', render: (r: Contest) => (
      <div>
        <div className="font-bold text-[#1B2A6B] text-sm">{r.title}</div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{r.type}</div>
      </div>
    )},
    { key: 'timeline', label: 'Timeline', render: (r: Contest) => <span className="text-xs font-bold text-gray-500">{r.startDate} - {r.endDate}</span> },
    { key: 'participants', label: 'Participants', render: (r: Contest) => <span className="text-sm font-black text-gray-800 flex items-center gap-1"><Users size={14}/> {r.participants}</span> },
    { key: 'status', label: 'Status', render: (r: Contest) => (
      <select
        value={r.status === 'Active' || r.status === 'Ongoing' ? 'Ongoing' : r.status}
        onChange={async (e) => {
          const val = e.target.value.toLowerCase();
          const targetStatus = val === 'active' ? 'ongoing' : val;
          try {
            await ContestService.updateContest(r.id, { status: targetStatus as any });
            toast.success(`Status updated to ${e.target.value}`);
            mutateContests();
          } catch (err) {
            toast.error('Failed to update status');
          }
        }}
        className={`px-2 py-1 rounded text-xs font-bold border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] ${getStatusColor(r.status)}`}
      >
        <option value="Upcoming">Upcoming</option>
        <option value="Ongoing">Ongoing (Active)</option>
        <option value="Completed">Completed</option>
      </select>
    )},
    { key: 'actions', label: 'Actions', render: (r: Contest) => (
      <div className="flex gap-2">
        <button onClick={() => setAssignTaskId(r.id)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded shadow-sm flex items-center gap-1">
          <Plus size={14}/> Assign Task
        </button>
        <button onClick={() => setEditingContest(r)} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded border border-slate-200" title="Edit Contest"><Edit2 size={16}/></button>
        <button onClick={() => handleDeleteContest(r.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200" title="Delete"><Trash2 size={16}/></button>
      </div>
    )}
  ];

  const appCols: Column<Application>[] = [
    { key: 'student', label: 'Student', render: (r: Application) => <span className="font-bold text-gray-800">{r.studentName}</span> },
    { key: 'contest', label: 'Contest', render: (r: Application) => <span className="text-sm font-semibold text-[#1B2A6B]">{r.contestTitle}</span> },
    { key: 'date', label: 'Applied', render: (r: Application) => <span className="text-xs font-bold text-gray-500">{r.appliedDate}</span> },
    { key: 'status', label: 'Status', render: (r: Application) => <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(r.status)}`}>{r.status}</span> },
    { key: 'actions', label: 'Actions', render: (r: Application) => (
      r.status === 'Pending' ? (
        <div className="flex gap-2">
          <button onClick={() => handleApproveApp(r.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded tooltip" title="Approve"><CheckCircle size={16}/></button>
          <button onClick={() => handleRejectApp(r.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded tooltip" title="Reject"><XCircle size={16}/></button>
        </div>
      ) : <span className="text-gray-400 text-xs font-bold">Processed</span>
    )}
  ];

  const subCols: Column<Submission>[] = [
    { key: 'student', label: 'Student', render: (r: Submission) => <span className="font-bold text-gray-800">{r.studentName}</span> },
    { key: 'task', label: 'Task & Contest', render: (r: Submission) => (
      <div>
        <div className="font-bold text-[#1B2A6B] text-sm">{r.taskTitle}</div>
        <div className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">{r.contestTitle}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (r: Submission) => <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(r.status)}`}>{r.status}</span> },
    { key: 'marks', label: 'Marks', render: (r: Submission) => (
      r.score !== undefined ? (
        <div className="flex flex-col items-center">
          <span className="font-black text-lg text-[#1B2A6B] leading-none">{r.score}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ {r.totalMarks}</span>
        </div>
      ) : <span className="text-xs font-bold text-gray-400">- / {r.totalMarks}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r: Submission) => (
      <button onClick={() => setGradeSubId(r)} className="px-3 py-1.5 bg-[#1B2A6B] text-white text-xs font-bold rounded shadow-sm hover:bg-[#121c47]">View & Grade</button>
    )}
  ];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Contests Manager | BlueBoxx DA</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <Trophy size={28} className="text-[#C9A227]"/> Contests & Hackathons
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">Manage contests, approve registrations, assign tasks, and review submissions.</p>
        </div>
        <button
          onClick={() => router.push('/admin/contests/add')}
          className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-colors"
        >
          <Plus size={16} /> Create Contest
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-200 admin-scrollbar">
          {(['Contests', 'Applications', 'Submissions', 'Leaderboard'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#1B2A6B] border-b-2 border-[#1B2A6B]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === 'Contests' && (
          isContestsLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm font-semibold">Loading contests...</div>
          ) : (
            <DataTable data={contests} columns={contestCols} />
          )
        )}
        {activeTab === 'Applications' && <DataTable data={apps} columns={appCols} />}
        {activeTab === 'Submissions' && <DataTable data={submissions} columns={subCols} />}
        {activeTab === 'Leaderboard' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            <Trophy size={48} className="mx-auto mb-4 text-[#C9A227] opacity-50"/>
            <h2 className="text-lg font-black text-gray-800">Global Leaderboard</h2>
            <p className="text-sm font-semibold">Grades automatically sync to the leaderboard.</p>
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      {gradeSubId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <div>
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">Review Contest Submission <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs uppercase tracking-widest">{gradeSubId.studentName}</span></h2>
                <p className="text-sm font-bold text-gray-500 mt-1">{gradeSubId.taskTitle} • {gradeSubId.contestTitle}</p>
              </div>
              <button onClick={() => setGradeSubId(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Submitted Files & Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gradeSubId.files.map((file, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-gray-50">
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><FileText size={16} className="text-blue-500"/> {file}</span>
                      <button className="text-xs font-bold text-[#1B2A6B] hover:underline">Download</button>
                    </div>
                  ))}
                  {gradeSubId.link && (
                    <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-gray-50 md:col-span-2">
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-2">🔗 <a href={gradeSubId.link} target="_blank" className="text-blue-600 hover:underline">{gradeSubId.link}</a></span>
                      <span className="text-[10px] font-black text-gray-400 uppercase">External Link</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Award Marks & Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Marks (out of {gradeSubId.totalMarks})</label>
                    <input type="number" id="contestMarksInput" defaultValue={gradeSubId.score || ''} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-black text-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B] text-center" placeholder="0"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Evaluation Feedback</label>
                    <textarea rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] resize-none" placeholder="Provide feedback..."/>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
              <button onClick={() => {
                const val = (document.getElementById('contestMarksInput') as HTMLInputElement).value;
                handleGrade(gradeSubId.id, parseInt(val || '0'));
              }} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={18}/> Submit Grades & Update Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {assignTaskId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-black text-gray-800">Assign Contest Task</h2>
              <button onClick={() => setAssignTaskId(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Task Title</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Description & Rules</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B] resize-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Total Marks</label>
                  <input type="number" defaultValue={100} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Submission Deadline</label>
                  <input type="datetime-local" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]"/>
                </div>
              </div>
              <button onClick={() => {toast.success('Task Assigned to all approved participants!'); setAssignTaskId(null);}} className="w-full py-3 bg-[#1B2A6B] hover:bg-[#121c47] text-white rounded-xl font-bold text-sm shadow-md transition-colors mt-4">
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contest Modal */}
      {editingContest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Edit Contest</h2>
              <button onClick={() => setEditingContest(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const title = form.get('title') as string;
              const status = form.get('status') as string;
              const startDate = form.get('start_date') as string;
              const endDate = form.get('end_date') as string;
              const description = form.get('description') as string;

              try {
                const payload: any = {
                  title,
                  status: (status.toLowerCase() === 'active' ? 'ongoing' : status.toLowerCase()) as any,
                };
                if (startDate) payload.start_date = startDate;
                if (endDate) payload.end_date = endDate;
                if (description) payload.description = description;

                await ContestService.updateContest(editingContest.id, payload);
                toast.success('Contest updated successfully!');
                setEditingContest(null);
                mutateContests();
              } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Failed to update contest');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contest Title</label>
                <input type="text" name="title" defaultValue={editingContest.title} required className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select name="status" defaultValue={editingContest.status === 'Active' ? 'Ongoing' : editingContest.status} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing (Active)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                  <input type="date" name="start_date" defaultValue={editingContest.startDate !== 'TBD' ? editingContest.startDate : ''} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                  <input type="date" name="end_date" defaultValue={editingContest.endDate !== 'TBD' ? editingContest.endDate : ''} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editingContest.description || ''} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#1B2A6B] resize-none" placeholder="Enter contest details..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingContest(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white rounded-lg text-xs font-bold shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
