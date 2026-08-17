import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  Settings, Save, UserCog, ShieldCheck, Mail
} from "lucide-react";
import toast from "react-hot-toast";

export default function StaffSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    autoApproveStaff: false,
    defaultRole: "Editor",
    notifyOnNewStaff: true,
    require2FA: false,
    maxStaffCapacity: 50,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Staff settings updated successfully!");
    }, 800);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog className="w-6 h-6 text-indigo-600" />
              Staff Settings
            </h1>
            <p className="text-gray-500 mt-1">
              Configure global preferences and defaults for staff accounts.
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 font-medium text-sm"
          >
            {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              General Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Staff Role
                </label>
                <select 
                  value={settings.defaultRole}
                  onChange={(e) => setSettings({...settings, defaultRole: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Administrator</option>
                  <option>Editor</option>
                  <option>Moderator</option>
                  <option>Support Agent</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Role automatically assigned to newly invited staff.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Staff Capacity
                </label>
                <input 
                  type="number"
                  value={settings.maxStaffCapacity}
                  onChange={(e) => setSettings({...settings, maxStaffCapacity: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <span className="block text-sm font-medium text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Auto-Approve Staff Registration</span>
                    <span className="block text-xs text-gray-500">Allow users with corporate email domains to join without admin approval.</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.autoApproveStaff}
                      onChange={(e) => setSettings({...settings, autoApproveStaff: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Security & Notifications */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Staff Security
              </h2>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="block text-sm font-medium text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Enforce Two-Factor Auth (2FA)</span>
                  <span className="block text-xs text-gray-500">Require all staff members to configure 2FA upon their next login.</span>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.require2FA}
                    onChange={(e) => setSettings({...settings, require2FA: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                Notifications
              </h2>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="block text-sm font-medium text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">New Staff Alerts</span>
                  <span className="block text-xs text-gray-500">Send me an email when a new staff member is added or registers.</span>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifyOnNewStaff}
                    onChange={(e) => setSettings({...settings, notifyOnNewStaff: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
