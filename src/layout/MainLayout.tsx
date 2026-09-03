import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CustomCursor } from "../components/CustomCursor";
import { ScrollProgressBar } from "../components/ScrollProgressBar";
import { FloatingActions } from "../components/FloatingActions";
import { pageVariants } from "../animations/variants";
import { useLenis } from "../hooks/useLenis";
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[-1] bg-slate-50 overflow-hidden">
    <motion.div 
      animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: 'linear-gradient(to right, #1B2A6B 1px, transparent 1px), linear-gradient(to bottom, #1B2A6B 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
    <motion.div 
      animate={{ x: [0, 100, -50, 0], y: [0, -100, 50, 0], scale: [1, 1.2, 0.8, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]"
    />
    <motion.div 
      animate={{ x: [0, -100, 50, 0], y: [0, 100, -50, 0], scale: [1, 1.5, 0.9, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-amber-400/20 rounded-full blur-[120px]"
    />
  </div>
);

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useLenis(); // Initialise smooth scroll

  return (
    <div className="flex flex-col min-h-screen text-foreground relative">
      <AnimatedBackground />
      {/* Global UI */}
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />

      {/* Page transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={router.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 flex flex-col relative"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
      <FloatingActions />
    </div>
  );
};
