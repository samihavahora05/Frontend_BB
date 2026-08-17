import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { CompanyDashboardLayout } from "../../../../src/layout/CompanyDashboardLayout";
import { AnimatedContent } from "../../../../src/components/reactbits/AnimatedContent";
import { ArrowLeft, Clock, MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../../../src/lib/axios";
import Link from "next/link";

export default function TicketDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`/company/support/tickets/${id}`);
      setTicket(res.data.ticket);
    } catch (err) {
      toast.error("Failed to load ticket");
      router.push('/company/support');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    
    setSending(true);
    try {
      await axios.post(`/company/support/tickets/${id}/reply`, {
        message: replyMessage
      });
      setReplyMessage("");
      fetchTicket();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reply");
    } finally {
      setSending(false);
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

  if (loading) {
    return (
      <CompanyDashboardLayout>
        <div className="animate-pulse p-8 max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-32 bg-slate-200 rounded-xl"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Link href="/company/support" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1B2A6B] transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Support
        </Link>

        {ticket && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{ticket.ticket_number}</span>
                    <span className={`text-xs font-bold border px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <Clock size={14} /> Created on {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </div>
                <h1 className="text-xl font-black text-slate-800 mb-2">{ticket.subject}</h1>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                  Priority: 
                  <span className={
                    ticket.priority === 'Urgent' ? 'text-red-500' :
                    ticket.priority === 'High' ? 'text-amber-500' : 'text-blue-500'
                  }>{ticket.priority}</span>
                </div>
              </div>

              {/* Conversation Area */}
              <div className="bg-slate-50 p-6 sm:p-8 max-h-[500px] overflow-y-auto space-y-6">
                {ticket.messages.map((msg: any, i: number) => {
                  const isAdmin = msg.is_admin_reply;
                  return (
                    <div key={i} className={`flex gap-4 max-w-[85%] ${isAdmin ? '' : 'ml-auto flex-row-reverse'}`}>
                      <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center font-bold text-white shadow-md ${isAdmin ? 'bg-[#1B2A6B]' : 'bg-blue-500'}`}>
                        {isAdmin ? <User size={20} /> : (msg.user?.first_name?.[0] || 'C')}
                      </div>
                      <div className={`space-y-1 ${isAdmin ? '' : 'text-right'}`}>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 justify-start" style={{ flexDirection: isAdmin ? 'row' : 'row-reverse' }}>
                          <span className="text-slate-800">{isAdmin ? 'Support Team' : 'You'}</span>
                          <span className="text-[10px] font-normal">{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap text-left shadow-sm ${
                          isAdmin 
                            ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm' 
                            : 'bg-[#1B2A6B] text-white rounded-tr-sm'
                        }`}>
                          {msg.message}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/20">
                              <p className="text-xs font-bold mb-2 opacity-80">Attachments:</p>
                              <div className="flex flex-col gap-2">
                                {msg.attachments.map((path: string, j: number) => (
                                  <a 
                                    key={j} 
                                    href={`/storage/${path}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs hover:underline"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                    View Attachment {j + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {ticket.status === 'Closed' ? (
              <div className="bg-slate-100 rounded-xl p-6 text-center text-slate-500 font-medium flex items-center justify-center gap-3">
                <CheckCircle2 size={24} className="text-slate-400" />
                This ticket is closed. You can submit a new ticket for further assistance.
              </div>
            ) : (
              <AnimatedContent direction="up" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#1B2A6B]" /> Add a Reply
                </h3>
                <form onSubmit={handleReply}>
                  <textarea 
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    required
                    placeholder="Type your message here..."
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] min-h-[120px] resize-none mb-4"
                  />
                  <div className="flex justify-end">
                    <button type="submit" disabled={sending || !replyMessage.trim()} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all disabled:opacity-70">
                      {sending ? "Sending..." : <><Send size={16} /> Send Reply</>}
                    </button>
                  </div>
                </form>
              </AnimatedContent>
            )}
          </>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}
