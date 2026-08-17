import React, { useState } from "react";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  UserX, Search, Check, X, AlertCircle, Filter, Download
} from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../src/context/ConfirmContext";
import { UserManagerService } from "../../../src/lib/api/admin/UserManagerService";

export default function DeleteRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("pending");
  const confirmAction = useConfirm();
  
  const { data: requestsData, mutate, isLoading } = UserManagerService.useDeleteRequests();
  const requests = requestsData || [];

  const handleApprove = async (id: number, name: string) => {
    if (await confirmAction({ title: "Purge Data", description: `WARNING: This will permanently delete ${name}'s account and all associated data. Proceed?`, isDestructive: true })) {
      try {
        await UserManagerService.approveDeleteRequest(id);
        toast.success(`Account deletion approved for ${name}. Data purged.`);
        mutate();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to approve delete request');
      }
    }
  };

  const handleReject = async (id: number, name: string) => {
    const reason = window.prompt(`Please provide a reason for rejecting ${name}'s deletion request:`);
    if (reason === null) return;
    
    try {
      await UserManagerService.rejectDeleteRequest(id, reason || 'No reason provided.');
      toast.success(`Deletion request rejected for ${name}.`);
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject delete request');
    }
  };

  const filteredRequests = requests.filter((r: any) => {
    const matchesSearch = 
      r.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = r.status === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserX className="w-6 h-6 text-red-500" />
              Account Deletion Requests
            </h1>
            <p className="text-gray-500 mt-1">
              Review and manage user requests to permanently delete their accounts and data.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button onClick={() => {
              const toastId = toast.loading('Exporting delete requests...');
              UserManagerService.exportDeleteRequests().then(() => toast.success('Export successful', { id: toastId })).catch(() => toast.error('Export failed', { id: toastId }));
            }} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-orange-800 mb-1">Compliance Warning</h3>
            <p className="text-xs text-orange-700">
              Under GDPR and CCPA, you must process account deletion requests within 30 days. Approving a request will permanently remove the user's data from all databases and backups. This action cannot be reversed.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-6">
          {['pending', 'approved', 'rejected', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === tab ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900 capitalize">{activeTab} Requests</h2>
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason / Notes</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  {activeTab === 'pending' && <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-bold">Loading requests...</td></tr>
                )}
                {filteredRequests.map((req: any) => {
                  const name = req.user ? req.user.first_name + ' ' + req.user.last_name : 'Unknown User';
                  return (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{name}</p>
                          <p className="text-xs font-bold text-indigo-600">{req.user?.roles?.[0]?.name || 'User'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-gray-600">{req.user?.email}</p>
                      <p className="text-xs text-gray-500">{req.user?.phone || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-sm text-gray-700 italic truncate">"{req.reason || 'No specific reason provided'}"</p>
                      {req.notes && <p className="text-xs text-red-500 mt-1 truncate">Admin Note: {req.notes}</p>}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 font-medium">{new Date(req.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        req.status === 'pending' || req.status === 'under_review' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {activeTab === 'pending' && (
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleReject(req.id, name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(req.id, name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      </div>
                    </td>
                    )}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          
          {!isLoading && filteredRequests.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-gray-700 mb-1">No Requests Found</h3>
              <p className="text-sm font-semibold text-gray-400 max-w-sm">
                There are currently no {activeTab} account deletion requests matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
