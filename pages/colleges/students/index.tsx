import { CollegesDashboardLayout } from "../../../src/layout/CollegesDashboardLayout";
import { Search, Filter, MoreHorizontal, FileText, ChevronDown, Download, User, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import { AdvancedFilterPanel, FilterCategory } from "../../../src/components/ui/AdvancedFilterPanel";

export default function CollegeStudents() {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ [categoryId: string]: string[] }>({
    branch: [],
    year: [],
    status: []
  });

  const initialStudents = [
    { id: "S1001", name: "Rahul Sharma", branch: "Computer Science", year: "4th Year", status: "Placed", performance: "A+", company: "Tech Mahindra" },
    { id: "S1002", name: "Priya Patel", branch: "Information Tech", year: "4th Year", status: "Placed", performance: "A", company: "Infosys" },
    { id: "S1003", name: "Amit Kumar", branch: "Computer Science", year: "3rd Year", status: "Internship", performance: "B+", company: "BlueBoxx" },
    { id: "S1004", name: "Sneha Reddy", branch: "Electronics", year: "4th Year", status: "Interviewing", performance: "A", company: "-" },
    { id: "S1005", name: "Vikas Singh", branch: "Mechanical", year: "4th Year", status: "Available", performance: "B", company: "-" },
  ];

  const filterCategories: FilterCategory[] = [
    {
      id: "branch",
      title: "Branch",
      options: [
        { id: "Computer Science", label: "Computer Science" },
        { id: "Information Tech", label: "Information Tech" },
        { id: "Electronics", label: "Electronics" },
        { id: "Mechanical", label: "Mechanical" },
      ]
    },
    {
      id: "year",
      title: "Year",
      options: [
        { id: "3rd Year", label: "3rd Year" },
        { id: "4th Year", label: "4th Year" },
      ]
    },
    {
      id: "status",
      title: "Status",
      options: [
        { id: "Placed", label: "Placed" },
        { id: "Internship", label: "Internship" },
        { id: "Interviewing", label: "Interviewing" },
        { id: "Available", label: "Available" },
      ]
    }
  ];

  const handleFilterChange = (categoryId: string, optionId: string) => {
    setActiveFilters(prev => {
      const current = prev[categoryId] || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      return { ...prev, [categoryId]: updated };
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({ branch: [], year: [], status: [] });
  };

  const filteredStudents = initialStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check active filters (if a category is empty, it means no filter is applied for that category)
    const matchesBranch = activeFilters.branch.length === 0 || activeFilters.branch.includes(s.branch);
    const matchesYear = activeFilters.year.length === 0 || activeFilters.year.includes(s.year);
    const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(s.status);

    return matchesSearch && matchesBranch && matchesYear && matchesStatus;
  });

  const handleExport = () => {
    const toastId = toast.loading("Generating CSV export...");
    setTimeout(() => {
      toast.success("students_export.csv downloaded!", { id: toastId });
    }, 1000);
  };

  return (
    <CollegesDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] mb-1">Students Directory</h1>
          <p className="text-slate-500 font-medium text-sm">Manage and track your students' performance and placements.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
        <div className="p-4 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/50">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students by name or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 transition-all shadow-sm" 
            />
          </div>
          <AdvancedFilterPanel 
            categories={filterCategories} 
            activeFilters={activeFilters} 
            onFilterChange={handleFilterChange} 
            onClearAll={handleClearAllFilters} 
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse relative z-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Branch/Year</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center font-medium text-slate-500">No students found matching your criteria.</td></tr>
              )}
              {filteredStudents.map((student, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{student.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{student.branch}</p>
                    <p className="text-xs text-slate-500 font-medium">{student.year}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                      student.status === 'Placed' ? 'bg-emerald-100 text-emerald-700' :
                      student.status === 'Internship' ? 'bg-blue-100 text-blue-700' :
                      student.status === 'Interviewing' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-700">{student.performance}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedStudent(student)} className="p-2 text-slate-400 hover:text-[#1B2A6B] hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2"><User size={18} className="text-[#1B2A6B]"/> Student Details</h3>
                <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">{selectedStudent.name}</h2>
                    <p className="text-sm font-semibold text-slate-500">{selectedStudent.id} &bull; {selectedStudent.branch}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">Current Status</span>
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                      selectedStudent.status === 'Placed' ? 'bg-emerald-100 text-emerald-700' :
                      selectedStudent.status === 'Internship' ? 'bg-blue-100 text-blue-700' :
                      selectedStudent.status === 'Interviewing' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                  {selectedStudent.company !== "-" && (
                    <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase">Company</span>
                      <span className="text-sm font-black text-slate-800">{selectedStudent.company}</span>
                    </div>
                  )}
                  <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">Performance Grade</span>
                    <span className="text-sm font-black text-slate-800">{selectedStudent.performance}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                  <button onClick={() => { toast.success("Downloading resume PDF..."); setSelectedStudent(null); }} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <FileText size={16}/> View Resume
                  </button>
                  <button onClick={() => setSelectedStudent(null)} className="flex-1 py-2.5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl hover:bg-[#0d1635] transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CollegesDashboardLayout>
  );
}
