import { useState } from "react";
import { CompaniesDashboardLayout } from "../../../src/layout/CompaniesDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye, Users, Briefcase } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { useConfirm } from "../../../src/context/ConfirmContext";
import { useMockData, JobData } from "../../../src/context/MockDataContext";
import { EditJobModal } from "../../../src/components/ui/EditJobModal";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CompanyJobsPage() {
  const confirm = useConfirm();
  const { jobs, deleteJob } = useMockData();
  const [editingJob, setEditingJob] = useState<JobData | null>(null);

  const handleDelete = async (job: JobData) => {
    if (await confirm({
      title: "Delete Job Posting?",
      description: `Are you sure you want to delete "${job.title}"? All applicants and data associated with this job will be permanently removed.`,
      confirmText: "Delete Job",
      isDestructive: true
    })) {
      deleteJob(job.id);
      toast.success(`Deleted ${job.title}`);
    }
  };

  return (
    <CompaniesDashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Job Postings</h1>
            <p className="text-slate-500 text-sm">Manage your active jobs and track their performance.</p>
          </div>
          <Link href="/companies/jobs/create">
            <Button variant="primary" className="shadow-md shadow-blue-500/20 gap-2"><Plus size={18}/> Post New Job</Button>
          </Link>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2}>
          <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Closed</option>
                </select>
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Types</option>
                  <option>Full-time</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {jobs.map((job, index) => (
                    <AnimatedContent 
                      key={job.id} 
                      direction="up" 
                      delay={0.1 * index}
                      className="p-4 sm:p-6 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{job.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{job.type}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{job.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:w-3/5 gap-4">
                          <div className="w-1/3">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              job.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          
                          <div className="w-1/3 text-sm font-medium text-slate-500">
                            {job.posted}
                          </div>

                          <div className="w-1/3 flex items-center justify-end gap-6">
                            <div className="text-center hidden sm:block">
                              <p className="text-sm font-bold text-slate-900">{job.applicants}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apps</p>
                            </div>
                            <div className="text-center hidden sm:block">
                              <p className="text-sm font-bold text-slate-900">{job.views}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Views</p>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <button onClick={() => toast.success(`Viewing applicants for ${job.title}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Applicants">
                                <Users size={16} />
                              </button>
                              <button onClick={() => setEditingJob(job)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(job)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnimatedContent>
                  ))}
                  
                  {jobs.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Briefcase size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">No Jobs Posted</h3>
                      <p className="text-sm text-slate-500 mb-6">You haven't posted any jobs yet.</p>
                      <Link href="/companies/jobs/create">
                        <Button variant="primary" className="mx-auto">Post Your First Job</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        </AnimatedContent>
      </div>
      
      <EditJobModal 
        isOpen={!!editingJob} 
        onClose={() => setEditingJob(null)} 
        job={editingJob} 
      />
    </CompaniesDashboardLayout>
  );
}
