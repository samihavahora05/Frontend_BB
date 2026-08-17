import React, { useState } from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { Search, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const USERS = [
  { id: 1, name: 'NIRAV PURANDARE', initial: 'NP', color: 'bg-teal-600', active: true },
  { id: 2, name: 'TUSHAR MOHITE', initial: 'TM', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', active: false },
  { id: 3, name: 'MANAV VITHANI', initial: 'MV', color: 'bg-purple-800', active: false },
  { id: 4, name: 'RUPESH GANDHI', initial: 'RG', color: 'bg-black', active: false },
  { id: 5, name: 'Darshan Bhesaniya', initial: 'DB', color: 'bg-[#C9A227]', active: false },
  { id: 6, name: 'boorishphilipp907', initial: 'BO', color: 'bg-green-500', active: false },
  { id: 7, name: '12fisherrosy', initial: '12', color: 'bg-pink-600', active: false },
];

export default function PrivateMessagesPage() {
  const [search, setSearch] = useState('');
  const [activeUserId, setActiveUserId] = useState(1);
  const [message, setMessage] = useState('');

  const activeUser = USERS.find(u => u.id === activeUserId);

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success("Message sent successfully!");
    setMessage('');
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Private Message | Admin</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6 space-y-6 h-[calc(100vh-60px)] flex flex-col">
        <div>
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">PRIVATE MESSAGE</h1>
        </div>

        <div className="flex flex-1 gap-6 min-h-0">
          {/* Left Panel: Message List */}
          <div className="w-1/3 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
            <div className="p-6 pb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Message List</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content here..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto admin-scrollbar pr-2 pb-4">
              {USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
                <button
                  key={user.id}
                  onClick={() => setActiveUserId(user.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 ${activeUser?.id === user.id ? 'border-[#C9A227] bg-blue-50/30' : 'border-transparent'}`}
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${user.color} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {user.initial}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Chat Interface */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-0 relative">
            {activeUser ? (
              <>
                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{activeUser.name}</h2>
                </div>
                
                <div className="flex-1 bg-gray-50/30 p-6 overflow-y-auto">
                  {/* Chat messages would go here */}
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    No recent messages
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex-shrink-0 bg-white">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Write your message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227] shadow-sm"
                    />
                    <button
                      onClick={handleSend}
                      className="bg-[#C9A227] hover:bg-[#b08d22] text-white px-8 py-3 rounded-md font-semibold text-sm transition-colors shadow-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-medium">
                Select a user to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
