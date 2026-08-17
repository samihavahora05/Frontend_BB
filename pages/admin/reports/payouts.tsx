import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Wallet, Download, Search, Filter, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";

const MOCK_PAYOUTS = [
  { id: "PO-4029", expert: "Dr. Alan Turing", role: "AI Mentor", amount: "$1,250.00", date: "Oct 15, 2025", status: "Pending", method: "Bank Transfer" },
  { id: "PO-4028", expert: "Sarah Connor", role: "Cybersecurity", amount: "$890.00", date: "Oct 12, 2025", status: "Paid", method: "PayPal" },
  { id: "PO-4027", expert: "John Smith", role: "UI/UX Expert", amount: "$450.00", date: "Oct 10, 2025", status: "Paid", method: "Bank Transfer" },
  { id: "PO-4026", expert: "Emma Watson", role: "Data Science", amount: "$2,100.00", date: "Oct 05, 2025", status: "Failed", method: "Stripe Connect" },
  { id: "PO-4025", expert: "Michael Scott", role: "Management", amount: "$300.00", date: "Oct 01, 2025", status: "Paid", method: "PayPal" },
];

export default function PayoutsReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [payouts, setPayouts] = useState(MOCK_PAYOUTS);

  const handleProcessPayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "Paid" } : p));
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-[#1B2A6B]" />
              Expert Payouts & Settlements
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Manage pending mentor payouts and review historical settlements.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 bg-[#1B2A6B] text-white px-4 py-2 rounded-xl hover:bg-[#0d1635] transition-colors font-bold text-sm shadow-sm">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Pending Payouts</h3>
            <h2 className="text-2xl font-black text-slate-900">$4,350.00</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Across 12 Experts</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Total Paid (This Month)</h3>
            <h2 className="text-2xl font-black text-slate-900">$18,240.00</h2>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1"><ArrowUpRight size={12}/> +5.4% from last month</p>
          </div>
          <div className="bg-[#1B2A6B] rounded-2xl p-6 shadow-md relative overflow-hidden text-white">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white blur-2xl"></div>
            <h3 className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Platform Commission</h3>
            <h2 className="text-3xl font-black mb-1">$8,450.00</h2>
            <p className="text-xs text-white/80 font-medium leading-relaxed mt-4">
              Revenue retained after all expert settlements and payment gateway fees are processed.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Settlement Queue</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search experts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Payout ID</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Expert / Mentor</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Amount Due</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Method</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Date Requested</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="py-4 px-6 font-mono font-bold text-slate-400">{payout.id}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{payout.expert}</p>
                      <p className="text-xs font-semibold text-slate-400">{payout.role}</p>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-800">{payout.amount}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{payout.method}</td>
                    <td className="py-4 px-6 font-medium text-slate-500">{payout.date}</td>
                    <td className="py-4 px-6">
                      <Badge className={`font-bold border-none ${
                        payout.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                        payout.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {payout.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {payout.status === 'Pending' ? (
                        <button 
                          onClick={() => handleProcessPayout(payout.id)}
                          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Process
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs font-bold uppercase">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
