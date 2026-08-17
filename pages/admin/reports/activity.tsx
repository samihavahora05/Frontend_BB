import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Activity, Download, Search, Filter, ShieldAlert, Monitor, UserCheck } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";

const MOCK_ACTIVITY = [
  { id: "LOG-091", user: "Admin (Pratik)", event: "Role Modified", details: "Changed 'Expert' permissions", time: "10 mins ago", ip: "192.168.1.1", status: "Success" },
  { id: "LOG-092", user: "System", event: "Daily Backup", details: "Automated DB Backup S3", time: "2 hours ago", ip: "localhost", status: "Success" },
  { id: "LOG-093", user: "Jane Doe (Student)", event: "Failed Login", details: "Invalid password attempt (x3)", time: "3 hours ago", ip: "45.22.19.8", status: "Warning" },
  { id: "LOG-094", user: "Dr. Turing (Expert)", event: "Course Created", details: "Advanced Machine Learning v2", time: "5 hours ago", ip: "103.55.21.99", status: "Success" },
  { id: "LOG-095", user: "Unknown", event: "API Attack Blocked", details: "Rate limit exceeded on /auth", time: "1 day ago", ip: "188.42.5.112", status: "Critical" },
];

export default function ActivityReportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600" />
              System Activity & Audit Logs
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Track administrative actions, security events, and automated tasks.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm">
              <Filter className="w-4 h-4" /> Filter Logs
            </button>
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors font-bold text-sm shadow-sm">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
                <Monitor className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Total System Events</h3>
            <h2 className="text-2xl font-black text-slate-900">14,203</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Active Admins Today</h3>
            <h2 className="text-2xl font-black text-slate-900">4</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Security Warnings</h3>
            <h2 className="text-2xl font-black text-rose-600">12</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Audit Trail</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search logs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Log ID</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">User / System</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Event</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Details</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_ACTIVITY.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="py-4 px-6 font-mono font-bold text-slate-400">{log.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{log.user}</td>
                    <td className="py-4 px-6 font-black text-slate-700">{log.event}</td>
                    <td className="py-4 px-6 font-medium text-slate-500 truncate max-w-[200px]">{log.details}</td>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-400">{log.ip}</td>
                    <td className="py-4 px-6 font-medium text-slate-500">{log.time}</td>
                    <td className="py-4 px-6">
                      <Badge className={`font-bold border-none ${
                        log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' :
                        log.status === 'Warning' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
