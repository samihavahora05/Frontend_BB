import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AdminDashboardLayout } from '@/layout/AdminDashboardLayout';
import { CertificateApiService } from '@/lib/api/admin/CertificateApiService';
import { renderCertificateToCanvas, normalizeCertificateElements, interpolateVariables } from '@/lib/certificateUtils';
import { Award, CheckCircle, Clock, XCircle, Download, FileCheck, Search, FileText, Plus, Trash2, Send, X, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CertificateListPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'issued'>('templates');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | number>('');
  const [issueForm, setIssueForm] = useState({
    student_name: '',
    student_email: '',
    course_title: '',
  });

  const { data: stats } = CertificateApiService.useStats();
  const { data: templates, isLoading: isTemplatesLoading, mutate: mutateTemplates } = CertificateApiService.useTemplates();
  const { 
    data: certificates, 
    meta, 
    isLoading: isCertsLoading, 
    mutate: mutateCerts 
  } = CertificateApiService.useCertificates({
    page,
    search: search || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });

  // Derived display templates merging local & API templates
  const displayTemplates = useMemo(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('bb_cert_templates_v1') : null;
    const localList = stored ? JSON.parse(stored) : [];
    
    const combinedMap = new Map();

    // 1. Add local templates
    localList.forEach((item: any) => {
      if (item.title) combinedMap.set(item.title.trim().toLowerCase(), item);
    });

    // 2. Add API templates
    if (templates && Array.isArray(templates)) {
      templates.forEach((apiTpl: any) => {
        const bg = apiTpl.bg_image || apiTpl.background_image;
        const key = apiTpl.title ? apiTpl.title.trim().toLowerCase() : apiTpl.id;
        
        if (!combinedMap.has(key)) {
          if (bg) combinedMap.set(key, apiTpl);
        } else {
          const existing = combinedMap.get(key);
          if (!existing.bg_image && !existing.background_image && bg) {
            combinedMap.set(key, apiTpl);
          }
        }
      });
    }

    return Array.from(combinedMap.values());
  }, [JSON.stringify(templates)]);

  const handleDeleteTemplate = async (id: number | string) => {
    if (confirm('Are you sure you want to delete this certificate template?')) {
      const stored = localStorage.getItem('bb_cert_templates_v1');
      if (stored) {
        const list = JSON.parse(stored);
        const filtered = list.filter((item: any) => item.id !== id && item.title !== id);
        localStorage.setItem('bb_cert_templates_v1', JSON.stringify(filtered));
      }
      
      try {
        await CertificateApiService.deleteTemplate(id);
        toast.success('Template deleted successfully');
      } catch (e) {
        toast.success('Template removed');
      } finally {
        mutateTemplates();
      }
    }
  };

  const handleDownloadTemplateImage = async (template: any, customStudentName?: string) => {
    const bgSrc = template.bg_image || template.background_image;
    if (!bgSrc) {
      return toast.error('No background image available for this template');
    }

    try {
      const layout = template.layout_settings || template;
      const elements = normalizeCertificateElements(template);

      const canvas = document.createElement('canvas');
      await renderCertificateToCanvas(canvas, bgSrc, {
        title: template.title || layout.title,
        showTitle: template.show_title || layout.showTitle,
        elements,
        studentName: customStudentName || '[Student Name]',
      });

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${template.title || 'Certificate'}-${customStudentName || 'Template'}.png`;
      a.click();
      toast.success('Certificate image downloaded!');
    } catch (e) {
      toast.error('Failed to generate certificate download');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await CertificateApiService.updateStatus(id, status);
      toast.success(`Certificate ${status.toLowerCase()} successfully`);
      mutateCerts();
    } catch (e) {
      toast.error('Failed to update certificate status');
    }
  };

  const handleDeleteCertificate = async (id: number) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      try {
        await CertificateApiService.deleteCertificate(id);
        toast.success('Certificate deleted successfully');
        mutateCerts();
      } catch (e) {
        toast.error('Failed to delete certificate');
      }
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.student_name || !issueForm.course_title) {
      return toast.error('Student Name and Course Title are required');
    }
    try {
      await CertificateApiService.issueCertificate({
        template_id: selectedTemplateId,
        student_name: issueForm.student_name,
        student_email: issueForm.student_email,
        course_title: issueForm.course_title,
      });
      toast.success('Certificate issued successfully!');
      setIsIssueModalOpen(false);
      setIssueForm({ student_name: '', student_email: '', course_title: '' });
      mutateCerts();
      setActiveTab('issued');
    } catch (e) {
      toast.error('Failed to issue certificate');
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Certificates | BlueBoxx DA</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Certificates & Templates</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">Manage certificate templates, download previews, and issue student certificates.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsIssueModalOpen(true)}
              className="bg-[#C9A227] hover:bg-[#b08d22] text-slate-900 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Send size={15} /> Issue Certificate
            </button>
            <Link 
              href="/admin/education/certificate/add" 
              className="bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus size={15} /> Add Certificate Template
            </Link>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Total Templates" value={displayTemplates?.length || 0} icon={<FileCheck />} color="text-indigo-600" bg="bg-indigo-50" />
          <StatCard title="Total Issued" value={stats?.total_issued || certificates?.length || 0} icon={<Award />} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Verified" value={stats?.verified || certificates?.filter((c: any) => c.status === 'Issued')?.length || 0} icon={<CheckCircle />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard title="Pending" value={stats?.pending || certificates?.filter((c: any) => c.status === 'Pending')?.length || 0} icon={<Clock />} color="text-amber-600" bg="bg-amber-50" />
          <StatCard title="Revoked" value={stats?.revoked || certificates?.filter((c: any) => c.status === 'Revoked')?.length || 0} icon={<XCircle />} color="text-rose-600" bg="bg-rose-50" />
          <StatCard title="Downloaded" value={stats?.downloaded || 0} icon={<Download />} color="text-violet-600" bg="bg-violet-50" />
        </div>

        {/* Tabs Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'templates' 
                ? 'border-[#1B2A6B] text-[#1B2A6B]' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText size={16} /> Certificate Templates 
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 font-extrabold">{displayTemplates?.length || 0}</span>
          </button>
          <button
            onClick={() => setActiveTab('issued')}
            className={`px-6 py-3 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'issued' 
                ? 'border-[#1B2A6B] text-[#1B2A6B]' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Award size={16} /> Issued Certificates
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 font-extrabold">{certificates?.length || 0}</span>
          </button>
        </div>

        {/* TAB 1: CERTIFICATE TEMPLATES GRID */}
        {activeTab === 'templates' && (
          <div>
            {isTemplatesLoading ? (
              <div className="py-16 text-center text-sm font-bold text-slate-400">Loading certificate templates...</div>
            ) : displayTemplates?.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
                <FileText size={48} className="text-slate-300 mb-3" />
                <h3 className="text-base font-black text-slate-700 mb-1">No Certificate Templates Found</h3>
                <p className="text-xs font-semibold text-slate-400 mb-5 max-w-sm">Create your first certificate template with custom background image, titles, font styles, and coordinates.</p>
                <Link 
                  href="/admin/education/certificate/add" 
                  className="bg-[#1B2A6B] hover:bg-[#121c47] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Create New Template
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayTemplates.map((tpl: any) => {
                  const bgSrc = tpl.bg_image || tpl.background_image;
                  const layout = tpl.layout_settings || tpl;
                  const elements = normalizeCertificateElements(tpl);

                  return (
                    <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                      
                      {/* Image Preview Box */}
                      <div className="h-52 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                        {bgSrc ? (
                          <div 
                            className="relative w-full h-full bg-white overflow-hidden"
                            style={{ aspectRatio: tpl.aspect_ratio ? `${tpl.aspect_ratio}` : '1.414/1' }}
                          >
                            <img src={bgSrc} alt={tpl.title} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                            {(tpl.show_title === 'yes' || tpl.show_title === true || tpl.show_title === '1' || tpl.show_title === undefined) && (
                              <div className="absolute inset-0 w-full h-full pointer-events-none">
                                {elements.map((el) => {
                                  if (!el.enabled) return null;
                                  const text = interpolateVariables(el.content, { title: tpl.title || layout.title, studentName: '[Student Name]' });
                                  return (
                                    <div
                                      key={el.id}
                                      className="absolute text-center whitespace-nowrap"
                                      style={{
                                        left: `${el.positionX}%`,
                                        top: `${el.positionY}%`,
                                        transform: `translate(${el.textAlignment === 'center' ? '-50%' : el.textAlignment === 'right' ? '-100%' : '0%'}, -50%)`,
                                        color: el.fontColor || '#0f172a',
                                        fontFamily: el.fontFamily || 'Georgia, serif',
                                        fontWeight: el.fontWeight || 500,
                                        fontStyle: el.fontStyle || 'normal',
                                        fontSize: `${Math.max(7, el.fontSize * 0.22)}px`,
                                        textAlign: el.textAlignment || 'center',
                                        textTransform: el.textTransform || 'none',
                                      }}
                                    >
                                      {text}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                            <FileText size={32} className="mb-2 text-slate-300" />
                            <span className="text-xs font-bold">No Background Image</span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-base font-black text-slate-800 line-clamp-1">{tpl.title || 'Untitled Certificate'}</h3>
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/admin/education/certificate/${tpl.id}/edit`}
                                className="p-1 text-slate-400 hover:text-[#1B2A6B] transition-colors"
                                title="Edit Template"
                              >
                                <Edit size={16} />
                              </Link>
                              <button 
                                onClick={() => handleDeleteTemplate(tpl.id)}
                                className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                                title="Delete Template"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                            <span className="px-2 py-0.5 rounded bg-slate-100">{elements.filter(e => e.enabled).length} Fields Configured</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 uppercase">{tpl.orientation || 'Landscape'}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100">Multi-Typography</span>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleDownloadTemplateImage(tpl)}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                          >
                            <Download size={13} /> Download
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTemplateId(tpl.id);
                              if (tpl.title) setIssueForm(prev => ({ ...prev, course_title: tpl.title }));
                              setIsIssueModalOpen(true);
                            }}
                            className="w-full py-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <Send size={13} /> Issue This
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ISSUED CERTIFICATES TABLE */}
        {activeTab === 'issued' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
              <h2 className="text-lg font-black text-gray-800">Issued Student Certificates</h2>
              
              <div className="flex items-center gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#1B2A6B]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Issued">Issued</option>
                  <option value="Pending">Pending</option>
                  <option value="Revoked">Revoked</option>
                  <option value="Expired">Expired</option>
                </select>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by ID or Name..." 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] w-64" 
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-white">
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Cert ID</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Course</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Issue Date</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isCertsLoading ? (
                    <tr><td colSpan={6} className="py-12 text-center text-sm font-bold text-gray-400">Loading certificates...</td></tr>
                  ) : certificates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FileText size={48} className="text-gray-200 mb-4"/>
                          <p className="text-sm font-bold text-gray-400 mb-3">No Issued Certificates Found</p>
                          <button
                            onClick={() => setIsIssueModalOpen(true)}
                            className="bg-[#C9A227] hover:bg-[#b08d22] text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                          >
                            Issue First Certificate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert: any) => {
                      const studentName = cert.student_name || (cert.user ? `${cert.user.first_name || ''} ${cert.user.last_name || ''}`.trim() : 'Student');
                      const matchedTemplate = templates?.find((t: any) => String(t.id) === String(cert.template_id)) || templates?.[0];

                      return (
                        <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 text-sm font-bold text-[#1B2A6B]">{cert.certificate_number || cert.cert_id || `CERT-${cert.id}`}</td>
                          <td className="py-4 px-6">
                            <div className="text-sm font-bold text-gray-800">{studentName}</div>
                            <div className="text-xs text-gray-500">{cert.student_email || cert.user?.email || '-'}</div>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-600">{cert.course_title || cert.course?.title || '-'}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider
                              ${cert.status === 'Issued' ? 'bg-emerald-100 text-emerald-700' : 
                                cert.status === 'Revoked' ? 'bg-red-100 text-red-700' : 
                                cert.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-gray-100 text-gray-700'}
                            `}>
                              {cert.status || 'Issued'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-500">
                            {new Date(cert.issued_at || cert.created_at || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {matchedTemplate ? (
                                <button 
                                  onClick={() => handleDownloadTemplateImage(matchedTemplate, studentName)}
                                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <Download size={12} /> Download Image
                                </button>
                              ) : cert.pdf_path ? (
                                <a href={`/storage/${cert.pdf_path}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">Download PDF</a>
                              ) : (
                                <button 
                                  onClick={() => templates?.[0] ? handleDownloadTemplateImage(templates[0], studentName) : toast.error('No template found')}
                                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <Download size={12} /> Download
                                </button>
                              )}
                              
                              {cert.status === 'Issued' && <button onClick={() => handleUpdateStatus(cert.id, 'Revoked')} className="text-xs font-bold text-red-600 hover:underline">Revoke</button>}
                              {cert.status === 'Revoked' && <button onClick={() => handleUpdateStatus(cert.id, 'Issued')} className="text-xs font-bold text-emerald-600 hover:underline">Re-issue</button>}
                              <button onClick={() => handleDeleteCertificate(cert.id)} className="text-xs font-bold text-gray-400 hover:text-red-600">Delete</button>
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
            {meta?.last_page > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-sm font-medium text-gray-500">Page {meta.current_page} of {meta.last_page}</span>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-bold disabled:opacity-50"
                  >Prev</button>
                  <button 
                    disabled={page === meta.last_page}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-bold disabled:opacity-50"
                  >Next</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ISSUE CERTIFICATE MODAL */}
        {isIssueModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Send size={18} className="text-[#C9A227]" /> Issue New Certificate
                </h3>
                <button onClick={() => setIsIssueModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
              </div>

              <form onSubmit={handleIssueSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Select Template *</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedTemplateId(id);
                      const t = templates?.find((x: any) => String(x.id) === String(id));
                      if (t?.title) setIssueForm(prev => ({ ...prev, course_title: t.title }));
                    }}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  >
                    <option value="">Select Certificate Template...</option>
                    {templates?.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.title || 'Untitled Template'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={issueForm.student_name}
                    onChange={(e) => setIssueForm({ ...issueForm, student_name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Student Email</label>
                  <input
                    type="email"
                    value={issueForm.student_email}
                    onChange={(e) => setIssueForm({ ...issueForm, student_email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Course / Certificate Title *</label>
                  <input
                    type="text"
                    required
                    value={issueForm.course_title}
                    onChange={(e) => setIssueForm({ ...issueForm, course_title: e.target.value })}
                    placeholder="e.g. AI-Based Problem Solving"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsIssueModalOpen(false)} 
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} /> Issue Certificate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-black text-gray-800 leading-none mb-0.5">{value}</div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">{title}</div>
      </div>
    </div>
  );
}
