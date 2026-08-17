import React from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { AlertOctagon } from 'lucide-react';

export default function ErrorLogPage() {
  return (
    <AdminDashboardLayout>
      <Head>
        <title>Error Log | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <AlertOctagon className="text-rose-600" size={28} />
              System Error Log
            </h1>
            <p className="text-sm text-slate-500 mt-1">View backend exception traces and frontend error reports.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <AlertOctagon size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Recent Errors</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">The system is running smoothly. Future application exceptions will be logged here for debugging.</p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
