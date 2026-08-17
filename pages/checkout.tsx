import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "../src/layout/MainLayout";
import {
  ShieldCheck, CreditCard, Smartphone, Building2, ChevronRight,
  ArrowLeft, Lock, Check, Info, BookOpen
} from "lucide-react";
import { useStore } from "../src/store/useStore";
import { useAuth } from "../src/context/AuthContext";
import { getActiveToken } from "../src/lib/authUtils";
import api from "../src/lib/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", icon: "https://logo.clearbit.com/pay.google.com", color: "#4285F4" },
  { id: "phonepe", name: "PhonePe", icon: "https://logo.clearbit.com/phonepe.com", color: "#5F259F" },
  { id: "paytm", name: "Paytm", icon: "https://logo.clearbit.com/paytm.com", color: "#002970" },
  { id: "bhim", name: "BHIM UPI", icon: "https://logo.clearbit.com/bhimupi.org.in", color: "#138808" },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, image: "/upi.png" },
  { id: "card", label: "Card", icon: CreditCard, image: "/card.png" },
  { id: "netbanking", label: "Net Banking", icon: Building2, image: "/netbanking.png" },
];

const CartItemImage = ({ thumbnail, title }: { thumbnail: string; title: string }) => {
  const [error, setError] = useState(false);
  if (!thumbnail || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1B2A6B]/10 to-[#C9A227]/10 flex items-center justify-center">
        <BookOpen size={16} className="text-[#1B2A6B]" />
      </div>
    );
  }
  return (
    <img 
      src={thumbnail} 
      alt={title} 
      onError={() => setError(true)}
      className="w-full h-full object-cover"
    />
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthReady, isAuthenticated, role, user } = useAuth();
  const { cart: cartItems, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [selectedUpi, setSelectedUpi] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;

    const hasToken = typeof window !== 'undefined' && (isAuthenticated || !!getActiveToken('/checkout'));
    if (!hasToken) {
      router.push('/login?redirect=/checkout');
    }
    // Temporarily disabled role check to allow testing enrollment for all user types
  }, [isAuthReady, isAuthenticated, role, router]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = Math.round(subtotal * 0.18);
  const discount = subtotal > 0 ? Math.min(5000, Math.round(subtotal * 0.1)) : 0;
  const total = subtotal + tax - discount;

  const handlePay = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    setCheckoutError(null);
    setProcessingStep(0); // Initializing

    try {
      // 1. Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      setProcessingStep(1); // Authorizing transaction with bank

      const hasSessionItem = cartItems.some(item => item.type === 'session');
      if (hasSessionItem) {
        const sessionItem = cartItems.find(item => item.type === 'session');
        const dateStr = new Date().toISOString().split('T')[0];

        const { data: orderRes } = await api.post(`/student/mentor-sessions/book/1`, {
          booking_date: dateStr,
          start_time: "10:00:00",
          end_time: "11:00:00",
          notes: sessionItem?.title || "1:1 Mentorship Session"
        });

        if (!orderRes?.success || !orderRes?.razorpay_order_id) {
          toast.error(orderRes?.message || "Failed to create Razorpay Order for session.");
          setIsProcessing(false);
          return;
        }

        const bookingId = orderRes.data?.booking_id || orderRes.booking_id;
        const orderId = orderRes.razorpay_order_id;
        const keyId = orderRes.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        const options: any = {
          key: keyId,
          amount: (orderRes.amount || sessionItem?.price || 999) * 100,
          currency: "INR",
          name: "Blueboxx DA",
          description: sessionItem?.title || "1:1 Mentorship Session",
          order_id: orderId,
          handler: async function (response: any) {
            setProcessingStep(2);
            try {
              const verifyRes = await api.post(`/student/mentor-sessions/verify/${bookingId}`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data?.success) {
                clearCart();
                toast.success("Mentorship session booked successfully!");
                router.push({
                  pathname: '/payment-success',
                  query: { order_id: response.razorpay_order_id, amount: sessionItem?.price || 999 }
                });
              } else {
                toast.error(verifyRes.data?.message || "Payment verification failed.");
                router.push('/payment-failed');
              }
            } catch (err: any) {
              console.error("Session verification error:", err);
              toast.error(err.response?.data?.message || "Payment verification failed.");
              router.push('/payment-failed');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: { color: "#0d1635" },
          modal: {
            ondismiss: function() { 
              setIsProcessing(false); 
              toast.error("Payment cancelled.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          toast.error(resp?.error?.description || "Payment failed. Please try again.");
          router.push('/payment-failed');
        });
        rzp.open();
        return;
      }

      // 2. Create order on backend for courses
      const courseIds = cartItems.map((item) => item.id);
      const { data } = await api.post("/checkout/create-order", { course_ids: courseIds });

      if (data?.is_free) {
        clearCart();
        toast.success(data?.message || "Enrolled successfully in free course!");
        router.push("/student/dashboard");
        return;
      }

      if (!data?.success || !data?.razorpay_order_id) {
        toast.error(data?.message || "Failed to create Razorpay Order.");
        setIsProcessing(false);
        return;
      }

      const razorpayKey = data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Blueboxx DA",
        description: "Course Enrollment",
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
          setProcessingStep(2); // Completing enrollment
          
          try {
            // Verify payment on backend securely
            const verifyRes = await api.post("/checkout/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              clearCart();
              router.push({
                pathname: '/payment-success',
                query: { order_id: response.razorpay_order_id, amount: total }
              });
            } else {
              toast.error(verifyRes.data?.message || "Payment verification failed.");
              router.push('/payment-failed');
            }
          } catch (err: any) {
            console.error("Payment verification failed", err);
            toast.error(err.response?.data?.message || "Payment verification failed.");
            router.push('/payment-failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#0d1635",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error("Payment cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setIsProcessing(false);
        toast.error(resp?.error?.description || "Payment failed.");
        router.push('/payment-failed');
      });
      rzp.open();

    } catch (err: any) {
      setIsProcessing(false);
      const serverMessage = err?.response?.data?.message || err?.message || "Failed to initiate checkout. Please try again.";
      console.warn("Checkout status:", err?.response?.status, serverMessage);
      setCheckoutError(serverMessage);
      toast.error(serverMessage, { duration: 6000 });
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-[#0d1635] text-white">
        
        {/* Premium Grid Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635] to-transparent pointer-events-none"></div>

        {/* Animated Floating Gradient Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#1B2A6B]/50 rounded-full blur-[130px] pointer-events-none -translate-y-1/3 translate-x-1/3" 
        />
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#C9A227]/20 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" 
        />

        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">

          {/* Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-400 mb-8"
          >
            <Link href="/cart" replace className="flex items-center gap-1 hover:text-white transition-colors font-medium">
              <ArrowLeft size={14} /> Cart
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-semibold">Checkout</span>
          </motion.div>

          {/* Error Banner */}
          {checkoutError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Info size={16} className="text-red-400 shrink-0" />
                <span>{checkoutError}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {checkoutError.toLowerCase().includes("already enrolled") && (
                  <Link href="/student/dashboard">
                    <button className="px-3 py-1 bg-white text-[#0d1635] rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors">
                      Go to Dashboard
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => setCheckoutError(null)}
                  className="text-red-400 hover:text-white font-bold text-sm px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT: Payment */}
            <div className="flex-1 space-y-5">

              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <h2 className="font-extrabold text-white text-base mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name</label>
                    <input type="text" placeholder="Rahul" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name</label>
                    <input type="text" placeholder="Sharma" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <input type="email" placeholder="rahul@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Number</label>
                    <div className="flex">
                      <span className="flex items-center px-3 border border-r-0 border-white/10 rounded-l-xl text-sm text-slate-400 bg-white/5 font-semibold">+91</span>
                      <input type="tel" placeholder="98765 43210" className="flex-1 bg-white/5 border border-white/10 rounded-r-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Billing Details & Additional Info */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4"
              >
                <h2 className="font-extrabold text-white text-base mb-4">Billing & Additional Info</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Billing Address</label>
                    <textarea rows={2} placeholder="Enter your full address" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">State</label>
                    <input type="text" placeholder="Maharashtra" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">GST Number (Optional)</label>
                    <input type="text" placeholder="27XXXXX1234X1ZX" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Order Notes (Optional)</label>
                    <input type="text" placeholder="Any special requests or notes for us" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Coupon Code Section */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <h2 className="font-extrabold text-white text-base mb-4">Have a Coupon?</h2>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter coupon code" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white uppercase" />
                  <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors border border-white/10">Apply</button>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <h2 className="font-extrabold text-white text-base mb-4">Payment Method</h2>

                {/* Method Tabs */}
                <div className="flex gap-2 mb-5">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        paymentMethod === m.id
                          ? "bg-[#C9A227] text-[#0d1635] border-[#C9A227] shadow-lg shadow-[#C9A227]/20"
                          : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {m.image ? (
                        <img src={m.image} alt={m.label} className="h-5 object-contain" />
                      ) : (
                        <m.icon size={15} />
                      )}
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* UPI */}
                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => setSelectedUpi(app.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all relative overflow-hidden ${
                            selectedUpi === app.id
                              ? "border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]"
                              : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center p-1 font-bold text-xs">
                            <img src={app.icon} alt={app.name} className="w-full h-full object-contain"
                              onError={(e) => { 
                                (e.target as HTMLImageElement).style.display = "none";
                                const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "block";
                              }}
                            />
                            <span style={{ display: "none" }} className="text-[#C9A227]">{app.name.charAt(0)}</span>
                          </div>
                          {app.name}
                          {selectedUpi === app.id && (
                            <div className="absolute top-1 right-1 bg-[#C9A227] text-[#0d1635] rounded-full p-0.5">
                              <Check size={8} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Or enter UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Card */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-mono text-white tracking-widest" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cardholder Name</label>
                      <input type="text" placeholder="As on card" className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expiry</label>
                        <input type="text" placeholder="MM / YY" maxLength={7} className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-mono text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                          CVV <Info size={11} className="text-slate-500" />
                        </label>
                        <input type="password" placeholder="•••" maxLength={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-mono text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === "netbanking" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Bank</label>
                    <select className="w-full bg-[#0d1635] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium">
                      <option value="">Select your bank</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Punjab National Bank</option>
                      <option>Bank of Baroda</option>
                    </select>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                      <Info size={12} /> You will be redirected to your bank's secure page.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-28"
              >
                <h3 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wider">Order Summary</h3>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {cartItems.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium">No items in cart.</p>
                  ) : cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3 items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/10 border border-white/10 shrink-0 relative">
                        <CartItemImage thumbnail={item.thumbnail} title={item.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white leading-tight line-clamp-2 mb-1">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Instructor: {item.instructor || 'Expert'}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.duration || 'Flexible'} • Certificate</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-white">₹{item.price?.toLocaleString()}</div>
                        {item.original_price && item.original_price > item.price && (
                          <div className="text-[10px] text-slate-400 line-through">₹{item.original_price?.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs mb-4">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>Original Price</span><span className="font-semibold text-slate-400 line-through">₹{(subtotal + discount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Platform Discount</span><span>−₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>Subtotal</span><span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>GST (18%)</span><span className="font-semibold text-white">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-1 flex justify-between items-baseline">
                    <span className="font-extrabold text-white">Total</span>
                    <div className="text-right">
                      <div className="font-black text-xl text-[#C9A227]">₹{total.toLocaleString()}</div>
                      <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Total Savings: ₹{discount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <motion.button 
                  onClick={handlePay}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-[#0d1635] font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C9A227]/20 mb-4 uppercase tracking-wider"
                >
                  <Lock size={14} /> Pay ₹{total.toLocaleString()}
                </motion.button>

                {/* Trust badges */}
                <div className="flex flex-col gap-2 font-medium">
                  <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-400" /> 256-bit SSL Encrypted · Secured
                  </p>
                  <p className="text-[10px] text-slate-400 text-center">
                    30-Day Money-Back Guarantee
                  </p>
                </div>

                {/* Payment logos */}
                <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-white/10">
                  {["visa", "mastercard", "rupay", "upi"].map((brand) => (
                    <div key={brand} className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                      {brand}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Loader Modal Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 bg-[#0d1635]/80 backdrop-blur-md flex items-center justify-center z-[999]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#131d42] rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-white/10"
            >
              <div className="w-16 h-16 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-6 relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C9A227] relative z-10"
                />
                <Lock className="absolute text-[#C9A227]" size={16} />
              </div>

              <h3 className="font-extrabold text-white text-lg mb-2">Processing Payment</h3>
              <p className="text-slate-400 text-sm mb-6 font-medium">Please do not close this window or click back.</p>

              <div className="space-y-3.5 max-w-xs mx-auto text-left">
                {[
                  "Initializing secure connection...",
                  "Authorizing transaction with your bank...",
                  "Completing enrollment..."
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                      processingStep > idx 
                        ? "bg-emerald-500 text-white" 
                        : processingStep === idx 
                          ? "bg-[#C9A227] text-[#0d1635] animate-pulse" 
                          : "bg-white/10 text-slate-500"
                    }`}>
                      {processingStep > idx ? <Check size={10} /> : <span className="text-[9px]">{idx + 1}</span>}
                    </div>
                    <span className={`transition-colors duration-350 ${
                      processingStep > idx 
                        ? "text-slate-400 font-medium" 
                        : processingStep === idx 
                          ? "text-white font-bold" 
                          : "text-slate-500 font-medium"
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
