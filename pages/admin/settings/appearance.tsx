import React from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Palette, Check } from "lucide-react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const TABS = [
  { id: "themes", label: "Themes", href: "/admin/settings/appearance/themes" },
  { id: "colors", label: "Theme Color Scheme", href: "/admin/settings/appearance/colors" },
  { id: "fonts", label: "Theme Font", href: "/admin/settings/appearance/fonts" },
];

const THEMES = [
  { id: "dark-blue", name: "Dark Blue (Default)", primary: "#0d1635", accent: "#C9A227" },
  { id: "midnight", name: "Midnight Black", primary: "#1a1a2e", accent: "#e94560" },
  { id: "forest", name: "Forest Green", primary: "#1b4332", accent: "#52b788" },
  { id: "ocean", name: "Deep Ocean", primary: "#03045e", accent: "#48cae4" },
];

export default function AdminAppearancePage() {
  const router = useRouter();
  const activeTab = (router.query.tab as string) || "themes";
  const [activeTheme, setActiveTheme] = React.useState("dark-blue");
  const [selectedFont, setSelectedFont] = React.useState("Inter");

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Appearance</h1>
            <p className="text-slate-500 text-sm font-medium">Customize the look and feel of your admin panel.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-bold text-slate-400">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`pb-3 transition-all ${
                activeTab === tab.id || (activeTab === "themes" && tab.id === "themes")
                  ? "border-b-2 border-[#1B2A6B] text-[#1B2A6B] font-extrabold"
                  : "hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
            <Palette size={18} className="text-[#1B2A6B]" /> Select Admin Theme
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {THEMES.map((theme) => (
              <div
                key={theme.id}
                onClick={() => { setActiveTheme(theme.id); toast.success(`Theme changed to ${theme.name}`); }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${
                  activeTheme === theme.id
                    ? "border-[#1B2A6B] shadow-lg shadow-[#1B2A6B]/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Theme Preview */}
                <div className="flex h-28" style={{ background: theme.primary }}>
                  <div className="w-16 h-full flex flex-col gap-2 p-3" style={{ background: `${theme.primary}dd` }}>
                    {[1,2,3,4].map(n => <div key={n} className="h-1.5 rounded-full" style={{ background: `${theme.accent}50`, width: n % 2 === 0 ? '60%' : '80%' }} />)}
                  </div>
                  <div className="flex-1 p-3 space-y-2">
                    <div className="h-2 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.15)' }} />
                    <div className="h-8 rounded-xl" style={{ background: `${theme.accent}30` }} />
                    <div className="h-2 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  </div>
                </div>

                {/* Theme Name */}
                <div className="px-4 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-700">{theme.name}</span>
                  {activeTheme === theme.id && (
                    <span className="w-6 h-6 rounded-full bg-[#1B2A6B] flex items-center justify-center shadow-sm">
                      <Check size={12} className="text-white" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => toast.success("Appearance settings saved!")}
              className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
