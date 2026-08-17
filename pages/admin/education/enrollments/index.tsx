import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../../src/layout/AdminDashboardLayout';
import { 
  Users, CheckCircle2, Clock, XCircle, RefreshCw, 
  Search, Filter, Download, Plus, MoreVertical, 
  Eye, Edit2, Check, X, ShieldAlert, FileText, ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  instructor: string;
  date: string;
  progress: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  enrollmentStatus: 'Active' | 'Pending' | 'Completed' | 'Cancelled' | 'Refunded';
}

const MOCK_DATA: Enrollment[] = [
  { id: 'ENR-001', studentName: 'Alice Johnson', studentEmail: 'alice@example.com', courseName: 'Advanced React Patterns', instructor: 'John Doe', date: '2023-10-15', progress: 45, paymentStatus: 'Paid', enrollmentStatus: 'Active' },
  { id: 'ENR-002', studentName: 'Bob Smith', studentEmail: 'bob@example.com', courseName: 'Node.js Backend Masterclass', instructor: 'Jane Smith', date: '2023-10-18', progress: 100, paymentStatus: 'Paid', enrollmentStatus: 'Completed' },
  { id: 'ENR-003', studentName: 'Charlie Brown', studentEmail: 'charlie@example.com', courseName: 'UI/UX Design Fundamentals', instructor: 'Alex Johnson', date: '2023-10-20', progress: 0, paymentStatus: 'Pending', enrollmentStatus: 'Pending' },
  { id: 'ENR-004', studentName: 'Diana Prince', studentEmail: 'diana@example.com', courseName: 'Data Science with Python', instructor: 'Sarah Connor', date: '2023-10-21', progress: 15, paymentStatus: 'Refunded', enrollmentStatus: 'Refunded' },
  { id: 'ENR-005', studentName: 'Evan Wright', studentEmail: 'evan@example.com', courseName: 'Machine Learning Basics', instructor: 'John Doe', date: '2023-10-22', progress: 0, paymentStatus: 'Paid', enrollmentStatus: 'Cancelled' },
];

