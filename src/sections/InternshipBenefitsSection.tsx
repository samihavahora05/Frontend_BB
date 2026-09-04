import { getImageUrl } from "../lib/imageUtils";
import React from "react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Structured Courses",
    description: "Step-by-step learning with practical assignments for real-world knowledge.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    alt: "Structured Courses"
  },
  {
    title: "1-on-1 Mentorship",
    description: "Personal sessions with industry mentors to guide your career growth.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    alt: "1-on-1 Mentorship"
  },
  {
    title: "Live Projects",
    description: "Work on real company projects and build a professional portfolio.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    alt: "Live Projects"
  },
  {
    title: "Community Access",
    description: "Be part of a strong network of learners, mentors, and recruiters.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    alt: "Community Access"
  },
  {
    title: "Contests & Rewards",
    description: "Showcase your skills, win rewards, and get noticed by companies.",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
    alt: "Contests & Rewards"
  },
  {
    title: "Placement Assistance",
    description: "Resume building, mock interviews, and direct job opportunities.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    alt: "Placement Assistance"
  }
];

export const InternshipBenefitsSection = () => {
  return (
    <section className="py-20 bg-slate-50/60 border-t border-slate-200/50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight font-sora"
          >
            Exclusive <span className="text-[#10b981]">Benefits</span> for You
          </motion.h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group"
            >
              <div className="w-full h-52 overflow-hidden rounded-2xl bg-slate-100 relative">
                <img 
                  src={getImageUrl(item.image)} 
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="pt-6 pb-2 text-center flex-1 flex flex-col justify-between">
                <h3 className="text-xl font-black text-slate-900 mb-2.5 tracking-tight group-hover:text-[#1B2A6B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
