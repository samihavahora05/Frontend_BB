import { useEffect } from "react";

/**
 * Smooth scroll using native CSS — no external dependency needed.
 * If @studio-freight/lenis is ever installed, swap this out.
 */
export const useLenis = () => {
  useEffect(() => {
    // Enable smooth scrolling natively
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
};
