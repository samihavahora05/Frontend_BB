import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone, Send } from "lucide-react";
import { useGlobalSettings } from "../contexts/SettingsContext";

const footerLinks = {
  companyInfo: [
    { label: "About us", href: "/about" },
    { label: "Blogs", href: "/blog" },
    { label: "Contact us", href: "/contact" },
    { label: "Work With Us", href: "/careers" },
    { label: "Explore Services", href: "/courses" },
  ],
  supportZone: [
    { label: "Help and Support", href: "/contact" },
    { label: "Join Us", href: "/signup/student" },
  ],
  registerAs: [
    { label: "Intern", href: "/signup/intern" },
    { label: "Job Seeker", href: "/signup/jobseeker" },
    { label: "Company", href: "/signup/company" },
    { label: "College", href: "/signup/college" },
    { label: "Expert", href: "/signup/expert" },
  ],
  unlockPotential: [
    { label: "Learn with Blueboxx", href: "/courses" },
    { label: "Teach on Blueboxx", href: "/contact" },
    { label: "Contests / Hackathons", href: "/student/contests" },
  ],
  featuredCourses: [
    { label: "View All Courses", href: "/courses" },
  ],
  legal: [
    { label: "Terms and conditions", href: "/terms" },
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Cookie policy", href: "/privacy-policy#cookies" },
    { label: "Harassment policy", href: "/harassment-policy" },
  ],
};

export const Footer = () => {
  const { settings } = useGlobalSettings();

  return (
    <footer id="footer" className="relative overflow-hidden bg-[#0d1635] text-slate-300 pt-0 pb-0">

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#C9A227 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Corner glows */}
        <div className="absolute -top-16 -right-16 w-[400px] h-[400px] rounded-full bg-[#1B2A6B]/40 blur-[100px]" />
        <div className="absolute bottom-0 -left-16 w-[350px] h-[350px] rounded-full bg-[#C9A227]/8 blur-[120px]" />

        {/* Abstract geometric lines (SVG) */}
        <svg
          className="absolute right-0 top-0 w-[480px] h-full opacity-[0.04] text-[#C9A227]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          aria-hidden
        >
          <path d="M-20,0 L120,100 M-20,25 L120,125" />
          <path d="M120,0 L-20,100 M120,25 L-20,125" />
          <circle cx="50" cy="50" r="30" strokeDasharray="1 2" />
          <circle cx="50" cy="50" r="48" />
        </svg>

        {/* Left decorative circles */}
        <svg
          className="absolute left-0 bottom-0 w-[280px] h-[280px] opacity-[0.04] text-[#C9A227]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          aria-hidden
        >
          <circle cx="0" cy="100" r="40" />
          <circle cx="0" cy="100" r="60" strokeDasharray="2 3" />
          <circle cx="0" cy="100" r="80" />
        </svg>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-2 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 mb-4">

          {/* Brand & Newsletter column */}
          <div className="lg:w-2/5 flex flex-col justify-start items-center lg:items-start text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start w-full">
              <Link href="/" className="inline-block mb-6">
                <img src={settings.footer_logo || "/logowhite.png"} alt={settings.website_name || "BlueBoxx logo"} className="h-14 w-auto object-contain rounded-md shadow-sm" />
              </Link>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <a href={`mailto:${settings.support_email || 'info.blueboxx@gmail.com'}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-[#C9A227] transition-colors">
                <Mail size={16} className="text-[#C9A227]/80 flex-shrink-0" />
                {settings.support_email || 'info.blueboxx@gmail.com'}
              </a>
              <a href={`tel:${settings.support_phone || '+919023512853'}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-[#C9A227] transition-colors">
                <Phone size={16} className="text-[#C9A227]/80 flex-shrink-0" />
                {settings.support_phone || '+91 90235 12853'}
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-400 max-w-sm">
                <MapPin size={16} className="text-[#C9A227]/80 flex-shrink-0 mt-0.5" />
                <span>SF 02, INDIA BULLS MEGA MALL, Dinesh Mill Rd, near Swami Vivekananda Railway Over Bridge, Anand Nagar, Akota, Vadodara, Gujarat 390022</span>
              </div>
            </div>
          </div>

          {/* Right Links Section */}
          <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-4 text-center md:text-left mt-8 lg:mt-0">

            {/* Company Info */}
            <div>
              <h4 className="font-bold text-white mb-3 text-sm tracking-wide uppercase">Company Info</h4>
              <ul className="flex flex-col items-center md:items-start gap-3 text-sm">
                {footerLinks.companyInfo.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 hover:text-[#C9A227] transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Zone & Unlock Potential */}
            <div>
              <div className="mb-6">
                <h4 className="font-bold text-white mb-3 text-sm tracking-wide uppercase">Support Zone</h4>
                <ul className="flex flex-col items-center md:items-start gap-3 text-sm">
                  {footerLinks.supportZone.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-slate-400 hover:text-[#C9A227] transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-3 text-sm tracking-wide uppercase">Unlock Your Potential</h4>
                <ul className="flex flex-col items-center md:items-start gap-3 text-sm">
                  {footerLinks.unlockPotential.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-slate-400 hover:text-[#C9A227] transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Register As & Featured Courses */}
            <div>
              <div className="mb-6">
                <h4 className="font-bold text-white mb-3 text-sm tracking-wide uppercase">Register As</h4>
                <ul className="flex flex-col items-center md:items-start gap-3 text-sm">
                  {footerLinks.registerAs.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-slate-400 hover:text-[#C9A227] transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            <div>
              <h4 className="font-bold text-white mb-3 text-sm tracking-wide uppercase">Featured courses</h4>
              <ul className="flex flex-col items-center md:items-start gap-3 text-sm">
                {footerLinks.featuredCourses.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 hover:text-[#C9A227] transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-4 pb-10 flex flex-col xl:flex-row items-center justify-between gap-4 text-center xl:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-3 sm:gap-4 text-slate-500 text-xs w-full xl:w-auto">
            <span>&copy; {new Date().getFullYear()} {settings.footer_copyright || 'BlueBoxx. All rights reserved.'}</span>
            <span className="hidden sm:inline">|</span>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {footerLinks.legal.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-[#C9A227] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-end gap-6 w-full xl:w-auto mt-6 xl:mt-0">
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, label: "Twitter", href: settings.twitter_url || "https://x.com/BlueboxxDnA" },
                { Icon: Linkedin, label: "LinkedIn", href: settings.linkedin_url || "https://www.linkedin.com/in/blueboxx-da-ab509428/" },
                { Icon: Instagram, label: "Instagram", href: settings.instagram_url || "https://www.instagram.com/blueboxxda_/" },
                { Icon: Facebook, label: "Facebook", href: settings.facebook_url || "https://www.facebook.com/profile.php?id=100091587679727" },
                { Icon: Send, label: "YouTube", href: settings.youtube_url } // Reusing Send icon if Youtube isn't imported
              ].filter(s => !!s.href).map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#C9A227] hover:border-[#C9A227]/40 hover:bg-[#C9A227]/10 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
