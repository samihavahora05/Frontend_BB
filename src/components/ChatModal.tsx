import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Image as ImageIcon, Smile } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  menteeName: string;
}

export function ChatModal({ isOpen, onClose, menteeName }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: menteeName, text: 'Hi! Could we review my React project in our next session?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Absolutely. Please send over the GitHub link.', time: '10:45 AM', isMe: true },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isMe: true }]);
    setMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 relative overflow-hidden flex flex-col"
            style={{ height: '600px', maxHeight: '90vh' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                  {menteeName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">{menteeName}</h3>
                  <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"><X size={20}/></button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isMe ? 'bg-[#1B2A6B] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 mx-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><ImageIcon size={20}/></button>
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Smile size={20}/></button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B2A6B]" 
              />
              <button type="submit" disabled={!message.trim()} className="p-2.5 bg-[#1B2A6B] text-white rounded-xl shadow-sm hover:bg-[#0d1635] transition-colors disabled:opacity-50">
                <Send size={16}/>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
