import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface AnimatedContentProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  className?: string;
  as?: "div" | "tr" | "li" | "span";
  onClick?: (e?: any) => void;
  id?: string;
}

export const AnimatedContent: React.FC<AnimatedContentProps> = ({ 
  children, 
  direction = "up", 
  delay = 0, 
  className = "",
  as = "div",
  onClick,
  id
}) => {
  const directionOffset = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initial = { 
    opacity: 0, 
    ...directionOffset[direction] 
  };

  const animate = { 
    opacity: 1, 
    x: 0, 
    y: 0 
  };

  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent
      id={id}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
      onClick={onClick}
    >
      {children}
    </MotionComponent>
  );
};
