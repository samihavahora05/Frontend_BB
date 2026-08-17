import { CollegesDashboardLayout } from "../../../src/layout/CollegesDashboardLayout";
import { Building2, Mail, Lock, Save, Globe, MapPin, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CollegeSettings() {
  const [logo, setLogo] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Institution details updated successfully!");
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security settings updated!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogo(url);
      toast.success("Logo updated successfully!");
    }
  };

  return (
    <CollegesDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] mb-1">College Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your institution's profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-black text-[#0d1635] flex items-center gap-2">
                <Building2 size={18} className="text-[#1B2A6B]" /> Institution Details
              </h2>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              <div className="flex items-center gap-6 mb-6">
                {logo ? (
                  <img src={logo} alt="College Logo" className="w-20 h-20 rounded-xl border-2 border-slate-200 object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-3xl border-2 border-blue-100">
                    C
                  </div>
                )}
                <div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2">
                    <Upload size={14}/> Upload Logo
                  </button>
                  <p className="text-[10px] text-slate-400 font-semibold mt-2">Recommended size: 256x256px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Institution Name</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required defaultValue="National Institute of Technology" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Website</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="url" required defaultValue="https://www.nit.edu.in" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                    <textarea required rows={3} defaultValue="NIT Campus, Education Block, City, State 123456" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] resize-none"></textarea>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors flex items-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-black text-[#0d1635] flex items-center gap-2">
                <Lock size={18} className="text-[#1B2A6B]" /> Security
              </h2>
            </div>
            <form onSubmit={handleSaveSecurity} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                <input type="password" placeholder="••••••••" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                  <input type="password" placeholder="••••••••" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-[#C9A227] text-[#0d1635] text-sm font-bold rounded-xl shadow-sm hover:bg-[#b08d22] transition-colors">
                  Update Password
                </button>
              </div>
            </form>
          </AnimatedContent>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <Mail size={16} className="text-slate-400" /> Point of Contact
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Primary Contact</p>
                <p className="text-sm font-bold text-[#0d1635]">Dr. A. K. Sharma</p>
                <p className="text-xs text-slate-600 font-medium">Head of Placements</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Email</p>
                <p className="text-sm font-bold text-[#1B2A6B]">placements@nit.edu.in</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Phone</p>
                <p className="text-sm font-bold text-slate-700">+91 98765 43210</p>
              </div>
              <button onClick={() => setIsContactModalOpen(true)} className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-sm">
                Edit Contact Details
              </button>
            </div>
          </AnimatedContent>
        </div>
      </div>

      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2">Edit Contact Info</h3>
                <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setIsContactModalOpen(false); toast.success("Contact details updated!"); }} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Contact Name</label>
                  <input type="text" defaultValue="Dr. A. K. Sharma" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" defaultValue="placements@nit.edu.in" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-2.5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CollegesDashboardLayout>
  );
}
