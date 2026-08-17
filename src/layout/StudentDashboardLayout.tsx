import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { AuthGuard } from "../components/auth/AuthGuard";
import { SEO } from "../components/seo/SEO";

import {
  LayoutDashboard, BookOpen, Briefcase, Settings, LogOut,
  Menu, X, Search, Video, Award, User,
  ClipboardList, Trophy, Users, Bookmark, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationDropdown } from "../components/NotificationDropdown";

const SIDEBAR_CATEGORIES = [
  {
    title: "Learning",
    links: [
      { name: "My Dashboard",   href: "/student/dashboard",       icon: LayoutDashboard },
      { name: "My Courses",     href: "/student/courses",         icon: BookOpen },
      { name: "Contests",       href: "/student/contests",        icon: Trophy },
      { name: "Virtual Classes",href: "/student/virtual-classes", icon: Video },
      { name: "MCQ Results",    href: "/student/mcq-results",     icon: Award },
    ],
  },
  {
    title: "Career",
    links: [
      { name: "Jobs",           href: "/student/jobs",            icon: Briefcase },
      { name: "Internships",    href: "/student/internships",     icon: Briefcase },
      { name: "Applications",   href: "/student/applications",    icon: ClipboardList },
      { name: "Scholarships",   href: "/student/scholarships",    icon: Trophy },
      { name: "Expert Sessions",href: "/student/mentor-sessions",  icon: Users },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Settings",       href: "/student/settings",        icon: Settings },
      { name: "Profile",        href: "/student/dashboard/profile", icon: User },
      { name: "Referral & Earn",href: "/student/referrals",       icon: Users },
      { name: "Saved Items",    href: "/student/wishlist",        icon: Bookmark },
      { name: "Payments",       href: "/student/payments",        icon: CreditCard },
    ],
  },
];

export const StudentDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setIsSearchOpen(true); }
      if (e.key === "Escape") { setIsSearchOpen(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router.pathname]);

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase() ?? "S";

  return (
    <AuthGuard>
      <SEO title="Student Dashboard | Blueboxx DA" description="Student Dashboard" robots="noindex, nofollow" />
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

        {/* ── Sidebar ── */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-[#0d1635] text-slate-300 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 border-r border-white/5 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between lg:justify-start shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logowhite.png" alt="BlueBoxx DA" className="h-12 w-auto object-contain" />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 pb-24" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
            {SIDEBAR_CATEGORIES.map((category, idx) => {
              const filteredLinks = category.links.filter((link: any) => !link.hideFor?.includes(user?.role));
              if (filteredLinks.length === 0) return null;
              
              return (
              <div key={idx}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-3">
                  {category.title}
                </p>
                <div className="space-y-0.5">
                  {filteredLinks.map((link: any) => {
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
                        <link.icon size={17} className={isActive ? "text-[#0d1635]" : "text-slate-500"} />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              );
            })}
          </div>

          {/* User footer */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-full bg-[#C9A227] flex items-center justify-center text-[#0d1635] font-black text-sm shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-none mb-1 truncate">{user?.name ?? "Student"}</p>
                <p className="text-[10px] text-slate-400 font-semibold leading-none truncate">{user?.email ?? "student@blueboxx.in"}</p>
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

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72 min-h-screen">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 shadow-sm shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 bg-slate-50 p-2 rounded-lg">
                <Menu size={22} />
              </button>
              <div onClick={() => setIsSearchOpen(true)} className="hidden md:flex relative cursor-pointer">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" readOnly
                  placeholder="Search courses, jobs..."
                  className="pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-80 font-medium text-slate-400 cursor-pointer hover:bg-slate-100/50 transition-all focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">⌘K</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Bell / Notifications */}
              <NotificationDropdown />

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#1B2A6B] flex items-center justify-center text-white font-black text-xs">
                {initials}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-slate-50/50 relative">
            {children}
          </main>
        </div>

        {/* Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setIsSearchOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl z-50 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    autoFocus
                    placeholder="Search courses, internships, certificates..."
                    className="flex-1 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-4 text-xs font-bold text-slate-400 text-center py-8">
                  Start typing to search across all your courses, assignments, and more...
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
};
