import React, { useState, useEffect } from "react";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Bell, Lock, Users, CreditCard, Save, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../../src/lib/axios";

export default function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [notifs, setNotifs] = useState({
    newApps: true,
    interviews: true,
    weekly: false
  });

  const [security, setSecurity] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  });

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" });

  useEffect(() => {
    fetchSettings();
    fetchTeam();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/company/settings');
      if (res.data?.notifications_config) {
        setNotifs(res.data.notifications_config);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await axios.get('/company/team');
      setTeamMembers(res.data.members || []);
      setInvitations(res.data.invitations || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/company/settings', { notifications_config: notifs });
      toast.success("Notification preferences updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (security.new_password !== security.new_password_confirmation) {
      return toast.error("Passwords do not match!");
    }
    if (security.current_password && security.new_password && security.current_password === security.new_password) {
      return toast.error("New password must be different from your current password.");
    }
    setSaving(true);
    try {
      await axios.post('/change-password', security);
      toast.success("Password changed successfully!");
      setSecurity({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/company/team/invite', inviteForm);
      toast.success("Invitation sent successfully!");
      setInviteForm({ email: "", role: "member" });
      fetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      await axios.delete(`/company/team/${id}`);
      toast.success("Team member removed");
      fetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  const TABS = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "team", label: "Team Members", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <CompanyDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your account preferences, team access, and billing.</p>
      </div>

      {loading ? (
        <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {TABS.map((tab, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === tab.id ? "bg-[#1B2A6B] text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatedContent direction="up" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[400px]">
              
              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <h2 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Email Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={notifs.newApps} onChange={e => setNotifs({...notifs, newApps: e.target.checked})} className="mt-1 w-4 h-4 rounded text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                      <div>
                        <label className="text-sm font-bold text-slate-800">New Applications</label>
                        <p className="text-xs text-slate-500">Get notified when someone applies to your postings.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={notifs.interviews} onChange={e => setNotifs({...notifs, interviews: e.target.checked})} className="mt-1 w-4 h-4 rounded text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                      <div>
                        <label className="text-sm font-bold text-slate-800">Interview Updates</label>
                        <p className="text-xs text-slate-500">Get notified about rescheduled or cancelled interviews.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={notifs.weekly} onChange={e => setNotifs({...notifs, weekly: e.target.checked})} className="mt-1 w-4 h-4 rounded text-[#1B2A6B] focus:ring-[#1B2A6B]" />
                      <div>
                        <label className="text-sm font-bold text-slate-800">Weekly Reports</label>
                        <p className="text-xs text-slate-500">Receive a weekly summary of your recruitment pipeline.</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all disabled:opacity-70">
                      {saving ? "Saving..." : <><Save size={16} /> Save Preferences</>}
                    </button>
                  </div>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <form onSubmit={handleSaveSecurity} className="space-y-6">
                  <h2 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Change Password</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Current Password</label>
                      <input type="password" required value={security.current_password} onChange={e => setSecurity({...security, current_password: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">New Password</label>
                      <input type="password" required value={security.new_password} onChange={e => setSecurity({...security, new_password: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Confirm New Password</label>
                      <input type="password" required value={security.new_password_confirmation} onChange={e => setSecurity({...security, new_password_confirmation: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all disabled:opacity-70">
                      {saving ? "Saving..." : <><Save size={16} /> Update Password</>}
                    </button>
                  </div>
                </form>
              )}

              {/* Team Members Tab */}
              {activeTab === "team" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                    <h2 className="text-lg font-black text-slate-800">Team Members</h2>
                  </div>
                  
                  {/* Invite Form */}
                  <form onSubmit={handleInvite} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-end mb-6">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Email Address</label>
                      <input type="email" required value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} placeholder="colleague@company.com" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                    </div>
                    <div className="w-full sm:w-48">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Role</label>
                      <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none">
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button type="submit" disabled={saving} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#0d1635] transition-all disabled:opacity-70">
                      <Mail size={16} /> Invite
                    </button>
                  </form>

                  {/* Active Members */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-500 uppercase">Active Members</h3>
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#1B2A6B] font-bold">
                            {member.first_name?.[0] || member.email?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{member.first_name} {member.last_name}</p>
                            <p className="text-xs text-slate-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase">{member.roles?.[0]?.name || 'Member'}</span>
                          <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {invitations.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Pending Invitations</h3>
                        {invitations.map((inv, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                            <div>
                              <p className="text-sm font-bold text-slate-800">{inv.email}</p>
                              <p className="text-xs text-slate-500">Invited to be: {inv.role}</p>
                            </div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Pending</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Billing & Subscription</h2>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                    <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-md font-bold text-slate-800 mb-2">No Active Subscription</h3>
                    <p className="text-sm text-slate-500 mb-4">You are currently on the free tier. Upgrade to unlock premium features and advanced analytics.</p>
                    <button className="px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all">
                      View Plans & Upgrade
                    </button>
                  </div>
                </div>
              )}

            </AnimatedContent>
          </div>
        </div>
      )}
    </CompanyDashboardLayout>
  );
}
