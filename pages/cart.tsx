import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "../src/layout/MainLayout";
import { ArrowRight, Trash2, ShieldCheck, Tag, ShoppingCart, Package, BookOpen, Lock } from "lucide-react";
import { useStore } from "../src/store/useStore";
import { useAuth } from "../src/context/AuthContext";
import { SEO } from "../src/components/seo/SEO";

const CartItemImage = ({ thumbnail, title }: { thumbnail: string; title: string }) => {
  const [error, setError] = useState(false);
  if (!thumbnail || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1B2A6B]/10 to-[#C9A227]/10 flex items-center justify-center">
        <BookOpen size={20} className="text-[#1B2A6B]" />
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

export default function CartPage() {
  const { cart: cartItems, removeFromCart } = useStore();
  const { isAuthenticated } = useAuth();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = Math.round(subtotal * 0.18);
  const discount = subtotal > 0 ? Math.min(5000, Math.round(subtotal * 0.1)) : 0;
  const total = subtotal + tax - discount;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <MainLayout>
      <SEO title="Your Cart | Blueboxx DA" description="Review your selected courses and programs before checkout." robots="noindex, nofollow" />
      <div className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-[#0d1635] text-white">

        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635] to-transparent pointer-events-none"></div>

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

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ShoppingCart size={20} className="text-[#C9A227]" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Your Cart</h1>
            <span className="ml-1 text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/20 px-2.5 py-0.5 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          </motion.div>

          {!isAuthenticated ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-16 text-center shadow-2xl"
            >
              <Lock size={48} className="mx-auto text-[#C9A227] mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Log in to view your cart</h2>
              <p className="text-slate-400 text-sm mb-6 font-medium">Please sign in to your account to add items and manage your cart.</p>
              <Link href="/login?redirect=/cart" className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0d1635] font-black px-6 py-3 rounded-xl text-sm hover:bg-[#b08d20] transition-colors shadow-lg shadow-[#C9A227]/20 uppercase tracking-wider">
                Log In Now <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : cartItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-16 text-center shadow-2xl"
            >
              <Package size={48} className="mx-auto text-slate-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-slate-400 text-sm mb-6 font-medium">Browse our programs and start learning today.</p>
              <Link href="/courses" className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0d1635] font-black px-6 py-3 rounded-xl text-sm hover:bg-[#b08d20] transition-colors shadow-lg shadow-[#C9A227]/20 uppercase tracking-wider">
                Explore Courses <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 space-y-4"
              >
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-4 items-start shadow-xl hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10 relative z-10">
                      <CartItemImage thumbnail={item.thumbnail} title={item.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/courses/${item.id}`}>
                        <h3 className="font-bold text-white group-hover:text-[#C9A227] transition-colors text-sm sm:text-base leading-snug mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-400 font-semibold mb-2">BlueBoxx Premium · Lifetime Access</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">Lifetime Access</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <div className="font-black text-white text-base">₹{item.price.toLocaleString()}</div>
                      <div className="text-xs text-slate-500 line-through">₹{Math.round(item.price * 1.6).toLocaleString()}</div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 mt-1"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="w-full lg:w-80 shrink-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-28"
                >
                  <h3 className="font-extrabold text-white text-base mb-5">Order Summary</h3>

                  <div className="space-y-3.5 text-sm mb-5">
                    <div className="flex justify-between text-slate-300 font-medium">
                      <span>Subtotal</span>
                      <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 font-medium">
                      <span>GST (18%)</span>
                      <span className="font-semibold text-white">₹{tax.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Discount</span>
                        <span>−₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3.5 flex justify-between items-baseline">
                      <span className="font-extrabold text-white">Total</span>
                      <span className="font-black text-2xl text-[#C9A227]">₹{total.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 text-right font-medium">Inclusive of all taxes</p>
                  </div>

                  <div className="relative mb-5">
                    <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-20 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 focus:border-[#C9A227]/50 transition-all font-medium text-white"
                    />
                    <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/5">
                      Apply
                    </button>
                  </div>

                  <Link href="/checkout" className="block w-full mb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#C9A227] hover:bg-[#b08d20] text-[#0d1635] font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C9A227]/20 uppercase tracking-wider"
                    >
                      Proceed to Checkout <ArrowRight size={16} />
                    </motion.button>
                  </Link>

                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    30-Day Money-Back Guarantee
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
