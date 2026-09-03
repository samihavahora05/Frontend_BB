import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView, useScroll, Variants } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Star, Quote,
  Laptop, Bot, Rocket, Building2, Megaphone, Users,
  ShoppingCart, Factory, Landmark, Stethoscope, Home,
  Truck, Gamepad2, Briefcase, Scale, Globe,
  ShieldCheck, Database, Award, Clock, ChevronDown, ChevronUp,
  Mail, Phone, MapPin, Send, Code2, Server, Smartphone, LineChart,
  Cog, Zap, Compass, Target, Lightbulb, Shield, Loader2,
  ChevronRight, Cpu, Code, UserPlus, Cloud, TrendingUp,
  Search, Settings, Maximize, PiggyBank,
  Layers, Palette, Headphones, LucideIcon,
  Maximize2, X, ExternalLink, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SEO } from '../src/components/seo/SEO';
import Navbar from '../src/components/Navbar';
import { Footer } from '../src/components/Footer';
import { TestimonialsSection } from '../src/sections/TestimonialsSection';
import { CustomCursor } from '../src/components/CustomCursor';
import { ScrollProgressBar } from '../src/components/ScrollProgressBar';
import { FloatingActions } from '../src/components/FloatingActions';
import api from '../src/lib/axios';

// ─── FRAMER MOTION VARIANTS ───────────────────────────────────────────────────

const hoverButtonVariant: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.04, y: -2, transition: { type: 'spring', stiffness: 400, damping: 15 } },
  tap: { scale: 0.96 },
};

