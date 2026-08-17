import React from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThemeFontPage() {
  return (
    <AdminDashboardLayout>
      <Head>
        <title>Theme Font | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">THEME FONT</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-end mb-6">
            <button className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
              <Plus size={16} /> API SETTINGS
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">USE GOOGLE FONT <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] appearance-none bg-white">
                  <option>No</option>
                  <option>Yes</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">FONT 1 <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] appearance-none bg-white">
                  <option></option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">FONT 2 <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] appearance-none bg-white">
                  <option></option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <button onClick={() => toast.success("Saved")} className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-8 py-2.5 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> SAVE
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
