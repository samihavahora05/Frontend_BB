import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { PieChart, Download, Search, Filter, PlayCircle, BookOpen, UserPlus } from "lucide-react";
import { Badge } from "../../../src/components/ui/Badge";

const MOCK_ENGAGEMENT = [
  { id: "C-101", title: "Full Stack Mastery", enrollments: 450, completions: 310, dropOff: "15%", avgTime: "45 Days", rating: "4.8" },
  { id: "C-102", title: "Data Science Pro", enrollments: 320, completions: 200, dropOff: "22%", avgTime: "60 Days", rating: "4.5" },
  { id: "C-103", title: "UI/UX Bootcamp", enrollments: 280, completions: 250, dropOff: "5%", avgTime: "30 Days", rating: "4.9" },
  { id: "C-104", title: "System Design", enrollments: 150, completions: 90, dropOff: "35%", avgTime: "25 Days", rating: "4.2" },
  { id: "C-105", title: "Backend Architecture", enrollments: 210, completions: 180, dropOff: "10%", avgTime: "40 Days", rating: "4.7" },
];

export default function EngagementReportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-pink-600" />
              User Engagement & Retention
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Analyze course completion rates, active usage, and drop-off metrics.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm">
              <Filter className="w-4 h-4" /> Date Range
            </button>
            <button className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 transition-colors font-bold text-sm shadow-sm">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-pink-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-pink-50 text-pink-600">
                <PlayCircle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Avg Course Completion</h3>
            <h2 className="text-2xl font-black text-slate-900">72.5%</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Active Learners Daily</h3>
            <h2 className="text-2xl font-black text-slate-900">842</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 mt-4">Job Placement Rate</h3>
            <h2 className="text-2xl font-black text-amber-600">68%</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Course Engagement Analytics</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search courses..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Course ID</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Enrollments</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Completions</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Drop-off Rate</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Avg Time</th>
                  <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_ENGAGEMENT.map((data) => (
                  <tr key={data.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="py-4 px-6 font-mono font-bold text-slate-400">{data.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{data.title}</td>
                    <td className="py-4 px-6 font-black text-slate-700 text-center">{data.enrollments}</td>
                    <td className="py-4 px-6 font-black text-emerald-600 text-center">{data.completions}</td>
                    <td className="py-4 px-6 font-bold text-center">
                      <span className={parseInt(data.dropOff) > 20 ? 'text-rose-600 bg-rose-50 px-2 py-1 rounded-md' : 'text-slate-600'}>
                        {data.dropOff}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500 text-center">{data.avgTime}</td>
                    <td className="py-4 px-6 text-center">
                      <Badge className="font-bold border-none bg-amber-50 text-amber-700">
                        ★ {data.rating}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
