import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'alert';
  read: boolean;
};

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'New Mentee Request', message: 'Rahul Sharma requested a 1-on-1 session.', time: '5m ago', type: 'info', read: false },
    { id: 2, title: 'Session Completed', message: 'Your session with Priya Patel is marked complete.', time: '2h ago', type: 'success', read: false },
    { id: 3, title: 'System Update', message: 'Platform maintenance scheduled for tomorrow.', time: '1d ago', type: 'alert', read: true },
  ]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'alert': return <AlertCircle size={16} className="text-amber-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-[#0d1635] flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-[#1B2A6B] text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} New</span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[11px] font-bold text-[#1B2A6B] hover:underline">
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium text-sm">
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 ${notif.read ? 'opacity-60' : 'bg-slate-50/50'}`}>
                      <div className="shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-600' : 'text-[#0d1635]'}`}>{notif.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="shrink-0 flex items-center justify-center w-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1B2A6B]"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50 hover:bg-slate-100 cursor-pointer transition-colors">
              <span className="text-xs font-bold text-slate-600">View all notifications</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
