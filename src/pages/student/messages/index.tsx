import { useState, useEffect, useRef, useMemo } from "react";
import { StudentDashboardLayout } from "../../../layout/StudentDashboardLayout";
import { Search, Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import useSWR from "swr";
import api from "../../../lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function StudentMessages() {
  const { data: convData, mutate: mutateConvs } = useSWR("/messages", fetcher);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  
  const conversations = convData?.data || [];

  const { data: msgData, mutate: mutateMsgs } = useSWR(
    activeConv ? `/messages/${activeConv.id}` : null,
    fetcher,
    { refreshInterval: 5000 } // Poll every 5s for new messages
  );

  const messages = useMemo(() => msgData?.data || [], [msgData?.data]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    
    const text = messageText;
    setMessageText("");
    
    // Optimistic update
    mutateMsgs({ data: [...messages, { id: Date.now().toString(), sender: 'me', text, time: 'Just now' }] }, false);

    try {
      await api.post(`/messages/${activeConv.id}`, { text });
      mutateMsgs();
      mutateConvs();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <h1 className="text-xl font-black text-slate-900 mb-4">Messages</h1>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm font-bold text-slate-400">No conversations yet</div>
            ) : conversations.map((conv: any) => (
              <div 
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`p-4 sm:p-5 flex gap-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${activeConv?.id === conv.id ? 'bg-slate-50/80 border-l-4 border-l-[#1B2A6B]' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-600 font-black text-lg">
                  {conv.user.avatar ? <img src={conv.user.avatar} alt={conv.user.name} className="w-full h-full rounded-full object-cover" /> : conv.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 truncate pr-2 text-sm">{conv.user.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{conv.updated_at}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 truncate">{conv.last_message}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-1">
                    {conv.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-slate-50/30 ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200 bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <button className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600" onClick={() => setActiveConv(null)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black">
                    {activeConv.user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">{activeConv.user.name}</h2>
                    <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider">{activeConv.user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><Phone size={18} /></button>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><Video size={18} /></button>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><MoreVertical size={18} /></button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg: any, idx: number) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[75%] lg:max-w-[60%] p-4 rounded-2xl ${isMe ? 'bg-[#1B2A6B] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-400">
                        {msg.time}
                        {isMe && <CheckCheck size={12} className="text-[#3b82f6]" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 sm:p-6 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..." 
                      className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-3.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full p-6 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Send size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">Your Messages</h3>
              <p className="text-sm font-semibold max-w-sm">Select a conversation from the sidebar or start a new one to begin chatting.</p>
            </div>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
}
