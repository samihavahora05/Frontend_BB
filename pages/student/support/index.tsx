import React, { useState } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Send, Mail, Phone, CheckCircle2, FileText, Clock } from "lucide-react";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

const FAQS = [
  { q: "How do I access my enrolled courses?", a: "Go to 'My Courses' from the sidebar. All your enrolled courses will appear there with your progress." },
  { q: "Can I download my certificate after completing a course?", a: "Yes! Once you complete 100% of the course, go to 'Certificates' in the sidebar to download or share your certificate." },
  { q: "How do I reschedule a mock interview?", a: "Go to 'Mock Interviews', find your scheduled interview, and click 'Reschedule'. You can change the time up to 24 hours before the session." },
  { q: "What happens if I miss a live class?", a: "Don't worry! All live classes are recorded. Go to 'Live Classes' → 'Recorded' to watch the session anytime." },
  { q: "How do I apply for an internship?", a: "Navigate to 'Internships' from the sidebar, browse opportunities, and click 'Apply Now' on any listing that interests you." },
  { q: "How do I update my resume?", a: "Use the 'Resume Builder' in the sidebar to update your information. Your changes are saved automatically and reflected instantly in the preview." },
  { q: "Can I get a refund for a course?", a: "Refunds are available within 7 days of purchase if less than 20% of the course has been completed. Contact support for assistance." },
];

const TicketDetails = ({ ticketId }: { ticketId: number }) => {
  const { data, mutate } = useSWR(`/student/support/${ticketId}`, fetcher);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setSending(true);
    try {
      await api.post(`/student/support/${ticketId}/reply`, { message: replyMessage });
      setReplyMessage("");
      mutate();
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (!data) return <div className="p-4 text-center text-slate-400 text-xs animate-pulse">Loading messages...</div>;

  return (
    <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
      <div className="max-h-60 overflow-y-auto space-y-3 pr-2" style={{ scrollbarWidth: "thin" }}>
        {data.messages?.map((msg: any) => (
          <div key={msg.id} className={`flex flex-col ${msg.is_admin_reply ? 'items-start' : 'items-end'}`}>
            <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${msg.is_admin_reply ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm' : 'bg-[#1B2A6B] text-white rounded-tr-sm'}`}>
              <p>{msg.message}</p>
            </div>
            <span className="text-[9px] text-slate-400 font-bold mt-1 px-1">
              {msg.is_admin_reply ? 'Support Team' : 'You'} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
      </div>
      {data.status !== 'Closed' && (
        <form onSubmit={handleReply} className="flex gap-2">
          <input
            type="text"
            value={replyMessage}
            onChange={e => setReplyMessage(e.target.value)}
            placeholder="Type a reply..."
            className="flex-1 px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1B2A6B] focus:ring-1 focus:ring-[#1B2A6B]"
          />
          <button type="submit" disabled={sending || !replyMessage.trim()} className="bg-[#1B2A6B] text-white px-4 py-2 flex items-center justify-center rounded-xl disabled:opacity-50 hover:bg-[#0d1635] transition-colors">
            <Send size={15} />
          </button>
        </form>
      )}
    </div>
  );
};

export default function SupportPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);
  const [subject, setSubject] = useState("Technical Issue");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const { data: tickets, mutate } = useSWR("/student/support", fetcher);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await api.post("/student/support", {
        subject,
        message,
        priority: "Normal",
      });
      setTicketNumber(res.data?.data?.ticket_number || "");
      setSent(true);
      setMessage("");
      toast.success("Support ticket submitted successfully!");
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit ticket. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Help & Support</h1>
        <p className="text-slate-500 text-sm font-medium">Find answers to common questions or reach out to our team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left – FAQ & Tickets */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* My Tickets */}
          <div>
            <h2 className="text-sm font-black text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={14} /> My Tickets
            </h2>
            
            {!tickets ? (
              <div className="text-center py-8 text-slate-400 text-sm font-bold animate-pulse">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                <p className="text-sm font-bold text-slate-500">You haven't submitted any support tickets yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket: any, i: number) => (
                  <AnimatedContent key={ticket.id} direction="up" delay={i * 0.05} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div 
                      onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black text-[#1B2A6B] bg-blue-50 px-2 py-0.5 rounded-lg">{ticket.ticket_number}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${ticket.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{ticket.status}</span>
                        </div>
                        <p className="font-bold text-sm text-slate-800">{ticket.subject}</p>
                      </div>
                      <div className="text-right text-xs text-slate-400 font-semibold flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                        {expandedTicket === ticket.id ? <ChevronUp size={14} className="mt-1 shrink-0" /> : <ChevronDown size={14} className="mt-1 shrink-0" />}
                      </div>
                    </div>
                    {expandedTicket === ticket.id && <TicketDetails ticketId={ticket.id} />}
                  </AnimatedContent>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HelpCircle size={14} /> Frequently Asked Questions
            </h2>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <AnimatedContent key={i} direction="up" delay={i * 0.06} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <p className="font-bold text-slate-800 text-sm pr-4">{faq.q}</p>
                  {expanded === i ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slateink-400 shrink-0" />}
                </button>
                {expanded === i && (
                  <div className="px-5 pb-5 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </AnimatedContent>
            ))}
          </div>
          </div>
        </div>

        {/* Right – Contact */}
        <div className="space-y-5">
          {/* Contact form */}
          <AnimatedContent direction="up" delay={0.3} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare size={15} className="text-[#1B2A6B]" /> Send a Message
            </h2>

            {sent ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 size={36} className="text-emerald-500 mb-2" />
                <p className="font-black text-slate-800 text-sm">Ticket Submitted!</p>
                {ticketNumber && (
                  <p className="text-xs font-bold text-[#1B2A6B] mt-1 bg-blue-50 px-3 py-1 rounded-lg">
                    #{ticketNumber}
                  </p>
                )}
                <p className="text-xs text-slate-400 font-semibold mt-2">We'll respond within 24 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-xs font-bold text-[#1B2A6B] hover:underline"
                >
                  Submit another ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                  >
                    <option>Technical Issue</option>
                    <option>Billing & Payments</option>
                    <option>Course Related</option>
                    <option>Internship/Job Query</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <span className="animate-pulse">Submitting...</span>
                  ) : (
                    <><Send size={14} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </AnimatedContent>

          {/* Quick contact */}
          <AnimatedContent direction="up" delay={0.4} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-800 mb-4">Quick Contact</h2>
            <div className="space-y-3">
              <a href="mailto:info.blueboxx@gmail.com" className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#1B2A6B] transition-colors font-semibold">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Mail size={15} className="text-blue-600" />
                </div>
                info.blueboxx@gmail.com
              </a>
              <a href="tel:+919023512853" className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#1B2A6B] transition-colors font-semibold">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Phone size={15} className="text-emerald-600" />
                </div>
                +91 90235 12853
              </a>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 text-center">Support hours: Mon–Sat, 9 AM – 7 PM IST</p>
          </AnimatedContent>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}
