import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '@/layout/AdminDashboardLayout';
import { CertificateApiService } from '@/lib/api/admin/CertificateApiService';
import toast from 'react-hot-toast';

export default function CertificateSettingPage() {
  const { data: settings, mutate, isLoading } = CertificateApiService.useSettings();
  const { data: templates } = CertificateApiService.useTemplates();
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await CertificateApiService.updateSettings(formData);
      toast.success("Updated Successfully");
      mutate();
    } catch (e: any) {
      toast.error('Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <AdminDashboardLayout>Loading...</AdminDashboardLayout>;

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Certificate Setting | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">CERTIFICATE SETTING</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-8">General Settings</h2>
          
          <div className="space-y-6 mb-8">
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">ENABLE QR CODE</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.enable_qr_code === 1 || formData.enable_qr_code === true} onChange={() => setFormData({...formData, enable_qr_code: true})} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.enable_qr_code === 0 || formData.enable_qr_code === false} onChange={() => setFormData({...formData, enable_qr_code: false})} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">ENABLE PUBLIC VERIFICATION</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.enable_verification === 1 || formData.enable_verification === true} onChange={() => setFormData({...formData, enable_verification: true})} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.enable_verification === 0 || formData.enable_verification === false} onChange={() => setFormData({...formData, enable_verification: false})} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">No</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CERTIFICATE TITLE PREFIX</label>
                <input type="text" value={formData.prefix || ''} onChange={e => setFormData({...formData, prefix: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">NUMBER FORMAT</label>
                <input type="text" value={formData.number_format || ''} onChange={e => setFormData({...formData, number_format: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ISSUE DATE FORMAT</label>
                <div className="relative">
                  <select value={formData.date_format || ''} onChange={e => setFormData({...formData, date_format: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] appearance-none bg-white">
                    <option value="F j, Y">F j, Y (July 21, 2026)</option>
                    <option value="Y-m-d">Y-m-d (2026-07-21)</option>
                    <option value="d-m-Y">d-m-Y (21-07-2026)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DEFAULT TEMPLATE</label>
                <div className="relative">
                  <select value={formData.default_template_id || ''} onChange={e => setFormData({...formData, default_template_id: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] appearance-none bg-white">
                    <option value="">Select Template</option>
                    {templates?.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div>
            <button disabled={isSubmitting} onClick={handleUpdate} className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-8 py-2.5 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 
              {isSubmitting ? 'UPDATING...' : 'UPDATE'}
            </button>
          </div>
          
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
