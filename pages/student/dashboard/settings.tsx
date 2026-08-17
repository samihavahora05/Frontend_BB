import { DashboardLayout } from "../../../src/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Input } from "../../../src/components/ui/Input";
import { User, Lock, Bell, Eye, Trash2, Mail, Phone, Shield, Loader2 } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import { useState, useEffect } from "react";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function SettingsPage() {
  const { data, isLoading, mutate } = useSWR("/profile", fetcher);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    name: "",
    phone: "",
    bio: "",
    college_name: "",
    university: "",
    course: "",
    specialization: "",
    graduation_year: "",
    skills: "",
    city: "",
    state: "",
    country: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      const p = data.profile || {};
      const u = data.user || {};
      setFormData({
        first_name: p.first_name || u.first_name || "",
        last_name: p.last_name || u.last_name || "",
        name: u.name || "",
        phone: p.phone || u.phone || "",
        bio: p.bio || "",
        college_name: p.college_name || "",
        university: p.university || "",
        course: p.course || "",
        specialization: p.specialization || "",
        graduation_year: p.graduation_year ? String(p.graduation_year) : "",
        skills: Array.isArray(p.skills) ? p.skills.join(", ") : (p.skills || ""),
        city: p.city || "",
        state: p.state || "",
        country: p.country || "",
        linkedin_url: p.linkedin_url || "",
        github_url: p.github_url || "",
        portfolio_url: p.portfolio_url || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/profile", formData);
      await mutate();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-500 text-sm">Manage your profile, security, and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Settings Tabs Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1B2A6B] text-white font-semibold text-sm shadow-md shadow-[#1B2A6B]/20">
              <User size={18} /> General
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold text-sm transition-colors">
              <Lock size={18} /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold text-sm transition-colors">
              <Bell size={18} /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold text-sm transition-colors">
              <Eye size={18} /> Appearance
            </button>
            <div className="pt-4 mt-4 border-t border-slate-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors">
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>

          {/* Main Settings Form */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your photo and personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <img src={data?.profile?.profile_photo ? `/storage/${data.profile.profile_photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(data?.user?.name || 'User')}&background=1B2A6B&color=fff`} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-sm" />
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                    </div>
                    <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="py-12 text-center text-slate-400">Loading your information...</div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <Input icon={<User size={16}/>} value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <Input icon={<User size={16}/>} value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} placeholder="Last Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <Input icon={<Mail size={16}/>} value={data?.user?.email || ""} disabled className="bg-slate-50 opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <Input icon={<Phone size={16}/>} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Bio</label>
                    <Input value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Tell us about yourself..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">College / Institute</label>
                    <Input value={formData.college_name} onChange={(e) => setFormData({...formData, college_name: e.target.value})} placeholder="College Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Course / Degree</label>
                    <Input value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} placeholder="e.g. B.Tech Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Specialization</label>
                    <Input value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Software Engineering" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Graduation Year</label>
                    <Input type="number" value={formData.graduation_year} onChange={(e) => setFormData({...formData, graduation_year: e.target.value})} placeholder="2026" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Top Skills (comma separated)</label>
                    <Input value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} placeholder="React, Node.js, Python, Tailwind" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">City</label>
                    <Input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">State / Country</label>
                    <Input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="Country" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
                    <Input value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">GitHub URL</label>
                    <Input value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} placeholder="https://github.com/username" />
                  </div>
                </div>
                )}
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <Button variant="primary" onClick={handleSave} disabled={isSaving || isLoading}>
                    {isSaving ? <><Loader2 size={16} className="animate-spin mr-2"/> Saving...</> : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield size={20} className="text-emerald-500" /> Account Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div>
                    <h4 className="font-bold text-slate-800">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
