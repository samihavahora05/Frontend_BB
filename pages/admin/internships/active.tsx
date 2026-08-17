import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { Briefcase, Search, Users, ExternalLink, Calendar, RefreshCw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { InternshipService } from '../../../src/lib/api/admin/InternshipService';

function Pagination({ meta, page, setPage }: { meta: any; page: number; setPage: (p: number) => void }) {
  if (!meta?.last_page || meta.last_page <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-sm">
      <span className="text-gray-500 font-medium">
        Showing {meta.from ?? 1}–{meta.to ?? meta.total} of {meta.total}
      </span>
      <div className="flex gap-1">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 text-gray-600">
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`w-8 h-8 rounded text-sm font-bold ${p === page ? 'bg-[#1B2A6B] text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
            {p}
          </button>
        ))}
        <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 text-gray-600">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ActiveInternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);

  const { data: stats } = InternshipService.useStats();

  const { data: internships, meta, isLoading, mutate } = InternshipService.useInternships({
    status: 'open',
    search: searchTerm || undefined,
    page,
    per_page: 15,
  });

  return (
    <AdminDashboardLayout>
      <Head><title>Active Internships | BlueBoxx DA</title></Head>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#C9A227]" />
              Active Internships
            </h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">
              Monitor currently open internship programs and their applicant count.
            </p>
          </div>
          <button onClick={() => mutate()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats Cards — real from API */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h3 className="text-sm font-bold text-indigo-600 mb-2">Total Open</h3>
            <p className="text-3xl font-black text-indigo-900">
              {stats ? stats.open : <Loader2 size={24} className="animate-spin text-indigo-400" />}
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-6">
            <h3 className="text-sm font-bold text-green-600 mb-2">Total Applications</h3>
            <p className="text-3xl font-black text-green-900">
              {stats ? stats.applications : <Loader2 size={24} className="animate-spin text-green-400" />}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
            <h3 className="text-sm font-bold text-amber-600 mb-2">Pending Review</h3>
            <p className="text-3xl font-black text-amber-900">
              {stats ? stats.pending : <Loader2 size={24} className="animate-spin text-amber-400" />}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Open Programs</h2>
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Search internships…" value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 size={32} className="animate-spin text-[#1B2A6B]" />
              </div>
            ) : internships.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Briefcase size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-500 font-semibold">
                  {searchTerm ? 'No internships match your search.' : 'No open internships at the moment.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Internship Details</th>
                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Mode</th>
                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Stipend</th>
                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Applications</th>
                    <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {internships.map((internship: any) => (
                    <tr key={internship.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 text-sm">{internship.title}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          {internship.location || 'Remote'} • ID #{internship.id}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {internship.start_date
                            ? `${new Date(internship.start_date).toLocaleDateString()} – ${internship.end_date ? new Date(internship.end_date).toLocaleDateString() : 'TBD'}`
                            : internship.duration || '–'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          internship.mode === 'Remote'   ? 'bg-blue-50 text-blue-600' :
                          internship.mode === 'Onsite'   ? 'bg-green-50 text-green-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {internship.mode || '–'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gray-700">
                        {internship.stipend ? `₹${Number(internship.stipend).toLocaleString()}/mo` : 'Unpaid'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-max">
                          <Users className="w-4 h-4" />
                          {internship.applications_count ?? 0} Applications
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link href={`/admin/internships/applications?internshipId=${internship.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ml-auto w-fit">
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Applications
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Pagination meta={meta} page={page} setPage={setPage} />
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
