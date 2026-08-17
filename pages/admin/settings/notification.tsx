import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Bell, Users, Settings, Send, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const TABS = [
  { id: "setup", label: "Notification Setup" },
  { id: "user", label: "User Notification Setup" },
  { id: "posted", label: "Posted" },
];

const POSTED_NOTIFICATIONS = [
  { id: 1, title: "System Maintenance at 2:00 AM", target: "All Users", date: "Jul 12, 2026", status: "Sent" },
  { id: 2, title: "New Feature: AI Course Recommendations", target: "Students", date: "Jul 10, 2026", status: "Sent" },
  { id: 3, title: "Summer Internship Drive Open!", target: "Job Seekers", date: "Jul 8, 2026", status: "Sent" },
];

const NOTIFICATION_EVENTS = [
  "New User Registration", "Course Enrollment", "Payment Received",
  "Job Application Submitted", "Expert Session Booked", "Contest Winner Announced",
  "Internship Application", "Certificate Issued"
];

export default function AdminNotificationPage() {
  const router = useRouter();
  const activeTab = (router.query.tab as string) || "setup";
  const [enabledEvents, setEnabledEvents] = useState<Record<string, boolean>>({
    "New User Registration": true,
    "Payment Received": true,
    "Certificate Issued": true,
  });
  const [notifications, setNotifications] = useState(POSTED_NOTIFICATIONS);

  const toggleEvent = (event: string) => {
    setEnabledEvents(prev => ({ ...prev, [event]: !prev[event] }));
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Notification</h1>
            <p className="text-slate-500 text-sm font-medium">Configure platform-wide and user notification triggers.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-bold text-slate-400">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(`/admin/communication/notifications?tab=${tab.id}`)}
              className={`pb-3 whitespace-nowrap transition-all ${
                activeTab === tab.id || (!activeTab && tab.id === "setup")
                  ? "border-b-2 border-[#1B2A6B] text-[#1B2A6B] font-extrabold"
                  : "hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification Setup */}
        {(activeTab === "setup" || !activeTab) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Settings size={18} className="text-[#1B2A6B]" /> Admin Notification Events
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Enable or disable notification triggers for admin alerts.</p>
            </div>
            <div className="p-6 space-y-3">
              {NOTIFICATION_EVENTS.map((event) => (
                <div key={event} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-all">
                  <span className="text-sm font-bold text-slate-700">{event}</span>
                  <button
                    onClick={() => toggleEvent(event)}
                    className={`w-11 h-6 rounded-full transition-all relative ${enabledEvents[event] ? "bg-[#1B2A6B]" : "bg-slate-200"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${enabledEvents[event] ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => toast.success("Notification settings saved!")} className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                Save Setup
              </button>
            </div>
          </div>
        )}

        {/* User Notification Setup */}
        {activeTab === "user" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-[#1B2A6B]" /> User-Facing Notifications
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {["Course Update Available", "New Message Received", "Assignment Due Reminder", "Exam Score Published", "Job Match Found"].map((event) => (
                <div key={event} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700">{event}</span>
                  <button
                    onClick={() => toast.success(`${event} toggled`)}
                    className="w-11 h-6 rounded-full bg-[#1B2A6B] relative"
                  >
                    <span className="absolute top-1 left-6 w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => toast.success("User notification settings saved!")} className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">
                Save Setup
              </button>
            </div>
          </div>
        )}

        {/* Posted Notifications */}
        {activeTab === "posted" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Send size={18} className="text-[#1B2A6B]" /> Posted Notifications
              </h2>
              <button onClick={() => toast.success("Composing new notification...")} className="flex items-center gap-2 px-3 py-2 bg-[#1B2A6B] text-white rounded-xl text-xs font-black">
                <Send size={13} /> Send New
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Target</th>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notifications.map(notif => (
                  <tr key={notif.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6 text-sm font-bold text-slate-800">{notif.title}</td>
                    <td className="py-3 px-6 text-xs font-semibold text-slate-500">{notif.target}</td>
                    <td className="py-3 px-6 text-xs font-semibold text-slate-500">{notif.date}</td>
                    <td className="py-3 px-6">
                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 w-fit">
                        <CheckCircle size={11} /> {notif.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button onClick={() => { setNotifications(prev => prev.filter(n => n.id !== notif.id)); toast.success("Deleted"); }} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
