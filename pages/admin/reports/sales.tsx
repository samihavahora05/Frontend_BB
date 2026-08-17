import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { DollarSign, Download, Search, Filter, TrendingUp, CreditCard } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";

const MOCK_SALES = [
  { id: "TRX-9823", user: "John Doe", item: "Full Stack Mastery", amount: "$499.00", date: "Oct 12, 2025", status: "Completed", method: "Stripe" },
  { id: "TRX-9824", user: "Jane Smith", item: "UI/UX Bootcamp", amount: "$399.00", date: "Oct 12, 2025", status: "Completed", method: "Razorpay" },
  { id: "TRX-9825", user: "Alex Johnson", item: "Data Science Pro", amount: "$599.00", date: "Oct 11, 2025", status: "Pending", method: "PayPal" },
  { id: "TRX-9826", user: "Emily Davis", item: "Backend Architecture", amount: "$450.00", date: "Oct 10, 2025", status: "Refunded", method: "Stripe" },
  { id: "TRX-9827", user: "Michael Brown", item: "System Design", amount: "$299.00", date: "Oct 09, 2025", status: "Completed", method: "Razorpay" },
];

export default function SalesReportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              Sales & Revenue Report
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Track course sales, transaction logs, and platform revenue.</p>
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
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 font-bold border-none">+12.5%</Badge>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Total Revenue</h3>
            <h2 className="text-2xl font-black text-slate-900">$124,500.00</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 font-bold border-none">+8.2%</Badge>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Total Sales</h3>
            <h2 className="text-2xl font-black text-slate-900">842 Units</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <Badge className="bg-rose-50 text-rose-700 font-bold border-none">-2.4%</Badge>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Refund Rate</h3>
            <h2 className="text-2xl font-black text-slate-900">1.2%</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Transaction History</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..."
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
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">User</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Purchased Item</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Method</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_SALES.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="py-4 px-6 font-mono font-bold text-slate-700">{sale.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{sale.user}</td>
                    <td className="py-4 px-6 font-medium text-slate-600">{sale.item}</td>
                    <td className="py-4 px-6 font-black text-emerald-600">{sale.amount}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{sale.method}</td>
                    <td className="py-4 px-6 font-medium text-slate-500">{sale.date}</td>
                    <td className="py-4 px-6">
                      <Badge className={`font-bold border-none ${
                        sale.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        sale.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {sale.status}
                      </Badge>
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
