import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { Button } from "../../../src/components/ui/Button";
import { Search, Filter, ShieldCheck, XCircle, FileText, CheckCircle2, User, Building2, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminVerificationsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectApp, setRejectApp] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [applications, setApplications] = useState([
    { id: 1, name: "Rahul Sharma", email: "rahul@sharmatech.com", role: "expert", type: "Industry Expert", date: "2 mins ago", status: "pending", docName: "Resume & LinkedIn Profile", docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: 2, name: "Acme Corp", email: "hr@acme.com", role: "company", type: "Company", date: "1 hr ago", status: "pending", docName: "GST Certificate & Incorporation Letter", docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: 3, name: "VIT University", email: "registrar@vit.edu", role: "college", type: "College", date: "3 hrs ago", status: "pending", docName: "UGC Affiliation Document", docUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  ]);

  const handleApprove = (id: number, name: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    toast.success(`${name} has been approved.`);
    
    // Simulate sending email and SMS notification to the user
    setTimeout(() => {
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Notification Sent 📧📱</span>
          <span className="text-xs mt-1">Approval email and SMS successfully sent to {name} with their dashboard access link.</span>
        </div>,
        { duration: 5000 }
      );
    }, 800);
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason) return;
    
    setApplications(prev => prev.filter(app => app.id !== rejectApp.id));
    toast.error(`${rejectApp.name}'s application was rejected. Reason: ${rejectReason}`);
    setRejectApp(null);
    setRejectReason("");
  };

  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === "all" || app.role === filter;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminDashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Verifications</h1>
            <p className="text-slate-500 font-medium">Review and approve pending accounts to ensure platform quality.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search applications..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 outline-none text-sm font-semibold" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(27,42,107,0.04)] overflow-hidden">
          <div className="flex border-b border-slate-100 p-2">
            {["all", "expert", "company", "college"].map((f) => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${filter === f ? "bg-blue-50 text-[#1B2A6B]" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {f === "all" ? "All Pending" : `${f}s`}
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => (
              <div key={app.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    app.role === "expert" ? "bg-purple-50 text-purple-600" :
                    app.role === "company" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {app.role === "expert" && <User size={24} />}
                    {app.role === "company" && <Building2 size={24} />}
                    {app.role === "college" && <Briefcase size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{app.name}</h3>
                    <p className="text-sm font-semibold text-slate-400">{app.email}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1.5">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">{app.type}</span>
                      <span>•</span>
                      <span>Applied {app.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Button 
                    onClick={() => setSelectedApp(app)}
                    variant="outline"
                    className="h-10 px-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-xs"
                  >
                    <FileText size={16} /> View Docs
                  </Button>
                  <Button 
                    onClick={() => handleApprove(app.id, app.name)}
                    className="h-10 px-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-xl transition-all flex items-center gap-2 text-xs border border-emerald-100"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </Button>
                  <Button 
                    onClick={() => setRejectApp(app)}
                    className="h-10 px-4 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl transition-all flex items-center gap-2 text-xs border border-rose-100"
                  >
                    <XCircle size={16} /> Reject
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredApps.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-medium flex flex-col items-center">
                <ShieldCheck size={48} className="mb-4 text-slate-300" />
                <p>No pending applications matching criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Document Verification</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Review credentials uploaded by {selectedApp.name}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Document Type</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedApp.docName}</p>
                </div>
                <a 
                  href={selectedApp.docUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  View Document PDF
                </a>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-[1.414] bg-slate-100 flex flex-col items-center justify-center p-4">
                <FileText size={48} className="text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-600">Verification Document Preview</p>
                <p className="text-xs text-slate-400 text-center mt-1">BlueBoxx Verified Security Credential Token attached.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedApp(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Reject Application</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Provide a reason for rejecting {rejectApp.name}</p>
              </div>
              <button onClick={() => setRejectApp(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleRejectConfirm} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rejection Reason</label>
                <select 
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="" disabled>Select reason</option>
                  <option value="Invalid documents provided">Invalid documents provided</option>
                  <option value="Incorrect details filled in profile">Incorrect details filled in profile</option>
                  <option value="Qualifications do not match criteria">Qualifications do not match criteria</option>
                  <option value="Spam or fraudulent identity detected">Spam or fraudulent identity detected</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setRejectApp(null)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md">Confirm Reject</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
