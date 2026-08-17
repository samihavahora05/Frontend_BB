import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { Plus } from 'lucide-react';

export default function ThemesPage() {
  return (
    <AdminDashboardLayout>
      <Head>
        <title>Themes | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">THEMES</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Themes</h2>
            <button className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
              <Plus size={16} /> Add New/Update
            </button>
          </div>

          <div className="flex gap-6">
            {/* Active Theme Card */}
            <div className="w-[400px] border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-blue-600 relative">
                {/* Mock Image Content */}
                <div className="absolute inset-0 p-4">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Get unlimited access<br/>to 5000+ courses.</h3>
                    <p className="text-xs opacity-80">Choose from over 100,000 online video courses with new additions published every month.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm font-semibold text-gray-800">infixlmstheme</p>
              </div>
            </div>

            {/* Add New Theme Card */}
            <div className="w-[400px] border-2 border-dashed border-gray-300 rounded-lg h-[244px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <Plus size={32} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
