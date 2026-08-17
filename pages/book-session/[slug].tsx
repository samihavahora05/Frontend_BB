import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import { MainLayout } from "../../src/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  CheckCircle2, CreditCard, Lock, AlertCircle, FileText
} from "lucide-react";
import { Button } from "../../src/components/ui/Button";
import useSWR from "swr";
import api from "../../src/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function BookSessionPage() {
  const router = useRouter();
  const { slug } = router.query; // slug is the expert ID here
  const [step, setStep] = useState(1);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(25);
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00 AM");
  const [isProcessing, setIsProcessing] = useState(false);
  const [goal, setGoal] = useState("");
  const [notes, setNotes] = useState("");
  
  const { data: mentor, error, isLoading } = useSWR(slug ? `/public/experts/${slug}` : null, fetcher);

  if (isLoading) return <MainLayout><div className="min-h-screen flex items-center justify-center pt-28">Loading...</div></MainLayout>;
  if (error || !mentor) return <MainLayout><div className="min-h-screen flex items-center justify-center pt-28">Expert not found</div></MainLayout>;

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Create date format YYYY-MM-DD
      const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      
      // Parse time (e.g. 10:00 AM to 10:00)
      const timeMatch = selectedTime?.match(/(\d+):(\d+)\s(AM|PM)/);
      let startTime = "10:00";
      if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const mins = timeMatch[2];
          if (timeMatch[3] === 'PM' && hours < 12) hours += 12;
          if (timeMatch[3] === 'AM' && hours === 12) hours = 0;
          startTime = `${String(hours).padStart(2, '0')}:${mins}`;
      }
      
      // Calculate end time (45 mins later)
      const [sh, sm] = startTime.split(':').map(Number);
      const endMins = (sm + 45) % 60;
      const endHours = sh + Math.floor((sm + 45) / 60);
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
      
      // In a real flow we'd select a specific session from mentor.sessions
      // Here we assume the first active session for this mockup
      const sessionId = mentor.sessions?.[0]?.id || 1;

      // Ensure Razorpay SDK is loaded
      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      const res = await api.post(`/public/experts/sessions/${sessionId}/book`, {
          expert_id: mentor.id,
          expert_profile_id: mentor.id,
          booking_date: dateStr,
          start_time: startTime,
          end_time: endTime,
          notes: `${goal} - ${notes}`
      });
      
      const orderRes = res.data;
      if (!orderRes?.success || !orderRes?.razorpay_order_id) {
        toast.error(orderRes?.message || "Failed to create Razorpay Order.");
        setIsProcessing(false);
        return;
      }

      const bookingId = String(orderRes.data?.booking_id || orderRes.booking_id);
      const orderId = orderRes.razorpay_order_id;
      const keyId = orderRes.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const options: any = {
        key: keyId,
        amount: (orderRes.amount || orderRes.data?.amount || 999) * 100, // in paise
        currency: orderRes.currency || "INR",
        name: "Blueboxx DA",
        description: `Mentorship Session with ${mentor.name}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post(`/public/experts/bookings/${bookingId}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              toast.success("Mentorship session booked successfully!");
              router.push({
                pathname: '/payment-success',
                query: {
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  amount: orderRes.amount || 999,
                  expert: mentor.name
                }
              });
            } else {
              toast.error(verifyRes.data?.message || "Payment verification failed.");
              router.push('/payment-failed');
            }
          } catch (err: any) {
            console.error("Session verification error:", err);
            toast.error(err.response?.data?.message || "Payment verification failed.");
            router.push('/payment-failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: { color: "#0d1635" },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error("Payment cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setIsProcessing(false);
        console.error("Razorpay payment failed:", resp?.error);
        toast.error(resp?.error?.description || "Payment failed. Please try again.");
        const desc = resp?.error?.description || 'Payment Failed';
        const orderId = resp?.error?.metadata?.order_id || '';
        const paymentId = resp?.error?.metadata?.payment_id || '';
        router.push(`/payment-failed?reason=${encodeURIComponent(desc)}&order_id=${encodeURIComponent(orderId)}&payment_id=${encodeURIComponent(paymentId)}`);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to initiate Razorpay payment.");
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-transparent py-12 pt-28">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          {step < 4 && (
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full shadow-sm border-2 border-white object-cover" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Book Session with {mentor.name}</h1>
                  <p className="text-sm text-slate-500 font-medium">{mentor.designation} at {mentor.company}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= num ? 'bg-[#1B2A6B] text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step > num ? <CheckCircle2 size={14} /> : num}
                    </div>
                    {num < 3 && <div className={`w-10 h-0.5 ${step > num ? 'bg-[#1B2A6B]' : 'bg-slate-200'}`} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {/* STEP 1: DATE & TIME */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Date & Time</h2>
                    <p className="text-slate-500">Pick a slot that works best for you. Times are shown in your local timezone.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar UI */}
                    <div className="border border-slate-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">
                          {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Previous Month"
                          >
                            <ChevronLeft size={16}/>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Next Month"
                          >
                            <ChevronRight size={16}/>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                          const date = i + 1;
                          const todayObj = new Date();
                          const thisDateObj = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), date);
                          const isPast = thisDateObj < new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());
                          const isAvailable = !isPast && (date % 3 === 0 || date % 4 === 0 || date % 2 === 1);
                          const isSelected = selectedDate === date;
                          return (
                            <button 
                              key={i} 
                              disabled={!isAvailable}
                              onClick={() => setSelectedDate(date)}
                              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                                isSelected ? 'bg-[#1B2A6B] text-white shadow-md' :
                                isAvailable ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                'text-slate-300 cursor-not-allowed'
                              }`}
                            >
                              {date}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-[#1B2A6B]" /> Available Times
                      </h3>
                      {selectedDate ? (
                        <div className="grid grid-cols-2 gap-3">
                          {["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "6:00 PM", "7:30 PM"].map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-colors ${
                                selectedTime === time 
                                  ? 'border-[#1B2A6B] bg-[#1B2A6B]/5 text-[#1B2A6B]' 
                                  : 'border-slate-100 hover:border-blue-200 text-slate-600 hover:bg-blue-50'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                          <p className="text-slate-400 font-medium">Please select a date first</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button variant="primary" size="lg" className="px-8 shadow-md" disabled={!selectedDate || !selectedTime} onClick={handleNext}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: AGENDA */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Agenda</h2>
                    <p className="text-slate-500">Help {mentor.name} prepare for your session by providing some details.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">What's the main goal of this session?</label>
                      <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none" placeholder="e.g. Mock interview for SDE role, Resume review..." />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Provide some background (Optional)</label>
                      <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A6B] outline-none resize-none" placeholder="I have 2 years of experience and I'm currently interviewing at..."></textarea>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-6 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-blue-600 rounded-xl shadow-sm flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">Share your Resume</h4>
                          <p className="text-xs text-slate-500">Mentors can give better advice if they see your profile.</p>
                        </div>
                      </div>
                      <input type="file" id="resume-upload" className="hidden" accept=".pdf" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          toast.success(`Attached ${e.target.files[0].name}`);
                        }
                      }} />
                      <Button variant="outline" type="button" size="sm" className="font-bold bg-white" onClick={() => document.getElementById('resume-upload')?.click()}>Upload PDF</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-between">
                    <Button variant="outline" size="lg" className="px-8" onClick={handlePrev}>Back</Button>
                    <Button variant="primary" size="lg" className="px-8 shadow-md" onClick={handleNext}>Continue to Payment</Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handlePayment} className="grid lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-3 space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h2>
                        <p className="text-slate-500">Complete your payment to confirm the booking.</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><CreditCard size={18} /> Payment Method</h3>
                        <div className="p-4 border-2 border-[#1B2A6B] bg-[#1B2A6B]/5 rounded-xl relative cursor-pointer">
                          <div className="absolute top-4 right-4 text-[#1B2A6B]"><CheckCircle2 size={20} /></div>
                          <div className="font-bold text-slate-900 mb-1">Credit / Debit Card</div>
                          <p className="text-xs text-slate-500 mb-4">Secured by Stripe</p>
                          
                          <div className="space-y-3">
                            <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1B2A6B]" placeholder="Card Number" required />
                            <div className="grid grid-cols-2 gap-3">
                              <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1B2A6B]" placeholder="MM/YY" required />
                              <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1B2A6B]" placeholder="CVC" required />
                            </div>
                            <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1B2A6B]" placeholder="Name on Card" required />
                          </div>
                        </div>
                        
                        <div className="p-4 border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
                          <span className="font-bold text-slate-700">UPI / Netbanking (Razorpay)</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" size="lg" className="px-8" onClick={handlePrev} disabled={isProcessing}>Back</Button>
                        <Button type="submit" variant="primary" size="lg" className="flex-1 shadow-md" disabled={isProcessing}>
                          {isProcessing ? "Processing Payment..." : `Pay ${mentor.price}`}
                        </Button>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-200">Session Summary</h3>
                        <div className="flex gap-3 mb-6">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shrink-0 text-[#1B2A6B]">
                            <CalendarIcon size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{new Date().toLocaleString('default', { month: 'short' })} {selectedDate}, {new Date().getFullYear()}</div>
                            <div className="text-slate-500 text-xs font-medium">{selectedTime} • 45 Mins</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm mb-6 pb-6 border-b border-slate-200">
                          <div className="flex justify-between text-slate-600">
                            <span>Mentorship Session</span>
                            <span className="font-semibold text-slate-800">{mentor.price}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Platform Fee</span>
                            <span className="font-semibold text-slate-800">₹99</span>
                          </div>
                        </div>

                        <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
                          <span>Total</span>
                          <span>₹{parseInt(mentor.price.replace(/[^0-9]/g, '')) + 99}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                          <Lock size={14} /> Secure encrypted checkout
                        </div>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS */}
              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Session Confirmed!</h2>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                    Your 1:1 session with {mentor.name} is booked for Oct {selectedDate} at {selectedTime}. A calendar invite has been sent to your email.
                  </p>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-left max-w-md mx-auto mb-8">
                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 font-medium">
                      Please join the meeting link 5 minutes early. Rescheduling is allowed up to 24 hours before the session.
                    </p>
                  </div>

                  <Link href="/student/mentor-sessions">
                    <Button variant="primary" size="lg" className="px-8 shadow-md">
                      View My Sessions
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
