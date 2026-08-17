import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Building, Search, Plus, ShieldCheck, X, Check, ShieldAlert, Trash2, Edit, MonitorPlay, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import { MediaUploader } from "../../../src/components/ui/MediaUploader";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";
import useSWR from "swr";
import { fetcher } from "../../../src/lib/fetcher"; 
import api from "../../../src/lib/axios";

export default function AdminCollegesPage() {
  const { data: collegesData, mutate: mutateColleges } = useSWR("/admin/cms/colleges", fetcher);
  const colleges = collegesData || [];
  
  const confirmAction = useConfirm();

  // Search and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredColleges = colleges.filter((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
  const paginatedColleges = filteredColleges.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialFormState = {
    name: "",
    slug: "",
    logo_url: "",
    banner_image: "",
    location: "",
    short_description: "",
    full_description: "",
    website_url: "",
    is_ugc_approved: false,
    naac_grade: "",
    nirf_ranking: "",
    is_wes_approved: false,
    degree_types: "", // comma separated
    popular_courses: "", // comma separated
    duration: "",
    eligibility: "",
    admission_process: "",
    placement_support: "",
    career_services: "",
    accreditation: "",
    is_featured: false,
    status: "published",
    seo_title: "",
    seo_description: "",
    meta_keywords: "",
  };

  const [form, setForm] = useState(initialFormState);

  const handleDelete = async (id: number) => {
    if (await confirmAction({ title: "Delete College", description: "Are you sure you want to delete this college?", isDestructive: true })) {
      try {
        await api.delete(`/admin/cms/colleges/${id}`);
        mutateColleges();
        toast.success("College deleted");
      } catch (err) {
        toast.error("Failed to delete college");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name) {
      const payload = {
        ...form,
        degree_types: form.degree_types ? form.degree_types.split(",").map(t => t.trim()) : [],
        popular_courses: form.popular_courses ? form.popular_courses.split(",").map(t => t.trim()) : []
      };

      try {
        if (editingId) {
          await api.put(`/admin/cms/colleges/${editingId}`, payload);
          toast.success("College updated successfully!");
        } else {
          await api.post("/admin/cms/colleges", payload);
          toast.success("College added successfully!");
        }
        mutateColleges();
        setForm(initialFormState);
        setIsModalOpen(false);
        setEditingId(null);
      } catch (err) {
        toast.error("Failed to save college");
      }
    }
  };

  const openEditModal = (college: any) => {
    setEditingId(college.id);
    setForm({
      name: college.name || "",
      slug: college.slug || "",
      logo_url: college.logo_url || "",
      banner_image: college.banner_image || "",
      location: college.location || "",
      short_description: college.short_description || "",
      full_description: college.full_description || "",
      website_url: college.website_url || "",
      is_ugc_approved: college.is_ugc_approved || false,
      naac_grade: college.naac_grade || "",
      nirf_ranking: college.nirf_ranking || "",
      is_wes_approved: college.is_wes_approved || false,
      degree_types: Array.isArray(college.degree_types) ? college.degree_types.join(", ") : "",
      popular_courses: Array.isArray(college.popular_courses) ? college.popular_courses.join(", ") : "",
      duration: college.duration || "",
      eligibility: college.eligibility || "",
      admission_process: college.admission_process || "",
      placement_support: college.placement_support || "",
      career_services: college.career_services || "",
      accreditation: college.accreditation || "",
      is_featured: college.is_featured || false,
      status: college.status || "published",
      seo_title: college.seo_title || "",
      seo_description: college.seo_description || "",
      meta_keywords: college.meta_keywords || "",
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published": return <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold">Published</Badge>;
      case "draft": return <Badge className="bg-amber-50 text-amber-700 border-none font-bold">Draft</Badge>;
      case "archived": return <Badge className="bg-rose-50 text-rose-700 border-none font-bold">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Online Universities</h1>
          <p className="text-slate-500 font-medium text-sm">Manage online university partners, their courses, and approvals.</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={() => { setEditingId(null); setForm(initialFormState); setIsModalOpen(true); }}
              className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add University
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible flex flex-col min-h-[400px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search universities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
            />
          </div>
        </div>

        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">University Info</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Approvals</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedColleges.map((college: any) => (
                <tr key={college.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1.5 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        {college.logo_url ? <img src={college.logo_url} alt={college.name} className="w-full h-full object-contain" /> : <Building className="text-slate-300" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{college.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{college.location || "Online"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 font-semibold space-y-1">
                    {college.is_ugc_approved ? <span className="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded mr-1">UGC</span> : null}
                    {college.is_wes_approved ? <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded mr-1">WES</span> : null}
                    {college.naac_grade ? <span className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded">NAAC {college.naac_grade}</span> : null}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(college.status)}
                    {college.is_featured && <Badge className="ml-2 bg-yellow-50 text-yellow-700 border-none font-bold">Featured</Badge>}
                  </td>
                  <td className="py-4 px-6 text-right relative overflow-visible">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(college)}
                        className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(college.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedColleges.length === 0 && (
                  <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">No universities found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 mt-auto">
            <span className="text-sm text-slate-500 font-medium">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredColleges.length)} of {filteredColleges.length}
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors text-sm font-bold"
              >
                Prev
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors text-sm font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-5xl shadow-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                 <h2 className="text-xl font-black text-slate-800">{editingId ? "Edit University" : "Add Online University"}</h2>
                 <p className="text-xs font-semibold text-slate-500 mt-1">Fill out the comprehensive details for the university partner.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
               <form id="university-form" onSubmit={handleSave} className="space-y-8">
                  {/* Basic Details */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Basic Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">University Name *</label>
                            <input 
                            type="text" required placeholder="e.g. Lovely Professional University"
                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location / Origin</label>
                            <input 
                            type="text" placeholder="e.g. Punjab, India"
                            value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                            <input 
                            type="url" placeholder="e.g. https://lpuonline.com"
                            value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                            <select
                            value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <MediaUploader label="Logo URL" accept="image/*" value={form.logo_url} onUploadSuccess={(url) => setForm({ ...form, logo_url: url })} />
                         <MediaUploader label="Banner Image URL" accept="image/*" value={form.banner_image} onUploadSuccess={(url) => setForm({ ...form, banner_image: url })} />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={(e) => setForm({...form, is_featured: e.target.checked})} className="rounded text-[#1B2A6B] focus:ring-[#1B2A6B] w-4 h-4"/>
                        <label htmlFor="is_featured" className="text-sm font-semibold text-slate-700">Mark as Featured University</label>
                      </div>
                  </div>

                  {/* Approvals & Accreditations */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Approvals & Rankings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 mt-8">
                            <input type="checkbox" id="is_ugc" checked={form.is_ugc_approved} onChange={(e) => setForm({...form, is_ugc_approved: e.target.checked})} className="rounded text-[#1B2A6B] focus:ring-[#1B2A6B] w-4 h-4"/>
                            <label htmlFor="is_ugc" className="text-sm font-bold text-slate-700">UGC Approved</label>
                        </div>
                        <div className="flex items-center gap-2 mt-8">
                            <input type="checkbox" id="is_wes" checked={form.is_wes_approved} onChange={(e) => setForm({...form, is_wes_approved: e.target.checked})} className="rounded text-[#1B2A6B] focus:ring-[#1B2A6B] w-4 h-4"/>
                            <label htmlFor="is_wes" className="text-sm font-bold text-slate-700">WES Approved</label>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NAAC Grade</label>
                            <input 
                            type="text" placeholder="e.g. A+"
                            value={form.naac_grade} onChange={(e) => setForm({ ...form, naac_grade: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIRF Ranking</label>
                            <input 
                            type="text" placeholder="e.g. Top 50"
                            value={form.nirf_ranking} onChange={(e) => setForm({ ...form, nirf_ranking: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                      </div>
                  </div>

                  {/* Academics */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Academics & Courses</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Degree Types (Comma Separated)</label>
                            <input 
                            type="text" placeholder="e.g. BCA, MCA, MBA"
                            value={form.degree_types} onChange={(e) => setForm({ ...form, degree_types: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Popular Courses (Comma Separated)</label>
                            <input 
                            type="text" placeholder="e.g. Data Science, Full Stack, Marketing"
                            value={form.popular_courses} onChange={(e) => setForm({ ...form, popular_courses: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                            <input 
                            type="text" placeholder="e.g. 2 - 3 Years"
                            value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eligibility</label>
                            <input 
                            type="text" placeholder="e.g. 10+2 with 50%"
                            value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                      </div>
                  </div>

                  {/* Content & Descriptions */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Content</h3>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short Description (Cards)</label>
                        <textarea 
                            rows={2} placeholder="Brief description for grid cards..."
                            value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Description (Details Page)</label>
                        <textarea 
                            rows={4} placeholder="Comprehensive description..."
                            value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admission Process</label>
                            <textarea 
                                rows={3} placeholder="Steps to apply..."
                                value={form.admission_process} onChange={(e) => setForm({ ...form, admission_process: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Support</label>
                            <textarea 
                                rows={3} placeholder="Placement assistance details..."
                                value={form.placement_support} onChange={(e) => setForm({ ...form, placement_support: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                            />
                        </div>
                      </div>
                  </div>

                  {/* SEO */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">SEO Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Title</label>
                            <input 
                            type="text" placeholder="SEO Title"
                            value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Keywords</label>
                            <input 
                            type="text" placeholder="e.g. online degree, lpu online, bca"
                            value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Description</label>
                            <textarea 
                                rows={2} placeholder="SEO Description..."
                                value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                            />
                        </div>
                      </div>
                  </div>

               </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-4 justify-end">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="university-form"
                  className="px-8 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check size={18} /> {editingId ? "Save Changes" : "Publish University"}
                </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
