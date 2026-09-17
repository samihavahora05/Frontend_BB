import { useState, useEffect, useRef } from "react";
import { useGlobalSettings } from "../contexts/SettingsContext";

export const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleDismiss = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
      if (onComplete) onComplete();
    }, 500);
  };

  useEffect(() => {
    setMounted(true);
    try {
      const hasSeen = typeof window !== "undefined" ? sessionStorage.getItem("hasSeenLoader") : null;
      if (hasSeen) {
        setShow(false);
        if (onComplete) onComplete();
        return;
      }

      sessionStorage.setItem("hasSeenLoader", "true");

      const vid = videoRef.current;
      let onEnded: (() => void) | null = null;
      let fallbackTimer: any = null;

      if (vid) {
        onEnded = () => {
          handleDismiss();
        };
        vid.addEventListener('ended', onEnded);
        
        // Play the video and let it complete naturally
        vid.play().catch(() => {
          fallbackTimer = setTimeout(handleDismiss, 3000);
        });

        // Safety fallback timer (6s) only if video stalls
        fallbackTimer = setTimeout(handleDismiss, 6000);
      } else {
        fallbackTimer = setTimeout(handleDismiss, 3000);
      }

      return () => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        if (vid && onEnded) vid.removeEventListener('ended', onEnded);
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
      };
    } catch {
      setShow(false);
    }
  }, []);

  const { settings } = useGlobalSettings();
  const preloaderSettings = settings?.preloader || {};
  const isEnabled = preloaderSettings?.isEnabled !== 'false';

  if (!mounted || !show || !isEnabled) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out cursor-pointer ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-[90%] max-w-xl aspect-video flex items-center justify-center bg-white">
        <video
          ref={videoRef}
          src="/loading.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-contain"
          onError={() => {
            handleDismiss();
          }}
        />
      </div>
    </div>
  );
};
