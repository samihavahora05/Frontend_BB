import React, { useState } from "react";
import { useRouter } from "next/router";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Briefcase, MapPin, Clock, IndianRupee, Search, ExternalLink, Bookmark, Sparkles, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import { RoleChangeModal } from "../../../src/components/common/RoleChangeModal";
import { useAuth } from "../../../src/context/AuthContext";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function JobsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const { data: responseData, isLoading } = useSWR("/public/jobs", fetcher);
  const jobs = responseData?.data || [];

  // Load which jobs are already saved
  const { mutate: mutateWishlist } = useSWR("/student/wishlist", (url) =>
    api.get(url).then(res => res.data.data)
  , {
    onSuccess: (data) => {
      if (data?.saved_job_ids) {
        setSavedIds(new Set(data.saved_job_ids.map(Number)));
      }
    }
  });

  const filtered = jobs.filter((i: any) =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSave = async (id: number) => {
    if (saving === id) return;
    setSaving(id);
    const isSaved = savedIds.has(id);
    try {
      if (isSaved) {
        await api.delete(`/student/save/job/${id}`);
        setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
        toast.success("Removed from saved items");
      } else {
        await api.post(`/student/save/job/${id}`);
        setSavedIds(prev => new Set([...prev, id]));
        toast.success("Job saved to your Saved Items!");
      }
      mutateWishlist();
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const handleApply = (id: number) => {
    router.push(`/jobs/${id}`);
  };

  return (
    <StudentDashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Explore Jobs</h1>
          <p className="text-slate-500 text-sm font-medium">Browse verified full-time positions from our corporate hiring partners.</p>
        </div>
      </div>

      {/* Student Job Permission Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 font-medium leading-relaxed">
            You are registered as a <strong>Student</strong>. Students can explore jobs and enroll in courses. To apply directly for full-time jobs, request a role change to <strong>Jobseeker</strong>.
          </p>
        </div>
        <button
          onClick={() => setShowRoleModal(true)}
          className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles size={13} /> Request Role Change
        </button>
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
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400 font-semibold animate-pulse">Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase size={24} />
          </div>
          <p className="text-sm font-black text-slate-600">No jobs available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item: any, idx: number) => {
            const tags = Array.isArray(item.required_skills)
              ? item.required_skills
              : (item.skills ? item.skills.split(",") : []);

            return (
              <AnimatedContent key={item.id} distance={20} direction="up" delay={idx * 0.05} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#1B2A6B] font-black flex items-center justify-center text-xs shrink-0 uppercase">
                        {item.company_name?.slice(0, 2) || "CO"}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-800 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-slate-400 font-semibold">{item.company_name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSave(item.id)}
                      disabled={saving === item.id}
                      className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                        savedIds.has(item.id)
                          ? "bg-amber-50 border-amber-200 text-amber-500"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:text-[#1B2A6B]"
                      }`}
                    >
                      <Bookmark size={14} className={savedIds.has(item.id) ? "fill-amber-500" : ""} />
                    </button>
                  </div>

                  <div className="space-y-1.5 mb-4 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-1.5"><MapPin size={11} className="shrink-0" /> <span className="line-clamp-1">{item.location}</span></div>
                    <div className="flex items-center gap-1.5"><Clock size={11} className="shrink-0" /> <span>{item.experience_level || 'Not specified'}</span></div>
                    <div className="flex items-center gap-1.5"><IndianRupee size={11} className="shrink-0" /> <span>{item.salary || 'Best in Industry'}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0, 3).map((t: string) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">{t.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold">Posted {item.posted_at}</span>
                  <button
                    onClick={() => handleApply(item.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#0d1635] transition-colors"
                  >
                    View Details <ExternalLink size={11} />
                  </button>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      )}

      {/* Role Change Modal */}
      {user && (
        <RoleChangeModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          currentRole={user.role || 'student'}
          targetRole="jobseeker"
          targetRoleDisplay="Jobseeker"
        />
      )}
    </StudentDashboardLayout>
  );
}
