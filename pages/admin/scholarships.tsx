import React, { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '../../src/layout/AdminDashboardLayout';
import { Trophy, Search, CheckCircle, Clock, XCircle, ChevronRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminScholarshipsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalData, setViewModalData] = useState<any>(null);

  useEffect(() => {
    // Load from local storage
    const data = JSON.parse(localStorage.getItem('bb_scholarship_applications') || '[]');
    // Sort by appliedAt descending
    const sorted = data.sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    setApplications(sorted);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = applications.map(app => app.id === id ? { ...app, status: newStatus } : app);
    setApplications(updated);
    localStorage.setItem('bb_scholarship_applications', JSON.stringify(updated));
    toast.success(`Application status updated to ${newStatus}`);
  };

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Trophy className="text-[#C9A227]" size={32} />
            Scholarship Applications
          </h1>
          <p className="text-slate-500 mt-1">Review and manage talent challenge submissions.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: applications.length, icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending Review', value: applications.filter(a => a.status === 'Pending Review').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Domain</th>
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={app.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{app.name}</p>
                          <p className="text-xs text-slate-500">{app.email}</p>
                          <p className="text-xs text-slate-400">{app.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                        {app.domain}
                      </span>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-[150px]">{app.skills}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{app.college}</p>
                      <p className="text-xs text-slate-500">{app.year}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'Pending Review' && (
                          <>
                            <button onClick={() => handleUpdateStatus(app.id, 'Shortlisted')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors">
                              Shortlist
                            </button>
                            <button onClick={() => handleUpdateStatus(app.id, 'Rejected')} className="px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-xs font-bold transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setViewModalData(app)} 
                          className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Motivation"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Motivation Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewModalData(null)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl z-50 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-800">{viewModalData.name}'s Motivation</h2>
                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{viewModalData.domain}</p>
              </div>
              <button onClick={() => setViewModalData(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
                <XCircle size={20}/>
              </button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {viewModalData.motivation || "No motivation provided."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm pt-2">
              <div><span className="font-bold text-slate-400 text-xs uppercase">College</span><p className="font-bold text-slate-800">{viewModalData.college}</p></div>
              <div><span className="font-bold text-slate-400 text-xs uppercase">Status</span><p className={`font-bold ${viewModalData.status === 'Shortlisted' ? 'text-emerald-600' : viewModalData.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600'}`}>{viewModalData.status}</p></div>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
