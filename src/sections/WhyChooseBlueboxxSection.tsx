import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export const WhyChooseBlueboxxSection = () => {
  const highlights = [
    "Industry-Driven Learning",
    "Mentorship from Experts",
    "Proven Track Record",
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Why Choose <span className="text-[#2563EB]">Blueboxx?</span>
            </h2>
            
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
              Blueboxx is more than just a learning platform – it&apos;s a career accelerator. With industry experts, live projects, and placement opportunities, we transform learners into professionals ready for tomorrow.
            </p>

            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-emerald-500 bg-emerald-50 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  </div>
                  <span className="font-semibold text-slate-800 text-base sm:text-lg">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Poster Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-50">
              <img
                src="/images/superpower.jpg"
                alt="What do you think ur superpower is?"
                className="w-full h-auto object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
