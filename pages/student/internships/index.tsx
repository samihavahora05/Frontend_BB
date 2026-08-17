import React, { useState } from "react";
import { useRouter } from "next/router";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Briefcase, MapPin, Clock, IndianRupee, Search, Filter, ExternalLink, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function InternshipsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);

  const { data: responseData, isLoading } = useSWR("/public/internships", fetcher);
  const internships = responseData?.data || [];

  // Load which internships are already saved
  const { mutate: mutateWishlist } = useSWR("/student/wishlist", (url) =>
    api.get(url).then(res => res.data.data)
  , {
    onSuccess: (data) => {
      if (data?.saved_internship_ids) {
        setSavedIds(new Set(data.saved_internship_ids.map(Number)));
      }
    }
  });

  const filtered = internships.filter((i: any) =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSave = async (id: number) => {
    if (saving === id) return;
    setSaving(id);
    const isSaved = savedIds.has(id);
    try {
      if (isSaved) {
        await api.delete(`/student/save/internship/${id}`);
        setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        toast.success("Removed from saved items");
      } else {
        await api.post(`/student/save/internship/${id}`);
        setSavedIds(prev => new Set([...prev, id]));
        toast.success("Internship saved to your Saved Items!");
      }
      mutateWishlist();
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const handleApply = (id: number) => {
    router.push(`/apply/internship/${id}`);
  };

  return (
    <StudentDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Internships</h1>
        <p className="text-slate-500 text-sm font-medium">Discover internships matched to your profile and skills.</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search by role or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"
          />
        </div>
        <button onClick={() => toast.success("Opening filter options...")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter size={15} /> Filter
        </button>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 font-semibold animate-pulse">Loading internships...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Briefcase size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-black text-slate-600">No internships available right now.</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">Check back later or try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item: any, i: number) => {
            const tags = item.domain ? item.domain.split(',').slice(0, 3) : ['General'];
            const isSaved = savedIds.has(item.id);
            return (
              <AnimatedContent key={item.id} direction="up" delay={i * 0.07}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] flex items-center justify-center text-white font-black text-sm shrink-0 overflow-hidden">
                    {item.company_logo ? <img src={item.company_logo} alt={item.company_name} className="w-full h-full object-cover" /> : item.company_name?.[0] || 'C'}
                  </div>
                  <button
                    onClick={() => toggleSave(item.id)}
                    disabled={saving === item.id}
                    title={isSaved ? "Remove from saved" : "Save this internship"}
                    className={`p-1.5 rounded-lg transition-all ${isSaved ? "text-[#C9A227]" : "text-slate-300 hover:text-slate-500"} ${saving === item.id ? "animate-pulse" : ""}`}
                  >
                    <Bookmark size={15} fill={isSaved ? "#C9A227" : "none"} />
                  </button>
                </div>

                <h3 className="font-black text-slate-800 text-sm mb-0.5 line-clamp-1">{item.title}</h3>
                <p className="text-xs font-bold text-slate-500 mb-3 line-clamp-1">{item.company_name}</p>

                <div className="space-y-1.5 mb-4 text-xs text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5"><MapPin size={11} className="shrink-0" /> <span className="line-clamp-1">{item.location}</span></div>
                  <div className="flex items-center gap-1.5"><Clock size={11} className="shrink-0" /> <span>{item.duration || 'Not specified'}</span></div>
                  <div className="flex items-center gap-1.5"><IndianRupee size={11} className="shrink-0" /> <span>{item.stipend || 'Unpaid'}</span></div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">{t.trim()}</span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">Posted {item.posted_at}</span>
                  {item.has_applied ? (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-black rounded-xl">Applied</span>
                  ) : (
                    <button
                      onClick={() => handleApply(item.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#0d1635] transition-colors"
                    >
                      Apply Now <ExternalLink size={11} />
                    </button>
                  )}
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      )}
    </StudentDashboardLayout>
  );
}
