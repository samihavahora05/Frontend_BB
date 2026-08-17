import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { AuthGuard } from "../components/auth/AuthGuard";
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationPopover } from "../components/ui/NotificationPopover";

const SIDEBAR_LINKS = [
  { name: "Dashboard", href: "/colleges/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/colleges/students", icon: Users },
  { name: "Placements", href: "/colleges/placements", icon: BookOpen },
  { name: "Settings", href: "/colleges/settings", icon: Settings },
];

export const CollegesDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`fixed inset-y-0 left-0 w-64 bg-[#0d1635] text-white border-r border-white/10 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between lg:justify-start">
            <Link href="/">
              <img src="/logowhite.png" alt="BlueBoxx" className="h-12 object-contain" />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <nav className="space-y-2">
              {SIDEBAR_LINKS.map((link) => {
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
              <div className="w-10 h-10 rounded-full bg-[#1B2A6B] flex items-center justify-center text-white font-bold border-2 border-white/20">
                C
              </div>
              <div>
                <p className="text-sm font-bold text-white">NIT Admin</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">College Portal</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full text-sm font-bold">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900">
                <Menu size={24} />
              </button>
              <div className="hidden md:flex relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 w-64 transition-shadow"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <NotificationPopover />
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};
