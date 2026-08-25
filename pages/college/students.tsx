import { useState } from "react";
import { CollegeDashboardLayout } from "../../src/layout/CollegeDashboardLayout";
import { AnimatedContent } from "../../src/components/reactbits/AnimatedContent";
import { Users, GraduationCap, TrendingUp, Building2, Search, Filter, Download, ChevronLeft, ChevronRight, Upload, Plus, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import api from "../../src/lib/axios";
import { AnimatePresence, motion } from "framer-motion";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CollegeStudentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "placed" | "in_process" | "unplaced">("all");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    course: "B.Tech CSE",
    cgpa: "8.5",
    status: "unplaced",
    placed_company: "",
    package: "",
  });

  const { data, isLoading, mutate: mutateStudents } = useSWR("/college/students", fetcher);
  
  const students = data?.data?.students || [];
  const stats = data?.data?.stats || { total_students: 0, placed: 0, in_process: 0, unplaced: 0 };

  const filtered = students.filter((s: any) => {
    const matchesTab = activeTab === "all" || s.status === activeTab;
    const nameMatch = s.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = s.email?.toLowerCase().includes(search.toLowerCase());
    const courseMatch = s.course?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && (nameMatch || emailMatch || courseMatch);
  });

  const initials = (name: string) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "ST";

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/college/students", newStudent);
      toast.success("Student added successfully!");
      setIsAddModalOpen(false);
      setNewStudent({
        name: "",
        email: "",
        course: "B.Tech CSE",
        cgpa: "8.5",
        status: "unplaced",
        placed_company: "",
        package: "",
      });
      await mutateStudents();
      mutate("/college/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your college roster?`)) return;
    try {
      await api.delete(`/college/students/${studentId}`);
      toast.success("Student removed");
      await mutateStudents();
      mutate("/college/dashboard");
    } catch (err: any) {
      toast.error("Failed to remove student");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get("/college/students/export", { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `college_students_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Student roster exported!");
    } catch (e) {
      toast.error("Export failed");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const toastId = toast.loading("Importing students...");
      try {
        await api.post('/college/students/import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Students imported successfully!", { id: toastId });
        await mutateStudents();
        mutate("/college/dashboard");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to import students.", { id: toastId });
      }
    }
  };

  return (
    <CollegeDashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Student Placement Roster</h1>
          <p className="text-slate-500 font-medium text-sm">Manage student batch, track placement status, and import records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={15} /> Export CSV
          </button>
          
          <label className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <Upload size={15} /> Import File
            <input type="file" className="hidden" accept=".csv,.txt" onChange={handleImportFile} />
          </label>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 h-10 px-5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors"
          >
            <Plus size={15} /> Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: stats.total_students, icon: Users, color: "text-[#1B2A6B] bg-blue-50" },
          { label: "Placed", value: stats.placed, icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
          { label: "In Process", value: stats.in_process, icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
          { label: "Unplaced", value: stats.unplaced, icon: Building2, color: "text-slate-600 bg-slate-100" },
        ].map((s, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.07} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={'w-11 h-11 rounded-xl flex items-center justify-center ' + s.color + ' shrink-0'}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Students" },
            { id: "placed", label: "Placed" },
            { id: "in_process", label: "In Process" },
            { id: "unplaced", label: "Unplaced" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={'px-4 h-9 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === tab.id 
                  ? 'bg-[#1B2A6B] text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name, course..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 text-xs focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none font-medium"
          />
        </div>
      </div>

      {/* Students Table */}
      <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-4">Degree / Course</th>
                <th className="py-3.5 px-4 text-center">CGPA</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Placement Details</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1B2A6B]/10 flex items-center justify-center text-[#1B2A6B] font-black text-xs shrink-0">
                        {initials(s.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#1B2A6B] transition-colors">{s.name}</p>
                        <p className="text-[11px] font-semibold text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">{s.course}</td>
                  <td className="py-3.5 px-4 text-center text-xs font-black text-slate-800">{s.cgpa}</td>
                  <td className="py-3.5 px-4 text-center">
                    {s.status === "placed" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">Placed</span>
                    ) : s.status === "in_process" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider">In Process</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-wider">Unplaced</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {s.status === "placed" && s.placed_company ? (
                      <div>
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 size={13} className="text-[#1B2A6B]" /> {s.placed_company}
                        </p>
                        <p className="text-[11px] font-bold text-emerald-600">{s.package || "Offer Confirmed"}</p>
                      </div>
                    ) : s.status === "in_process" ? (
                      <p className="text-xs font-semibold text-amber-600">Interviewing with {s.placed_company || "Partner Companies"}</p>
                    ) : (
                      <p className="text-xs font-medium text-slate-400">Available for upcoming drives</p>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleDeleteStudent(s.id, s.name)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                      title="Remove from roster"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="py-12 text-center text-slate-400 font-medium">Loading students roster...</div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-medium">No students found matching current filters.</div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Showing {filtered.length} of {stats.total_students} students</span>
        </div>
      </AnimatedContent>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative"
            >
              <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-800 mb-1">Add Student to Roster</h2>
              <p className="text-xs text-slate-500 font-medium mb-5">Register a new student under your college placement cell.</p>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="rahul@college.edu"
                    value={newStudent.email}
                    onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Degree / Course</label>
                    <select
                      value={newStudent.course}
                      onChange={e => setNewStudent({...newStudent, course: e.target.value})}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                    >
                      <option value="B.Tech CSE">B.Tech CSE</option>
                      <option value="B.Tech IT">B.Tech IT</option>
                      <option value="B.Tech AI & DS">B.Tech AI & DS</option>
                      <option value="B.Tech ECE">B.Tech ECE</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">CGPA (0 - 10)</label>
                    <input
                      type="text"
                      placeholder="8.5"
                      value={newStudent.cgpa}
                      onChange={e => setNewStudent({...newStudent, cgpa: e.target.value})}
                      className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Placement Status</label>
                  <select
                    value={newStudent.status}
                    onChange={e => setNewStudent({...newStudent, status: e.target.value})}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
                  >
                    <option value="unplaced">Unplaced</option>
                    <option value="in_process">In Process (Interviewing)</option>
                    <option value="placed">Placed (Offer Received)</option>
                  </select>
                </div>

                {newStudent.status === "placed" && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Placed Company</label>
                      <input
                        type="text"
                        placeholder="Google / Amazon"
                        value={newStudent.placed_company}
                        onChange={e => setNewStudent({...newStudent, placed_company: e.target.value})}
                        className="w-full h-9 px-3 rounded-lg border border-emerald-200 text-xs bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Package (CTC)</label>
                      <input
                        type="text"
                        placeholder="12.0 LPA"
                        value={newStudent.package}
                        onChange={e => setNewStudent({...newStudent, package: e.target.value})}
                        className="w-full h-9 px-3 rounded-lg border border-emerald-200 text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md transition-colors text-sm mt-2"
                >
                  {isSubmitting ? "Adding Student..." : "Save Student"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CollegeDashboardLayout>
  );
}
