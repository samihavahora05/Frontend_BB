import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Building, Search, Plus, ShieldCheck, X, Check, ShieldAlert, Trash2, Edit, MonitorPlay, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import { MediaUploader } from "../../../src/components/ui/MediaUploader";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";
import useSWR from "swr";
import { fetcher } from "../../../src/lib/fetcher"; // Standard fetcher
import api from "../../../src/lib/axios";

// MOCK data removed, replaced with SWR

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Brand Identity & 3D Promo Film",
    studio: "Anibrain Studios",
    category: "3D ANIMATION",
    description: "End-to-end brand film featuring photorealistic 3D product animation and motion graphics for theatrical release.",
    tags: ["3D Modeling", "VFX", "Motion Graphics"],
    duration: "8 WEEKS",
    deliverables: "BRAND FILM + 3 TEASERS",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    link: "#"
  }
];

export default function AdminCompaniesPage() {
  const [activeTab, setActiveTab] = useState<"companies" | "projects" | "partners" | "colleges">("companies");
  
  const { data: companiesData, mutate: mutateCompanies } = useSWR("/admin/cms/companies", fetcher);
  const { data: projectsData, mutate: mutateProjects } = useSWR("/admin/cms/portfolios", fetcher);
  const { data: partnersData, mutate: mutatePartners } = useSWR("/admin/cms/placement-partners", fetcher);
  const { data: collegesData, mutate: mutateColleges } = useSWR("/admin/cms/colleges", fetcher);
  
  const companies = companiesData || [];
  const projects = projectsData || [];
  const partners = partnersData || [];
  const colleges = collegesData || [];
  
  const confirmAction = useConfirm();

  // Search and Pagination
  const [searchCompanyTerm, setSearchCompanyTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredCompanies = companies.filter((c: any) => c.name.toLowerCase().includes(searchCompanyTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchCompanyTerm]);

  // Modal states for Company
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newCompanyJobs, setNewCompanyJobs] = useState("");
  const [newCompanyLogo, setNewCompanyLogo] = useState("");

  // Modal states for Project
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const [newProject, setNewProject] = useState({
    title: "",
    studio: "",
    category: "",
    description: "",
    tags: "",
    duration: "",
    deliverables: "",
    image: "",
    link: ""
  });

  // Modal states for Partners
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", logo_url: "" });

  // Modal states for Colleges
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [editingCollegeId, setEditingCollegeId] = useState<number | null>(null);
  const [collegeForm, setCollegeForm] = useState({ name: "", logo_url: "", location: "" });

  const handleDeleteCompany = async (id: number) => {
    if (await confirmAction({ title: "Delete Company", description: "Are you sure you want to delete this company?", isDestructive: true })) {
      try {
        await api.delete(`/admin/cms/companies/${id}`);
        mutateCompanies();
        toast.success("Company deleted");
      } catch (err) {
        toast.error("Failed to delete company");
      }
    }
  };

  const handleOnboardCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompanyName) {
      try {
        if (isEditCompanyModalOpen && editingCompanyId) {
          await api.put(`/admin/cms/companies/${editingCompanyId}`, {
            name: newCompanyName,
            email: newCompanyEmail,
            logo_url: newCompanyLogo
          });
          toast.success("Company updated successfully!");
        } else {
          await api.post("/admin/cms/companies", {
            name: newCompanyName,
            email: newCompanyEmail,
            status: "published",
            logo_url: newCompanyLogo || `https://upload.wikimedia.org/wikipedia/commons/b/b8/Logo_de_la_Rep%C3%BAblica.svg`
          });
          toast.success("Company added successfully!");
        }
        mutateCompanies();
        setNewCompanyName("");
        setNewCompanyEmail("");
        setNewCompanyJobs("");
        setNewCompanyLogo("");
        setIsAddModalOpen(false);
        setIsEditCompanyModalOpen(false);
      } catch (err) {
        toast.error("Failed to save company");
      }
    }
  };

  const openEditCompanyModal = (company: any) => {
    setEditingCompanyId(company.id);
    setNewCompanyName(company.name);
    setNewCompanyEmail(company.email || "");
    setNewCompanyLogo(company.logo_url || "");
    setIsEditCompanyModalOpen(true);
  };

  const handleUploadProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.title) {
      try {
        if (isEditProjectModalOpen && editingProjectId) {
          await api.put(`/admin/cms/portfolios/${editingProjectId}`, {
            title: newProject.title,
            description: newProject.description,
            studio: newProject.studio,
            category: newProject.category,
            tags: newProject.tags ? newProject.tags.split(",").map(t => t.trim()) : [],
            duration: newProject.duration,
            deliverables: newProject.deliverables,
            image_url: newProject.image
          });
          toast.success("Project updated successfully!");
        } else {
          await api.post("/admin/cms/portfolios", {
            title: newProject.title,
            studio: newProject.studio,
            description: newProject.description,
            category: newProject.category || "General",
            tags: newProject.tags ? newProject.tags.split(",").map(t => t.trim()) : [],
            duration: newProject.duration,
            deliverables: newProject.deliverables,
            image_url: newProject.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
            status: "published"
          });
          toast.success("Project added successfully!");
        }
        mutateProjects();
        setNewProject({
          title: "", studio: "", category: "", description: "", tags: "", duration: "", deliverables: "", image: "", link: ""
        });
        setIsAddProjectModalOpen(false);
        setIsEditProjectModalOpen(false);
      } catch (err) {
        toast.error("Failed to save project");
      }
    }
  };

  const openEditProjectModal = (project: any) => {
    setEditingProjectId(project.id);
    setNewProject({
      title: project.title,
      studio: project.studio || "",
      category: project.category || "",
      description: project.description || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : (project.tags || ""),
      duration: project.duration || "",
      deliverables: project.deliverables || "",
      image: project.image_url || "",
      link: project.link || ""
    });
    setIsEditProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (await confirmAction({ title: "Delete Project", description: "Are you sure you want to delete this project?", isDestructive: true })) {
      try {
        await api.delete(`/admin/cms/portfolios/${id}`);
        mutateProjects();
        toast.success("Project deleted");
      } catch (err) {
        toast.error("Failed to delete project");
      }
    }
  };

  // --- PARTNERS HANDLERS ---
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerForm.name) {
      try {
        if (editingPartnerId) {
          await api.put(`/admin/cms/placement-partners/${editingPartnerId}`, partnerForm);
          toast.success("Partner updated successfully!");
        } else {
          await api.post("/admin/cms/placement-partners", partnerForm);
          toast.success("Partner added successfully!");
        }
        mutatePartners();
        setPartnerForm({ name: "", logo_url: "" });
        setIsPartnerModalOpen(false);
        setEditingPartnerId(null);
      } catch (err) {
        toast.error("Failed to save partner");
      }
    }
  };

  const handleDeletePartner = async (id: number) => {
    if (await confirmAction({ title: "Delete Partner", description: "Are you sure?", isDestructive: true })) {
      try {
        await api.delete(`/admin/cms/placement-partners/${id}`);
        mutatePartners();
        toast.success("Partner deleted");
      } catch (err) {
        toast.error("Failed to delete partner");
      }
    }
  };

  // --- COLLEGES HANDLERS ---
  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (collegeForm.name) {
      try {
        if (editingCollegeId) {
          await api.put(`/admin/cms/colleges/${editingCollegeId}`, collegeForm);
          toast.success("College updated successfully!");
        } else {
          await api.post("/admin/cms/colleges", collegeForm);
          toast.success("College added successfully!");
        }
        mutateColleges();
        setCollegeForm({ name: "", logo_url: "", location: "" });
        setIsCollegeModalOpen(false);
        setEditingCollegeId(null);
      } catch (err) {
        toast.error("Failed to save college");
      }
    }
  };

  const handleDeleteCollege = async (id: number) => {
    if (await confirmAction({ title: "Delete College", description: "Are you sure?", isDestructive: true })) {
      try {
        await api.delete(`/admin/cms/colleges/${id}`);
        mutateColleges();
        toast.success("College deleted");
      } catch (err) {
        toast.error("Failed to delete college");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified": return <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold gap-1"><ShieldCheck size={12}/> Verified</Badge>;
      case "Suspended": return <Badge className="bg-rose-50 text-rose-700 border-none font-bold gap-1"><ShieldAlert size={12}/> Suspended</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Company & Projects Hub</h1>
          <p className="text-slate-500 font-medium text-sm">Manage hiring entities and their uploaded showcase projects.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === "companies" ? (
            <button 
              onClick={() => { setEditingCompanyId(null); setIsAddModalOpen(true); }}
              className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Onboard Company
            </button>
          ) : activeTab === "projects" ? (
            <button 
              onClick={() => { setEditingProjectId(null); setIsAddProjectModalOpen(true); }}
              className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Upload Project
            </button>
          ) : activeTab === "partners" ? (
            <button 
              onClick={() => { setEditingPartnerId(null); setPartnerForm({ name: "", logo_url: "" }); setIsPartnerModalOpen(true); }}
              className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Partner
            </button>
          ) : (
            <button 
              onClick={() => { setEditingCollegeId(null); setCollegeForm({ name: "", logo_url: "", location: "" }); setIsCollegeModalOpen(true); }}
              className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add College
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab("companies")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "companies" ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Partner Companies
        </button>
        <button 
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "projects" ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Company Projects
        </button>
        <button 
          onClick={() => setActiveTab("partners")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "partners" ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Placement Partners
        </button>
        <button 
          onClick={() => setActiveTab("colleges")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "colleges" ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Colleges & Univ.
        </button>
      </div>

      {activeTab === "companies" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search companies..." 
                value={searchCompanyTerm}
                onChange={(e) => setSearchCompanyTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
              />
            </div>
          </div>

          <div className="overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Company Info</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Active Jobs</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCompanies.map((company: any) => (
                  <tr key={company.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1.5 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                          <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{company.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{company.industry?.name || "Multiple"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600">{company.is_featured ? "Featured" : "Standard"}</td>
                    <td className="py-4 px-6">
                      {getStatusBadge(company.status)}
                    </td>
                    <td className="py-4 px-6 text-right relative overflow-visible">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditCompanyModal(company)}
                          className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Edit Company"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCompany(company.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Delete Company"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 mt-auto">
              <span className="text-sm text-slate-500 font-medium">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)} of {filteredCompanies.length} companies
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
      )}

      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
              />
            </div>
            <div className="text-sm font-bold text-slate-500">
              Total {projects.length} Projects
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative group flex flex-col">
                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditProjectModal(project)}
                    className="p-2 bg-black/40 hover:bg-[#1B2A6B] text-white rounded-lg transition-colors backdrop-blur-sm"
                    title="Edit Project"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 bg-black/40 hover:bg-red-600 text-white rounded-lg transition-colors backdrop-blur-sm"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="relative h-48 w-full bg-slate-100 shrink-0">
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-[#1B2A6B] uppercase tracking-wider shadow-sm">
                      {project.category}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-3 right-3 bg-white backdrop-blur px-3 py-1.5 rounded-lg text-xs font-black text-slate-800 shadow-sm">
                    {project.studio}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-black text-[#1B2A6B] mb-2 leading-tight">{project.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags && Array.isArray(project.tags) ? project.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600">{tag}</span>
                    )) : null}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        ⏱ {project.duration}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        📦 {project.deliverables}
                      </span>
                    </div>
                    <a href={project.link} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 hover:text-[#1B2A6B] hover:bg-blue-50 rounded-lg transition-colors border border-slate-200">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center text-slate-400 font-medium py-12 bg-white rounded-2xl border border-slate-200">
                No projects uploaded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "partners" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col min-h-[60vh]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Placement Partners ({partners.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Partner Info</th>
                  <th className="py-3 px-6">Industry</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((partner: any) => (
                  <tr key={partner.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm">
                          {partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain" /> : <Building className="text-slate-300" size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{partner.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600">
                      {partner.industry?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right relative overflow-visible">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingPartnerId(partner.id); setPartnerForm({ name: partner.name, logo_url: partner.logo_url || "" }); setIsPartnerModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeletePartner(partner.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "colleges" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col min-h-[60vh]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Colleges & Universities ({colleges.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">College Info</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colleges.map((college: any) => (
                  <tr key={college.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm">
                          {college.logo_url ? <img src={college.logo_url} alt={college.name} className="w-full h-full object-contain" /> : <Building className="text-slate-300" size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{college.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600">
                      {college.location}
                    </td>
                    <td className="py-4 px-6 text-right relative overflow-visible">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingCollegeId(college.id); setCollegeForm({ name: college.name, location: college.location, logo_url: college.logo_url || "" }); setIsCollegeModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCollege(college.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onboard/Edit Company Modal */}
      {(isAddModalOpen || isEditCompanyModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsAddModalOpen(false); setIsEditCompanyModalOpen(false); }} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">{isEditCompanyModalOpen ? "Edit Company" : "Onboard Company Partner"}</h2>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditCompanyModalOpen(false); }} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-xl"><X size={18} /></button>
            </div>
            <form onSubmit={handleOnboardCompany} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                <input 
                  type="text" required placeholder="e.g. Netflix India"
                  value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Email</label>
                <input 
                  type="email" required placeholder="e.g. recruit@netflix.com"
                  value={newCompanyEmail} onChange={(e) => setNewCompanyEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                />
              </div>
              <MediaUploader
                label="Company Logo URL"
                accept="image/*"
                value={newCompanyLogo}
                onUploadSuccess={setNewCompanyLogo}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Jobs count</label>
                <input 
                  type="number" required placeholder="e.g. 5"
                  value={newCompanyJobs} onChange={(e) => setNewCompanyJobs(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B]"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" onClick={() => { setIsAddModalOpen(false); setIsEditCompanyModalOpen(false); }}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all"
                >
                  {isEditCompanyModalOpen ? "Update Company" : "Onboard Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload/Edit Project Modal */}
      {(isAddProjectModalOpen || isEditProjectModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsAddProjectModalOpen(false); setIsEditProjectModalOpen(false); }} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl shadow-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                 <h2 className="text-xl font-black text-slate-800">{isEditProjectModalOpen ? "Edit Project" : "Upload Project"}</h2>
                 <p className="text-xs font-semibold text-slate-500 mt-1">{isEditProjectModalOpen ? "Update the details of this project portfolio." : "Add a new company project portfolio to the showcase."}</p>
              </div>
              <button onClick={() => { setIsAddProjectModalOpen(false); setIsEditProjectModalOpen(false); }} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
               <form id="create-project-form" onSubmit={handleUploadProject} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1.5 md:col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Title</label>
                       <input 
                         type="text" required placeholder="e.g. Brand Identity & 3D Promo Film"
                         value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Studio / Company Name</label>
                       <input 
                         type="text" required placeholder="e.g. Anibrain Studios"
                         value={newProject.studio} onChange={(e) => setNewProject({ ...newProject, studio: e.target.value })}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                       <input 
                         type="text" required placeholder="e.g. 3D ANIMATION"
                         value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="space-y-1.5 md:col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                       <textarea 
                         rows={2} placeholder="Brief description of the project..."
                         value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                       />
                     </div>
                     <div className="space-y-1.5 md:col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags (Comma separated)</label>
                       <input 
                         type="text" placeholder="e.g. 3D Modeling, VFX, Motion Graphics"
                         value={newProject.tags} onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                       <input 
                         type="text" placeholder="e.g. 8 WEEKS"
                         value={newProject.duration} onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deliverables</label>
                       <input 
                         type="text" placeholder="e.g. BRAND FILM + 3 TEASERS"
                         value={newProject.deliverables} onChange={(e) => setNewProject({ ...newProject, deliverables: e.target.value })}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="md:col-span-2">
                       <MediaUploader
                         label="Cover Image URL"
                         accept="image/*"
                         value={newProject.image}
                         onUploadSuccess={(url) => setNewProject({ ...newProject, image: url })}
                       />
                     </div>
                  </div>
               </form>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex gap-4 justify-end">
              <button 
                type="button" onClick={() => { setIsAddProjectModalOpen(false); setIsEditProjectModalOpen(false); }}
                className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" form="create-project-form"
                className="px-8 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {isEditProjectModalOpen ? <><Check size={16} /> Update Project</> : <><Plus size={16} /> Upload Project</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Partner Modal */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPartnerModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                 <h2 className="text-xl font-black text-slate-800">{editingPartnerId ? "Edit Partner" : "Add Partner"}</h2>
              </div>
              <button onClick={() => setIsPartnerModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 bg-slate-50">
               <form id="partner-form" onSubmit={handleSavePartner} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Name</label>
                    <input type="text" required value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                  </div>
                  <div>
                    <MediaUploader label="Logo URL" accept="image/*" value={partnerForm.logo_url} onUploadSuccess={(url) => setPartnerForm({ ...partnerForm, logo_url: url })} />
                  </div>
               </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button type="button" onClick={() => setIsPartnerModalOpen(false)} className="px-6 py-2.5 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl">Cancel</button>
              <button type="submit" form="partner-form" className="px-8 py-2.5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md">{editingPartnerId ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* College Modal */}
      {isCollegeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCollegeModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                 <h2 className="text-xl font-black text-slate-800">{editingCollegeId ? "Edit College" : "Add College"}</h2>
              </div>
              <button onClick={() => setIsCollegeModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 bg-slate-50">
               <form id="college-form" onSubmit={handleSaveCollege} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">College Name</label>
                    <input type="text" required value={collegeForm.name} onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                    <input type="text" required value={collegeForm.location} onChange={(e) => setCollegeForm({ ...collegeForm, location: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                  </div>
                  <div>
                    <MediaUploader label="Logo URL" accept="image/*" value={collegeForm.logo_url} onUploadSuccess={(url) => setCollegeForm({ ...collegeForm, logo_url: url })} />
                  </div>
               </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button type="button" onClick={() => setIsCollegeModalOpen(false)} className="px-6 py-2.5 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl">Cancel</button>
              <button type="submit" form="college-form" className="px-8 py-2.5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md">{editingCollegeId ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
