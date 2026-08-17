import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Fingerprint, Monitor, Smartphone, Globe, ShieldAlert,
  Clock, LogOut, Search, Filter, Trash2, X
} from 'lucide-react';
import toast from 'react-hot-toast';

import { SessionService } from '../../../src/lib/api/admin/SessionService';

export default function SessionManagementPage() {
  const { sessions, isLoading, mutate } = SessionService.useSessions();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  let filtered = sessions.filter(s => 
    s.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.ip.includes(searchQuery) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRevoke = async () => {
    if (selectedSession) {
      try {
        setIsRevoking(true);
        await SessionService.revokeSession(selectedSession.id);
        await mutate();
        setIsDeleteModalOpen(false);
        toast.success('Session revoked successfully.');
      } catch (error) {
        toast.error('Failed to revoke session');
      } finally {
        setIsRevoking(false);
      }
    }
  };

  const handleRevokeAllOthers = async () => {
    try {
      await SessionService.revokeAllOthers();
      await mutate();
      toast.success('All other sessions have been successfully terminated.');
    } catch (error) {
      toast.error('Failed to terminate sessions');
    }
  };

  const stats = {
    total: sessions.length,
    desktop: sessions.filter(s => s.device === 'Desktop').length,
    mobile: sessions.filter(s => s.device === 'Mobile' || s.device === 'Tablet').length,
    suspicious: sessions.filter(s => s.isSuspicious).length
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Session Management | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Session Management</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Monitor and revoke active logins across the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleRevokeAllOthers} className="flex items-center gap-2 bg-white border border-slate-200 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-red-50 transition-colors">
            <Trash2 size={16} /> Terminate All Other Sessions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Sessions" value={stats.total} icon={Fingerprint} color="bg-blue-50 text-blue-600" />
        <StatCard title="Desktop Logins" value={stats.desktop} icon={Monitor} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="Mobile/Tablet" value={stats.mobile} icon={Smartphone} color="bg-purple-50 text-purple-600" />
        <StatCard title="Suspicious Flags" value={stats.suspicious} icon={ShieldAlert} color="bg-red-50 text-red-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
        
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest hidden lg:block">Active Logins</h2>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search user, IP, or location..." className="w-full lg:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0">
              <Filter size={16}/> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto admin-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="p-4 pl-6">User & Email</th>
                <th className="p-4">Device & Browser</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Location</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6"><div className="w-32 h-4 bg-slate-200 rounded mb-2"></div><div className="w-24 h-3 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded mb-2"></div><div className="w-32 h-3 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-20 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4 pr-6"><div className="w-20 h-8 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Fingerprint size={32}/>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">No sessions found</h3>
                    <p className="text-sm font-medium text-slate-500">Adjust your search parameters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${session.isSuspicious ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          {session.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            {session.user}
                            {session.isCurrent && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-widest">Current</span>}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-500">{session.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        {session.device === 'Mobile' || session.device === 'Tablet' ? <Smartphone size={14} className="text-slate-400"/> : <Monitor size={14} className="text-slate-400"/>}
                        {session.device}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{session.browser}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-600 text-sm bg-slate-100 px-2 py-1 rounded">{session.ip}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <Globe size={14} className="text-blue-500"/> {session.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400"/> {session.lastActive}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {!session.isCurrent && (
                        <button onClick={() => { setSelectedSession(session); setIsDeleteModalOpen(true); }} className="px-3 py-1.5 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto opacity-0 group-hover:opacity-100">
                          <LogOut size={14}/> Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="absolute top-4 right-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20}/></button>
            </div>
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><LogOut size={32} className="ml-1" /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Revoke Session?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to log out the user from their <span className="font-bold text-slate-800">{selectedSession.device} ({selectedSession.location})</span> session immediately?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Cancel</button>
              <button onClick={handleRevoke} disabled={isRevoking} className="disabled:opacity-70 flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all">
                {isRevoking ? 'Revoking...' : 'Revoke Now'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className="text-xl font-black text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}
