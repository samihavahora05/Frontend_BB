import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Mail, Users, Settings, Plus, Trash2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const TABS = [
  { id: "setting", label: "Setting" },
  { id: "mailchimp", label: "Mailchimp Setting" },
  { id: "getresponse", label: "Get Response Setting" },
  { id: "acelle", label: "Acelle" },
  { id: "subscribers", label: "Subscriber" },
];

const MOCK_SUBSCRIBERS = [
  { id: 1, email: "ankit.sharma@gmail.com", date: "Oct 12, 2025", status: "Active" },
  { id: 2, email: "priya.patel@company.in", date: "Oct 15, 2025", status: "Active" },
  { id: 3, email: "rahul.verma@startup.io", date: "Oct 18, 2025", status: "Unsubscribed" },
  { id: 4, email: "meera.singh@ngo.org", date: "Oct 22, 2025", status: "Active" },
];

export default function AdminNewsletterPage() {
  const router = useRouter();
  const activeTab = (router.query.tab as string) || "setting";
  const [subscribers, setSubscribers] = useState(MOCK_SUBSCRIBERS);
  const [provider, setProvider] = useState("default");
  const [apiKey, setApiKey] = useState("");

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Newsletter</h1>
            <p className="text-slate-500 text-sm font-medium">Manage email subscriptions and mailing list integrations.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-bold text-slate-400 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(`/admin/settings/newsletter?tab=${tab.id}`)}
              className={`pb-3 whitespace-nowrap transition-all ${
                activeTab === tab.id || (activeTab === "setting" && tab.id === "setting")
                  ? "border-b-2 border-[#1B2A6B] text-[#1B2A6B] font-extrabold"
                  : "hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Setting Tab */}
        {(activeTab === "setting" || !activeTab) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Settings size={18} className="text-[#1B2A6B]" /> Newsletter Configuration
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Active Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                >
                  <option value="default">Default (Platform Email)</option>
                  <option value="mailchimp">Mailchimp</option>
                  <option value="getresponse">Get Response</option>
                  <option value="acelle">Acelle</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">API Key</label>
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your newsletter API key..."
                  className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button
                onClick={() => toast.success("Newsletter settings saved!")}
                className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === "subscribers" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-[#1B2A6B]" /> All Subscribers
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                  {subscribers.filter(s => s.status === "Active").length} Active
                </span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" /> {sub.email}
                    </td>
                    <td className="py-3 px-6 text-xs font-semibold text-slate-500">{sub.date}</td>
                    <td className="py-3 px-6">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        sub.status === "Active"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                          : "text-slate-500 bg-slate-50 border-slate-100"
                      }`}>{sub.status}</span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => { setSubscribers(prev => prev.filter(s => s.id !== sub.id)); toast.success("Removed subscriber"); }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Other Tabs – Placeholder */}
        {activeTab !== "setting" && activeTab !== "subscribers" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1B2A6B]/5 flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-[#1B2A6B]" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2 capitalize">{activeTab} Integration</h3>
            <p className="text-slate-500 text-sm mb-6">Enter your API credentials to connect this newsletter provider.</p>
            <div className="max-w-sm mx-auto space-y-3 text-left">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">API Key</label>
                <input placeholder="Enter API key..." className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">List ID</label>
                <input placeholder="Enter list ID..." className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              <button onClick={() => toast.success("Integration settings saved!")} className="w-full py-2.5 bg-[#1B2A6B] text-white text-sm font-black rounded-xl">
                Save Integration
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
