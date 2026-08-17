import { ExpertDashboardLayout } from "../../../src/layout/ExpertDashboardLayout";
import { DollarSign, Download, History, CreditCard, Shield, ArrowUpRight } from "lucide-react";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ExpertEarnings() {
  const { data: metricsRes, isLoading: isLoadingMetrics } = useSWR("/expert/metrics", fetcher);
  const { data: txRes, isLoading: isLoadingTx } = useSWR("/expert/transactions", fetcher);

  const metrics = metricsRes?.data || { pending_payout: 0, hours_mentored: 0 };
  const transactions = txRes?.data || [];
  const [filter, setFilter] = useState("All Time");

  const filteredTransactions = transactions.filter((t: any) => {
    if (filter === "This Month") return t.month === "Oct";
    if (filter === "Last Month") return t.month === "Sep";
    return true;
  });

  const handleWithdrawal = () => {
    const toastId = toast.loading("Processing withdrawal request...");
    setTimeout(() => {
      toast.success("Withdrawal requested successfully!", { id: toastId });
    }, 1500);
  };

  const handleDownload = () => {
    toast.success("Downloading statement as PDF...");
  };

  return (
    <ExpertDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] mb-1">Earnings & Payouts</h1>
          <p className="text-slate-500 font-medium text-sm">Track your revenue, view transaction history, and manage payouts.</p>
        </div>
        <button onClick={handleDownload} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm">
          <Download size={16} /> Download Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnimatedContent direction="up" delay={0.1} className="bg-gradient-to-br from-[#1B2A6B] to-[#0d1635] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-white/70 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2"><DollarSign size={14} /> Available Balance</p>
          <h2 className="text-4xl font-black mb-4">{isLoadingMetrics ? "..." : `$${metrics.pending_payout.toFixed(2)}`}</h2>
          <button onClick={handleWithdrawal} className="w-full py-2.5 bg-[#C9A227] text-[#0d1635] text-sm font-bold rounded-xl shadow-md hover:bg-[#b08d22] transition-colors">
            Withdraw Funds
          </button>
          <div className="flex justify-center items-center gap-1.5 mt-4 text-white/50 text-[10px] font-medium tracking-wide uppercase">
            <Shield size={12} /> Powered by RazorpayX
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <ArrowUpRight size={20} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Earned (This Month)</p>
          <h3 className="text-2xl font-black text-[#0d1635]">{isLoadingMetrics ? "..." : `$${(metrics.pending_payout).toFixed(2)}`}</h3>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <CreditCard size={20} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Next Payout Date</p>
          <h3 className="text-2xl font-black text-[#0d1635]">TBD</h3>
        </AnimatedContent>
      </div>

      <AnimatedContent direction="up" delay={0.4} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <h2 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
            <History size={18} className="text-[#1B2A6B]" /> Transaction History
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 bg-white focus:outline-none focus:border-[#1B2A6B]"
          >
            <option>All Time</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Transaction Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingTx ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center">
                      <History size={32} className="text-slate-300 mb-3" />
                      <p className="font-bold text-slate-700">No transactions found for this period.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn: any) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{txn.description}</p>
                      <p className="text-[10px] font-semibold text-slate-400">{txn.id}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">{txn.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md ${txn.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-black ${txn.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedContent>
    </ExpertDashboardLayout>
  );
}
