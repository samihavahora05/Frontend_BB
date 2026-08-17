import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../../context/TourContext';
import { Button } from './Button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingTourProps {
  tourId?: string;
  steps?: Array<{ targetId: string; title: string; content: string }>;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const OnboardingTour = (_props?: OnboardingTourProps) => {
  const { isActive, currentStepIndex, steps, nextStep, prevStep, endTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = steps[currentStepIndex];

  const updateTargetRect = useCallback(() => {
    if (!isActive || !currentStep) return;
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      // Add a small padding around the element
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16,
        bottom: rect.bottom + 8,
        right: rect.right + 8,
        x: rect.x - 8,
        y: rect.y - 8,
        toJSON: () => {}
      });
      // Scroll element into view smoothly if it's not fully visible
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect);
    };
  }, [updateTargetRect]);

  if (!isActive || !currentStep || !targetRect) return null;

  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Determine Tooltip Position
  let tooltipStyle: any = { top: targetRect.bottom + 16, left: targetRect.left };
  if (currentStep.placement === 'top') {
    tooltipStyle = { top: targetRect.top - 200, left: targetRect.left };
  } else if (currentStep.placement === 'left') {
    tooltipStyle = { top: targetRect.top, left: targetRect.left - 340 };
  } else if (currentStep.placement === 'right') {
    tooltipStyle = { top: targetRect.top, left: targetRect.right + 16 };
  }

  // Ensure tooltip stays in viewport
  if (tooltipStyle.left && (tooltipStyle.left as number) + 320 > window.innerWidth) {
    tooltipStyle.left = window.innerWidth - 340;
  }
  if (tooltipStyle.top && (tooltipStyle.top as number) < 0) {
    tooltipStyle.top = 16;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* The Spotlight (Using box-shadow technique for massive cut-out) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute rounded-xl pointer-events-auto shadow-[0_0_0_9999px_rgba(13,22,53,0.85)]"
        />

        {/* The Tooltip Card */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1, ...tooltipStyle }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-4 bg-[#C9A227]' : i < currentStepIndex ? 'w-2 bg-[#1B2A6B]' : 'w-2 bg-slate-200'}`} />
              ))}
            </div>
            <button onClick={endTour} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-black text-slate-800 mb-2">{currentStep.title}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={endTour}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip Tour
            </button>
            
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button onClick={prevStep} className="h-9 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
                  <ChevronLeft size={16} />
                </Button>
              )}
              <Button onClick={nextStep} className="h-9 px-4 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-sm shadow-md shadow-[#1B2A6B]/20">
                {isLastStep ? 'Finish' : 'Next'} <ChevronRight size={16} className={isLastStep ? 'hidden' : 'ml-1'} />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
