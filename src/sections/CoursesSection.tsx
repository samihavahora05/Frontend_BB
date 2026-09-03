import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "../animations/variants";
import { Star, Clock, Users, ArrowRight, Code } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TiltCard } from "../components/ui/TiltCard";
import useSWR from "swr";
import api from "../lib/axios";




const getImageUrl = (path: string | null) => {
  if (!path) return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=240&fit=crop&auto=format";
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (cleanPath.startsWith('storage/')) {
    return `${backendUrl}/${cleanPath}`;
  }
  return `${backendUrl}/storage/${cleanPath}`;
};

const normalizeCourses = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.data?.data)) return data.data.data;
  if (Array.isArray(data.courses)) return data.courses;
  if (Array.isArray(data.data?.courses)) return data.data.courses;
  return [];
};

export const CoursesSection = () => {
  const fetcher = async (url: string) => {
    try {
      const res = await api.get(url);
      if (res?.data) return res.data;
    } catch (e) {}
    try {
      const fallback = await api.get('/courses');
      if (fallback?.data) return fallback.data;
    } catch (e) {}
    try {
      const adminFallback = await api.get('/admin/courses?per_page=10');
      if (adminFallback?.data) return adminFallback.data;
    } catch (e) {}
    return { data: [] };
  };
  const { data: rawCourses, isLoading } = useSWR('/public/courses', fetcher, { revalidateOnFocus: true });
  const allCourses = normalizeCourses(rawCourses);
  const currentCourses = allCourses.slice(0, 3);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg,#f0f4ff 0%,#eef2ff 60%,#f4f6ff 100%)" }}>
      {/* Fine grid lines */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(rgba(27,42,107,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,42,107,0.06) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      {/* Top-left navy glow */}
      <div aria-hidden className="absolute -top-20 -left-20 w-[500px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at top left,rgba(27,42,107,0.10),transparent 65%)" }} />
      {/* Bottom-right gold glow */}
      <div aria-hidden className="absolute -bottom-20 -right-20 w-[500px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at bottom right,rgba(201,162,39,0.10),transparent 65%)" }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div className="max-w-xl">
            <motion.p variants={fadeInUp} className="text-xs font-bold tracking-widest uppercase text-[#C9A227] mb-3">
              Programs
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#0d1635] mb-3">
              Industry-Aligned Courses
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-[#4a5568]">
              Curriculum built with top companies. Learn. Build. Get Hired.
            </motion.p>
          </div>
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shrink-0 border-2 border-[#1B2A6B] text-[#1B2A6B] hover:bg-[#1B2A6B] hover:text-white transition-all duration-200"
            >
              View All Programs <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[420px]">
                <div className="w-full h-44 bg-slate-200"></div>
                <div className="p-5 flex flex-col h-full gap-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="flex gap-4 mt-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentCourses.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto style-preserve-3d perspective-1000"
          >
            {currentCourses.map((course: any) => (
              <motion.div
                key={course.id}
                variants={fadeInUp}
              >
                <TiltCard>
                  <div className="group card-premium overflow-hidden flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200">
                    {/* Course Image Banner */}
                    <Link href={`/courses/${course.slug || course.id}`} className="relative h-44 overflow-hidden block">
                      <img
                        src={getImageUrl(course.thumbnail || course.image)}
                        alt={course.title || "Course thumbnail"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e: any) => { e.currentTarget.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=240&fit=crop&auto=format"; }}
                      />
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 opacity-75"
                        style={{
                          background: `linear-gradient(135deg, ${course.accentFrom || '#1B2A6B'}cc, ${course.accentTo || '#2E45A3'}88)`,
                        }}
                      />
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm bg-white/90 ${course.badgeColor || 'text-indigo-700 bg-indigo-50 border border-indigo-200'}`}>
                          {course.badge || course.course_type || 'Course'}
                        </span>
                      </div>
                      {/* Rating */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[#0d1635]">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{course.rating || '4.8'}</span>
                      </div>
                      {/* Icon floating */}
                      <div className="absolute bottom-3 left-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
                          {course.icon ? <course.icon size={18} /> : <Code size={18} />}
                        </div>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <Link href={`/courses/${course.slug}`}>
                        <h3 className="text-base font-bold text-[#0d1635] mb-3 group-hover:text-[#1B2A6B] transition-colors duration-200 leading-snug">
                          {course.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-4 text-xs text-[#4a5568] mb-4">
                        <span className="flex items-center gap-1.5"><Clock size={13} /> {course.duration || 'Flexible'}</span>
                        <span className="flex items-center gap-1.5"><Users size={13} /> {course.students || '500+'}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(course.tags || ['Premium', 'Certificate'])?.map((tag: string) => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#1B2A6B]/6 text-[#1B2A6B] border border-[#1B2A6B]/12">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#0d1635]">₹{course.discount_price || course.price}</span>
                          {course.discount_price && course.discount_price !== course.price && (
                             <span className="text-sm text-[#94a3b8] line-through">₹{course.price}</span>
                          )}
                        </div>
                        <motion.div
                          whileHover={{ x: 3 }}
                        >
                          <Link href="/checkout" className="flex items-center gap-1.5 text-sm font-semibold text-[#1B2A6B] hover:text-[#C9A227] transition-colors duration-200">
                            Enroll <ArrowRight size={14} />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-md border border-white shadow-xl rounded-3xl p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Code size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#0d1635] mb-3">Courses coming soon</h3>
            <p className="text-[#4a5568] mb-8">We are crafting industry-leading programs with top professionals. Stay tuned for our upcoming curriculum.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white border border-[#1B2A6B]/10 text-[#1B2A6B] shadow-sm hover:shadow-md transition-all duration-200"
            >
              Read our Tech Blog
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};
