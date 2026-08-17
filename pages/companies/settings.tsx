import { CompaniesDashboardLayout } from "../../src/layout/CompaniesDashboardLayout";
import { Bell, Lock, Shield, CreditCard, User } from "lucide-react";
import { Button } from "../../src/components/ui/Button";
import toast from "react-hot-toast";

export default function CompanySettingsPage() {
  return (
    <CompaniesDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage notifications, security, and team access.</p>
          </div>
          <Button variant="primary" onClick={() => toast.success("Simulated: Settings Saved")}>Save Changes</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl">
                <User size={18} /> General
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl">
                <Bell size={18} /> Notifications
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl">
                <Lock size={18} /> Security
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl">
                <CreditCard size={18} /> Billing
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl">
                <Shield size={18} /> API Access
              </a>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">General Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Account Name</label>
                <input type="text" defaultValue="Google HR Team" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Primary Email</label>
                <input type="email" defaultValue="admin@google.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Timezone</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                  <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                  <option>(GMT+00:00) Greenwich Mean Time</option>
                </select>
              </div>

              <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
                <div>
                  <h3 className="font-bold text-red-900 text-sm">Danger Zone</h3>
                  <p className="text-xs text-red-700 font-medium">Permanently delete your company account and all associated data.</p>
                </div>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => toast.success("Simulated: Delete Account")}>Delete Account</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompaniesDashboardLayout>
  );
}
