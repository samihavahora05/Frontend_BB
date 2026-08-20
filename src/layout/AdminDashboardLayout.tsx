import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { AuthGuard } from "../components/auth/AuthGuard";
import {
  LayoutDashboard, Users, BookOpen, Briefcase, Settings, LogOut,
  Menu, X, Bell, Search, ShieldCheck, GraduationCap,
  FileText, ChevronRight, ChevronDown,
  ShieldAlert, Award, Book,
  ClipboardList, BarChart3, HelpCircle,
  Layers, Globe, Mail,
  UserCheck,
  Building2, Play, Plus, Trash2, Upload, Video, MessageSquare,
  FolderOpen, Fingerprint,
  Hammer, Loader, MapPin, ShieldBan, RotateCcw, BarChart, Layout,
  Code, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationService } from "../lib/api/admin/RealtimeNotificationService";
import { PreloaderAnimation } from "../components/ui/PreloaderAnimation";
import { MessageService } from "../lib/api/admin/MessageService";
import { SEO } from "../components/seo/SEO";

import api from '../lib/axios';
import { useGlobalSettings } from "../contexts/SettingsContext";

const getSidebarCategories = () => {
  let crmLinks = [
    { name: "CRM Dashboard", href: "/admin/crm", icon: LayoutDashboard },
    { name: "All Leads", href: "/admin/crm/leads", icon: Users }
  ];

  return [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      isStandalone: true,
    },
    {
      title: "Media Manager",
      icon: FolderOpen,
      href: "/admin/media",
      isStandalone: true,
    },
    {
      title: "CRM",
      isHeader: true,
    },
    {
      title: "Leads & CRM",
      icon: Briefcase,
      links: crmLinks
    },
  {
    title: "USERS",
    isHeader: true,
  },

  {
    title: "All Internships",
    icon: ClipboardList,
    links: [
      { name: "List Internships", href: "/admin/internships", icon: ClipboardList },
      { name: "College Drives", href: "/admin/internship-drives", icon: BookOpen },
      { name: "Active Internships", href: "/admin/internships/active", icon: Briefcase },
      { name: "Add Internship", href: "/admin/internships/add", icon: Plus },
    ]
  },
  {
    title: "Students",
    icon: GraduationCap,
    links: [
      { name: "Student List", href: "/admin/users/students", icon: GraduationCap },
      { name: "Regular Student Import", href: "/admin/users/students/import", icon: Upload },
      { name: "Setting", href: "/admin/users/students/setting", icon: Settings },
    ]
  },
  {
    title: "All Jobs",
    icon: Briefcase,
    links: [
      { name: "List Jobs", href: "/admin/jobs", icon: Briefcase },
      { name: "College Drives", href: "/admin/placement-drives", icon: Users },
      { name: "All Applications", href: "/admin/jobs/applications", icon: ClipboardList },
    ]
  },

  {
    title: "Experts",
    icon: GraduationCap,
    links: [
      { name: "All Experts", href: "/admin/instructors", icon: Book },
      { name: "Mentor Bookings", href: "/admin/mentor-bookings", icon: Users },
    ]
  },
  {
    title: "User Manager",
    icon: ShieldCheck,
    links: [
      { name: "Roles", href: "/admin/roles", icon: ShieldCheck },

      { name: "Delete Request", href: "/admin/users/delete-requests", icon: Trash2 },
    ]
  },

  {
    title: "EDUCATION",
    isHeader: true,
  },
  {
    title: "Courses",
    icon: BookOpen,
    links: [
      { name: "Category List", href: "/admin/courses/categories", icon: Layers },
      { name: "All Courses", href: "/admin/courses", icon: BookOpen },
      { name: "Course Level", href: "/admin/courses/levels", icon: BarChart3 },
      { name: "Course Setting", href: "/admin/courses/settings", icon: Settings },
      { name: "Q&A", href: "/admin/courses/qa", icon: HelpCircle },
    ]
  },

  {
    title: "Virtual Class",
    icon: Play,
    links: [
      { name: "Virtual Class List", href: "/admin/education/virtual-class", icon: Play },
    ]
  },
  {
    title: "Contests",
    icon: Trophy,
    links: [
      { name: "All Contests", href: "/admin/contests", icon: Trophy },
      { name: "Add Contest", href: "/admin/contests/add", icon: Plus },
    ]
  },
  {
    title: "Zoom",
    icon: Video,
    links: [
      { name: "Setting", href: "/admin/education/zoom", icon: Settings },
    ]
  },
  {
    title: "Certificate",
    icon: Award,
    links: [
      { name: "Certificate List", href: "/admin/education/certificate", icon: Award },
      { name: "Add Certificate", href: "/admin/education/certificate/add", icon: Plus },
      { name: "Certificate Fonts", href: "/admin/education/certificate/fonts", icon: FileText },
      { name: "Certificate Setting", href: "/admin/education/certificate/setting", icon: Settings },
    ]
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    href: "/admin/reports",
    isStandalone: true,
  },
  {
    title: "MCQ Results",
    icon: BarChart,
    href: "/admin/mcq-results",
    isStandalone: true,
  },
  {
    title: "Enrollments",
    icon: UserCheck,
    href: "/admin/education/enrollments",
    isStandalone: true,
  },
  {
    title: "CONTENT",
    isHeader: true,
  },

  {
    title: "Blogs",
    icon: FileText,
    links: [
      { name: "All Blogs", href: "/admin/cms/blogs", icon: FileText },

      { name: "Categories", href: "/admin/cms/blogs/categories", icon: Layers },
    ]
  },
  {
    title: "Ecosystem CMS",
    icon: Building2,
    links: [
      { name: "Companies & Projects", href: "/admin/companies", icon: Building2 },
    ]
  },

  {
    title: "COMMUNICATION",
    isHeader: true,
  },
  {
    title: "Communication Center",
    icon: MessageSquare,
    href: "/admin/communication",
    isStandalone: true,
  },

  {
    title: "ADMINISTRATION",
    isHeader: true,
  },
  {
    title: "Support Tickets",
    icon: MessageSquare,
    href: "/admin/support",
    isStandalone: true,
  },
  {
    title: "System Setting",
    icon: Settings,
    links: [
      { name: "Activation", href: "/admin/settings/activation", icon: ShieldCheck },
      { name: "General Setting", href: "/admin/settings/general", icon: Settings },
      { name: "Email Setup", href: "/admin/settings/email-setup", icon: Mail },
      { name: "Email Template", href: "/admin/settings/email-template", icon: FileText },
      { name: "Api Settings", href: "/admin/settings/api", icon: Code },

    ]
  },






  {
    title: "SECURITY",
    isHeader: true,
  },
  {
    title: "Security & Logs",
    icon: ShieldCheck,
    links: [
      { name: "Security Settings", href: "/admin/security/settings", icon: ShieldAlert },
      { name: "Session Management", href: "/admin/security/sessions", icon: Fingerprint },
    ]
  },

  {
    title: "Backup",
    icon: RotateCcw,
    href: "/admin/security/backups",
    isStandalone: true,
  },

  {
    title: "UTILITY",
    isHeader: true,
  },
  {
    title: "Utility",
    icon: Hammer,
    links: [
      { name: "Utilities", href: "/admin/utility", icon: Settings },
      { name: "Preloader Setting", href: "/admin/utility/preloader", icon: Loader },
      { name: "Geo Location", href: "/admin/utility/geo-location", icon: MapPin },
      { name: "Ip Block", href: "/admin/utility/ip-block", icon: ShieldBan },
    ]
  },
];
};

