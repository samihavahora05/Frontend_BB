import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[5px] z-[9997] origin-left shadow-md shadow-[#C9A227]/20"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #1B2A6B, #C9A227, #e0b840)",
      }}
    />
  );
};
