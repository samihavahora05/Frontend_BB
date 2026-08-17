import { MainLayout } from "../../src/layout/MainLayout";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  Building, Star, Users, Briefcase, Award, 
  MessageSquare, Clock, Link as LinkIcon, CheckCircle2
} from "lucide-react";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import Link from "next/link";

export default function MentorProfilePage() {
  const router = useRouter();
  const { slug } = router.query;
  const mentorName = String(slug || 'Loading...').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="shrink-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                <img src={`https://i.pravatar.cc/300?u=${slug}`} alt={mentorName} className="w-full h-full object-cover" />
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 pt-2">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{mentorName}</h1>
                  <p className="text-lg md:text-xl text-slate-600 font-medium mb-2">Senior SDE II at Google</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><Building size={16} /> Ex-Amazon, Ex-Microsoft</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={16} /> 7+ Years Exp</span>
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl text-slate-500 border-slate-300">
                    <LinkIcon size={20} />
                  </Button>
                  <Link href="#book">
                    <Button variant="primary" size="lg" className="h-12 px-8 text-base shadow-lg shadow-[#1B2A6B]/20">
                      Book Session
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Star size={20} className="fill-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating</div>
                    <div className="font-bold text-slate-800">4.9 / 5.0</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden sm:block mx-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions</div>
                    <div className="font-bold text-slate-800">1,200+</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden sm:block mx-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mentees</div>
                    <div className="font-bold text-slate-800">850+</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col lg:flex-row gap-8">
          
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed text-sm mb-4">
                  Hi! I'm {mentorName}. I have over 7 years of experience building scalable backend systems and high-performance frontend applications at top product companies. I successfully transitioned from a tier-3 college to FAANG, and I know exactly what it takes to crack these interviews.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Whether you need help with System Design, React performance optimization, or just want to do a mock interview to test your readiness, I'm here to help you accelerate your career.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["React", "Node.js", "System Design", "Algorithms", "Career Guidance"].map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm bg-slate-100">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                  {[
                    { role: "Senior SDE II", company: "Google", duration: "2023 - Present", desc: "Leading the core infrastructure team for Google Workspace." },
                    { role: "SDE II", company: "Amazon", duration: "2020 - 2023", desc: "Built highly available microservices for AWS billing pipeline." },
                    { role: "Software Engineer", company: "Microsoft", duration: "2018 - 2020", desc: "Worked on Azure Active Directory." }
                  ].map((exp, i) => (
                    <div key={i} className="relative flex items-start gap-6">
                      <div className="w-7 h-7 rounded-full bg-white border-4 border-[#1B2A6B] flex-shrink-0 z-10 mt-1"></div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{exp.role}</h4>
                        <div className="text-sm font-semibold text-[#1B2A6B] mb-2">{exp.company} <span className="text-slate-400 font-normal ml-2">{exp.duration}</span></div>
                        <p className="text-sm text-slate-600">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { name: "Rahul Singh", review: "The mock interview was incredibly eye-opening. Pointed out exactly what I was doing wrong in System Design. Got an offer from Amazon next month!", rating: 5 },
                  { name: "Sneha T.", review: "Amazing mentor. Very patient and explains complex topics like Kafka in a very simple way.", rating: 5 }
                ].map((review, i) => (
                  <div key={i} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${review.name}`} alt={review.name} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{review.name}</div>
                        <div className="flex text-amber-400">
                          {[...Array(review.rating)].map((_, j) => <Star key={j} size={12} className="fill-amber-400"/>)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{review.review}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Booking */}
          <div className="w-full lg:w-1/3" id="book">
            <div className="space-y-6 sticky top-28">
              <Card className="border-[#1B2A6B]/20 shadow-lg shadow-[#1B2A6B]/5">
                <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-2xl pb-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    Book a Session
                    <span className="text-2xl font-extrabold text-[#1B2A6B]">₹1,499</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 mb-6">
                    <div className="p-3 rounded-xl border-2 border-[#1B2A6B] bg-[#1B2A6B]/5 cursor-pointer relative">
                      <div className="absolute top-3 right-3 text-[#1B2A6B]">
                        <CheckCircle2 size={20} className="fill-[#1B2A6B] text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Mock Interview</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5"><Clock size={14}/> 45 Mins</p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 hover:border-[#1B2A6B]/50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Resume Review</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5"><Clock size={14}/> 30 Mins</p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 hover:border-[#1B2A6B]/50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Career Guidance</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5"><Clock size={14}/> 30 Mins</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-slate-800 text-sm mb-3">Available Slots (Tomorrow)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="text-xs h-9">10:00 AM</Button>
                      <Button variant="outline" className="text-xs h-9">11:30 AM</Button>
                      <Button variant="outline" className="text-xs h-9 bg-slate-100 text-slate-400 border-slate-100" disabled>2:00 PM</Button>
                      <Button variant="outline" className="text-xs h-9">4:30 PM</Button>
                    </div>
                  </div>

                  <Link href={`/book-session/${slug}`}>
                    <Button variant="primary" className="w-full shadow-lg shadow-[#1B2A6B]/20">Confirm Booking</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Achievements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                        <Award size={20} className="text-purple-600" />
                      </div>
                      <span className="text-slate-700 text-sm font-semibold">Top 1% Expert 2025</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Building size={20} className="text-emerald-600" />
                      </div>
                      <span className="text-slate-700 text-sm font-semibold">Placed 50+ students in FAANG</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
