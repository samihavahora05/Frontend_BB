import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { Clock, Video, User, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { Input } from "../src/components/ui/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import api from "../src/lib/axios";
import { SEO } from "../src/components/seo/SEO";

const bookingSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number" }),
  courseInterest: z.string().min(1, { message: "Please select a course" }),
});
type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookConsultationPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("2:00 PM");

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      courseInterest: "Full Stack Web Development"
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await api.post("/public/contact", {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        subject: "Book Consultation",
        message: `Course Interest: ${data.courseInterest}\nPreferred Date: ${selectedDate.toISOString().split('T')[0]}\nPreferred Time: ${selectedTime}`,
        source_page: "/book-consultation"
      });
      toast.success(`Consultation booked successfully for ${selectedDate.toDateString()} at ${selectedTime}! We will email you the meeting link.`);
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book consultation. Please try again.");
    }
  };

  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); 
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // 0 for Monday

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const currentMonthName = monthNames[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  return (
    <MainLayout>
      <SEO title="Book a Free Career Consultation | Blueboxx DA" description="Book a free 1:1 career consultation session with Blueboxx DA experts. Get a personalized roadmap for your career." />
      <div className="bg-[#0d1635] min-h-screen pt-24 pb-20 relative overflow-hidden text-white">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Left Side: Benefits */}
            <div className="w-full lg:w-5/12 lg:pt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  Free 1:1 Session
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                  Let's map out your <span className="text-[#C9A227]">Dream Career.</span>
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed mb-10">
                  Not sure which course is right for you? Book a free 30-minute consultation with our career experts to discuss your goals and get a personalized roadmap.
                </p>

                <div className="space-y-6">
                  {[
                    { title: "Personalized Roadmap", desc: "Get a step-by-step guide tailored to your background and career goals." },
                    { title: "Course Recommendations", desc: "Find exactly which skills you need to learn to crack product companies." },
                    { title: "Placement Clarity", desc: "Understand our placement process, partner companies, and guarantee terms." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>


              </motion.div>
            </div>

            {/* Right Side: Calendar & Form */}
            <div className="w-full lg:w-7/12">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Card className="shadow-2xl shadow-black/50 border-white/10 overflow-hidden text-slate-900 bg-white">
                  
                  {/* Calendar Header */}
                  <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Select Date & Time</h2>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5"><Video size={14}/> Zoom Call</span>
                        <span className="flex items-center gap-1.5"><Clock size={14}/> 30 Mins</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" onClick={prevMonth} variant="outline" size="icon" className="w-8 h-8 rounded-lg"><ChevronLeft size={16}/></Button>
                      <Button type="button" onClick={nextMonth} variant="outline" size="icon" className="w-8 h-8 rounded-lg"><ChevronRight size={16}/></Button>
                    </div>
                  </div>

                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row border-b border-slate-100">
                      
                      {/* Calendar UI Mockup */}
                      <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-100">
                        <h3 className="font-bold text-slate-800 text-center mb-4">{currentMonthName} {currentYear}</h3>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                            <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {[...Array(startDayOffset)].map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const isToday = dateObj.toDateString() === today.toDateString();
                            const isSelected = selectedDate.toDateString() === dateObj.toDateString();
                            const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                            return (
                              <button 
                                key={i} 
                                type="button"
                                onClick={() => setSelectedDate(dateObj)}
                                disabled={isPast}
                                className={`w-8 h-8 mx-auto rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                                  isSelected ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20" : 
                                  isToday ? "border border-[#1B2A6B] text-[#1B2A6B]" : 
                                  isPast ? "text-slate-300 cursor-not-allowed" : 
                                  "text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots Mockup */}
                      <div className="w-full md:w-1/2 p-6 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-center mb-4">{dayNames[selectedDate.getDay()]}, {shortMonthNames[selectedDate.getMonth()]} {selectedDate.getDate()}</h3>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                          {timeSlots.map((time, i) => (
                            <button 
                              key={i} 
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all text-center ${
                                selectedTime === time 
                                  ? "bg-[#1B2A6B] border-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20" 
                                  : "bg-white border-slate-200 text-slate-700 hover:border-[#1B2A6B]/50 hover:bg-blue-50"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Booking Form */}
                    <div className="p-8">
                      <h3 className="font-bold text-slate-900 mb-6">Your Details</h3>
                      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                            <Input 
                              placeholder="John Doe" 
                              icon={<User size={16}/>} 
                              {...register("fullName")}
                              className={errors.fullName ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs font-semibold">{errors.fullName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...register("email")}
                              className={errors.email ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {errors.email && <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                          <Input 
                            type="tel" 
                            placeholder="+91 98765 43210" 
                            {...register("phone")}
                            className={errors.phone ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''}
                          />
                          {errors.phone && <p className="text-red-500 text-xs font-semibold">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Course Interest</label>
                          <select 
                            {...register("courseInterest")}
                            className={`flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A6B]/20 focus-visible:border-[#1B2A6B] transition-all shadow-sm ${errors.courseInterest ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''}`}
                          >
                            <option value="Full Stack Web Development">Full Stack Web Development</option>
                            <option value="Data Science Masterclass">Data Science Masterclass</option>
                            <option value="UI/UX Design Pro">UI/UX Design Pro</option>
                            <option value="Not Sure Yet">Not Sure Yet</option>
                          </select>
                          {errors.courseInterest && <p className="text-red-500 text-xs font-semibold">{errors.courseInterest.message}</p>}
                        </div>

                        <Button variant="primary" size="lg" className="w-full mt-4 text-base" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Confirming...' : `Confirm Booking for ${shortMonthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedTime}`}
                        </Button>
                      </form>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