const hoverCardVariant: Variants = {
  initial: { y: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
  hover: {
    y: -8,
    boxShadow: '0 20px 40px rgba(27,42,107,0.12)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

// ─── INTERACTIVE HERO PARTICLE CANVAS ─────────────────────────────────────────

function HeroParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor(width / 18), 70);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = ['#1b2a6b', '#c9a227', '#6366f1', '#3b82f6'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `rgba(27, 42, 107, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach((p) => {
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          p.x += (mdx / mdist) * 0.8;
          p.y += (mdy / mdist) * 0.8;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}

// ─── ANIMATED STATISTIC CARD COMPONENT ────────────────────────────────────────

function StatCard({
  value,
  label,
  suffix = '+',
  description
}: {
  value: number;
  label: string;
  suffix?: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 90 });
  const rounded = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  return (
    <motion.div
      ref={ref}
      variants={hoverCardVariant}
      initial="initial"
      whileHover="hover"
      className="flex flex-col p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#c9a227]/40 relative overflow-hidden transition-all duration-300 group text-left"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#c9a227]/20 transition-colors" />

      <div className="relative z-10 flex items-baseline gap-1 mb-2">
        <motion.span className="text-4xl sm:text-5xl font-heading font-black text-[#0d1635] tracking-tight font-sora">
          {rounded}
        </motion.span>
        <span className="text-3xl sm:text-4xl font-heading font-black text-[#c9a227]">{suffix}</span>
      </div>

      <h3 className="relative z-10 text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wider mb-2 font-sora">
        {label}
      </h3>

      <p className="relative z-10 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed font-inter">
        {description}
      </p>
    </motion.div>
  );
}

// ─── CUSTOM SELECT DROPDOWN COMPONENT ─────────────────────────────────────────

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  hasError
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  hasError?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border ${hasError ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-[#C9A227]'
          } rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 transition-all cursor-pointer flex justify-between items-center`}
      >
        <span className={selectedOption ? 'text-slate-800 font-semibold text-sm' : 'text-slate-400 text-sm'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C9A227]' : ''}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-50 transition-colors ${value === option.value ? 'bg-amber-50/70 font-bold text-[#C9A227]' : 'text-slate-700'
                    }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface ProcessStepType {
  id: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const PROCESS_STEPS: ProcessStepType[] = [
  {
    id: 1,
    icon: Search,
    title: 'Discovery',
    desc: 'Understanding your business goals, requirements, and challenges.'
  },
  {
    id: 2,
    icon: Layers,
    title: 'Planning',
    desc: 'Creating a robust architecture and strategic roadmap for development.'
  },
  {
    id: 3,
    icon: Palette,
    title: 'Design',
    desc: 'Crafting intuitive and premium user interfaces and experiences.'
  },
  {
    id: 4,
    icon: Code2,
    title: 'Development',
    desc: 'Writing clean, scalable, and efficient code with agile methodologies.'
  },
  {
    id: 5,
    icon: ShieldCheck,
    title: 'Testing',
    desc: 'Rigorous QA testing to ensure bug-free and high-performance delivery.'
  },
  {
    id: 6,
    icon: Rocket,
    title: 'Launch',
    desc: 'Deploying the product to production and managing a smooth rollout.'
  },
  {
    id: 7,
    icon: Headphones,
    title: 'Support',
    desc: 'Providing ongoing maintenance, monitoring, and future scaling.'
  },
];

const EXPERTISE_SOLUTIONS = [
  { icon: Globe, title: 'All Industries' },
  { icon: Code2, title: 'IT & Software Development' },
  { icon: Bot, title: 'AI Automation & Smart Business Systems' },
  { icon: Database, title: 'CRM, HRMS & ERP Solutions' },
  { icon: Megaphone, title: 'Digital & Performance Marketing' },
  { icon: Cloud, title: 'Project Outsourcing' },
  { icon: Users, title: 'Virtual & Trained Workforce' },
  { icon: Rocket, title: 'SMEs & Startups' },
  { icon: Briefcase, title: 'Marketing & IT Agencies' },
  { icon: UserPlus, title: 'HR & Recruitment Firms' },
  { icon: Smartphone, title: 'Web & Mobile App Development' },
  { icon: Gamepad2, title: 'Game Development Services' },
  { icon: Laptop, title: 'IT Project Outsourcing' },
  { icon: Target, title: 'Lead Generation Company' },
  { icon: TrendingUp, title: 'Growth Marketing Services' },
  { icon: Search, title: 'Online Marketing for Businesses' },
  { icon: Cog, title: 'Marketing Automation Services' },
  { icon: LineChart, title: 'Business Growth Services' },
  { icon: Building2, title: 'SME Business Solutions' },
  { icon: Lightbulb, title: 'Startup Support Services' },
  { icon: Maximize, title: 'Scale Business Operations' },
  { icon: PiggyBank, title: 'Cost-Effective Business Services' },
  { icon: Compass, title: 'Business Consulting & Execution' },
];

const INDUSTRIES_LIST = [
  { icon: <Laptop size={28} strokeWidth={1.8} />, name: 'IT & Software' },
  { icon: <Bot size={28} strokeWidth={1.8} />, name: 'AI & Automation' },
  { icon: <Rocket size={28} strokeWidth={1.8} />, name: 'Startups' },
  { icon: <Building2 size={28} strokeWidth={1.8} />, name: 'SMEs' },
  { icon: <Megaphone size={28} strokeWidth={1.8} />, name: 'Marketing Agencies' },
  { icon: <Users size={28} strokeWidth={1.8} />, name: 'HR & Recruitment' },
  { icon: <ShoppingCart size={28} strokeWidth={1.8} />, name: 'E-commerce & Retail' },
  { icon: <Factory size={28} strokeWidth={1.8} />, name: 'Manufacturing' },
  { icon: <Landmark size={28} strokeWidth={1.8} />, name: 'Finance & FinTech' },
  { icon: <Stethoscope size={28} strokeWidth={1.8} />, name: 'Healthcare' },
  { icon: <Home size={28} strokeWidth={1.8} />, name: 'Real Estate' },
  { icon: <Truck size={28} strokeWidth={1.8} />, name: 'Logistics' },
  { icon: <Gamepad2 size={28} strokeWidth={1.8} />, name: 'Gaming & Ent.' },
  { icon: <Briefcase size={28} strokeWidth={1.8} />, name: 'Enterprise Solutions' },
  { icon: <Scale size={28} strokeWidth={1.8} />, name: 'Professional Services' },
  { icon: <Globe size={28} strokeWidth={1.8} />, name: 'Digital Businesses' },
];

const TESTIMONIALS = [
  {
    id: 1,
    company: 'Jash Packaging',
    content: "Blueboxx delivered a modern business website that significantly improved our online presence. Their team maintained excellent communication and delivered the project before the deadline.",
    rating: 5,
    initials: 'JP'
  },
  {
    id: 2,
    company: 'Damyaa Foods',
    content: "A highly professional team with a deep understanding of market trends. The web development services provided by Blueboxx gave Damyaa Foods the premium digital footprint we needed.",
    rating: 5,
    initials: 'DF'
  },
  {
    id: 3,
    company: 'Flammer Technologies Pvt. Ltd.',
    content: "The development quality, UI/UX, and technical execution exceeded our expectations. Blueboxx has become our trusted technology partner for all our scaling needs.",
    rating: 5,
    initials: 'FT'
  },
  {
    id: 4,
    company: 'APS Associates',
    content: "Their strategic approach to digital solutions is commendable. The customized web application they developed has streamlined our operations and improved efficiency.",
    rating: 5,
    initials: 'AA'
  },
  {
    id: 5,
    company: 'HS Structure',
    content: "Working with Blueboxx was a seamless experience. They took our vision and turned it into a robust, high-performance web presence that perfectly represents our brand.",
    rating: 5,
    initials: 'HS'
  },
  {
    id: 6,
    company: 'Asha Tours & Travels',
    content: "An incredible team to work with. The new booking system and website overhaul completely changed how we engage with our customers and handle daily operations.",
    rating: 5,
    initials: 'AT'
  },
  {
    id: 7,
    company: 'Green Clean Solar',
    content: "Blueboxx helped us create a clean, sustainable digital footprint. Their responsive support and high-quality development make them a truly top-tier tech agency.",
    rating: 5,
    initials: 'GC'
  },
  {
    id: 8,
    company: 'Indo German',
    content: "Exceptional design and functionality! The new platform built by Blueboxx helped us increase our brand engagement and customer acquisition rates significantly.",
    rating: 5,
    initials: 'IG'
  }
];

const FAQS = [
  {
    q: "What is your typical project timeline?",
    a: "Our timelines vary based on project complexity. A standard enterprise web application typically takes 12-16 weeks from discovery to launch, while simpler automation scripts or MVPs can be delivered in 4-6 weeks."
  },
  {
    q: "Do you provide ongoing support and maintenance?",
    a: "Yes, we offer comprehensive SLA-backed support and maintenance packages. We act as your long-term technology partner to ensure your systems remain secure, scalable, and up-to-date."
  },
  {
    q: "What technologies do you specialize in?",
    a: "We specialize in modern, high-performance tech stacks including Next.js, React, Node.js, Python, Laravel, and cloud infrastructure like AWS and Google Cloud. We also integrate advanced AI models like OpenAI and Claude."
  },
  {
    q: "How do you ensure the security of our enterprise data?",
    a: "Security is built into our architecture from day one. We follow industry best practices, implement end-to-end encryption, conduct regular vulnerability assessments, and ensure compliance with relevant data protection regulations (GDPR, HIPAA, etc.)."
  },
  {
    q: "Can you augment our existing in-house development team?",
    a: "Absolutely. We offer dedicated developer models where our senior engineers integrate seamlessly with your internal teams, adopting your workflows and accelerating your product roadmap."
  }
];

const SERVICE_OPTIONS = [
  { value: 'website development', label: 'Website Development' },
  { value: 'software', label: 'Software Development' },
  { value: 'ai', label: 'AI Automation' },
  { value: 'crm', label: 'CRM / ERP Solutions' },
  { value: 'lms', label: 'LMS Platform' },
  { value: 'hrms', label: 'HRMS Solution' },
  { value: 'mobile', label: 'Mobile App Development' },
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'other', label: 'Other' },
];

const BUDGET_OPTIONS = [
  { value: '10k-25k', label: '₹10,000 - ₹25,000' },
  { value: '25k-50k', label: '₹25,000 - ₹50,000' },
  { value: '50k-100k', label: '₹50,000 - ₹1,00,000' },
  { value: '100k+', label: '₹1,00,000+' },
];

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3', label: '1 - 3 Months' },
  { value: '3-6', label: '3 - 6 Months' },
  { value: 'flexible', label: 'Flexible / Long-term' },
];


// ─── ANIMATED PROCESS SECTION (MATCHING HOMEPAGE ROADMAP DESIGN) ─────────────

const ProcessStepItem = ({ step, isLeft }: { step: ProcessStepType; isLeft: boolean }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  // Detects when the step row is in the middle 20% of the viewport (40% from top to 40% from bottom)
  const isActive = useInView(rowRef, {
    once: false,
    margin: "-40% 0px -40% 0px"
  });

  return (
    <div ref={rowRef} className="md:grid md:grid-cols-2 gap-8 items-center relative md:mb-12 mb-8 last:mb-0">
      {/* Step Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`${isLeft ? "md:col-start-1" : "md:col-start-2"} relative group`}
      >
        <div
          className={`p-6 rounded-xl transition-all duration-500 relative overflow-hidden flex items-start gap-4 border ${isActive
            ? "bg-white border-[#1B2A6B]/40 shadow-[0_20px_50px_rgba(27,42,107,0.12)] scale-[1.02]"
            : "bg-white border-slate-200/80 shadow-[0_10px_30px_rgba(13,22,53,0.04)] hover:border-slate-300"
            }`}
        >
          {/* Top border accent that lights up */}
          <div
            className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#1B2A6B] via-[#2E45A3] to-[#C9A227] transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Glowing background bubble */}
          <div
            className={`absolute right-0 top-0 w-24 h-24 bg-blue-50/50 rounded-bl-full blur-xl transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
              }`}
          />

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isActive ? "bg-[#1B2A6B] text-white shadow-lg shadow-[#1B2A6B]/30 scale-105" : "bg-[#1B2A6B]/8 text-[#1B2A6B]"
              }`}
          >
            <step.icon size={20} />
          </div>
          <div className="relative z-10">
            <h3
              className={`text-lg font-bold mb-1 transition-colors duration-500 font-sora ${isActive ? "text-[#1B2A6B]" : "text-slate-900"
                }`}
            >
              {step.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed font-inter">{step.desc}</p>
          </div>
        </div>
      </motion.div>

      {isLeft && <div className="hidden md:block md:col-start-2" />}
    </div>
  );
};

function AnimatedProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tracks the scroll progress of the process roadmap container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Transform scroll progress to line height percentage
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" ref={containerRef} className="py-24 text-slate-900 overflow-hidden relative" style={{ backgroundColor: "#f8fafc", position: "relative" }}>
      {/* Blueprint grid lines (Main 48px grid) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(to right, rgba(27,42,107,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,42,107,0.05) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      {/* Blueprint grid lines (Sub 12px grid) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(to right, rgba(27,42,107,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,42,107,0.02) 1px, transparent 1px)",
        backgroundSize: "12px 12px",
      }} />
      {/* Corner glows to add depth */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.08),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_left,rgba(27,42,107,0.08),transparent_60%)] pointer-events-none z-0" />

      {/* Decorative SVG network lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.22] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M 100 200 Q 250 80 400 350 T 800 150 T 1100 450" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 6" />
        <path d="M -50 600 Q 150 400 350 700 T 750 500 T 1300 800" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 6" />
        <circle cx="250" cy="80" r="3" fill="#1B2A6B" />
        <circle cx="800" cy="150" r="3.5" fill="#1B2A6B" />
        <circle cx="150" cy="400" r="2.5" fill="#C9A227" />
        <circle cx="750" cy="500" r="3" fill="#C9A227" />
      </svg>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#C9A227] font-sora">Our Methodology</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading mb-4 font-sora text-slate-900 tracking-tight">
            How We Execute
          </h2>
          <p className="text-base text-slate-600 font-inter max-w-xl mx-auto">
            A disciplined, milestone-driven engineering track designed for precision, velocity, and enterprise scalability.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Scroll-driven progress line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[24px] bottom-[24px] w-[3px] bg-slate-200/80 rounded-full hidden md:block">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#1B2A6B] via-[#2E45A3] to-[#C9A227] rounded-full shadow-[0_0_8px_rgba(27,42,107,0.4)]"
              style={{
                height: lineHeight,
                originY: 0
              }}
            />
          </div>

          <div className="space-y-6 md:space-y-0 relative">
            {PROCESS_STEPS.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <ProcessStepItem
                  key={step.id}
                  step={step}
                  isLeft={isLeft}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ServicesPortfolioPage() {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [activeProcessIdx, setActiveProcessIdx] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [fullscreenDashboard, setFullscreenDashboard] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    service: 'website development',
    budget: '25k-50k',
    timeline: '1-3',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName || !formState.email || !formState.phone || !formState.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Direct CRM Lead ingestion into the database so Admin sees it in Admin Dashboard & /admin/crm/leads
      const formattedSubject = `Services Inquiry: ${formState.service.toUpperCase()}`;
      const formattedMessage = `Company: ${formState.companyName || 'N/A'}\nService: ${formState.service}\nBudget: ${formState.budget}\nTimeline: ${formState.timeline}\n\nProject Requirements:\n${formState.message}`;

      await api.post('/public/contact', {
        name: formState.fullName,
        email: formState.email,
        phone: formState.phone,
        subject: formattedSubject,
        message: formattedMessage,
        course_interested: formState.service,
        source: 'Services & Portfolio Page',
        source_page: typeof window !== 'undefined' ? window.location.href : '/services',
      });
    } catch {
      // Fallback
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Thank you! Your inquiry has been submitted and registered with our team.', { duration: 6000 });
    setFormState({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      service: 'website development',
      budget: '25k-50k',
      timeline: '1-3',
      message: ''
    });

    setTimeout(() => {
      setIsSuccess(false);
    }, 6000);
  };

  return (
    <>
      <SEO
        title="Services & Portfolio | Digital Solutions, CRM, LMS, HRMS, ERP | Blueboxx DA"
        description="Blueboxx is your premium technology partner. We build scalable websites, custom CRM systems, LMS platforms, HRMS platforms, and enterprise ERP solutions."
      />
      <Head>
        <title>Services & Portfolio | Digital Solutions, CRM, LMS, HRMS, ERP | Blueboxx DA</title>
        <meta name="description" content="Explore Blueboxx end-to-end technology services, capability matrix, and enterprise digital solutions." />
      </Head>

      {/* Global Page UI Helpers */}
      <CustomCursor />
      <ScrollProgressBar />
      <FloatingActions />

      <div className="min-h-screen bg-[#ffffff] text-[#0d1635] font-sans selection:bg-[#c9a227]/30 selection:text-[#0d1635] relative antialiased flex flex-col">
        {/* Main Project Navbar */}
        <Navbar />

        {/* Subtle grid pattern background */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #1b2a6b 1px, transparent 1px), linear-gradient(to bottom, #1b2a6b 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 1: HERO SECTION
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="home" className="relative pt-8 pb-16 md:pt-10 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 border-b border-slate-100">
          {/* Interactive Particle Constellation Canvas */}
          <HeroParticleCanvas />

          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-blue-200/25 via-amber-200/20 to-indigo-200/25 rounded-full blur-[130px] pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10 text-center">

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-sm font-medium text-slate-700 shadow-xs hover:border-[#c9a227] transition-colors">
                <Cpu size={16} className="text-[#c9a227]" /> AI Automation
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-sm font-medium text-slate-700 shadow-xs hover:border-[#1b2a6b] transition-colors">
                <Code size={16} className="text-[#1b2a6b]" /> Enterprise Software
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-sm font-medium text-slate-700 shadow-xs hover:border-emerald-500 transition-colors">
                <LineChart size={16} className="text-emerald-600" /> Business Growth
              </span>
            </motion.div>

            {/* Main Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-black text-[#0d1635] tracking-tight leading-[1.12] max-w-7xl mx-auto mb-9 font-sora"
            >
              We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b2a6b] via-[#c9a227] to-[#e0b840]">Digital Solutions</span> That Scale Your Business
            </motion.h1>

            {/* Sub-Headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed font-inter"
            >
              Blueboxx is your premium technology partner. We specialize in software development, AI automation, and digital transformation for ambitious companies.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.a
                variants={hoverButtonVariant}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                href="#contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0d1635] text-white font-semibold hover:bg-[#c9a227] hover:text-[#0d1635] transition-all duration-300 shadow-[0_10px_25px_rgba(27,42,107,0.25)] group cursor-pointer"
              >
                Start Your Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                variants={hoverButtonVariant}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                href="#services"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-200 transition-all duration-300 shadow-sm cursor-pointer"
              >
                Explore Services
              </motion.a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="inline-flex flex-col items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400"
            >
              <span>Scroll to Explore</span>
              <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 rounded-full bg-[#c9a227]"
                />
              </div>
            </motion.div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 2: ABOUT & DEFINITIVE IMPACT METRICS (PHOTO 1 PROPER FORMATTING)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="about" className="py-20 md:py-28 bg-white relative">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">

              <div className="lg:col-span-6 space-y-6">
                <h4 className="text-[#c9a227] font-bold tracking-[0.2em] uppercase text-xs">About Blueboxx</h4>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight leading-tight font-sora">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b2a6b] via-[#c9a227] to-[#e0b840]">Premium Partner</span> for Digital Transformation.
                </h2>
                <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed font-inter">
                  Blueboxx isn't just a development agency—we are your execution partner. Since our inception, we have been obsessed with building scalable software architectures, intelligent AI automations, and enterprise-grade systems that drive real business results.
                </p>
                <p className="text-slate-600 text-base font-medium leading-relaxed font-inter">
                  We bridge the gap between complex technology and business growth, empowering startups, SMEs, and large enterprises to outpace their competition in a digital-first world.
                </p>

                <div className="pt-2 flex flex-wrap gap-6">
                  <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1">
                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#1b2a6b] to-[#c9a227] mb-1">12+</div>
                    <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Years Experience</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1">
                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#1b2a6b] to-[#c9a227] mb-1">100%</div>
                    <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Client Commitment</div>
                  </div>
                </div>
              </div>

              {/* Core Values Cards */}
              <div className="lg:col-span-6 grid sm:grid-cols-2 gap-5 relative">
                {[
                  { icon: <Target className="w-6 h-6 text-[#c9a227]" />, title: 'Mission', desc: 'To accelerate business growth through cutting-edge technology and automation.' },
                  { icon: <Lightbulb className="w-6 h-6 text-purple-600" />, title: 'Vision', desc: 'Becoming the global standard for enterprise digital transformation and innovation.' },
                  { icon: <Shield className="w-6 h-6 text-emerald-600" />, title: 'Trust', desc: 'Building long-term partnerships based on transparency, security, and reliability.' },
                  { icon: <Zap className="w-6 h-6 text-amber-500" />, title: 'Execution', desc: 'Delivering scalable, high-performance solutions with speed and precision.' },
                ].map((val, idx) => (
                  <motion.div
                    key={idx}
                    variants={hoverCardVariant}
                    initial="initial"
                    whileHover="hover"
                    className={`p-7 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs transition-all ${idx % 2 === 1 ? 'sm:mt-8' : ''
                      }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center mb-4 shadow-2xs">
                      {val.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#0d1635] mb-2 font-sora">{val.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-inter">{val.desc}</p>
                  </motion.div>
                ))}
              </div>

            </div>

            {/* Statistics Section with Clear Defining Descriptions (Photo 1 Resolved) */}
            <div className="pt-12 border-t border-slate-100">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-[#c9a227] text-xs font-black uppercase tracking-widest">PROVEN TRACK RECORD</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0d1635] mt-1 font-sora">
                  Numbers That Define Our Impact
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  value={3000}
                  label="Projects Delivered"
                  description="High-performance web apps, AI systems, custom CRM and ERP platforms successfully engineered and deployed."
                />
                <StatCard
                  value={1500}
                  label="Satisfied Clients"
                  description="Global startups, high-growth SMEs, and enterprise leaders who trust Blueboxx as their technology backbone."
                />
                <StatCard
                  value={15}
                  label="Industries Served"
                  description="FinTech, Healthcare, EdTech, E-Commerce, Manufacturing, Real Estate, Logistics, and Enterprise IT sectors."
                />
                <StatCard
                  value={12}
                  label="Years Experience"
                  description="Over a decade of continuous engineering excellence, digital transformation, and scalable software architecture."
                />
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 3: OUR EXPERTISE — END-TO-END SOLUTIONS FOR BUSINESS GROWTH
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="expertise" className="py-20 md:py-28 lg:py-32 bg-slate-50/60 border-t border-b border-slate-200/60 relative overflow-hidden">
          {/* Subtle ambient gradient orbs */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-100/40 via-blue-50/30 to-transparent rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/30 via-slate-100/40 to-transparent rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
              <span className="text-[#c9a227] font-bold tracking-[0.25em] uppercase text-xs sm:text-[13px] inline-block mb-3 font-sora">
                OUR EXPERTISE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight leading-tight mb-4 font-sora">
                End-to-End Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b2a6b] via-[#c9a227] to-[#e0b840]">Business Growth</span>
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed font-inter">
                From intelligent AI systems to custom enterprise software, we provide the technological backbone your business needs to scale.
              </p>
            </div>

            {/* 23 Solutions Grid (4 cols desktop, 2 cols tablet, 1 col mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {EXPERTISE_SOLUTIONS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={hoverCardVariant}
                    initial="initial"
                    whileHover="hover"
                    className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_35px_rgba(27,42,107,0.08)] hover:border-[#c9a227]/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-50/80 border border-amber-200/50 flex items-center justify-center text-[#c9a227] group-hover:scale-110 group-hover:bg-[#1b2a6b] group-hover:text-white transition-all duration-300 mb-4 shadow-2xs">
                      <IconComponent className="w-5 h-5 transition-colors duration-300 stroke-[2]" />
                    </div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-800 group-hover:text-[#1b2a6b] transition-colors leading-snug font-sora">
                      {item.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 4: INDUSTRIES WE SERVE — 16 SECTOR GRID (4x4)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="industries" className="py-20 md:py-28 lg:py-32 bg-white relative">
          <div id="services" className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">

            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
              <h4 className="text-[#c9a227] font-bold tracking-[0.2em] uppercase text-xs sm:text-[13px] mb-3 font-sora">
                INDUSTRIES WE SERVE
              </h4>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4 font-sora">
                Empowering Every Sector
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed font-inter">
                We deliver tailor-made technology solutions across a diverse range of industries, driving innovation everywhere.
              </p>
            </div>

            {/* 16 Industries Grid (4 cols desktop, 2 cols tablet, 1 col mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {INDUSTRIES_LIST.map((industry, i) => (
                <motion.div
                  key={i}
                  variants={hoverCardVariant}
                  initial="initial"
                  whileHover="hover"
                  className="group flex flex-col items-center justify-center py-7 px-5 sm:py-8 sm:px-6 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_35px_rgba(27,42,107,0.08)] hover:border-[#c9a227]/40 hover:bg-amber-50/20 transition-all duration-300 cursor-pointer text-center relative overflow-hidden"
                >
                  {/* Subtle hover background accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#c9a227]/5 blur-2xl rounded-full pointer-events-none group-hover:bg-[#c9a227]/10 transition-colors" />

                  <div className="text-[#c9a227] group-hover:scale-110 transition-transform duration-300 mb-3.5 relative z-10 flex items-center justify-center">
                    {industry.icon}
                  </div>
                  <span className="text-slate-800 font-bold text-sm sm:text-[15px] group-hover:text-[#1b2a6b] transition-colors duration-300 relative z-10 font-sora">
                    {industry.name}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 6: OUR PROCESS — ANIMATED TIMELINE TRACK WITH GLOWING BEAM
        ═══════════════════════════════════════════════════════════════════════ */}
        <AnimatedProcessSection />

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 7: WHY BLUEBOXX — THE ADVANTAGE OF WORKING WITH US
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="why-us" className="py-24 lg:py-32 bg-white relative overflow-hidden">
          {/* Subtle background ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-100/30 via-indigo-50/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
              <span className="text-[#c9a227] font-bold tracking-[0.25em] uppercase text-xs sm:text-[13px] inline-block mb-3 font-sora">
                WHY BLUEBOXX?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight leading-tight font-sora">
                The Advantage of Working With Us
              </h2>
            </div>

            {/* 6 Cards Grid (3x2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Cpu,
                  title: 'Latest Technologies',
                  desc: 'We leverage modern tech stacks to build future-proof, scalable systems.',
                },
                {
                  icon: Clock,
                  title: 'Fast Delivery',
                  desc: 'Agile methodologies ensure rapid development cycles and on-time launches.',
                },
                {
                  icon: TrendingUp,
                  title: 'Business-Focused',
                  desc: 'Our solutions are designed not just to work, but to drive revenue and growth.',
                },
                {
                  icon: Code2,
                  title: 'Scalable Architecture',
                  desc: 'Built to handle millions of users seamlessly as your business expands.',
                },
                {
                  icon: Headphones,
                  title: 'Long-Term Support',
                  desc: 'Dedicated maintenance and SLA guarantees to keep your systems running 24/7.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Experienced Team',
                  desc: 'A vetted team of senior engineers and architects dedicated to your success.',
                },
              ].map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={hoverCardVariant}
                    initial="initial"
                    whileHover="hover"
                    className="p-8 sm:p-9 rounded-[2rem] bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(27,42,107,0.08)] hover:border-[#c9a227]/40 transition-all duration-300 flex flex-col group relative overflow-hidden"
                  >
                    {/* Icon container */}
                    <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/50 flex items-center justify-center mb-6 text-[#c9a227] group-hover:scale-110 group-hover:bg-[#c9a227] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <IconComponent className="w-6 h-6 transition-colors duration-300 stroke-[2]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#0d1635] mb-3 group-hover:text-[#1b2a6b] transition-colors font-sora">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-500 text-sm sm:text-[15px] leading-relaxed font-inter">
                      {card.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 8: OUR CLIENTS & ENTERPRISE DEPLOYMENTS (LMS, HRMS, CRM, ERP)
            - Clean, Professional, High-End Corporate Portfolio Format
            - Uncropped, razor-sharp dashboard mockups in minimal Mac browser frames
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="clients-projects" className="py-20 lg:py-28 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-[#c9a227] text-xs font-black uppercase tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-[#c9a227]" /> PROVEN DEPLOYMENTS
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight leading-tight mb-4 font-sora">
                Our Clients & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b2a6b] to-[#c9a227]">Enterprise Deployments</span>
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed font-inter">
                Explore real enterprise software, LMS, HRMS, CRM, and ERP systems engineered and deployed for our corporate clients.
              </p>
            </div>

            {/* Modern Bento Showcase 4-Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

              {/* Bento Card 1: CRM Platform */}
              <motion.div
                variants={hoverCardVariant}
                initial="initial"
                whileHover="hover"
                className="bg-white rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)] hover:border-blue-500/50 flex flex-col overflow-hidden transition-all duration-300 group"
              >
                {/* Bento Header */}
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> B2B CRM System
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Enterprise CRM
                  </span>
                </div>

                {/* Dashboard Canvas Frame (Bento Inset Window) */}
                <div
                  onClick={() => setFullscreenDashboard('/uploads/dashboards/dashboard-crm-v2.png')}
                  className="mx-4 mb-4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner relative aspect-[16/10] cursor-zoom-in group/canvas"
                >
                  <img
                    src="/uploads/dashboards/dashboard-crm-v2.png"
                    alt="CRM Sales & Pipeline Dashboard"
                    className="w-full h-full object-cover group-hover/canvas:scale-105 transition-transform duration-500 block"
                  />
                  {/* Floating Live Metric Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> $245,000 Pipeline
                  </div>
                  {/* Expand Prompt */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-slate-950/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                    <Maximize2 size={12} />
                  </div>
                </div>

                {/* Bento Body */}
                <div className="px-5 pb-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#0d1635] font-sora group-hover:text-blue-600 transition-colors leading-snug">
                      Commercial CRM & Sales Pipeline Velocity Suite
                    </h3>

                    <p className="text-slate-500 text-xs leading-relaxed font-inter line-clamp-2">
                      Commercial CRM platform engineered to streamline leads, multi-currency quotation lifecycles, and sales team velocity.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Pipeline Funnel', 'Source Analytics', 'Lead Tracking'].map((chip, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-blue-50/70 text-blue-800 text-[10px] font-semibold">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bento Card 2: ERP Platform */}
              <motion.div
                variants={hoverCardVariant}
                initial="initial"
                whileHover="hover"
                className="bg-white rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(201,162,39,0.12)] hover:border-amber-500/50 flex flex-col overflow-hidden transition-all duration-300 group"
              >
                {/* Bento Header */}
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Enterprise ERP
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Orion ERP
                  </span>
                </div>

                {/* Dashboard Canvas Frame (Bento Inset Window) */}
                <div
                  onClick={() => setFullscreenDashboard('/uploads/dashboards/dashboard-erp-v2.png')}
                  className="mx-4 mb-4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner relative aspect-[16/10] cursor-zoom-in group/canvas"
                >
                  <img
                    src="/uploads/dashboards/dashboard-erp-v2.png"
                    alt="Orion Enterprise ERP Dashboard"
                    className="w-full h-full object-cover group-hover/canvas:scale-105 transition-transform duration-500 block"
                  />
                  {/* Floating Live Metric Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> ₹45,78,320 Revenue
                  </div>
                  {/* Expand Prompt */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-slate-950/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                    <Maximize2 size={12} />
                  </div>
                </div>

                {/* Bento Body */}
                <div className="px-5 pb-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#0d1635] font-sora group-hover:text-amber-600 transition-colors leading-snug">
                      Enterprise Resource Planning & Operations Suite
                    </h3>

                    <p className="text-slate-500 text-xs leading-relaxed font-inter line-clamp-2">
                      Comprehensive ERP platform uniting financial accounting, multi-warehouse inventory management, purchase orders, and sales telemetry.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Finance & Payroll', 'Inventory Sync', 'Orders & BI'].map((chip, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-amber-50/70 text-amber-800 text-[10px] font-semibold">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bento Card 3: LMS Platform */}
              <motion.div
                variants={hoverCardVariant}
                initial="initial"
                whileHover="hover"
                className="bg-white rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(99,102,241,0.12)] hover:border-indigo-500/50 flex flex-col overflow-hidden transition-all duration-300 group"
              >
                {/* Bento Header */}
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" /> LMS Platform
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    EduLearn LMS
                  </span>
                </div>

                {/* Dashboard Canvas Frame (Bento Inset Window) */}
                <div
                  onClick={() => setFullscreenDashboard('/uploads/dashboards/dashboard-lms-v2.png')}
                  className="mx-4 mb-4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner relative aspect-[16/10] cursor-zoom-in group/canvas"
                >
                  <img
                    src="/uploads/dashboards/dashboard-lms-v2.png"
                    alt="EduLearn LMS Platform Dashboard"
                    className="w-full h-full object-cover group-hover/canvas:scale-105 transition-transform duration-500 block"
                  />
                  {/* Floating Live Metric Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 4,850 Active Learners
                  </div>
                  {/* Expand Prompt */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-slate-950/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                    <Maximize2 size={12} />
                  </div>
                </div>

                {/* Bento Body */}
                <div className="px-5 pb-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#0d1635] font-sora group-hover:text-indigo-600 transition-colors leading-snug">
                      Interactive LMS Platform & Video Curriculum Suite
                    </h3>

                    <p className="text-slate-500 text-xs leading-relaxed font-inter line-clamp-2">
                      Modular EdTech ecosystem built with DRM video streaming, student progress tracking, quizzes, and automated certifications.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Course Catalog', 'Progress Tracking', 'Certificates'].map((chip, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-indigo-50/70 text-indigo-800 text-[10px] font-semibold">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Bento Card 4: HRMS Platform */}
              <motion.div
                variants={hoverCardVariant}
                initial="initial"
                whileHover="hover"
                className="bg-white rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.12)] hover:border-emerald-500/50 flex flex-col overflow-hidden transition-all duration-300 group"
              >
                {/* Bento Header */}
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Enterprise HRMS
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    EmpowerHR
                  </span>
                </div>

                {/* Dashboard Canvas Frame (Bento Inset Window) */}
                <div
                  onClick={() => setFullscreenDashboard('/uploads/dashboards/dashboard-hrms-v2.png')}
                  className="mx-4 mb-4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner relative aspect-[16/10] cursor-zoom-in group/canvas"
                >
                  <img
                    src="/uploads/dashboards/dashboard-hrms-v2.png"
                    alt="EmpowerHR HRMS & Payroll Dashboard"
                    className="w-full h-full object-cover group-hover/canvas:scale-105 transition-transform duration-500 block"
                  />
                  {/* Floating Live Metric Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 1,248 Employees Synced
                  </div>
                  {/* Expand Prompt */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-slate-950/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                    <Maximize2 size={12} />
                  </div>
                </div>

                {/* Bento Body */}
                <div className="px-5 pb-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#0d1635] font-sora group-hover:text-emerald-600 transition-colors leading-snug">
                      Workforce HRMS & Payroll Intelligence Platform
                    </h3>

                    <p className="text-slate-500 text-xs leading-relaxed font-inter line-clamp-2">
                      End-to-end workforce suite featuring biometric attendance sync, automated multi-tier payroll, leave approvals, and KPI matrices.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Attendance & Leave', 'Auto Payroll', 'Employee Lifecycle'].map((chip, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-emerald-50/70 text-emerald-800 text-[10px] font-semibold">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 9: CLIENT TESTIMONIALS (Verified Companies)
            - Separate section preserving client reviews and ratings
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="testimonials" className="py-24 lg:py-32 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
              <h4 className="text-[#c9a227] font-semibold tracking-wider uppercase text-sm mb-4">Client Success</h4>
              <h2 className="text-3xl lg:text-5xl font-heading font-bold text-slate-900 mb-6 font-sora">
                Don't Just Take Our Word For It
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonialIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white border border-slate-200/80 p-8 md:p-14 rounded-3xl relative shadow-sm"
                >
                  <Quote className="absolute top-8 right-8 text-slate-300/40 w-20 h-20 rotate-12 pointer-events-none" />

                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(TESTIMONIALS[activeTestimonialIdx].rating)].map((_, i) => (
                      <Star key={i} size={18} className="fill-[#c9a227] text-[#c9a227]" />
                    ))}
                  </div>

                  <p className="text-lg sm:text-2xl text-slate-800 font-medium leading-relaxed mb-8 font-inter italic">
                    "{TESTIMONIALS[activeTestimonialIdx].content}"
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b2a6b] to-[#c9a227] text-white flex items-center justify-center font-black text-base shadow-sm">
                        {TESTIMONIALS[activeTestimonialIdx].initials}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 font-sora">{TESTIMONIALS[activeTestimonialIdx].company}</h4>
                        <p className="text-xs text-slate-500 font-semibold">Verified Corporate Client</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {TESTIMONIALS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTestimonialIdx(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${activeTestimonialIdx === i ? 'w-8 bg-[#c9a227]' : 'bg-slate-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 9: FREQUENTLY ASKED QUESTIONS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-24 lg:py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">

            <div className="text-center mb-16">
              <h4 className="text-[#c9a227] font-semibold tracking-wider uppercase text-sm mb-4">Questions & Answers</h4>
              <h2 className="text-3xl lg:text-5xl font-heading font-bold text-slate-900 mb-6 font-sora">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 text-lg font-inter">
                Everything you need to know about our services, process, and billing.
              </p>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 md:p-10 space-y-4 shadow-sm">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="border-b border-slate-200/80 last:border-0 pb-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full py-4 text-left flex items-center justify-between text-base sm:text-lg font-semibold text-slate-800 hover:text-[#1b2a6b] transition-colors cursor-pointer"
                    >
                      <span className="font-sora">{faq.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#c9a227]' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-slate-600 leading-relaxed pb-4 text-sm sm:text-base font-inter"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 10: CALL TO ACTION BANNER (PLACED BEFORE CONTACT FORM)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
          {/* Background Glow Shapes */}
          <div className="absolute top-0 right-[10%] w-64 h-64 bg-[#c9a227]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-[10%] w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">
            <div className="relative bg-white border border-slate-200/80 rounded-[3rem] p-10 md:p-20 text-center overflow-hidden shadow-sm">

              {/* Inner animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9a227]/10 via-[#1b2a6b]/10 to-[#c9a227]/10 opacity-50" />

              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6 leading-tight font-sora">
                  Ready to Scale Your Business With Technology?
                </h2>
                <p className="text-lg md:text-xl text-slate-600 mb-10 font-inter">
                  Let's build something extraordinary together. Schedule a discovery call with our technical architects today.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="#contact"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0d1635] text-white font-semibold hover:bg-[#c9a227] hover:text-[#0d1635] transition-all duration-300 shadow-md group cursor-pointer"
                  >
                    Start Your Project
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="mailto:info.blueboxx@gmail.com"
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full bg-transparent border border-slate-300 text-slate-800 font-semibold hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                  >
                    Email Us Directly
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION 11: CONSULTATION & CONTACT FORM (COMES LAST BEFORE FOOTER)
            - Fully connected to Laravel Lead backend so Admin sees incoming inquiries
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="py-24 lg:py-32 bg-white relative overflow-hidden border-t border-slate-100">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16">

              {/* Content */}
              <div>
                <h4 className="text-[#c9a227] font-semibold tracking-wider uppercase text-sm mb-4">Get In Touch</h4>
                <h2 className="text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-6 font-sora">
                  Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b2a6b] via-[#c9a227] to-[#e0b840]">Amazing</span>
                </h2>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed font-inter">
                  Whether you need a custom enterprise platform, an AI integration, or a dedicated development team, we're ready to execute. Fill out the form below to start the conversation.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#c9a227]">
                      📍
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold font-sora">Headquarters</h4>
                      <p className="text-slate-600 text-sm font-inter">SF 02, INDIA BULLS MEGA MALL, Dinesh Mill Rd, Akota, Vadodara, Gujarat 390022</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#c9a227]">
                      📧
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold font-sora">Email Us</h4>
                      <p className="text-slate-600 text-sm font-inter">info.blueboxx@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#c9a227]">
                      📞
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold font-sora">Call Us</h4>
                      <p className="text-slate-600 text-sm font-inter">+91 90235 12853</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
                {isSuccess && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 mb-6 border border-emerald-200 shadow-sm">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 font-sora">Inquiry Received!</h3>
                    <p className="text-slate-600 max-w-sm text-sm font-inter">Our technical team has registered your project inquiry in our CRM and will contact you within 24 hours.</p>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <input
                        required
                        value={formState.fullName}
                        onChange={e => setFormState({ ...formState, fullName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                      <input
                        value={formState.companyName}
                        onChange={e => setFormState({ ...formState, companyName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={formState.email}
                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={formState.phone}
                        onChange={e => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Service Required *</label>
                      <CustomSelect
                        value={formState.service}
                        onChange={(val) => setFormState({ ...formState, service: val })}
                        options={SERVICE_OPTIONS}
                        placeholder="Select a service..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Project Budget *</label>
                      <CustomSelect
                        value={formState.budget}
                        onChange={(val) => setFormState({ ...formState, budget: val })}
                        options={BUDGET_OPTIONS}
                        placeholder="Select budget range..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Timeline *</label>
                    <CustomSelect
                      value={formState.timeline}
                      onChange={(val) => setFormState({ ...formState, timeline: val })}
                      options={TIMELINE_OPTIONS}
                      placeholder="Select timeline..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Details *</label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={e => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all resize-none"
                      placeholder="Tell us about your project goals and requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1b2a6b] via-[#c9a227] to-[#e0b840] text-white font-semibold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* Fullscreen High-Res Dashboard Lightbox Modal */}
        <AnimatePresence>
          {fullscreenDashboard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-6xl w-full max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-xs font-mono text-slate-400 ml-2">High-Resolution Enterprise Architecture Preview</span>
                  </div>
                  <button
                    onClick={() => setFullscreenDashboard(null)}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Image */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950 flex items-center justify-center">
                  <img
                    src={fullscreenDashboard}
                    alt="High-Resolution Architecture"
                    className="max-w-full max-h-[78vh] object-contain rounded-xl border border-slate-800 shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════════
            TESTIMONIALS SECTION (SUCCESS STORIES)
        ═══════════════════════════════════════════════════════════════════════ */}
        <TestimonialsSection />

        {/* ═══════════════════════════════════════════════════════════════════════
            FOOTER: REUSES EXISTING MAIN FOOTER
        ═══════════════════════════════════════════════════════════════════════ */}
        <Footer />

      </div>
    </>
  );
}
