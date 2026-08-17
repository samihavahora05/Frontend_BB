import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { StudentService } from '../../../src/lib/api/admin/StudentService';
import { GraduationCap, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2, Power, ShieldAlert, Key, Upload, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../src/context/ConfirmContext';
import { useRouter } from 'next/router';

export default function StudentsManager() {
  const router = useRouter();
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

  const { data: students, meta, isLoading, mutate } = StudentService.useStudents({
    search: debouncedSearch,
    status: activeTab === 'All' ? undefined : activeTab.toLowerCase(),
    page,
    per_page: perPage
  });

  const handleExport = () => {
    StudentService.exportCSV();
    toast.success('Downloading student export...');
  };

  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete Student", description: "Are you sure you want to permanently delete this student account and all related data?", isDestructive: true })) {
      try {
        await StudentService.deleteStudent(id);
        toast.success("Student deleted successfully!");
        mutate();
      } catch (e: any) {
        toast.error("Failed to delete student.");
      }
    }
    setOpenDropdownId(null);
  };

  const handleSuspend = async (id: number) => {
    try {
      await StudentService.suspendStudent(id);
      toast.success("Student account suspended");
      mutate();
    } catch (e: any) {
      toast.error("Failed to suspend student");
    }
    setOpenDropdownId(null);
  };

  const handleActivate = async (id: number) => {
    try {
      await StudentService.activateStudent(id);
      toast.success("Student account activated");
      mutate();
    } catch (e: any) {
      toast.error("Failed to activate student");
    }
    setOpenDropdownId(null);
  };

  const handleResetPassword = async (id: number) => {
    if (await confirmAction({ title: "Reset Password", description: "Are you sure you want to reset this student's password? A new password will be generated.", isDestructive: false })) {
      try {
        const res = await StudentService.resetPassword(id);
        toast.success(`Password Reset! New Password: ${res.new_password}`, { duration: 10000 });
      } catch (e: any) {
        toast.error("Failed to reset password");
      }
    }
    setOpenDropdownId(null);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'ST';
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Student Management | BlueBoxx DA</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <GraduationCap size={28} className="text-[#C9A227]" /> Student Management
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage learners, track progress, and handle student accounts.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => mutate()} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <RefreshCw size={16} />
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export
            </button>
            <button onClick={() => router.push('/admin/students/import')} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-100 transition-colors">
              <Upload size={16} /> Import
            </button>
            <button onClick={() => router.push('/admin/users')} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-black rounded-xl shadow-md transition-colors">
              <Plus size={18} /> Add Student
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Tabs & Search */}
          <div className="px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
            <div className="flex overflow-x-auto admin-scrollbar">
              {['All', 'Active', 'Suspended'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`px-6 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-[#1B2A6B] text-[#1B2A6B]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
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
                  placeholder="Search name, email, phone..." 
                  className="w-full md:w-72 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B] transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto admin-scrollbar flex-1 relative min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-4">Student Details</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Join Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4 flex gap-3"><div className="w-12 h-12 bg-slate-200 rounded-full"></div><div><div className="w-32 h-4 bg-slate-200 rounded mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded"></div></div></td>
                      <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="w-16 h-6 bg-slate-200 rounded-full"></div></td>
                      <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-16 text-center">
                      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <GraduationCap size={32}/>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">No students found</h3>
                      <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">Try adjusting your search criteria or add new students via the Universal User Manager.</p>
                      <button onClick={() => router.push('/admin/users')} className="mt-6 px-6 py-2.5 bg-[#1B2A6B] text-white rounded-xl font-bold shadow-md hover:bg-[#121c47] transition-all">Go to User Manager</button>
                    </td>
                  </tr>
                ) : (
                  students.map((student: any) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B2A6B] to-blue-600 shrink-0 flex items-center justify-center text-white font-black text-lg shadow-inner ring-2 ring-white">
                            {getInitials(student.first_name, student.last_name)}
                          </div>
                          <div>
                            <div className="font-black text-slate-800 text-[15px] mb-0.5 group-hover:text-[#1B2A6B] transition-colors">{student.first_name} {student.last_name}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              ID: {student.id} {student.email_verified_at && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-1" title="Email Verified"></span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-slate-700">{student.email}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">{student.phone || 'No phone number'}</div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-600">
                        {new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="relative inline-block text-left">
                          <button onClick={() => setOpenDropdownId(openDropdownId === student.id ? null : student.id)} className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none">
                            <MoreVertical size={18}/>
                          </button>
                          
                          {openDropdownId === student.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => { setOpenDropdownId(null); router.push(`/admin/users`); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><Edit2 size={16} className="text-blue-500"/> Edit Student</button>
                                <button onClick={() => handleResetPassword(student.id)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><Key size={16} className="text-amber-500"/> Reset Password</button>
                                
                                <div className="h-px bg-slate-100 my-1"></div>
                                {student.status === 'active' ? (
                                  <button onClick={() => handleSuspend(student.id)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><ShieldAlert size={16} className="text-orange-500"/> Suspend Account</button>
                                ) : (
                                  <button onClick={() => handleActivate(student.id)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5"><Power size={16} className="text-emerald-500"/> Activate Account</button>
                                )}
                                
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={() => handleDelete(student.id)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5"><Trash2 size={16} className="text-red-500"/> Delete Account</button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
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
