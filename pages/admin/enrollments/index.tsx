import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { EnrollmentService } from '../../../src/lib/api/admin/EnrollmentService';
import { BookOpen, Search, Download, MoreVertical, Trash2, CheckCircle, XCircle, Clock, RefreshCw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../src/context/ConfirmContext';

export default function EnrollmentsManager() {
  const confirmAction = useConfirm();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchQuery); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: enrollments, meta, isLoading, mutate } = EnrollmentService.useEnrollments({
    search: debouncedSearch,
    status: activeTab === 'All' ? undefined : activeTab.toLowerCase(),
    page,
    per_page: perPage
  });

  const handleExport = () => {
    EnrollmentService.exportCSV(activeTab);
    toast.success('Downloading enrollments export...');
  };

  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete Enrollment", description: "Are you sure you want to permanently delete this enrollment? This cannot be undone.", isDestructive: true })) {
      try {
        await EnrollmentService.deleteEnrollment(id);
        toast.success("Enrollment deleted successfully!");
        mutate();
      } catch (e: any) {
        toast.error("Failed to delete enrollment.");
      }
    }
    setOpenDropdownId(null);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await EnrollmentService.updateStatus(id, status);
      toast.success(`Enrollment marked as ${status}`);
      mutate();
    } catch (e: any) {
      toast.error(`Failed to update status to ${status}`);
    }
    setOpenDropdownId(null);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'ST';
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Enrollment Management | BlueBoxx DA</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <BookOpen size={28} className="text-[#C9A227]" /> Enrollment Management
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage course enrollments, track student progress, and handle cancellations.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => mutate()} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <RefreshCw size={16} />
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Tabs & Search */}
          <div className="px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
            <div className="flex overflow-x-auto admin-scrollbar">
              {['All', 'Active', 'Pending', 'Completed', 'Cancelled', 'Refunded'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`px-5 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-[#1B2A6B] text-[#1B2A6B]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 pb-4 md:pb-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  placeholder="Search student, course, email..." 
                  className="w-full md:w-72 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B] transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto admin-scrollbar flex-1 relative min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-4">Enrollment ID</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Course</th>
                  <th className="p-4 text-center">Progress</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Enroll Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4"><div className="w-16 h-4 bg-slate-200 rounded"></div></td>
                      <td className="p-4 flex gap-3"><div className="w-10 h-10 bg-slate-200 rounded-full"></div><div><div className="w-32 h-4 bg-slate-200 rounded mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded"></div></div></td>
                      <td className="p-4"><div className="w-48 h-4 bg-slate-200 rounded mb-2"></div><div className="w-32 h-3 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="w-full h-2 bg-slate-200 rounded-full mt-2"></div></td>
                      <td className="p-4"><div className="w-16 h-6 bg-slate-200 rounded-full"></div></td>
                      <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <BookOpen size={32}/>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">No enrollments found</h3>
                      <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">There are no enrollments matching your current filters.</p>
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enrollment: any) => {
                    const student = enrollment.user || {};
                    const course = enrollment.course || {};
                    const progress = enrollment.progress || 0;
                    
                    return (
                      <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md">#ENR-{enrollment.id}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-600 font-bold text-sm">
                              {getInitials(student.first_name, student.last_name)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-[14px] mb-0.5">{student.name || `${student.first_name || ''} ${student.last_name || ''}`}</div>
                              <div className="text-[11px] font-semibold text-slate-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-[#1B2A6B] text-[14px] mb-0.5 max-w-[250px] truncate" title={course.title}>{course.title || 'Unknown Course'}</div>
                          <div className="text-[11px] font-semibold text-slate-500">By: {course.instructor?.name || 'Unknown'}</div>
                        </td>
                        <td className="p-4 w-32">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-[10px] font-black">
                              <span className="text-slate-500">PROGRESS</span>
                              <span className="text-[#1B2A6B]">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#1B2A6B] rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={enrollment.status} />
                        </td>
                        <td className="p-4 text-sm font-semibold text-slate-600">
                          {new Date(enrollment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="p-4 text-right">
                          <div className="relative inline-block text-left">
                            <button onClick={() => setOpenDropdownId(openDropdownId === enrollment.id ? null : enrollment.id)} className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none">
                              <MoreVertical size={18}/>
                            </button>
                            
                            {openDropdownId === enrollment.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                  <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">Change Status</div>
                                  
                                  {enrollment.status !== 'active' && (
                                    <button onClick={() => handleUpdateStatus(enrollment.id, 'active')} className="w-full text-left px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"><CheckCircle size={15}/> Set Active</button>
                                  )}
                                  
                                  {enrollment.status !== 'completed' && (
                                    <button onClick={() => handleUpdateStatus(enrollment.id, 'completed')} className="w-full text-left px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 flex items-center gap-2"><CheckCircle size={15}/> Set Completed</button>
                                  )}
                                  
                                  {enrollment.status !== 'pending' && (
                                    <button onClick={() => handleUpdateStatus(enrollment.id, 'pending')} className="w-full text-left px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2"><Clock size={15}/> Set Pending</button>
                                  )}
                                  
                                  {enrollment.status !== 'cancelled' && (
                                    <button onClick={() => handleUpdateStatus(enrollment.id, 'cancelled')} className="w-full text-left px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50 flex items-center gap-2"><XCircle size={15}/> Cancel Enrollment</button>
                                  )}
                                  
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button onClick={() => handleDelete(enrollment.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={15}/> Delete</button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Show</span>
                <select value={perPage} onChange={e => {setPerPage(Number(e.target.value)); setPage(1);}} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 outline-none">
                  {[15, 30, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <p className="text-xs font-semibold text-slate-500">Showing <span className="font-bold text-slate-700">{meta.from || 0}</span> to <span className="font-bold text-slate-700">{meta.to || 0}</span> of <span className="font-bold text-slate-700">{meta.total}</span> entries</p>
              </div>
              <div className="flex gap-1.5">
                <button disabled={page <= 1} onClick={() => setPage(page-1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">Prev</button>
                <button className="px-3 py-1.5 bg-[#1B2A6B] text-white rounded-lg text-sm font-black shadow-sm">{page}</button>
                <button disabled={page >= meta.last_page} onClick={() => setPage(page+1)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colors = 'bg-slate-100 text-slate-600';
  if (status === 'active') colors = 'bg-emerald-100 text-emerald-700';
  else if (status === 'completed') colors = 'bg-blue-100 text-blue-700';
  else if (status === 'pending') colors = 'bg-amber-100 text-amber-700';
  else if (status === 'cancelled') colors = 'bg-orange-100 text-orange-700';
  else if (status === 'refunded') colors = 'bg-rose-100 text-rose-700';

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${colors}`}>
      {status}
    </span>
  );
}
