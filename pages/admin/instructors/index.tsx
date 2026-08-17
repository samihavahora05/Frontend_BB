import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { InstructorService } from '../../../src/lib/api/admin/InstructorService';
import { GraduationCap, Search, Download, Plus, MoreVertical, Edit2, Trash2, Power, ShieldAlert, Key, Upload, RefreshCw, Star, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../src/context/ConfirmContext';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstructorsManager() {
  const router = useRouter();
  const confirmAction = useConfirm();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchQuery); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: instructors, meta, isLoading, mutate } = InstructorService.useInstructors({
    search: debouncedSearch,
    status: activeTab === 'All' ? undefined : activeTab.toLowerCase(),
    page,
    per_page: perPage
  });

  const handleExport = () => {
    InstructorService.exportCSV();
    toast.success('Downloading instructors export...');
  };

  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete Instructor", description: "Are you sure you want to permanently delete this instructor account and all related data?", isDestructive: true })) {
      try {
        await InstructorService.deleteInstructor(id);
        toast.success("Instructor deleted successfully!");
        mutate();
      } catch (e: any) {
        toast.error("Failed to delete instructor.");
      }
    }
    setOpenDropdownId(null);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await InstructorService.updateInstructorStatus(id, status);
      toast.success(`Instructor marked as ${status}`);
      mutate();
    } catch (e: any) {
      toast.error(`Failed to update status to ${status}`);
    }
    setOpenDropdownId(null);
  };

  const handleResetPassword = async (id: number) => {
    if (await confirmAction({ title: "Reset Password", description: "Are you sure you want to reset this instructor's password? A new password will be generated.", isDestructive: false })) {
      try {
        const res = await InstructorService.resetPassword(id);
        toast.success(`Password Reset! New Password: ${res.new_password}`, { duration: 10000 });
      } catch (e: any) {
        toast.error("Failed to reset password");
      }
    }
    setOpenDropdownId(null);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'IN';
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Instructor Management | BlueBoxx DA</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <GraduationCap size={28} className="text-[#C9A227]" /> Instructor Management
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage experts, approve profiles, and oversee teaching staff.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => mutate()} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <RefreshCw size={16} />
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-black rounded-xl shadow-md transition-colors">
              <Plus size={18} /> Add Instructor
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Tabs & Search */}
          <div className="px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
            <div className="flex overflow-x-auto admin-scrollbar">
              {['All', 'Approved', 'Pending', 'Rejected', 'Suspended'].map(tab => (
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
                  placeholder="Search name, email, expertise..." 
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
                  <th className="p-4">Instructor Details</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Expertise</th>
                  <th className="p-4 text-center">Rating</th>
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
                      <td className="p-4"><div className="w-16 h-4 bg-slate-200 rounded mx-auto"></div></td>
                      <td className="p-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
                      <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : instructors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <GraduationCap size={32}/>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">No instructors found</h3>
                      <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">Try adjusting your search criteria or add new instructors via the Universal User Manager.</p>
                      <button onClick={() => router.push('/admin/users')} className="mt-6 px-6 py-2.5 bg-[#1B2A6B] text-white rounded-xl font-bold shadow-md hover:bg-[#121c47] transition-all">Go to User Manager</button>
                    </td>
                  </tr>
                ) : (
                  instructors.map((instructor: any) => {
                    const user = instructor.user || {};
                    return (
                      <tr key={instructor.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0 flex items-center justify-center text-white font-black text-lg shadow-inner ring-2 ring-white">
                              {getInitials(user.first_name, user.last_name)}
                            </div>
                            <div>
                              <div className="font-black text-slate-800 text-[15px] mb-0.5 group-hover:text-[#1B2A6B] transition-colors">{user.first_name} {user.last_name}</div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                ID: {instructor.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-bold text-slate-700">{user.email}</div>
                          <div className="text-xs font-semibold text-slate-500 mt-1">{user.phone || 'No phone number'}</div>
                        </td>
                        <td className="p-4 text-sm font-semibold text-slate-700 max-w-[200px] truncate" title={instructor.specialization}>
                          {instructor.specialization || 'Not specified'}
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-amber-700">{Number(instructor.average_rating || 0).toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={instructor.approval_status} />
                        </td>
                        <td className="p-4 text-right">
                          <div className="relative inline-block text-left">
                            <button onClick={() => setOpenDropdownId(openDropdownId === instructor.id ? null : instructor.id)} className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none">
                              <MoreVertical size={18}/>
                            </button>
                            
                            {openDropdownId === instructor.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                  <button onClick={() => { setOpenDropdownId(null); setSelectedInstructor(instructor); setIsEditModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><Edit2 size={16} className="text-blue-500"/> Edit Instructor</button>
                                  <button onClick={() => handleResetPassword(user.id)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><Key size={16} className="text-amber-500"/> Reset Password</button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  
                                  {instructor.approval_status === 'pending' && (
                                    <>
                                      <button onClick={() => handleUpdateStatus(instructor.id, 'approved')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5"><CheckCircle size={16} className="text-emerald-500"/> Approve Profile</button>
                                      <button onClick={() => handleUpdateStatus(instructor.id, 'rejected')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2.5"><XCircle size={16} className="text-rose-500"/> Reject Profile</button>
                                    </>
                                  )}

                                  {instructor.approval_status === 'approved' && (
                                    <button onClick={() => handleUpdateStatus(instructor.id, 'suspended')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><ShieldAlert size={16} className="text-orange-500"/> Suspend Instructor</button>
                                  )}

                                  {instructor.approval_status === 'suspended' && (
                                    <button onClick={() => handleUpdateStatus(instructor.id, 'approved')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5"><Power size={16} className="text-emerald-500"/> Reactivate Instructor</button>
                                  )}
                                  
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button onClick={() => handleDelete(user.id)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5"><Trash2 size={16} className="text-red-500"/> Delete Account</button>
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
      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedInstructor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-black text-[#0d1635]">Edit Instructor</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto admin-scrollbar">
                <form id="edit-instructor-form" className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  try {
                    await InstructorService.updateInstructor(selectedInstructor.user_id || selectedInstructor.id, data);
                    toast.success("Instructor updated successfully");
                    setIsEditModalOpen(false);
                    mutate();
                  } catch (err) {
                    toast.error("Failed to update instructor");
                  }
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                      <input name="first_name" defaultValue={selectedInstructor.user?.first_name} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                      <input name="last_name" defaultValue={selectedInstructor.user?.last_name} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                    <input name="designation" defaultValue={selectedInstructor.designation} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                    <input name="company" defaultValue={selectedInstructor.company} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                    <input name="specialization" defaultValue={selectedInstructor.specialization} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹)</label>
                    <input type="number" name="hourly_rate" defaultValue={selectedInstructor.hourly_rate} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" form="edit-instructor-form" className="px-4 py-2 bg-[#1B2A6B] text-white text-sm font-bold rounded-lg hover:bg-[#121c47] transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !isSaving && setIsAddModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-black text-[#0d1635]">Add New Instructor</h3>
                <button disabled={isSaving} onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 disabled:opacity-50"><XCircle size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto admin-scrollbar">
                <form id="add-instructor-form" className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  try {
                    await InstructorService.createInstructor(data);
                    toast.success("Instructor created successfully");
                    setIsAddModalOpen(false);
                    mutate();
                  } catch (err: any) {
                    if (err?.response?.data?.errors) {
                      const firstError = Object.values(err.response.data.errors)[0] as string[];
                      toast.error(firstError[0] || "Validation failed");
                    } else {
                      toast.error(err?.response?.data?.message || "Failed to create instructor");
                    }
                  } finally {
                    setIsSaving(false);
                  }
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input name="first_name" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. John" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                      <input name="last_name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Doe" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. john@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password <span className="text-red-500">*</span></label>
                      <input type="password" name="password" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Must be at least 6 characters" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                      <input name="designation" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                      <input name="company" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Google" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                    <input name="specialization" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Python, Machine Learning" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹)</label>
                    <input type="number" name="hourly_rate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. 500" />
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button disabled={isSaving} onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                <button disabled={isSaving} type="submit" form="add-instructor-form" className="px-4 py-2 bg-[#1B2A6B] text-white text-sm font-bold rounded-lg hover:bg-[#121c47] transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Create Instructor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </AdminDashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colors = 'bg-slate-100 text-slate-600';
  if (status === 'approved') colors = 'bg-emerald-100 text-emerald-700';
  else if (status === 'pending') colors = 'bg-amber-100 text-amber-700';
  else if (status === 'suspended') colors = 'bg-orange-100 text-orange-700';
  else if (status === 'rejected') colors = 'bg-rose-100 text-rose-700';

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${colors}`}>
      {status}
    </span>
  );
}
