import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  ShieldAlert, ShieldCheck, Plus, Search, Filter, 
  Trash2, ShieldBan, X, Lock, Unlock, AlertOctagon
} from 'lucide-react';
import toast from 'react-hot-toast';

interface IPRecord {
  id: string;
  ip: string;
  reason: string;
  date: string;
  status: 'Blocked' | 'Allowed';
  isSuspicious: boolean;
}

const MOCK_IPS: IPRecord[] = [
  { id: 'IP-001', ip: '192.168.1.100', reason: 'Failed Login Attempts (15+)', date: '2023-10-25 10:30 AM', status: 'Blocked', isSuspicious: true },
  { id: 'IP-002', ip: '10.0.0.52', reason: 'DDoS Mitigation triggered', date: '2023-10-24 14:15 PM', status: 'Blocked', isSuspicious: true },
  { id: 'IP-003', ip: '172.16.254.1', reason: 'Admin Office IP (Static)', date: '2023-01-10 09:00 AM', status: 'Allowed', isSuspicious: false },
  { id: 'IP-004', ip: '8.8.8.8', reason: 'Suspicious Activity Detected', date: '2023-10-26 08:22 AM', status: 'Blocked', isSuspicious: true },
  { id: 'IP-005', ip: '192.168.2.1', reason: 'Trusted Gateway', date: '2023-05-15 11:10 AM', status: 'Allowed', isSuspicious: false },
];

export default function IPBlockPage() {
  const [ipRecords, setIpRecords] = useState<IPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Blocked' | 'Allowed'>('Blocked');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIP, setSelectedIP] = useState<IPRecord | null>(null);

  // Form State
  const [newIp, setNewIp] = useState('');
  const [newReason, setNewReason] = useState('');

  useEffect(() => {
    // Simulate API Load
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500));
      setIpRecords(MOCK_IPS);
      setIsLoading(false);
    };
    loadData();
  }, []);

  let filtered = ipRecords.filter(record => 
    record.status === activeTab &&
    (record.ip.includes(searchQuery) || record.reason.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;

    const newRecord: IPRecord = {
      id: `IP-${Math.floor(Math.random() * 1000)}`,
      ip: newIp,
      reason: newReason || 'Manually added by Admin',
      date: new Date().toLocaleString(),
      status: activeTab,
      isSuspicious: activeTab === 'Blocked'
    };

    setIpRecords([newRecord, ...ipRecords]);
    setNewIp('');
    setNewReason('');
    setIsAddModalOpen(false);
    toast.success(`${newIp} added to ${activeTab} list`);
  };

  const handleUnblock = (record: IPRecord) => {
    setIpRecords(ipRecords.map(r => r.id === record.id ? { ...r, status: 'Allowed', isSuspicious: false } : r));
    toast.success(`IP ${record.ip} unblocked successfully`);
  };

  const handleBlock = (record: IPRecord) => {
    setIpRecords(ipRecords.map(r => r.id === record.id ? { ...r, status: 'Blocked', isSuspicious: true } : r));
    toast.success(`IP ${record.ip} blocked successfully`);
  };

  const handleDelete = () => {
    if (selectedIP) {
      setIpRecords(ipRecords.filter(r => r.id !== selectedIP.id));
      setIsDeleteModalOpen(false);
      toast.success('IP Record deleted permanently');
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>IP & Security | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">IP & Security</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Manage blocked IP addresses and secure allowed lists.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors">
            <Plus size={16} /> Add IP Address
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        
        {/* Tabs & Filters */}
        <div className="px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          
          <div className="flex">
            <button 
              onClick={() => setActiveTab('Blocked')}
              className={`px-6 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'Blocked' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <ShieldAlert size={16}/> Blocked IP List
            </button>
            <button 
              onClick={() => setActiveTab('Allowed')}
              className={`px-6 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'Allowed' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <ShieldCheck size={16}/> Allow List
            </button>
          </div>
          
          <div className="flex items-center gap-3 pb-4 md:pb-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search IP or reason..." className="w-full md:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0">
              <Filter size={16}/> Filters
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto admin-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-white border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Reason / Notes</th>
                <th className="p-4">Date Added</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="w-4 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-48 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4"><div className="w-16 h-8 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {activeTab === 'Blocked' ? <ShieldBan size={32}/> : <ShieldCheck size={32}/>}
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">No {activeTab.toLowerCase()} IPs found</h3>
                    <p className="text-sm font-medium text-slate-500">Add an IP address to this list or adjust your search.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4"><input type="checkbox" className="rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B]" /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {record.isSuspicious ? <AlertOctagon size={16} className="text-amber-500"/> : <Lock size={16} className="text-slate-400"/>}
                        <span className="font-bold text-slate-800 font-mono text-sm">{record.ip}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{record.reason}</td>
                    <td className="p-4 text-sm font-medium text-slate-500">{record.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${record.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {record.status === 'Blocked' ? (
                          <button onClick={() => handleUnblock(record)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                            <Unlock size={14}/> Unblock
                          </button>
                        ) : (
                          <button onClick={() => handleBlock(record)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                            <ShieldBan size={14}/> Block
                          </button>
                        )}
                        <button onClick={() => { setSelectedIP(record); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg tooltip" title="Delete">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add IP Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                {activeTab === 'Blocked' ? <ShieldBan size={20} className="text-red-500"/> : <ShieldCheck size={20} className="text-emerald-500"/>}
                Add to {activeTab} List
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleAddIP} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">IP Address *</label>
                <input 
                  type="text" 
                  required
                  value={newIp}
                  onChange={e => setNewIp(e.target.value)}
                  placeholder="e.g. 192.168.1.1 or 10.0.0.0/24" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold font-mono text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]" 
                />
              </div>
              
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Reason / Notes</label>
                <textarea 
                  value={newReason}
                  onChange={e => setNewReason(e.target.value)}
                  placeholder="Why is this IP being added?" 
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] resize-none" 
                />
              </div>

              {activeTab === 'Blocked' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertOctagon size={18} className="text-amber-500 shrink-0 mt-0.5"/>
                  <p className="text-xs font-semibold text-amber-700 leading-relaxed">
                    Adding an IP to the blocklist will immediately terminate any active sessions originating from that address.
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                <button type="submit" className={`flex-1 py-2.5 text-white font-bold text-sm rounded-xl shadow-md transition-colors ${activeTab === 'Blocked' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                  {activeTab === 'Blocked' ? 'Block IP' : 'Allow IP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedIP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete IP Record?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to remove <span className="font-bold font-mono text-slate-800">{selectedIP.ip}</span> from the {selectedIP.status.toLowerCase()} list?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
