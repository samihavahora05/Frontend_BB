"use client";
import { useState, useEffect, useRef } from "react";
import { useGlobalSettings } from "../contexts/SettingsContext";
import { PreloaderAnimation } from "./ui/PreloaderAnimation";

export const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleDismiss = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
      if (onComplete) onComplete();
    }, 1000);
  };

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenLoader");
    if (hasSeen) {
      setIsFirstVisit(false);
      // Fast dismiss for returning users in same session
      setFadeOut(true);
      setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 500);
    } else {
      setIsFirstVisit(true);
      sessionStorage.setItem("hasSeenLoader", "true");
      
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      const vid = videoRef.current;
      let onEnded: (() => void) | null = null;
      if (vid) {
        onEnded = () => {
          handleDismiss();
        };
        vid.addEventListener('ended', onEnded);
      }

      return () => {
        clearTimeout(timer);
        if (vid && onEnded) vid.removeEventListener('ended', onEnded);
        document.body.style.overflow = "";
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { settings } = useGlobalSettings();
  const preloaderSettings = settings?.preloader || {};
  const isEnabled = preloaderSettings?.isEnabled !== 'false';

  if (!show || !isEnabled) return null;

  // Don't render until we know it's first visit to prevent flash
  if (isFirstVisit === null) return null;

  if (!isFirstVisit) {
    return (
      <div 
        className={`fixed inset-0 z-[99999] transition-opacity duration-700 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
      >
        <PreloaderAnimation 
          selectedType={preloaderSettings?.selectedType || 'Blueboxx Logo Animation'}
          animationSpeed={preloaderSettings?.animationSpeed || 'Medium'}
          accentColor={preloaderSettings?.accentColor || '#1B2A6B'}
          bgColor={preloaderSettings?.bgColor || '#ffffff'}
          loadingText={preloaderSettings?.loadingText || 'Preparing Your Learning Experience...'}
        />
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-all duration-1000 ease-in-out`}
      style={{
        clipPath: fadeOut ? "circle(0% at 100% 0%)" : "circle(150% at 100% 0%)",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <div className="relative w-[90%] max-w-6xl aspect-video flex items-center justify-center bg-white">
        <video
          ref={videoRef}
          src="/loading.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-contain"
          onError={(e) => {
            // Dismiss immediately on error
            console.error("Loading video failed to load", e);
            handleDismiss();
          }}
        />
      </div>
    </div>
  );
};
