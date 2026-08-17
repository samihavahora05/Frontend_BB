import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import toast from 'react-hot-toast';

export default function MaintenancePage() {
  const [title, setTitle] = useState("We will be back soon!");
  const [subTitle, setSubTitle] = useState("Sorry for the inconvenience but we're performing some maintenance...");
  const [mode, setMode] = useState("no");

  const handleUpdate = () => {
    toast.success("Maintenance setting updated successfully!");
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Maintenance | Admin</title>
      </Head>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">MAINTENANCE</h1>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-8">Maintenance Setting</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">TITLE</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SUB TITLE</label>
              <input 
                type="text" 
                value={subTitle} 
                onChange={e => setSubTitle(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MAINTENANCE PAGE BANNER</label>
              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <input type="text" readOnly placeholder="BROWSE" className="flex-1 px-4 py-2 text-sm text-gray-500 bg-white focus:outline-none" />
                <button className="bg-[#1B2A6B] hover:bg-[#121c47] text-white px-6 py-2 text-sm font-semibold transition-colors">BROWSE</button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MAINTENANCE MODE</label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" checked={mode === 'yes'} onChange={() => setMode('yes')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" checked={mode === 'no'} onChange={() => setMode('no')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">No</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <button onClick={handleUpdate} className="bg-[#1B2A6B] hover:bg-[#121c47] text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> UPDATE
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
