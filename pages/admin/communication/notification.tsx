import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Bell, Save, Users, Settings, FileText, Send
} from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationPage() {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState("setup");

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
    toast.success("Notification settings saved successfully!");
  };

  const renderSetupTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-3xl">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Settings className="text-gray-500" /> Notification Setup
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pusher App ID</label>
          <input type="text" placeholder="Enter Pusher App ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pusher Key</label>
          <input type="text" placeholder="Enter Pusher Key" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pusher Secret</label>
          <input type="password" placeholder="Enter Pusher Secret" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pusher Cluster</label>
          <input type="text" placeholder="e.g. mt1, ap2, eu" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B2A6B]/20 focus:border-[#1B2A6B]" />
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} className="bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserSetupTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-4xl">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="text-[#C9A227]" /> User Notification Setup
      </h2>
      <p className="text-sm text-gray-500 mb-6">Select which events trigger automated notifications to users on the platform.</p>
      
      <div className="space-y-4">
        {[
          { id: 'welcome', label: 'Welcome Notification', desc: 'Sent when a user completes registration.' },
          { id: 'course_enroll', label: 'Course Enrollment', desc: 'Sent when a user enrolls in a new course.' },
          { id: 'course_complete', label: 'Course Completion', desc: 'Sent when a user finishes a course 100%.' },
          { id: 'payment_success', label: 'Payment Success', desc: 'Sent after a successful transaction.' },
          { id: 'certificate', label: 'Certificate Earned', desc: 'Sent when a certificate is unlocked.' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            <div>
              <h3 className="text-sm font-bold text-gray-800">{item.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A227]"></div>
            </label>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} className="bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2">
            <Save size={16} /> Save Setup
          </button>
        </div>
      </div>
    </div>
  );

  const renderPostedTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-indigo-500" /> Posted Notifications
        </h2>
        <button onClick={() => toast.success("New notification draft created")} className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
          <Send size={16} /> Compose New
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Sent</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipients</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { title: "System Maintenance Notice", date: "2026-07-14", recipients: "All Users", status: "Sent" },
              { title: "New Course Available: Advanced React", date: "2026-07-12", recipients: "Students", status: "Sent" },
              { title: "Holiday Discount Offer", date: "2026-07-10", recipients: "All Users", status: "Sent" },
            ].map((notif, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm font-semibold text-gray-800">{notif.title}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{notif.date}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{notif.recipients}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                    {notif.status}
                  </span>
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
        <title>Notification | Admin</title>
      </Head>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
            <Bell size={24} className="text-[#1B2A6B]" /> NOTIFICATION
          </h1>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
          {[
            { id: 'setup', label: 'Notification Setup' },
            { id: 'user-setup', label: 'User Notification Setup' },
            { id: 'posted', label: 'Posted' },
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
          {activeTab === 'setup' && renderSetupTab()}
          {activeTab === 'user-setup' && renderUserSetupTab()}
          {activeTab === 'posted' && renderPostedTab()}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