export default function CourseEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API Load
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 600));
      const stored = localStorage.getItem('bb_enrollments_v1');
      if (stored) {
        setEnrollments(JSON.parse(stored));
      } else {
        setEnrollments(MOCK_DATA);
        localStorage.setItem('bb_enrollments_v1', JSON.stringify(MOCK_DATA));
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const saveEnrollments = (newEnrollments: Enrollment[]) => {
    setEnrollments(newEnrollments);
    localStorage.setItem('bb_enrollments_v1', JSON.stringify(newEnrollments));
  };

  // Actions
  const handleApprove = (id: string) => {
    const updated = enrollments.map(e => e.id === id ? { ...e, enrollmentStatus: 'Active' as const, paymentStatus: 'Paid' as const } : e);
    saveEnrollments(updated);
    toast.success('Enrollment Approved');
  };

  const handleProcessRefund = () => {
    if (selectedEnrollment) {
      const updated = enrollments.map(e => e.id === selectedEnrollment.id ? { ...e, enrollmentStatus: 'Refunded' as const, paymentStatus: 'Refunded' as const } : e);
      saveEnrollments(updated);
      toast.success(`Refund processed for ${selectedEnrollment.studentName}`);
      setIsRefundModalOpen(false);
      setIsViewDrawerOpen(false);
    }
  };

  const handleCancelEnrollment = () => {
    if (selectedEnrollment) {
      const updated = enrollments.map(e => e.id === selectedEnrollment.id ? { ...e, enrollmentStatus: 'Cancelled' as const } : e);
      saveEnrollments(updated);
      toast.success(`Enrollment cancelled for ${selectedEnrollment.studentName}`);
      setIsCancelModalOpen(false);
      setIsViewDrawerOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    saveEnrollments(enrollments.filter(e => e.id !== id));
    toast.success('Enrollment deleted successfully');
  };

  // Derived State
  let filtered = enrollments.filter(e => 
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (activeTab !== 'All') {
    filtered = filtered.filter(e => e.enrollmentStatus === activeTab);
  }

  const stats = {
    total: enrollments.length,
    active: enrollments.filter(e => e.enrollmentStatus === 'Active').length,
    pending: enrollments.filter(e => e.enrollmentStatus === 'Pending').length,
    completed: enrollments.filter(e => e.enrollmentStatus === 'Completed').length,
    cancelled: enrollments.filter(e => e.enrollmentStatus === 'Cancelled').length,
    refunded: enrollments.filter(e => e.enrollmentStatus === 'Refunded').length,
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Course Enrollments | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Course Enrollments</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Manage course enrollments, payments, and refunds centrally.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success('Exporting CSV...')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => toast.success('Exporting Excel...')} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors">
            <Download size={16} /> Export Excel
          </button>
          <button className="flex items-center gap-2 bg-[#C9A227] hover:bg-[#b59223] text-white px-4 py-2.5 rounded-xl font-black text-sm shadow-md transition-colors">
            <Plus size={16} /> New Enrollment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total" value={stats.total} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard title="Active" value={stats.active} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
        <StatCard title="Completed" value={stats.completed} icon={AwardBadge} color="bg-purple-50 text-purple-600" />
        <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="bg-slate-100 text-slate-600" />
        <StatCard title="Refunded" value={stats.refunded} icon={RefreshCw} color="bg-red-50 text-red-600" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
        
        {/* Status Tabs & Filters */}
        <div className="px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          
          <div className="flex overflow-x-auto admin-scrollbar">
            {['All', 'Pending', 'Active', 'Completed', 'Cancelled', 'Refunded'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-[#1B2A6B] text-[#1B2A6B]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 pb-4 md:pb-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search student or course..." className="w-full md:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0">
              <Filter size={16}/> Filters
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto admin-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></th>
                <th className="p-4">Enrollment ID</th>
                <th className="p-4"><div className="flex items-center gap-1.5 cursor-pointer">Student <ArrowUpDown size={12}/></div></th>
                <th className="p-4">Course & Instructor</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Progress</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="w-4 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-16 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded mb-1"></div><div className="w-24 h-3 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-40 h-4 bg-slate-200 rounded mb-1"></div><div className="w-20 h-3 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-12 h-4 bg-slate-200 rounded mx-auto"></div></td>
                    <td className="p-4"><div className="w-16 h-5 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="w-16 h-5 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4"><FileText size={32}/></div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">No enrollments found</h3>
                    <p className="text-sm font-medium text-slate-500">Adjust your search or filter settings to find what you're looking for.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(enrollment => (
                  <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4"><input type="checkbox" className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></td>
                    <td className="p-4 text-xs font-black text-slate-500 uppercase">{enrollment.id}</td>
                    <td className="p-4">
                      <div className="font-black text-slate-800">{enrollment.studentName}</div>
                      <div className="text-xs font-medium text-slate-500">{enrollment.studentEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#1B2A6B] line-clamp-1 max-w-[200px]">{enrollment.courseName}</div>
                      <div className="text-xs font-semibold text-slate-500">by {enrollment.instructor}</div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{enrollment.date}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-black ${enrollment.progress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
                        {enrollment.progress}%
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={enrollment.paymentStatus} type="payment" />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={enrollment.enrollmentStatus} type="enrollment" />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedEnrollment(enrollment); setIsViewDrawerOpen(true); }} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg tooltip" title="View"><Eye size={16}/></button>
                        {enrollment.enrollmentStatus === 'Pending' && <button onClick={() => handleApprove(enrollment.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg tooltip" title="Approve"><Check size={16}/></button>}
                        <div className="relative group/dropdown">
                          <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><MoreVertical size={16}/></button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 py-1">
                            <button className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Edit2 size={14}/> Edit</button>
                            <button className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><FileText size={14}/> Generate Certificate</button>
                            {enrollment.enrollmentStatus !== 'Refunded' && <button onClick={() => { setSelectedEnrollment(enrollment); setIsRefundModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2"><RefreshCw size={14}/> Process Refund</button>}
                            {enrollment.enrollmentStatus !== 'Cancelled' && <button onClick={() => { setSelectedEnrollment(enrollment); setIsCancelModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"><XCircle size={14}/> Cancel Enrollment</button>}
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button onClick={() => handleDelete(enrollment.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2Icon size={14}/> Delete</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-slate-500">Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{filtered.length}</span> entries</p>
            <div className="flex gap-1.5">
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-400 hover:bg-slate-50">Prev</button>
              <button className="px-3 py-1.5 bg-[#1B2A6B] text-white rounded-lg text-sm font-black shadow-sm">1</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-400 hover:bg-slate-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* View Enrollment Drawer */}
      {isViewDrawerOpen && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={() => setIsViewDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-800">Enrollment Details</h2>
              <button onClick={() => setIsViewDrawerOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Header Profile */}
              <div className="text-center pb-6 border-b border-slate-100">
                <div className="w-16 h-16 bg-[#1B2A6B] text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-3">
                  {selectedEnrollment.studentName.charAt(0)}
                </div>
                <h3 className="text-xl font-black text-slate-800">{selectedEnrollment.studentName}</h3>
                <p className="text-sm font-semibold text-slate-500">{selectedEnrollment.studentEmail}</p>
                <div className="mt-3 inline-flex items-center gap-2">
                  <StatusBadge status={selectedEnrollment.enrollmentStatus} type="enrollment" />
                </div>
              </div>

              {/* Course Info */}
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Course Information</h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Course Name</p>
                    <p className="text-sm font-bold text-slate-800">{selectedEnrollment.courseName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Instructor</p>
                    <p className="text-sm font-bold text-slate-800">{selectedEnrollment.instructor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Enrollment ID & Date</p>
                    <p className="text-sm font-bold text-slate-800 uppercase">{selectedEnrollment.id} • {selectedEnrollment.date}</p>
                  </div>
                </div>
              </div>

              {/* Progress & Payment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Progress</h4>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                    <span className="text-2xl font-black text-[#1B2A6B]">{selectedEnrollment.progress}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment</h4>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center flex items-center justify-center h-full">
                    <StatusBadge status={selectedEnrollment.paymentStatus} type="payment" />
                  </div>
                </div>
              </div>

            </div>
            
            {/* Drawer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              {selectedEnrollment.enrollmentStatus !== 'Refunded' && (
                <button onClick={() => setIsRefundModalOpen(true)} className="flex-1 py-2.5 bg-white border border-amber-200 text-amber-600 text-sm font-bold rounded-xl hover:bg-amber-50 shadow-sm transition-all">Refund</button>
              )}
              {selectedEnrollment.enrollmentStatus !== 'Cancelled' && (
                <button onClick={() => setIsCancelModalOpen(true)} className="flex-1 py-2.5 bg-white border border-rose-200 text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-50 shadow-sm transition-all">Cancel</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {isRefundModalOpen && selectedEnrollment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"><RefreshCw size={32} /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Process Refund?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to refund <span className="font-bold text-slate-800">{selectedEnrollment.studentName}</span> for <span className="font-bold text-slate-800">{selectedEnrollment.courseName}</span>? This will revoke access.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsRefundModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">No, Keep It</button>
              <button onClick={handleProcessRefund} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all">Yes, Refund</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedEnrollment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldAlert size={32} /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Cancel Enrollment?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to cancel the enrollment for <span className="font-bold text-slate-800">{selectedEnrollment.studentName}</span> without a refund?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Go Back</button>
              <button onClick={handleCancelEnrollment} className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md transition-all">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className="text-xl font-black text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}

function StatusBadge({ status, type }: { status: string, type: 'payment' | 'enrollment' }) {
  let colors = 'bg-slate-100 text-slate-600';
  
  if (status === 'Active' || status === 'Completed' || status === 'Paid') {
    colors = 'bg-emerald-100 text-emerald-700';
  } else if (status === 'Pending') {
    colors = 'bg-amber-100 text-amber-700';
  } else if (status === 'Refunded') {
    colors = 'bg-rose-100 text-rose-700';
  } else if (status === 'Cancelled') {
    colors = 'bg-slate-200 text-slate-700';
  }

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${colors}`}>
      {status}
    </span>
  );
}

// Extra Icons
const AwardBadge = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>;
const Trash2Icon = ({size}: {size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
