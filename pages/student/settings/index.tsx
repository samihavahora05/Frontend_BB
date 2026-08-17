import React, { useState } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { User, Mail, Phone, MapPin, Lock, Bell, Shield, Save, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../../../src/context/AuthContext";
import { useConfirm } from "../../../src/context/ConfirmContext";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

const TABS = ["Profile", "Security", "Notifications", "Privacy"];

export default function SettingsPage() {
  const { user } = useAuth();
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState("Profile");
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const { mutate } = useSWR("/student/profile", fetcher, {
    onSuccess: (data) => {
      setForm({
        name: data.name || user?.name || "",
        email: data.email || user?.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
      });
      if (data.notifications) setNotifications(data.notifications);
      if (data.privacy) setPrivacy(data.privacy);
    }
  });

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    location: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    assignments: true, liveClasses: true, applications: true, certificates: false, newsletter: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true, showLeaderboard: false, dataAnalytics: true,
  });

  const [passwords, setPasswords] = useState({
    current: "", new: "", confirm: ""
  });

  const handleSave = async () => {
    try {
      if (activeTab === "Profile" || activeTab === "Notifications" || activeTab === "Privacy") {
        await api.put("/student/profile", {
          name: form.name,
          phone: form.phone,
          location: form.location,
          bio: form.bio,
          notifications,
          privacy
        });
      } else if (activeTab === "Security") {
        if (passwords.new !== passwords.confirm) {
          toast.error("New passwords do not match.");
          return;
        }
        if (passwords.current && passwords.new && passwords.current === passwords.new) {
          toast.error("New password must be different from your current password.");
          return;
        }
        await api.post("/change-password", {
          current_password: passwords.current,
          new_password: passwords.new,
          new_password_confirmation: passwords.confirm,
        });
        setPasswords({ current: "", new: "", confirm: "" });
      }
      mutate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    }
  };

  const handleDeleteAccount = async () => {
    if (await confirm({
      title: "Delete Account",
      description: "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
      confirmText: "Delete Account",
      isDestructive: true
    })) {
      try {
        await api.delete("/student/profile");
        toast.success("Account deleted successfully.");
        window.location.href = "/login";
      } catch (err: any) {
        toast.error("Failed to delete account");
      }
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1.5";

  return (
    <StudentDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Settings</h1>
        <p className="text-slate-500 text-sm font-medium">Manage your account preferences and personal information.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar tabs */}
        <div className="lg:w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold transition-colors border-b border-slate-100 last:border-0 ${activeTab === tab ? "bg-[#1B2A6B]/5 text-[#1B2A6B]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
              >
                {tab === "Profile" && <User size={15} />}
                {tab === "Security" && <Lock size={15} />}
                {tab === "Notifications" && <Bell size={15} />}
                {tab === "Privacy" && <Shield size={15} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            {/* Profile */}
            {activeTab === "Profile" && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] flex items-center justify-center text-white font-black text-xl">
                    {form.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800">{form.name}</p>
                    <p className="text-xs text-slate-400 font-semibold">{form.email}</p>
                    <button onClick={() => toast.success("Opening file picker...")} className="text-xs font-bold text-[#1B2A6B] hover:underline mt-1">Change Photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}><User size={11} className="inline mr-1" />Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}><Mail size={11} className="inline mr-1" />Email</label>
                    <input type="email" value={form.email} readOnly disabled className={`${inputCls} opacity-70 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label className={labelCls}><Phone size={11} className="inline mr-1" />Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}><MapPin size={11} className="inline mr-1" />Location</label>
                    <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Bio</label>
                  <textarea rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className={`${inputCls} resize-none`} />
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "Security" && (
              <div className="space-y-5">
                <h2 className="font-black text-slate-800 text-base mb-4">Change Password</h2>
                <div>
                  <label className={labelCls}>Current Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={passwords.current} onChange={e => setPasswords(p => ({...p, current: e.target.value}))} placeholder="••••••••" className={`${inputCls} pr-10`} />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>New Password</label>
                  <input type="password" value={passwords.new} onChange={e => setPasswords(p => ({...p, new: e.target.value}))} placeholder="••••••••" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({...p, confirm: e.target.value}))} placeholder="••••••••" className={inputCls} />
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700 font-semibold">
                  Password must be at least 8 characters, include a number and a special character.
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "Notifications" && (
              <div className="space-y-3">
                <h2 className="font-black text-slate-800 text-base mb-4">Email Notifications</h2>
                {Object.entries(notifications).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-slate-800 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Get notified about {key.toLowerCase()} updates</p>
                    </div>
                    <button
                      onClick={() => setNotifications(p => ({ ...p, [key]: !val }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${val ? "bg-[#1B2A6B]" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${val ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Privacy */}
            {activeTab === "Privacy" && (
              <div className="space-y-4">
                <h2 className="font-black text-slate-800 text-base mb-4">Privacy Settings</h2>
                {[
                  { key: "showProfile", label: "Show Profile to Recruiters", desc: "Allow verified companies to view your profile" },
                  { key: "showLeaderboard", label: "Show in Leaderboard", desc: "Appear in the Blueboxx learning leaderboard" },
                  { key: "dataAnalytics", label: "Allow Data Analytics", desc: "Help us improve with anonymised usage data" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key as keyof typeof privacy] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${privacy[item.key as keyof typeof privacy] ? "bg-[#1B2A6B]" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${privacy[item.key as keyof typeof privacy] ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
                <div className="pt-4">
                  <button onClick={handleDeleteAccount} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">Delete Account</button>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl text-sm transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#1B2A6B] text-white hover:bg-[#0d1635]"}`}
              >
                {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}
