import { useState } from "react";
import { CollegeDashboardLayout } from "../../../src/layout/CollegeDashboardLayout";
import { BookOpen, Plus, Search, Filter, MoreVertical, Edit, Copy, UploadCloud, Archive, Trash, XCircle, Download, Users } from "lucide-react";
import Link from "next/link";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";

const fetcher = (url: string) => api.get(url).then(res => res.data);

const DriveRow = ({ drive, mutate }: { drive: any, mutate: any }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAction = async (action: string) => {
    setMenuOpen(false);
    try {
      if (action === 'duplicate') {
        await api.post(`/college/internship-drives/${drive.id}/duplicate`);
        toast.success('Drive duplicated!');
      } else if (action === 'publish') {
        await api.put(`/college/internship-drives/${drive.id}/publish`);
        toast.success('Submitted for approval!');
      } else if (action === 'close') {
        await api.put(`/college/internship-drives/${drive.id}/close`);
        toast.success('Drive closed!');
      } else if (action === 'archive') {
        await api.put(`/college/internship-drives/${drive.id}/archive`);
        toast.success('Drive archived!');
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this drive?')) {
          await api.delete(`/college/internship-drives/${drive.id}`);
          toast.success('Drive deleted!');
        }
      }
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
            <BookOpen size={13} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{drive.title}</p>
            <p className="text-[10px] text-slate-500">{drive.internship_type || 'Internship'}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">BlueBoxx DA</td>
      <td className="py-3.5 px-4">
        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
          drive.status === 'open' || drive.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          drive.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          drive.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-slate-50 text-slate-500 border-slate-200'
        }`}>
          {drive.status}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <span className="text-xs font-bold text-slate-700">{drive.applications_count || 0}</span>
        <span className="text-[10px] text-slate-400 ml-1">apps</span>
      </td>
      <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
        {drive.application_deadline ? new Date(drive.application_deadline).toLocaleDateString('en-IN') : '—'}
      </td>
      <td className="py-3.5 px-4 text-right relative">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 ml-auto transition-colors"
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-4 top-10 w-48 bg-white border border-slate-200 shadow-xl rounded-xl z-20 py-1 overflow-hidden">
              <button onClick={() => setMenuOpen(false)} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Edit size={13} /> Edit Drive
              </button>
              <button onClick={() => handleAction('duplicate')} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Copy size={13} /> Duplicate
              </button>
              {(drive.status === 'draft' || drive.status === 'rejected') && (
                <button onClick={() => handleAction('publish')} className="w-full px-4 py-2 text-left text-xs font-medium text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                  <UploadCloud size={13} /> Submit for Approval
                </button>
              )}
              {drive.status === 'open' && (
                <button onClick={() => handleAction('close')} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <XCircle size={13} /> Close Drive
                </button>
              )}
              <button onClick={() => handleAction('archive')} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Archive size={13} /> Archive
              </button>
              <hr className="my-1 border-slate-100" />
              <button onClick={() => setMenuOpen(false)} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Users size={13} /> View Applicants
              </button>
              <button onClick={() => {
                setMenuOpen(false);
                toast.success('Export started!');
              }} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Download size={13} /> Export Applicants
              </button>
              <hr className="my-1 border-slate-100" />
              <button onClick={() => handleAction('delete')} className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                <Trash size={13} /> Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
};

export default function InternshipDrivesPage() {
  const { data, isLoading, mutate } = useSWR("/college/internship-drives", fetcher);
  const drives = data?.data || [];

  return (
    <CollegeDashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Internship Drives</h1>
          <p className="text-slate-500 font-medium text-sm">Manage on-campus internship drives and student applications.</p>
        </div>
        <Link href="/college/internship-drives/create" className="flex items-center gap-2 h-10 px-5 bg-[#1B2A6B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#0d1635] transition-colors">
          <Plus size={15} /> Create Internship
        </Link>
      </div>

      <AnimatedContent direction="up" delay={0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search internship drives..." className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none transition-all" />
          </div>
          <button className="flex items-center justify-center gap-2 h-10 px-4 bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors shrink-0">
            <Filter size={15} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="py-3 px-4">Drive Details</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applications</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400 text-xs">Loading drives...</td></tr>
              ) : drives.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen size={20} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">No internship drives found</p>
                    <p className="text-xs text-slate-400 mt-1">Create your first internship drive to start recruiting.</p>
                  </td>
                </tr>
              ) : (
                drives.map((drive: any) => (
                  <DriveRow key={drive.id} drive={drive} mutate={mutate} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedContent>
    </CollegeDashboardLayout>
  );
}
