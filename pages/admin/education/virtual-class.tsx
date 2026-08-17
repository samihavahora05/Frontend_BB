import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  Plus, Edit2, Trash2, Eye, Download, Search, Filter,
  Video, Calendar, Users, Clock, Globe, Wifi, WifiOff,
  CheckCircle, XCircle, PlayCircle, StopCircle, RefreshCw,
  BookOpen, Link as LinkIcon, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import api from '../../../src/lib/axios';

const fetcher = (url: string) => api.get(url).then(r => r.data);

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  live:       'bg-emerald-100 text-emerald-800',
  completed:  'bg-gray-100 text-gray-700',
  cancelled:  'bg-red-100 text-red-800',
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  zoom:            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Zoom</span>,
  google_meet:     <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Meet</span>,
  microsoft_teams: <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Teams</span>,
  custom:          <span className="text-[10px] font-black text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">Custom</span>,
};

const emptyForm = {
  title: '', description: '', language: 'English',
  duration_minutes: 60, max_students: 100,
  start_datetime: '', platform: 'zoom', status: 'scheduled',
  is_free: true, price: 0,
  join_url: '', meeting_id: '', meeting_password: '',
  instructor_id: '', category_id: '',
};

export default function VirtualClassPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const key = `/admin/virtual-classes?page=${page}&per_page=15${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`;
  const { data, mutate, isLoading } = useSWR(key, fetcher);
  const { data: statsData } = useSWR('/admin/virtual-classes/stats', fetcher);

  const classes = data?.data || [];
  const meta = data?.meta || {};
  const stats = statsData?.data || {};

  const openAdd = () => {
    setForm({ ...emptyForm });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEdit = (c: any) => {
    setForm({
      title: c.title, description: c.description || '',
      language: c.language, duration_minutes: c.duration_minutes,
      max_students: c.max_students,
      start_datetime: c.start_datetime ? new Date(c.start_datetime).toISOString().slice(0, 16) : '',
      platform: c.platform, status: c.status,
      is_free: c.is_free, price: c.price || 0,
      join_url: c.join_url || '', meeting_id: c.meeting_id || '',
      meeting_password: c.meeting_password || '',
      instructor_id: c.instructor_id || '', category_id: c.category_id || '',
    });
    setSelectedClass(c);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openView = (c: any) => {
    setSelectedClass(c);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        await api.post('/admin/virtual-classes', form);
        toast.success('Virtual class created!');
      } else {
        await api.put(`/admin/virtual-classes/${selectedClass.id}`, form);
        toast.success('Virtual class updated!');
      }
      mutate();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this virtual class?')) return;
    try {
      await api.delete(`/admin/virtual-classes/${id}`);
      mutate();
      toast.success('Class deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.put(`/admin/virtual-classes/${id}/status`, { status });
      mutate();
      toast.success(`Class marked as ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/virtual-classes/export', {
        params: { status: statusFilter || undefined },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `virtual_classes_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const StatCard = ({ label, value, color, icon }: any) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <h2 className="text-2xl font-black text-gray-800">{value ?? 0}</h2>
      </div>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <Head><title>Virtual Classes | BlueBoxx DA</title></Head>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <Video size={28} className="text-[#C9A227]" /> Virtual Classes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Schedule and manage live online classes with real-time Zoom integration.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => mutate()} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"><RefreshCw size={16}/></button>
          <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#1B2A6B] text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors">
            <Download size={16}/> Export
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors">
            <Plus size={18}/> Schedule Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} color="bg-blue-50 text-blue-600" icon={<Video size={22}/>} />
        <StatCard label="Scheduled" value={stats.scheduled} color="bg-indigo-50 text-indigo-600" icon={<Calendar size={22}/>} />
        <StatCard label="Live Now" value={stats.live} color="bg-emerald-50 text-emerald-600" icon={<Wifi size={22}/>} />
        <StatCard label="Completed" value={stats.completed} color="bg-gray-50 text-gray-600" icon={<CheckCircle size={22}/>} />
        <StatCard label="Cancelled" value={stats.cancelled} color="bg-red-50 text-red-600" icon={<WifiOff size={22}/>} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              type="text" placeholder="Search classes..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 border-2 border-[#1B2A6B] rounded-full text-sm font-bold text-[#1B2A6B] focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:ring-offset-1 bg-transparent cursor-pointer hover:bg-[#1B2A6B]/5 transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                {['Class', 'Instructor', 'Schedule', 'Enrolled', 'Platform', 'Status', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr><td colSpan={7} className="py-16 text-center text-gray-400">Loading classes...</td></tr>
              )}
              {!isLoading && classes.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-gray-400">No virtual classes found. Schedule your first class!</td></tr>
              )}
              {classes.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1B2A6B] rounded-xl flex items-center justify-center shrink-0">
                        <Video size={16} className="text-white"/>
                      </div>
                      <div>
                        <p className="font-bold text-[#1B2A6B] text-sm line-clamp-1">{c.title}</p>
                        <p className="text-xs text-gray-400">{c.language} • {c.duration_minutes} min</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-gray-700">
                      {c.instructor ? `${c.instructor.first_name} ${c.instructor.last_name}` : '—'}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-bold text-gray-800">
                      {c.start_datetime ? new Date(c.start_datetime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {c.start_datetime ? new Date(c.start_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                      <Users size={14} className="text-gray-400"/>
                      {c.enrolled_count}/{c.max_students}
                    </div>
                  </td>
                  <td className="py-4 px-4">{PLATFORM_ICONS[c.platform] || c.platform}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-black uppercase ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-600'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openView(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View"><Eye size={15}/></button>
                      <button onClick={() => openEdit(c)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Edit"><Edit2 size={15}/></button>
                      {c.status === 'scheduled' && (
                        <button onClick={() => handleStatusChange(c.id, 'live')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Go Live">
                          <PlayCircle size={15}/>
                        </button>
                      )}
                      {c.status === 'live' && (
                        <button onClick={() => handleStatusChange(c.id, 'completed')} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg" title="End Class">
                          <StopCircle size={15}/>
                        </button>
                      )}
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta?.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-semibold">Showing {meta.from}–{meta.to} of {meta.total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs font-bold border rounded-lg disabled:opacity-40 hover:bg-slate-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page} className="px-3 py-1.5 text-xs font-bold border rounded-lg disabled:opacity-40 hover:bg-slate-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-black text-gray-800">
                {modalMode === 'add' ? '📅 Schedule New Class' : modalMode === 'edit' ? '✏️ Edit Class' : '🎥 Class Details'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto admin-scrollbar">
              {modalMode === 'view' && selectedClass ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-[#1B2A6B] rounded-2xl flex items-center justify-center shrink-0">
                      <Video size={24} className="text-white"/>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-[#1B2A6B]">{selectedClass.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{selectedClass.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${STATUS_COLORS[selectedClass.status]}`}>{selectedClass.status}</span>
                        {PLATFORM_ICONS[selectedClass.platform]}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Start Time', value: selectedClass.start_datetime ? new Date(selectedClass.start_datetime).toLocaleString('en-IN') : '—' },
                      { label: 'Duration', value: `${selectedClass.duration_minutes} minutes` },
                      { label: 'Language', value: selectedClass.language },
                      { label: 'Enrolled', value: `${selectedClass.enrolled_count} / ${selectedClass.max_students}` },
                      { label: 'Price', value: selectedClass.is_free ? 'Free' : `₹${selectedClass.price}` },
                      { label: 'Instructor', value: selectedClass.instructor ? `${selectedClass.instructor.first_name} ${selectedClass.instructor.last_name}` : '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                        <p className="text-sm font-bold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  {selectedClass.join_url && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                      <LinkIcon size={20} className="text-blue-600 shrink-0"/>
                      <div>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Join URL</p>
                        <a href={selectedClass.join_url} target="_blank" className="text-sm font-bold text-blue-800 hover:underline break-all">{selectedClass.join_url}</a>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    {selectedClass.status === 'scheduled' && (
                      <button onClick={() => { handleStatusChange(selectedClass.id, 'live'); setIsModalOpen(false); }} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl">
                        <PlayCircle size={16}/> Go Live Now
                      </button>
                    )}
                    {selectedClass.status === 'live' && (
                      <button onClick={() => { handleStatusChange(selectedClass.id, 'completed'); setIsModalOpen(false); }} className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl">
                        <StopCircle size={16}/> End Class
                      </button>
                    )}
                    <button onClick={() => { openEdit(selectedClass); }} className="flex-1 flex items-center justify-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white font-bold py-2.5 rounded-xl">
                      <Edit2 size={16}/> Edit
                    </button>
                  </div>
                </div>
              ) : (
                <form id="class-form" onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Class Title *</label>
                      <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                        placeholder="e.g. Advanced React Hooks Masterclass"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Description</label>
                      <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"/>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Start Date & Time *</label>
                      <input required type="datetime-local" value={form.start_datetime} onChange={e => setForm({...form, start_datetime: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Duration (minutes) *</label>
                      <input required type="number" min={15} max={480} value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: Number(e.target.value)})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Max Students *</label>
                      <input required type="number" min={1} value={form.max_students} onChange={e => setForm({...form, max_students: Number(e.target.value)})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Language *</label>
                      <select value={form.language} onChange={e => setForm({...form, language: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none">
                        {['English', 'Hindi', 'Gujarati', 'Tamil', 'Telugu', 'Marathi'].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Platform *</label>
                      <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none">
                        <option value="zoom">Zoom</option>
                        <option value="google_meet">Google Meet</option>
                        <option value="microsoft_teams">Microsoft Teams</option>
                        <option value="custom">Custom Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Status</label>
                      <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none">
                        <option value="scheduled">Scheduled</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Meeting ID</label>
                      <input type="text" value={form.meeting_id} onChange={e => setForm({...form, meeting_id: e.target.value})}
                        placeholder="Zoom/Meet meeting ID"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Meeting Password</label>
                      <input type="text" value={form.meeting_password} onChange={e => setForm({...form, meeting_password: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Join URL</label>
                      <input type="url" value={form.join_url} onChange={e => setForm({...form, join_url: e.target.value})}
                        placeholder="https://zoom.us/j/..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <input type="checkbox" id="is_free" checked={form.is_free} onChange={e => setForm({...form, is_free: e.target.checked})}
                        className="w-4 h-4 text-[#1B2A6B]"/>
                      <label htmlFor="is_free" className="text-sm font-bold text-gray-700">Free Class</label>
                    </div>
                    {!form.is_free && (
                      <div>
                        <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1">Price (₹)</label>
                        <input type="number" min={0} value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>

            {modalMode !== 'view' && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" form="class-form" disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-black bg-[#1B2A6B] hover:bg-[#121c47] text-white rounded-xl shadow-md disabled:opacity-70">
                  {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                  {modalMode === 'add' ? 'Schedule Class' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
