import { CollegeDashboardLayout } from "../../../src/layout/CollegeDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Settings, Building, Phone, Mail, Globe, Save, Camera, Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../src/lib/axios";
import { useAuth } from "../../../src/context/AuthContext";

export default function CollegeSettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin';
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    collegeName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    placementDrive: "2026 Batch",
    targetPlacement: "90",
  });

  // Load profile from DB on mount
  useEffect(() => {
    api.get("/college/profile")
      .then(res => {
        const d = res.data?.data;
        if (d) {
          setForm({
            collegeName: d.name || "",
            contactName: d.contact_person || "",
            email: d.email || "",
            phone: d.phone || "",
            website: d.website || "",
            address: d.address || "",
            placementDrive: d.placement_drive || "2026 Batch",
            targetPlacement: d.target_placement || "90",
          });
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/college/profile", {
        name: form.collegeName,
        email: form.email,
        contact_person: form.contactName,
        phone: form.phone,
        website: form.website,
        address: form.address,
        placement_drive: form.placementDrive,
        target_placement: form.targetPlacement,
      });
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <CollegeDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={28} className="animate-spin text-[#1B2A6B]" />
        </div>
      </CollegeDashboardLayout>
    );
  }

  // If logged in as admin — show info notice, don't show college profile form
  if (isAdmin) {
    return (
      <CollegeDashboardLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800 mb-1">Settings</h1>
          <p className="text-slate-500 font-medium text-sm">College profile and placement preferences.</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-amber-200 shadow-sm p-10 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-5">
            <ShieldAlert size={30} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Admin Account</h2>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            Aap abhi <span className="font-bold text-[#1B2A6B]">BlueBoxx System Admin</span> ke account se logged in hain.
            Yeh Settings page sirf approved <span className="font-bold">College Portal</span> users ke liye hai.
          </p>
          <div className="mt-6 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold">
            College settings dekhne ke liye, kisi approved college account se login karein.
          </div>
        </div>
      </CollegeDashboardLayout>
    );
  }

  return (
    <CollegeDashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your institution profile and placement preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <AnimatedContent direction="up" delay={0.05} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl bg-[#0d1635] flex items-center justify-center mx-auto text-white font-black text-2xl shadow-lg">
              {form.collegeName.charAt(0).toUpperCase() || 'C'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#C9A227] rounded-full flex items-center justify-center shadow-md hover:bg-[#d8b02c] transition-colors">
              <Camera size={13} className="text-[#0d1635]" />
            </button>
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-0.5">{form.collegeName || 'College Name'}</h3>
          <p className="text-xs font-semibold text-slate-400 mb-1">College Profile</p>
          <span className="inline-flex items-center text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
            Registered
          </span>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3 text-left">
            {[
              { icon: Mail, val: form.email },
              { icon: Phone, val: form.phone },
              { icon: Globe, val: form.website },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                <item.icon size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{item.val || '—'}</span>
              </div>
            ))}
          </div>
        </AnimatedContent>

        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Institution Info */}
          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
              <Building size={15} className="text-[#1B2A6B]" /> Institution Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "College Name", key: "collegeName" },
                { label: "Contact Person", key: "contactName" },
                { label: "Official Email", key: "email", type: "email" },
                { label: "Phone Number", key: "phone", type: "tel" },
                { label: "Website", key: "website", type: "url" },
              ].map((field) => (
                <div key={field.key} className={field.key === "collegeName" ? "sm:col-span-2" : ""}>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    disabled={(field as any).disabled}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
                <textarea
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none resize-none"
                />
              </div>
            </div>
          </AnimatedContent>

          {/* Placement Settings */}
          <AnimatedContent direction="up" delay={0.15} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
              <Settings size={15} className="text-[#1B2A6B]" /> Placement Preferences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Current Batch / Drive", key: "placementDrive" },
                { label: "Target Placement %", key: "targetPlacement" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                  <input
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                  />
                </div>
              ))}
            </div>
          </AnimatedContent>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 h-10 px-6 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors disabled:opacity-60"
            >
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </CollegeDashboardLayout>
  );
}
