import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Download,
  Settings,
  Share2,
  ThumbsUp
} from "lucide-react";
import useSWR from "swr";
import api from "../../src/lib/axios";
import { AnimatedContent } from "../../src/components/reactbits/AnimatedContent";
import { SEO } from "../../src/components/seo/SEO";
import { getImageUrl } from "../../src/lib/imageUtils";

export default function CoursePlayerPage() {
  const router = useRouter();
  const { courseId } = router.query;

  const fetcher = async (url: string) => {
    try {
      const res = await api.get(url);
      if (res?.data?.data) return res.data.data;
      if (res?.data) return res.data;
    } catch {}
    try {
      const res2 = await api.get(`/courses/${courseId}`);
      if (res2?.data?.data) return res2.data.data;
      if (res2?.data) return res2.data;
    } catch {}
    return null;
  };

  const { data: liveCourse } = useSWR(courseId ? `/public/courses/${courseId}` : null, fetcher);
  const course = liveCourse;

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <SEO 
        title={course?.title ? `${course.title} | Blueboxx DA Learning` : "Learning Dashboard | Blueboxx DA"}
        description="Access your course materials, videos, and resources."
        robots="noindex, nofollow"
      />
      <div className="min-h-screen bg-slate-900 flex flex-col font-inter">
        {/* Top Navigation */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <div className="h-6 w-px bg-slate-700 hidden sm:block" />
          <h1 className="text-white font-bold text-sm sm:text-base line-clamp-1 hidden sm:block">
            {course?.title || "Loading..."}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-400 hover:text-white transition-colors p-2">
            <Share2 size={18} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors p-2">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold border-2 border-slate-800">
            AR
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Left Side: Player & Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">
          {/* Video Player Area */}
          <div className="w-full bg-black aspect-video relative group">
            {/* Dummy Video Player */}
            <img 
              src={course?.thumbnail} 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600/90 hover:bg-blue-600 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-transform hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                <PlayCircle size={40} className="ml-2" />
              </button>
            </div>
            
            {/* Fake Video Controls */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-4 gap-4">
              <button className="text-white hover:text-blue-400"><PlayCircle size={20} /></button>
              <div className="flex-1 h-1 bg-white/30 rounded-full relative cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-blue-500 rounded-full" />
              </div>
              <span className="text-xs text-white font-medium">12:34 / 45:00</span>
              <button className="text-white hover:text-blue-400"><Settings size={18} /></button>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8">
            <div className="flex items-center gap-6 border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar shrink-0">
              {['overview', 'resources', 'discussion', 'notes'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1">
              <AnimatedContent direction="up" delay={0.1}>
                {activeTab === 'overview' && (
                  <div className="animate-in fade-in space-y-8 pb-12">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">React Fundamentals: State & Props</h2>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        In this lesson, we will dive deep into React's core concepts: State and Props. You'll learn how to manage component data and pass it down the component tree efficiently.
                      </p>
                    </div>

                    <div className="flex items-center gap-4 py-6 border-y border-slate-200">
                      <img src="https://i.pravatar.cc/150?u=ankit" alt="Instructor" className="w-14 h-14 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Instructor</p>
                        <p className="text-base font-bold text-slate-900">{course?.instructor}</p>
                        <p className="text-sm text-slate-500">Senior Software Engineer</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="animate-in fade-in space-y-4 pb-12">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Downloadable Resources</h3>
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Lesson {i} Slides & Code.zip</p>
                            <p className="text-xs text-slate-500">ZIP File • 2.4 MB</p>
                          </div>
                        </div>
                        <button className="text-slate-400 group-hover:text-blue-600 transition-colors">
                          <Download size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="animate-in fade-in space-y-6 pb-12">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">AR</div>
                      <div className="flex-1">
                        <textarea placeholder="Ask a question or share your thoughts..." className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px]" />
                        <div className="flex justify-end mt-2">
                          <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700">Post Comment</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 mt-8">
                      <div className="flex gap-4">
                        <img src="https://i.pravatar.cc/150?u=student1" alt="User" className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-sm">Priya Sharma</span>
                            <span className="text-xs text-slate-500">2 days ago</span>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">Can someone explain why we shouldn't mutate state directly?</p>
                          <div className="flex items-center gap-4 text-slate-500 text-xs font-semibold">
                            <button className="flex items-center gap-1 hover:text-blue-600"><ThumbsUp size={14} /> 12</button>
                            <button className="flex items-center gap-1 hover:text-blue-600"><MessageSquare size={14} /> Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatedContent>
            </div>
          </div>
        </div>

        {/* Right Side: Curriculum Sidebar */}
        <div className="w-full lg:w-[350px] xl:w-[400px] bg-white border-l border-slate-200 flex flex-col shrink-0 lg:h-full lg:overflow-y-auto">
          <div className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Course Content</h2>
            <div className="flex justify-between items-center mt-2 text-xs font-semibold text-slate-500">
              <span>12 / 45 Lessons</span>
              <span>25% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course?.curriculum && course.curriculum.length > 0 ? (
              course.curriculum.map((module: any, mIdx: number) => (
                <div key={mIdx} className="border-b border-slate-100">
                  <button 
                    onClick={() => toggleModule(mIdx)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{module.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">0 / {module.items?.length || 0} • {module.duration || '45 min'}</p>
                    </div>
                    {expandedModules.includes(mIdx) ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </button>
                  
                  {expandedModules.includes(mIdx) && (
                    <div className="bg-white">
                      {module.items?.map((lesson: any, lIdx: number) => {
                        const isCurrent = mIdx === 0 && lIdx === 1;
                        const isLocked = !lesson.isFree && mIdx > 0;
                        const isCompleted = mIdx === 0 && lIdx === 0;

                        return (
                          <div key={lIdx} className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${isCurrent ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                            <div className="mt-0.5 shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 size={16} className="text-emerald-500" />
                              ) : isLocked ? (
                                <Lock size={16} className="text-slate-400" />
                              ) : isCurrent ? (
                                <PlayCircle size={16} className="text-blue-600" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                              )}
                            </div>
                            <div>
                              <p className={`text-sm font-semibold leading-snug mb-1 ${isCurrent ? 'text-blue-700' : isLocked ? 'text-slate-500' : 'text-slate-700'}`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <PlayCircle size={10} /> {lesson.time || lesson.duration}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                Curriculum data not available for this dummy course.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
