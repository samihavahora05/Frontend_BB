import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { Button } from "./Button";
import { JobData, useMockData } from "../../context/MockDataContext";
import toast from "react-hot-toast";

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobData | null;
}

export const EditJobModal = ({ isOpen, onClose, job }: EditJobModalProps) => {
  const { editJob } = useMockData();
  const [formData, setFormData] = useState<Partial<JobData>>({});

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        type: job.type,
        location: job.location,
        status: job.status
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editJob(job.id, formData);
    toast.success("Job updated successfully!");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="text-xl font-bold text-slate-900">Edit Job Posting</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-colors"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Type</label>
                <select
                  value={formData.type || ""}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-colors"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status || ""}
                  onChange={e => setFormData({ ...formData, status: e.target.value as JobData["status"] })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A6B] focus:bg-white transition-colors"
                required
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" onClick={onClose} variant="outline" className="bg-white">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="gap-2 px-6">
                <Save size={16} /> Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
