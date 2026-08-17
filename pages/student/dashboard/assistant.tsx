import { useState } from "react";
import { DashboardLayout } from "../../../src/layout/DashboardLayout";
import { Button } from "../../../src/components/ui/Button";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { 
  Send, Sparkles, User, FileText, Code, Briefcase 
} from "lucide-react";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi Rahul! 👋 I'm your BlueBoxx Career Assistant. I can help you prepare for interviews, optimize your resume, or suggest the best courses for your career goals. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    { icon: FileText, text: "Review my resume for a React Developer role" },
    { icon: Code, text: "Give me a mock DSA question (Arrays)" },
    { icon: Briefcase, text: "What skills do I need for Product Management?" }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "That's a great question! Based on your profile, I recommend focusing on advanced React patterns like Hooks and Context API first. Would you like me to generate a personalized study plan for you?" 
      }]);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col relative max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0d1635] to-[#1B2A6B] rounded-2xl flex items-center justify-center shadow-lg border border-blue-900/50">
            <Sparkles size={20} className="text-[#C9A227]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">AI Career Assistant</h1>
            <p className="text-sm font-semibold text-slate-500">Powered by BlueBoxx Intelligence</p>
          </div>
        </div>

        {/* Chat Window */}
        <Card className="flex-1 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col relative z-10">
          
          {/* Chat History */}
          <CardContent className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-slate-100 border-slate-200 text-slate-500' 
                    : 'bg-[#1B2A6B] border-[#0d1635] text-white'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} className="text-[#C9A227]" />}
                </div>

                <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#1B2A6B] text-white rounded-tr-none' 
                    : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                }`}>
                  {msg.content}
                </div>

              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 max-w-[85%] self-start animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-[#1B2A6B] border border-[#0d1635] flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={18} className="text-[#C9A227]" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1B2A6B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#1B2A6B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#1B2A6B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </CardContent>

          {/* Suggestions (Only show if few messages) */}
          {messages.length < 3 && !isTyping && (
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s.text)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-[#1B2A6B] hover:text-[#1B2A6B] hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <s.icon size={14} /> {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask me anything about your career..."
                className="w-full h-14 pl-6 pr-16 rounded-2xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-700 shadow-sm bg-white"
              />
              <Button 
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="absolute right-2 w-10 h-10 p-0 rounded-xl bg-[#1B2A6B] hover:bg-[#0d1635] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} className="ml-1" />
              </Button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>

        </Card>
      </div>
    </DashboardLayout>
  );
}
