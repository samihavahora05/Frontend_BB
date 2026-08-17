import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Mail, Users, Settings, Plus, Search, Send, BarChart2, Trash2, Edit, Save, Globe
} from "lucide-react";
import toast from "react-hot-toast";

const SUBSCRIBERS = [
  { id: 1, email: "john@example.com", status: "Subscribed", date: "Oct 12, 2025" },
  { id: 2, email: "sarah.connor@gmail.com", status: "Subscribed", date: "Oct 14, 2025" },
  { id: 3, email: "mike_w@yahoo.com", status: "Unsubscribed", date: "Oct 15, 2025" },
  { id: 4, email: "emma.watson@company.com", status: "Subscribed", date: "Oct 18, 2025" },
];

export default function NewsletterPage() {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState("setting");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (tab && typeof tab === 'string') {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push({ query: { ...router.query, tab: newTab } }, undefined, { shallow: true });
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const renderSettingTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-3xl">
      <h2 className="text-lg font-bold text-gray-800 mb-6">General Newsletter Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default From Email</label>
          <input type="email" placeholder="noreply@blueboxx.in" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default From Name</label>
          <input type="text" placeholder="BlueBoxx DA" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} className="bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderMailchimpTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-3xl">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Mail className="text-[#FFE01B]" /> Mailchimp Setting
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mailchimp API Key</label>
          <input type="password" placeholder="Enter Mailchimp API Key" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mailchimp List ID</label>
          <input type="text" placeholder="Enter List / Audience ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="mc-active" className="w-4 h-4 text-[#1B2A6B] border-gray-300 rounded" />
          <label htmlFor="mc-active" className="text-sm font-semibold text-gray-700">Set as Active Provider</label>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} className="bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderGetResponseTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-3xl">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Globe className="text-blue-500" /> Get Response Setting
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Get Response API Key</label>
          <input type="password" placeholder="Enter Get Response API Key" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign ID</label>
          <input type="text" placeholder="Enter Campaign ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="gr-active" className="w-4 h-4 text-[#1B2A6B] border-gray-300 rounded" />
          <label htmlFor="gr-active" className="text-sm font-semibold text-gray-700">Set as Active Provider</label>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} className="bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderAcelleTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-3xl">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Acelle Setting</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Acelle API Key</label>
          <input type="password" placeholder="Enter Acelle API Key" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Acelle List UID</label>
          <input type="text" placeholder="Enter List UID" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Acelle API URL</label>
          <input type="text" placeholder="https://your-acelle-installation.com/api/v1" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="ac-active" className="w-4 h-4 text-[#1B2A6B] border-gray-300 rounded" />
          <label htmlFor="ac-active" className="text-sm font-semibold text-gray-700">Set as Active Provider</label>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} className="bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderSubscriberTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-800">All Subscribers</h2>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B] outline-none"
            />
          </div>
          <button 
            onClick={() => toast.success("Exporting CSV...")}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Subscribed</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SUBSCRIBERS.filter(s => s.email.includes(search)).map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm font-semibold text-gray-800">{sub.email}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{sub.date}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    sub.status === 'Subscribed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => toast.success("Subscriber removed!")} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove Subscriber">
                    <Trash2 className="w-5 h-5 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Newsletter | Admin</title>
      </Head>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">NEWSLETTER</h1>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
          {[
            { id: 'setting', label: 'Setting' },
            { id: 'mailchimp', label: 'Mailchimp Setting' },
            { id: 'getresponse', label: 'Get Response Setting' },
            { id: 'acelle', label: 'Acelle' },
            { id: 'subscriber', label: 'Subscriber' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-5 py-2.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'bg-[#1B2A6B] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'setting' && renderSettingTab()}
          {activeTab === 'mailchimp' && renderMailchimpTab()}
          {activeTab === 'getresponse' && renderGetResponseTab()}
          {activeTab === 'acelle' && renderAcelleTab()}
          {activeTab === 'subscriber' && renderSubscriberTab()}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
