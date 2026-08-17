import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Smartphone, Save, Key, Globe, TestTube2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { useState } from "react";

export default function AdminPushSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [isTesting, setIsTesting] = useState(false);
  const [isTested, setIsTested] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  const [permissionRequested, setPermissionRequested] = useState(false);

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setIsTested(true);
      setTimeout(() => setIsTested(false), 3000);
    }, 1500);
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Web Push Configuration</h1>
            <p className="text-slate-500 text-sm">Configure Firebase/VAPID keys to send push notifications to browsers and devices.</p>
          </div>
          <Button 
            variant={isSaved ? "outline" : "primary"} 
            className={`shadow-md gap-2 ${isSaved ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}`}
            onClick={handleSave}
            disabled={isSaving || isSaved}
          >
            {isSaving ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</span>
            ) : isSaved ? (
              <span className="flex items-center gap-2"><CheckCircle2 size={18}/> Saved</span>
            ) : (
              <span className="flex items-center gap-2"><Save size={18}/> Save Keys</span>
            )}
          </Button>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                 <Key size={18} className="text-[#1B2A6B]" /> VAPID Keys (Web Push)
              </h2>
           </div>
           
           <div className="p-6 space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3 text-blue-800 text-sm">
                 <AlertCircle size={20} className="shrink-0 mt-0.5" />
                 <p>To send push notifications across web browsers (Chrome, Safari, Firefox), you need to generate a VAPID key pair. Keep your private key extremely secure.</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Public VAPID Key</label>
                    <textarea 
                      defaultValue="BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none h-20 resize-none"
                    ></textarea>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Private VAPID Key</label>
                    <input 
                      type="password"
                      defaultValue="*******************************************"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Subject (Email or URL)</label>
                    <input 
                      type="text"
                      defaultValue="mailto:admin@blueboxx.in"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                    />
                 </div>
              </div>
           </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                 <TestTube2 size={18} className="text-[#1B2A6B]" /> Test Configuration
              </h2>
           </div>
           
           <div className="p-6">
              <p className="text-sm text-slate-500 mb-6">Send a test push notification to your current device to verify that the keys are configured correctly.</p>
              <div className="flex gap-4">
                 <Button variant="outline" className={`gap-2 bg-white ${permissionRequested ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}`} onClick={() => setPermissionRequested(true)}>
                   {permissionRequested ? <CheckCircle2 size={16} /> : <Globe size={16} />} 
                   {permissionRequested ? 'Permission Requested' : 'Request Browser Permission'}
                 </Button>
                 <Button 
                   variant={isTested ? "outline" : "primary"} 
                   className={`gap-2 shadow-md ${isTested ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'bg-[#1B2A6B] hover:bg-[#0d1635]'}`}
                   onClick={handleTest}
                   disabled={isTesting || isTested}
                 >
                   {isTesting ? (
                     <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...</span>
                   ) : isTested ? (
                     <span className="flex items-center gap-2"><CheckCircle2 size={16}/> Sent!</span>
                   ) : (
                     <span className="flex items-center gap-2"><Smartphone size={16} /> Send Test Push</span>
                   )}
                 </Button>
              </div>
           </div>
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}
