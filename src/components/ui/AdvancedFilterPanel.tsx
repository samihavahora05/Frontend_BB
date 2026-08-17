import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Check } from 'lucide-react';

export type FilterOption = {
  id: string;
  label: string;
};

export type FilterCategory = {
  id: string;
  title: string;
  options: FilterOption[];
};

interface AdvancedFilterPanelProps {
  categories: FilterCategory[];
  activeFilters: { [categoryId: string]: string[] };
  onFilterChange: (categoryId: string, optionId: string) => void;
  onClearAll: () => void;
}

export function AdvancedFilterPanel({ categories, activeFilters, onFilterChange, onClearAll }: AdvancedFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate total active filters
  const totalActive = Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`px-4 py-2 border font-bold rounded-lg text-sm flex items-center gap-2 transition-colors ${isOpen || totalActive > 0 ? 'bg-[#1B2A6B] text-white border-[#1B2A6B]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
      >
        <Filter size={16} /> 
        Advanced Filters
        {totalActive > 0 && (
          <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] ml-1">{totalActive}</span>
        )}
        <ChevronDown size={14} className={`transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-[#0d1635]">Filter Results</h3>
                {totalActive > 0 && (
                  <button onClick={onClearAll} className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline">
                    Clear All Filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(category => (
                  <div key={category.id}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category.title}</h4>
                    <div className="space-y-2">
                      {category.options.map(option => {
                        const isActive = activeFilters[category.id]?.includes(option.id);
                        return (
                          <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-[#1B2A6B] border-[#1B2A6B] text-white' : 'bg-slate-50 border-slate-300 text-transparent group-hover:border-[#1B2A6B]'}`}>
                              <Check size={12} strokeWidth={4} />
                            </div>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={isActive || false}
                              onChange={() => onFilterChange(category.id, option.id)} 
                            />
                            <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-[#0d1635]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button onClick={() => setIsOpen(false)} className="px-6 py-2.5 bg-slate-100 text-[#1B2A6B] text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors">
                  View Results
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
