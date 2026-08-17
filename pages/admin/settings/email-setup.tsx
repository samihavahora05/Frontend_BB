import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Mail, Save, RefreshCw, Eye, EyeOff, Send, 
  CheckCircle2, XCircle, Globe, Key, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SettingService } from '../../../src/lib/api/admin/SettingService';

export default function EmailSetupPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const { data: smtpData, mutate, isLoading } = SettingService.useSystemSettings('smtp');

  // Form State
  const [formData, setFormData] = useState({
    mailer: 'SMTP',
    host: '',
    port: '',
    encryption: 'TLS',
    username: '',
    password: '',
    from_name: '',
    from_address: ''
  });

  useEffect(() => {
    if (smtpData) {
      setFormData(prev => ({ ...prev, ...smtpData }));
      setIsConnected(!!smtpData.host && !!smtpData.username);
    }
  }, [smtpData]);

  // Test Modal State
  const [testEmail, setTestEmail] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await SettingService.updateSystemSettings('smtp', formData);
      toast.success('Email settings saved successfully!');
      setIsConnected(true);
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    try {
      await SettingService.testSmtpConnection(testEmail);
      toast.success(`Test email successfully sent to ${testEmail}!`);
      setIsTestModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send test email. Please check your SMTP settings.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Email Setup | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Email Setup (SMTP)</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Configure your outgoing mail server for platform notifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        
        {/* Main Configuration Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Mail size={18} className="text-[#1B2A6B]"/> Configuration Form
            </h2>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-6">
            
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Mailer Type</label>
                <div className="relative">
                  <select value={formData.mailer} onChange={e => handleChange('mailer', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] appearance-none cursor-pointer">
                    <option value="SMTP">SMTP</option>
                    <option value="Mailgun">Mailgun API</option>
                    <option value="SendGrid">SendGrid API</option>
                    <option value="Amazon SES">Amazon SES</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <Globe size={16}/>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Encryption</label>
                <div className="relative">
                  <select value={formData.encryption} onChange={e => handleChange('encryption', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] appearance-none cursor-pointer">
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="starttls">STARTTLS</option>
                    <option value="none">None</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <Key size={16}/>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">SMTP Host</label>
                <input required type="text" value={formData.host} onChange={e => handleChange('host', e.target.value)} placeholder="smtp.mailtrap.io" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">SMTP Port</label>
                <input required type="text" value={formData.port} onChange={e => handleChange('port', e.target.value)} placeholder="587" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>

              <div className="md:col-span-2 h-px bg-slate-100 my-2"></div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Username / Email Address</label>
                <input required type="text" value={formData.username} onChange={e => handleChange('username', e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Password / API Key</label>
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleChange('password', e.target.value)} className="w-full pl-4 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 h-px bg-slate-100 my-2"></div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">From Name</label>
                <div className="relative">
                  <input required type="text" value={formData.from_name} onChange={e => handleChange('from_name', e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">From / Reply-To Email</label>
                <input required type="email" value={formData.from_address} onChange={e => handleChange('from_address', e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>

            </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button type="button" onClick={() => { setFormData(smtpData || {}); toast.success('Reverted to saved settings') }} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                <RefreshCw size={14}/> Reset
              </button>
              
              <div className="flex gap-3">
                <button type="submit" disabled={isSaving || isLoading} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-70">
                  {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} 
                  Save Configuration
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${isConnected ? 'bg-emerald-100 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
              {isConnected ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{isConnected ? 'Connected' : 'Disconnected'}</h3>
            <p className="text-sm font-semibold text-slate-500 mb-6 px-4">
              {isConnected ? 'Your SMTP configuration is saved and ready to send emails.' : 'Configure and save your SMTP server to enable platform email notifications.'}
            </p>
          </div>

          {/* Test Email Card */}
          <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 transition-opacity ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Send size={16} className="text-blue-500"/> Connection Test
            </h3>
            <p className="text-sm font-semibold text-slate-500 mb-4">Send a test email to verify that your SMTP configuration is working correctly.</p>
            <button onClick={() => setIsTestModalOpen(true)} className="w-full flex justify-center items-center gap-2 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl transition-colors">
              <Send size={16}/> Send Test Email
            </button>
          </div>

        </div>

      </div>

      {/* Test Email Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsTestModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                Send Test Email
              </h2>
            </div>
            
            <form onSubmit={handleSendTestEmail} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Recipient Email *</label>
                <input required type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="admin@example.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              
              <div className="pt-4 flex gap-3 mt-6">
                <button type="button" onClick={() => setIsTestModalOpen(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                <button type="submit" disabled={isTesting} className="flex-1 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl hover:bg-[#121c47] shadow-md transition-colors flex justify-center items-center gap-2">
                  {isTesting ? <RefreshCw size={16} className="animate-spin"/> : <Send size={16}/>}
                  {isTesting ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
