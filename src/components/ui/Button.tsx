import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'gold' | 'emerald';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A6B]/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          // Variant styles
          (variant === 'default' || variant === 'primary') && "bg-[#1B2A6B] hover:bg-[#0d1635] text-white shadow-sm",
          (variant === 'secondary' || variant === 'gold') && "bg-[#C9A227] hover:bg-[#d8b02c] text-[#0d1635] shadow-sm",
          variant === 'emerald' && "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
          variant === 'outline' && "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm",
          variant === 'ghost' && "hover:bg-slate-100 text-slate-700",
          variant === 'link' && "text-[#1B2A6B] hover:underline underline-offset-4 bg-transparent",
          variant === 'danger' && "bg-rose-600 hover:bg-rose-700 text-white shadow-sm",
          // Size styles
          size === 'default' && "h-11 px-5 py-2",
          size === 'sm' && "h-9 px-4 text-xs",
          size === 'lg' && "h-14 px-8 text-base",
          size === 'icon' && "h-11 w-11",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
