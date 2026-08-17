import React, { useState } from "react";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Search, Users, Mail, Phone, ExternalLink, Loader2 } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CompanyEmployeesPage() {
  const { data, isLoading } = useSWR("/company/applicants", fetcher);
  const applicants = data?.data || [];
  
  // Hired candidates are those who accepted the offer or joined
  const employees = applicants.filter((a: any) => ["accepted", "joined", "completed"].includes(a.status));
  
  const [search, setSearch] = useState("");

  const filtered = employees.filter(
    (e: any) =>
      e.applicantName?.toLowerCase().includes(search.toLowerCase()) || 
      e.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CompanyDashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Hired Candidates</h1>
          <p className="text-slate-500 font-medium text-sm">
            View all candidates who have accepted offers and joined.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200">
          <Users size={16} />
          {employees.length} Total Hires
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search employees by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users size={24} />
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-1">No Employees Found</h2>
          <p className="text-slate-500 font-medium text-sm">
            You haven't hired any candidates yet, or none match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((emp: any, i: number) => (
            <AnimatedContent
              key={emp.id}
              direction="up"
              delay={i * 0.05}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B2A6B]/10 to-[#2E45A3]/10 flex items-center justify-center text-[#1B2A6B] font-black text-xl">
                    {emp.applicantName?.split(" ").map((n: string) => n[0]).join("") || "A"}
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                    {emp.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{emp.applicantName}</h3>
                <p className="text-sm font-bold text-[#1B2A6B] mb-4">{emp.jobTitle}</p>
                
                <div className="space-y-2">
                  <a href={`mailto:${emp.email}`} className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1B2A6B]">
                    <Mail size={14} className="text-slate-400" /> {emp.email}
                  </a>
                  {emp.phone && (
                    <a href={`tel:${emp.phone}`} className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1B2A6B]">
                      <Phone size={14} className="text-slate-400" /> {emp.phone}
                    </a>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Joined {emp.appliedDate}</span> {/* Ideally joined_date, using appliedDate fallback */}
                <a href={emp.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#1B2A6B] hover:underline">
                  View Profile <ExternalLink size={12} />
                </a>
              </div>
            </AnimatedContent>
          ))}
        </div>
      )}
    </CompanyDashboardLayout>
  );
}
