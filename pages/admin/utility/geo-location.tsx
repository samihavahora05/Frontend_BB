import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  MapPin, Globe, Map, Navigation, 
  Users, Activity, Filter, Search, Download,
  MoreVertical, Eye, MapPinned, Clock, Laptop, MonitorSmartphone, X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadLocation {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  ip: string;
  country: string;
  state: string;
  city: string;
  lat: number;
  lng: number;
  browser: string;
  device: string;
  os: string;
  timezone: string;
  submittedTime: string;
}

const MOCK_LEADS: LeadLocation[] = [
  { id: 'LD-001', name: 'Rajesh Kumar', email: 'rajesh@techcorp.in', phone: '+91 9876543210', company: 'TechCorp India', message: 'Looking for corporate training on Advanced React.', ip: '122.161.43.12', country: 'India', state: 'Maharashtra', city: 'Mumbai', lat: 19.0760, lng: 72.8777, browser: 'Chrome', device: 'Desktop', os: 'Windows 11', timezone: 'IST (UTC+5:30)', submittedTime: '2023-10-25 10:30 AM' },
  { id: 'LD-002', name: 'Priya Sharma', email: 'priya.design@gmail.com', phone: '+91 8765432109', company: 'Freelance', message: 'Do you offer UI/UX certification for teams?', ip: '49.32.11.89', country: 'India', state: 'Delhi', city: 'New Delhi', lat: 28.6139, lng: 77.2090, browser: 'Safari', device: 'Mobile', os: 'iOS 16', timezone: 'IST (UTC+5:30)', submittedTime: '2023-10-25 11:15 AM' },
  { id: 'LD-003', name: 'Amit Patel', email: 'amit@gujarattech.in', phone: '+91 7654321098', company: 'GujaratTech', message: 'Interested in partnering for student placements.', ip: '103.45.67.89', country: 'India', state: 'Gujarat', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, browser: 'Firefox', device: 'Desktop', os: 'macOS', timezone: 'IST (UTC+5:30)', submittedTime: '2023-10-25 01:45 PM' },
  { id: 'LD-004', name: 'John Doe', email: 'john.doe@global.com', phone: '+1 202-555-0198', company: 'Global Ed', message: 'Can international students enroll in live classes?', ip: '104.28.33.19', country: 'United States', state: 'New York', city: 'New York', lat: 40.7128, lng: -74.0060, browser: 'Edge', device: 'Desktop', os: 'Windows 10', timezone: 'EST (UTC-5)', submittedTime: '2023-10-25 08:20 PM' },
  { id: 'LD-005', name: 'Sneha Reddy', email: 'sneha@innovate.co.in', phone: '+91 6543210987', company: 'Innovate Solutions', message: 'Need pricing for bulk course purchases.', ip: '115.99.23.41', country: 'India', state: 'Karnataka', city: 'Bangalore', lat: 12.9716, lng: 77.5946, browser: 'Chrome', device: 'Tablet', os: 'Android', timezone: 'IST (UTC+5:30)', submittedTime: '2023-10-26 09:10 AM' },
];

