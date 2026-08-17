import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Archive, Download, RefreshCw, Trash2, CheckCircle, Clock, HardDrive } from "lucide-react";
import toast from "react-hot-toast";

const BACKUPS = [
  { id: 1, name: "backup_2026_07_14_090000.zip", size: "42.3 MB", date: "Jul 14, 2026 – 09:00 AM", status: "Success" },
  { id: 2, name: "backup_2026_07_13_090000.zip", size: "41.8 MB", date: "Jul 13, 2026 – 09:00 AM", status: "Success" },
  { id: 3, name: "backup_2026_07_12_090000.zip", size: "40.5 MB", date: "Jul 12, 2026 – 09:00 AM", status: "Success" },
];

export default function AdminBackupPage() {
  const [backups, setBackups] = useState(BACKUPS);
  const [isRunning, setIsRunning] = useState(false);

  const handleCreateBackup = () => {
    setIsRunning(true);
    setTimeout(() => {
      const ts = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
      setBackups(prev => [
        { id: Date.now(), name: `backup_${Date.now()}.zip`, size: "43.1 MB", date: ts, status: "Success" },
        ...prev,
      ]);
      setIsRunning(false);
      toast.success("Backup created successfully!");
    }, 2000);
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Backup</h1>
            <p className="text-slate-500 text-sm font-medium">Manage server and database backups.</p>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <><RefreshCw size={16} className="animate-spin" /> Creating...</>
            ) : (
              <><Archive size={16} /> Create Backup</>
            )}
          </button>
        </div>

        {/* Storage Stat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Backups", value: backups.length, icon: Archive, color: "text-[#1B2A6B]", bg: "bg-[#1B2A6B]/10" },
            { label: "Total Size", value: "124.6 MB", icon: HardDrive, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Last Backup", value: "Today 9:00 AM", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Backup List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Archive size={18} className="text-[#1B2A6B]" /> Backup History
            </h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">File</th>
                <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Size</th>
                <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {backups.map(backup => (
                <tr key={backup.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 text-sm font-mono font-semibold text-slate-700">{backup.name}</td>
                  <td className="py-3 px-6 text-xs font-semibold text-slate-500">{backup.size}</td>
                  <td className="py-3 px-6 text-xs font-semibold text-slate-500">{backup.date}</td>
                  <td className="py-3 px-6">
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 w-fit">
                      <CheckCircle size={10} /> {backup.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex items-center justify-end gap-3">
                    <button onClick={() => toast.success(`Downloading ${backup.name}...`)} className="text-slate-400 hover:text-[#1B2A6B] transition-colors">
                      <Download size={14} />
                    </button>
                    <button onClick={() => { setBackups(prev => prev.filter(b => b.id !== backup.id)); toast.success("Backup deleted"); }} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
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
