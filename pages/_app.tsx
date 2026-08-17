import type { AppProps } from "next/app";
import { ThemeProvider } from "../src/context/ThemeContext";
import { AuthProvider } from "../src/context/AuthContext";
import { MockDataProvider } from "../src/context/MockDataContext";
import { ConfirmProvider } from "../src/context/ConfirmContext";
import { TourProvider } from "../src/context/TourContext";
import { SettingsProvider } from "../src/contexts/SettingsContext";
import { OnboardingTour } from "../src/components/ui/OnboardingTour";
import { ScholarshipPopup } from "../src/components/ScholarshipPopup";
import "../src/index.css";
import { LoadingScreen } from "../src/components/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { SEO } from "../src/components/seo/SEO";

function generateDynamicTitle(path: string) {
  if (!path || path === "/") return "Blueboxx DA | Premium IT Training Institute & EdTech Platform";
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (!lastSegment) return "Blueboxx DA | Premium IT Training Institute & EdTech Platform";
  
  // Format slug: "admin-dashboard" -> "Admin Dashboard"
  const formatted = lastSegment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
    
  return `${formatted} | Blueboxx DA`;
}

// Pages where the scholarship popup should NOT appear
const AUTH_PAGES = [
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/verify-email",
];

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // We no longer block rendering for the loading screen. 
  // It handles its own overlay independently.

  const isAuthPage = AUTH_PAGES.some(
    (path) => router.pathname === path || router.pathname.startsWith(path + "/")
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <ConfirmProvider>
          <TourProvider>
            <SettingsProvider>
              <MockDataProvider>
                <Toaster position="bottom-right" />
                <OnboardingTour />
                <SEO title={generateDynamicTitle(router.asPath)} useDynamic={true} />
                {/* Only show ScholarshipPopup on non-auth pages */}
                {!isAuthPage && <ScholarshipPopup />}
                <LoadingScreen />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={router.pathname}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.45,
                          ease: "easeOut",
                          when: "beforeChildren",
                          staggerChildren: 0.1
                        }
                      },
                      exit: {
                        opacity: 0,
                        transition: { duration: 0.3, ease: "easeIn" }
                      }
                    }}
                    className="min-h-screen relative"
                  >
                    <Component {...pageProps} />
                  </motion.div>
                </AnimatePresence>
              </MockDataProvider>
            </SettingsProvider>
          </TourProvider>
        </ConfirmProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
