import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import {
  Briefcase, Plus, Users, Trash2, StopCircle,
  CheckCircle, XCircle, Clock, AlertCircle, Search,
  Download, RefreshCw, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import api from '../../../src/lib/axios';

const fetcher = (url: string) => api.get(url).then(res => res.data);

const STATUS_COLORS: Record<string, string> = {
  draft:            'bg-gray-100 text-gray-700',
  pending:          'bg-yellow-100 text-yellow-800',
  open:             'bg-emerald-100 text-emerald-800',
  active:           'bg-emerald-100 text-emerald-800',
  closed:           'bg-red-100 text-red-800',
  archived:         'bg-gray-100 text-gray-500',
  rejected:         'bg-red-100 text-red-800',
};

export default function PlacementDrivesManager() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, mutate } = useSWR('/admin/placement-drives', fetcher);
  const drives = data?.data || [];
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateStatus = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.put(`/admin/placement-drives/${id}/${action}`);
      toast.success(`Drive ${action}d successfully`);
      mutate();
    } catch {
      toast.error(`Failed to ${action} drive`);
    }
  };

  const filteredDrives = drives.filter((drive: any) => {
    if (status && drive.status !== status) return false;
    if (search && !drive.title.toLowerCase().includes(search.toLowerCase()) && !drive.college?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminDashboardLayout>
      <Head><title>Placement Drives | Admin</title></Head>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <Building2 size={28} className="text-[#1B2A6B]"/> Placement Drives Approvals
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">
            Review and approve campus placement drives created by colleges.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleRefresh} disabled={isRefreshing}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-blue-500" : ""}/> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" placeholder="Search by title or college name..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] outline-none"/>
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2A6B] outline-none text-gray-700 font-semibold bg-white">
          <option value="">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="open">Active (Open)</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Drive Details', 'College', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredDrives.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-20">
                      <Briefcase size={48} className="text-gray-200 mb-4"/>
                      <p className="text-gray-500 font-semibold text-sm">
                        No placement drives found.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredDrives.map((drive: any) => (
                <tr key={drive.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1B2A6B]">{drive.title}</p>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5">{new Date(drive.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-sm">{drive.college?.name || 'Unknown College'}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {drive.college?.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 text-sm">{drive.job_type || 'Full Time'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${STATUS_COLORS[drive.status] || 'bg-gray-100 text-gray-700'}`}>
                      {drive.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {drive.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(drive.id, 'approve')}
                            className="group relative p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                            <CheckCircle size={16}/>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg">
                              Approve
                            </span>
                          </button>
                          <button onClick={() => updateStatus(drive.id, 'reject')}
                            className="group relative p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                            <XCircle size={16}/>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg">
                              Reject
                            </span>
                          </button>
                        </>
                      )}
                      
                      {(drive.status === 'open' || drive.status === 'active') && (
                        <button onClick={() => updateStatus(drive.id, 'close')}
                          className="group relative p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors">
                          <StopCircle size={16}/>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg">
                            Close Drive
                          </span>
                        </button>
                      )}

                      <button onClick={async () => {
                        if (confirm('Delete this drive?')) {
                          try {
                            await api.delete(`/admin/placement-drives/${drive.id}`);
                            mutate();
                            toast.success('Drive deleted');
                          } catch {
                            toast.error('Failed to delete drive');
                          }
                        }
                      }}
                        className="group relative p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16}/>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded whitespace-nowrap z-10 shadow-lg">
                          Delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
