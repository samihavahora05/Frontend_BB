import React, { useState } from "react";
import toast from "react-hot-toast";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Building, MapPin, Globe, Mail, Phone, Camera, Save } from "lucide-react";
import { useCompanyStore } from "../../../src/store/useCompanyStore";

export default function CompanyProfilePage() {
  const [saving, setSaving] = useState(false);
  const profile = useCompanyStore((s) => s.profile);
  const updateProfile = useCompanyStore((s) => s.updateProfile);
  


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none transition-all";
  const labelCls = "block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2";

  return (
    <CompanyDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Company Profile</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your public company page and branding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Branding */}
              <div>
                <h2 className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Branding</h2>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] flex items-center justify-center text-white relative group cursor-pointer shadow-inner overflow-hidden">
                    {profile.logo ? (
                      <img src={profile.logo} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building size={32} />
                    )}
                    <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={20} className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{profile.name || "Company Name"}</h3>
                    <p className="text-xs text-slate-500 mb-3">Square image, recommended 400x400px.</p>
                    <label className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer inline-block">
                      Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <h2 className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Company Name</label>
                    <input type="text" value={profile.name} onChange={e => updateProfile({ name: e.target.value })} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>About Us (Public)</label>
                    <textarea rows={4} value={profile.about} onChange={e => updateProfile({ about: e.target.value })} className={`${inputCls} resize-none`} />
                  </div>
                  <div>
                    <label className={labelCls}>Industry</label>
                    <select className={inputCls} value={profile.industry} onChange={e => updateProfile({ industry: e.target.value })}>
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Company Size</label>
                    <select className={inputCls} value={profile.size} onChange={e => updateProfile({ size: e.target.value })}>
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>51-200</option>
                      <option>201-500</option>
                      <option>500+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Contact & Location</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Website</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="url" value={profile.website} onChange={e => updateProfile({ website: e.target.value })} className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Headquarters</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={profile.location} onChange={e => updateProfile({ location: e.target.value })} className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Contact Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" value={profile.email} onChange={e => updateProfile({ email: e.target.value })} className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="tel" value={profile.phone} onChange={e => updateProfile({ phone: e.target.value })} className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all disabled:opacity-70">
                  {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                </button>
              </div>

            </form>
          </AnimatedContent>
        </div>

        {/* Right Sidebar: Preview Card */}
        <div className="lg:col-span-1 hidden lg:block">
          <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden sticky top-28 p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Public Preview</h3>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] flex items-center justify-center text-white shadow-inner mb-4 overflow-hidden">
                {profile.logo ? (
                  <img src={profile.logo} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building size={32} />
                )}
              </div>
              <h2 className="text-lg font-black text-slate-800">{profile.name || "Company Name"}</h2>
              <p className="text-xs font-bold text-[#1B2A6B] mb-2">{profile.industry || "Industry"} • {profile.size} Employees</p>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-500">
                <MapPin size={12}/> {profile.location || "Location"}
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center mb-6 line-clamp-3">
              {profile.about || "Add a description to tell candidates about your company."}
            </p>

            <div className="flex justify-center gap-3">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#1B2A6B] hover:bg-blue-50 transition-colors">
                  <Globe size={14} />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#1B2A6B] hover:bg-blue-50 transition-colors">
                  <Mail size={14} />
                </a>
              )}
            </div>
          </AnimatedContent>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
