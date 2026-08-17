import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import api from '../../../src/lib/axios';
import {
  Video, Shield, Settings, CheckCircle, XCircle,
  Eye, EyeOff, Wifi, WifiOff, RefreshCw, Save, TestTube
} from 'lucide-react';

const fetcher = (url: string) => api.get(url).then(r => r.data);

const RadioGroup = ({ label, value, options, onChange }: {
  label: string; value: string; options: { label: string; value: string }[]; onChange: (v: string) => void;
}) => (
  <div>
    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">{label}</label>
    <div className="flex flex-wrap items-center gap-4">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${value === opt.value ? 'border-[#C9A227] bg-[#C9A227]' : 'border-gray-300 group-hover:border-[#C9A227]'}`}>
            {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
          </div>
          <input type="radio" checked={value === opt.value} onChange={() => onChange(opt.value)} className="sr-only"/>
          <span className="text-sm font-semibold text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);

export default function ZoomSettingsPage() {
  const { data, mutate, isLoading } = useSWR('/admin/zoom-settings', fetcher);
  const [settings, setSettings] = useState<any>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');

  useEffect(() => {
    if (data?.data) {
      setSettings({ ...data.data });
    }
  }, [data]);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const payload = { ...settings };
      // Don't send masked secret
      if (payload.client_secret_masked && !showSecret) {
        delete payload.client_secret;
      }
      delete payload.client_secret_masked;
      delete payload.has_credentials;

      await api.put('/admin/zoom-settings', payload);
      mutate();
      toast.success('Zoom settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('idle');
    setConnectionMessage('');
    try {
      const res = await api.post('/admin/zoom-settings/test-connection');
      if (res.data?.success) {
        setConnectionStatus('success');
        setConnectionMessage(res.data?.message || 'Connection successful!');
        toast.success('Zoom connection verified!');
      } else {
        setConnectionStatus('error');
        setConnectionMessage(res.data?.message || 'Connection failed.');
        toast.error('Zoom connection failed');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Connection test failed';
      setConnectionStatus('error');
      setConnectionMessage(msg);
      toast.error(msg);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#1B2A6B] border-t-transparent rounded-full animate-spin"/>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <Head><title>Zoom Settings | BlueBoxx DA</title></Head>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <Video size={28} className="text-[#C9A227]"/> Zoom Integration Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Configure Zoom Server-to-Server OAuth and default meeting preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => mutate()} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600">
            <RefreshCw size={16}/>
          </button>
          <button
            onClick={handleTestConnection}
            disabled={isTesting || !settings?.has_credentials}
            title={!settings?.has_credentials ? 'Save credentials first before testing' : ''}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-emerald-400 text-gray-700 rounded-xl font-bold text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting
              ? <><span className="w-4 h-4 border-2 border-gray-400 border-t-emerald-500 rounded-full animate-spin"/> Testing...</>
              : <><TestTube size={16} className="text-emerald-500"/> Test Connection</>
            }
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-70"
          >
            {isSaving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              : <Save size={16}/>
            }
            Save Settings
          </button>
        </div>
      </div>

      {/* Connection Status Banner */}
      {connectionStatus !== 'idle' && (
        <div className={`mb-5 p-4 rounded-xl border flex items-center gap-3 ${connectionStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {connectionStatus === 'success' ? <CheckCircle size={20} className="shrink-0"/> : <XCircle size={20} className="shrink-0"/>}
          <p className="text-sm font-bold">{connectionMessage}</p>
          <button onClick={() => setConnectionStatus('idle')} className="ml-auto text-current opacity-60 hover:opacity-100">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        {/* Credentials Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={16}/>
            </div>
            <div>
              <h2 className="font-black text-gray-800 text-sm">Zoom Server-to-Server OAuth Credentials</h2>
              <p className="text-xs text-gray-500 mt-0.5">These credentials are required for creating and managing Zoom meetings programmatically.</p>
            </div>
            {settings.has_credentials && (
              <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle size={12}/> Configured
              </span>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2">Account ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={settings.account_id || ''}
                onChange={e => setSettings({ ...settings, account_id: e.target.value })}
                placeholder="Your Zoom Account ID"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2">Client ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={settings.client_id || ''}
                onChange={e => setSettings({ ...settings, client_id: e.target.value })}
                placeholder="Your Zoom Client ID"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block mb-2">Client Secret <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={showSecret ? (settings.client_secret || '') : (settings.client_secret_masked || settings.client_secret || '')}
                  onChange={e => { if (showSecret) setSettings({ ...settings, client_secret: e.target.value }); }}
                  readOnly={!showSecret}
                  placeholder={settings.has_credentials ? 'Click 👁 to edit' : 'Your Zoom Client Secret'}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!showSecret && settings.has_credentials) {
                      setSettings({ ...settings, client_secret: '' });
                    }
                    setShowSecret(!showSecret);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showSecret ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {settings.has_credentials && !showSecret && (
                <p className="text-[10px] text-gray-400 mt-1">Click the eye icon to update this value</p>
              )}
            </div>
          </div>

          <div className="px-6 pb-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 font-semibold">
              <strong className="font-black">How to get credentials:</strong> Go to{' '}
              <a href="https://marketplace.zoom.us" target="_blank" className="underline font-bold">marketplace.zoom.us</a>
              {' '}→ Develop → Build App → Server-to-Server OAuth → Copy Account ID, Client ID, and Client Secret.
            </div>
          </div>
        </div>

        {/* Meeting Settings Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Settings size={16}/>
            </div>
            <div>
              <h2 className="font-black text-gray-800 text-sm">Default Meeting Preferences</h2>
              <p className="text-xs text-gray-500 mt-0.5">These settings will be applied to all new meetings by default.</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RadioGroup
              label="Auto Recording"
              value={settings.auto_recording || 'none'}
              options={[{ label: 'None', value: 'none' }, { label: 'Local', value: 'local' }, { label: 'Cloud', value: 'cloud' }]}
              onChange={v => setSettings({ ...settings, auto_recording: v })}
            />
            <RadioGroup
              label="Audio Options"
              value={settings.audio_options || 'both'}
              options={[{ label: 'Both', value: 'both' }, { label: 'Telephony', value: 'telephony' }, { label: 'VoIP', value: 'voip' }]}
              onChange={v => setSettings({ ...settings, audio_options: v })}
            />
            <RadioGroup
              label="Host Video"
              value={settings.host_video || 'disable'}
              options={[{ label: 'Enable', value: 'enable' }, { label: 'Disable', value: 'disable' }]}
              onChange={v => setSettings({ ...settings, host_video: v })}
            />
            <RadioGroup
              label="Participant Video"
              value={settings.participant_video || 'disable'}
              options={[{ label: 'Enable', value: 'enable' }, { label: 'Disable', value: 'disable' }]}
              onChange={v => setSettings({ ...settings, participant_video: v })}
            />
            <RadioGroup
              label="Join Before Host"
              value={settings.join_before_host || 'disable'}
              options={[{ label: 'Enable', value: 'enable' }, { label: 'Disable', value: 'disable' }]}
              onChange={v => setSettings({ ...settings, join_before_host: v })}
            />
            <RadioGroup
              label="Waiting Room"
              value={settings.waiting_room || 'enable'}
              options={[{ label: 'Enable', value: 'enable' }, { label: 'Disable', value: 'disable' }]}
              onChange={v => setSettings({ ...settings, waiting_room: v })}
            />
            <RadioGroup
              label="Mute Upon Entry"
              value={settings.mute_upon_entry || 'enable'}
              options={[{ label: 'Enable', value: 'enable' }, { label: 'Disable', value: 'disable' }]}
              onChange={v => setSettings({ ...settings, mute_upon_entry: v })}
            />
            <div className="md:col-span-2 lg:col-span-2">
              <RadioGroup
                label="Class Join Approval"
                value={settings.class_join_approval || 'automatically'}
                options={[
                  { label: 'Automatically', value: 'automatically' },
                  { label: 'Manually Approve', value: 'manually' },
                  { label: 'No Registration Required', value: 'no-registration' },
                ]}
                onChange={v => setSettings({ ...settings, class_join_approval: v })}
              />
            </div>
          </div>
        </div>

        {/* Save Row */}
        <div className="flex justify-end gap-3 pb-8">
          <button onClick={() => mutate()} className="px-5 py-2.5 text-sm font-bold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl">
            Reset Changes
          </button>
          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-2 px-7 py-2.5 bg-[#1B2A6B] hover:bg-[#121c47] text-white rounded-xl font-black text-sm shadow-md disabled:opacity-70">
            {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save size={16}/>}
            Save All Settings
          </button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
