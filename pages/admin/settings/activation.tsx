import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  ShieldCheck, ShieldAlert, Key, Globe, 
  Plus, Search, Filter, Trash2, Edit, X, RefreshCw, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SettingService } from '../../../src/lib/api/admin/SettingService';

const formatYYYYMMDD = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
};

const formatMMM_D_YYYY = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface LicenseRecord {
  id: number;
  license_key: string;
  domain: string;
  email: string;
  status: 'active' | 'expired' | 'suspended';
  expires_at: string;
  activated_at: string;
}

export default function ActivationSettingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  
  const { data: responseData, mutate, isLoading } = SettingService.useLicenses({
    search: searchQuery,
    status: statusFilter,
    page: page,
    per_page: 15
  });

  const licenses = responseData?.data || [];
  const totalKeys = responseData?.total || 0;
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    email: '', license_key: '', domain: '', expires_at: '', status: 'active'
  });

  const handleSaveLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      license_key: formData.license_key || `BLBX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-XXXX`,
      domain: formData.domain,
      email: formData.email,
      expires_at: formData.expires_at,
      status: formData.status.toLowerCase(),
    };

    try {
      if (selectedLicense) {
        await SettingService.updateLicense(selectedLicense.id, payload);
        toast.success('License updated successfully');
      } else {
        await SettingService.createLicense(payload);
        toast.success('New license added successfully');
      }
      setIsAddModalOpen(false);
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save license');
    }
  };

  const handleDelete = async () => {
    if (selectedLicense) {
      try {
        await SettingService.deleteLicense(selectedLicense.id);
        setIsDeleteModalOpen(false);
        toast.success('License deleted permanently');
        mutate();
      } catch (err) {
        toast.error('Failed to delete license');
      }
    }
  };

  const handleQuickAction = async (license: LicenseRecord, action: 'activate' | 'suspend') => {
    try {
      await SettingService.actionLicense(license.id, action);
      toast.success(`License for ${license.domain} ${action}d!`);
      mutate();
    } catch (err) {
      toast.error(`Failed to ${action} license`);
    }
  };

  const openEditModal = (license: LicenseRecord) => {
    setSelectedLicense(license);
    setFormData({
      ...license,
      expires_at: license.expires_at ? formatYYYYMMDD(license.expires_at) : ''
    });
    setIsAddModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedLicense(null);
    setFormData({ email: '', license_key: '', domain: '', expires_at: '', status: 'active' });
    setIsAddModalOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Activation Settings | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">License Activation</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Manage system licenses, activation keys, and domains.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={openAddModal} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors">
            <Plus size={16} /> Add License
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Current License" value="Enterprise" icon={ShieldCheck} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="Active Domains" value={licenses.filter((l: any)=>l.status==='active').length} icon={Globe} color="bg-blue-50 text-blue-600" />
        <StatCard title="Total Keys" value={totalKeys} icon={Key} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Expired/Suspended" value={licenses.filter((l: any)=>l.status!=='active').length} icon={ShieldAlert} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
        
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest hidden lg:block">Activation Keys</h2>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                onKeyDown={(e) => { if(e.key === 'Enter') mutate(); }}
                placeholder="Search key, client or domain..." 
                className="w-full lg:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)} 
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto admin-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="p-4 pl-6">License Key</th>
                <th className="p-4">Email / Client</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Activated</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-16 h-6 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4 pr-6"><div className="w-32 h-8 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Key size={32}/>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">No licenses found</h3>
                    <p className="text-sm font-medium text-slate-500">Add a new license key or adjust your search.</p>
                  </td>
                </tr>
              ) : (
                licenses.map((lic: any) => (
                  <tr key={lic.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-mono font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Key size={14} className="text-[#1B2A6B]"/>
                        {lic.license_key}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-700 text-sm">{lic.email || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded w-fit">
                        <Globe size={14} className="text-blue-500"/> {lic.domain || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-500">{lic.activated_at ? formatMMM_D_YYYY(lic.activated_at) : '-'}</td>
                    <td className="p-4 text-sm font-bold text-slate-700">{lic.expires_at ? formatMMM_D_YYYY(lic.expires_at) : 'Lifetime'}</td>
                    <td className="p-4">
                      <StatusBadge status={lic.status} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        {lic.status === 'active' ? (
                          <button onClick={() => handleQuickAction(lic, 'suspend')} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg tooltip" title="Suspend">
                            <ShieldAlert size={16}/>
                          </button>
                        ) : (
                          <button onClick={() => handleQuickAction(lic, 'activate')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg tooltip" title="Activate">
                            <ShieldCheck size={16}/>
                          </button>
                        )}
                        
                        <button onClick={() => { setSelectedLicense(lic); setIsViewModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg tooltip" title="View Details">
                          <Eye size={16}/>
                        </button>

                        <button onClick={() => openEditModal(lic)} className="p-1.5 text-slate-400 hover:text-[#1B2A6B] hover:bg-blue-50 rounded-lg tooltip" title="Edit">
                          <Edit size={16}/>
                        </button>

                        <button onClick={() => { setSelectedLicense(lic); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg tooltip" title="Delete">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit License Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Key size={20} className="text-[#1B2A6B]"/>
                {selectedLicense ? 'Edit License' : 'Add New License'}
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleSaveLicense} className="p-6 overflow-y-auto admin-scrollbar space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Client Email *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="e.g. contact@acmecorp.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">License Key (Leave blank to auto-generate)</label>
                  <input type="text" value={formData.license_key} onChange={e => setFormData({...formData, license_key: e.target.value})} placeholder="BLBX-XXXX-XXXX-XXXX" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Authorized Domain</label>
                  <input type="text" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} placeholder="e.g. app.acmecorp.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Expiry Date</label>
                  <input type="date" value={formData.expires_at} onChange={e => setFormData({...formData, expires_at: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl hover:bg-[#121c47] shadow-md transition-colors">
                  {selectedLicense ? 'Save Changes' : 'Generate License'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsViewModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                License Details
              </h2>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"><X size={16}/></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Client Email</p>
                  <p className="text-base font-bold text-slate-800">{selectedLicense.email}</p>
                </div>
                <StatusBadge status={selectedLicense.status} />
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">License Key</p>
                <div className="bg-slate-100 px-4 py-3 rounded-xl border border-slate-200 font-mono font-black text-lg text-[#1B2A6B] tracking-widest text-center">
                  {selectedLicense.license_key}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorized Domain</p>
                  <p className="text-sm font-bold text-slate-700">{selectedLicense.domain || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">License ID</p>
                  <p className="text-sm font-bold text-slate-700">{selectedLicense.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Activated Date</p>
                  <p className="text-sm font-bold text-slate-700">{selectedLicense.activated_at ? formatMMM_D_YYYY(selectedLicense.activated_at) : '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiry Date</p>
                  <p className="text-sm font-bold text-slate-700">{selectedLicense.expires_at ? formatMMM_D_YYYY(selectedLicense.expires_at) : 'Lifetime'}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button onClick={() => setIsViewModalOpen(false)} className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 shadow-sm transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete License?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete the license for <span className="font-bold text-slate-800">{selectedLicense.domain}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className="text-xl font-black text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colors = 'bg-slate-100 text-slate-600';
  if (status === 'active') colors = 'bg-emerald-100 text-emerald-700';
  if (status === 'expired') colors = 'bg-red-100 text-red-700';
  if (status === 'suspended') colors = 'bg-amber-100 text-amber-700';
  
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${colors}`}>
      {status}
    </span>
  );
}
