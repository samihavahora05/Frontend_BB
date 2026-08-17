import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { AuthGuard } from "../components/auth/AuthGuard";
import { SEO } from "../components/seo/SEO";
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Search,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationPopover } from "../components/ui/NotificationPopover";

const sidebarLinks = [
  { name: "Overview", href: "/expert/dashboard", icon: LayoutDashboard },
  { name: "My Schedule", href: "/expert/schedule", icon: Calendar },
  { name: "Meetings", href: "/expert/mentees", icon: Users },
  { name: "Earnings", href: "/expert/earnings", icon: DollarSign },
  { name: "Settings", href: "/expert/settings", icon: Settings },
];

export const ExpertDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();


  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <SEO title="Expert Dashboard | Blueboxx DA" description="Expert Dashboard" robots="noindex, nofollow" />
      <div className="min-h-screen bg-slate-50 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#0d1635] text-white fixed h-full z-20">
          <div className="h-20 flex items-center px-6 border-b border-white/10">
            <Link href="/">
              <img src="/logowhite.png" alt="BlueBoxx" className="h-12 object-contain" />
            </Link>
          </div>

          <div className="p-6">
            <nav className="space-y-2">
              {sidebarLinks.map((link) => {
                const isActive = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                      isActive 
                        ? "bg-[#C9A227] text-[#0d1635]" 
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <link.icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-[#0d1635] font-black text-sm">
                {user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) ?? 'EX'}
              </div>
              <div>
                <p className="text-sm font-bold">{user?.name ?? 'Expert Mentor'}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Expert Mentor</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full text-sm font-bold">
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </aside>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 left-0 h-full w-[280px] bg-[#0d1635] text-white z-40 flex flex-col shadow-2xl"
              >
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                  <img src="/logowhite.png" alt="BlueBoxx" className="h-12 w-auto object-contain" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-300">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <nav className="space-y-2">
                    {sidebarLinks.map((link) => {
                      const isActive = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                            isActive ? "bg-[#C9A227] text-[#0d1635]" : "text-slate-300"
                          }`}
                        >
                          <link.icon size={18} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 -ml-2 text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-80">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Search sessions, meetings..." className="bg-transparent border-none outline-none text-sm w-full" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationPopover />
              <Link href="/expert/settings" className="lg:hidden w-10 h-10 rounded-full border-2 border-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=ankit" alt="User" />
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};
