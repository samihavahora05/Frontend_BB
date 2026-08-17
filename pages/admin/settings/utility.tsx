import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { TerminalSquare, Globe, AlertTriangle, Shield, Settings, Loader, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const TABS = [
  { id: "utilities", label: "Utilities" },
  { id: "preloader", label: "Preloader Setting" },
  { id: "geo", label: "Geo Location" },
  { id: "error-log", label: "Error Log" },
  { id: "ip-block", label: "Ip Block" },
  { id: "maintenance", label: "Maintenance" },
];

const ERROR_LOGS = [
  { id: 1, level: "ERROR", message: "SQLSTATE[42S01]: Table 'email_logs' already exists", time: "2026-07-14 10:00:00", file: "migrations/2026_07_14_email_logs.php" },
  { id: 2, level: "WARNING", message: "Undefined index: user_id in UserController.php line 42", time: "2026-07-14 09:45:00", file: "Http/Controllers/UserController.php" },
  { id: 3, level: "INFO", message: "Queue worker started processing 24 jobs", time: "2026-07-14 09:30:00", file: "Jobs/SendQueuedEmailJob.php" },
];

const BLOCKED_IPS = [
  { id: 1, ip: "192.168.1.105", reason: "Brute force login attempt", date: "Jul 12, 2026" },
  { id: 2, ip: "203.45.78.99", reason: "Spam form submissions", date: "Jul 10, 2026" },
];

export default function AdminUtilityPage() {
  const router = useRouter();
  const activeTab = (router.query.tab as string) || "utilities";
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [blockedIps, setBlockedIps] = useState(BLOCKED_IPS);
  const [newIp, setNewIp] = useState("");
  const [newReason, setNewReason] = useState("");
  const [errorLogs, setErrorLogs] = useState(ERROR_LOGS);

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Utility</h1>
          <p className="text-slate-500 text-sm font-medium">Platform diagnostics, IP blocking, and maintenance controls.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-4 text-sm font-bold text-slate-400 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(`/admin/settings/utility?tab=${tab.id}`)}
              className={`pb-3 whitespace-nowrap transition-all ${
                activeTab === tab.id || (!activeTab && tab.id === "utilities")
                  ? "border-b-2 border-[#1B2A6B] text-[#1B2A6B] font-extrabold"
                  : "hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Utilities Tab */}
        {(activeTab === "utilities" || !activeTab) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Clear Application Cache", desc: "Flush all cached views, routes and configs", action: () => toast.success("Cache cleared!"), icon: TerminalSquare, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Optimize Application", desc: "Cache routes, configs and autoloaders", action: () => toast.success("App optimized!"), icon: Settings, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Clear Queue Jobs", desc: "Remove all pending jobs from the queue", action: () => toast.success("Queue cleared!"), icon: Loader, color: "text-amber-600", bg: "bg-amber-50" },
              { title: "Run Migrations", desc: "Apply pending database migrations", action: () => toast.success("Migrations run!"), icon: Globe, color: "text-indigo-600", bg: "bg-indigo-50" },
            ].map((tool, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-all group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.bg} ${tool.color} shrink-0`}>
                  <tool.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-slate-800 mb-1">{tool.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">{tool.desc}</p>
                  <button onClick={tool.action} className="text-xs font-black text-[#1B2A6B] hover:underline">
                    Run Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Log Tab */}
        {activeTab === "error-log" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-500" /> Error Logs
              </h2>
              <button onClick={() => { setErrorLogs([]); toast.success("Logs cleared!"); }} className="text-xs font-black text-red-500 hover:underline flex items-center gap-1">
                <Trash2 size={13} /> Clear All
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {errorLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm font-semibold">No error logs found.</div>
              ) : (
                errorLogs.map(log => (
                  <div key={log.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            log.level === "ERROR" ? "text-red-600 bg-red-50 border-red-100" :
                            log.level === "WARNING" ? "text-amber-600 bg-amber-50 border-amber-100" :
                            "text-blue-600 bg-blue-50 border-blue-100"
                          }`}>{log.level}</span>
                          <span className="text-xs text-slate-400 font-mono">{log.time}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mb-1">{log.message}</p>
                        <p className="text-[11px] font-mono text-slate-400">{log.file}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* IP Block Tab */}
        {activeTab === "ip-block" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-[#1B2A6B]" /> Block New IP Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">IP Address</label>
                  <input value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="e.g. 192.168.1.1" className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Reason</label>
                  <input value={newReason} onChange={e => setNewReason(e.target.value)} placeholder="e.g. Spam" className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (newIp) {
                      setBlockedIps(prev => [...prev, { id: Date.now(), ip: newIp, reason: newReason || "Manual block", date: "Jul 14, 2026" }]);
                      setNewIp(""); setNewReason("");
                      toast.success(`${newIp} blocked successfully!`);
                    }
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black rounded-xl shadow-sm"
                >
                  Block IP
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-base font-black text-slate-800">Blocked IPs ({blockedIps.length})</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase">IP Address</th>
                    <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase">Reason</th>
                    <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase">Blocked On</th>
                    <th className="py-3 px-6 text-right text-[11px] font-black text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blockedIps.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 text-sm font-mono font-bold text-slate-800">{item.ip}</td>
                      <td className="py-3 px-6 text-xs font-semibold text-slate-500">{item.reason}</td>
                      <td className="py-3 px-6 text-xs font-semibold text-slate-500">{item.date}</td>
                      <td className="py-3 px-6 text-right">
                        <button onClick={() => { setBlockedIps(prev => prev.filter(b => b.id !== item.id)); toast.success("IP unblocked"); }} className="text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === "maintenance" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
              <Settings size={18} className="text-[#1B2A6B]" /> Maintenance Mode
            </h2>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-amber-800">Warning</p>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">
                  Enabling maintenance mode will make the platform inaccessible to all users except administrators.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-black text-slate-800">Maintenance Mode</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Currently: {maintenanceMode ? "ACTIVE – Site is down" : "Inactive – Site is live"}</p>
              </div>
              <button
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  toast.success(maintenanceMode ? "Maintenance mode disabled!" : "Maintenance mode enabled!");
                }}
                className={`w-14 h-7 rounded-full transition-all relative ${maintenanceMode ? "bg-red-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${maintenanceMode ? "left-8" : "left-1.5"}`} />
              </button>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab !== "utilities" && activeTab !== "error-log" && activeTab !== "ip-block" && activeTab !== "maintenance" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1B2A6B]/5 flex items-center justify-center mx-auto mb-4">
              <Globe size={28} className="text-[#1B2A6B]" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">{activeTab.replace("-", " ")} Settings</h3>
            <p className="text-slate-500 text-sm">Configure this utility module settings below.</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
