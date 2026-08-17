import { useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Only poll if the user is authenticated — prevents 401s on public / unauthenticated pages
  const { data, mutate } = useSWR(
    isAuthenticated ? "/notifications" : null,
    fetcher,
    { refreshInterval: isAuthenticated ? 30000 : 0, revalidateOnFocus: false }
  );
  
  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.read_at).length;

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      mutate();
    } catch (e) {
      console.error("Failed to mark all as read");
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:text-[#1B2A6B] bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 py-2 overflow-hidden text-left"
            >
              <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-black text-slate-600">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-black text-[#3b82f6] hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-bold">No notifications</div>
                ) : notifications.map((notif: any) => (
                  <div key={notif.id} className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 ${!notif.read_at ? 'bg-blue-50/50' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read_at ? 'bg-blue-500' : 'bg-slate-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-normal ${!notif.read_at ? 'text-slate-800' : 'text-slate-600'}`}>{notif.data?.message ?? notif.message}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{notif.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
