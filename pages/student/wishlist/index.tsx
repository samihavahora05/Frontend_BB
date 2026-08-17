import React, { useState, useEffect } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Bookmark, BookOpen, Briefcase, Trash2, ExternalLink } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import Link from "next/link";
import toast from "react-hot-toast";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function WishlistPage() {
  const { data, isLoading, mutate } = useSWR("/student/wishlist", fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });
  const [activeTab, setActiveTab] = useState<"courses" | "jobs" | "internships">("courses");

  useEffect(() => {
    mutate();
  }, [mutate]);

  const handleRemove = async (type: string, id: number) => {
    try {
      await api.delete(`/student/wishlist/${type}/${id}`);
      mutate();
      toast.success("Removed from saved items");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const getItems = () => {
    if (!data) return [];
    return data[activeTab] || [];
  };

  const items = getItems();

  return (
    <StudentDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Saved Items</h1>
        <p className="text-slate-500 text-sm font-medium">Manage your bookmarked courses, jobs, and internships.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-6 pb-px">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "courses" ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <BookOpen size={16} className="inline mr-2" /> Courses ({data?.courses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "jobs" ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <Briefcase size={16} className="inline mr-2" /> Jobs ({data?.jobs?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("internships")}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "internships" ? "border-[#1B2A6B] text-[#1B2A6B]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <Bookmark size={16} className="inline mr-2" /> Internships ({data?.internships?.length || 0})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-slate-400 font-semibold animate-pulse">Loading saved items...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Bookmark size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="font-black text-slate-600 mb-1">No saved {activeTab}</p>
            <p className="text-xs text-slate-400 font-semibold mb-4">You haven't bookmarked any {activeTab} yet.</p>
            <Link href={`/${activeTab}`} className="inline-block bg-[#1B2A6B] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#0d1635] transition-colors">
              Explore {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Link>
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <AnimatedContent key={item.id} direction="up" delay={i * 0.05} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              
              {activeTab === "courses" && item.course && (
                <>
                  <div className="h-32 bg-slate-100 relative">
                    {item.course.thumbnail && <img src={item.course.thumbnail.startsWith('http') ? item.course.thumbnail : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.blueboxx.in'}/storage/${item.course.thumbnail}`} alt={item.course.title} className="w-full h-full object-cover" />}
                    <button onClick={() => handleRemove("course", item.id)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-black text-slate-800 line-clamp-2 mb-2">{item.course.title}</h3>
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <span className="font-black text-[#1B2A6B]">{item.course.price ? `₹${item.course.price}` : "Free"}</span>
                      <Link href={`/courses/${item.course.slug}`} className="text-[#C9A227] text-xs font-bold flex items-center gap-1 hover:underline">
                        View Details <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {(activeTab === "jobs" || activeTab === "internships") && (item.job || item.internship) && (
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {/* Logo placeholder */}
                      <Briefcase size={20} className="text-slate-400" />
                    </div>
                    <button onClick={() => handleRemove(activeTab.slice(0, -1), item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="font-black text-slate-800 text-lg line-clamp-1 mb-1">{(item.job || item.internship).title}</h3>
                  <p className="text-sm font-semibold text-slate-500 mb-4">{(item.job || item.internship).company_name}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">{(item.job || item.internship).location}</span>
                    <Link href={`/${activeTab}/${(item.job || item.internship).slug}`} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-black hover:bg-blue-100 transition-colors">
                      Apply Now
                    </Link>
                  </div>
                </div>
              )}
            </AnimatedContent>
          ))
        )}
      </div>
    </StudentDashboardLayout>
  );
}
