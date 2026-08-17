import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { TerminalSquare, Plus, Key, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const INITIAL_KEYS = [
  { id: 1, name: "Stripe Payment webhook", value: "sk_live_51Oz...9p3K", active: true },
  { id: 2, name: "Sendgrid SMTP mail key", value: "SG.yT9821h...Pq01", active: true },
];

export default function AdminDeveloperPage() {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleGenerateKey = () => {
    const name = prompt("Enter a description for this API key:");
    if (name) {
      const newKey = {
        id: Date.now(),
        name,
        value: `pk_live_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        active: true
      };
      setKeys(prev => [...prev, newKey]);
    }
  };

  const handleCopy = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Developer Settings & SMTP</h1>
          <p className="text-slate-500 font-medium text-sm">Configure system integration endpoints, webhooks, and API access.</p>
        </div>
        <button 
          onClick={handleGenerateKey}
          className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Generate New Key
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <TerminalSquare size={20} className="text-[#C9A227]" />
          <h2 className="text-lg font-black text-slate-800">System API Credentials</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {keys.map((key) => (
            <div key={key.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div>
                <h3 className="text-sm font-black text-slate-800 mb-1">{key.name}</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                  <Key size={12} /> {key.value}
                </div>
              </div>
              
              <button 
                onClick={() => handleCopy(key.id)}
                className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  copiedId === key.id 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {copiedId === key.id ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copiedId === key.id ? "Copied!" : "Copy Key"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
