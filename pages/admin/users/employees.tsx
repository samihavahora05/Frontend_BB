import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import {
  Users, Search, Plus, Eye, Edit3, Trash2, Mail, Phone,
  ChevronRight, ChevronDown, ShieldCheck, X, Check
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_EMPLOYEES = [
  { id: 1, name: "Ravi Sharma", email: "ravi.sharma@blueboxx.in", phone: "9876543210", role: "Manager", department: "Operations", status: "Active", avatar: "RS", color: "bg-indigo-500" },
  { id: 2, name: "Neha Gupta", email: "neha.gupta@blueboxx.in", phone: "9765432109", role: "HR Executive", department: "Human Resources", status: "Active", avatar: "NG", color: "bg-rose-500" },
  { id: 3, name: "Arjun Mehta", email: "arjun.mehta@blueboxx.in", phone: "9654321098", role: "Developer", department: "Tech", status: "Inactive", avatar: "AM", color: "bg-amber-500" },
  { id: 4, name: "Pooja Verma", email: "pooja.verma@blueboxx.in", phone: "9543210987", role: "Designer", department: "Creative", status: "Active", avatar: "PV", color: "bg-purple-500" },
];

const DEPARTMENTS = ["All", "Operations", "Human Resources", "Tech", "Creative", "Finance"];

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [perPage, setPerPage] = useState(10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "", role: "", department: "" });
  const [editForm, setEditForm] = useState({ id: 0, name: "", email: "", phone: "", role: "", department: "" });

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All" || e.department === dept;
    return matchSearch && matchDept;
  });

  const handleDelete = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    toast.success("Employee removed.");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email) return;
    const initials = addForm.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-purple-500", "bg-cyan-600"];
    setEmployees((prev) => [
      ...prev,
      { id: Date.now(), ...addForm, status: "Active", avatar: initials, color: colors[prev.length % colors.length] },
    ]);
    setAddForm({ name: "", email: "", phone: "", role: "", department: "" });
    setIsAddOpen(false);
    toast.success("Employee added!");
  };

  const openEditModal = (emp: any) => {
    setEditForm({ id: emp.id, name: emp.name, email: emp.email, phone: emp.phone || "", role: emp.role || "", department: emp.department || "" });
    setIsEditOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) return;
    setEmployees(prev => prev.map(emp => emp.id === editForm.id ? {
      ...emp, name: editForm.name, email: editForm.email, phone: editForm.phone, role: editForm.role, department: editForm.department
    } : emp));
    setIsEditOpen(false);
    toast.success("Employee updated!");
  };

  const handleExport = () => {
    const header = "SL,Name,Email,Phone,Role,Department,Status\n";
    const rows = employees.map((e, i) => `${i + 1},"${e.name}","${e.email}","${e.phone}","${e.role}","${e.department}","${e.status}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "employees.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported!");
  };

  return (
    <AdminDashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Employees</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Employees</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">{employees.length} employees on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold rounded-xl shadow-sm transition-all">
            Export CSV
          </button>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
            <Plus size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Show</span>
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
              {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
            </select>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B] w-48" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-10">SL</th>
                <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Department</th>
                <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, perPage).map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3 px-4 text-xs font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${emp.color} flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0`}>
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#1B2A6B] transition-colors">{emp.name}</p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1"><Mail size={11} />{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-slate-600">{emp.role}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-slate-600">{emp.department}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${emp.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" onClick={() => toast("View employee details")}>
                        <Eye size={13} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" onClick={() => openEditModal(emp)}>
                        <Edit3 size={13} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" onClick={() => handleDelete(emp.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-sm font-semibold text-slate-400">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500">Showing 1–{Math.min(perPage, filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100">Previous</button>
            <button className="px-3 py-1.5 bg-[#1B2A6B] text-white rounded-lg text-xs font-bold">1</button>
            <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100">Next</button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Plus size={18} className="text-[#1B2A6B]" />Add Employee</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={22} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "e.g. Ravi Sharma" },
                { label: "Email Address", key: "email", type: "email", placeholder: "e.g. ravi@blueboxx.in" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "e.g. 9876543210" },
                { label: "Role / Designation", key: "role", type: "text", placeholder: "e.g. Developer" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
                  <input required={f.key !== "phone"} type={f.type} placeholder={f.placeholder} value={(addForm as any)[f.key]} onChange={(e) => setAddForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
                </div>
              ))}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Department</label>
                <select value={addForm.department} onChange={(e) => setAddForm((prev) => ({ ...prev, department: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option value="">Select Department</option>
                  {DEPARTMENTS.filter((d) => d !== "All").map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Edit3 size={18} className="text-[#1B2A6B]" />Edit Employee</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={22} /></button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "e.g. Ravi Sharma" },
                { label: "Email Address", key: "email", type: "email", placeholder: "e.g. ravi@blueboxx.in" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "e.g. 9876543210" },
                { label: "Role / Designation", key: "role", type: "text", placeholder: "e.g. Developer" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
                  <input required={f.key !== "phone"} type={f.type} placeholder={f.placeholder} value={(editForm as any)[f.key]} onChange={(e) => setEditForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
                </div>
              ))}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Department</label>
                <select value={editForm.department} onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                  <option value="">Select Department</option>
                  {DEPARTMENTS.filter((d) => d !== "All").map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
