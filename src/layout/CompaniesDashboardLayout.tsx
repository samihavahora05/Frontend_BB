import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { AuthGuard } from "../components/auth/AuthGuard";
import { SEO } from "../components/seo/SEO";
import { 
  Building2, 
  Briefcase, 
  Users, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationDropdown } from "../components/NotificationDropdown";

const SIDEBAR_LINKS = [
  { name: "Dashboard", href: "/companies/dashboard", icon: BarChart },
  { name: "Job Postings", href: "/companies/jobs", icon: Briefcase },
  { name: "Applicants", href: "/companies/applicants", icon: Users },
  { name: "Company Profile", href: "/companies/profile", icon: Building2 },
  { name: "Settings", href: "/companies/settings", icon: Settings },
];

export const CompaniesDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <SEO title="Companies Dashboard | Blueboxx DA" description="Companies Dashboard" robots="noindex, nofollow" />
      <div className="min-h-screen bg-[#F8FAFC] flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`fixed inset-y-0 left-0 w-64 bg-[#0d1635] text-white border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between lg:justify-start">
            <Link href="/">
              <img src="/logowhite.png" alt="BlueBoxx" className="h-12 w-auto object-contain" />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>



          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</p>
            {SIDEBAR_LINKS.map((link) => {
              const isActive = router.pathname.startsWith(link.href);
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
          </div>

          <div className="p-6 mt-auto">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Company Logo" className="w-10 h-10 object-contain bg-white rounded-full border-2 border-white/20 p-1.5" />
              <div>
                <p className="text-sm font-bold text-white">Google India</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Enterprise Plan</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl font-bold transition-all text-sm">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900">
                <Menu size={24} />
              </button>
              <div className="hidden md:flex relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search candidates or jobs..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 transition-shadow"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <NotificationDropdown />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};
