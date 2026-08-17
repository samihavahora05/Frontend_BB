import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { MapPin, Mail, Globe, Github, Linkedin, Award, FileCode2, Share2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";

export default function PublicProfilePage() {
  return (
    <MainLayout>
      <div className="bg-transparent min-h-screen pt-24 pb-20">
        
        {/* Profile Header Background */}
        <div className="h-48 md:h-64 bg-[#0d1635] relative w-full overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-50%] right-[-10%] w-[50%] h-[200%] rounded-full bg-[#1B2A6B]/50 blur-[120px] pointer-events-none" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative -mt-24 md:-mt-32">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar (Profile Info) */}
            <div className="w-full lg:w-1/3">
              <Card className="shadow-2xl shadow-slate-200/50 border-white relative overflow-visible">
                <div className="absolute right-4 top-4">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border-white/50 text-slate-700 hover:bg-white">
                    <Share2 size={14} />
                  </Button>
                </div>
                <CardContent className="pt-0 px-6 pb-8 text-center relative z-10">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200 -mt-16 md:-mt-20 mb-4">
                    <img src="https://i.pravatar.cc/300?u=johndoe" alt="John Doe" className="w-full h-full object-cover" />
                  </div>
                  
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-1">John Doe</h1>
                  <p className="text-[#1B2A6B] font-semibold text-sm mb-4">Full Stack Developer</p>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">Alumni</Badge>
                    <Badge variant="gold" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Open to Work</Badge>
                  </div>

                  <div className="space-y-3 text-sm text-slate-600 mb-8 border-y border-slate-100 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-slate-400" /> Bangalore, India
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-slate-400" /> john.doe@example.com
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-slate-400" /> johndoe.dev
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 mb-6">
                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-600 hover:bg-[#1B2A6B] hover:text-white hover:border-[#1B2A6B] transition-colors"><Github size={18}/></Button>
                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-600 hover:bg-[#1B2A6B] hover:text-white hover:border-[#1B2A6B] transition-colors"><Linkedin size={18}/></Button>
                  </div>

                  <Button variant="primary" className="w-full gap-2 shadow-md">
                    <Download size={16} /> Download Resume
                  </Button>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card className="mt-6 border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["React.js", "Node.js", "TypeScript", "Next.js", "MongoDB", "PostgreSQL", "Tailwind CSS", "AWS", "Docker"].map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Main Content */}
            <div className="w-full lg:w-2/3 space-y-6 pt-8 lg:pt-0 lg:mt-32">
              
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Passionate Full Stack Developer with a strong foundation in modern web technologies. I love building scalable, performant, and user-centric applications. Recently graduated from BlueBoxx's Full Stack Development bootcamp where I built multiple production-grade projects.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm mt-4">
                    I am highly motivated, a quick learner, and thrive in collaborative environments. Looking for opportunities to contribute to an innovative engineering team.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Projects Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { title: "E-Commerce Microservices", desc: "A full-stack e-commerce platform built with React, Node.js, and Docker. Implemented Redis caching and Stripe payments.", tech: ["React", "Node", "Docker", "Redis"], link: "#" },
                    { title: "Real-time Chat Application", desc: "Built a scalable chat app using Socket.io and Next.js with complete authentication and message history.", tech: ["Next.js", "Socket.io", "MongoDB"], link: "#" }
                  ].map((project, i) => (
                    <div key={i} className="group border border-slate-100 rounded-xl p-5 hover:border-[#1B2A6B]/30 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <FileCode2 size={20} className="text-indigo-600" />
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-[#1B2A6B] transition-colors">{project.title}</h3>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-slate-200">View Demo</Button>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 mt-3 leading-relaxed">{project.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map(t => <span key={t} className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Advanced Full Stack Development", issuer: "BlueBoxx", date: "Oct 2026", id: "BBX-908123" },
                    { title: "AWS Certified Developer - Associate", issuer: "Amazon Web Services", date: "Aug 2026", id: "AWS-DEV-445" }
                  ].map((cert, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Award size={24} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{cert.title}</h4>
                        <div className="text-sm font-semibold text-[#1B2A6B] mb-1">{cert.issuer}</div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                          <span>Issued: {cert.date}</span>
                          <span className="font-mono">ID: {cert.id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
