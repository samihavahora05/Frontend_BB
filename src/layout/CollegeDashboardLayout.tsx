import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { AuthGuard } from "../components/auth/AuthGuard";
import { SEO } from "../components/seo/SEO";
import { 
  LayoutDashboard, Users, Settings, LogOut,
  Menu, X, Bell, Search, GraduationCap,
  BookOpen, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import api from "../lib/axios";
import toast from "react-hot-toast";

const SIDEBAR_CATEGORIES = [
  {
    title: "Overview",
    links: [
      { name: "Dashboard", href: "/college/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Student Management",
    links: [
      { name: "Students", href: "/college/students", icon: Users },
    ]
  },
  {
    title: "Placements & Jobs",
    links: [
      { name: "Placement Drives", href: "/college/placement-drives", icon: GraduationCap },
      { name: "Internship Drives", href: "/college/internship-drives", icon: BookOpen },
    ]
  },
  {
    title: "Account",
    links: [
      { name: "Settings", href: "/college/settings", icon: Settings },
    ]
  }
];

export const CollegeDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, logout, isAuthenticated, isAuthReady } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const { data: notifData, mutate: mutateNotif } = useSWR(
    isAuthenticated ? '/college/notifications' : null,
    async (url) => (await api.get(url)).data,
    { refreshInterval: isAuthenticated ? 30000 : 0 }
  );

  const notifications = notifData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.read_at).length;

  const markAllRead = async () => {
    try {
      await api.put('/college/notifications/read-all');
      mutateNotif({ ...notifData, data: notifications.map((n: any) => ({ ...n, read_at: new Date().toISOString() })) }, false);
      toast.success('All notifications marked as read');
      mutateNotif();
    } catch (err) {}
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Role guard — ensure only colleges and admins access this
  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) return;
    if (user && user.role !== 'college' && user.role !== 'super_admin') {
      router.replace('/login'); 
    }
  }, [isAuthenticated, isAuthReady, user, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setIsSearchOpen(true); }
      if (e.key === "Escape") { setIsSearchOpen(false); setIsNotifOpen(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AuthGuard>
      <SEO title="College Dashboard | Blueboxx DA" description="College Dashboard" robots="noindex, nofollow" />
      <div className="min-h-screen bg-slate-50 flex">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar — BlueBoxx navy theme */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-[#0d1635] text-slate-300 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 border-r border-white/5 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-5 border-b border-white/10 justify-between lg:justify-start shrink-0">
            <Link href="/college/dashboard" className="flex items-center gap-3">
              <img src="/logowhite.png" alt="BlueBoxx DA" className="h-12 w-auto object-contain" />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white ml-auto">
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
            {SIDEBAR_CATEGORIES.map((category, idx) => (
              <div key={idx}>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-3">
                  {category.title}
                </p>
                <div className="space-y-0.5">
                  {category.links.map((link) => {
                    const isActive = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          isActive
                            ? "bg-[#C9A227] text-[#0d1635]"
                            : "text-slate-400 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        <link.icon size={16} className={isActive ? "text-[#0d1635]" : "text-slate-500"} />
                        {link.name}
                        {isActive && <ChevronRight size={13} className="ml-auto text-[#0d1635]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User + Logout */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#C9A227] flex items-center justify-center text-[#0d1635] font-black text-sm shadow-inner shrink-0">
                <GraduationCap size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-none mb-0.5 truncate">{user?.name || "College User"}</p>
                <p className="text-[10px] text-slate-400 font-semibold leading-none truncate">College Portal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-bold transition-all text-xs"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64 min-h-screen">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 bg-slate-50 p-2 rounded-lg">
                <Menu size={22} />
              </button>
              <div onClick={() => setIsSearchOpen(true)} className="hidden md:flex relative group cursor-pointer">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" readOnly
                  placeholder="Search students, courses..."
                  className="pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none w-72 font-medium text-slate-400 cursor-pointer hover:bg-slate-100 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1 py-0.5">⌘K</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2.5 text-slate-500 hover:text-[#1B2A6B] bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {isNotifOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                          <span className="text-xs font-black text-slate-700">Notifications</span>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-[10px] font-black text-[#1B2A6B] hover:underline">
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-xs">No notifications yet</div>
                          ) : (
                            notifications.map((notif: any) => (
                              <div key={notif.id} className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors ${!notif.read_at ? 'bg-blue-50/40' : ''}`}>
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read_at ? 'bg-[#1B2A6B]' : 'bg-slate-300'}`} />
                                <div>
                                  <p className={`text-xs font-semibold leading-snug ${!notif.read_at ? 'text-slate-800' : 'text-slate-500'}`}>{notif.data?.message || 'New notification'}</p>
                                  <p className="text-[10px] text-slate-400 font-medium mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        `}} />
      </div>
    </AuthGuard>
  );
};
