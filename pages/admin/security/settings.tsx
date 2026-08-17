import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  ShieldAlert, Save, RefreshCw, Lock, 
  Key, ShieldCheck, Smartphone, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

import { SettingService } from '../../../src/lib/api/admin/SettingService';

export default function SecuritySettingsPage() {
  const { data: settingsData, mutate, isLoading } = SettingService.useSystemSettings('security');
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (settingsData) {
      setFormData({
        is_2fa_enabled: settingsData.is_2fa_enabled === 'true' || settingsData.is_2fa_enabled === true || false,
        min_password_length: settingsData.min_password_length || 8,
        require_special_chars: settingsData.require_special_chars === 'true' || settingsData.require_special_chars === true || false,
        password_expiry: settingsData.password_expiry || '90',
        max_failed_logins: settingsData.max_failed_logins || '5',
        session_timeout: settingsData.session_timeout || '120',
      });
    }
  }, [settingsData]);

  const isDirty = JSON.stringify(formData) !== JSON.stringify({
    is_2fa_enabled: settingsData?.is_2fa_enabled === 'true' || settingsData?.is_2fa_enabled === true || false,
    min_password_length: settingsData?.min_password_length || 8,
    require_special_chars: settingsData?.require_special_chars === 'true' || settingsData?.require_special_chars === true || false,
    password_expiry: settingsData?.password_expiry || '90',
    max_failed_logins: settingsData?.max_failed_logins || '5',
    session_timeout: settingsData?.session_timeout || '120',
  });

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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await SettingService.updateSystemSettings('security', formData);
      await mutate();
      toast.success('Security policies updated successfully!');
    } catch (error) {
      toast.error('Failed to update security policies');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all unsaved changes?")) {
      setFormData({
        is_2fa_enabled: settingsData?.is_2fa_enabled === 'true' || settingsData?.is_2fa_enabled === true || false,
        min_password_length: settingsData?.min_password_length || 8,
        require_special_chars: settingsData?.require_special_chars === 'true' || settingsData?.require_special_chars === true || false,
        password_expiry: settingsData?.password_expiry || '90',
        max_failed_logins: settingsData?.max_failed_logins || '5',
        session_timeout: settingsData?.session_timeout || '120',
      });
      toast.success('Settings reset to database values');
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Security Settings | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Security Settings</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Configure authentication, password policies, and session controls.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <ShieldAlert size={14} /> Unsaved Changes
            </span>
          )}
          <button onClick={handleReset} disabled={!isDirty} className="disabled:opacity-50 flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={16} /> Reset Default
          </button>
          <button onClick={handleSave} disabled={!isDirty || isSaving} className="disabled:opacity-70 flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors">
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} 
            Save Policies
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
        
        {/* Authentication Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500"/> Authentication
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Smartphone size={16} className="text-[#1B2A6B]"/> Enforce Two-Factor Authentication (2FA)</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1 max-w-md leading-relaxed">Require all users to verify their identity using an authenticator app when logging in.</p>
              </div>
              <label className="flex items-center cursor-pointer gap-3 mt-1">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={formData.is_2fa_enabled || false} onChange={() => setFormData({...formData, is_2fa_enabled: !formData.is_2fa_enabled})} />
                  <div className={`block w-12 h-7 rounded-full transition-colors ${formData.is_2fa_enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.is_2fa_enabled ? 'transform translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="h-px bg-slate-100"></div>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Key size={16} className="text-amber-500"/> Require Special Characters in Passwords</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1 max-w-md leading-relaxed">Force users to include at least one number and one special character (!@#$).</p>
              </div>
              <label className="flex items-center cursor-pointer gap-3 mt-1">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={formData.require_special_chars || false} onChange={() => setFormData({...formData, require_special_chars: !formData.require_special_chars})} />
                  <div className={`block w-12 h-7 rounded-full transition-colors ${formData.require_special_chars ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.require_special_chars ? 'transform translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Minimum Password Length</label>
              <div className="flex items-center gap-4">
                <input type="range" min="8" max="32" value={formData.min_password_length || 8} onChange={(e) => setFormData({...formData, min_password_length: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A6B]"/>
                <span className="w-12 text-center bg-slate-100 text-slate-800 font-bold text-sm py-1 rounded-lg border border-slate-200">{formData.min_password_length || 8}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protection Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-500"/> Access Protection
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            
            <div>
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2"><Lock size={16} className="text-[#1B2A6B]"/> Max Failed Login Attempts</label>
              <p className="text-xs font-semibold text-slate-500 mb-3 leading-relaxed">Automatically lock an account and IP address after too many failed attempts.</p>
              <div className="relative">
                <select value={formData.max_failed_logins || '5'} onChange={(e) => setFormData({...formData, max_failed_logins: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] appearance-none cursor-pointer">
                  <option value="3">3 Attempts (Strict)</option>
                  <option value="5">5 Attempts (Standard)</option>
                  <option value="10">10 Attempts (Lenient)</option>
                  <option value="0">Disabled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            <div>
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2"><Clock size={16} className="text-[#1B2A6B]"/> Session Timeout (Minutes)</label>
              <p className="text-xs font-semibold text-slate-500 mb-3 leading-relaxed">Log users out automatically if they remain inactive.</p>
              <input type="number" value={formData.session_timeout || '120'} onChange={(e) => setFormData({...formData, session_timeout: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2"><Key size={16} className="text-[#1B2A6B]"/> Password Expiration (Days)</label>
              <p className="text-xs font-semibold text-slate-500 mb-3 leading-relaxed">Force users to change their password periodically.</p>
              <div className="relative">
                <select value={formData.password_expiry || '90'} onChange={(e) => setFormData({...formData, password_expiry: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] appearance-none cursor-pointer">
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="0">Never Expires</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
