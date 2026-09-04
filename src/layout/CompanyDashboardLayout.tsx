import { getImageUrl } from "../lib/imageUtils";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { AuthGuard } from "../components/auth/AuthGuard";
import { SEO } from "../components/seo/SEO";
import { 
  LayoutDashboard, Briefcase, Settings, LogOut,
  Menu, X, Search, Building, Users, Clock,
  MessageSquare, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanyStore } from "../store/useCompanyStore";
import { NotificationDropdown } from "../components/NotificationDropdown";

const SIDEBAR_CATEGORIES = [
  {
    title: "Overview",
    links: [
      { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Recruitment",
    links: [
      { name: "My Jobs", href: "/company/jobs", icon: Briefcase },
      { name: "Applicants", href: "/company/applicants", icon: Users },
      { name: "Interviews", href: "/company/interviews", icon: Clock },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "Company Profile", href: "/company/profile", icon: Building },
    ]
  },
  {
    title: "Account",
    links: [
      { name: "Settings", href: "/company/settings", icon: Settings },
      { name: "Support", href: "/company/support", icon: MessageSquare },
    ]
  }
];

export const CompanyDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const profile = useCompanyStore(s => s.profile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AuthGuard allowedRoles={['company']}>
      <SEO title="Company Dashboard | Blueboxx DA" description="Company Dashboard" robots="noindex, nofollow" />
      <div className="min-h-screen bg-[#f8fafc] flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Company Sidebar */}
        <motion.aside
          className={`fixed inset-y-0 left-0 w-72 bg-[#0d1635] text-slate-300 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between lg:justify-start">
            <Link href="/company/dashboard" className="flex items-center gap-3">
              <img src="/logowhite.png" alt="BlueBoxx DA" className="h-12 w-auto object-contain" />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 admin-scrollbar pb-24">
            {SIDEBAR_CATEGORIES.map((category, idx) => (
              <div key={idx}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-3">
                  {category.title}
                </p>
                <div className="space-y-1">
                  {category.links.map((link) => {
                    const isActive = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          isActive 
                            ? "bg-[#C9A227] text-[#0d1635] shadow-lg shadow-[#C9A227]/20" 
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <link.icon size={18} className={isActive ? "text-[#0d1635]" : "text-slate-500"} />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 bg-[#0d1635] shrink-0">
            <Link href="/company/profile" className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0d1635] font-black shadow-inner overflow-hidden border-2 border-transparent group-hover:border-[#C9A227] transition-all shrink-0">
                {profile.logo ? (
                  <img src={getImageUrl(profile.logo)} className="w-full h-full object-cover" alt="Company Logo" />
                ) : (
                  <Building size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-none mb-1 truncate group-hover:text-[#C9A227] transition-colors">{profile.name || "Company"}</p>
                <p className="text-[10px] text-slate-400 font-semibold leading-none truncate">HR Team</p>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-bold transition-all text-xs"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72 min-h-screen">
          {/* Top Navbar */}
          <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 bg-slate-50 p-2 rounded-lg">
                <Menu size={24} />
              </button>
              <div 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex relative group cursor-pointer"
              >
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  readOnly
                  placeholder="Search candidates, roles..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none w-96 font-medium text-slate-400 cursor-pointer hover:bg-slate-100/50 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">⌘ K</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/company/jobs/new" className="hidden sm:flex items-center gap-2 bg-[#1B2A6B] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0d1635] transition-colors">
                <Plus size={16} /> Post Job
              </Link>

              {/* Notification Area */}
              <NotificationDropdown />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-slate-50/50">
            {children}
          </main>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .admin-scrollbar::-webkit-scrollbar { width: 6px; }
          .admin-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .admin-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          .admin-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        `}} />
      </div>
    </AuthGuard>
  );
};
