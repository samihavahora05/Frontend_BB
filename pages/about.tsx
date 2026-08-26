import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import {
  Users, Building2, Briefcase, Target, Star,
  Heart, TrendingUp, Award, BookOpen,
  Globe, Phone, MapPin, Calendar
} from "lucide-react";
import { ClientsSection } from "../src/sections/ClientsSection";
import { StudentsShowcaseSection } from "../src/sections/StudentsShowcaseSection";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

import { SEO } from "../src/components/seo/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO 
        title="About Blueboxx DA | Premier EdTech & Creative Production House"
        description="Established in 2015, Blueboxx DA is Vadodara's premier Advertising Agency, Production House, and EdTech platform driving the Learn-Work-Earn model."
        keywords="About Blueboxx, Advertising Agency Vadodara, Production House Gujarat, EdTech Company Vadodara, Ankush Dubey, Blueboxx Founder"
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Blueboxx DA",
          "image": "https://blueboxx.in/og-image.jpg",
          "telephone": "+91 9023512853",
          "url": "https://blueboxx.in/about",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Near Jetalpur Bridge, Akota Road, FF 51, India Bulls Mega Mall",
            "addressLocality": "Vadodara",
            "addressRegion": "Gujarat",
            "postalCode": "390020",
            "addressCountry": "IN"
          },
          "founder": {
            "@type": "Person", 
            "name": "Ankush Dubey"
          }
        }}
      />
      <MainLayout>
      <div className="min-h-screen bg-transparent font-sans">

        {/* --- HERO SECTION --- */}
        <section className="bg-[#0d1635] pt-24 pb-16 px-4 text-center relative overflow-hidden">
          {/* Premium Grid Background */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" />
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="container mx-auto max-w-4xl relative z-10"
          >
            <motion.div
              variants={itemVariants}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              ABOUT BLUEBOXX DA
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md"
            >
              Where Creativity <br className="hidden md:block" />
              <span className="text-[#C9A227] inline-block">Meets Innovation.</span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed space-y-6"
            >
              <p>
                Blueboxx DA is Vadodara's premier <span className="text-white font-bold">Advertising Agency & Production House</span>. We bring brands to life through state-of-the-art 3D animation, visual effects, web development, and comprehensive digital marketing.
              </p>
              <p className="text-base text-slate-400">
                Driven by technical excellence and creative talent, we create the next generation of digital experiences and feature films for our global clients.
              </p>
            </motion.div>
          </motion.div>
        </section>



        {/* Who We Are & Features Area */}
        <section className="py-12 bg-transparent">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left Sidebar (At a Glance) */}
              <aside className="w-full lg:w-72 shrink-0">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-28">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-4">At a Glance</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Globe, label: "Website", value: "www.blueboxx.in", href: "http://www.blueboxx.in/" },
                      { icon: Phone, label: "Phone", value: "+91 9023512853", href: "tel:+919023512853" },
                      { icon: Briefcase, label: "Industry", value: "Broadcast Media" },
                      { icon: Users, label: "Company Size", value: "11-50 employees" },
                      { icon: MapPin, label: "Headquarters", value: "Vadodara, Gujarat" },
                      { icon: Calendar, label: "Founded", value: "2015" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#1B2A6B] flex items-center justify-center shrink-0">
                          <stat.icon size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                          {stat.href ? (
                            <a href={stat.href} target={stat.href.startsWith("http") ? "_blank" : undefined} rel={stat.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors block mt-0.5">{stat.value}</a>
                          ) : (
                            <div className="text-sm font-semibold text-slate-800 mt-0.5">{stat.value}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Right Content Area */}
              <main className="flex-1 space-y-8">

                {/* Company Overview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
                  <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-extrabold text-slate-900 mb-6">Company Overview</motion.h2>
                  <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                      Established in 2015, Blueboxx DA is one of the finest advertising firms in Vadodara, Gujarat India. Being an advertising agency, Blueboxx DA, not only helps you promote your brand and business but also assists you with the Technical, Creative, and Production Talent ready to create the next generation creatives and characters for feature films, commercials, merchandise, and other related products.
                    </motion.p>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                      Over the past few years, we aimed to put the best efforts ever to produce high-quality work for our clients. Blueboxx DA’s main products are design & development, corporate brand identity, media planning & releases, 3D animation, 2D animation, animation for specific purposes, video editing, visual effects, web designing & development, SEO, SMM, YouTube marketing.
                    </motion.p>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                      Moreover, we have established our own production house. Blueboxx has built a creative team that includes highly skilled modelers, designers, developers, audio/video editors, and animators who are responsible for creating, developing, writing, and animating all produced films.
                    </motion.p>

                    <h3 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">Our Specialties</h3>
                    <motion.div 
                      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-50px" }}
                      className="flex flex-wrap gap-2"
                    >
                      {["Animation", "Media Production", "Video Services", "Training Specialist", "Advertising Expert", "Content Creation", "Computer Graphics", "Branding Specialist", "Designs", "Conceptualization", "Mobile and Website Development", "Creative Graphics", "Multimedia Training"].map((skill, i) => (
                        <motion.span 
                          variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: "spring" } } }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          key={i} 
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:bg-[#1B2A6B] hover:text-white hover:border-[#1B2A6B] transition-colors"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </motion.div>

                    <h3 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">Workplace & Locations</h3>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div className="flex items-start gap-3 mb-4">
                        <Briefcase className="text-[#1B2A6B] shrink-0" size={20} />
                        <div>
                          <div className="font-bold text-slate-900">Work Setup</div>
                          <div className="text-sm text-slate-600">Hybrid workplace, Contract basis, Full time Basis, Work From Home. (Flexible Time on-site)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="text-[#1B2A6B] shrink-0" size={20} />
                        <div>
                          <div className="font-bold text-slate-900">Primary Location (Akota)</div>
                          <div className="text-sm text-slate-600">Near Jetalpur Bridge, Akota Road, Akota, Vadodara, FF 51, India Bulls Mega Mall, Vadodara, Gujarat 390020, IN</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learn, Work, Earn Premium Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: "Learn", icon: BookOpen, desc: "Master industry-ready skills through expert-led courses, live sessions, and practical learning.", color: "blue" },
                    { title: "Work", icon: Briefcase, desc: "Apply your knowledge on real-world projects, internships, and collaborative industry tasks.", color: "emerald" },
                    { title: "Earn", icon: Award, desc: "Unlock career opportunities, stipends, certifications, and placement support as you grow.", color: "amber" }
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center mb-4`}>
                        <card.icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Mission & Vision (Dark Glass Cards) */}
                <div id="mission" className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#0d1635] p-8 rounded-2xl border border-[#1B2A6B] shadow-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full group-hover:scale-150 transition-transform"></div>
                    <Target size={32} className="text-blue-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                    <p className="text-blue-100/80 leading-relaxed">
                      To make quality, industry-focused education accessible while creating meaningful career opportunities for every learner.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#0d1635] p-8 rounded-2xl border border-[#1B2A6B] shadow-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full group-hover:scale-150 transition-transform"></div>
                    <Star size={32} className="text-amber-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                    <p className="text-amber-100/80 leading-relaxed">
                      To build India's most trusted ecosystem connecting learners, mentors, colleges, and companies through practical education.
                    </p>
                  </motion.div>
                </div>

                {/* Why BlueBoxx */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Why BlueBoxx</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { title: "Industry Experts", icon: Users },
                      { title: "Live Projects", icon: Briefcase },
                      { title: "Internship Programs", icon: Target },
                      { title: "Career Mentorship", icon: Heart },
                      { title: "Placement Support", icon: TrendingUp },
                      { title: "Industry Certifications", icon: Award }
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-5 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.08)] hover:-translate-y-1 hover:border-[#1B2A6B]/30 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center group-hover:from-[#1B2A6B] group-hover:to-[#0d1635] group-hover:text-[#C9A227] group-hover:border-[#1B2A6B] transition-all duration-500 shadow-inner relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/20 blur-md rounded-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                          <feature.icon size={26} className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                        </div>
                        <span className="font-extrabold text-slate-800 text-lg group-hover:text-[#1B2A6B] transition-colors">{feature.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* --- OUR STORY TIMELINE --- */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm mt-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">Our Journey</h2>
                  <div className="relative border-l-2 border-indigo-100 ml-3 md:mx-auto md:w-full md:max-w-3xl md:border-l-0">
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-indigo-100 -translate-x-1/2"></div>
                    
                    {[
                      { year: "2015", title: "The Beginning", desc: "Founded in Vadodara as a small creative studio focusing on 3D animation." },
                      { year: "2017", title: "Production House", desc: "Established our own full-scale production house for feature films and commercials." },
                      { year: "2020", title: "Digital Expansion", desc: "Launched comprehensive digital marketing and web development services." },
                      { year: "2023", title: "Education Hub", desc: "Started the Learn-Work-Earn initiative to bridge the industry skill gap." },
                      { year: "2026", title: "Global Reach", desc: "Partnering with 100+ companies globally for guaranteed placements." }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50, y: 20 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                        className={`relative flex flex-col md:flex-row items-center justify-between mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-[-11px] md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-[#1B2A6B] shadow-[0_0_0_4px_rgba(27,42,107,0.1)] group-hover:shadow-[0_0_0_6px_rgba(201,162,39,0.2)] group-hover:border-[#C9A227] transition-all duration-300 z-10 mt-1 md:mt-0"></div>
                        
                        {/* Content Box */}
                        <div className={`w-full pl-8 md:pl-0 md:w-5/12 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#1B2A6B]/30 transition-all cursor-default"
                          >
                            <span className="text-[#C9A227] font-black text-xl mb-1 block">{item.year}</span>
                            <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </main>
            </div>
          </div>
        </section>

        {/* --- MEET OUR FOUNDER --- */}
        <section className="py-16 bg-transparent border-t border-slate-200">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Meet Our Founder</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                The visionary leader behind the Learn-Work-Earn movement.
              </p>
            </div>

            {/* ── Wide Horizontal Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1B2A6B] via-[#C9A227] to-[#1B2A6B]" />

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1B2A6B]/4 to-transparent rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#C9A227]/4 to-transparent rounded-full pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center md:items-stretch gap-0">

                {/* LEFT — Dark Photo Panel */}
                <div className="relative md:w-80 lg:w-96 shrink-0 bg-gradient-to-br from-[#0d1635] to-[#1B2A6B] flex flex-col items-center justify-center py-10 px-8 gap-5">
                  {/* Dot pattern */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                  {/* Photo — large, fully visible */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: 0.1, stiffness: 100 }}
                    className="relative z-10 group/photo"
                  >
                    <div className="w-44 h-52 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl ring-2 ring-[#C9A227]/40">
                      <img
                        src="/ankush.jpeg"
                        alt="Ankush Dubey — Founder & CEO, Blueboxx DA"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/photo:scale-110"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#C9A227] text-[#0d1635] text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider whitespace-nowrap">
                      Founder & CEO
                    </div>
                  </motion.div>

                  {/* Name */}
                  <div className="text-center z-10 mt-3">
                    <h4 className="text-2xl font-extrabold text-white tracking-tight">Ankush Dubey</h4>
                    <p className="text-white/50 text-xs mt-1 font-medium">Blueboxx Designs & Animation</p>
                  </div>

                  {/* Stats row */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-6 z-10 border-t border-white/10 pt-5 w-full justify-center"
                  >
                    {[{ v: "12+", l: "Years Exp." }, { v: "5000+", l: "Students" }, { v: "100+", l: "Companies" }].map((s, i) => (
                      <motion.div 
                        key={s.l} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <p className="text-2xl font-black text-[#C9A227] leading-none">{s.v}</p>
                        <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wide mt-1">{s.l}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* RIGHT — Info Panel */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-[#1B2A6B] flex items-center justify-center shadow-md shrink-0">
                      <Award size={16} className="text-[#C9A227]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">About the Founder</p>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#1B2A6B] to-[#C9A227] rounded-full mt-1" />
                    </div>
                  </div>

                  {/* Bio */}
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 text-base leading-relaxed mb-6"
                  >
                    A seasoned entrepreneur and creative technologist with over <span className="font-bold text-[#1B2A6B]">12 years of industry expertise</span> in EdTech, Advertising, and Digital Production. As the architect of the pioneering <span className="font-bold text-[#1B2A6B]">Learn-Work-Earn</span> model, Ankush has transformed how students transition into industry-ready professionals — bridging the gap between quality education and real-world career opportunities.
                  </motion.p>

                  {/* Expertise Grid — Lucide icons, no emojis */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                    {[
                      { Icon: BookOpen,   label: "EdTech Leadership" },
                      { Icon: TrendingUp, label: "Brand Strategy" },
                      { Icon: Globe,      label: "Digital Marketing" },
                      { Icon: Target,     label: "Product Development" },
                      { Icon: Users,      label: "Placement Mentorship" },
                      { Icon: Building2,  label: "Media Production" },
                    ].map(({ Icon, label }, idx) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#1B2A6B]/30 hover:bg-[#1B2A6B]/5 transition-colors cursor-default shadow-sm"
                      >
                        <div className="w-6 h-6 rounded-md bg-[#1B2A6B]/10 flex items-center justify-center shrink-0">
                          <Icon size={12} className="text-[#1B2A6B]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom CTA strip */}
                  <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium">Established <span className="font-bold text-slate-600">2015</span> · Vadodara, Gujarat, India</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors cursor-pointer">
                      <TrendingUp size={13} />
                      <span>12+ Years of Excellence</span>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </section>



        {/* --- STUDENTS SHOWCASE --- */}
        <StudentsShowcaseSection 
          title="OUR TALENT NETWORK"
          tag="Learners & Placed Alumni"
          subtitle="Meet the dynamic learners and alumni shaped through Blueboxx DA's experiential training programs."
        />

        {/* --- CLIENTS / PARTNERS --- */}
        <div className="bg-white">
          <ClientsSection 
            titlePrefix="Clients and " 
            highlightText="Top Companies" 
            subtitle="We are proud to work with clients and partners from leading organizations worldwide" 
          />
        </div>
      </div>
    </MainLayout>
    </>
  );
}
