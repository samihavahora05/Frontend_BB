import Head from "next/head";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { MessageSquare, Search } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function MessagesPage() {
  const { data, isLoading } = useSWR("/student/messages", fetcher);

  const threads = data?.data || [];

  return (
    <StudentDashboardLayout>
      <Head>
        <title>Messages | BlueBoxx</title>
      </Head>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-120px)] flex flex-col md:flex-row">
        
        {/* Left Sidebar (Thread List) */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-lg font-black text-slate-800 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-sm font-semibold animate-pulse">
                Loading messages...
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-50">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-500">No messages yet</p>
                <p className="text-xs text-slate-400 mt-1">When you connect with mentors or companies, your conversations will appear here.</p>
              </div>
            ) : (
              threads.map((thread: any) => (
                <div key={thread.id} className="p-4 border-b border-slate-100 hover:bg-white cursor-pointer transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-slate-800">{thread.subject}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">Just now</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{thread.messages?.[0]?.body || 'New conversation started.'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Area (Chat View) */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50 items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center mb-6">
                <MessageSquare size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Your Inbox</h3>
            <p className="text-sm text-slate-500 max-w-sm font-medium leading-relaxed">
                Select a conversation from the left sidebar to start messaging, or browse mentors and companies to start a new connection.
            </p>
        </div>

      </div>
    </StudentDashboardLayout>
  );
}
