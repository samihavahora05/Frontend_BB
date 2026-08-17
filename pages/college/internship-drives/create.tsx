import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CollegeDashboardLayout } from "../../../src/layout/CollegeDashboardLayout";
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import Link from 'next/link';
import api from '../../../src/lib/axios';
import toast from 'react-hot-toast';

export default function CreateInternshipDrive() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blueboxxAdminId, setBlueboxxAdminId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/college/blueboxx-admin').then(res => {
      if (res.data?.data?.id) setBlueboxxAdminId(res.data.data.id);
    }).catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    internship_type: 'Paid',
    duration: '3 Months',
    status: 'pending',
    application_deadline: ''
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/college/internship-drives', {
        ...formData,
        company_id: blueboxxAdminId,
        drive_type: 'internship_drive',
      });
      toast.success('Internship Drive Created!');
      router.push('/college/internship-drives');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollegeDashboardLayout>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/college/internship-drives" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Create Internship Drive</h1>
          <p className="text-slate-500 font-medium text-sm">Set up a new campus internship drive powered by BlueBoxx DA.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Drive Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Internship Drive Title</label>
              <input
                required
                type="text"
                placeholder="e.g. BlueBoxx Summer Internship Drive 2026"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea
                required
                placeholder="Briefly describe the internship role, responsibilities, and requirements..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full h-24 p-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none resize-none"
              />
            </div>

            {/* Powered By - Read Only */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Powered By</label>
              <div className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <div className="w-6 h-6 bg-[#1B2A6B] rounded-md flex items-center justify-center">
                  <Building2 size={13} className="text-white" />
                </div>
                <span className="text-sm font-bold text-slate-700">BlueBoxx DA Pvt. Ltd.</span>
                <span className="ml-auto text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 uppercase tracking-wider">Official Partner</span>
              </div>
              <p className="text-[11px] text-slate-400">All internship drives are created in collaboration with BlueBoxx DA only.</p>
            </div>

            {/* Internship Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Internship Type</label>
              <select
                required
                value={formData.internship_type}
                onChange={e => setFormData({...formData, internship_type: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Stipend">Stipend Based</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Duration</label>
              <select
                required
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
              >
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Application Deadline</label>
              <input
                type="date"
                value={formData.application_deadline}
                onChange={e => setFormData({...formData, application_deadline: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Initial Status</label>
              <select
                required
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B] outline-none"
              >
                <option value="pending">Submit for Approval</option>
                <option value="draft">Save as Draft</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/college/internship-drives" className="h-11 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm flex items-center hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
            <button
              disabled={loading}
              type="submit"
              className="h-11 px-6 rounded-xl bg-[#1B2A6B] text-white font-bold text-sm flex items-center gap-2 hover:bg-[#0d1635] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : <><Save size={16} /> Create Drive</>}
            </button>
          </div>
        </form>
      </div>
    </CollegeDashboardLayout>
  );
}
