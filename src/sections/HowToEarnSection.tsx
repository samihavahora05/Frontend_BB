import React from 'react';

export const HowToEarnSection = () => {
  return (
    <div className="py-16 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      {/* Background Gradients & Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B2A6B] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C9A227] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B2A6B] to-[#C9A227]">Earn With Us</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed">
            Sarvakshetra isn't just about learning – it's about creating real income opportunities. Here's how you can leverage our platform to earn while you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.08)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-36 overflow-hidden bg-slate-100 relative">
              <div className="absolute inset-0 bg-[#1B2A6B]/10 z-10 mix-blend-multiply transition-opacity duration-300 opacity-100 group-hover:opacity-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600" 
                alt="Join Our Network" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[50%] group-hover:grayscale-0"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-[#1B2A6B] transition-colors mb-2">1. Join Our Network</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Create your account and get access to our community of learners, mentors, and companies offering tasks and projects.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.08)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-36 overflow-hidden bg-slate-100 relative">
              <div className="absolute inset-0 bg-[#C9A227]/10 z-10 mix-blend-multiply transition-opacity duration-300 opacity-100 group-hover:opacity-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                alt="Take Projects & Tasks" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[50%] group-hover:grayscale-0"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-[#1B2A6B] transition-colors mb-2">2. Take Projects & Tasks</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Browse available tasks, internships, or live projects. Apply or participate directly and complete them to earn rewards or stipends.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.08)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-36 overflow-hidden bg-slate-100 relative">
              <div className="absolute inset-0 bg-[#1B2A6B]/10 z-10 mix-blend-multiply transition-opacity duration-300 opacity-100 group-hover:opacity-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" 
                alt="Get Paid & Grow" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[50%] group-hover:grayscale-0"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-[#1B2A6B] transition-colors mb-2">3. Get Paid & Grow</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Receive payments, rewards, or certificates for completed work. Build your portfolio and increase your earning potential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
