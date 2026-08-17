import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./Button";
import { AnimatedContent } from "../reactbits/AnimatedContent";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  const btnLabel = actionLabel || actionText;
  return (
    <AnimatedContent direction="up" className={cn("w-full py-16 flex flex-col items-center justify-center text-center px-4", className)}>
      <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#1B2A6B]/5 to-[#1B2A6B]/10 flex items-center justify-center mb-6 shadow-sm border border-[#1B2A6B]/10">
        <Icon size={40} className="text-[#1B2A6B]" />
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 font-medium max-w-sm mb-8 text-sm leading-relaxed">
        {description}
      </p>
      {btnLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-[#1B2A6B]/20 transition-all flex items-center gap-2"
        >
          {btnLabel}
        </Button>
      )}
    </AnimatedContent>
  );
}
