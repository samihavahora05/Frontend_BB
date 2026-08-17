import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  Heart
} from "lucide-react";
// import useSWR from "swr";
// import api from "../lib/axios";
import { localTestimonials, LocalTestimonial } from "../data/testimonials";

const renderContent = (text: string, highlight: string) => {
  if (!highlight) return text;
  const parts = text.split(highlight);
  if (parts.length < 2) return text;
  return (
    <>
      {parts[0]}
      <span className="text-[#C9A227] font-semibold">{highlight}</span>
      {parts[1]}
    </>
  );
};

export const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  useInView(containerRef, { once: true, margin: "-100px" });

  // --- API IMPLEMENTATION (Commented out for now) ---
  // const fetcher = (url: string) => api.get(url).then(res => res.data.data);
  // const { data: testimonialsData, error } = useSWR('/public/testimonials-cms', fetcher, { revalidateOnFocus: false });
  // const currentTestimonials = testimonialsData?.length ? testimonialsData : testimonials;

  // --- LOCAL IMPLEMENTATION ---
  const [testimonialsData, setTestimonialsData] = useState<LocalTestimonial[] | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Simulate instant API response using local data
    try {
      setTestimonialsData(localTestimonials);
    } catch (err) {
      setError(err);
    }
  }, []);

  const currentTestimonials = useMemo(() => testimonialsData || [], [testimonialsData]);

  useEffect(() => {
    if (!isAutoPlaying || !currentTestimonials.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % currentTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, currentTestimonials]);

  if (error) return <div className="py-20 text-center text-red-500">Error loading testimonials: {error.message}</div>;
  if (!testimonialsData) return <div className="py-20 text-center text-slate-500">Loading testimonials...</div>;
  if (!currentTestimonials.length) return <div className="py-20 text-center text-slate-500">No active testimonials found in the database.</div>;

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c - 1 + currentTestimonials.length) % currentTestimonials.length);
  };

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c + 1) % currentTestimonials.length);
  };

  return (
    <section ref={containerRef} className="py-[120px] bg-gradient-to-b from-white via-blue-50/15 to-white text-slate-900 overflow-hidden relative border-b border-[#E5E7EB]">
      {/* Soft Blur Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[5%] w-[350px] h-[350px] rounded-full bg-blue-200/20 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full bg-purple-100/30 blur-[100px]" />
      </div>

      {/* Floating Sparkle Element - Left */}
      <div className="absolute left-6 lg:left-16 top-[180px] hidden md:flex flex-col items-center z-10 pointer-events-none">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-blue-400"
        >
          <Sparkles size={24} />
        </motion.div>
      </div>

      {/* Floating Paper Airplane Element - Right */}
      <div className="absolute right-6 lg:right-16 top-[150px] hidden md:flex flex-col items-center z-10 pointer-events-none">
        <motion.div
          animate={{ y: [0, 6, 0], x: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-blue-400 relative"
        >
          <Send size={24} className="rotate-45" />
          <svg className="absolute top-8 right-4 text-blue-200 w-24 h-16" viewBox="0 0 100 60" fill="none">
            <path d="M90 5 C50 20, 20 35, 5 55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#1B2A6B]/15 bg-[#1B2A6B]/5 text-[#1B2A6B] text-xs font-semibold mb-5 shadow-sm">
            <Heart size={13} className="text-[#1B2A6B] fill-[#1B2A6B]/10" />
            <span>REAL REVIEWS, REAL IMPACT</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0d1635] tracking-tight leading-tight mb-4 font-sora">
            Our <span className="text-[#C9A227]">Success</span> Stories
          </h2>
          <p className="text-base text-[#4a5568] font-inter">
            Hear from our students, interns, and employees about their journey with Blueboxx DA.
          </p>
        </div>

        {/* Testimonials Slider Wrapper */}
        <div className="max-w-4xl mx-auto relative px-4">

          {/* Left Arrow (Outer) */}
          <button
            onClick={prev}
            aria-label="Previous Testimonial"
            className="absolute -left-6 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.08)] flex items-center justify-center text-slate-700 hover:text-blue-600 hover:border-blue-100 transition-all z-30 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow (Outer) */}
          <button
            onClick={next}
            aria-label="Next Testimonial"
            className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.08)] flex items-center justify-center text-slate-700 hover:text-blue-600 hover:border-blue-100 transition-all z-30 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>

          {/* Testimonial Card — Navy+Gold Gradient Background */}
          <div className="rounded-[2.5rem] border border-[#1B2A6B]/15 p-8 md:p-14 shadow-[0_20px_60px_rgba(27,42,107,0.10)] relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d1635 0%, #1B2A6B 45%, #1e3170 100%)",
            }}
          >
            {/* Gold dot pattern */}
            <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#C9A227 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            {/* Gold top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.15),transparent_70%)] pointer-events-none" />
            {/* Visual Quotes Shapes in Corners */}
            <span className="text-[#C9A227]/20 text-[180px] font-serif absolute -top-10 -left-2 leading-none select-none pointer-events-none">"</span>
            <span className="text-[#C9A227]/10 text-[220px] font-serif absolute -bottom-36 -right-2 leading-none select-none pointer-events-none">"</span>

            <div className="relative min-h-[200px] flex items-center z-10">
              {currentTestimonials.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full"
                  >
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-5">
                      {Array.from({ length: currentTestimonials[current].rating || 5 }).map((_, i) => (
                        <Star key={i} size={15} className="fill-[#C9A227] text-[#C9A227]" />
                      ))}
                    </div>

                    {/* Quote Paragraph */}
                    <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed mb-8 font-inter">
                      "{renderContent(currentTestimonials[current].review, '')}"
                    </p>

                    {/* Profile Block */}
                    <div className="flex items-center gap-4">
                      {currentTestimonials[current].image_url && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                          <img src={currentTestimonials[current].image_url} alt={currentTestimonials[current].name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-white text-base leading-tight font-sora">{currentTestimonials[current].name}</div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {currentTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIsAutoPlaying(false); setCurrent(i); }}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-[#1B2A6B]" : "w-2 bg-slate-200"
                  }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
