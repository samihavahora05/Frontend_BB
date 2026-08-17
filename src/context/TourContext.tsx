import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  steps: TourStep[];
  startTour: (tourId: string, steps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);

  const startTour = (tourId: string, tourSteps: TourStep[]) => {
    const hasCompleted = localStorage.getItem(`tour_completed_${tourId}`);
    if (hasCompleted) return; // Don't start if already completed

    setSteps(tourSteps);
    setCurrentStepIndex(0);
    setActiveTourId(tourId);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const endTour = () => {
    setIsActive(false);
    if (activeTourId) {
      localStorage.setItem(`tour_completed_${activeTourId}`, 'true');
    }
    setSteps([]);
    setCurrentStepIndex(0);
    setActiveTourId(null);
  };

  return (
    <TourContext.Provider value={{ isActive, currentStepIndex, steps, startTour, nextStep, prevStep, endTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
