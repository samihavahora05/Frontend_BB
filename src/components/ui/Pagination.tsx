import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#1B2A6B] disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {getPages().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <div className="w-10 h-10 flex items-center justify-center text-slate-400">
              <MoreHorizontal size={18} />
            </div>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all",
                currentPage === page
                  ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#1B2A6B] hover:border-[#1B2A6B]/30"
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#1B2A6B] disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
