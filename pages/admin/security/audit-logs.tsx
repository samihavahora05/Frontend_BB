import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  History, Search, Filter, Download, Eye
} from "lucide-react";
import toast from "react-hot-toast";

import { LogService } from '../../../src/lib/api/admin/LogService';

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = LogService.useLogs({ page, search: searchTerm });
  const logs = data?.data || [];
  const meta = data?.pagination;

  const handleExport = () => {
    toast.success("Exporting logs to CSV...");
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-600" />
              Audit Logs
            </h1>
            <p className="text-gray-500 mt-1">
              Track system changes, administrative actions, and security events.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              Export Logs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                Filter by Module
              </button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search logs (IP, User, Action)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Log ID</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr><td colSpan={8} className="text-center p-8 text-gray-500 font-bold">Loading logs...</td></tr>
                )}
                {!isLoading && logs.length === 0 && (
                  <tr><td colSpan={8} className="text-center p-8 text-gray-500 font-bold">No logs found</td></tr>
                )}
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">AL-{log.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg">
                        {log.action.split(' ')[0]} {/* Simple heuristic for module */}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{log.action}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 font-mono">{log.ip_address || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <span className={`flex items-center gap-1.5 text-xs font-bold text-gray-600`}>
                        <span className={`w-2 h-2 rounded-full bg-blue-500`}></span>
                        Logged
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title={log.details || 'No details'}>
                        <Eye className="w-5 h-5 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {(meta?.current_page - 1) * meta?.per_page + 1 || 0} to {Math.min(meta?.current_page * meta?.per_page, meta?.total) || 0} of {meta?.total || 0} entries
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded bg-white text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50">
                Prev
              </button>
              <button className="px-3 py-1 border border-indigo-600 rounded bg-indigo-600 text-white">{page}</button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={!meta || page === meta.last_page}
                className="px-3 py-1 border border-gray-200 rounded bg-white text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
