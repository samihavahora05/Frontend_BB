import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { 
  MessageSquare, Mail, Send, Radio, MessageCircle, 
  Megaphone, HelpCircle, Inbox, User, Search, Paperclip, CheckCircle, Trash2, Edit2, X, Phone, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CommunicationService } from '../../../src/lib/api/admin/CommunicationService';
import { LeadService } from '../../../src/lib/api/admin/LeadService';
import useSWR from 'swr';
import api from '../../../src/lib/axios';

const fetcher = (url: string) => api.get(url).then(res => res.data);

type Tab = 'Inbox' | 'Sent' | 'Unread' | 'Private Messages' | 'Broadcasts' | 'Chat' | 'Announcements' | 'Course Q&A';

export default function CommunicationCenter() {
  const [activeTab, setActiveTab] = useState<Tab>('Inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: inbox, isLoading: isInboxLoading, mutate: mutateInbox } = CommunicationService.useInbox({ tab: activeTab, search: searchQuery });
  const { data: broadcasts, isLoading: isBroadcastsLoading, mutate: mutateBroadcasts } = CommunicationService.useBroadcasts();
  const { data: announcements, isLoading: isAnnouncementsLoading, mutate: mutateAnnouncements } = CommunicationService.useAnnouncements();
  const { data: courseQa, isLoading: isCourseQaLoading, mutate: mutateCourseQa } = CommunicationService.useCourseQA();
  
  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({ subject: '', body: '', recipient_ids: [] as number[] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Announcement Modal State
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementData, setAnnouncementData] = useState<any>({ id: null, subject: '', body: '' });
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);

  // Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', content: '', target_roles: [] as string[] });
  const [isSubmittingBroadcast, setIsSubmittingBroadcast] = useState(false);

  const { data: usersData } = useSWR('/admin/users?per_page=100', fetcher);
  const users = usersData?.data || [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (composeData.recipient_ids.length === 0) {
      return toast.error('Please select at least one recipient');
    }
    setIsSubmitting(true);
    try {
      await CommunicationService.sendMessage(composeData);
      toast.success('Message sent successfully!');
      setIsComposeOpen(false);
      setComposeData({ subject: '', body: '', recipient_ids: [] });
      mutateInbox();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteThread = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening thread
    if (!confirm('Delete this thread?')) return;
    try {
      await CommunicationService.deleteThread(id);
      toast.success('Thread deleted');
      mutateInbox();
    } catch (error) {
      toast.error('Failed to delete thread');
    }
  };

  const handleDeleteBroadcast = async (id: number) => {
    if (!confirm('Delete this broadcast?')) return;
    try {
      await CommunicationService.deleteBroadcast(id);
      toast.success('Broadcast deleted');
      mutateBroadcasts();
    } catch (error) {
      toast.error('Failed to delete broadcast');
    }
  };

  const handleApproveQa = async (id: number) => {
    try {
      await CommunicationService.approveCourseQA(id);
      toast.success('Q&A Approved and Resolved');
      mutateCourseQa();
    } catch (error) {
      toast.error('Failed to approve Q&A');
    }
  };

  const handleDeleteQa = async (id: number) => {
    if (!confirm('Delete this Q&A?')) return;
    try {
      await CommunicationService.deleteCourseQA(id);
      toast.success('Q&A deleted');
      mutateCourseQa();
    } catch (error) {
      toast.error('Failed to delete Q&A');
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAnnouncement(true);
    try {
      if (announcementData.id) {
        await CommunicationService.updateAnnouncement(announcementData.id, announcementData);
        toast.success('Announcement updated!');
      } else {
        await CommunicationService.createAnnouncement(announcementData);
        toast.success('Announcement created!');
      }
      setIsAnnouncementOpen(false);
      setAnnouncementData({ id: null, subject: '', body: '' });
      mutateAnnouncements();
    } catch (error) {
      toast.error('Failed to save announcement');
    } finally {
      setIsSubmittingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await CommunicationService.deleteAnnouncement(id);
      toast.success('Deleted successfully');
      mutateAnnouncements();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (broadcastData.target_roles.length === 0) {
      return toast.error('Please select at least one target role');
    }
    setIsSubmittingBroadcast(true);
    try {
      await CommunicationService.sendBroadcast(broadcastData);
      toast.success('Broadcast sent successfully!');
      setIsBroadcastOpen(false);
      setBroadcastData({ title: '', content: '', target_roles: [] });
      mutateBroadcasts();
    } catch (error) {
      toast.error('Failed to send broadcast');
    } finally {
      setIsSubmittingBroadcast(false);
    }
  };

  // Thread View State
  const [selectedThread, setSelectedThread] = useState<any>(null);

  const handleOpenThread = async (threadId: number) => {
    try {
      const data = await CommunicationService.getThread(threadId);
      setSelectedThread(data.data);
      mutateInbox(); // mark as read
    } catch (error) {
      toast.error('Failed to load thread');
    }
  };

  const tabs: { id: Tab, icon: any, label: string }[] = [
    { id: 'Inbox', icon: Inbox, label: 'Inbox' },
    { id: 'Sent', icon: Send, label: 'Sent' },
    { id: 'Unread', icon: Mail, label: 'Unread' },
    { id: 'Private Messages', icon: User, label: 'Private Messages' },
    { id: 'Broadcasts', icon: Radio, label: 'Broadcasts' },
    { id: 'Chat', icon: MessageCircle, label: 'Live Chat' },
    { id: 'Announcements', icon: Megaphone, label: 'Announcements' },
    { id: 'Course Q&A', icon: HelpCircle, label: 'Course Q&A' },
  ];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Communication Center | BlueBoxx DA</title>
      </Head>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <MessageSquare size={28} className="text-[#C9A227]"/> Communication Center
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">Central hub for messages, broadcasts, announcements, and Q&A.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
        
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-64 bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0 h-fit">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <button onClick={() => setIsComposeOpen(true)} className="w-full py-2.5 bg-[#1B2A6B] text-white rounded-lg font-bold text-sm hover:bg-[#121c47] transition-colors shadow-md">
              Compose Message
            </button>
          </div>
          <div className="p-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-[#1B2A6B]/10 text-[#1B2A6B]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-[#1B2A6B]' : 'text-gray-400'}/>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
          
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-800">{activeTab}</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#1B2A6B] outline-none shadow-sm w-64"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto admin-scrollbar relative">
            
            {(activeTab === 'Inbox' || activeTab === 'Sent' || activeTab === 'Unread' || activeTab === 'Private Messages') && (
              <div className="divide-y divide-gray-100">
                {isInboxLoading ? (
                  <div className="p-8 text-center text-slate-500 font-medium">Loading messages...</div>
                ) : inbox.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-medium">No messages found.</div>
                ) : inbox.map((thread: any) => {
                  const displayUser = activeTab === 'Sent' && thread.recipients?.[0]?.user
                    ? thread.recipients[0].user
                    : thread.creator;
                  const displayName = activeTab === 'Sent' 
                    ? `To: ${displayUser?.first_name || 'Unknown'} ${displayUser?.last_name || ''}`
                    : `${displayUser?.first_name || 'Unknown'} ${displayUser?.last_name || ''}`;
                    
                  return (
                    <div key={thread.id} onClick={() => handleOpenThread(thread.id)} className={`p-4 hover:bg-gray-50 cursor-pointer flex gap-4 transition-colors ${activeTab === 'Unread' ? 'bg-blue-50/30' : ''}`}>
                      <img src={`https://ui-avatars.com/api/?name=${displayUser?.first_name || 'U'}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm truncate ${activeTab === 'Unread' ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{displayName}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-400">{new Date(thread.created_at).toLocaleDateString()}</span>
                            <button onClick={(e) => handleDeleteThread(thread.id, e)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete Thread">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm truncate ${activeTab === 'Unread' ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{thread.subject || 'No Subject'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'Chat' && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                 <MessageCircle size={64} className="mb-4 opacity-50 text-blue-300" />
                 <p className="text-lg font-bold text-gray-600">Select a conversation</p>
                 <p className="text-sm font-medium">Choose a user from your contacts to start chatting.</p>
              </div>
            )}

            {activeTab === 'Announcements' && (
              <div className="p-6">
                <button onClick={() => {
                  setAnnouncementData({ id: null, subject: '', body: '' });
                  setIsAnnouncementOpen(true);
                }} className="mb-6 px-4 py-2 bg-[#1B2A6B] text-white rounded-lg font-bold text-sm hover:bg-[#121c47] shadow-sm">
                  + New Announcement
                </button>
                <div className="space-y-4">
                  {isAnnouncementsLoading ? (
                    <div className="text-center text-gray-500 font-medium py-8">Loading announcements...</div>
                  ) : announcements.length === 0 ? (
                    <div className="text-center text-gray-500 font-medium py-8">No announcements yet.</div>
                  ) : announcements.map((a: any) => (
                    <div key={a.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:border-[#1B2A6B]/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-black text-gray-800">{a.subject}</h3>
                        <span className="px-2 py-1 bg-[#1B2A6B]/10 text-[#1B2A6B] text-[10px] font-black rounded-full uppercase tracking-widest">Announcement</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-4 whitespace-pre-wrap">{a.messages?.[0]?.body}</p>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-xs font-semibold text-gray-400">By {a.creator?.first_name || 'Admin'} on {new Date(a.created_at).toLocaleDateString()}</span>
                        <div className="flex gap-3">
                          <button onClick={() => {
                            setAnnouncementData({ id: a.id, subject: a.subject, body: a.messages?.[0]?.body });
                            setIsAnnouncementOpen(true);
                          }} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1"><Edit2 size={14}/> Edit</button>
                          <button onClick={() => handleDeleteAnnouncement(a.id)} className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Course Q&A' && (
              <div className="p-6 space-y-4">
                {isCourseQaLoading ? (
                  <div className="text-center text-gray-500 font-medium py-8">Loading Q&A...</div>
                ) : courseQa.length === 0 ? (
                  <div className="text-center text-gray-500 font-medium py-8">No Q&A questions found.</div>
                ) : courseQa.map((qa: any) => (
                  <div key={qa.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">Q</div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{qa.title || 'No Title'}</p>
                        <p className="text-xs font-semibold text-gray-500">Asked by {qa.student?.name || 'Unknown'} • {qa.course?.title || 'Unknown Course'}</p>
                      </div>
                      <span className={`ml-auto px-2 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${qa.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {qa.status}
                      </span>
                    </div>
                    <div className="pl-11 border-l-2 border-emerald-200 ml-4">
                       <p className="text-sm text-gray-600 font-medium mb-3 whitespace-pre-wrap">{qa.question}</p>
                       <div className="flex gap-2">
                         {qa.status !== 'Resolved' && (
                           <button onClick={() => handleApproveQa(qa.id)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded font-bold text-xs flex items-center gap-1"><CheckCircle size={14}/> Approve</button>
                         )}
                         <button onClick={() => handleDeleteQa(qa.id)} className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded font-bold text-xs flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Broadcasts' && (
              <div className="p-6">
                <button onClick={() => setIsBroadcastOpen(true)} className="mb-6 px-4 py-2 bg-[#1B2A6B] text-white rounded-lg font-bold text-sm hover:bg-[#121c47] shadow-sm">
                  + Send Broadcast
                </button>
                <div className="space-y-4">
                  {isBroadcastsLoading ? (
                    <div className="p-8 text-center text-slate-500 font-medium">Loading broadcasts...</div>
                  ) : broadcasts.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-medium">No broadcasts sent yet.</div>
                  ) : broadcasts.map((b: any) => (
                    <div key={b.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-black text-gray-800">{b.title}</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-black rounded-full uppercase tracking-widest">Sent</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-4">{b.content}</p>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-xs font-semibold text-gray-400">Sent by {b.creator?.first_name || 'Admin'} on {new Date(b.created_at).toLocaleDateString()}</span>
                        <div className="flex gap-3">
                          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">Target: {b.target_roles?.join(', ')}</span>
                          <button onClick={() => handleDeleteBroadcast(b.id)} className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Compose Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="font-black text-gray-800 flex items-center gap-2"><Send size={18} className="text-[#1B2A6B]" /> Compose Message</h3>
              <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">To</label>
                <select 
                  multiple 
                  required
                  value={composeData.recipient_ids.map(String)}
                  onChange={e => setComposeData({...composeData, recipient_ids: Array.from(e.target.selectedOptions, option => Number(option.value))})}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#1B2A6B] h-32 admin-scrollbar"
                >
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1 font-semibold">Hold Ctrl (Windows) or Cmd (Mac) to select multiple recipients.</p>
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="What is this about?"
                  value={composeData.subject}
                  onChange={e => setComposeData({...composeData, subject: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-[#1B2A6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Message</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Type your message here..."
                  value={composeData.body}
                  onChange={e => setComposeData({...composeData, body: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#1B2A6B] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsComposeOpen(false)} className="px-5 py-2 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#1B2A6B] text-white rounded-lg font-bold text-sm hover:bg-[#121c47] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md">
                  {isSubmitting ? 'Sending...' : <><Send size={16}/> Send Message</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Broadcast Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="font-black text-gray-800 flex items-center gap-2"><Radio size={18} className="text-[#1B2A6B]" /> Send Broadcast</h3>
              <button onClick={() => setIsBroadcastOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSendBroadcast} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Target Roles</label>
                <div className="flex flex-wrap gap-2">
                  {['Student', 'Instructor', 'Company', 'College'].map(role => (
                    <label key={role} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={broadcastData.target_roles.includes(role)}
                        onChange={e => {
                          if (e.target.checked) {
                            setBroadcastData({...broadcastData, target_roles: [...broadcastData.target_roles, role]});
                          } else {
                            setBroadcastData({...broadcastData, target_roles: broadcastData.target_roles.filter(r => r !== role)});
                          }
                        }}
                        className="rounded text-[#1B2A6B] focus:ring-[#1B2A6B]"
                      />
                      <span className="text-sm font-semibold text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="Broadcast Title"
                  value={broadcastData.title}
                  onChange={e => setBroadcastData({...broadcastData, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-[#1B2A6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Content</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Type your broadcast message here..."
                  value={broadcastData.content}
                  onChange={e => setBroadcastData({...broadcastData, content: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#1B2A6B] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsBroadcastOpen(false)} className="px-5 py-2 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingBroadcast} className="px-5 py-2 bg-[#1B2A6B] text-white rounded-lg font-bold text-sm hover:bg-[#121c47] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md">
                  {isSubmittingBroadcast ? 'Sending...' : <><Radio size={16}/> Send Broadcast</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thread View Modal */}
      {selectedThread && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="font-black text-gray-800 truncate pr-4">{selectedThread.subject || 'No Subject'}</h3>
              <button onClick={() => setSelectedThread(null)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
              {selectedThread.messages?.map((msg: any) => {
                const isMe = msg.sender?.id === users.find((u:any) => u.email === msg.sender?.email)?.id; // naive check, in real app we check auth user id
                return (
                  <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={`https://ui-avatars.com/api/?name=${msg.sender?.first_name || 'U'}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full shadow-sm shrink-0" />
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-600">{msg.sender?.first_name} {msg.sender?.last_name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${isMe ? 'bg-[#1B2A6B] text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm'}`}>
                        {msg.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('reply') as HTMLInputElement;
                if (!input.value.trim()) return;
                
                try {
                  const data = await CommunicationService.sendMessage({
                    thread_id: selectedThread.id,
                    body: input.value,
                    recipient_ids: selectedThread.recipients?.map((r:any) => r.user?.id) || []
                  });
                  input.value = '';
                  // Refresh thread
                  handleOpenThread(selectedThread.id);
                } catch (err) {
                  toast.error('Failed to reply');
                }
              }} className="flex gap-3">
                <input name="reply" type="text" placeholder="Type your reply..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-[#1B2A6B] outline-none" />
                <button type="submit" className="px-5 py-2 bg-[#1B2A6B] text-white rounded-xl font-bold text-sm hover:bg-[#121c47] shadow-sm shrink-0">
                  Reply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {isAnnouncementOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="font-black text-gray-800 flex items-center gap-2"><Megaphone size={18} className="text-[#1B2A6B]" /> {announcementData.id ? 'Edit' : 'New'} Announcement</h3>
              <button onClick={() => setIsAnnouncementOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAnnouncementSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="Announcement Subject"
                  value={announcementData.subject}
                  onChange={e => setAnnouncementData({...announcementData, subject: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-[#1B2A6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Message Body</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Type the announcement here..."
                  value={announcementData.body}
                  onChange={e => setAnnouncementData({...announcementData, body: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#1B2A6B] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsAnnouncementOpen(false)} className="px-5 py-2 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingAnnouncement} className="px-5 py-2 bg-[#1B2A6B] text-white rounded-lg font-bold text-sm hover:bg-[#121c47] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md">
                  {isSubmittingAnnouncement ? 'Saving...' : 'Save Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminDashboardLayout>
  );
}
