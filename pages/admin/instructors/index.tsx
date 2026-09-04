import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { GraduationCap, Search, Download, Plus, MoreVertical, Edit2, Trash2, Key, Upload, RefreshCw, Star, CheckCircle, XCircle, Camera, Building2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../src/context/ConfirmContext';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpertService, ExpertData } from '../../../src/lib/api/ExpertService';
import { getImageUrl } from '../../../src/lib/imageUtils';

export default function InstructorsManager() {
  const router = useRouter();
  const confirmAction = useConfirm();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<ExpertData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Avatar Upload States
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [addAvatarPreview, setAddAvatarPreview] = useState<string | null>(null);
  const [addAvatarFile, setAddAvatarFile] = useState<File | null>(null);

  // Experts list
  const [expertsList, setExpertsList] = useState<ExpertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadExperts = async () => {
    setIsLoading(true);
    try {
      const data = await ExpertService.getAll();
      setExpertsList(data);
    } catch {
      const fresh = await ExpertService.getAll(); setExpertsList(fresh);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExperts();

    const handleSync = () => {
      loadExperts();
    };
    window.addEventListener('bb_experts_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('bb_experts_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEditAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditAvatarFile(file);
      try {
        const base64 = await fileToBase64(file);
        setEditAvatarPreview(base64);
      } catch (err) {
        setEditAvatarPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleAddAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAddAvatarFile(file);
      try {
        const base64 = await fileToBase64(file);
        setAddAvatarPreview(base64);
      } catch (err) {
        setAddAvatarPreview(URL.createObjectURL(file));
      }
    }
  };

  const getInitials = (name?: string) => {
    const displayName = (name || 'Expert').trim();
    const parts = displayName.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  };

  const handleOpenEditModal = (instructor: ExpertData) => {
    setSelectedInstructor(instructor);
    setEditAvatarFile(null);
    setEditAvatarPreview(getImageUrl(instructor.avatar || instructor.profile_photo));
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async (id: string | number) => {
    if (await confirmAction({ title: "Delete Expert", description: "Are you sure you want to permanently delete this expert from the platform?", isDestructive: true })) {
      try {
        setExpertsList((prev) => prev.filter((e) => String(e.id) !== String(id) && String(e.user_id) !== String(id)));
        await ExpertService.deleteExpert(id);
        toast.success("Expert deleted successfully!");
        const fresh = await ExpertService.getAll();
        setExpertsList(fresh);
      } catch (e: any) {
        toast.error("Failed to delete expert.");
        loadExperts();
      }
    }
    setOpenDropdownId(null);
  };

  const filteredExperts = expertsList.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.company.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.specialization.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredExperts.length / perPage) || 1;
  const paginatedExperts = filteredExperts.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Expert Management | BlueBoxx DA</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <GraduationCap size={28} className="text-[#C9A227]" /> Expert Management
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage verified industry experts, profile details, photos, and 1:1 rates.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={loadExperts} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors" title="Refresh List">
              <RefreshCw size={16} />
            </button>
            <button onClick={() => { setAddAvatarPreview(null); setIsAddModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-black rounded-xl shadow-md transition-colors">
              <Plus size={18} /> Add Expert
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[550px]">
          {/* Search Header (No Status Tabs) */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/80">
            <div className="text-sm font-bold text-slate-700">
              Total Verified Experts: <span className="text-[#1B2A6B] font-black">{filteredExperts.length}</span>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }} 
                placeholder="Search by name, role, company..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B] transition-all" 
              />
            </div>
          </div>

          {/* Table Area (No Status Column) */}
          <div className="overflow-x-auto admin-scrollbar flex-1 relative">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-4">Expert Details</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4 text-center">Hourly Rate</th>
                  <th className="p-4 text-center">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4 flex gap-3"><div className="w-12 h-12 bg-slate-200 rounded-full"></div><div><div className="w-32 h-4 bg-slate-200 rounded mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded"></div></div></td>
                      <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
                      <td className="p-4"><div className="w-16 h-4 bg-slate-200 rounded mx-auto"></div></td>
                      <td className="p-4"><div className="w-12 h-4 bg-slate-200 rounded mx-auto"></div></td>
                      <td className="p-4"><div className="w-8 h-8 bg-slate-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : paginatedExperts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <GraduationCap size={32}/>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">No experts found</h3>
                      <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">Add a new expert using the button above.</p>
                      <button onClick={() => { setAddAvatarPreview(null); setIsAddModalOpen(true); }} className="mt-6 px-6 py-2.5 bg-[#1B2A6B] text-white rounded-xl font-bold shadow-md hover:bg-[#121c47] transition-all">Add Expert</button>
                    </td>
                  </tr>
                ) : (
                  paginatedExperts.map((instructor) => {
                    const avatarUrl = getImageUrl(instructor.avatar || instructor.profile_photo);

                    return (
                      <tr key={instructor.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full shrink-0 overflow-hidden ring-2 ring-slate-100 shadow-sm bg-gradient-to-br from-indigo-500 to-[#1B2A6B] flex items-center justify-center text-white font-black text-sm">
                              {avatarUrl ? (
                                <img 
                                  src={getImageUrl(avatarUrl)} 
                                  alt={instructor.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <span>{getInitials(instructor.name)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-black text-slate-800 text-[15px] mb-0.5 group-hover:text-[#1B2A6B] transition-colors">{instructor.name}</div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <span>ID: {instructor.id}</span>
                                {instructor.designation && <span>• {instructor.designation}</span>}
                                {instructor.company && (
                                  <span className="text-[#1B2A6B] font-extrabold lowercase">({instructor.company})</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-bold text-slate-700">{instructor.email}</div>
                          <div className="text-xs font-semibold text-slate-500 mt-0.5">{instructor.phone || "No phone number"}</div>
                        </td>
                        <td className="p-4 text-sm font-semibold text-slate-700 max-w-[200px] truncate" title={instructor.specialization}>
                          {instructor.specialization || "Career & Technical Mentorship"}
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded-lg border border-emerald-100">
                            ₹{Number(instructor.hourly_rate || 500).toLocaleString("en-IN")}/hr
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-amber-700">{Number(instructor.average_rating || 5.0).toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Direct Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(instructor)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1B2A6B] text-xs font-bold rounded-lg transition-colors border border-blue-200 shadow-2xs"
                              title="Edit Expert"
                            >
                              <Edit2 size={13} /> Edit
                            </button>

                            {/* Dropdown Menu */}
                            <div className="relative inline-block text-left">
                              <button onClick={() => setOpenDropdownId(openDropdownId === instructor.id ? null : instructor.id)} className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors">
                                <MoreVertical size={18}/>
                              </button>
                              {openDropdownId === instructor.id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                                  <button onClick={() => handleOpenEditModal(instructor)} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Edit2 size={14}/> Edit Profile
                                  </button>
                                  <div className="my-1 border-t border-slate-100"></div>
                                  <button onClick={() => handleDelete(instructor.id)} className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 size={14}/> Delete Expert
                                  </button>
                                </div>
                              )}
                            </div>
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
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="text-xs font-bold text-slate-500">Page {page} of {totalPages}</div>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-slate-100">Previous</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-slate-100">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Expert Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedInstructor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !isSaving && setIsEditModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-black text-[#0d1635]">Edit Expert Profile</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Update photo, company, rate, and details.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto admin-scrollbar">
                <form id="edit-instructor-form" className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  const formData = new FormData(e.currentTarget);
                  const firstName = ((formData.get('first_name') as string) || '').trim();
                  const lastName = ((formData.get('last_name') as string) || '').trim();
                  const email = ((formData.get('email') as string) || '').trim();
                  const phone = ((formData.get('phone') as string) || '').trim();
                  const designation = ((formData.get('designation') as string) || '').trim();
                  const company = ((formData.get('company') as string) || '').trim();
                  const specialization = ((formData.get('specialization') as string) || '').trim();
                  const hourlyRate = Number(formData.get('hourly_rate')) || 500;

                  try {
                    await ExpertService.updateExpert(selectedInstructor.id, {
                      first_name: firstName,
                      last_name: lastName,
                      email,
                      phone,
                      designation,
                      company,
                      specialization,
                      hourly_rate: hourlyRate,
                      avatar: editAvatarPreview || selectedInstructor.avatar,
                      avatarFile: editAvatarFile,
                    });
                    toast.success("Expert updated successfully!");
                    setIsEditModalOpen(false);
                    await loadExperts();
                  } catch (err: any) {
                    toast.error(err?.message || "Failed to update expert");
                  } finally {
                    setIsSaving(false);
                  }
                }}>
                  {/* Photo Upload & Preview Section */}
                  <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-2">
                    <div className="relative group w-20 h-20 shrink-0">
                      {editAvatarPreview ? (
                        <img src={getImageUrl(editAvatarPreview)} alt="Expert photo" className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500 shadow-md" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-[#1B2A6B] flex items-center justify-center text-white font-black text-xl shadow-md ring-2 ring-indigo-500">
                          {getInitials(selectedInstructor.name)}
                        </div>
                      )}
                      <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-bold gap-1 backdrop-blur-2xs">
                        <Camera size={18} />
                        <span>Change</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleEditAvatarChange} />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Expert Photo</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Upload a clean headshot (JPEG, PNG, or WebP).</p>
                      <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-all">
                        <Upload size={13} className="text-[#1B2A6B]" /> Upload New Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleEditAvatarChange} />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input name="first_name" required defaultValue={selectedInstructor.first_name || selectedInstructor.name.split(' ')[0]} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                      <input name="last_name" defaultValue={selectedInstructor.last_name || selectedInstructor.name.split(' ').slice(1).join(' ')} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" required defaultValue={selectedInstructor.email} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                      <input name="phone" defaultValue={selectedInstructor.phone} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Designation <span className="text-red-500">*</span></label>
                      <input name="designation" required defaultValue={selectedInstructor.designation} placeholder="e.g. Senior AI Specialist" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company <span className="text-red-500">*</span></label>
                      <input name="company" required defaultValue={selectedInstructor.company} placeholder="e.g. Google, Microsoft" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Expertise</label>
                    <input name="specialization" defaultValue={selectedInstructor.specialization} placeholder="e.g. Artificial Intelligence, Machine Learning & GenAI" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹) <span className="text-red-500">*</span></label>
                    <input type="number" name="hourly_rate" required defaultValue={selectedInstructor.hourly_rate} placeholder="e.g. 1500" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button disabled={isSaving} onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button disabled={isSaving} type="submit" form="edit-instructor-form" className="px-4 py-2 bg-[#1B2A6B] text-white text-sm font-bold rounded-lg hover:bg-[#121c47] transition-colors flex items-center gap-2">
                  {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save Changes
                </button>
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
                <div>
                  <h3 className="text-xl font-black text-[#0d1635]">Add New Expert</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Fill in details and upload photo to feature on the platform.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto admin-scrollbar">
                <form id="add-instructor-form" className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  const formData = new FormData(e.currentTarget);
                  const firstName = ((formData.get('first_name') as string) || '').trim();
                  const lastName = ((formData.get('last_name') as string) || '').trim();
                  const email = ((formData.get('email') as string) || '').trim();
                  const password = ((formData.get('password') as string) || 'Password@123').trim();
                  const phone = ((formData.get('phone') as string) || '').trim();
                  const designation = ((formData.get('designation') as string) || '').trim();
                  const company = ((formData.get('company') as string) || '').trim();
                  const specialization = ((formData.get('specialization') as string) || '').trim();
                  const hourlyRate = Number(formData.get('hourly_rate')) || 500;

                  try {
                    await ExpertService.createExpert({
                      first_name: firstName,
                      last_name: lastName,
                      email,
                      password,
                      phone,
                      designation,
                      company,
                      specialization,
                      hourly_rate: hourlyRate,
                      avatar: addAvatarPreview || '',
                      avatarFile: addAvatarFile,
                    });
                    toast.success("Expert created successfully!");
                    setIsAddModalOpen(false);
                    await loadExperts();
                  } catch (err: any) {
                    toast.error(err?.message || "Failed to create expert");
                  } finally {
                    setIsSaving(false);
                  }
                }}>
                  {/* Photo Upload & Preview Section */}
                  <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-2">
                    <div className="relative group w-20 h-20 shrink-0">
                      {addAvatarPreview ? (
                        <img src={getImageUrl(addAvatarPreview)} alt="Preview" className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500 shadow-md" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                          <Camera size={26} />
                        </div>
                      )}
                      <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-bold gap-1 backdrop-blur-2xs">
                        <Camera size={18} />
                        <span>Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAddAvatarChange} />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Expert Photo</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Upload a clean headshot (JPEG, PNG, or WebP).</p>
                      <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-all">
                        <Upload size={13} className="text-[#1B2A6B]" /> Choose Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleAddAvatarChange} />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input name="first_name" required placeholder="e.g. Priya" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                      <input name="last_name" placeholder="e.g. Mehta" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" required placeholder="priya.mehta@blueboxx.in" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                      <input type="password" name="password" required defaultValue="Password@123" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Designation <span className="text-red-500">*</span></label>
                      <input name="designation" required placeholder="e.g. Senior AI Specialist" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company <span className="text-red-500">*</span></label>
                      <input name="company" required placeholder="e.g. Google, Microsoft" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                      <input name="phone" placeholder="+91 98765 43210" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹) <span className="text-red-500">*</span></label>
                      <input type="number" name="hourly_rate" required defaultValue="1500" placeholder="e.g. 1500" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Expertise</label>
                    <input name="specialization" placeholder="e.g. Artificial Intelligence, Machine Learning & GenAI" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button disabled={isSaving} onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button disabled={isSaving} type="submit" form="add-instructor-form" className="px-4 py-2 bg-[#1B2A6B] text-white text-sm font-bold rounded-lg hover:bg-[#121c47] transition-colors flex items-center gap-2">
                  {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Create Expert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminDashboardLayout>
  );
}
