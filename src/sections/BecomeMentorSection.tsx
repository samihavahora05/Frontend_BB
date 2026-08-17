import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export const BecomeMentorSection = ({ onBecomeMentor }: { onBecomeMentor?: () => void }) => {
  return (
    <div className="bg-[#0d1635] text-white py-24 relative overflow-hidden">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1635] via-[#0d1635]/80 to-transparent z-0" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Become a Mentor</h2>
            <p className="text-lg text-slate-300 max-w-lg">
              Share your industry experience, guide aspiring learners, and make a real impact. Join our growing network of experts mentoring the next generation.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                "Conduct 1-on-1 mentorship & live sessions",
                "Get paid for your time & expertise",
                "Build your personal brand & credibility"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#C9A227] flex-shrink-0" size={24} />
                  <span className="font-bold text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <Button onClick={onBecomeMentor} className="bg-transparent border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0d1635] font-black h-14 rounded-full px-10 transition-all uppercase tracking-wider">
                Apply as a Mentor
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-[500px]">
            <div className="bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-black text-slate-900 mb-4">Who Can Become a Mentor?</h3>
              <p className="text-slate-600 mb-8 font-semibold">
                We are looking for professionals with real-world experience who are passionate about teaching and mentoring.
              </p>
              
              <ul className="space-y-4 text-slate-700 font-bold">
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#C9A227] before:rounded-full">
                  Working professionals & industry experts
                </li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#C9A227] before:rounded-full">
                  Startup founders & freelancers
                </li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#C9A227] before:rounded-full">
                  Senior developers, designers & marketers
                </li>
                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#C9A227] before:rounded-full">
                  Professionals with 2+ years experience
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
