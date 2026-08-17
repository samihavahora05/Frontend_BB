import React, { useState } from "react";
import Head from 'next/head';
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import toast from "react-hot-toast";

export default function PushNotificationsPage() {
  const [title, setTitle] = useState("-");
  const [details, setDetails] = useState("-");

  const handleUpdate = () => {
    toast.success("Push notification updated successfully!");
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Push Notification | Admin</title>
      </Head>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">PUSH NOTIFICATION</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-8">Push Notification</h2>
          
          <div className="space-y-6 max-w-4xl">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">TITLE <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DETAILS <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">INSTITUTE NAME</label>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] appearance-none bg-white">
                  <option>All Institute</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button onClick={handleUpdate} className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> UPDATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
