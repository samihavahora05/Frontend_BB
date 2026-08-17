import { JobseekerDashboardLayout } from "../../../src/layout/JobseekerDashboardLayout";
import { Bell, Shield, Mail, User, Smartphone, CheckCircle2, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function JobseekerSettingsPage() {
  const { data, isLoading } = useSWR("/jobseeker/settings", fetcher);
  const userData = useMemo(() => data?.data || {}, [data?.data]);

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", headline: "", preferred_location: ""
  });

  useEffect(() => {
    if (userData?.first_name) {
      setProfileForm({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        headline: userData.headline || "",
        preferred_location: userData.preferred_location || "",
      });
      if (userData.avatar) setAvatarPreview(userData.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // Notification toggles
  const [jobAlerts, setJobAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    const form = new FormData();
    form.append("avatar", file);
    try {
      await api.post("/jobseeker/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to update avatar.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put("/jobseeker/settings", profileForm);
      toast.success("Profile updated successfully!");
      mutate("/jobseeker/settings");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const current_password = form.get("current_password") as string;
    const new_password = form.get("new_password") as string;
    const new_password_confirmation = form.get("new_password_confirmation") as string;

    if (new_password !== new_password_confirmation) {
      toast.error("New passwords do not match.");
      return;
    }

    if (current_password && new_password && current_password === new_password) {
      toast.error("New password must be different from your current password.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.put("/jobseeker/change-password", {
        current_password, new_password, new_password_confirmation
      });
      toast.success("Password changed successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Job Seeker';
  const displayAvatar = avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1B2A6B&color=fff&size=100`;

  return (
    <JobseekerDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your personal profile, security, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Settings */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Section */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <User size={18} className="text-[#1B2A6B]" />
              <h2 className="text-lg font-black text-slate-800">Personal Information</h2>
            </div>
            <div className="p-6 space-y-5">
              {isLoading ? (
                <div className="flex items-center justify-center h-32 text-slate-400">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : (
                <>
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md shrink-0">
                      <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <label
                        className="inline-block cursor-pointer px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        Change Avatar
                      </label>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <p className="text-[10px] text-slate-400 font-semibold mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Location</label>
                      <input
                        type="text"
                        value={profileForm.preferred_location}
                        onChange={e => setProfileForm({ ...profileForm, preferred_location: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        placeholder="e.g. Hyderabad, India"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Headline</label>
                      <input
                        type="text"
                        value={profileForm.headline}
                        onChange={e => setProfileForm({ ...profileForm, headline: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B2A6B]"
                        placeholder="e.g. Full Stack Developer | 3 YOE"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end border-t border-slate-100 pt-5 mt-2">
                <button
                  type="submit"
                  disabled={isSaving || isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Bell size={18} className="text-[#C9A227]" />
              <h2 className="text-lg font-black text-slate-800">Notification Preferences</h2>
            </div>
            <div className="p-6 space-y-6">
              {[
                { label: "Job Alerts", desc: "Get emails when companies post jobs matching your skills.", state: jobAlerts, toggle: () => { setJobAlerts(!jobAlerts); toast.success("Preference saved."); }, icon: <Mail size={18} className="text-blue-600" />, bg: "bg-blue-50" },
                { label: "Newsletter & Tips", desc: "Receive interview prep tips and resume guides weekly.", state: newsletter, toggle: () => { setNewsletter(!newsletter); toast.success("Preference saved."); }, icon: <Mail size={18} className="text-amber-600" />, bg: "bg-amber-50" },
                { label: "SMS Notifications", desc: "Instant SMS for interview invites and urgent updates.", state: smsAlerts, toggle: () => { setSmsAlerts(!smsAlerts); toast.success("Preference saved."); }, icon: <Smartphone size={18} className="text-emerald-600" />, bg: "bg-emerald-50" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-0.5">{item.label}</h3>
                      <p className="text-xs font-semibold text-slate-500 max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={item.toggle}
                    className={`w-11 h-6 rounded-full relative transition-colors shadow-inner shrink-0 flex items-center ${item.state ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 bg-white rounded-full shadow-sm mx-1"
                      animate={{ x: item.state ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Security */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-[#0d1635] to-[#1B2A6B] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <h3 className="font-black text-lg mb-1 flex items-center gap-2 relative z-10">
              <Shield size={18} className="text-[#C9A227]" /> Change Password
            </h3>
            <p className="text-xs text-white/70 font-medium mb-6 relative z-10">Keep your account secure with a strong password.</p>

            <form onSubmit={handleChangePassword} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    name="current_password"
                    type={showCurrentPw ? "text" : "password"}
                    required
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#C9A227] pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    name="new_password"
                    type={showNewPw ? "text" : "password"}
                    required
                    minLength={8}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#C9A227] pr-10"
                    placeholder="Min 8 characters"
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    name="new_password_confirmation"
                    type={showConfirmPw ? "text" : "password"}
                    required
                    minLength={8}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#C9A227] pr-10"
                    placeholder="Repeat new password"
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                {isChangingPassword ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-black text-slate-800 text-sm mb-4">Account Status</h3>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs font-black text-emerald-800">Verified Job Seeker Account</p>
                <p className="text-[10px] font-bold text-emerald-600/70 mt-0.5">Your email has been verified.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </JobseekerDashboardLayout>
  );
}
