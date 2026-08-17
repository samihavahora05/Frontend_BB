import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { MainLayout } from "./MainLayout";
import { 
  LayoutDashboard, Briefcase, Users, FileText, Settings, LogOut, ChevronRight, Building2, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const sidebarLinks = [
  { group: "Recruitment", items: [
    { name: "Dashboard", href: "/companies", icon: LayoutDashboard },
    { name: "Active Jobs", href: "/companies/jobs", icon: Briefcase },
    { name: "Post a Job", href: "/companies/post-job", icon: FileText },
  ]},
  { group: "Candidates", items: [
    { name: "Applications", href: "/companies/applications", icon: Users },
    { name: "Interviews", href: "/companies/interviews", icon: Calendar },
    { name: "Talent Pool", href: "/companies/talent", icon: TrendingUp },
  ]},
  { group: "Company", items: [
    { name: "Company Profile", href: "/companies/profile", icon: Building2 },
    { name: "Settings", href: "/companies/settings", icon: Settings },
  ]}
];

// Reusing calendar icon import
import { Calendar } from "lucide-react";

export const CompaniesLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-transparent pt-[72px] md:pt-[80px]">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(27,42,107,0.04)] overflow-hidden sticky top-28">
                {/* User Profile Summary */}
                <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-[#0d1635] text-white">
                  <div className="relative">
                    <img src="https://ui-avatars.com/api/?name=TechCorp&background=C9A227&color=fff" alt="Logo" className="w-12 h-12 rounded-xl border-2 border-[#C9A227] shadow-md object-cover bg-white" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-sm leading-tight">TechCorp Inc.</div>
                    <div className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider mt-0.5">Hiring Partner</div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                  {sidebarLinks.map((group, gIdx) => (
                    <div key={gIdx} className="p-4 border-b border-slate-50 last:border-0">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 px-2">
                        {group.group}
                      </div>
                      <nav className="space-y-1">
                        {group.items.map((link) => {
                          const isActive = router.pathname === link.href;
                          return (
                            <Link
                              key={link.name}
                              href={link.href}
                              className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all group relative overflow-hidden",
                                isActive 
                                  ? "text-[#1B2A6B] bg-blue-50/50" 
                                  : "text-slate-500 hover:bg-slate-50 hover:text-[#1B2A6B]"
                              )}
                            >
                              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B2A6B] rounded-r-md"></div>}
                              <div className="flex items-center gap-3">
                                <link.icon size={16} className={cn("transition-colors relative z-10", isActive ? "text-[#1B2A6B]" : "text-slate-400 group-hover:text-[#1B2A6B]")} />
                                <span className="relative z-10">{link.name}</span>
                              </div>
                              {isActive && <ChevronRight size={14} className="text-[#1B2A6B] relative z-10" />}
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm border border-transparent hover:border-red-100"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {children}
              </motion.div>
            </main>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};
