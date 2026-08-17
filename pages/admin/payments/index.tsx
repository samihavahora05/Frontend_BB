import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { CreditCard, DollarSign, Search, CheckCircle, Clock, Trash } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import { useState } from "react";

const MOCK_PAYMENTS = [
  { id: 1, txnId: "TXN-8742-901", user: "Priya Patel", desc: "Full Stack Bootcamp Course", amount: "₹8,500", date: "Oct 28, 2025", status: "Success" },
  { id: 2, txnId: "TXN-1029-456", user: "NIT Trichy", desc: "Enterprise Institution Plan", amount: "₹45,000", date: "Oct 26, 2025", status: "Success" },
  { id: 3, txnId: "TXN-9823-112", user: "Rahul Verma", desc: "1-on-1 Consultation Call", amount: "₹2,000", date: "Oct 25, 2025", status: "Failed" },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  const handleRefund = (id: number) => {
    if (confirm("Are you sure you want to refund this transaction?")) {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "Refunded" } : p));
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Payments & Transactions</h1>
          <p className="text-slate-500 font-medium text-sm">Monitor system invoicing, payout cycles, and payment gate statuses.</p>
        </div>
        <div className="bg-[#02042B] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            {/* Simulating Razorpay text logo */}
            <span className="text-white text-lg font-black tracking-tighter">Razorpay</span>
          </div>
          <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded ml-2 shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Revenue Collected", value: "₹4.58M", count: "348 Transactions" },
          { label: "Pending Payouts", value: "₹1,24,000", count: "12 Experts" },
          { label: "Refunded Volume", value: "₹15,400", count: "3 Refund Claims" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
            <h3 className="text-2xl font-black text-slate-800 mb-2">{card.value}</h3>
            <p className="text-xs text-slate-400 font-semibold">{card.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Customer & Plan</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6 text-slate-500 font-bold">{pay.txnId}</td>
                  <td className="py-4 px-6">
                    <p className="font-sans text-sm font-bold text-slate-800">{pay.user}</p>
                    <p className="font-sans text-xs text-slate-400 font-medium mt-0.5">{pay.desc}</p>
                  </td>
                  <td className="py-4 px-6 font-sans font-semibold text-slate-500">{pay.date}</td>
                  <td className="py-4 px-6 text-sm font-black text-slate-800">{pay.amount}</td>
                  <td className="py-4 px-6">
                    {pay.status === "Success" && <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold">Success</Badge>}
                    {pay.status === "Failed" && <Badge className="bg-rose-50 text-rose-700 border-none font-bold">Failed</Badge>}
                    {pay.status === "Refunded" && <Badge className="bg-amber-50 text-amber-700 border-none font-bold">Refunded</Badge>}
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    {pay.status === "Success" && (
                      <button
                        onClick={() => handleRefund(pay.id)}
                        className="text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Refund Transaction
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
