import { AdminDashboardLayout } from "../../src/layout/AdminDashboardLayout";
import { Search, Plus, X, Trash2, Edit, Star, Briefcase } from "lucide-react";
import { Badge } from "../../src/components/ui/Badge";
import { MediaUploader } from "../../src/components/ui/MediaUploader";
import { useState } from "react";

const MOCK_PARTNERS = [
  { id: 1, name: "Netflix India", website: "https://netflix.com", category: "Entertainment", status: "Active", featured: true, order: 1, logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: 2, name: "Amazon", website: "https://amazon.com", category: "Technology", status: "Active", featured: true, order: 2, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { id: 3, name: "BlueBoxx DA", website: "https://blueboxx.in", category: "Education", status: "Active", featured: false, order: 3, logo: "/logoblack.png" },
];

export default function AdminClientsPage() {
  const [partners, setPartners] = useState(MOCK_PARTNERS);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("Technology");
  const [status, setStatus] = useState("Active");
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState("");

  const handleDeletePartner = (id: number) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      setPartners(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && logo) {
      const newPartner = {
        id: Date.now(),
        name,
        logo,
        website,
        category,
        status,
        featured,
        order: parseInt(order) || 99
      };
      setPartners(prev => [...prev, newPartner]);
      
      // Reset & close
      setName("");
      setLogo("");
      setWebsite("");
      setCategory("Technology");
      setStatus("Active");
      setFeatured(false);
      setOrder("");
      setIsAddModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold gap-1">Active</Badge>;
      case "Inactive": return <Badge className="bg-slate-100 text-slate-700 border-none font-bold gap-1">Inactive</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">Clients & Partners</h1>
          <p className="text-slate-500 font-medium text-sm">Manage the logos displayed on the homepage and partner sections.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#1B2A6B] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0d1635] transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Partner
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible flex flex-col min-h-[400px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search partners..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]"
            />
          </div>
        </div>

        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Company</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Details</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider">Featured</th>
                <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partners.sort((a, b) => a.order - b.order).map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-white border border-slate-200 rounded p-1 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{partner.name}</p>
                        <a href={partner.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{partner.website}</a>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                      {partner.category}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(partner.status)}
                  </td>
                  <td className="py-4 px-6">
                    {partner.featured ? (
                      <Star size={16} className="text-[#C9A227] fill-[#C9A227]" />
                    ) : (
                      <Star size={16} className="text-slate-300" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDeletePartner(partner.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center"
                      title="Delete Partner"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Partner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl shadow-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                 <h2 className="text-xl font-black text-slate-800">Add Client / Partner</h2>
                 <p className="text-xs font-semibold text-slate-500 mt-1">Upload a logo to show on the frontend.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-white shadow-sm border border-slate-200 p-2 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
               <form id="create-partner-form" onSubmit={handleAddPartner} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     
                     <div className="md:col-span-2">
                       <MediaUploader
                         label="Company Logo"
                         accept="image/*"
                         value={logo}
                         onUploadSuccess={setLogo}
                       />
                     </div>

                     <div className="space-y-1.5 md:col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                       <input 
                         type="text" required placeholder="e.g. Netflix"
                         value={name} onChange={(e) => setName(e.target.value)}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                       <input 
                         type="url" placeholder="https://"
                         value={website} onChange={(e) => setWebsite(e.target.value)}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                       <select 
                         value={category} onChange={(e) => setCategory(e.target.value)}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       >
                         <option value="Technology">Technology</option>
                         <option value="Education">Education</option>
                         <option value="Entertainment">Entertainment</option>
                         <option value="Finance">Finance</option>
                         <option value="Other">Other</option>
                       </select>
                     </div>
                     
                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Order</label>
                       <input 
                         type="number" placeholder="e.g. 1"
                         value={order} onChange={(e) => setOrder(e.target.value)}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       />
                     </div>

                     <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                       <select 
                         value={status} onChange={(e) => setStatus(e.target.value)}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                       >
                         <option value="Active">Active</option>
                         <option value="Inactive">Inactive</option>
                       </select>
                     </div>

                     <div className="md:col-span-2 pt-2">
                       <label className="flex items-center gap-3 cursor-pointer">
                         <div className={`w-10 h-6 rounded-full p-1 transition-colors ${featured ? 'bg-[#1B2A6B]' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${featured ? 'translate-x-4' : 'translate-x-0'}`} />
                         </div>
                         <input 
                           type="checkbox" 
                           checked={featured} 
                           onChange={(e) => setFeatured(e.target.checked)}
                           className="hidden"
                         />
                         <span className="text-sm font-bold text-slate-700">Feature on Homepage</span>
                       </label>
                     </div>
                  </div>
               </form>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex gap-4 justify-end">
              <button 
                type="button" onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" form="create-partner-form"
                className="px-8 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Save Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