export const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, logout, isAuthenticated, isAuthReady } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const { settings } = useGlobalSettings();
  const preloaderSettings = settings?.preloader || {};
  const isPreloaderEnabled = preloaderSettings?.isEnabled !== 'false';

  // Role guard — strict Role-Based Redirect: Kick non-admins out of the Admin panel
  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) return; 
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      if (user.role === 'intern') router.replace('/intern/dashboard');
      else if (user.role === 'company') router.replace('/company/dashboard');
      else if (user.role === 'expert') router.replace('/expert/dashboard');
      else if (user.role === 'college') router.replace('/college/dashboard');
      else if (user.role === 'job-seeker') router.replace('/jobseeker/dashboard');
      else if (user.role === 'student') router.replace('/student/dashboard');
      else router.replace('/login');
    }
  }, [isAuthenticated, isAuthReady, user, router]);

  // Real-Time Notifications & Badges
  const { notifications, unreadCount, markAllRead, markAsRead } = NotificationService.useNotifications(isAuthenticated);
  const { badges } = NotificationService.useBadges(isAuthenticated);
  
  // Real-Time Messages — only poll when authenticated
  const { data: messagesData } = MessageService.useUnreadSummary(isAuthenticated);
  const unreadMessagesCount = messagesData?.unread_count || 0;

  // Notification Bell Dropdown State
  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);





  // Derive user initials from name for avatar display
  const userInitials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'BB';

  // Collapse state initialized
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bb_sidebar_expanded");
      if (stored) return JSON.parse(stored);
    }
    return {
      "Media Manager": false,
      "Employees": false,
      "All Internships": false,
      "Students": false,
      "All Jobs": false,
      "All Contest": false,
      "Experts": false,
      "User Manager": false,
      "Internship": false,
      "Contest": false,
      "Courses": false,
      "Quiz": false,
      "Virtual Class": false,
      "Contests": false,
      "Zoom": false,
      "Certificate": false,
      "Report": false,
      "Enrollment": false,
      "Frontend CMS": false,
      "Blogs": false,
      "Gamification": false,
      "Communications": false,
      "Comments": false,
      "Q&A": false,
      "System Setting": false,
      "Appearance": false,
      "Newsletter": false,
      "Notification": false,
      "Push Notification": false,
      "Utility": false,
      "Backup": false,
    };
  });

  // Save expanded groups to session storage when it changes
  useEffect(() => {
    sessionStorage.setItem("bb_sidebar_expanded", JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  // Simple Inline Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Flatten links for search
  const dummyDataLinks = [
    { name: "John Doe (Student)", href: "/admin/users/students", category: "Students" },
    { name: "Jane Smith (Student)", href: "/admin/users/students", category: "Students" },
    { name: "Sr. Frontend Developer", href: "/admin/jobs", category: "Jobs" },
    { name: "Product Manager Role", href: "/admin/jobs", category: "Jobs" },
    { name: "Advanced React Patterns", href: "/admin/courses", category: "Courses" },
    { name: "UI/UX Masterclass", href: "/admin/courses", category: "Courses" },
    { name: "Hero Banner Video.mp4", href: "/admin/media?tab=all", category: "Media Manager" },
    { name: "Company Logo.png", href: "/admin/media?tab=all", category: "Media Manager" },
  ];
  
  const allLinks = React.useMemo(() => {
    const dynamicSidebar = getSidebarCategories();
    const links = dynamicSidebar.reduce((acc, cat) => {
      if (cat.href && cat.title) acc.push({ name: cat.title, href: cat.href, category: cat.title });
      if (cat.links) {
        cat.links.forEach(link => {
          acc.push({ name: link.name, href: link.href, category: cat.title });
        });
      }
      return acc;
    }, [] as { name: string, href: string, category: string }[]);
    return [...links, ...dummyDataLinks];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.crm_lead_categories]);

  const searchResults = searchQuery
    ? allLinks.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Quick Action Dropdown State
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Profile Dropdown State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch(e) {}
    logout();
    router.push("/login");
  };

  // Toggle Collapse/Expand on Sidebar Groups
  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => {
      const isCurrentlyOpen = prev[title];
      if (isCurrentlyOpen) {
        return { ...prev, [title]: false };
      } else {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => newState[key] = false);
        newState[title] = true;
        return newState;
      }
    });
  };

  // Keyboard shortcut for Search Command Palette
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        searchInputRef.current?.blur();
        setIsSearchFocused(false);
        setIsNotifOpen(false);
        setIsQuickActionOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-expand the active section group
  useEffect(() => {
    if (!router.isReady) return;
    const currentPath = router.asPath.split("?")[0];
    let activeCategory = "";

    const dynamicSidebar = getSidebarCategories();
    dynamicSidebar.forEach(category => {
      if (category.links) {
        const hasActive = category.links.some(link => {
          const linkPath = link.href.split("?")[0];
          return currentPath === linkPath || currentPath.startsWith(linkPath + "/");
        });
        if (hasActive) {
          activeCategory = category.title;
        }
      }
    });

    if (activeCategory) {
      setExpandedGroups(prev => {
        if (prev[activeCategory] && Object.keys(prev).filter(k => prev[k]).length === 1) return prev; // Already correct state
        const newState = { ...prev };
        Object.keys(newState).forEach(key => newState[key] = false);
        newState[activeCategory] = true;
        sessionStorage.setItem("bb_sidebar_expanded", JSON.stringify(newState));
        return newState;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, router.isReady]);

  // Handle Sidebar Scroll Position Restoration
  useEffect(() => {
    const sidebarEl = document.getElementById("admin-sidebar-scroll");
    if (sidebarEl) {
      const storedScroll = sessionStorage.getItem("bb_sidebar_scroll");
      if (storedScroll) {
        sidebarEl.scrollTop = parseInt(storedScroll, 10);
      }

      const handleScroll = () => {
        sessionStorage.setItem("bb_sidebar_scroll", sidebarEl.scrollTop.toString());
      };

      sidebarEl.addEventListener("scroll", handleScroll);
      return () => sidebarEl.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Generate dynamic breadcrumbs from asPath to handle dynamic routes correctly
  const currentUrlPath = router.isReady ? router.asPath.split("?")[0] : router.pathname;
  const pathSegments = currentUrlPath.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    let href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    // Ensure the root 'admin' breadcrumb always navigates to the dashboard
    if (index === 0 && segment.toLowerCase() === 'admin') {
      href = "/admin/dashboard";
    }

    return { label, href };
  });

  // Show full-screen loader while auth is resolving from /me endpoint
  if (!isAuthReady) {
    if (isPreloaderEnabled) {
      return (
        <PreloaderAnimation 
          selectedType={preloaderSettings?.selectedType || 'Blueboxx Logo Animation'}
          animationSpeed={preloaderSettings?.animationSpeed || 'Medium'}
          accentColor={preloaderSettings?.accentColor || '#1B2A6B'}
          bgColor={preloaderSettings?.bgColor || '#0d1635'} // Dark theme background for admin by default
          loadingText={preloaderSettings?.loadingText || 'LOADING ADMIN PANEL...'}
        />
      );
    }
    return (
      <div className="min-h-screen bg-[#0d1635] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#C9A227] rounded-full animate-spin" />
          <p className="text-white font-bold text-sm tracking-widest">LOADING ADMIN PANEL...</p>
        </div>
      </div>
    );
  }

  // If auth is ready but user is not an admin, render nothing (redirect is in-progress)
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    if (isPreloaderEnabled) {
      return (
        <PreloaderAnimation 
          selectedType={preloaderSettings?.selectedType || 'Blueboxx Logo Animation'}
          animationSpeed={preloaderSettings?.animationSpeed || 'Medium'}
          accentColor={preloaderSettings?.accentColor || '#1B2A6B'}
          bgColor={preloaderSettings?.bgColor || '#0d1635'} // Dark theme background for admin by default
          loadingText="Redirecting..."
        />
      );
    }
    return (
      <div className="min-h-screen bg-[#0d1635] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#C9A227] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <SEO title="Admin Dashboard | Blueboxx DA" description="Blueboxx DA Admin Dashboard" robots="noindex, nofollow" />
      <div className="min-h-screen bg-slate-50 flex">
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

      {/* Admin Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0d1635] text-slate-300 z-50 flex flex-col transform transition-transform duration-300 border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:${isDesktopSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div className="h-16 flex items-center px-5 border-b border-white/10 justify-between lg:justify-start shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <img src={settings.admin_dashboard_logo || settings.footer_logo || "/logowhite.png"} alt="BlueBoxx DA" className="h-10 w-auto object-contain" />
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div id="admin-sidebar-scroll" className="flex-1 overflow-y-auto py-3 px-3 space-y-1 admin-scrollbar pb-16">
          {getSidebarCategories().map((category, idx) => {
            if (category.isHeader) {
              return (
                <p key={idx} className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-3 pb-1 px-3">
                  {category.title}
                </p>
              );
            }

            if (category.isStandalone) {
              const categoryPath = (category.href || "").split("?")[0];
              const isActive = currentUrlPath === categoryPath;
              const Icon = category.icon;
              
              // Determine if this category needs a badge
              let badgeCount = 0;

              return (
                <Link
                  key={category.title}
                  href={category.href || "#"}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl font-bold text-[13.5px] transition-all ${isActive
                    ? "bg-[#C9A227] text-[#0d1635] shadow-md shadow-[#C9A227]/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className={isActive ? "text-[#0d1635]" : "text-slate-500"} />}
                    <span>{category.title}</span>
                  </div>
                  {badgeCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-[#0d1635] text-[#C9A227]' : 'bg-red-500 text-white'}`}>
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            }

            const isExpanded = !!expandedGroups[category.title];
            const hasActiveChild = category.links?.some(
              (link) => {
                const linkPath = link.href.split("?")[0];
                return currentUrlPath === linkPath || currentUrlPath.startsWith(`${linkPath}/`);
              }
            );
            const Icon = category.icon;

            return (
              <div key={category.title} className="rounded-xl overflow-hidden bg-white/0 transition-all">
                {/* Header Collapsible Trigger */}
                <button
                  onClick={() => toggleGroup(category.title)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-[13.5px] transition-all ${hasActiveChild ? "text-[#C9A227]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className={hasActiveChild ? "text-[#C9A227]" : "text-slate-500"} />}
                    <span>{category.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {badges[category.title] > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${hasActiveChild ? 'bg-[#0d1635] text-[#C9A227]' : 'bg-red-500 text-white'}`}>
                        {badges[category.title]}
                      </span>
                    )}
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && category.links && (
                  <div className="mt-0.5 pl-2.5 space-y-0.5">
                    {category.links.map((link, linkIndex) => {
                      const linkPath = link.href.split("?")[0].replace(/\/$/, "");
                      const normalizedCurrent = currentUrlPath.replace(/\/$/, "");
                      const hasQueryParams = link.href.includes("?");
                      let isActive = false;

                      if (hasQueryParams) {
                        // For links with query params, match the full asPath exactly
                        isActive = router.asPath === link.href;
                        // If current URL has no query params, highlight first tab
                        if (!isActive && router.asPath.split("?")[0].replace(/\/$/, "") === linkPath && linkIndex === 0) {
                          const anyExactMatch = category.links.some(l => l.href.includes("?") && router.asPath === l.href);
                          if (!anyExactMatch) isActive = true;
                        }
                      } else {
                        // Exact path match (with trailing slash normalization)
                        if (normalizedCurrent === linkPath) {
                          isActive = true;
                        } else if (normalizedCurrent.startsWith(linkPath + "/")) {
                          // Only active if no sibling link is a closer/exact match
                          const hasCloserMatch = category.links.some(l => {
                            const lp = l.href.split("?")[0].replace(/\/$/, "");
                            return lp !== linkPath && (normalizedCurrent === lp || normalizedCurrent.startsWith(lp + "/")) && lp.length > linkPath.length;
                          });
                          if (!hasCloserMatch) isActive = true;
                        }
                        // Special case: blog editor → highlight All Blogs
                        if (!isActive && linkPath === "/admin/cms/blogs" && normalizedCurrent.startsWith("/admin/cms/blog-editor")) {
                          isActive = true;
                        }
                      }

                      const SubIcon = link.icon;
                      
                      let badgeCount = 0;
                      // Match exactly by link.name vs Lead types
                      if (link.name !== 'CRM Overview') {
                        badgeCount = badges[link.name] || 0;
                      }

                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-lg font-semibold text-[13px] transition-all ${isActive
                            ? "bg-[#C9A227] text-[#0d1635] shadow-md shadow-[#C9A227]/20 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {SubIcon && <SubIcon size={15} className={isActive ? "text-[#0d1635]" : "text-slate-500"} />}
                            <span>{link.name}</span>
                          </div>
                          {badgeCount > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-[#0d1635] text-[#C9A227]' : 'bg-red-500 text-white'}`}>
                              {badgeCount}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>


      </motion.aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 min-h-screen ${isDesktopSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 bg-slate-50 p-2 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="hidden md:block relative z-50">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Global search (⌘ K)..."
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] w-96 font-medium text-slate-700 transition-all shadow-inner"
              />
              {!searchQuery && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-2 py-0.5">⌘ K</div>}
              
              {/* Inline Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                  >
                    {searchResults.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto py-2">
                        <p className="px-3 pb-2 pt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Results</p>
                        {searchResults.map((result, idx) => (
                          <Link
                            key={idx}
                            href={result.href}
                            className="flex flex-col px-4 py-2 hover:bg-[#C9A227]/10 transition-colors"
                          >
                            <span className="text-sm font-bold text-slate-700">{result.name}</span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">{result.category}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500 font-medium">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 relative">
            {/* Action Icons Row */}
            <Link href="/" target="_blank" className="w-11 h-11 rounded-full flex items-center justify-center text-slate-500 hover:text-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all" title="View Frontend">
              <Globe size={24} strokeWidth={1.5} />
            </Link>

            {/* Quick Actions */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                title="Quick Actions"
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isQuickActionOpen ? 'bg-[#1B2A6B]/10 text-[#1B2A6B]' : 'text-slate-500 hover:text-[#1B2A6B] hover:bg-[#1B2A6B]/5'}`}
              >
                <Plus size={24} strokeWidth={1.5} />
              </button>
              
              <AnimatePresence>
                {isQuickActionOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsQuickActionOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 py-2 text-left"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quick Actions</span>
                      </div>
                      <Link href="/admin/courses/add" className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <BookOpen size={16} className="text-[#C9A227]"/> Create Course
                      </Link>
                      <Link href="/admin/jobs" className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Briefcase size={16} className="text-[#C9A227]"/> Post a Job
                      </Link>
                      <Link href="/admin/media?tab=upload" className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Upload size={16} className="text-[#C9A227]"/> Upload Media
                      </Link>
                      <Link href="/admin/internships/add" className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <ClipboardList size={16} className="text-[#C9A227]"/> New Internship
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)} className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-slate-500 hover:text-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all" title="Toggle Sidebar">
              <Layout size={22} strokeWidth={1.5} />
            </button>

            {/* Notification Area */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Notifications"
                className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all ${isNotifOpen ? 'bg-[#1B2A6B]/10 text-[#1B2A6B]' : 'text-slate-500 hover:text-[#1B2A6B] hover:bg-[#1B2A6B]/5'}`}
              >
                <Bell size={24} strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 py-2 overflow-hidden text-left"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="text-xs font-black text-rose-600 flex items-center gap-1.5"><ShieldAlert size={14} /> System Logs & Alerts</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[10px] font-black text-[#1B2A6B] hover:underline">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-500 flex flex-col items-center">
                             <Bell size={24} className="opacity-20 mb-2" />
                             <p className="text-xs font-bold">No notifications</p>
                          </div>
                        ) : notifications.map((notif: any) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.data?.action_url) router.push(notif.data.action_url);
                              setIsNotifOpen(false);
                            }}
                            className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex gap-3 border-b border-slate-50 last:border-0 ${!notif.read_at ? 'bg-rose-50/50' : ''}`}
                          >
                            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${!notif.read_at ? 'bg-rose-500' : 'bg-slate-300'}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-[14px] font-semibold leading-normal ${!notif.read_at ? 'text-rose-700' : 'text-slate-600'}`}>{notif.data?.title || "Notification"}</p>
                              <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{notif.data?.message}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{new Date(notif.created_at).toLocaleString()}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Messages Area */}
            <div className="relative">
              <Link href="/admin/communication" title="Messages" className="relative w-11 h-11 rounded-full flex items-center justify-center text-slate-500 hover:text-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all">
                <MessageSquare size={24} strokeWidth={1.5} />
                <span className={`absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm leading-none ${unreadMessagesCount > 0 ? 'bg-[#C9A227]' : 'hidden'}`}>
                  {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                </span>
              </Link>
            </div>

            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>

            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                title="Admin Profile"
                className={`w-11 h-11 rounded-full overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/30 ${isProfileOpen ? 'ring-2 ring-[#1B2A6B]/30' : 'ring-2 ring-transparent hover:ring-[#1B2A6B]/20'}`}
              >
                {user?.avatar && !user.avatar.includes('dicebear') ? (
                  <img src={user.avatar} alt="Admin" className="w-full h-full object-cover bg-slate-100" />
                ) : (
                  <div className="w-full h-full bg-[#C9A227] text-[#0d1635] flex items-center justify-center font-black uppercase shadow-inner text-[15px] tracking-widest">
                    {userInitials}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 py-2 text-left"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user?.name ?? 'Admin'}</p>
                        <p className="text-[10px] font-semibold text-slate-400">{user?.email}</p>
                      </div>
                      <button onClick={() => { router.push('/admin/settings'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Settings size={14} /> System Settings
                      </button>
                      <button onClick={() => { router.push('/admin/roles'); setIsProfileOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <ShieldCheck size={14} /> Access Controls
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2">
                        <LogOut size={14} /> Log Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Breadcrumbs Area */}
        {breadcrumbs.length > 0 && (
          <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-2 text-xs font-bold text-slate-400 shrink-0">
            {breadcrumbs.map((breadcrumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={12} className="text-slate-300" />}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-slate-600 font-extrabold">{breadcrumb.label}</span>
                ) : (
                  <Link href={breadcrumb.href} className="hover:text-[#1B2A6B] transition-colors">{breadcrumb.label}</Link>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          {children}
        </main>
      </div>

      {/* Removed the large search modal */}

      {/* Custom Scrollbar Styles for Sidebar */}
      <style dangerouslySetInnerHTML={{
        __html: ".admin-scrollbar::-webkit-scrollbar { width: 6px; } .admin-scrollbar::-webkit-scrollbar-track { background: transparent; } .admin-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; } .admin-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }"
      }} />

      </div>
    </AuthGuard>
  );
};
