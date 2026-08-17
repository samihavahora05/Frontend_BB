import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Tags, Plus, Search, MoreHorizontal, Trash, X } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";
import { useState, useEffect } from "react";

const INITIAL_COUPONS = [
  { id: 1, code: "FESTIVE30", discount: "30%", type: "Percentage", expiry: "Dec 31, 2025", status: "Active" },
  { id: 2, code: "BLUE500", discount: "₹500", type: "Flat", expiry: "Nov 30, 2025", status: "Active" },
  { id: 3, code: "WELCOME10", discount: "10%", type: "Percentage", expiry: "Expired", status: "Expired" },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('bb_coupons');
    if (stored) {
      setCoupons(JSON.parse(stored));
    } else {
      setCoupons(INITIAL_COUPONS);
      localStorage.setItem('bb_coupons', JSON.stringify(INITIAL_COUPONS));
    }
  }, []);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [newCouponExpiry, setNewCouponExpiry] = useState("");

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCouponCode && newCouponDiscount && newCouponExpiry) {
      const newCoupon = {
        id: Date.now(),
        code: newCouponCode.toUpperCase(),
        discount: newCouponDiscount.includes("%") || newCouponDiscount.startsWith("₹") ? newCouponDiscount : `₹${newCouponDiscount}`,
        type: newCouponDiscount.includes("%") ? "Percentage" : "Flat",
        expiry: new Date(newCouponExpiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: new Date(newCouponExpiry) > new Date() ? "Active" : "Expired"
      };
      const updated = [newCoupon, ...coupons];
      setCoupons(updated);
      localStorage.setItem('bb_coupons', JSON.stringify(updated));
      
      // Reset & close
      setNewCouponCode("");
      setNewCouponDiscount("");
      setNewCouponExpiry("");
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteCoupon = (id: number) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      const updated = coupons.filter(c => c.id !== id);
      setCoupons(updated);
      localStorage.setItem('bb_coupons', JSON.stringify(updated));
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Coupons & Promo Offers</h1>
          <p className="text-slate-500 font-medium text-sm">Create and configure marketing promotional codes and pricing campaigns.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Coupon Code</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Discount Rate</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Expiration Date</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50 transition-colors group font-mono text-xs">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 font-sans font-black text-slate-800 text-sm">
                      <Tags size={16} className="text-[#C9A227]" /> {coupon.code}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#1B2A6B] font-bold font-sans text-sm">{coupon.discount}</td>
                  <td className="py-4 px-6 font-sans text-slate-500 font-semibold">{coupon.type}</td>
                  <td className="py-4 px-6 font-sans text-slate-500 font-semibold">{coupon.expiry}</td>
                  <td className="py-4 px-6 font-sans">
                    {coupon.status === "Active" ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold">Active</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500 border-none font-bold">Expired</Badge>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-sans">
                    <button 
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">Create Promo Coupon</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-xl"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. WELCOME20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discount Rate (e.g. 20% or 500)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 25% or 300"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                <input 
                  type="date" 
                  required
                  value={newCouponExpiry}
                  onChange={(e) => setNewCouponExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B]"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
