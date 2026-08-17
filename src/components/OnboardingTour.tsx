import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ steps, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  useEffect(() => {
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        setTargetRect(el.getBoundingClientRect());
      }, 350);
    } else {
      setTargetRect(null);
    }
  }, [currentStep, step.target]);

  const handleNext = () => {
    if (isLast) onComplete();
    else setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => setCurrentStep((s) => s - 1);

  // Tooltip positioning
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
    const pos = step.position || "bottom";
    const margin = 16;
    const tooltipW = 320;
    if (pos === "bottom") return { top: targetRect.bottom + margin + window.scrollY, left: Math.min(targetRect.left, window.innerWidth - tooltipW - margin) };
    if (pos === "top") return { bottom: window.innerHeight - targetRect.top + margin, left: Math.min(targetRect.left, window.innerWidth - tooltipW - margin) };
    if (pos === "right") return { top: targetRect.top + window.scrollY, left: targetRect.right + margin };
    return { top: targetRect.top + window.scrollY, right: window.innerWidth - targetRect.left + margin };
  };

  // Spotlight cutout around target element
  const spotlight = targetRect
    ? {
        top: targetRect.top + window.scrollY - 8,
        left: targetRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
      }
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Dark overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/70 pointer-events-auto"
          onClick={onSkip}
        />

        {/* Spotlight cutout */}
        {spotlight && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute rounded-2xl ring-4 ring-[#C9A227] shadow-[0_0_0_9999px_rgba(13,22,53,0.75)] pointer-events-none z-10"
            style={spotlight}
          />
        )}

        {/* Tooltip Card */}
        <motion.div
          key={`tooltip-${currentStep}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute z-20 w-80 bg-white rounded-2xl shadow-2xl p-5 pointer-events-auto"
          style={getTooltipStyle()}
        >
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-6 bg-[#C9A227]" : i < currentStep ? "w-3 bg-[#1B2A6B]" : "w-3 bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Step counter */}
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
            Step {currentStep + 1} of {steps.length}
          </span>

          <h3 className="text-lg font-black text-slate-800 mt-1 mb-2">{step.title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5">{step.description}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              <X size={12} /> Skip Tour
            </button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="h-9 px-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="h-9 px-4 rounded-xl bg-[#1B2A6B] text-white text-sm font-bold hover:bg-[#0d1635] transition-colors flex items-center gap-1"
              >
                {isLast ? "Finish" : <><span>Next</span><ArrowRight size={14} /></>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
