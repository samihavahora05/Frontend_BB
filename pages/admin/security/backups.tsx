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

  const autoSchedule = settings?.auto_schedule === 'true' || settings?.auto_schedule === true || settings?.auto_schedule === '1' || settings?.auto_schedule === 1;
  const scheduleType = settings?.schedule_type || 'daily';
  const scheduleDayOfWeek = settings?.schedule_day_of_week || 'sunday';
  const scheduleDayOfMonth = settings?.schedule_day_of_month || '1';
  const scheduleSpecificDate = settings?.schedule_specific_date || '';
  const scheduleTime = settings?.schedule_time || '02:00';
  const scheduleBackupType = settings?.schedule_backup_type || 'Complete';

  const handleUpdateScheduleSetting = async (key: string, value: any) => {
    try {
      await BackupService.updateSettings({ [key]: value });
      await mutateSettings();
      toast.success('Schedule setting updated');
    } catch (e) {
      toast.error('Failed to update schedule setting');
    }
  };

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

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Backup & Restore</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck size={13} className="text-blue-600" /> System Protection
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Generate, restore, and schedule automated backups for your database and files.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => handleGenerateBackup('Database')}
            disabled={isGenerating !== null}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all duration-150 disabled:opacity-50 active:scale-95"
          >
            {isGenerating === 'Database' ? <Loader2 size={16} className="animate-spin text-blue-600" /> : <Database size={16} className="text-blue-600" />} 
            <span>Database Backup</span>
          </button>
          
          <button 
            onClick={() => handleGenerateBackup('Files')}
            disabled={isGenerating !== null}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all duration-150 disabled:opacity-50 active:scale-95"
          >
            {isGenerating === 'Files' ? <Loader2 size={16} className="animate-spin text-amber-600" /> : <HardDrive size={16} className="text-amber-600" />} 
            <span>Files Backup</span>
          </button>
          
          <button 
            onClick={() => handleGenerateBackup('Complete')}
            disabled={isGenerating !== null}
            className="inline-flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 active:scale-95"
          >
            {isGenerating === 'Complete' ? <Loader2 size={16} className="animate-spin text-white" /> : <ShieldCheck size={16} className="text-white" />} 
            <span>Full Backup</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Total Size */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Storage</span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <HardDrive size={18} />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-7 w-24 bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats?.total_size_mb || '0.00'} <span className="text-sm font-bold text-slate-400">MB</span></h3>
            )}
            <p className="text-xs text-slate-400 font-medium mt-1">Across all archives</p>
          </div>
        </div>

        {/* Card 2: Last Backup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Last Backup</span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <History size={18} />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-7 w-32 bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
              <h3 className="text-base font-black text-slate-800 leading-tight">
                {stats?.last_backup_time ? new Date(stats.last_backup_time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Never'}
              </h3>
            )}
            <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              {stats?.last_backup_time ? 'Latest archive synced' : 'No prior backups'}
            </p>
          </div>
        </div>
        
        {/* Card 3: Failed Backups */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Failed Jobs</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stats?.failed_backups > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-7 w-12 bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
              <h3 className={`text-2xl font-black tracking-tight ${stats?.failed_backups > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {stats?.failed_backups || 0}
              </h3>
            )}
            <p className={`text-xs font-bold mt-1 ${stats?.failed_backups > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
              {stats?.failed_backups > 0 ? 'Needs attention' : 'All systems normal'}
            </p>
          </div>
        </div>

        {/* Card 4: Auto Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
                <Calendar size={18} />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Auto Schedule</span>
            </div>
            
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoSchedule} 
                onChange={handleToggleSchedule} 
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-black ${autoSchedule ? 'text-purple-700' : 'text-slate-400'}`}>
                {autoSchedule ? 'Enabled' : 'Disabled'}
              </span>
              {autoSchedule && (
                <span className="text-xs font-bold text-slate-500">
                  {scheduleType.toUpperCase()} @ {scheduleTime}
                </span>
              )}
            </div>

            {autoSchedule && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
                <select 
                  value={scheduleType}
                  onChange={(e) => handleUpdateScheduleSetting('schedule_type', e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="specific_date">Custom Date</option>
                </select>

                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => handleUpdateScheduleSetting('schedule_time', e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-purple-400"
                  title="Execution Time"
                />

                {scheduleType === 'weekly' && (
                  <select
                    value={scheduleDayOfWeek}
                    onChange={(e) => handleUpdateScheduleSetting('schedule_day_of_week', e.target.value)}
                    className="col-span-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-purple-400"
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                )}

                {scheduleType === 'monthly' && (
                  <select
                    value={scheduleDayOfMonth}
                    onChange={(e) => handleUpdateScheduleSetting('schedule_day_of_month', e.target.value)}
                    className="col-span-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-purple-400"
                  >
                    <option value="1">Day 1 of Month</option>
                    <option value="5">Day 5 of Month</option>
                    <option value="10">Day 10 of Month</option>
                    <option value="15">Day 15 of Month</option>
                    <option value="20">Day 20 of Month</option>
                    <option value="25">Day 25 of Month</option>
                    <option value="28">Day 28 / Last</option>
                  </select>
                )}

                {scheduleType === 'specific_date' && (
                  <input
                    type="date"
                    value={scheduleSpecificDate}
                    onChange={(e) => handleUpdateScheduleSetting('schedule_specific_date', e.target.value)}
                    className="col-span-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-purple-400"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backups Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <History size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 tracking-tight">Backup Archives History</h2>
              <p className="text-[11px] font-medium text-slate-500">List of all historical and queued backup archives</p>
            </div>
            {refreshInterval > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse ml-2">
                <Loader2 size={11} className="animate-spin" /> Processing Queue
              </span>
            )}
          </div>

          <button 
            onClick={() => { mutate(); mutateStats(); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <RefreshCw size={13} className={isBackupsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto admin-scrollbar">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Archive Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-right">Size</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isBackupsLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="w-48 h-4 bg-slate-200 rounded"></div></td>
                    <td className="py-4 px-4"><div className="w-20 h-5 bg-slate-200 rounded-md"></div></td>
                    <td className="py-4 px-4"><div className="w-16 h-4 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="py-4 px-4"><div className="w-28 h-4 bg-slate-200 rounded"></div></td>
                    <td className="py-4 px-4"><div className="w-20 h-5 bg-slate-200 rounded-full"></div></td>
                    <td className="py-4 pr-6"><div className="w-20 h-7 bg-slate-200 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : backups?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Database size={28}/>
                    </div>
                    <h3 className="text-base font-black text-slate-800 mb-1">No backups generated yet</h3>
                    <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
                      Click on Database Backup, Files Backup, or Full Backup above to create your first archive snapshot.
                    </p>
                  </td>
                </tr>
              ) : (
                backups?.map((backup: any) => (
                  <tr key={backup.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {backup.type === 'Database' ? (
                            <Database size={15} className="text-blue-500 shrink-0"/>
                          ) : backup.type === 'Files' ? (
                            <FileCode2 size={15} className="text-amber-500 shrink-0"/>
                          ) : (
                            <ShieldCheck size={15} className="text-purple-500 shrink-0"/>
                          )}
                          <span className="font-bold text-slate-800 font-mono text-xs truncate max-w-xs" title={backup.name}>
                            {backup.name}
                          </span>
                        </div>
                        {backup.checksum && (
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 ml-6" title="MD5 Checksum">
                            MD5: {backup.checksum}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        backup.type === 'Database' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                        backup.type === 'Files' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                        'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-xs font-bold text-slate-700 font-mono">
                      {backup.size}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      <div>{new Date(backup.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                      {backup.duration && (
                        <span className="text-[10px] text-slate-400 font-medium">Duration: {backup.duration}s</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {backup.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck size={12} className="text-emerald-600"/> Completed
                        </span>
                      ) : backup.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200" title={backup.error_message}>
                          <AlertCircle size={12} className="text-rose-600"/> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                          <Loader2 size={12} className="animate-spin text-amber-600" /> {backup.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {backup.status === 'failed' && (
                          <button 
                            onClick={() => handleRetry(backup)} 
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Retry Backup"
                          >
                            <PlayCircle size={16}/>
                          </button>
                        )}
                        {backup.status === 'completed' && (
                          <>
                            <button 
                              onClick={() => handleRestore(backup)} 
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                              title="Restore Backup"
                            >
                              <RotateCcw size={16}/>
                            </button>
                            <button 
                              onClick={() => handleDownload(backup)} 
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                              title="Download Archive"
                            >
                              <Download size={16}/>
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => { setSelectedBackup(backup); setIsDeleteModalOpen(true); }} 
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                          title="Delete Backup"
                        >
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
