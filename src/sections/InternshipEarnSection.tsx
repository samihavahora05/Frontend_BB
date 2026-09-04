import { getImageUrl } from "../lib/imageUtils";
import React from "react";
import { motion } from "framer-motion";

const earnSteps = [
  {
    step: "1. Join Our Network",
    description: "Create your account and get access to our community of learners, mentors, and companies offering tasks and projects.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    alt: "Join Our Network"
  },
  {
    step: "2. Take Projects & Tasks",
    description: "Browse available tasks, internships, or live projects. Apply or participate directly and complete them to earn rewards or stipends.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    alt: "Take Projects & Tasks"
  },
  {
    step: "3. Get Paid & Grow",
    description: "Receive payments, rewards, or certificates for completed work. Build your portfolio and increase your earning potential.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    alt: "Get Paid & Grow"
  }
];

export const InternshipEarnSection = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-200/50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0d1635] tracking-tight mb-4 font-sora"
          >
            How to <span className="text-[#10b981]">Earn With Us</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-base md:text-lg leading-relaxed"
          >
            Blueboxx DA isn't just about learning – it's about creating real income opportunities. Here's how you can leverage our platform to earn while you grow:
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {earnSteps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
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

              <div className="pt-6 pb-2 text-left flex-1 flex flex-col justify-start">
                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-[#1B2A6B] transition-colors">
                  {item.step}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
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
