import React from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { ChevronRight, Layers, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminPageBuilderPage() {
  return (
    <AdminDashboardLayout>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-6">
        <Link href="/admin/dashboard" className="hover:text-[#1B2A6B]">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-slate-500">Frontend CMS</span>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-bold">Aora PageBuilder</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">Aora PageBuilder</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#1B2A6B]/5 flex items-center justify-center mx-auto mb-4">
          <Layers size={28} className="text-[#1B2A6B]" />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-2">Launch Builder Environment</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          Access the drag-and-drop builder console to design landing pages, customise components, and compile frontend layouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1B2A6B] hover:bg-[#1B2A6B]/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-[#1B2A6B]/20">
            Open PageBuilder <ArrowUpRight size={16} />
          </button>
          <Link href="/admin/dashboard" className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">
            <ArrowLeft size={16} /> Return Home
          </Link>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
