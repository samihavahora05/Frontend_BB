import React from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { CreditCard, Download, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import { useAuth } from "../../../src/context/AuthContext";
import toast from "react-hot-toast";

const fetcher = async (url: string) => {
  const res = await api.get(url);
  return res.data?.data || res.data;
};

export default function PaymentsPage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useSWR(isAuthenticated ? "/student/payments" : null, fetcher, {
    revalidateOnFocus: true,
  });

  const orders = data?.orders || [];
  const totalSpent = data?.total_spent || 0;

  const handleDownloadInvoice = (orderNumber: string) => {
    toast.success(`Opening invoice for order #${orderNumber}...`);
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider"><CheckCircle2 size={12} /> Completed</span>;
      case "pending":
        return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider"><Clock size={12} /> Pending</span>;
      case "failed":
      case "cancelled":
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider"><XCircle size={12} /> {status}</span>;
      default:
        return <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Payment History</h1>
        <p className="text-slate-500 text-sm font-medium">View your past purchases, manage billing, and download invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-semibold animate-pulse border border-slate-200 rounded-2xl bg-white">Loading payment history...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <CreditCard size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="font-black text-slate-600 mb-1">No payment history</p>
              <p className="text-xs text-slate-400 font-semibold mb-4">You haven't made any purchases yet.</p>
            </div>
          ) : (
            orders.map((order: any, i: number) => (
              <AnimatedContent key={order.id} direction="up" delay={i * 0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Order #{order.order_number}</p>
                    <p className="text-xs font-semibold text-slate-600">{new Date(order.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <button
                      onClick={() => handleDownloadInvoice(order.order_number)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-[#1B2A6B] rounded-lg transition-colors"
                      title="Download Invoice"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1 space-y-4 w-full">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#1B2A6B]/5 text-[#1B2A6B] rounded-xl flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-800 text-sm line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-slate-800 text-sm">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full md:w-auto shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center md:text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-slate-800">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Paid via {order.payment_method || "Online"}</p>
                  </div>
                </div>
              </AnimatedContent>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnimatedContent direction="up" delay={0.1} className="bg-gradient-to-br from-[#0d1635] to-[#1c2e6b] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <CreditCard size={28} className="text-[#C9A227] mb-4" />
            <h3 className="text-lg font-black mb-1">Total Spent</h3>
            <p className="text-4xl font-black mb-1">₹{parseFloat(totalSpent).toLocaleString('en-IN')}</p>
            <p className="text-xs text-white/50 font-medium mt-4">This includes all successfully processed payments.</p>
          </AnimatedContent>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-800 mb-3">Billing Support</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Having trouble with a recent payment or missing an invoice?</p>
            <button onClick={() => window.location.href = "/student/support"} className="w-full py-2.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </StudentDashboardLayout>
  );
}
