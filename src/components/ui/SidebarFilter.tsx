import { useState, useEffect } from "react";
import {
  Filter, ChevronDown, Check, Briefcase, GraduationCap, Clock, IndianRupee,
  BookOpen, Layers, MapPin, Cpu, Tag
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const FilterSection = ({ title, icon: Icon, options, selected, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-slate-800 font-bold text-sm mb-3 group"
      >
        <span className="flex items-center gap-2">
          <Icon size={14} className="text-[#1B2A6B]" /> {title}
        </span>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col gap-2"
          >
            {options.map((opt: string) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div className={cn(
                  "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors",
                  selected === opt ? "bg-[#1B2A6B] border-[#1B2A6B]" : "bg-white border-slate-300 group-hover:border-[#1B2A6B]"
                )}>
                  {selected === opt && <Check size={10} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={selected === opt}
                  onChange={() => onChange(selected === opt ? "" : opt)}
                  className="hidden"
                />
                <span className={cn(
                  "text-xs font-semibold transition-colors",
                  selected === opt ? "text-[#1B2A6B]" : "text-slate-600 group-hover:text-slate-900"
                )}>{opt}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── COURSES FILTERS ─────────────────────────────────────────────────────────
function CoursesFilter({ onFilterChange }: { onFilterChange?: (f: any) => void }) {
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    onFilterChange?.({ category, level, duration });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, level, duration]);

  return (
    <>
      <FilterSection title="Category" icon={BookOpen}
        options={["Full Stack Development", "Frontend Development", "Backend Development", "AI/ML", "Graphic Design", "UI/UX Design", "Digital Marketing"]}
        selected={category} onChange={setCategory} />
      <FilterSection title="Level" icon={Layers}
        options={["Beginner", "Intermediate", "Advanced", "All Levels"]}
        selected={level} onChange={setLevel} />
      <FilterSection title="Duration" icon={Clock}
        options={["< 1 Month", "1-3 Months", "3-6 Months", "6 Months+"]}
        selected={duration} onChange={setDuration} />
    </>
  );
}

// ─── INTERNSHIPS FILTERS ──────────────────────────────────────────────────────
function InternshipsFilter({ onFilterChange }: { onFilterChange?: (f: any) => void }) {
  const [domain, setDomain] = useState("");
  const [duration, setDuration] = useState("");
  const [mode, setMode] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    onFilterChange?.({ domain, duration, mode, level });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, duration, mode, level]);

  return (
    <>
      <FilterSection title="Domain" icon={Briefcase}
        options={["Engineering", "Design", "Data & Analytics", "Marketing", "Finance", "Operations", "Human Resources"]}
        selected={domain} onChange={setDomain} />
      <FilterSection title="Duration" icon={Clock}
        options={["1 Month", "2 Months", "3 Months", "6 Months", "1 Year"]}
        selected={duration} onChange={setDuration} />
      <FilterSection title="Work Mode" icon={MapPin}
        options={["Remote", "On-Site", "Hybrid"]}
        selected={mode} onChange={setMode} />
      <FilterSection title="Experience" icon={GraduationCap}
        options={["Fresher", "1st Year", "2nd Year", "3rd Year", "Final Year"]}
        selected={level} onChange={setLevel} />
    </>
  );
}

// ─── JOBS FILTERS ─────────────────────────────────────────────────────────────
function JobsFilter({ onFilterChange }: { onFilterChange?: (f: any) => void }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [mode, setMode] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    onFilterChange?.({ role, experience, salary, mode, type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, experience, salary, mode, type]);  return (
    <>
      <FilterSection title="Job Role" icon={Briefcase}
        options={["Software Engineer", "Data Scientist", "Product Manager", "UI/UX Designer", "DevOps Engineer", "Business Analyst", "Digital Marketer"]}
        selected={role} onChange={setRole} />
      <FilterSection title="Experience" icon={GraduationCap}
        options={["Fresher (0-1 yr)", "Junior (1-3 yrs)", "Mid (3-5 yrs)", "Senior (5-8 yrs)", "Lead (8+ yrs)"]}
        selected={experience} onChange={setExperience} />
      <FilterSection title="Salary Range" icon={IndianRupee}
        options={["3-5 LPA", "5-8 LPA", "8-15 LPA", "15-25 LPA", "25+ LPA"]}
        selected={salary} onChange={setSalary} />
      <FilterSection title="Work Mode" icon={MapPin}
        options={["Remote", "On-Site", "Hybrid"]}
        selected={mode} onChange={setMode} />
      <FilterSection title="Job Type" icon={Tag}
        options={["Full-Time", "Part-Time", "Contract", "Freelance"]}
        selected={type} onChange={setType} />
    </>
  );
}

// ─── EXPERTS FILTERS ──────────────────────────────────────────────────────────
function ExpertsFilter({ onFilterChange }: { onFilterChange?: (f: any) => void }) {
  const [domain, setDomain] = useState("");
  const [exp, setExp] = useState("");

  useEffect(() => {
    onFilterChange?.({ domain, experience: exp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, exp]);  return (
    <>
      <FilterSection title="Domain" icon={Cpu}
        options={["Engineering", "Design", "Data Science", "Product", "Marketing", "Finance", "Operations"]}
        selected={domain} onChange={setDomain} />
      <FilterSection title="Experience" icon={GraduationCap}
        options={["3-5 Years", "5-10 Years", "10-15 Years", "15+ Years"]}
        selected={exp} onChange={setExp} />
    </>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export function SidebarFilter({ type = "jobs", onFilterChange }: { type?: "courses" | "internships" | "jobs" | "experts" | string, onFilterChange?: (filters: any) => void }) {
  const [resetKey, setResetKey] = useState(0);

  const handleClearAll = () => {
    setResetKey(prev => prev + 1);
    onFilterChange?.({});
  };

  const titles: Record<string, string> = {
    courses: "Course Filters",
    internships: "Internship Filters",
    jobs: "Job Filters",
    experts: "Expert Filters",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[24px] p-5 shadow-[0_20px_60px_-15px_rgba(27,42,107,0.05)] sticky top-24">
      <div className="flex items-center justify-between mb-1 pb-3 border-b border-slate-100">
        <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
          <Filter size={14} className="text-[#1B2A6B]" /> {titles[type] ?? "Filters"}
        </h3>
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider transition-colors"
        >
          Clear All
        </button>
      </div>

      <div key={resetKey}>
        {type === "courses" && <CoursesFilter onFilterChange={onFilterChange} />}
        {type === "internships" && <InternshipsFilter onFilterChange={onFilterChange} />}
        {type === "jobs" && <JobsFilter onFilterChange={onFilterChange} />}
        {type === "experts" && <ExpertsFilter onFilterChange={onFilterChange} />}
      </div>
    </div>
  );
}
