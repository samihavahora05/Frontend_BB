import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Building, Search, Plus, ShieldCheck, X, Check, ShieldAlert, 
  Trash2, Edit, ExternalLink, MapPin, Globe, Star, Sparkles,
  Layers, Filter, RefreshCw, Eye
} from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import { MediaUploader } from "../../../src/components/ui/MediaUploader";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";
import useSWR from "swr";
import { fetcher } from "../../../src/lib/fetcher";
import api from "../../../src/lib/axios";
import { CompanyService, CMSCompany } from "../../../src/lib/api/CompanyService";
import { INDUSTRIES } from "../../../src/data/companies";

export default function AdminCompaniesPage() {
  const [activeTab, setActiveTab] = useState<"companies" | "projects" | "partners" | "colleges">("companies");
  
  // SWR hooks
  const { data: apiCompaniesData, mutate: mutateApiCompanies } = useSWR("/admin/cms/companies", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });
  const { data: projectsData, mutate: mutateProjects } = useSWR("/admin/cms/portfolios", fetcher);
  const { data: partnersData, mutate: mutatePartners } = useSWR("/admin/cms/placement-partners", fetcher);
  const { data: collegesData, mutate: mutateColleges } = useSWR("/admin/cms/colleges", fetcher);
  
  const [localCompanies, setLocalCompanies] = useState<CMSCompany[]>([]);
  const projects = projectsData || [];
  const partners = partnersData || [];
  const colleges = collegesData || [];
  
  const confirmAction = useConfirm();

  // Load companies from CompanyService (merges backend API & local cache)
  const refreshCompanies = async () => {
    try {
      const data = await CompanyService.getAll();
      setLocalCompanies(data);
    } catch (e) {
      setLocalCompanies(CompanyService.getLocalCompanies());
    }
  };

  useEffect(() => {
    refreshCompanies();

    const unsubscribe = CompanyService.subscribe((updated) => {
      setLocalCompanies(updated);
      mutateApiCompanies();
    });
    return () => unsubscribe();
  }, [mutateApiCompanies]);

  // Use API companies if present, or synchronized localCompanies
  const companies: CMSCompany[] = useMemo(() => {
    if (apiCompaniesData && Array.isArray(apiCompaniesData) && apiCompaniesData.length > 0) {
      return apiCompaniesData.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || c.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        industry: c.industry?.name || c.industry || "IT & Software Development",
        logoUrl: c.logo_url || c.logoUrl || "/logo/damyaa.png",
        location: c.location || "India",
        website_url: c.website_url || "",
        status: c.status || "published",
        is_featured: !!c.is_featured,
        display_order: c.display_order || 0,
      }));
    }
    return localCompanies.length > 0 ? localCompanies : CompanyService.getLocalCompanies();
  }, [apiCompaniesData, localCompanies]);

  // Search, Filters & Pagination
  const [searchCompanyTerm, setSearchCompanyTerm] = useState("");
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Extract unique industries for filter dropdown
  const uniqueIndustries = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.industry && c.industry.trim()) set.add(c.industry.trim());
    });
    return ["All", ...Array.from(set).sort()];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchSearch =
        !searchCompanyTerm.trim() ||
        c.name.toLowerCase().includes(searchCompanyTerm.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(searchCompanyTerm.toLowerCase())) ||
        (c.industry && c.industry.toLowerCase().includes(searchCompanyTerm.toLowerCase()));

      const matchIndustry =
        selectedIndustryFilter === "All" ||
        c.industry?.toLowerCase() === selectedIndustryFilter.toLowerCase();

      const matchStatus =
        selectedStatusFilter === "All" ||
        c.status?.toLowerCase() === selectedStatusFilter.toLowerCase();

      return matchSearch && matchIndustry && matchStatus;
    });
  }, [companies, searchCompanyTerm, selectedIndustryFilter, selectedStatusFilter]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompanies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchCompanyTerm, selectedIndustryFilter, selectedStatusFilter]);

  // Modal states for Company Add/Edit
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CMSCompany | null>(null);

  // Form fields for Company
  const [companyForm, setCompanyForm] = useState({
    name: "",
    industry: "IT & Software Development",
    customIndustry: "",
    location: "Vadodara, India",
    website_url: "",
    logoUrl: "",
    status: "published" as "published" | "draft" | "archived",
    is_featured: false,
  });

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
    link: "",
  });

  // Modal states for Partners
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", logo_url: "" });

  // Modal states for Colleges
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [editingCollegeId, setEditingCollegeId] = useState<number | null>(null);
  const [collegeForm, setCollegeForm] = useState({ name: "", logo_url: "", location: "" });

  // Open Add Company Modal
  const openAddCompanyModal = () => {
    setEditingCompany(null);
    setCompanyForm({
      name: "",
      industry: "IT & Software Development",
      customIndustry: "",
      location: "Vadodara, India",
      website_url: "",
      logoUrl: "",
      status: "published",
      is_featured: false,
    });
    setIsAddCompanyModalOpen(true);
  };

  // Open Edit Company Modal
  const openEditCompanyModal = (company: CMSCompany) => {
    setEditingCompany(company);
    const isStandardInd = INDUSTRIES.includes(company.industry);
    setCompanyForm({
      name: company.name,
      industry: isStandardInd ? company.industry : "Custom",
      customIndustry: isStandardInd ? "" : company.industry,
      location: company.location || "",
      website_url: company.website_url || "",
      logoUrl: company.logoUrl || "",
      status: company.status || "published",
      is_featured: !!company.is_featured,
    });
    setIsEditCompanyModalOpen(true);
  };

  // Handle Save (Add or Edit) Company
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name.trim()) {
      toast.error("Company Name is required");
      return;
    }

    const finalIndustry =
      companyForm.industry === "Custom" && companyForm.customIndustry.trim()
        ? companyForm.customIndustry.trim()
        : companyForm.industry;

    const payload: Partial<CMSCompany> = {
      name: companyForm.name.trim(),
      industry: finalIndustry || "IT & Software Development",
      location: companyForm.location.trim() || "India",
      website_url: companyForm.website_url.trim(),
      logoUrl: companyForm.logoUrl.trim() || "/logo/Damyaa.png",
      status: companyForm.status,
      is_featured: companyForm.is_featured,
    };

    try {
      if (isEditCompanyModalOpen && editingCompany) {
        await CompanyService.update(editingCompany.id, payload);
        toast.success(`Updated "${companyForm.name}" successfully!`);
      } else {
        await CompanyService.create(payload);
        toast.success(`Added "${companyForm.name}" successfully!`);
      }

      mutateApiCompanies();
      setLocalCompanies(CompanyService.getLocalCompanies());
      setIsAddCompanyModalOpen(false);
      setIsEditCompanyModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save company");
    }
  };

  // Handle Delete Company
  const handleDeleteCompany = async (id: string | number, name: string) => {
    const confirmed = await confirmAction({
      title: "Remove Company",
      description: `Are you sure you want to remove "${name}"? This action will remove it from the admin table and public user portal.`,
      isDestructive: true,
    });

    if (confirmed) {
      try {
        await CompanyService.delete(id);
        mutateApiCompanies();
        setLocalCompanies(CompanyService.getLocalCompanies());
        toast.success(`Removed "${name}"`);
      } catch (err) {
        toast.error("Failed to delete company");
      }
    }
  };

  // --- PROJECT HANDLERS ---
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
            tags: newProject.tags ? newProject.tags.split(",").map((t) => t.trim()) : [],
            duration: newProject.duration,
            deliverables: newProject.deliverables,
            image_url: newProject.image,
          });
          toast.success("Project updated successfully!");
        } else {
          await api.post("/admin/cms/portfolios", {
            title: newProject.title,
            studio: newProject.studio,
            description: newProject.description,
            category: newProject.category || "General",
            tags: newProject.tags ? newProject.tags.split(",").map((t) => t.trim()) : [],
            duration: newProject.duration,
            deliverables: newProject.deliverables,
            image_url: newProject.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
            status: "published",
          });
          toast.success("Project added successfully!");
        }
        mutateProjects();
        setNewProject({
          title: "", studio: "", category: "", description: "", tags: "", duration: "", deliverables: "", image: "", link: "",
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
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
      duration: project.duration || "",
      deliverables: project.deliverables || "",
      image: project.image_url || "",
      link: project.link || "",
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
    switch (status?.toLowerCase()) {
      case "published":
      case "verified":
      case "active":
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold gap-1"><ShieldCheck size={12} /> Published</Badge>;
      case "draft":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200/60 font-bold gap-1">Draft</Badge>;
      case "archived":
      case "suspended":
        return <Badge className="bg-slate-100 text-slate-600 border border-slate-200 font-bold gap-1"><ShieldAlert size={12} /> Archived</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 font-bold">{status || "Published"}</Badge>;
    }
  };

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B2A6B] to-indigo-900 flex items-center justify-center text-white shadow-md">
              <Building size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Companies & Projects Hub</h1>
              <p className="text-slate-500 font-medium text-xs">Manage all corporate partner companies, projects, placement networks, and university ties.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {activeTab === "companies" ? (
            <button
              onClick={openAddCompanyModal}
              className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add New Company
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
      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("companies")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "companies"
              ? "border-[#1B2A6B] text-[#1B2A6B] bg-indigo-50/40 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Building size={16} />
          <span>Partner Companies</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-[#1B2A6B]">
            {companies.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "projects"
              ? "border-[#1B2A6B] text-[#1B2A6B] bg-indigo-50/40 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers size={16} />
          <span>Company Projects</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700">
            {projects.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("partners")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "partners"
              ? "border-[#1B2A6B] text-[#1B2A6B] bg-indigo-50/40 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>Placement Partners</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700">
            {partners.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("colleges")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "colleges"
              ? "border-[#1B2A6B] text-[#1B2A6B] bg-indigo-50/40 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>Colleges & Univ.</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700">
            {colleges.length}
          </span>
        </button>
      </div>

      {/* TAB: COMPANIES */}
      {activeTab === "companies" && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Building size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Companies</p>
                <h3 className="text-xl font-black text-slate-800">{companies.length}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published</p>
                <h3 className="text-xl font-black text-slate-800">{companies.filter(c => c.status === 'published').length}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <Star size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured</p>
                <h3 className="text-xl font-black text-slate-800">{companies.filter(c => c.is_featured).length}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                <Filter size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industries</p>
                <h3 className="text-xl font-black text-slate-800">{uniqueIndustries.length - 1}</h3>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
            {/* Search and Filters Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search company by name, location, or industry..."
                  value={searchCompanyTerm}
                  onChange={(e) => setSearchCompanyTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Industry Filter */}
                <select
                  value={selectedIndustryFilter}
                  onChange={(e) => setSelectedIndustryFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                >
                  <option value="All">All Industries</option>
                  {uniqueIndustries.filter(i => i !== "All").map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                >
                  <option value="All">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Refresh */}
                <button
                  onClick={refreshCompanies}
                  title="Reload companies"
                  className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-[#1B2A6B] hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Companies Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Company & Logo</th>
                    <th className="py-4 px-6">Industry / Sector</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Website</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Featured</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-indigo-50/30 transition-colors group">
                      {/* Company Info & Logo Photo */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1.5 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:border-indigo-300 transition-colors">
                            {company.logoUrl ? (
                              <img
                                src={company.logoUrl}
                                alt={company.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Fallback to building icon if image fails
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Building className="text-slate-300" size={24} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-[#1B2A6B] transition-colors flex items-center gap-1.5">
                              {company.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono font-semibold">
                              ID: {company.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700">
                          {company.industry || "General"}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span>{company.location || "India"}</span>
                        </div>
                      </td>

                      {/* Website */}
                      <td className="py-4 px-6">
                        {company.website_url ? (
                          <a
                            href={company.website_url.startsWith("http") ? company.website_url : `https://${company.website_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#1B2A6B] hover:underline"
                          >
                            <Globe size={13} />
                            <span>Visit</span>
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {getStatusBadge(company.status)}
                      </td>

                      {/* Featured */}
                      <td className="py-4 px-6 text-center">
                        {company.is_featured ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 border border-amber-200/80" title="Featured on Homepage">
                            <Star size={14} className="fill-amber-400" />
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300 font-bold">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditCompanyModal(company)}
                            className="p-2 text-slate-500 hover:text-[#1B2A6B] hover:bg-indigo-50 rounded-xl transition-all inline-flex items-center justify-center"
                            title="Edit Company Details & Photo"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company.id, company.name)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all inline-flex items-center justify-center"
                            title="Delete Company"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredCompanies.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Building size={36} className="text-slate-300 mb-2 stroke-[1.5]" />
                          <p className="text-base font-bold text-slate-600">No companies found</p>
                          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
                          <button
                            onClick={() => { setSearchCompanyTerm(""); setSelectedIndustryFilter("All"); setSelectedStatusFilter("All"); }}
                            className="mt-3 text-xs font-bold text-[#1B2A6B] hover:underline"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 mt-auto">
                <span className="text-xs text-slate-500 font-bold">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)} of {filteredCompanies.length} companies
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors text-xs font-bold"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-xs font-black text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors text-xs font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PROJECTS */}
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
            {projects.map((project: any) => (
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
                      <span className="flex items-center gap-1">⏱ {project.duration}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">📦 {project.deliverables}</span>
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-600 hover:text-[#1B2A6B] hover:bg-blue-50 rounded-lg transition-colors border border-slate-200">
                        <ExternalLink size={16} />
                      </a>
                    )}
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

      {/* TAB: PLACEMENT PARTNERS */}
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
                  <th className="py-3 px-6 text-right">Actions</th>
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
                        <div className="font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{partner.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600">
                      {partner.industry?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-right">
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

      {/* TAB: COLLEGES */}
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
                  <th className="py-3 px-6 text-right">Actions</th>
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
                        <div className="font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{college.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-600">{college.location || "N/A"}</td>
                    <td className="py-4 px-6 text-right">
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

      {/* ============================================================ */}
      {/* COMPANY ADD / EDIT MODAL                                      */}
      {/* ============================================================ */}
      {(isAddCompanyModalOpen || isEditCompanyModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => { setIsAddCompanyModalOpen(false); setIsEditCompanyModalOpen(false); }}
          />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-xl shadow-2xl p-6 sm:p-8 z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#1B2A6B] flex items-center justify-center font-bold">
                  <Building size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    {isEditCompanyModalOpen ? "Edit Partner Company" : "Add New Partner Company"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {isEditCompanyModalOpen ? "Modify company details and upload or change logo photo." : "Register a new partner entity to the ecosystem."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsAddCompanyModalOpen(false); setIsEditCompanyModalOpen(false); }}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flammer Technologies, Damyaa, Netflix India"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all"
                />
              </div>

              {/* Industry Dropdown + Custom Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Industry / Domain</label>
                  <select
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                  >
                    {INDUSTRIES.filter(i => i !== "All Industries").map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                    <option value="Custom">+ Other / Custom Industry</option>
                  </select>
                </div>

                {companyForm.industry === "Custom" ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Custom Industry Name</label>
                    <input
                      type="text"
                      placeholder="e.g. AI & Robotics"
                      value={companyForm.customIndustry}
                      onChange={(e) => setCompanyForm({ ...companyForm, customIndustry: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Location / City</label>
                    <input
                      type="text"
                      placeholder="e.g. Vadodara, Gujarat, India"
                      value={companyForm.location}
                      onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Website URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://company.com"
                  value={companyForm.website_url}
                  onChange={(e) => setCompanyForm({ ...companyForm, website_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                />
              </div>

              {/* Logo / Photo Media Uploader */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Company Photo / Logo</span>
                  {companyForm.logoUrl && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check size={12} /> Image Attached
                    </span>
                  )}
                </label>

                <MediaUploader
                  label="Upload or Paste Company Logo URL"
                  accept="image/*"
                  value={companyForm.logoUrl}
                  onUploadSuccess={(url) => setCompanyForm({ ...companyForm, logoUrl: url })}
                />

                {/* Logo Image Live Preview */}
                {companyForm.logoUrl && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={companyForm.logoUrl}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{companyForm.logoUrl}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Live Photo Preview</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompanyForm({ ...companyForm, logoUrl: "" })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Clear photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Status and Featured Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Publish Status</label>
                  <select
                    value={companyForm.status}
                    onChange={(e: any) => setCompanyForm({ ...companyForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                  >
                    <option value="published">Published (Visible to all users)</option>
                    <option value="draft">Draft (Admin only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6 sm:pt-6">
                  <label className="relative flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={companyForm.is_featured}
                      onChange={(e) => setCompanyForm({ ...companyForm, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1B2A6B] focus:ring-[#1B2A6B] border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Star size={13} className={companyForm.is_featured ? "text-amber-500 fill-amber-400" : "text-slate-400"} />
                      Featured Partner
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-5 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddCompanyModalOpen(false); setIsEditCompanyModalOpen(false); }}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  <span>{isEditCompanyModalOpen ? "Update Company" : "Save & Add Company"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags (comma separated)</label>
                    <input
                      type="text" placeholder="e.g. 3D, VFX, Unreal Engine"
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
                      type="text" placeholder="e.g. 3D Promo Film"
                      value={newProject.deliverables} onChange={(e) => setNewProject({ ...newProject, deliverables: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Link (Optional)</label>
                    <input
                      type="text" placeholder="https://..."
                      value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <MediaUploader
                      label="Cover Image"
                      accept="image/*"
                      value={newProject.image}
                      onUploadSuccess={(url) => setNewProject({ ...newProject, image: url })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button" onClick={() => { setIsAddProjectModalOpen(false); setIsEditProjectModalOpen(false); }}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all"
                  >
                    {isEditProjectModalOpen ? "Save Changes" : "Upload Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER MODAL */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPartnerModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">{editingPartnerId ? "Edit Placement Partner" : "Add Placement Partner"}</h2>
              <button onClick={() => setIsPartnerModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-xl"><X size={18} /></button>
            </div>
            <form onSubmit={handleSavePartner} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Name</label>
                <input
                  type="text" required placeholder="e.g. Google"
                  value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                />
              </div>
              <MediaUploader
                label="Partner Logo"
                accept="image/*"
                value={partnerForm.logo_url}
                onUploadSuccess={(url) => setPartnerForm({ ...partnerForm, logo_url: url })}
              />
              <div className="pt-4 flex gap-3">
                <button
                  type="button" onClick={() => setIsPartnerModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md"
                >
                  {editingPartnerId ? "Update Partner" : "Add Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLLEGE MODAL */}
      {isCollegeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCollegeModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">{editingCollegeId ? "Edit College/University" : "Add College/University"}</h2>
              <button onClick={() => setIsCollegeModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-xl"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveCollege} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">College/University Name</label>
                <input
                  type="text" required placeholder="e.g. Parul University"
                  value={collegeForm.name} onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                <input
                  type="text" placeholder="e.g. Vadodara, Gujarat"
                  value={collegeForm.location} onChange={(e) => setCollegeForm({ ...collegeForm, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                />
              </div>
              <MediaUploader
                label="College Logo"
                accept="image/*"
                value={collegeForm.logo_url}
                onUploadSuccess={(url) => setCollegeForm({ ...collegeForm, logo_url: url })}
              />
              <div className="pt-4 flex gap-3">
                <button
                  type="button" onClick={() => setIsCollegeModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md"
                >
                  {editingCollegeId ? "Update College" : "Add College"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
