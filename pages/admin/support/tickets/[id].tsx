import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AdminDashboardLayout } from "../../../../src/layout/AdminDashboardLayout";
import { AnimatedContent } from "../../../../src/components/reactbits/AnimatedContent";
import { ArrowLeft, Clock, MessageSquare, Send, CheckCircle2, User, Building, AlertCircle, FileText, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../../../src/lib/axios";
import Link from "next/link";

export default function AdminTicketDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [sendingNote, setSendingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages, ticket?.notes]);

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`/admin/support/tickets/${id}`);
      setTicket(res.data.ticket);
    } catch (err) {
      toast.error("Failed to load ticket");
      router.push('/admin/support');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    
    setSendingReply(true);
    try {
      await axios.post(`/admin/support/tickets/${id}/reply`, {
        message: replyMessage
      });
      setReplyMessage("");
      toast.success("Reply sent to company!");
      fetchTicket();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    
    setSendingNote(true);
    try {
      await axios.post(`/admin/support/tickets/${id}/notes`, {
        note: internalNote
      });
      setInternalNote("");
      toast.success("Internal note added!");
      fetchTicket();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add note");
    } finally {
      setSendingNote(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await axios.put(`/admin/support/tickets/${id}/status`, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus}`);
      fetchTicket();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Contacted': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Closed': return 'text-slate-600 bg-slate-100 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="animate-pulse p-8 max-w-5xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="flex gap-6">
            <div className="w-2/3 h-96 bg-slate-200 rounded-xl"></div>
            <div className="w-1/3 h-64 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  // Combine messages and notes, sort by created_at
  const timeline = [
    ...(ticket?.messages || []).map((m: any) => ({ ...m, type: 'message' })),
    ...(ticket?.notes || []).map((n: any) => ({ ...n, type: 'note' }))
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());


  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/support" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1B2A6B] transition-colors">
            <ArrowLeft size={16} /> Back to Tickets
          </Link>
          {ticket && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-slate-500 uppercase">Status:</label>
              <select 
                value={ticket.status}
                onChange={e => handleUpdateStatus(e.target.value)}
                disabled={updatingStatus}
                className={`text-sm font-bold border px-4 py-2 rounded-xl outline-none cursor-pointer ${getStatusColor(ticket.status)}`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Contacted">Contacted</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        {ticket && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Conversation */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{ticket.ticket_number}</span>
                    <span className={`text-xs font-bold border px-3 py-1 rounded-full ${
                      ticket.priority === 'Urgent' ? 'border-red-200 bg-red-50 text-red-600' :
                      ticket.priority === 'High' ? 'border-amber-200 bg-amber-50 text-amber-600' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-slate-800 mb-2">{ticket.subject}</h1>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{ticket.description}</p>
                </div>

                {/* Conversation Timeline */}
                <div className="bg-slate-50 p-6 sm:p-8 max-h-[600px] overflow-y-auto space-y-6">
                  {timeline.map((item: any, i: number) => {
                    if (item.type === 'note') {
                      return (
                        <div key={`note-${i}`} className="flex justify-center my-4">
                          <div className="bg-amber-100 border border-amber-200 rounded-xl p-4 max-w-md w-full shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2">
                              <AlertCircle size={14} /> Internal Note &bull; {item.admin?.first_name} &bull; {new Date(item.created_at).toLocaleString()}
                            </div>
                            <p className="text-sm text-amber-900 whitespace-pre-wrap">{item.note}</p>
                          </div>
                        </div>
                      );
                    }

                    const isAdmin = item.is_admin_reply;
                    return (
                      <div key={`msg-${i}`} className={`flex gap-4 max-w-[85%] ${isAdmin ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center font-bold text-white shadow-md ${isAdmin ? 'bg-[#1B2A6B]' : 'bg-blue-500'}`}>
                          {isAdmin ? <User size={20} /> : (item.user?.first_name?.[0] || 'C')}
                        </div>
                        <div className={`space-y-1 ${isAdmin ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 justify-start" style={{ flexDirection: isAdmin ? 'row-reverse' : 'row' }}>
                            <span className="text-slate-800">{isAdmin ? (item.user?.first_name || 'Admin') : (item.user?.first_name || 'Company')}</span>
                            <span className="text-[10px] font-normal">{new Date(item.created_at).toLocaleString()}</span>
                          </div>
                          <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap text-left shadow-sm ${
                            isAdmin 
                              ? 'bg-[#1B2A6B] text-white rounded-tr-sm' 
                              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                          }`}>
                            {item.message}
                            {item.attachments && item.attachments.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-200/20">
                                <p className="text-xs font-bold mb-2 opacity-80">Attachments:</p>
                                <div className="flex flex-col gap-2">
                                  {item.attachments.map((path: string, j: number) => (
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

              {/* Reply Box */}
              <AnimatedContent direction="up" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#1B2A6B]" /> Reply to Company
                </h3>
                <form onSubmit={handleReply}>
                  <textarea 
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    required
                    placeholder="Type your official reply to the company here..."
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B2A6B] min-h-[120px] resize-none mb-4"
                  />
                  <div className="flex justify-end">
                    <button type="submit" disabled={sendingReply || !replyMessage.trim()} className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B2A6B]/20 hover:bg-[#0d1635] transition-all disabled:opacity-70">
                      {sendingReply ? "Sending..." : <><Send size={16} /> Send Reply</>}
                    </button>
                  </div>
                </form>
              </AnimatedContent>
            </div>

            {/* Right Column: Company Details & Internal Notes */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Company Info */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Company Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Building size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{ticket.company?.company_name || (ticket.company?.user ? `${ticket.company.user.first_name} ${ticket.company.user.last_name}` : 'N/A')}</p>
                      <p className="text-xs text-slate-500">{ticket.company?.industry || 'Industry N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                      <UserCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{ticket.company?.user?.first_name} {ticket.company?.user?.last_name}</p>
                      <p className="text-xs text-slate-500">{ticket.company?.user?.email}</p>
                      <p className="text-xs text-slate-500">{ticket.company?.user?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal Notes Box */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-6">
                <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText size={16} /> Internal Notes
                </h3>
                <p className="text-xs text-amber-700 mb-4">Notes are only visible to admins. Use them to collaborate or leave context.</p>
                <form onSubmit={handleAddNote}>
                  <textarea 
                    value={internalNote}
                    onChange={e => setInternalNote(e.target.value)}
                    required
                    placeholder="Leave a private note..."
                    className="w-full bg-white border border-amber-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 min-h-[100px] resize-none mb-3 text-amber-900 placeholder:text-amber-300"
                  />
                  <button type="submit" disabled={sendingNote || !internalNote.trim()} className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-amber-500 text-white font-bold text-sm rounded-xl shadow-md hover:bg-amber-600 transition-all disabled:opacity-70">
                    Add Note
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
