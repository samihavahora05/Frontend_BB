import { ExpertDashboardLayout } from "../../../src/layout/ExpertDashboardLayout";
import { Clock, Calendar, CheckCircle2, ChevronRight, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import api from "../../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type Slot = { start: string, end: string };
type DayConfig = { enabled: boolean, slots: Slot[] };
type AvailabilityConfig = Record<string, DayConfig>;

const DEFAULT_SLOTS: AvailabilityConfig = DAYS.reduce((acc, day) => {
  acc[day] = { enabled: false, slots: [] };
  return acc;
}, {} as AvailabilityConfig);

export default function ExpertAvailabilityPage() {
  const { data, isLoading, mutate } = useSWR("/profile", fetcher);
  const [activeDay, setActiveDay] = useState("Monday");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityConfig>(DEFAULT_SLOTS);

  useEffect(() => {
    if (data?.profile?.availability) {
      let parsed = data.profile.availability;
      if (typeof parsed === "string") {
        try { parsed = JSON.parse(parsed); } catch(e) {}
      }
      setAvailability({ ...DEFAULT_SLOTS, ...parsed });
    }
  }, [data]);

  const activeConfig = availability[activeDay] || { enabled: false, slots: [] };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/profile", { availability });
      setSaveSuccess(true);
      mutate();
      toast.success("Availability updated");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  const updateActiveDay = (changes: Partial<DayConfig>) => {
    setAvailability(prev => ({
      ...prev,
      [activeDay]: { ...prev[activeDay], ...changes }
    }));
  };

  const addSlot = () => {
    updateActiveDay({
      slots: [...activeConfig.slots, { start: "09:00 AM", end: "05:00 PM" }]
    });
  };

  const removeSlot = (index: number) => {
    const newSlots = [...activeConfig.slots];
    newSlots.splice(index, 1);
    updateActiveDay({ slots: newSlots });
  };

  const updateSlot = (index: number, key: 'start' | 'end', value: string) => {
    const newSlots = [...activeConfig.slots];
    newSlots[index] = { ...newSlots[index], [key]: value };
    updateActiveDay({ slots: newSlots });
  };

  return (
    <ExpertDashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-1">My Availability</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your working hours and session slots.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
            saveSuccess ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#1B2A6B] text-white hover:bg-[#0d1635]'
          }`}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : 
           saveSuccess ? <CheckCircle2 size={16} /> : 
           <CheckCircle2 size={16} />}
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Days Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              <Calendar size={16} className="text-[#C9A227]" /> Working Days
            </h3>
          </div>
          <div className="p-2">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all mb-1 ${
                  activeDay === day 
                    ? "bg-[#1B2A6B] text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {day}
                {activeDay === day && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400">Loading schedule...</div>
          ) : (
          <>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-800">
              Configure slots for {activeDay}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Enable Day</span>
              <div 
                className={`w-10 h-5 rounded-full relative cursor-pointer shadow-inner transition-colors ${activeConfig.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} 
                onClick={() => updateActiveDay({ enabled: !activeConfig.enabled })}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${activeConfig.enabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {!activeConfig.enabled ? (
              <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-slate-100">
                This day is disabled. Enable it to add availability slots.
              </div>
            ) : (
              <>
                {activeConfig.slots.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No slots added yet.</p>
                ) : (
                  activeConfig.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:border-[#1B2A6B]/20 transition-colors">
                      <div className="flex-1 flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                          <Clock size={16} className="text-slate-400" />
                          <select 
                            value={slot.start}
                            onChange={(e) => updateSlot(index, 'start', e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-700 outline-none border-none focus:ring-0"
                          >
                            <option>08:00 AM</option>
                            <option>09:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>12:00 PM</option>
                            <option>01:00 PM</option>
                            <option>02:00 PM</option>
                            <option>03:00 PM</option>
                            <option>04:00 PM</option>
                          </select>
                        </div>
                        <span className="text-slate-400 font-bold">-</span>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                          <Clock size={16} className="text-slate-400" />
                          <select 
                            value={slot.end}
                            onChange={(e) => updateSlot(index, 'end', e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-700 outline-none border-none focus:ring-0"
                          >
                            <option>12:00 PM</option>
                            <option>01:00 PM</option>
                            <option>02:00 PM</option>
                            <option>03:00 PM</option>
                            <option>04:00 PM</option>
                            <option>05:00 PM</option>
                            <option>06:00 PM</option>
                            <option>07:00 PM</option>
                            <option>08:00 PM</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={() => removeSlot(index)} className="text-slate-400 hover:text-red-500 font-bold text-sm px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        Remove
                      </button>
                    </div>
                  ))
                )}
                
                <button onClick={addSlot} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-[#1B2A6B] hover:text-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all flex items-center justify-center gap-2 mt-4">
                  <Plus size={18} /> Add another slot
                </button>
              </>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </ExpertDashboardLayout>
  );
}
