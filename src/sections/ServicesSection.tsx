import { motion } from "framer-motion";
import { Laptop, PenTool, TrendingUp, Palette, Search, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const services = [
  { id: 1, title: "Website Development", icon: Laptop, desc: "High-performance websites and web apps built with modern tech stacks." },
  { id: 2, title: "UI/UX Design", icon: PenTool, desc: "Premium user experiences, wireframes, and design systems." },
  { id: 3, title: "Branding & Identity", icon: Palette, desc: "Complete brand guidelines, logos, and visual identity." },
  { id: 4, title: "SEO & Content", icon: Search, desc: "Technical SEO, content strategy, and search engine ranking." },
  { id: 5, title: "Digital Marketing", icon: TrendingUp, desc: "Performance campaigns across major platforms." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export const ServicesSection = () => {
  return (
    <section className="py-[120px] relative overflow-hidden bg-[#0d1635]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_50%)] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(27,42,107,0.4),transparent_50%)] z-0" />
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-[#C9A227] text-xs font-semibold mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></span>
            OUR AGENCY
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-sora">
            Digital Agency <span className="text-[#C9A227]">Services</span>
          </h2>
          <p className="text-base text-slate-300 font-inter">
            Beyond education, our agency delivers premium digital solutions for startups, SMEs, and enterprises.
          </p>
        </motion.div>

        {/* Services Grid - Medium Sized Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1000px] mx-auto"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-4 rounded-2xl bg-[#1B2A6B]/40 border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-[#1B2A6B]/60 hover:border-[#C9A227]/40 hover:shadow-[0_10px_40px_rgba(201,162,39,0.1)] flex flex-col justify-between"
            >
              {/* Top Section */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0d1635] flex items-center justify-center text-[#C9A227] border border-white/5 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)]">
                    <service.icon size={16} strokeWidth={2} />
                  </div>
                  <ArrowUpRight size={16} className="text-slate-500 group-hover:text-[#C9A227] transition-colors opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 duration-300" />
                </div>
                
                <h3 className="text-[15px] font-bold text-white mb-1.5 font-sora group-hover:text-[#C9A227] transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-[12px] leading-snug font-inter">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#1B2A6B] to-[#0d1635] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-[1000px] mx-auto shadow-2xl relative overflow-hidden"
        >
          {/* Decorative glow in banner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <h4 className="text-xl font-bold text-white mb-2 font-sora">Have a project in mind?</h4>
            <p className="text-sm text-slate-300 font-inter">Get a free proposal within 24 hours. No commitments.</p>
          </div>
          <Link href="/contact" className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] font-bold text-sm shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,162,39,0.4)] hover:scale-105">
            Discuss Your Project <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
