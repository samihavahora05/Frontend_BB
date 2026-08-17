import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { Building, Filter, Search, CheckCircle2, XCircle, Mail, MapPin } from "lucide-react";
import { Button } from "../../../src/components/ui/Button";
import { Badge } from "../../../src/components/ui/Badge";
import { useState } from "react";

const INITIAL_ENQUIRIES = [
  { id: 1, college: "NIT Trichy", contactName: "Dr. A. Subramaniam", email: "dean@nitt.edu", location: "Tamil Nadu", date: "Oct 28, 2026", status: "Approved" },
  { id: 2, college: "Delhi University", contactName: "Prof. R. Gupta", email: "partnerships@du.ac.in", location: "New Delhi", date: "Oct 27, 2026", status: "Pending" },
  { id: 3, college: "Birla Institute of Technology", contactName: "S. K. Mishra", email: "admin@bit.edu", location: "Ranchi", date: "Oct 25, 2026", status: "Rejected" },
  { id: 4, college: "Vellore Institute of Technology", contactName: "K. Reddy", email: "placement@vit.ac.in", location: "Vellore", date: "Oct 24, 2026", status: "Pending" },
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);

  const updateStatus = (id: number, newStatus: string) => {
     setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <AnimatedContent direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">College Enquiries</h1>
            <p className="text-slate-500 text-sm">Review partnership applications from colleges and institutions.</p>
          </div>
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
             <div className="px-4 py-2 text-sm font-bold bg-[#1B2A6B] text-white rounded-lg">Inbox</div>
             <div className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 cursor-pointer">Archived</div>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
             <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search by college or contact name..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B2A6B]" />
             </div>
             <Button variant="outline" className="gap-2 bg-white"><Filter size={16}/> Filters</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Institution Details</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Date Received</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                       <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Building size={14} className="text-slate-400" /> {enq.college}
                       </p>
                       <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {enq.location}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-semibold text-slate-800 text-sm">{enq.contactName}</p>
                       <p className="text-xs font-medium text-blue-600 flex items-center gap-1 mt-1"><Mail size={12}/> {enq.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{enq.date}</td>
                    <td className="px-6 py-4">
                       <Badge variant={enq.status === 'Approved' ? 'success' : enq.status === 'Rejected' ? 'danger' : 'warning'}>{enq.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {enq.status === 'Pending' ? (
                         <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => updateStatus(enq.id, 'Rejected')} className="h-8 text-xs font-bold px-3 gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 bg-white"><XCircle size={14}/> Reject</Button>
                            <Button variant="primary" onClick={() => updateStatus(enq.id, 'Approved')} className="h-8 text-xs font-bold px-3 gap-1.5 bg-emerald-600 border-emerald-600 hover:bg-emerald-700 shadow-sm"><CheckCircle2 size={14}/> Approve</Button>
                         </div>
                       ) : (
                         <span className="text-xs font-medium text-slate-400 italic">Resolved</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedContent>
      </div>
    </AdminDashboardLayout>
  );
}
