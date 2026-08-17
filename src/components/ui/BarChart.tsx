import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ChartDataPoint = {
  label: string;
  value: number;
};

interface BarChartProps {
  data: ChartDataPoint[];
  title?: string;
  color?: string; // hex color for the bars e.g. '#1B2A6B'
  prefix?: string;
  suffix?: string;
  height?: number;
}

export function BarChart({ 
  data, 
  title, 
  color = '#1B2A6B', 
  prefix = '', 
  suffix = '',
  height = 250
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Find max value to calculate relative heights
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
  
  // Y-axis ticks (0, max/2, max)
  const yTicks = [maxValue, Math.round(maxValue / 2), 0];

  return (
    <div className="w-full flex flex-col" style={{ height: height + (title ? 40 : 0) }}>
      {title && (
        <h3 className="text-sm font-black text-slate-800 mb-4">{title}</h3>
      )}
      
      <div className="flex-1 flex gap-4 relative">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between items-end text-[10px] font-bold text-slate-400 py-6 pr-2 border-r border-slate-100">
          {yTicks.map((tick, i) => (
            <span key={i}>{prefix}{tick}{suffix}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 flex justify-between items-end relative pb-6 h-full">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none">
            <div className="w-full h-px bg-slate-100"></div>
            <div className="w-full h-px bg-slate-100"></div>
            <div className="w-full h-px bg-slate-200"></div>
          </div>

          {/* Bars */}
          {data.map((point, index) => {
            const heightPercentage = (point.value / maxValue) * 100;
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={index}
                className="relative flex flex-col items-center flex-1 h-full justify-end group z-10 px-1 sm:px-2"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-20"
                    >
                      {prefix}{point.value}{suffix}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated Bar */}
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${heightPercentage}%`, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 50, damping: 15 }}
                  className="w-full max-w-[40px] rounded-t-sm transition-opacity duration-300"
                  style={{ 
                    backgroundColor: color,
                    opacity: hoveredIndex !== null && !isHovered ? 0.3 : 1
                  }}
                />
                
                {/* X-Axis Label */}
                <span className="absolute top-full mt-2 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
