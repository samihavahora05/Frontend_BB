import { useState } from "react";
import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { PlayCircle, Star, TrendingUp, Quote } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { SEO } from "../src/components/seo/SEO";

const categories = ["All", "Full Stack", "Data Science", "UI/UX Design", "Marketing"];

const stories = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "SDE I @ Amazon",
    course: "Full Stack",
    image: "https://i.pravatar.cc/300?img=12",
    oldSalary: "4 LPA",
    newSalary: "24 LPA",
    jump: "600%",
    quote: "The 1:1 mentorship and mock interviews were game-changers. The mentors pointed out exactly where my system design skills were lacking. I couldn't have cracked Amazon without BlueBoxx.",
    video: true
  },
  {
    id: 2,
    name: "Sneha Patel",
    role: "Product Designer @ Swiggy",
    course: "UI/UX Design",
    image: "https://i.pravatar.cc/300?img=5",
    oldSalary: "Fresher",
    newSalary: "14 LPA",
    jump: "First Job",
    quote: "Building a portfolio with real client projects gave me a huge advantage over other candidates. The recruiters were genuinely impressed with my case studies.",
    video: false
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Data Analyst @ Fractal",
    course: "Data Science",
    image: "https://i.pravatar.cc/300?img=33",
    oldSalary: "5 LPA",
    newSalary: "12 LPA",
    jump: "240%",
    quote: "Transitioning from a non-tech background felt impossible until I joined BlueBoxx. The curriculum is structured perfectly for beginners to reach an advanced level.",
    video: true
  },
  {
    id: 4,
    name: "Neha Kapoor",
    role: "Frontend Engineer @ CRED",
    course: "Full Stack",
    image: "https://i.pravatar.cc/300?img=9",
    oldSalary: "3.5 LPA",
    newSalary: "18 LPA",
    jump: "514%",
    quote: "I was stuck in a service-based company with outdated tech. BlueBoxx taught me modern React and Node.js which directly helped me crack a top product company.",
    video: false
  },
  {
    id: 5,
    name: "Arjun Reddy",
    role: "Growth Manager @ Zomato",
    course: "Marketing",
    image: "https://i.pravatar.cc/300?img=15",
    oldSalary: "6 LPA",
    newSalary: "15 LPA",
    jump: "250%",
    quote: "The practical approach to performance marketing and running actual ad campaigns during the course gave me the confidence to handle large budgets.",
    video: false
  },
  {
    id: 6,
    name: "Pooja Verma",
    role: "Backend Developer @ Uber",
    course: "Full Stack",
    image: "https://i.pravatar.cc/300?img=20",
    oldSalary: "Fresher",
    newSalary: "22 LPA",
    jump: "First Job",
    quote: "The DSA and competitive programming modules were incredibly rigorous. The instructors pushed me to my limits, and it paid off massively.",
    video: true
  }
];

export default function SuccessStoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredStories = stories.filter(story => 
    activeCategory === "All" || story.course === activeCategory
  );

  return (
    <MainLayout>
      <SEO title="Success Stories & Alumni Network | Blueboxx DA" description="Read how thousands of students have transformed their careers, cracked FAANG interviews, and achieved incredible salary hikes with Blueboxx DA." />
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-[#0d1635] text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge variant="gold" className="mb-6">Student Outcomes</Badge>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            Real Stories. <span className="text-[#C9A227]">Real Impact.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto"
          >
            Read how thousands of students have transformed their careers, cracked FAANG interviews, and achieved incredible salary hikes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat 
                    ? "bg-[#C9A227] text-[#0F172A] shadow-lg shadow-[#C9A227]/20" 
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                {story.video ? (
                  <div className="relative aspect-[4/3] bg-slate-200 group cursor-pointer overflow-hidden">
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <PlayCircle size={32} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-4 bg-gradient-to-r from-[#1B2A6B] to-[#2E45A3]"></div>
                )}
                
                <CardContent className={`p-6 flex-1 flex flex-col ${!story.video ? 'pt-8 relative' : ''}`}>
                  {!story.video && (
                    <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full border-4 border-white shadow-md absolute -top-8 left-6 object-cover" />
                  )}
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-xl text-slate-900">{story.name}</h3>
                      <div className="flex text-amber-400">
                        {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-amber-400"/>)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#1B2A6B]">{story.role}</div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-3 mb-6">
                    <div className="flex-1">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Before</div>
                      <div className="font-semibold text-slate-700 text-sm">{story.oldSalary}</div>
                    </div>
                    <TrendingUp size={20} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 text-right">
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">After ({story.jump})</div>
                      <div className="font-extrabold text-emerald-600 text-sm">{story.newSalary}</div>
                    </div>
                  </div>

                  <div className="relative mt-auto">
                    <Quote size={32} className="absolute -top-2 -left-2 text-slate-100 -z-10" />
                    <p className="text-slate-600 text-sm leading-relaxed italic relative z-10">"{story.quote}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="font-bold">Load More Stories</Button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
