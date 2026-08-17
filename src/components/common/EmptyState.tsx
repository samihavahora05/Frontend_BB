import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  message?: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description,
  message,
  actionText,
  actionLabel,
  onAction
}) => {
  const desc = description || message || '';
  const btnText = actionText || actionLabel;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-black text-[#0d1635] mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-medium max-w-md mb-6">{desc}</p>
      
      {btnText && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
        >
          {btnText}
        </button>
      )}
    </div>
  );
};
