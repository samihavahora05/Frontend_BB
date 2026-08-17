import { CompaniesDashboardLayout } from "../../src/layout/CompaniesDashboardLayout";
import { Mail, MapPin, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "../../src/components/ui/Button";
import toast from "react-hot-toast";

export default function CompanyProfilePage() {
  return (
    <CompaniesDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your company's public presence on BlueBoxx.</p>
          </div>
          <Button variant="primary" onClick={() => toast.success("Simulated: Profile Updated")}>Save Changes</Button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Cover & Avatar */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl p-2 shadow-lg border border-slate-100 flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-16 h-16 object-contain" />
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-extrabold text-slate-900">Google India</h2>
              <CheckCircle2 className="text-blue-500" size={20} />
            </div>
            <p className="text-slate-500 mb-6 max-w-2xl">
              Google is a multinational technology company focusing on artificial intelligence, online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form Section 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Name</label>
                  <input type="text" defaultValue="Google India" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Industry</label>
                  <input type="text" defaultValue="Technology / Software" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">About Company</label>
                  <textarea rows={4} defaultValue="Google is a multinational technology company focusing on artificial intelligence..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                </div>
              </div>

              {/* Form Section 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Website</label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" defaultValue="https://careers.google.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Contact</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" defaultValue="careers@google.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Headquarters</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" defaultValue="Bengaluru, Karnataka, India" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompaniesDashboardLayout>
  );
}
