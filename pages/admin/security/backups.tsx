import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Database, FileCode2, History, RotateCcw, 
  Download, Trash2, ShieldCheck, AlertCircle, Calendar, HardDrive, RefreshCw, FileText, FileSpreadsheet, PlayCircle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { BackupService } from '../../../src/lib/api/admin/BackupService';

export default function BackupManagerPage() {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const { backups, isLoading: isBackupsLoading, mutate } = BackupService.useBackups(refreshInterval);
  const { settings, mutate: mutateSettings } = BackupService.useSettings();
  const { stats, isLoading: isStatsLoading, mutate: mutateStats } = BackupService.useDashboardStats(refreshInterval);

  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<any>(null);

  const autoSchedule = settings?.auto_schedule === 'true' || settings?.auto_schedule === true;
  const scheduleType = settings?.schedule_type || 'daily';

  // SWR Polling effect
  useEffect(() => {
    if (backups && backups.some((b: any) => b.status === 'pending' || b.status === 'in_progress')) {
      setRefreshInterval(3000);
    } else {
      setRefreshInterval(0);
    }
  }, [backups]);

  const handleToggleSchedule = async () => {
    try {
      await BackupService.updateSettings({ auto_schedule: !autoSchedule });
      await mutateSettings();
      toast.success(`Auto backup schedule ${!autoSchedule ? 'enabled' : 'disabled'}`);
    } catch (e) {
      toast.error('Failed to update settings');
    }
  };

  const handleScheduleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await BackupService.updateSettings({ schedule_type: e.target.value });
      await mutateSettings();
      toast.success(`Schedule set to ${e.target.value}`);
    } catch (e) {
      toast.error('Failed to update schedule type');
    }
  };

  const handleGenerateBackup = async (type: 'Database' | 'Files' | 'Complete') => {
    if (backups?.some((b: any) => b.status === 'pending' || b.status === 'in_progress')) {
      toast.error('A backup is already in progress!');
      return;
    }
    setIsGenerating(type);
    const toastId = toast.loading(`Dispatching ${type} Backup Job...`);
    try {
      await BackupService.generate(type);
      await mutate();
      await mutateStats();
      toast.success(`${type} Backup job started successfully!`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to dispatch ${type} backup`, { id: toastId });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleRestore = async (backup: any) => {
    if (!confirm(`Are you sure you want to restore ${backup.name}? This will overwrite current data and may take several minutes.`)) return;
    const toastId = toast.loading(`Dispatching restore job for ${backup.name}...`);
    try {
      await BackupService.restore(backup.id);
      toast.success(`Restore job started successfully! Check server logs for progress.`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to dispatch restore job`, { id: toastId });
    }
  };

  const handleRetry = async (backup: any) => {
    const toastId = toast.loading(`Retrying backup ${backup.name}...`);
    try {
      await BackupService.retry(backup.id);
      await mutate();
      toast.success(`Backup retry job dispatched!`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to retry backup`, { id: toastId });
    }
  };

  const handleDownload = async (backup: any) => {
    const toastId = toast.loading('Starting download...');
    try {
      await BackupService.download(backup.id, backup.name);
      toast.success('Download started', { id: toastId });
    } catch (error) {
      toast.error('Failed to download file. It might not exist on the server.', { id: toastId });
    }
  };

  const handleDelete = async () => {
    if (selectedBackup) {
      try {
        setIsDeleting(true);
        await BackupService.destroy(selectedBackup.id);
        await mutate();
        await mutateStats();
        setIsDeleteModalOpen(false);
        toast.success('Backup deleted permanently');
      } catch (error) {
        toast.error('Failed to delete backup');
      } finally {
        setIsDeleting(false);
      }
    }
  };



  return (
    <AdminDashboardLayout>
      <Head>
        <title>Backup & Restore | BlueBoxx DA</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Backup & Restore</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Generate, restore, and manage your system data asynchronously via queues.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => handleGenerateBackup('Database')}
            disabled={isGenerating !== null}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isGenerating === 'Database' ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />} 
            Database Backup
          </button>
          <button 
            onClick={() => handleGenerateBackup('Files')}
            disabled={isGenerating !== null}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isGenerating === 'Files' ? <Loader2 size={16} className="animate-spin" /> : <HardDrive size={16} />} 
            Files Backup
          </button>
          <button 
            onClick={() => handleGenerateBackup('Complete')}
            disabled={isGenerating !== null}
            className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50"
          >
            {isGenerating === 'Complete' ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} 
            Full Backup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
            <HardDrive size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Size</p>
            {isStatsLoading ? <div className="h-5 w-16 bg-slate-200 animate-pulse rounded"></div> : (
              <h3 className="text-xl font-black text-slate-800 leading-none">{stats?.total_size_mb || '0.00'} MB</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
            <History size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Last Backup</p>
            {isStatsLoading ? <div className="h-5 w-24 bg-slate-200 animate-pulse rounded"></div> : (
              <h3 className="text-sm font-black text-slate-800 leading-tight">
                {stats?.last_backup_time ? new Date(stats.last_backup_time).toLocaleString() : 'Never'}
              </h3>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Failed Backups</p>
            {isStatsLoading ? <div className="h-5 w-8 bg-slate-200 animate-pulse rounded"></div> : (
              <h3 className="text-xl font-black text-slate-800 leading-none">{stats?.failed_backups || 0}</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
            <Calendar size={24} />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Auto Schedule</p>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 leading-none">{autoSchedule ? 'Enabled' : 'Disabled'}</h3>
                {autoSchedule && (
                  <select 
                    value={scheduleType}
                    onChange={handleScheduleTypeChange}
                    className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 outline-none"
                  >
                    <option value="daily">Daily (2:00 AM)</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
            </div>
            <label className="flex items-center cursor-pointer gap-2">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={autoSchedule} onChange={handleToggleSchedule} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${autoSchedule ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoSchedule ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-320px)] min-h-[400px]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <History size={18} className="text-[#1B2A6B]" /> Backup History
            {refreshInterval > 0 && <Loader2 size={14} className="animate-spin text-blue-500 ml-2" />}
          </h2>
        </div>

        <div className="overflow-x-auto admin-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-white border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="p-4 pl-6">Backup Name</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Size</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isBackupsLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6"><div className="w-48 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-24 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-16 h-4 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="p-4"><div className="w-32 h-4 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="w-20 h-6 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4 pr-6"><div className="w-24 h-8 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : backups?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Database size={32}/>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">No backups found</h3>
                    <p className="text-sm font-medium text-slate-500">Generate your first backup using the buttons above.</p>
                  </td>
                </tr>
              ) : (
                backups?.map((backup: any) => (
                  <tr key={backup.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {backup.type === 'Database' ? <Database size={16} className="text-blue-500"/> : backup.type === 'Files' ? <FileCode2 size={16} className="text-amber-500"/> : <ShieldCheck size={16} className="text-purple-500"/>}
                          <span className="font-bold text-slate-800 font-mono text-sm truncate max-w-[200px] xl:max-w-xs" title={backup.name}>{backup.name}</span>
                        </div>
                        {backup.checksum && <span className="text-[9px] text-slate-400 font-mono mt-1 ml-6" title="MD5 Checksum">MD5: {backup.checksum}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${backup.type === 'Database' ? 'bg-blue-50 text-blue-700' : backup.type === 'Files' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'}`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="p-4 text-right text-sm font-bold text-slate-600">{backup.size}</td>
                    <td className="p-4 text-sm font-medium text-slate-500">
                      {new Date(backup.created_at).toLocaleString()}
                      {backup.duration && <div className="text-[10px] text-slate-400 font-bold mt-0.5">Duration: {backup.duration}s</div>}
                    </td>
                    <td className="p-4">
                      {backup.status === 'completed' ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                          <ShieldCheck size={14}/> Completed
                        </span>
                      ) : backup.status === 'failed' ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-black text-red-600 uppercase tracking-widest" title={backup.error_message}>
                          <AlertCircle size={14}/> Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[11px] font-black text-amber-500 uppercase tracking-widest">
                          <Loader2 size={14} className="animate-spin" /> {backup.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        {backup.status === 'failed' && (
                          <button onClick={() => handleRetry(backup)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg tooltip" title="Retry Backup">
                            <PlayCircle size={16}/>
                          </button>
                        )}
                        {backup.status === 'completed' && (
                          <>
                            <button onClick={() => handleRestore(backup)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg tooltip" title="Restore (Dispatches Job)">
                              <RotateCcw size={16}/>
                            </button>
                            <button onClick={() => handleDownload(backup)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg tooltip" title="Download">
                              <Download size={16}/>
                            </button>
                          </>
                        )}
                        <button onClick={() => { setSelectedBackup(backup); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg tooltip" title="Delete">
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

      {isDeleteModalOpen && selectedBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete Backup?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-bold font-mono text-slate-800 text-xs block mt-1">{selectedBackup.name}</span>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting} className="disabled:opacity-70 flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-all">
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
