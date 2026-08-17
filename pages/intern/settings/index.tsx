import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { Bell, Shield, Briefcase, Mail, User, Lock, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../src/context/AuthContext";
import { DashboardService } from "../../../src/lib/api/intern/DashboardService";
import toast from "react-hot-toast";

export default function InternSettingsPage() {
  const { user } = useAuth();
  const { data: settingsRes, mutate } = DashboardService.useSettings();
  const settingsData = settingsRes?.data;
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setFormData({
        first_name: settingsData.first_name || "",
        last_name: settingsData.last_name || "",
        email: settingsData.email || ""
      });
    }
  }, [settingsData]);

  const [internshipAlerts, setInternshipAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await DashboardService.updateSettings(formData);
      toast.success("Profile updated successfully");
      mutate();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <InternDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your personal profile, security, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <User size={18} className="text-[#1B2A6B]" />
              <h2 className="text-lg font-black text-slate-800">Personal Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md shrink-0">
                  <img src={user?.avatar || `https://ui-avatars.com/api/?name=I&background=1B2A6B&color=fff&size=100`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-sm cursor-not-allowed opacity-70" title="Coming Soon">
                    Change Avatar
                  </button>
                  <p className="text-[10px] text-slate-400 font-semibold mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name</label>
                  <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]" />
                </div>
              </div>
              <div className="flex justify-end border-t border-slate-100 pt-5 mt-2">
                <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors disabled:opacity-70 flex items-center gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Bell size={18} className="text-[#C9A227]" />
              <h2 className="text-lg font-black text-slate-800">Notification Preferences</h2>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between group">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-0.5">Internship Alerts</h3>
                    <p className="text-xs font-semibold text-slate-500 max-w-sm">Get emails when top companies post internships matching your skills.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setInternshipAlerts(!internshipAlerts)} 
                  className={`w-11 h-6 rounded-full relative transition-colors shadow-inner shrink-0 flex items-center ${internshipAlerts ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`}
                >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm mx-1" animate={{ x: internshipAlerts ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Mail size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-0.5">Newsletter & Tips</h3>
                    <p className="text-xs font-semibold text-slate-500 max-w-sm">Receive interview preparation tips and resume building guides weekly.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNewsletter(!newsletter)} 
                  className={`w-11 h-6 rounded-full relative transition-colors shadow-inner shrink-0 flex items-center ${newsletter ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`}
                >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm mx-1" animate={{ x: newsletter ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <Smartphone size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-0.5">SMS Notifications</h3>
                    <p className="text-xs font-semibold text-slate-500 max-w-sm">Instant SMS for interview invites and urgent updates.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSmsAlerts(!smsAlerts)} 
                  className={`w-11 h-6 rounded-full relative transition-colors shadow-inner shrink-0 flex items-center ${smsAlerts ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`}
                >
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm mx-1" animate={{ x: smsAlerts ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Security & Extras */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-[#0d1635] to-[#1B2A6B] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
             <h3 className="font-black text-lg mb-2 flex items-center gap-2"><Shield size={18} className="text-[#C9A227]" /> Security</h3>
             <p className="text-xs text-white/70 font-medium mb-6">Keep your account secure with a strong password.</p>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Current Password</label>
                 <input type="password" value="********" readOnly className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-mono focus:outline-none" />
               </div>
               <button className="w-full py-2.5 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] text-sm font-bold rounded-xl transition-colors shadow-sm">
                 Change Password
               </button>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h3 className="font-black text-slate-800 text-sm mb-4">Account Status</h3>
             <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
               <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
               <div>
                 <p className="text-xs font-black text-emerald-800">Verified Intern Account</p>
                 <p className="text-[10px] font-bold text-emerald-600/70 mt-0.5">Your email has been verified.</p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </InternDashboardLayout>
  );
}
