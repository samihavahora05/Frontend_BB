import React from "react";

import { cn } from "../../lib/utils";

export interface FilterSection {
  id: string;
  title: string;
  options: { label: string; value: string }[];
}

interface FilterSidebarProps {
  sections: FilterSection[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (sectionId: string, value: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterSidebar({ sections, activeFilters, onFilterChange, onClearAll, className }: FilterSidebarProps) {
  const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);

  return (
    <div className={cn("bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6", className)}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        
        <div className="flex-1 flex flex-wrap gap-x-8 gap-y-6">
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col gap-2">
              <h4 className="font-bold text-slate-800 text-sm">{section.title}</h4>
              <div className="flex flex-wrap gap-2">
                {section.options.map((option) => {
                  const isActive = activeFilters[section.id]?.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => onFilterChange(section.id, option.value)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200",
                        isActive 
                          ? "bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-md shadow-[#1B2A6B]/20 transform scale-[1.02]" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {hasActiveFilters && (
          <button 
            onClick={onClearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors shrink-0 mt-1 md:mt-0"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
