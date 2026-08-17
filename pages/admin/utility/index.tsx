import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  Server, Database, HardDrive, Cpu, Activity, Clock, 
  Settings, RefreshCw, Zap, Trash2, Box, Command
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UtilitiesPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleAction = (action: string) => {
    setIsOptimizing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Running ${action}...`,
        success: `${action} completed successfully!`,
        error: `Failed to run ${action}`,
      }
    ).then(() => setIsOptimizing(false));
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>System Utilities | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">System Utilities</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Monitor system health, manage cache, and optimize performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => handleAction('System Refresh')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw size={16} /> Refresh Status
          </button>
          <button onClick={() => handleAction('Full Optimization')} disabled={isOptimizing} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50">
            <Zap size={16} /> Optimize System
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Server Health & Specs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Activity size={18} className="text-emerald-500"/> System Health
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard title="PHP Version" value="8.2.10" icon={Command} color="bg-indigo-50 text-indigo-600" />
            <StatCard title="Laravel Version" value="10.24.0" icon={Box} color="bg-red-50 text-red-600" />
            <StatCard title="Database" value="MySQL 8.0" icon={Database} color="bg-blue-50 text-blue-600" />
            <StatCard title="Server Status" value="Online" icon={Server} color="bg-emerald-50 text-emerald-600" />
            <StatCard title="Uptime" value="14d 6h 22m" icon={Clock} color="bg-amber-50 text-amber-600" />
            <StatCard title="Queue Status" value="Running" icon={Activity} color="bg-purple-50 text-purple-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Memory Usage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2"><Cpu size={16}/> Memory Usage</h3>
                <span className="text-xs font-black text-slate-400">45%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width: '45%'}}></div>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-3 text-right">3.6 GB / 8.0 GB Used</p>
            </div>
            
            {/* Disk Usage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2"><HardDrive size={16}/> Disk Usage</h3>
                <span className="text-xs font-black text-slate-400">72%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: '72%'}}></div>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-3 text-right">144 GB / 200 GB Used</p>
            </div>
          </div>
        </div>

        {/* Right Col: Maintenance Tools */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Settings size={18} className="text-slate-500"/> Maintenance Tools
          </h2>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
            <ToolButton onClick={() => handleAction('Clear Application Cache')} icon={Trash2} title="Clear Application Cache" desc="Clears the general application cache." color="text-amber-600 bg-amber-50" />
            <ToolButton onClick={() => handleAction('Clear Config Cache')} icon={Trash2} title="Clear Config Cache" desc="Clears the configuration cache." color="text-amber-600 bg-amber-50" />
            <ToolButton onClick={() => handleAction('Clear Route Cache')} icon={Trash2} title="Clear Route Cache" desc="Clears the routing cache." color="text-amber-600 bg-amber-50" />
            <ToolButton onClick={() => handleAction('Clear View Cache')} icon={Trash2} title="Clear View Cache" desc="Clears the compiled view files." color="text-amber-600 bg-amber-50" />
            
            <div className="h-px bg-slate-100 my-4"></div>
            
            <ToolButton onClick={() => handleAction('Optimize Application')} icon={Zap} title="Optimize Application" desc="Caches config, routes, and views." color="text-[#1B2A6B] bg-blue-50" />
            <ToolButton onClick={() => handleAction('Database Optimization')} icon={Database} title="Database Optimization" desc="Optimizes database tables." color="text-[#1B2A6B] bg-blue-50" />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{title}</p>
        <h3 className="text-lg font-black text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}

function ToolButton({ title, desc, icon: Icon, onClick, color }: { title: string, desc: string, icon: any, onClick: () => void, color: string }) {
  return (
    <button onClick={onClick} className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-200 group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-800 group-hover:text-[#1B2A6B] transition-colors">{title}</h4>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">{desc}</p>
      </div>
    </button>
  );
}
