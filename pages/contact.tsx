import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { Input } from "../src/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import api from "../src/lib/axios";
import { useGlobalSettings } from "../src/contexts/SettingsContext";
import { SEO } from "../src/components/seo/SEO";

const contactSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }),
});
type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { settings } = useGlobalSettings();
  
  let subjects = [
    "Course Information",
    "Internship Inquiry",
    "Job Opportunities",
    "Mentorship",
    "Career Guidance",
    "Book Consultation",
    "Corporate Training",
    "Partnership / Collaboration",
    "Campus Hiring"
  ];
  
  try {
    if (settings?.crm_lead_categories) {
      const parsed = JSON.parse(settings.crm_lead_categories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        subjects = parsed;
      }
    }
  } catch (e) {
    // Fallback to default
  }

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: subjects[0]
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await api.post("/public/contact", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        source_page: "/contact"
      });
      toast.success("Message sent successfully! Our team will contact you within 24 hours.");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <MainLayout>
      <SEO title="Contact Us | Blueboxx DA" description="Get in touch with Blueboxx DA for any inquiries regarding courses, internships, and placements." />
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-[#0d1635] text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Get in <span className="text-[#C9A227]">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto"
          >
            Have a question about our courses, placements, or mentorship? Our team is here to help you.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-transparent min-h-screen relative -mt-8">
        <div className="container mx-auto px-4 max-w-6xl relative z-20">
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Contact Info & Cards */}
            <div className="w-full lg:w-1/3 space-y-6">
              <Card className="bg-[#1B2A6B] text-white border-none shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Corporate Office</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-blue-300" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-200 text-sm mb-1">Address</div>
                        <p className="text-white leading-relaxed text-sm">
                          SF 02, INDIA BULLS MEGA MALL, Dinesh Mill Rd, near Swami Vivekananda Railway Over Bridge, Anand Nagar, Akota, Vadodara, Gujarat 390022
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Phone size={20} className="text-blue-300" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-200 text-sm mb-1">Phone</div>
                        <p className="text-white font-medium text-sm">+91 90235 12853</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Mail size={20} className="text-blue-300" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-200 text-sm mb-1">Email</div>
                        <p className="text-white font-medium text-sm">info.blueboxx@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <Clock size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Working Hours</h4>
                      <p className="text-sm text-slate-500">Mon - Fri: 9 AM - 6 PM</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <MessageSquare size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Live Support</h4>
                      <p className="text-sm text-slate-500">Available 24/7 on WhatsApp</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <Card className="shadow-xl shadow-slate-200/50 border-slate-200 h-full">
                <CardContent className="p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Send us a message</h2>
                  <p className="text-slate-600 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>
                  
                  <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">First Name</label>
                        <Input 
                          placeholder="John" 
                          {...register("firstName")}
                          className={errors.firstName ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''} 
                        />
                        {errors.firstName && <p className="text-red-500 text-xs font-semibold">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Last Name</label>
                        <Input 
                          placeholder="Doe" 
                          {...register("lastName")}
                          className={errors.lastName ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''} 
                        />
                        {errors.lastName && <p className="text-red-500 text-xs font-semibold">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          {...register("email")}
                          className={errors.email ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''} 
                        />
                        {errors.email && <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                        <Input 
                          type="tel" 
                          placeholder="+91 98765 43210" 
                          {...register("phone")}
                          className={errors.phone ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''} 
                        />
                        {errors.phone && <p className="text-red-500 text-xs font-semibold">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Subject</label>
                      <select 
                        {...register("subject")}
                        className={`flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A6B]/20 focus-visible:border-[#1B2A6B] transition-all shadow-sm ${errors.subject ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''}`}
                      >
                        {subjects.map((sub, idx) => (
                          <option key={idx} value={sub}>{sub}</option>
                        ))}
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs font-semibold">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Your Message</label>
                      <textarea 
                        rows={5} 
                        {...register("message")}
                        className={`flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A6B]/20 focus-visible:border-[#1B2A6B] transition-all shadow-sm resize-none ${errors.message ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''}`}
                        placeholder="How can we help you?"
                      />
                      {errors.message && <p className="text-red-500 text-xs font-semibold">{errors.message.message}</p>}
                    </div>

                    <Button variant="primary" size="lg" className="w-full gap-2" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
