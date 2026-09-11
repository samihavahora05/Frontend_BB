"use client";
import { getImageUrl } from "../lib/imageUtils";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../store/useStore';
import { useGlobalSettings } from '../contexts/SettingsContext';

import { ShoppingCart, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const cartItemCount = useStore((state) => state.cart.length);
  const { settings } = useGlobalSettings();

  // Monitor scrolling to apply premium visual effects to Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle scrolling lock when menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  type MenuItem = {
    label: string;
    href: string;
    dropdown?: { label: string; href: string }[];
  };

  const menuItems: MenuItem[] = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Courses', href: '/courses' },
    { label: 'Internships', href: '/internships' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Experts', href: '/experts' },
    { label: 'Blogs', href: '/blog' },
    {
      label: 'Our Partners',
      href: '/companies',
      dropdown: [
        { label: 'Companies', href: '/companies' },
        { label: 'Placement Partners', href: '/placement-partners' },
        { label: 'Colleges', href: '/colleges' }
      ]
    },
    { label: 'Contact', href: '/contact' },
  ];

  // Dashboard link based on role
  const getDashboardLink = () => {
    if (!user || !user.role) return '/student/dashboard';
    const role = user.role.toLowerCase();
    switch (role) {
      case 'super_admin':
      case 'admin': return '/admin/dashboard';
      case 'company': return '/companies/dashboard';
      case 'expert':
      case 'mentor': return '/expert/dashboard';
      case 'intern': return '/intern/dashboard';
      case 'job-seeker': return '/jobseeker/dashboard';
      default: return '/student/dashboard';
    }
  };

  return (
    <>
      {/* Sticky Header with responsive background blur */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled
          ? 'backdrop-blur-2xl bg-white/85 shadow-[0_4px_25px_rgba(13,22,53,0.06)] border-b border-slate-200/60'
          : 'backdrop-blur-xl bg-white/60 border-b border-slate-200/40'
          }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 h-[68px] md:h-[74px] flex items-center justify-between">

          {/* Left Side: Only Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src={getImageUrl(settings.main_logo || "/logoblue.png")}
              alt={settings.website_name || "BlueBoxx"}
              onError={(e: any) => {
                if (!e.currentTarget.dataset.fallbackApplied) {
                  e.currentTarget.dataset.fallbackApplied = "true";
                  e.currentTarget.src = "/logoblue.png";
                }
              }}
              className="h-[44px] md:h-[50px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-xs"
            />
          </Link>

          {/* Right Side: All Tabs, Cart, Divider & User Profile grouped together */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 xl:gap-4">

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
              {menuItems.map((m) => (
                <div key={m.label} className="relative group">
                  <Link
                    href={m.href}
                    className="relative flex items-center gap-1 px-2.5 py-1.5 2xl:px-3 text-[13.5px] 2xl:text-[14px] font-semibold text-slate-700 hover:text-[#1B2A6B] transition-colors rounded-lg hover:bg-slate-50/80 whitespace-nowrap"
                  >
                    <span>{m.label}</span>
                    {m.dropdown && (
                      <svg
                        className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1B2A6B] transition-transform duration-300 group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {/* Subtle hover bottom accent */}
                    <span className="absolute left-2.5 right-2.5 bottom-0 h-[2px] bg-[#C9A227] scale-x-0 origin-center transform transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
                  </Link>

                  {/* Dropdown Menu */}
                  {m.dropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                      <div className="w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_36px_rgba(27,42,107,0.12)] border border-slate-100 py-2 overflow-hidden">
                        {m.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-amber-50/50 hover:text-[#1B2A6B] transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Cart Icon */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative p-2 text-slate-700 hover:text-[#1B2A6B] hover:bg-slate-100/60 rounded-full transition-all duration-200 ml-1"
            >
              <ShoppingCart size={20} className="stroke-[2.2]" />
              {cartItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Clean Vertical Divider */}
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200/80 mx-0.5" />

            {/* User Profile or CTA */}
            {isAuthenticated ? (
              <div className="relative group/profile">
                <Link href={getDashboardLink()} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="text-right hidden xl:block pl-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5 max-w-[120px] truncate">{user?.name}</p>
                    <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider leading-tight">{user?.role || 'Student'}</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1B2A6B&color=fff`}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full border-2 border-slate-200/80 shadow-2xs object-cover group-hover/profile:border-[#C9A227] transition-all"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                </Link>

                {/* Dropdown for Profile */}
                <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-1 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-200 z-50">
                  <div className="w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_36px_rgba(27,42,107,0.12)] border border-slate-100 py-2 overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1B2A6B] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <div className="h-px bg-slate-100 my-1 w-full" />
                    <button
                      onClick={logout}
                      className="px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left w-full cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/signup/student"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#1B2A6B] text-white hover:bg-[#C9A227] hover:text-[#0d1635] shadow-[0_4px_14px_rgba(27,42,107,0.2)] transition-all duration-300"
              >
                <span>Get Started</span>
              </Link>
            )}

            {/* Mobile / Tablet Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 p-2 text-slate-700 hover:text-[#1B2A6B] rounded-lg hover:bg-slate-100/60 transition-colors duration-200 xl:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 relative flex items-center justify-center">
                <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 transform ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 transform ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Fullscreen Overlay Menu (mobile & tablet) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav-modal"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto overscroll-contain"
          >
            {/* Header Area */}
            <div className="flex items-center justify-between px-5 sm:px-8 h-[68px] md:h-[74px] border-b border-slate-100 shrink-0 bg-white">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <img 
                  src={getImageUrl(settings.main_logo || "/logoblue.png")} 
                  alt={settings.website_name || "BlueBoxx"} 
                  onError={(e: any) => {
                    if (!e.currentTarget.dataset.fallbackApplied) {
                      e.currentTarget.dataset.fallbackApplied = "true";
                      e.currentTarget.src = "/logoblue.png";
                    }
                  }}
                  className="h-[42px] md:h-[48px] w-auto object-contain" 
                />
              </Link>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2.5 text-slate-700 hover:text-[#1B2A6B] rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors cursor-pointer" 
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.4" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Centered Menu Links */}
            <nav className="flex flex-col items-center justify-center gap-3.5 sm:gap-4 py-8 px-5 w-full max-w-md mx-auto my-auto shrink-0">
              {menuItems.map((item) => (
                <div key={item.label} className="text-center w-full">
                  {item.dropdown ? (
                    <div className="flex flex-col items-center w-full">
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="group relative text-2xl sm:text-3xl font-extrabold transition-all duration-200 py-1 tracking-tight inline-flex items-center justify-center gap-2 cursor-pointer text-slate-900 hover:text-[#1B2A6B]"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={22}
                          className={`text-[#C9A227] transition-transform duration-300 ${
                            mobileExpanded === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileExpanded === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden flex flex-col items-center gap-1.5 mt-2.5 w-full max-w-xs bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 shadow-xs"
                          >
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => {
                                  setIsOpen(false);
                                  setMobileExpanded(null);
                                }}
                                className="w-full text-center py-2.5 px-3 text-sm font-bold text-slate-700 hover:text-[#1B2A6B] hover:bg-white rounded-xl transition-all"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => {
                        setIsOpen(false);
                        setMobileExpanded(null);
                      }}
                      className="group relative text-2xl sm:text-3xl font-extrabold transition-all duration-200 py-1 tracking-tight inline-block text-slate-900 hover:text-[#1B2A6B]"
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center border-t border-slate-100 p-5 sm:p-7 shrink-0 bg-white">
              {isAuthenticated ? (
                <div className="flex flex-col w-full gap-2.5 max-w-sm mx-auto">
                  <Link href={getDashboardLink()} onClick={() => setIsOpen(false)} className="w-full text-center py-3 px-6 font-bold text-[#0d1635] bg-[#C9A227] hover:bg-[#b59123] rounded-xl shadow-md transition-all duration-200 text-sm">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-center py-3 px-6 font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 text-sm cursor-pointer">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mx-auto">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center py-3 px-6 font-bold text-slate-700 hover:text-[#1B2A6B] border border-slate-200 hover:border-[#1B2A6B]/30 rounded-xl transition-colors duration-200 text-sm">
                    Login
                  </Link>
                  <Link href="/signup/student" onClick={() => setIsOpen(false)} className="flex-1 text-center py-3 px-6 font-bold text-white bg-[#1B2A6B] hover:bg-[#C9A227] hover:text-[#0d1635] rounded-xl shadow-md transition-all duration-200 text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
