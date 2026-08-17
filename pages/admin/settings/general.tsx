import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Settings, Image as ImageIcon, Users, Layout, 
  Globe, Link as LinkIcon, Save, RefreshCw, Upload, Eye, Trash, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../src/lib/axios';
import { SettingService } from '../../../src/lib/api/admin/SettingService';

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState('Platform');
  const [isSaving, setIsSaving] = useState(false);
  const { data: settingsData, mutate, isLoading } = SettingService.useSystemSettings('general');

  const [formData, setFormData] = useState<any>({});
  const isDirty = JSON.stringify(formData) !== JSON.stringify(settingsData || {});

  React.useEffect(() => {
    if (settingsData) {
      setFormData(settingsData);
    }
  }, [settingsData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SettingService.updateSystemSettings('general', formData);
      toast.success('Settings saved successfully!');
      mutate();
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all unsaved changes?")) {
      setFormData(settingsData || {});
      toast.success('Settings reset to database values');
    }
  };

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const tabs = [
    { id: 'Platform', icon: Globe, label: 'Platform Info' },
    { id: 'Branding', icon: ImageIcon, label: 'Branding & Theme' },
    { id: 'Roles', icon: Users, label: 'Role Wise Branding' },
    { id: 'Homepage', icon: Layout, label: 'Homepage' },
    { id: 'Social', icon: LinkIcon, label: 'Social Links' },
  ];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>General Settings | BlueBoxx DA</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">General Settings</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Manage global platform configurations, branding, and themes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <AlertCircle size={14} /> Unsaved Changes
            </span>
          )}
          <a href="/" target="_blank" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <Eye size={16} /> Preview
          </a>
          <button onClick={handleReset} disabled={!isDirty} className="disabled:opacity-50 flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={16} /> Reset
          </button>
          <button onClick={handleSave} disabled={isSaving || !isDirty} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-70">
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} 
            Save Settings
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 flex lg:flex-col gap-1 overflow-x-auto admin-scrollbar">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#1B2A6B] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-slate-400'} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-220px)] flex flex-col">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>

          <div className="p-6 flex-1 overflow-y-auto admin-scrollbar">
            
            {activeTab === 'Platform' && (
              <div className="space-y-6 max-w-3xl">
                {isLoading ? (
                  <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                    <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Website Name *</label>
                    <input type="text" value={formData.website_name || ''} onChange={e => handleChange('website_name', e.target.value)} placeholder="Blueboxx DA" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Website Tagline</label>
                    <input type="text" value={formData.website_tagline || ''} onChange={e => handleChange('website_tagline', e.target.value)} placeholder="Empowering Education & Learning" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Website URL *</label>
                    <input type="url" value={formData.website_url || ''} onChange={e => handleChange('website_url', e.target.value)} placeholder="https://blueboxx.in" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Support Email</label>
                    <input type="email" value={formData.support_email || ''} onChange={e => handleChange('support_email', e.target.value)} placeholder="support@blueboxx.in" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Support Phone</label>
                    <input type="text" value={formData.support_phone || ''} onChange={e => handleChange('support_phone', e.target.value)} placeholder="+91 9876543210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  </div>
                </div>
                )}
              </div>
            )}

            {activeTab === 'Branding' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Theme Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={formData.primary_color || '#1B2A6B'} onChange={e => handleChange('primary_color', e.target.value)} className="w-10 h-10 p-0.5 border border-slate-200 rounded cursor-pointer" />
                        <input type="text" value={formData.primary_color || '#1B2A6B'} onChange={e => handleChange('primary_color', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={formData.secondary_color || '#ffffff'} onChange={e => handleChange('secondary_color', e.target.value)} className="w-10 h-10 p-0.5 border border-slate-200 rounded cursor-pointer" />
                        <input type="text" value={formData.secondary_color || '#ffffff'} onChange={e => handleChange('secondary_color', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={formData.accent_color || '#C9A227'} onChange={e => handleChange('accent_color', e.target.value)} className="w-10 h-10 p-0.5 border border-slate-200 rounded cursor-pointer" />
                        <input type="text" value={formData.accent_color || '#C9A227'} onChange={e => handleChange('accent_color', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Logos & Assets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FileUploadCard title="Main Logo" subtitle="For light backgrounds" value={formData.main_logo} onUpload={(url) => handleChange('main_logo', url)} />
                    <FileUploadCard title="Dark Logo" subtitle="For dark backgrounds" value={formData.dark_logo} onUpload={(url) => handleChange('dark_logo', url)} />
                    <FileUploadCard title="Favicon" subtitle="16x16 or 32x32 px" value={formData.favicon} onUpload={(url) => handleChange('favicon', url)} />
                    <FileUploadCard title="Login Logo" subtitle="Displayed on auth pages" value={formData.login_logo} onUpload={(url) => handleChange('login_logo', url)} />
                    <FileUploadCard title="Footer Logo" subtitle="Displayed in website footer" value={formData.footer_logo} onUpload={(url) => handleChange('footer_logo', url)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Roles' && (
              <div className="space-y-6 max-w-4xl">
                <p className="text-sm font-medium text-slate-500 mb-4">Customize the dashboard experience for specific user roles across the platform.</p>
                
                {['Admin', 'Student', 'Expert', 'Company', 'College'].map((role) => (
                  <div key={role} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                      <Users size={18} className="text-[#1B2A6B]" /> {role} Dashboard
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Welcome Text</label>
                          <input type="text" value={formData[`${role.toLowerCase()}_welcome_text`] || `Welcome to the ${role} Portal!`} onChange={(e) => handleChange(`${role.toLowerCase()}_welcome_text`, e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                        </div>
                        <FileUploadCard title="Dashboard Logo" subtitle="Top left corner" compact value={formData[`${role.toLowerCase()}_dashboard_logo`]} onUpload={(url) => handleChange(`${role.toLowerCase()}_dashboard_logo`, url)} />
                      </div>
                      <div className="h-full">
                        <FileUploadCard title="Login Background" subtitle="Auth page background image" compact value={formData[`${role.toLowerCase()}_login_bg`]} onUpload={(url) => handleChange(`${role.toLowerCase()}_login_bg`, url)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Homepage' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Hero Title</label>
                  <input type="text" value={formData.hero_title || ''} onChange={e => handleChange('hero_title', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Hero Subtitle</label>
                  <textarea rows={3} value={formData.hero_subtitle || ''} onChange={e => handleChange('hero_subtitle', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none" />
                </div>
                <div className="h-px bg-slate-100 my-4"></div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Footer Copyright Text</label>
                  <input type="text" value={formData.footer_copyright || ''} onChange={e => handleChange('footer_copyright', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
            )}

            {activeTab === 'Social' && (
              <div className="space-y-6 max-w-3xl">
                {[
                  { id: 'facebook_url', name: 'Facebook' },
                  { id: 'instagram_url', name: 'Instagram' },
                  { id: 'linkedin_url', name: 'LinkedIn' },
                  { id: 'youtube_url', name: 'YouTube' },
                  { id: 'twitter_url', name: 'Twitter' }
                ].map((social) => (
                  <div key={social.name} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="w-24 shrink-0">
                      <span className="text-sm font-black text-slate-700">{social.name}</span>
                    </div>
                    <input type="url" value={formData[social.id] || ''} onChange={e => handleChange(social.id, e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

function FileUploadCard({ title, subtitle, compact = false, value, onUpload }: { title: string, subtitle: string, compact?: boolean, value?: string, onUpload: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      
      try {
        const res = await api.post('/admin/upload', data);
        onUpload(res.data.url);
        toast.success(`${title} uploaded successfully`);
      } catch (err) {
        toast.error(`Failed to upload ${title}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">{title}</label>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {value ? (
        <div className={`relative border border-slate-200 rounded-xl overflow-hidden group bg-slate-50 ${compact ? 'h-[120px]' : 'h-[160px]'}`}>
          <img src={value} alt={title} className="w-full h-full object-contain p-2" />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-800 px-4 py-2 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 w-28 justify-center hover:bg-slate-50">
              <RefreshCw size={14} /> Change
            </button>
            <button onClick={() => onUpload('')} className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 w-28 justify-center hover:bg-red-600">
              <Trash size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-200 rounded-xl text-center hover:bg-white transition-colors cursor-pointer group bg-slate-50/50 ${compact ? 'p-4 h-[120px] flex flex-col justify-center' : 'p-6'} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className={`bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform ${compact ? 'w-8 h-8' : 'w-12 h-12 mb-3'}`}>
            {isUploading ? <RefreshCw size={compact ? 16 : 20} className="animate-spin" /> : <Upload size={compact ? 16 : 20} />}
          </div>
          <p className={`font-bold text-slate-800 ${compact ? 'text-xs' : 'text-sm'}`}>{isUploading ? 'Uploading...' : 'Click to upload'}</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-1">{subtitle}</p>
        </div>
      )}
    </div>
  );
}