export default function GeoLocationPage() {
  const [leads, setLeads] = useState<LeadLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  const [selectedLead, setSelectedLead] = useState<LeadLocation | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);

  useEffect(() => {
    // Simulate API Load
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 600));
      setLeads(MOCK_LEADS);
      setIsLoading(false);
    };
    loadData();
  }, []);

  let filtered = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.country.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (activeTab === 'India') {
    filtered = filtered.filter(l => l.country === 'India');
  } else if (activeTab === 'International') {
    filtered = filtered.filter(l => l.country !== 'India');
  }

  const stats = {
    total: leads.length,
    india: leads.filter(l => l.country === 'India').length,
    intl: leads.filter(l => l.country !== 'India').length,
    today: 2,
    topCity: 'Mumbai',
    conversion: '12.5%'
  };

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type}...`);
  };

  const viewLead = (lead: LeadLocation) => {
    setSelectedLead(lead);
    setIsViewDrawerOpen(true);
  };

  // Simple bounding box for iframe map (defaults to India, switches to specific lead if selected)
  const defaultBbox = "68.1,7.9,97.4,35.7";
  const iframeSrc = selectedLead 
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${selectedLead.lng - 0.1},${selectedLead.lat - 0.1},${selectedLead.lng + 0.1},${selectedLead.lat + 0.1}&layer=mapnik&marker=${selectedLead.lat},${selectedLead.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${defaultBbox}&layer=mapnik`;

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Geo Location Leads | BlueBoxx DA</title>
      </Head>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">Geo Location Management</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Track, analyze, and manage incoming contact leads across the globe.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => handleExport('CSV')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => handleExport('Excel')} className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#121c47] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors">
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total Visitors" value={stats.total} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard title="India Visitors" value={stats.india} icon={MapPin} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Intl Visitors" value={stats.intl} icon={Globe} color="bg-purple-50 text-purple-600" />
        <StatCard title="Today's Requests" value={stats.today} icon={Activity} color="bg-amber-50 text-amber-600" />
        <StatCard title="Top City" value={stats.topCity} icon={Map} color="bg-indigo-50 text-indigo-600" isText />
        <StatCard title="Conversion Rate" value={stats.conversion} icon={Navigation} color="bg-emerald-50 text-emerald-600" isText />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        
        {/* Left Side - Interactive Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative group">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white flex items-center gap-2 text-sm font-black text-slate-800">
            <MapPinned size={18} className="text-[#1B2A6B]" /> Live Contact Heat Map
          </div>
          
          {selectedLead && (
             <div className="absolute top-4 right-4 z-10">
               <button onClick={() => setSelectedLead(null)} className="px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                 Reset Map View
               </button>
             </div>
          )}

          {/* Map Embedding (OSM) */}
          <div className="flex-1 w-full bg-slate-100 relative grayscale-[30%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src={iframeSrc} 
              className="w-full h-full border-none"
            />
            {/* Visual overlay to make it look premium */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]"></div>
          </div>
        </div>

        {/* Right Side - List & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Recent Leads</h2>
              <button className="text-slate-400 hover:text-[#1B2A6B]"><Filter size={16}/></button>
            </div>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search name, city or country..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1B2A6B] shadow-sm" />
            </div>

            <div className="flex bg-slate-200/50 p-1 rounded-lg">
              {['All', 'India', 'International'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-black rounded-md transition-all ${activeTab === tab ? 'bg-white text-[#1B2A6B] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto admin-scrollbar p-2">
            {isLoading ? (
              <div className="p-4 space-y-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center p-8">
                <MapPin size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-500">No locations found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(lead => (
                  <div 
                    key={lead.id} 
                    onClick={() => viewLead(lead)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedLead?.id === lead.id ? 'bg-[#1B2A6B]/5 border-[#1B2A6B]/20' : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 text-sm">{lead.name}</h4>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{lead.id}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5 line-clamp-1"><MapPin size={12}/> {lead.city}, {lead.country}</p>
                    <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5"><Clock size={12}/> {lead.submittedTime}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer for Lead Details */}
      {isViewDrawerOpen && selectedLead && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={() => setIsViewDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-800">Lead Insights</h2>
              <button onClick={() => setIsViewDrawerOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
              
              {/* Profile Block */}
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
                  {selectedLead.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-black text-slate-800">{selectedLead.name}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-1">{selectedLead.email}</p>
                <p className="text-sm font-bold text-[#1B2A6B]">{selectedLead.phone}</p>
              </div>

              {/* Message Block */}
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Message / Enquiry</h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{selectedLead.message}"</p>
                </div>
              </div>

              {/* Geo Location Block */}
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Geo Location</h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Country</p>
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Globe size={14} className="text-blue-500"/> {selectedLead.country}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">State</p>
                    <p className="text-sm font-bold text-slate-800">{selectedLead.state}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">City</p>
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><MapPin size={14} className="text-emerald-500"/> {selectedLead.city}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Timezone</p>
                    <p className="text-sm font-bold text-slate-800">{selectedLead.timezone}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 mt-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coordinates</p>
                    <p className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-1 rounded inline-block border border-slate-200">
                      Lat: {selectedLead.lat}, Lng: {selectedLead.lng}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Info Block */}
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">System Information</h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">IP Address</p>
                    <p className="text-sm font-bold text-slate-800">{selectedLead.ip}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Device</p>
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                      {selectedLead.device === 'Mobile' ? <MonitorSmartphone size={14}/> : <Laptop size={14}/>} {selectedLead.device}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">OS</p>
                    <p className="text-sm font-bold text-slate-800">{selectedLead.os}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">Browser</p>
                    <p className="text-sm font-bold text-slate-800">{selectedLead.browser}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color, isText = false }: { title: string, value: string | number, icon: any, color: string, isText?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <h3 className={`${isText ? 'text-lg' : 'text-xl'} font-black text-slate-800 leading-none truncate max-w-[100px]`}>{value}</h3>
      </div>
    </div>
  );
}
