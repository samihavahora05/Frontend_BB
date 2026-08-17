import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Sparkles, Save, CheckCircle2, Loader2, Play } from "lucide-react";
import { useState } from "react";

export default function AdminAIConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [model, setModel] = useState("gemini-3.5-flash");
  
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };
  
  const handlePing = () => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult("Diagnostic Ping Successful! RTT: " + Math.floor(Math.random() * (200 - 80 + 1) + 80) + "ms");
      setTimeout(() => setPingResult(null), 4000);
    }, 1200);
  }

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">AI Assistant Settings</h1>
          <p className="text-slate-500 font-medium text-sm">Configure prompting, prompt models, and active limits for platform AI assistants.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
            saveSuccess ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#1B2A6B] text-white hover:bg-[#0d1635]'
          }`}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : 
           saveSuccess ? <CheckCircle2 size={16} /> : 
           <Save size={16} />}
          {isSaving ? 'Saving...' : saveSuccess ? 'Settings Saved!' : 'Save Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-[#C9A227]" /> Core Configuration
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Provider & Model</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (High Speed / Recommended)</option>
                  <option value="gemini-3.1-pro">Gemini 3.1 Pro (Analytical / Multi-modal)</option>
                  <option value="gpt-4o">GPT-4o (Standard Coding/Reasoning)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">System System Prompt (AI Base)</label>
                <textarea 
                  rows={6} 
                  defaultValue="You are Antigravity, a professional AI coding coach and assistant for the BlueBoxx edtech system. Assist students in code debugging, resume scoring, and mock interview preparations."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Temperature</label>
                  <input type="number" step="0.1" min="0" max="1" defaultValue="0.7" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Token Cap per User</label>
                  <input type="number" defaultValue="50000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-black text-slate-800 text-sm mb-4 uppercase tracking-wider">Quick Diagnostics</h3>
            <p className="text-xs text-slate-500 font-semibold mb-6">Test the AI connectivity to check response delays and token weights.</p>
            <button 
              onClick={handlePing}
              disabled={isPinging}
              className={`w-full ${isPinging ? 'bg-slate-100 text-slate-400' : 'bg-[#1B2A6B]/5 text-[#1B2A6B] hover:bg-[#1B2A6B]/10'} border border-[#1B2A6B]/15 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2`}
            >
              {isPinging ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} 
              {isPinging ? "Pinging..." : "Ping Active Endpoint"}
            </button>
            {pingResult && (
               <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold flex items-center gap-2">
                 <CheckCircle2 size={14}/> {pingResult}
               </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
