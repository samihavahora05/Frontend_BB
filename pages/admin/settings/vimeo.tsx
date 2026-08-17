import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import toast from 'react-hot-toast';

export default function VimeoConfigurationPage() {
  const [commonUser, setCommonUser] = useState('yes');
  const [uploadType, setUploadType] = useState('from-list');

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Vimeo Configuration | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">VIMEO CONFIGURATION</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-8">Vimeo Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            
            {/* COMMON API USER */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">COMMON API USER FOR ALL USER</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={commonUser === 'yes'} onChange={() => setCommonUser('yes')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={commonUser === 'no'} onChange={() => setCommonUser('no')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                  <span className="text-sm text-gray-600">No</span>
                </label>
              </div>
            </div>

            {/* VIMEO CLIENT */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">VIMEO CLIENT *</label>
              <input type="text" defaultValue="-" className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
            </div>

            {/* VIMEO SECRET */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">VIMEO SECRET *</label>
              <input type="text" defaultValue="-" className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
            </div>

            {/* VIMEO ACCESS */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">VIMEO ACCESS *</label>
              <input type="text" defaultValue="-" className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" />
            </div>

          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">VIMEO VIDEO UPLOAD TYPE</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={uploadType === 'direct'} onChange={() => setUploadType('direct')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                <span className="text-sm text-gray-600">Direct Upload</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={uploadType === 'from-list'} onChange={() => setUploadType('from-list')} className="w-4 h-4 text-[#C9A227] border-gray-300 focus:ring-[#C9A227]" />
                <span className="text-sm text-gray-600">From List</span>
              </label>
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-1 mb-6">
            <p><a href="#" className="text-blue-500 hover:underline">Click Here To Get Vimeo Api Key</a> | <span className="text-blue-500">Scopes need to allow public,private,edit,upload</span></p>
            <p>For Secure, Change Privacy to <span className="font-bold">Hide From Vimeo</span></p>
            <p>Where can the video be embedded? Set <span className="font-bold">Use Specific domains</span> & register your domain without http/https</p>
            <p>Direct upload is not allow for Vimeo basic plan</p>
          </div>

          <div>
            <button onClick={() => toast.success("Updated")} className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-8 py-2.5 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> UPDATE
            </button>
          </div>
          
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
