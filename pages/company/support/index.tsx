import React, { useState, useEffect } from "react";
import { CompanyDashboardLayout } from "../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { MessageSquare, Phone, Mail, ChevronRight, HelpCircle, Send, Paperclip, Clock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../../src/lib/axios";
import { useRouter } from "next/router";

const SUPPORT_ITEMS = [
  { title: "Chat with Support", desc: "Available 9AM-5PM EST", icon: MessageSquare, action: () => toast.success("Starting live chat...") },
  { title: "Schedule a Call", desc: "Speak with an account manager", icon: Phone, action: () => toast.success("Opening scheduling calendar...") },
  { title: "Email Support", desc: "Response within 24 hours", icon: Mail, action: () => window.location.href = "mailto:support@blueboxx.in" },
];

export default function CompanySupportPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    subject: "",
    priority: "Normal",
    description: ""
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/company/support/tickets');
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.description) return toast.error("Please fill all required fields");
    
    setSubmitting(true);
    try {
      const payload = {
        subject: form.subject,
        priority: form.priority,
        description: form.description
      };

      await axios.post('/company/support/tickets', payload);
      setSubmitted(true);
      toast.success("Ticket submitted successfully!");
      setForm({ subject: "", priority: "Normal", description: "" });
      fetchTickets();
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Closed': return 'text-slate-600 bg-slate-100 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <CompanyDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Support & Help Center</h1>
        <p className="text-slate-500 font-medium text-sm">Get help with your account, billing, or recruitment process.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links & History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Quick Contact</h3>
            {SUPPORT_ITEMS.map((item, i) => (
              <AnimatedContent key={i} direction="up" delay={i * 0.1} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer" onClick={item.action}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 text-[#1B2A6B]`}>
                  <item.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </AnimatedContent>
            ))}
          </div>

          <AnimatedContent direction="up" delay={0.4} className="bg-gradient-to-br from-[#1B2A6B] to-[#2E45A3] rounded-2xl p-6 text-white text-center shadow-lg shadow-[#1B2A6B]/20">
            <HelpCircle size={32} className="mx-auto mb-3 opacity-80" />
            <h3 className="text-sm font-black mb-1">Need Urgent Help?</h3>
            <p className="text-xs text-blue-100 mb-4">Call our dedicated enterprise support line.</p>
            <p className="font-black text-xl tracking-wider">+91 90235 12853</p>
          </AnimatedContent>
        </div>

        {/* Contact Form & Tickets */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatedContent direction="up" delay={0.2} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-100 pb-2">Submit a Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Subject</label>
                  <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Brief title of the issue" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none">
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={5} placeholder="Please describe your issue in detail..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none" />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {submitted ? (
                  <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg">Ticket submitted successfully!</span>
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => toast('Attachment feature is coming soon!', { icon: '🚧' })}
                      className="text-slate-500 hover:text-[#1B2A6B] flex items-center gap-2 text-sm font-bold transition-colors"
                    >
                      <Paperclip size={16} /> Attach File (Coming Soon)
                    </button>
                  </div>
                )}
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all disabled:opacity-70">
                  {submitting ? "Sending..." : <><Send size={16} /> Submit Ticket</>}
                </button>
              </div>
            </form>
          </AnimatedContent>

          {/* Ticket History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">Your Tickets</h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{tickets.length} Total</span>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-slate-500 animate-pulse">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">You don't have any open support tickets.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {tickets.map((ticket, i) => (
                  <div key={i} onClick={() => router.push(`/company/support/tickets/${ticket.id}`)} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-black text-[#1B2A6B]">{ticket.ticket_number}</span>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{ticket.subject}</h4>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString()} 
                        &bull; {ticket.messages?.length || 1} messages
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold border px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
