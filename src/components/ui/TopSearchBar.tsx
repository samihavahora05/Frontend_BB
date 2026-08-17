import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface TopSearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export function TopSearchBar({ value, onChange, placeholder = "Search..." }: TopSearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div
      className="rounded-2xl p-6 shadow-sm mb-6 z-20 relative border border-slate-200/60"
      style={{
        background: "linear-gradient(135deg, #f8faff 0%, #fafafa 40%, #fffdf5 100%)",
      }}
    >
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200/60 text-sm focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10 outline-none transition-all placeholder-slate-400 font-bold bg-white/60 hover:bg-white/90"
          />
        </div>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#1B2A6B] to-[#121c47] text-white font-black text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden relative group shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          Search
        </motion.button>
      </div>
    </div>
  );
}
