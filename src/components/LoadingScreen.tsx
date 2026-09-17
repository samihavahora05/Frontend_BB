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
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    const vid = videoRef.current;
    let fallbackTimer: NodeJS.Timeout | null = null;

    if (vid) {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;

      const handleEnded = () => {
        handleDismiss();
      };

      const handleMetadata = () => {
        const durationMs = vid.duration && !isNaN(vid.duration) ? vid.duration * 1000 + 2000 : 12000;
        if (fallbackTimer) clearTimeout(fallbackTimer);
        fallbackTimer = setTimeout(handleDismiss, Math.max(durationMs, 8000));
      };

      const handleCanPlay = () => {
        vid.play().catch(() => {
          // Retry
          setTimeout(() => vid.play().catch(() => {}), 200);
        });
      };

      vid.addEventListener("ended", handleEnded);
      vid.addEventListener("loadedmetadata", handleMetadata);
      vid.addEventListener("canplay", handleCanPlay);

      // Trigger play immediately
      vid.play().catch(() => {});

      // Generous fallback timer so slow connections have time to buffer
      fallbackTimer = setTimeout(handleDismiss, 12000);

      return () => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        vid.removeEventListener("ended", handleEnded);
        vid.removeEventListener("loadedmetadata", handleMetadata);
        vid.removeEventListener("canplay", handleCanPlay);
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
        }
      };
    } else {
      fallbackTimer = setTimeout(handleDismiss, 4000);
      return () => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
      };
    }
  }, [mounted]);

  const { settings } = useGlobalSettings();
  const preloaderSettings = settings?.preloader || {};
  const isEnabled = preloaderSettings?.isEnabled !== false && preloaderSettings?.isEnabled !== "false";

  if (!mounted || !show || !isEnabled) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out cursor-pointer overflow-hidden ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-full max-w-5xl lg:max-w-6xl max-h-[82vh] px-6 flex items-center justify-center">
        <video
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
              el.playsInline = true;
              videoRef.current = el;
            }
          }}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="w-full h-auto max-h-[78vh] object-contain scale-90 md:scale-95"
          style={{
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 95%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 95%)",
          }}
          onError={() => {
            handleDismiss();
          }}
        >
          <source src="/loading.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Skip button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute bottom-6 right-6 z-10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white border border-slate-200/60 rounded-full shadow-sm backdrop-blur-sm transition-all"
      >
        Skip
      </button>
    </div>
  );
};
