import React from "react";
import Head from "next/head";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import {
  Activity, BookOpen, ShoppingCart, UserPlus, RefreshCw
} from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(r => r.data);

const ICON_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  "created a new account": { icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50" },
  "published a new course": { icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50" },
  "placed a new order": { icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50" },
  "submitted an enquiry": { icon: Activity, color: "text-rose-600", bg: "bg-rose-50" },
};

function getIconInfo(action: string) {
  for (const key in ICON_MAP) {
    if (action?.includes(key.split(" ").slice(-2).join(" "))) return ICON_MAP[key];
  }
  return { icon: Activity, color: "text-blue-600", bg: "bg-blue-50" };
}

export default function AdminLogsPage() {
  const { data, isLoading, mutate } = useSWR("/admin/dashboard/feed", fetcher);
  const logs: any[] = (data?.data || []).slice(0, 5);

  return (
    <AdminDashboardLayout>
      <Head><title>Activity Logs | Blueboxx DA</title></Head>

      <div className="max-w-full p-4 sm:p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <Activity size={22} className="text-[#C9A227]" /> Activity Logs
            </h1>
            <p className="text-sm text-slate-400 font-semibold mt-0.5">Latest 5 platform activities</p>
          </div>
          <button
            onClick={() => mutate()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <RefreshCw size={20} className="animate-spin mr-2" /> Loading...
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Activity size={32} className="mb-3 opacity-30" />
              <p className="text-sm font-bold">No activity logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {logs.map((log, i) => {
                const iconInfo = getIconInfo(log.action);
                const Icon = iconInfo.icon;
                return (
                  <div key={log.id || i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full ${iconInfo.bg} ${iconInfo.color} flex items-center justify-center shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        <span className="text-[#1B2A6B]">{log.admin?.first_name} {log.admin?.last_name}</span>
                        {" "}<span className="text-slate-600 font-semibold">{log.action}</span>
                        {log.table_name && (
                          <span className="text-slate-400 font-medium"> · {log.table_name}</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        {new Date(log.created_at).toLocaleString('en-IN', {
                          weekday: 'short', day: 'numeric', month: 'short',
                          year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${iconInfo.bg} ${iconInfo.color}`}>
                      {log.action?.split(" ").slice(-2).join(" ") || "activity"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

