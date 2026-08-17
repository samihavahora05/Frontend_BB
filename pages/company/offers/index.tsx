import React, { useState } from "react";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Search, CheckCircle, Clock, XCircle, Download, Loader2, Send } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function CompanyOffersPage() {
  const { data, isLoading } = useSWR("/company/offers", fetcher);
  const offers = data?.data || [];
  
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = offers.filter(
    (o: any) =>
      (activeTab === "All" || (activeTab === "Pending" && o.status === "pending") || (activeTab === "Accepted" && o.status === "accepted")) &&
      (o.name.toLowerCase().includes(search.toLowerCase()) || o.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <CompanyDashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Job Offers</h1>
          <p className="text-slate-500 font-medium text-sm">
            Manage offers sent to candidates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Sent", value: offers.length, icon: Send, color: "text-blue-600 bg-blue-50" },
          { label: "Pending Response", value: offers.filter((o: any) => o.status === "pending").length, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Accepted", value: offers.filter((o: any) => o.status === "accepted").length, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
          { label: "Declined", value: offers.filter((o: any) => o.status === "declined").length, icon: XCircle, color: "text-red-600 bg-red-50" },
        ].map((stat, i) => (
          <AnimatedContent
            key={i}
            direction="up"
            delay={i * 0.1}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
          {["All", "Pending", "Accepted"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === t ? "bg-[#1B2A6B] text-white shadow" : "text-slate-500 hover:text-slate-800"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search candidates or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
          <div className="col-span-4">Candidate & Role</div>
          <div className="col-span-2 text-center">Salary</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Valid Until</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-12 text-center flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#1B2A6B]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              No offers found.
            </div>
          ) : (
            filtered.map((offer: any, i: number) => (
              <AnimatedContent
                key={offer.id}
                direction="up"
                delay={i * 0.05}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-600 text-sm">
                    {offer.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">{offer.name}</h3>
                    <p className="text-xs font-bold text-[#1B2A6B]">{offer.role}</p>
                  </div>
                </div>

                <div className="col-span-2 flex justify-center text-sm font-black text-slate-800">
                  ₹{offer.salary_offered.toLocaleString()}
                </div>

                <div className="col-span-2 flex justify-center">
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                    offer.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                    offer.status === "pending" ? "bg-amber-100 text-amber-700" :
                    offer.status === "expired" ? "bg-slate-100 text-slate-600" : "bg-red-100 text-red-600"
                  }`}>
                    {offer.status}
                  </span>
                </div>

                <div className="col-span-2 flex justify-center text-xs font-semibold text-slate-500">
                  {offer.valid_until}
                </div>

                <div className="col-span-2 flex justify-center">
                  {offer.offer_letter ? (
                    <a href={offer.offer_letter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg transition-colors">
                      <Download size={14} /> PDF
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold italic">No PDF Attached</span>
                  )}
                </div>
              </AnimatedContent>
            ))
          )}
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
