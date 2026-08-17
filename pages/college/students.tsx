import { useState } from "react";
import { CollegeDashboardLayout } from "../../src/layout/CollegeDashboardLayout";
import { AnimatedContent } from "../../src/components/reactbits/AnimatedContent";
import { Users, GraduationCap, TrendingUp, Building2, Search, Filter, Download, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CollegeStudentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "placed" | "unplaced">("all");
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useSWR("/college/students", fetcher);
  
  const students = data?.data?.students || [];
  const stats = data?.data?.stats || { total_students: 0, placed: 0, in_process: 0, unplaced: 0 };

  const filtered = students.filter((s: any) => {
    const matchesTab = activeTab === "all" || s.status === activeTab;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <CollegeDashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Student Roster</h1>
          <p className="text-slate-500 font-medium text-sm">Manage and track placement progress for the 2026 Batch.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const token = localStorage.getItem('blueboxx_sessions') ? JSON.parse(localStorage.getItem('blueboxx_sessions')!).college?.token : null;
              if (token) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api';
                window.open(`${baseUrl}/college/students/export?token=${token}`, '_blank');
              } else {
                toast.error("Authentication error");
              }
            }}
            className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download size={15} /> Export
          </button>
          <label className="flex items-center gap-2 h-10 px-5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors cursor-pointer">
            <Upload size={15} /> Import Excel
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={async (e) => {
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
                } catch (error) {
                  toast.error("Failed to import students.", { id: toastId });
                }
              }
            }} />
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: stats.total_students, icon: Users, color: "text-[#1B2A6B] bg-blue-50" },
          { label: "Placed", value: stats.placed, icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
          { label: "In Process", value: stats.in_process, icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
          { label: "Unplaced", value: stats.unplaced, icon: Building2, color: "text-slate-600 bg-slate-100" },
        ].map((s, i) => (
          <AnimatedContent key={i} direction="up" delay={i * 0.07} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color} shrink-0`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {["all", "placed", "unplaced"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 h-9 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${activeTab === tab ? "bg-[#1B2A6B] text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none font-medium"
            />
          </div>
          <button className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
            <Filter size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4 text-center">CGPA</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Placement</th>
                <th className="py-3 px-5 text-right">Actions</th>
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
                        <p className="text-[10px] font-bold text-slate-400">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-semibold text-slate-500">{s.course}</td>
                  <td className="py-3.5 px-4 text-center text-sm font-black text-slate-800">{s.cgpa}</td>
                  <td className="py-3.5 px-4 text-center">
                    {s.status === "placed" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-wider">Placed</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-wider">In Process</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {s.status === "placed" ? (
                      <div>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400" /> {(s as any).company}
                        </p>
                        <p className="text-[11px] font-bold text-emerald-600">{(s as any).package}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Active Interviews: {(s as any).interviews}</p>
                        <p className="text-[11px] font-bold text-amber-500">Needs attention</p>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => toast(`Viewing profile for ${s.name}`, { icon: "👤" })}
                      className="text-xs font-bold text-[#1B2A6B] border border-[#1B2A6B]/20 px-3 h-8 rounded-xl hover:bg-[#1B2A6B]/5 transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="py-12 text-center text-slate-400">Loading students...</div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400">No students found.</div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400">Showing {filtered.length} of {stats.total_students} students</p>
          <div className="flex gap-1.5">
            <button className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center" disabled><ChevronLeft size={15} /></button>
            <button className="h-8 w-8 rounded-lg bg-[#1B2A6B] text-white text-xs font-black">1</button>
            <button className="h-8 w-8 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100">2</button>
            <button className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center"><ChevronRight size={15} /></button>
          </div>
        </div>
      </AnimatedContent>
    </CollegeDashboardLayout>
  );
}
