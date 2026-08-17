import { ExpertDashboardLayout } from "../../../src/layout/ExpertDashboardLayout";
import { Calendar as CalendarIcon, Plus, Video, CheckCircle2, ChevronLeft, ChevronRight, CalendarOff } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { EmptyState } from "../../../src/components/ui/EmptyState";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ExpertSchedule() {
  const { data, isLoading, mutate } = useSWR("/expert/schedule", fetcher);
  const slots = data?.data || [];
  
  const [activeModal, setActiveModal] = useState(false);
  const [formData, setFormData] = useState({ date: '', start: '', end: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showPastSessions, setShowPastSessions] = useState(false);

  const handleAddAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.start) newErrors.start = "Start time is required";
    if (!formData.end) newErrors.end = "End time is required";
    
    if (formData.start && formData.end) {
      if (formData.start >= formData.end) {
        newErrors.end = "End time must be after start time";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newSlot = {
      id: Date.now(),
      mentee: null,
      time: `${formData.start} - ${formData.end}`,
      type: "Available Slot",
      date: formData.date,
      booked: false
    };

    // Optimistic UI update
    mutate({ ...data, data: [...slots, newSlot] }, false);
    setActiveModal(false);
    toast.success("Availability added successfully!");
    // In real app, make an API call to save this specific slot here:
    // await api.post('/expert/schedule', newSlot);
    mutate();
    setFormData({ date: '', start: '', end: '' });
    setErrors({});
  };

  const removeSlot = async (id: number) => {
    // Optimistic UI update
    mutate({ ...data, data: slots.filter((s: any) => s.id !== id) }, false);
    toast.success("Slot removed");
    // API Call: await api.delete(`/expert/schedule/${id}`);
    mutate();
  };

  // Filter slots for the current selected month and past/upcoming
  const filteredSlots = slots.filter((s: any) => {
    const slotDate = new Date(s.date);
    const isSameMonth = slotDate.getMonth() === currentMonth.getMonth() && slotDate.getFullYear() === currentMonth.getFullYear();
    const isPast = slotDate < new Date(new Date().setHours(0,0,0,0));
    
    if (!isSameMonth) return false;
    return showPastSessions ? isPast : !isPast;
  });

  return (
    <ExpertDashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] mb-1">My Schedule</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your availability and upcoming mentorship sessions.</p>
        </div>
        <button onClick={() => setActiveModal(true)} className="px-5 py-2.5 bg-[#C9A227] text-[#0d1635] font-bold rounded-xl text-sm hover:bg-[#b08d22] transition-all shadow-md flex items-center gap-2">
          <Plus size={16} /> Add Availability
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 text-slate-400 hover:text-[#1B2A6B] bg-white border border-slate-200 rounded-lg shadow-sm"><ChevronLeft size={16}/></button>
            <div className="relative group flex items-center justify-center min-w-[120px]">
              <input 
                type="month" 
                value={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`}
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, month] = e.target.value.split('-');
                    setCurrentMonth(new Date(parseInt(year), parseInt(month) - 1, 1));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <h2 className="font-black text-slate-800 text-sm group-hover:text-[#1B2A6B] transition-colors">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 text-slate-400 hover:text-[#1B2A6B] bg-white border border-slate-200 rounded-lg shadow-sm"><ChevronRight size={16}/></button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowPastSessions(false)} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${!showPastSessions ? 'bg-[#1B2A6B] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Upcoming</button>
            <button onClick={() => setShowPastSessions(true)} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${showPastSessions ? 'bg-[#1B2A6B] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Past Sessions</button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading schedule...</div>
        ) : filteredSlots.length === 0 ? (
          <div className="p-8">
            <EmptyState 
              icon={CalendarOff} 
              title="No sessions scheduled" 
              description="You have no upcoming or past sessions on your calendar for this month."
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
          <AnimatePresence>
            {filteredSlots.map((slot: any) => (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} key={slot.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/80 transition-colors overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${slot.booked ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200 border-dashed'}`}>
                    {slot.booked ? <Video size={20} /> : <CalendarIcon size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-bold ${slot.booked ? 'text-[#0d1635]' : 'text-slate-500'}`}>
                        {slot.time}
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{slot.date}</span>
                    </div>
                    {slot.booked ? (
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <span className="text-[#1B2A6B]">{slot.mentee}</span> &bull; {slot.type}
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12}/> {slot.type}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full sm:w-auto flex justify-end">
                  {slot.booked ? (
                    <button onClick={() => toast.loading("Launching Zoom...", { duration: 1500 })} className="px-5 py-2 bg-slate-100 text-[#1B2A6B] text-xs font-bold rounded-lg hover:bg-[#1B2A6B] hover:text-white transition-colors w-full sm:w-auto">
                      Join Session
                    </button>
                  ) : (
                    <button onClick={() => removeSlot(slot.id)} className="px-5 py-2 bg-white border border-slate-200 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-50 transition-colors w-full sm:w-auto">
                      Remove Slot
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        )}
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setActiveModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 relative overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-[#0d1635] flex items-center gap-2">
                  <CalendarIcon size={18} className="text-[#1B2A6B]"/> Add Availability
                </h3>
              </div>
              <form onSubmit={handleAddAvailability} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Date</label>
                  <input type="date" value={formData.date} onChange={e => { setFormData({...formData, date: e.target.value}); setErrors({...errors, date: ''}); }} className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 transition-all ${errors.date ? 'border-rose-500 bg-rose-50 focus:border-rose-500' : 'border-slate-200 focus:border-[#1B2A6B]'}`} />
                  <AnimatePresence>
                    {errors.date && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-rose-500 mt-1">{errors.date}</motion.p>}
                  </AnimatePresence>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Time</label>
                    <input type="time" value={formData.start} onChange={e => { setFormData({...formData, start: e.target.value}); setErrors({...errors, start: ''}); }} className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 transition-all ${errors.start ? 'border-rose-500 bg-rose-50 focus:border-rose-500' : 'border-slate-200 focus:border-[#1B2A6B]'}`} />
                    <AnimatePresence>
                      {errors.start && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-rose-500 mt-1">{errors.start}</motion.p>}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">End Time</label>
                    <input type="time" value={formData.end} onChange={e => { setFormData({...formData, end: e.target.value}); setErrors({...errors, end: ''}); }} className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20 transition-all ${errors.end ? 'border-rose-500 bg-rose-50 focus:border-rose-500' : 'border-slate-200 focus:border-[#1B2A6B]'}`} />
                    <AnimatePresence>
                      {errors.end && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-rose-500 mt-1">{errors.end}</motion.p>}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => { setActiveModal(false); setErrors({}); setFormData({ date: '', start: '', end: '' }); }} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#0d1635] transition-colors">Save Availability</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExpertDashboardLayout>
  );
}
