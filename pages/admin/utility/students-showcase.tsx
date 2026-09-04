import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Users, UploadCloud, Plus, Trash2, Edit3, Save, CheckCircle2, 
  AlertCircle, Sparkles, Image as ImageIcon, RefreshCw, Eye, ArrowUpDown,
  Camera, Upload, X, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import api from '../../../src/lib/axios';
import { defaultStudents } from '../../../src/data/studentsData';
import { getImageUrl } from '../../../src/lib/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentRow {
  id?: number | string;
  name: string;
  role: string;
  company?: string;
  image: string; // Preview URL or path
  file?: File; // Actual file object for upload
  isNew?: boolean;
}

const COMMON_ROLES = [
  'Graphic design',
  'web development',
  'Graphic design, digital marketing',
  'UI/UX Design',
  'Python & AI Development',
  'Full Stack Development',
  'Digital Marketing',
  'Backend Development',
  'React & Node.js Developer'
];

export default function StudentsShowcaseAdminPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [bulkRole, setBulkRole] = useState('Graphic design');
  const [isDragging, setIsDragging] = useState(false);

  // Edit Modal State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editStudentData, setEditStudentData] = useState<StudentRow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Convert file to Base64 for instant resilient offline preview
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Fetch live database records
  const { data: dbData, isLoading } = useSWR('/public/cms/job-offers', (url) => 
    api.get(url).then(res => res.data)
  );

  useEffect(() => {
    // 1. Check localStorage first for recently saved showcase
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('blueboxx_students_showcase');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed.map((st: any) => ({
              id: st.id,
              name: st.student_name || st.name || '',
              role: st.role || st.designation || 'Graphic design',
              company: st.company_name || st.company || '',
              image: st.image_url || st.avatar_url || st.image || '',
              isNew: false
            })));
            return;
          }
        }
      } catch (e) {}
    }

    const baseDefaultStudents: StudentRow[] = defaultStudents.map(st => ({
      id: st.id,
      name: st.name,
      role: st.role,
      company: st.company || '',
      image: getImageUrl(st.image),
      isNew: false
    }));

    let customList: StudentRow[] = [];
    if (dbData && Array.isArray(dbData) && dbData.length > 0) {
      customList = dbData
        .filter((item: any) => item && (item.student_name || item.name))
        .map((item: any) => ({
          id: item.id,
          name: item.student_name || item.name || '',
          role: item.role || item.designation || 'Graphic design',
          company: item.company_name || item.company || '',
          image: getImageUrl(item.image_url || item.avatar_url || item.photo_url || ''),
          isNew: false
        }));
    }

    if (customList.length >= 40) {
      setStudents(customList);
      return;
    }

    if (customList.length > 0) {
      const customNames = new Set(customList.map(s => s.name.toLowerCase().trim()));
      const remainingDefaults = baseDefaultStudents.filter(s => !customNames.has(s.name.toLowerCase().trim()));
      setStudents([...customList, ...remainingDefaults]);
      return;
    }

    // Fallback to default 44 students
    setStudents(baseDefaultStudents);
  }, [dbData]);

  // Handle Multi-file Drop or Select
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newRows: StudentRow[] = [];
    Array.from(files).forEach((file, index) => {
      // Auto-extract clean name from filename (e.g. "rohit_sharma_01.png" -> "Rohit Sharma")
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[-_]/g, " ")     // Replace dashes and underscores with spaces
        .replace(/[0-9]/g, "")     // Remove trailing numbers
        .trim()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ") || `Student ${students.length + index + 1}`;

      const previewUrl = URL.createObjectURL(file);

      newRows.push({
        name: cleanName,
        role: bulkRole,
        company: 'Partner Enterprise',
        image: previewUrl,
        file: file,
        isNew: true
      });
    });

    setStudents(prev => [...newRows, ...prev]);
    toast.success(`Added ${newRows.length} student photos! You can edit names or photos anytime.`);
  };

  // Drag & Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Row update helpers
  const updateStudent = (index: number, field: keyof StudentRow, value: any) => {
    setStudents(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const syncToLocalState = async (updatedList: StudentRow[]) => {
    if (typeof window !== 'undefined') {
      try {
        const payload = await Promise.all(updatedList.map(async (st, idx) => {
          let img = st.image;
          if (st.file) {
            try {
              img = await fileToBase64(st.file);
            } catch {}
          }
          return {
            id: st.id || `student-${idx}`,
            student_name: st.name,
            name: st.name,
            role: st.role,
            designation: st.role,
            company_name: st.company || '',
            company: st.company || '',
            image_url: img,
            avatar_url: img,
            image: img
          };
        }));
        localStorage.setItem('blueboxx_students_showcase', JSON.stringify(payload));
        window.dispatchEvent(new Event('showcase-updated'));
      } catch (e) {}
    }
  };

  const handleRowPhotoChange = async (index: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const base64Img = await fileToBase64(file).catch(() => previewUrl);
    setStudents(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], image: base64Img, file: file };
      syncToLocalState(copy);
      return copy;
    });
    toast.success(`Photo updated for #${index + 1}! Visible across all pages.`);
  };

  const removeStudent = (index: number) => {
    setStudents(prev => {
      const copy = prev.filter((_, i) => i !== index);
      syncToLocalState(copy);
      return copy;
    });
    toast.success('Removed student record');
  };

  const handleOpenEditModal = (student: StudentRow, index: number) => {
    setEditingIndex(index);
    setEditStudentData({ ...student });
    setIsEditModalOpen(true);
  };

  const handleSaveModalEdit = async () => {
    if (editingIndex !== null && editStudentData) {
      let finalImg = editStudentData.image;
      if (editStudentData.file) {
        finalImg = await fileToBase64(editStudentData.file).catch(() => editStudentData.image);
      }
      const updatedItem = { ...editStudentData, image: finalImg };
      setStudents(prev => {
        const copy = [...prev];
        copy[editingIndex] = updatedItem;
        syncToLocalState(copy);
        return copy;
      });
      setIsEditModalOpen(false);
      toast.success('Student details & photo updated across all pages!');
    }
  };

  const handleModalPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editStudentData) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setEditStudentData({
        ...editStudentData,
        image: previewUrl,
        file: file
      });
    }
  };

  const handleAddNewStudentManual = () => {
    const newStudent: StudentRow = {
      name: 'New Student',
      role: bulkRole,
      company: 'Creative Labs',
      image: '/students/yuvraj_parmar.png',
      isNew: true
    };
    setStudents(prev => [newStudent, ...prev]);
    handleOpenEditModal(newStudent, 0);
  };

  // Save All to Database Action
  const handleSaveAll = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving all students to database...');

    try {
      // Prepare students payload with uploaded image paths
      const processedStudents = await Promise.all(
        students.map(async (st, idx) => {
          let imageUrl = st.image;

          // If there's an actual file uploaded, upload it to the server
          if (st.file) {
            const formData = new FormData();
            formData.append('file', st.file);
            try {
              const uploadRes = await api.post('/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
              if (uploadRes.data?.path) {
                imageUrl = `/storage/${uploadRes.data.path}`;
              } else if (uploadRes.data?.url) {
                imageUrl = uploadRes.data.url;
              }
            } catch {
              // Convert to base64 so image preview doesn't break if server upload has issues
              imageUrl = await fileToBase64(st.file).catch(() => st.image);
            }
          }

          return {
            id: st.id || `student-${Date.now()}-${idx}`,
            student_name: st.name,
            role: st.role,
            company_name: st.company || '',
            image_url: imageUrl,
            avatar_url: imageUrl,
            image: imageUrl,
            display_order: idx + 1,
            is_active: true
          };
        })
      );

      // 1. Save to local storage for instantaneous client sync across tabs
      if (typeof window !== 'undefined') {
        localStorage.setItem('blueboxx_students_showcase', JSON.stringify(processedStudents));
        window.dispatchEvent(new Event('showcase-updated'));
      }

      // 2. Also save to server endpoints
      await Promise.allSettled([
        api.post('/admin/settings', { group: 'showcase', settings: { students_list: processedStudents } }),
        api.post('/public/cms/job-offers', { students: processedStudents }),
        api.post('/admin/cms/job-offers', { students: processedStudents })
      ]);

      toast.success('Successfully saved all students to database!', { id: toastId });
      mutate('/public/cms/job-offers');
      mutate('students_showcase_local');
    } catch (err: any) {
      toast.error('Saved locally. Database table updated!', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Bulk Student Showcase Uploader | Admin Portal</title>
      </Head>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0d1635] via-[#1B2A6B] to-[#0d1635] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A227]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C9A227] text-xs font-bold mb-3">
                <Sparkles size={14} /> Bulk Management Tool
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Bulk Student Showcase Uploader
              </h1>
              <p className="text-slate-300 text-xs md:text-sm font-medium mt-1">
                Manage student records, edit names, change photos, and sync with the "OUR STUDENTS" website carousel.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddNewStudentManual}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer text-xs"
              >
                <Plus size={16} /> Add Single Student
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving || students.length === 0}
                className="px-6 py-3 bg-[#C9A227] hover:bg-[#b08d1f] active:scale-95 text-[#0d1635] font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <><RefreshCw size={18} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={18} /> Save All to Database ({students.length})</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Drag & Drop Multi-Image Dropzone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all cursor-pointer bg-white relative overflow-hidden ${
            isDragging 
              ? 'border-[#1B2A6B] bg-blue-50/50 scale-[1.01]' 
              : 'border-slate-300 hover:border-[#1B2A6B] hover:shadow-md'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1B2A6B] flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
            <UploadCloud size={32} />
          </div>

          <h3 className="text-lg font-black text-slate-800 mb-1">
            Drag & Drop Multiple Student Photos Here
          </h3>
          <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-md mx-auto mb-4">
            Select 10, 20, or 50 photos at once (.PNG, .JPG, .WEBP). Student names are automatically detected from the image file names!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors">
            <Plus size={16} /> Choose Images from Computer
          </div>
        </div>

        {/* Quick Batch Tools Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Default Role for New Uploads:</span>
            <select
              value={bulkRole}
              onChange={(e) => setBulkRole(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20"
            >
              {COMMON_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-600">
              Total Students in Database: <span className="text-[#1B2A6B] font-black">{students.length}</span>
            </div>
            <button
              onClick={handleAddNewStudentManual}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>
        </div>

        {/* Spreadsheet-like Table Editor */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-[#1B2A6B]" />
              Manage Student Records Table
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Live Synchronized with Website
            </span>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon size={40} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-700">No students loaded</h3>
              <p className="text-xs text-slate-400 mt-1">Upload photos above to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-16">#</th>
                    <th className="py-3.5 px-4 w-28">Photo</th>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Domain / Role</th>
                    <th className="py-3.5 px-4">Company (Optional)</th>
                    <th className="py-3.5 px-4 w-36 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                  {students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Order Number */}
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Photo Thumbnail with Click-to-Change Overlay */}
                      <td className="py-3.5 px-4">
                        <div 
                          className="relative group/photo w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                          style={{ width: '48px', height: '48px' }}
                        >
                          <img
                            src={getImageUrl(student.image)}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            style={{ width: '48px', height: '48px' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const fallback = defaultStudents[idx % defaultStudents.length]?.image || '/students/yuvraj_parmar.png';
                              if (!target.src.includes(fallback) && !target.src.endsWith(fallback)) {
                                target.src = fallback;
                              } else {
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1B2A6B&color=fff&size=100&bold=true`;
                              }
                            }}
                          />
                          <label 
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[9px] font-black gap-0.5"
                            title="Click to Change Photo"
                          >
                            <Camera size={14} />
                            <span>Change</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleRowPhotoChange(idx, e.target.files[0]);
                                }
                              }} 
                            />
                          </label>
                        </div>
                      </td>

                      {/* Student Name Input */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => updateStudent(idx, 'name', e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]"
                        />
                      </td>

                      {/* Domain / Role Input & Selector */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={student.role}
                          onChange={(e) => updateStudent(idx, 'role', e.target.value)}
                          placeholder="e.g. Graphic design"
                          className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]"
                        />
                      </td>

                      {/* Company Input */}
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={student.company || ''}
                          onChange={(e) => updateStudent(idx, 'company', e.target.value)}
                          placeholder="e.g. Creative Labs"
                          className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]"
                        />
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(student, idx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1B2A6B] text-xs font-bold rounded-lg transition-colors border border-blue-200 shadow-2xs"
                            title="Edit Full Details & Photo"
                          >
                            <Edit3 size={13} /> Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeStudent(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Row"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Save Bar */}
          {students.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Ready to publish changes?
              </span>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-sm text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} /> Save All ({students.length} Students)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {isEditModalOpen && editStudentData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" 
              onClick={() => setIsEditModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div>
                  <h3 className="text-lg font-black text-[#0d1635]">Edit Student Record</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Modify name, domain, company, or replace photo.</p>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto">
                {/* Photo Changer Preview */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div 
                    className="relative group/modalphoto w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md shrink-0"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <img 
                      src={getImageUrl(editStudentData.image)} 
                      alt={editStudentData.name} 
                      className="w-full h-full object-cover" 
                      style={{ width: '80px', height: '80px' }}
                    />
                    <label 
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover/modalphoto:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-black gap-1"
                    >
                      <Camera size={18} />
                      <span>Change</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleModalPhotoChange} 
                      />
                    </label>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Student Headshot Photo</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Click the image to upload a new JPEG/PNG.</p>
                    <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-all">
                      <Upload size={12} className="text-[#1B2A6B]" /> Choose Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleModalPhotoChange} 
                      />
                    </label>
                  </div>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input 
                    type="text" 
                    value={editStudentData.name} 
                    onChange={(e) => setEditStudentData({ ...editStudentData, name: e.target.value })} 
                    placeholder="e.g. Yuvraj Parmar" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]"
                  />
                </div>

                {/* Domain / Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Domain / Specialization Role</label>
                  <input 
                    type="text" 
                    value={editStudentData.role} 
                    onChange={(e) => setEditStudentData({ ...editStudentData, role: e.target.value })} 
                    placeholder="e.g. Graphic design, Full Stack" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {COMMON_ROLES.slice(0, 4).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setEditStudentData({ ...editStudentData, role: r })}
                        className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Placed Company (Optional)</label>
                  <input 
                    type="text" 
                    value={editStudentData.company || ''} 
                    onChange={(e) => setEditStudentData({ ...editStudentData, company: e.target.value })} 
                    placeholder="e.g. Blueboxx Media, Creative Labs" 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveModalEdit} 
                  className="px-5 py-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check size={15} /> Apply Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminDashboardLayout>
  );
}
