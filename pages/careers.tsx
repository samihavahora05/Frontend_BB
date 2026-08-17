import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { Briefcase, Heart, Zap, Globe } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/Card";
import { Button } from "../src/components/ui/Button";
import { SEO } from "../src/components/seo/SEO";

export default function CareersPage() {
  return (
    <MainLayout>
      <SEO title="Careers at Blueboxx DA | Join Our Team" description="Join a passionate team of educators, engineers, and designers on a mission to democratize premium tech education globally." />
      {/* Hero Section */}
      <div className="pt-24 pb-20 bg-[#0d1635] text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
        />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight"
          >
            Build the future of <span className="text-[#C9A227]">Education</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Join a passionate team of educators, engineers, and designers on a mission to democratize premium tech education globally.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Button variant="gold" size="lg" className="px-8 font-bold">View Open Roles</Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why join BlueBoxx?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We offer competitive salaries, equity, remote work flexibility, and a chance to make a real impact on students' lives.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Heart, title: "Healthcare", desc: "Comprehensive health, dental, and vision coverage." },
              { icon: Globe, title: "Work Anywhere", desc: "Remote-first culture with co-working allowances." },
              { icon: Zap, title: "Fast Growth", desc: "Rapid career progression in a hyper-growth startup." },
              { icon: Briefcase, title: "Equity", desc: "Stock options for all full-time employees." }
            ].map((perk, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <perk.icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{perk.title}</h3>
                  <p className="text-sm text-slate-600">{perk.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Open Positions</h2>
            <div className="space-y-4">
              <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                <Briefcase size={32} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No open roles at the moment</h3>
                <p className="text-sm text-slate-500 mt-1">We're not actively hiring right now, but we're always looking for great talent. Check back later!</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
}
