import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Code, Save, RefreshCw, X, Link, CheckCircle2, 
  XCircle, Globe, Video, MessageSquare, CreditCard, Play, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SettingService } from '../../../src/lib/api/admin/SettingService';

interface APIRecord {
  id: string;
  name: string;
  category: string;
  icon: any;
  isConnected: boolean;
  apiKey?: string;
  hasSecret?: boolean;
}

const AVAILABLE_APIS = [
  { id: 'google_maps', name: 'Google Maps API', category: 'Location', icon: Globe },
  { id: 'google_oauth', name: 'Google OAuth', category: 'Authentication', icon: Globe },
  { id: 'google_analytics', name: 'Google Analytics', category: 'Analytics', icon: Globe },
  { id: 'gmail', name: 'Gmail SMTP', category: 'Communication', icon: MessageSquare },
  { id: 'openai', name: 'OpenAI', category: 'Artificial Intelligence', icon: Code },
  { id: 'cloudinary', name: 'Cloudinary', category: 'Storage', icon: Code },
  { id: 'razorpay', name: 'Razorpay', category: 'Payments', icon: CreditCard },
  { id: 'stripe', name: 'Stripe', category: 'Payments', icon: CreditCard },
  { id: 'cashfree', name: 'Cashfree', category: 'Payments', icon: CreditCard },
  { id: 'zoom', name: 'Zoom', category: 'Video Conferencing', icon: Video },
  { id: 'agora', name: 'Agora', category: 'Video Conferencing', icon: Video },
  { id: 'firebase', name: 'Firebase', category: 'Backend Services', icon: Code },
  { id: 'twilio', name: 'Twilio', category: 'Communication', icon: MessageSquare },
  { id: 'whatsapp', name: 'WhatsApp Business', category: 'Communication', icon: MessageSquare },
  { id: 'recaptcha', name: 'Google reCAPTCHA', category: 'Security', icon: ShieldCheck },
  { id: 'youtube', name: 'YouTube API', category: 'Media', icon: Play },
];

export default function APISettingsPage() {
  const { data, mutate, isLoading } = SettingService.useApiCredentials();
  const [apis, setApis] = useState<APIRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<APIRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});

  const categories = ['All', ...Array.from(new Set(AVAILABLE_APIS.map(api => api.category)))];

  // Merge available APIs with DB credentials
  useEffect(() => {
    const dbCredentials = data || [];
    const merged = AVAILABLE_APIS.map(baseApi => {
      const dbCred = dbCredentials.find((c: any) => c.provider === baseApi.id);
      return {
        ...baseApi,
        isConnected: dbCred?.status || false,
        apiKey: dbCred?.api_key || '',
        hasSecret: dbCred?.has_secret || false
      };
    });
    setApis(merged);
  }, [data]);

  const filteredApis = activeCategory === 'All' 
    ? apis 
    : apis.filter(api => api.category === activeCategory);

  const openModal = (api: APIRecord) => {
    setSelectedApi(api);
    setFormData({ api_key: api.apiKey || '', api_secret: '' });
    setIsModalOpen(true);
  };

  const handleToggleEnable = async (api: APIRecord, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening
    const newStatus = !api.isConnected;
    try {
      await SettingService.updateApiCredential(api.id, { status: newStatus });
      toast.success(`${api.name} ${newStatus ? 'Enabled' : 'Disabled'}`);
      mutate();
    } catch (err) {
      toast.error('Failed to toggle API status');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApi) {
      try {
        await SettingService.updateApiCredential(selectedApi.id, {
          api_key: formData.api_key,
          api_secret: formData.api_secret,
          status: true // Auto-enable on save
        });
        toast.success(`${selectedApi.name} API settings saved!`);
        setIsModalOpen(false);
        mutate();
      } catch (err) {
        toast.error('Failed to save settings');
      }
    }
  };

  const handleDisconnect = async () => {
    if (selectedApi) {
      try {
        await SettingService.deleteApiCredential(selectedApi.id);
        toast.success(`${selectedApi.name} credentials removed.`);
        setIsModalOpen(false);
        mutate();
      } catch (err) {
        toast.error('Failed to remove credentials');
      }
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>API Settings | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">API Integrations</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Manage all third-party integrations and encrypted API keys.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Categories Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 flex lg:flex-col gap-1 overflow-x-auto admin-scrollbar">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === category ? 'bg-[#1B2A6B] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* API Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-fit">
          {isLoading ? (
            [...Array(6)].map((_, i) => <div key={i} className="h-48 bg-slate-50 rounded-2xl animate-pulse"></div>)
          ) : filteredApis.map(api => (
            <div 
              key={api.id}
              onClick={() => openModal(api)}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              {/* Connected Glow */}
              {api.isConnected && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>}

              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${api.isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  <api.icon size={24} />
                </div>
                <div onClick={(e) => handleToggleEnable(api, e)} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer" style={{ backgroundColor: api.isConnected ? '#10b981' : '#cbd5e1' }}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${api.isConnected ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 mb-1">{api.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{api.category}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${api.isConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {api.isConnected ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                  {api.isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {api.hasSecret && (
                  <span className="text-[10px] font-bold text-slate-400">SECURE</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* API Configuration Modal */}
      {isModalOpen && selectedApi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedApi.isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  <selectedApi.icon size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">{selectedApi.name}</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">{selectedApi.category}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">API Key / Client ID</label>
                <input type="text" value={formData.api_key || ''} onChange={e => setFormData({...formData, api_key: e.target.value})} placeholder={selectedApi.apiKey ? "Encrypted (Edit to replace)" : "Enter API Key"} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Secret Key / Client Secret (Optional)</label>
                <input type="password" value={formData.api_secret || ''} onChange={e => setFormData({...formData, api_secret: e.target.value})} placeholder={selectedApi.hasSecret ? "Encrypted (Edit to replace)" : "Enter Secret Key"} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                {selectedApi.isConnected || selectedApi.apiKey ? (
                  <button type="button" onClick={handleDisconnect} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
                    Remove Credentials
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex gap-3">
                  <button type="submit" className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors">
                    <Save size={16} /> Save Settings
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
