import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { ChevronRight, ChevronDown, Check, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function AdminAddEmployeePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "", department: "",
    gender: "", dob: "", address: "", salary: "", joiningDate: "", status: "Active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Name and Email are required"); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Employee added successfully!");
      router.push("/admin/users/employees");
    }, 1000);
  };

  return (
    <AdminDashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/admin/users/employees" className="hover:text-[#1B2A6B]">Employees</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Add Employee</span>
      </div>

      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">ADD EMPLOYEE</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-800">Add Employee</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">FULL NAME <span className="text-rose-500">*</span></label>
                <input required value={form.name} onChange={set("name")} placeholder="e.g. Ravi Sharma"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">EMAIL <span className="text-rose-500">*</span></label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="e.g. ravi@blueboxx.in"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
            </div>

            {/* Phone + Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">PHONE</label>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">ROLE / DESIGNATION</label>
                <input value={form.role} onChange={set("role")} placeholder="e.g. Developer"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
            </div>

            {/* Department + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">DEPARTMENT</label>
                <div className="relative">
                  <select value={form.department} onChange={set("department")}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="">Select Department</option>
                    {["Operations", "Human Resources", "Tech", "Creative", "Finance", "Marketing", "Sales"].map(d => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">GENDER</label>
                <div className="relative">
                  <select value={form.gender} onChange={set("gender")}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option value="">Select Gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* DOB + Joining Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">DATE OF BIRTH</label>
                <input type="date" value={form.dob} onChange={set("dob")}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">JOINING DATE</label>
                <input type="date" value={form.joiningDate} onChange={set("joiningDate")}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
              </div>
            </div>

            {/* Salary + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">SALARY (per month)</label>
                <input type="number" value={form.salary} onChange={set("salary")} placeholder="e.g. 35000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">STATUS</label>
                <div className="relative">
                  <select value={form.status} onChange={set("status")}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1B2A6B]">
                    <option>Active</option><option>Inactive</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">ADDRESS</label>
              <textarea rows={2} value={form.address} onChange={set("address")} placeholder="Enter employee address..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white resize-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-5 border-t border-slate-100 flex items-center gap-3">
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white text-sm font-black rounded-xl shadow-sm transition-all disabled:opacity-70">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
              {isSubmitting ? "Adding..." : "Add Employee"}
            </button>
            <Link href="/admin/users/employees" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-black rounded-xl transition-all">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </AdminDashboardLayout>
  );
}
