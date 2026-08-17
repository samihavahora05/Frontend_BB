import { CompaniesDashboardLayout } from "../../../src/layout/CompaniesDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Save, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMockData } from "../../../src/context/MockDataContext";
import toast from "react-hot-toast";

export default function CreateJobPage() {
  const router = useRouter();
  const { addJob } = useMockData();
  const [formData, setFormData] = useState({
    title: "",
    type: "Full-time",
    location: "",
  });

  const handleSaveDraft = () => {
    addJob({
      title: formData.title || "Untitled Draft",
      type: formData.type,
      location: formData.location || "TBD",
      status: "Closed" // Treating drafts as closed for now
    });
    toast.success("Job Draft Saved");
    router.push("/companies/jobs");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      toast.error("Please fill in required fields.");
      return;
    }
    addJob({
      title: formData.title,
      type: formData.type,
      location: formData.location,
      status: "Pending Approval"
    });
    toast.success("Job Submitted for Approval");
    router.push("/companies/jobs");
  };

  return (
    <CompaniesDashboardLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        
        <AnimatedContent direction="down" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/companies/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors">
              <ArrowLeft size={16} /> Back to Jobs
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" onClick={handleSaveDraft} variant="outline" className="gap-2 bg-white shadow-sm"><Save size={16}/> Save Draft</Button>
            <Button type="submit" variant="primary" className="shadow-md shadow-blue-500/20 gap-2"><Send size={16}/> Submit for Approval</Button>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2}>
          <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-8 space-y-8">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Basic Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Job Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Frontend Developer" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Employment Type <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Location <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Bangalore or Remote" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Work Model <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
                      <option>On-site</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Compensation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Minimum Salary / Stipend</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input type="number" placeholder="e.g. 500000" className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Maximum Salary / Stipend</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input type="number" placeholder="e.g. 800000" className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Job Description</h2>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">About the Role <span className="text-red-500">*</span></label>
                  <textarea rows={6} placeholder="Describe the responsibilities and day-to-day work..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Requirements & Skills</label>
                  <textarea rows={4} placeholder="List the required skills, experience, and qualifications..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>

            </CardContent>
          </Card>
        </AnimatedContent>
      </form>
    </CompaniesDashboardLayout>
  );
}
